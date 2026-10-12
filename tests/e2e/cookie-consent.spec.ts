import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from './fixtures'
import { pageHref } from '../../src/lib/site'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

const catalogs = { fr, en, ar }
test.use({ storageState: { cookies: [], origins: [] } })

async function openFooterPreferences(page: Page, locale: 'fr' | 'en' | 'ar') {
  const copy = catalogs[locale]
  await page
    .locator('.footer-utilities')
    .getByRole('link', { name: copy.Pages.cookies, exact: true })
    .click()
  await page
    .locator('#manage-preferences')
    .getByRole('button', { name: copy.CookieConsent.manage })
    .click()
}

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: first visit, refusal, granular consent, persistence and withdrawal`, async ({
    page,
    context,
  }) => {
    const t = catalogs[locale].CookieConsent
    const requests: string[] = []
    await page.route('https://www.google.com/**', async (route) => {
      requests.push(route.request().url())
      await route.fulfill({ contentType: 'text/html', body: '<p>Local map</p>' })
    })
    await page.goto(pageHref('contact', locale))
    const banner = page.locator('[data-cookie-banner]')
    await expect(banner).toBeVisible()
    await page.locator('.contact-map').scrollIntoViewIfNeeded()
    await expect(page.locator('.contact-map iframe')).toHaveCount(0)
    expect(requests).toEqual([])
    await banner.getByRole('button', { name: t.reject }).click()
    await expect(banner).toHaveCount(0)
    await expect(page.locator('#main-content')).toBeFocused()
    await page.reload()
    await expect(banner).toHaveCount(0)
    await expect(page.locator('.contact-map iframe')).toHaveCount(0)
    await openFooterPreferences(page, locale)
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('checkbox')).not.toBeChecked()
    await page.keyboard.press('Escape')
    await expect(
      page.locator('#manage-preferences').getByRole('button', { name: t.manage }),
    ).toBeFocused()
    await page.goto(pageHref('contact', locale))
    await page.locator('.contact-map').getByRole('button').click()
    await dialog.getByRole('checkbox').check()
    await dialog.getByRole('button', { name: t.save }).click()
    await page.locator('.contact-map').scrollIntoViewIfNeeded()
    await expect(page.locator('.contact-map iframe')).toHaveCount(1)
    await expect.poll(() => requests.length).toBe(1)
    await page.reload()
    await expect(banner).toHaveCount(0)
    await expect(page.locator('.contact-map iframe')).toHaveCount(1)
    await openFooterPreferences(page, locale)
    await expect(dialog.getByRole('checkbox')).toBeChecked()
    await dialog.getByRole('button', { name: t.reject }).click()
    await page.goto(pageHref('contact', locale))
    await expect(page.locator('.contact-map iframe')).toHaveCount(0)
    const cookies = await context.cookies()
    const stored = cookies.find((cookie) => cookie.name === 'iresen_consent')!
    expect(JSON.parse(decodeURIComponent(stored.value)).external).toBe(false)
    expect(stored.sameSite).toBe('Lax')
    expect(stored.expires - Date.now() / 1000).toBeGreaterThan(179 * 86400)
  })

  test(`${locale}: mobile and desktop consent accessibility and reflow`, async ({ page }) => {
    const t = catalogs[locale].CookieConsent
    await page.goto(pageHref('cookies', locale))
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(page.locator('[data-cookie-banner]')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      await page.screenshot({ path: `/tmp/cookie-banner-${locale}-${width}.png` })
      await page.locator('[data-cookie-banner]').getByRole('button', { name: t.customize }).click()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      const bounds = (await dialog.boundingBox())!
      expect(bounds.x + bounds.width / 2).toBeCloseTo(width / 2, 0)
      expect(bounds.y + bounds.height / 2).toBeCloseTo(450, 0)
      await expect(dialog.getByRole('heading', { name: t.necessary })).toBeVisible()
      await expect(dialog.getByRole('heading', { name: t.optional })).toBeVisible()
      const results = await new AxeBuilder({ page }).include('.cookie-dialog').analyze()
      expect(results.violations).toEqual([])
      await page.screenshot({ path: `/tmp/cookie-${locale}-${width}.png` })
      await page.keyboard.press('Escape')
    }
    const results = await new AxeBuilder({ page }).include('[data-cookie-banner]').analyze()
    expect(results.violations).toEqual([])
  })
}

test('expired, malformed and outdated consent cannot load the map', async ({ page, context }) => {
  for (const value of [
    'invalid',
    JSON.stringify({ version: 0, external: true, expires: Date.now() + 10000 }),
    JSON.stringify({ version: 1, external: true, expires: Date.now() - 1 }),
  ]) {
    await context.addCookies([
      { name: 'iresen_consent', value: encodeURIComponent(value), url: 'http://127.0.0.1:3000' },
    ])
    await page.goto(pageHref('contact', 'fr'))
    await expect(page.locator('[data-cookie-banner]')).toBeVisible()
    await expect(page.locator('.contact-map iframe')).toHaveCount(0)
  }
})

test('accept all persists between locales and withdrawal propagates to an open tab', async ({
  page,
  context,
}) => {
  await context.route('https://www.google.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<p>Local map</p>' }),
  )
  await page.goto(pageHref('contact', 'fr'))
  await page
    .locator('[data-cookie-banner]')
    .getByRole('button', { name: fr.CookieConsent.accept })
    .click()
  const second = await context.newPage()
  await second.goto(pageHref('contact', 'ar'))
  await expect(second.locator('[data-cookie-banner]')).toHaveCount(0)
  await expect(second.locator('.contact-map iframe')).toHaveCount(1)
  await openFooterPreferences(page, 'fr')
  await page.getByRole('dialog').getByRole('button', { name: fr.CookieConsent.reject }).click()
  await expect(second.locator('.contact-map iframe')).toHaveCount(0)
})

test('blocked cookie storage fails closed and explains the failure', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(document, 'cookie', { get: () => '', set: () => {} }),
  )
  await page.goto(pageHref('contact', 'fr'))
  await page
    .locator('[data-cookie-banner]')
    .getByRole('button', { name: fr.CookieConsent.accept })
    .click()
  await expect(page.locator('[data-cookie-banner]').getByRole('alert')).toHaveText(
    fr.CookieConsent.storageError,
  )
  await expect(page.locator('.contact-map iframe')).toHaveCount(0)
})

test('200% text keeps preferences readable and controls reachable in Arabic', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(pageHref('cookies', 'ar'))
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%'
  })
  await page
    .locator('[data-cookie-banner]')
    .getByRole('button', { name: ar.CookieConsent.customize })
    .click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: ar.CookieConsent.save }).scrollIntoViewIfNeeded()
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
  await dialog.getByRole('button', { name: ar.CookieConsent.save }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.locator('[data-cookie-banner]')).toHaveCount(0)
})

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: necessary-only is a one-click choice and acceptance uses IRESEN blue`, async ({
    page,
    context,
  }) => {
    const t = catalogs[locale].CookieConsent
    await page.goto(pageHref('contact', locale))
    const banner = page.locator('[data-cookie-banner]')
    const accept = banner.getByRole('button', { name: t.accept, exact: true })
    await expect(accept).toHaveCSS('background-color', 'rgb(41, 107, 180)')
    await expect(banner.getByRole('button', { name: t.reject })).toHaveCSS(
      'background-color',
      'rgb(244, 247, 248)',
    )
    await expect(banner.getByRole('button', { name: t.reject })).toBeEnabled()
    await expect(banner.locator('button').first()).toHaveText(t.accept)
    await banner.getByRole('button', { name: t.necessaryOnly }).click()
    await expect(banner).toHaveCount(0)
    await expect(page.locator('#main-content')).toBeFocused()
    await expect(page.locator('.contact-map iframe')).toHaveCount(0)
    const saved = (await context.cookies()).find((cookie) => cookie.name === 'iresen_consent')!
    expect(JSON.parse(decodeURIComponent(saved.value)).external).toBe(false)
    await page.reload()
    await expect(banner).toHaveCount(0)
    await openFooterPreferences(page, locale)
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('checkbox')).not.toBeChecked()
    await dialog.getByRole('button', { name: t.necessaryOnly }).click()
    await expect(dialog).not.toBeVisible()
  })
}

test('withdrawing permission disables an existing map even when cookie writes fail', async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: 'iresen_consent',
      value: encodeURIComponent(
        JSON.stringify({ version: 1, external: true, expires: Date.now() + 86400 * 1000 }),
      ),
      url: 'http://127.0.0.1:3000',
    },
  ])
  await page.addInitScript(() => {
    const getter = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!.get!
    Object.defineProperty(document, 'cookie', { get: () => getter.call(document), set: () => {} })
  })
  await context.route('https://www.google.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<p>Local map</p>' }),
  )
  const mapPage = await context.newPage()
  await mapPage.goto(pageHref('contact', 'fr'))
  await expect(mapPage.locator('.contact-map iframe')).toHaveCount(1)
  await page.goto(pageHref('contact', 'fr'))
  await openFooterPreferences(page, 'fr')
  await page
    .getByRole('dialog')
    .getByRole('button', { name: fr.CookieConsent.necessaryOnly })
    .click()
  await expect(page.getByRole('dialog').getByRole('alert')).toHaveText(
    fr.CookieConsent.storageError,
  )
  await expect(mapPage.locator('.contact-map iframe')).toHaveCount(0)
})

test('settings gear reveals its label on hover and keyboard focus, with an accessible close cross', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 900 })
  await page.goto(pageHref('cookies', 'fr'))
  const banner = page.locator('[data-cookie-banner]')
  const customize = banner.getByRole('button', { name: fr.CookieConsent.customize })
  const label = customize.locator('.cookie-customize-label')
  await expect(customize.locator('svg')).toHaveCount(1)
  await expect(label).toHaveCSS('opacity', '0')
  const initial = (await customize.boundingBox())!.width
  await customize.hover()
  await expect(label).toHaveCSS('opacity', '1')
  await expect.poll(async () => (await customize.boundingBox())!.width).toBeGreaterThan(initial)
  await page.mouse.move(0, 0)
  await page.keyboard.press('Tab')
  await customize.focus()
  await expect(label).toHaveCSS('opacity', '1')
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  const close = dialog.getByRole('button', { name: fr.CookieConsent.close })
  await expect(close.locator('svg')).toHaveCount(1)
  await expect(close).toHaveText('')
  await close.click()
  await expect(dialog).not.toBeVisible()
  await expect(customize).toBeFocused()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const element of [label, customize]) {
    const durations = await element.evaluate((node) =>
      getComputedStyle(node)
        .transitionDuration.split(',')
        .map((duration) => parseFloat(duration) / (duration.trim().endsWith('ms') ? 1000 : 1)),
    )
    expect(Math.max(...durations)).toBeLessThanOrEqual(0.00001)
  }
})

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: desktop dialog has one action row and compact screens have ordered pairs`, async ({
    page,
  }) => {
    const t = catalogs[locale].CookieConsent
    await page.goto(pageHref('cookies', locale))
    for (const width of [320, 390, 768, 1024, 1180, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.mouse.move(0, 0)
      await page.locator('#main-content').focus()
      const banner = page.locator('[data-cookie-banner]')
      const bannerButtons = banner.locator('.cookie-actions button')
      await expect(bannerButtons.nth(0)).toHaveAccessibleName(t.accept)
      await expect(bannerButtons.nth(1)).toHaveAccessibleName(t.reject)
      await expect(bannerButtons.nth(2)).toHaveAccessibleName(t.necessaryOnly)
      const heights = await bannerButtons.evaluateAll((buttons) =>
        buttons.map((button) => button.getBoundingClientRect().height),
      )
      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1)
      if (width <= 1440) {
        const boxes = await bannerButtons.evaluateAll((buttons) =>
          buttons.map((button) => button.getBoundingClientRect().y),
        )
        expect(boxes[0]).toBeCloseTo(boxes[1], 0)
        expect(boxes[2]).toBeCloseTo(boxes[3], 0)
        expect(boxes[2]).toBeGreaterThan(boxes[0])
        const visibleLabel = banner.locator('.cookie-fit-label > span').first()
        const selected = await visibleLabel.textContent()
        expect([t.necessaryOnly, t.necessaryOnlyShort, t.necessaryOnlyTiny]).toContain(selected)
        await expect
          .poll(() =>
            visibleLabel.evaluate(
              (span) =>
                span.getBoundingClientRect().height <=
                parseFloat(getComputedStyle(span).lineHeight) + 1,
            ),
          )
          .toBe(true)
        if (width >= 768 && width <= 1024) await expect(visibleLabel).toHaveText(t.necessaryOnly)
      }
      if (width > 1024 && width <= 1440) {
        const copy = (await banner.locator('.cookie-copy').boundingBox())!
        const actions = (await banner.locator('.cookie-actions').boundingBox())!
        if (locale === 'ar') expect(actions.x + actions.width).toBeLessThan(copy.x)
        else expect(actions.x).toBeGreaterThan(copy.x + copy.width)
      }
      if (width === 1180 || width === 390)
        await page.screenshot({ path: `/tmp/cookie-banner-final-${locale}-${width}.png` })
      await banner.getByRole('button', { name: t.customize }).click()
      const dialog = page.getByRole('dialog')
      const dialogHeights = await dialog
        .locator('.cookie-actions button')
        .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height))
      expect(Math.max(...dialogHeights) - Math.min(...dialogHeights)).toBeLessThan(1)
      const tops = await dialog
        .locator('.cookie-actions button')
        .evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().y))
      if (width > 1024) expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1)
      else {
        expect(tops[0]).toBeCloseTo(tops[1], 0)
        expect(tops[2]).toBeCloseTo(tops[3], 0)
        expect(tops[2]).toBeGreaterThan(tops[0])
      }
      expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
        true,
      )
      await page.screenshot({ path: `/tmp/cookie-final-${locale}-${width}.png` })
      await page.keyboard.press('Escape')
    }
  })
}

test('first-visit consent copy is present in server HTML, without shared visitor state', async ({
  playwright,
  baseURL,
}) => {
  const request = await playwright.request.newContext({ baseURL })
  try {
    const first = await request.get('/fr')
    expect(await first.text()).toContain('data-cookie-banner')
    const decision = encodeURIComponent(
      JSON.stringify({ version: 1, external: false, expires: Date.now() + 86400000 }),
    )
    const returning = await request.get('/fr', {
      headers: { Cookie: `iresen_consent=${decision}` },
    })
    expect(await returning.text()).not.toContain('data-cookie-banner')
    const nextVisitor = await request.get('/fr')
    expect(await nextVisitor.text()).toContain('data-cookie-banner')
  } finally {
    await request.dispose()
  }
})
