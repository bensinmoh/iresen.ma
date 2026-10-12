import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pageHref } from '../../src/lib/site'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

const catalogs = { fr, en, ar }
test.use({ storageState: { cookies: [], origins: [] } })

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
    await page.reload()
    await expect(banner).toHaveCount(0)
    await expect(page.locator('.contact-map iframe')).toHaveCount(0)
    await page.locator('.footer-utilities').getByRole('button', { name: t.manage }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('checkbox')).not.toBeChecked()
    await page.keyboard.press('Escape')
    await expect(
      page.locator('.footer-utilities').getByRole('button', { name: t.manage }),
    ).toBeFocused()
    await page.locator('.contact-map').getByRole('button').click()
    await dialog.getByRole('checkbox').check()
    await dialog.getByRole('button', { name: t.save }).click()
    await page.locator('.contact-map').scrollIntoViewIfNeeded()
    await expect(page.locator('.contact-map iframe')).toHaveCount(1)
    await expect.poll(() => requests.length).toBe(1)
    await page.reload()
    await expect(banner).toHaveCount(0)
    await expect(page.locator('.contact-map iframe')).toHaveCount(1)
    await page.locator('.footer-utilities').getByRole('button', { name: t.manage }).click()
    await expect(dialog.getByRole('checkbox')).toBeChecked()
    await dialog.getByRole('button', { name: t.reject }).click()
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
  await page
    .locator('.footer-utilities')
    .getByRole('button', { name: fr.CookieConsent.manage })
    .click()
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
