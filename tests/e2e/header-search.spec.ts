import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { locales, type Locale } from '../../src/i18n/locales'
import { pageHref } from '../../src/lib/site'
import ar from '../../src/messages/ar.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import fr from '../../src/messages/fr.json' with { type: 'json' }

const catalogs = { ar, en, fr }
const queries = {
  fr: 'énergie solaire & hydrogène',
  en: 'green hydrogen & storage',
  ar: 'الهيدروجين الأخضر والطاقة',
}

function searchParts(page: Page) {
  const disclosure = page.locator('.header-search-disclosure')
  return {
    disclosure,
    trigger: disclosure.locator(':scope > summary'),
    form: disclosure.locator('.header-search-form'),
    input: disclosure.locator('input[type="search"][name="q"]'),
  }
}

async function expectContained(field: Locator) {
  await expect
    .poll(() =>
      field.evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        return bounds.left >= -1 && bounds.right <= window.innerWidth + 1 && bounds.width > 0
      }),
    )
    .toBe(true)
}

async function expectSubmittedQuery(page: Page, locale: Locale, checkQueryRestoration = true) {
  await expect(page).toHaveURL(
    (url) =>
      decodeURI(url.pathname) === pageHref('search', locale) &&
      url.searchParams.get('q') === queries[locale],
  )
  await expect(page.locator('.page-service-notice p')).toHaveText(
    catalogs[locale].States.searchUnavailable,
  )
  if (checkQueryRestoration) {
    await expect(searchParts(page).input).toHaveValue(queries[locale])
  }
}

for (const locale of locales) {
  test(`${locale}: hover expands search without moving the header or taking keyboard focus`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 900 })
    await page.goto(pageHref('institute', locale))
    await page.evaluate(() => document.fonts.ready)
    const { disclosure, trigger, form, input } = searchParts(page)
    const identity = page.locator('.site-header .site-identity')
    const language = page.locator('.site-header .locale-selector a').first()
    await language.focus()
    await trigger.hover()
    await expect(disclosure).not.toHaveAttribute('open', '')
    await expect(language).toBeFocused()
    await page.mouse.move(1, 899)
    await identity.focus()
    const controls = [
      identity,
      trigger,
      page.locator('.site-header .locale-selector'),
      page.locator('.header-contact'),
      page.locator('.desktop-navigation'),
    ]
    const before = await Promise.all(controls.map((control) => control.boundingBox()))
    await trigger.hover()
    await expect(disclosure).toHaveAttribute('open', '')
    await expect(input).toBeVisible()
    await expect(identity).toBeFocused()
    await expect
      .poll(async () => {
        const anchor = (await trigger.boundingBox())!
        const field = (await form.boundingBox())!
        return locale === 'ar'
          ? field.x + field.width - anchor.x - anchor.width
          : anchor.x - field.x
      })
      .toBeGreaterThan(100)
    await expectContained(form)
    for (const [index, control] of controls.entries()) {
      const after = (await control.boundingBox())!
      const original = before[index]!
      for (const dimension of ['x', 'y', 'width', 'height'] as const) {
        expect(Math.abs(after[dimension] - original[dimension])).toBeLessThanOrEqual(1)
      }
    }

    // Reaching the field must keep it open even after leaving the icon itself.
    await input.hover()
    await expect(disclosure).toHaveAttribute('open', '')
    await expect(identity).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(disclosure).not.toHaveAttribute('open', '')
    await expect(identity).toBeFocused()

    await page.mouse.move(1, 899)
    await trigger.hover()
    await expect(disclosure).toHaveAttribute('open', '')
    await page.locator('.hero-description').hover()
    await expect(disclosure).not.toHaveAttribute('open', '')
  })

  test(`${locale}: keyboard search restores focus and submits the query to the localized existing page`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('institute', locale))
    const { disclosure, trigger, form, input } = searchParts(page)
    await expect(trigger).toHaveAccessibleName(catalogs[locale].Pages.search)
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(disclosure).toHaveAttribute('open', '')
    await expect(input).toBeFocused()
    await expect(input).toHaveAccessibleName(catalogs[locale].Pages.search)
    await expect(form).toHaveAttribute('method', /get/i)
    await expect(form).toHaveAttribute('action', pageHref('search', locale))
    await input.fill(queries[locale])
    await page.keyboard.press('Escape')
    await expect(disclosure).not.toHaveAttribute('open', '')
    await expect(trigger).toBeFocused()

    await page.keyboard.press('Space')
    await expect(input).toBeFocused()
    await input.fill(queries[locale])
    await page.keyboard.press('Enter')
    await expectSubmittedQuery(page, locale)
  })
}

test('focused search survives navigation hover and restores its trigger across the compact breakpoint', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 900 })
  await page.goto(pageHref('institute', 'ar'))
  const { disclosure, trigger, form, input } = searchParts(page)
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(input).toBeFocused()
  const group = page.locator('.desktop-navigation-group').first()
  await group.locator(':scope > summary').hover()
  await expect(disclosure).toHaveAttribute('open', '')
  await expect(input).toBeFocused()
  await expect(group).not.toHaveAttribute('open', '')

  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(disclosure).toHaveAttribute('open', '')
  await expect(input).toBeFocused()
  await expectContained(form)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(disclosure).not.toHaveAttribute('open', '')
  await expect(trigger).toBeVisible()
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(input).toBeFocused()
  await expectContained(form)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )

  await page.locator('#main-content').focus()
  await expect(disclosure).not.toHaveAttribute('open', '')
  await expect(page.locator('#main-content')).toBeFocused()
})

test('touch users can dismiss and submit Arabic search without overflowing a narrow header', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 320, height: 844 },
  })
  try {
    const page = await context.newPage()
    await page.goto(pageHref('institute', 'ar'))
    const { disclosure, trigger, form, input } = searchParts(page)
    await trigger.tap()
    await expect(disclosure).toHaveAttribute('open', '')
    await expect(input).toBeFocused()
    await expectContained(form)
    await input.fill(queries.ar)
    await page.locator('.hero-description').tap()
    await expect(disclosure).not.toHaveAttribute('open', '')
    await trigger.tap()
    await expect(input).toBeFocused()
    await input.fill(queries.ar)
    // The icon keeps its submit role once the expanded field contains a query.
    await trigger.tap()
    await expectSubmittedQuery(page, 'ar')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  } finally {
    await context.close()
  }
})

test('search remains usable with reduced motion and exposes an accessible open header', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(pageHref('institute', 'fr'))
  const { disclosure, trigger, form, input } = searchParts(page)
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(input).toBeFocused()
  await expectContained(form)
  const durations = await form.evaluate((element) => {
    const style = getComputedStyle(element)
    return [...style.transitionDuration.split(','), ...style.animationDuration.split(',')].map(
      (duration) => parseFloat(duration),
    )
  })
  expect(Math.max(...durations)).toBeLessThanOrEqual(0.02)
  const accessibility = await new AxeBuilder({ page })
    .include('.site-header')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(accessibility.violations).toEqual([])
  await page.keyboard.press('Escape')
  await expect(disclosure).not.toHaveAttribute('open', '')
  await expect(trigger).toBeFocused()
})

test('without JavaScript native search disclosures submit in desktop French and mobile Arabic', async ({
  browser,
  baseURL,
}) => {
  for (const { locale, width } of [
    { locale: 'fr', width: 1440 },
    { locale: 'ar', width: 390 },
  ] as const) {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width, height: 900 },
    })
    try {
      const page = await context.newPage()
      await page.goto(pageHref('institute', locale))
      const { disclosure, trigger, form, input } = searchParts(page)
      await trigger.focus()
      await page.keyboard.press('Enter')
      await expect(disclosure).toHaveAttribute('open', '')
      await expect(input).toBeVisible()
      await expectContained(form)
      await input.fill(queries[locale])
      await page.keyboard.press('Enter')
      await expectSubmittedQuery(page, locale, false)
    } finally {
      await context.close()
    }
  }
})
