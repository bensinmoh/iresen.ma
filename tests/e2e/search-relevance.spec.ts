import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import { normalizeSearchText } from '../../src/lib/search/text'
import { pageHref } from '../../src/lib/site'

function searchUrl(locale: 'fr' | 'en' | 'ar', parameters: Record<string, string>) {
  return `${pageHref('search', locale)}?${new URLSearchParams(parameters)}`
}

for (const { locale, original, expected } of [
  { locale: 'fr', original: 'résulats', expected: 'resultats' },
  { locale: 'en', original: 'platfroms', expected: 'platforms' },
  { locale: 'ar', original: 'الاولويتا', expected: 'الاولويات' },
] as const) {
  test(`${locale}: spelling remains an explicit choice and retains filters when accepted by keyboard`, async ({
    page,
    request,
  }) => {
    await page.goto(searchUrl(locale, { q: original, type: 'page', sort: 'newest', page: '2' }))
    const queryField = page.locator('.search-query-form input[name="q"]')
    await expect(queryField).toHaveValue(original)
    await expect(page).toHaveURL((url) => url.searchParams.get('q') === original)
    const correction = page.locator('.search-correction [data-search-correction]')
    await expect(correction).toBeVisible()
    const href = (await correction.getAttribute('href'))!
    const parameters = new URL(href, page.url()).searchParams
    expect(normalizeSearchText(parameters.get('q') ?? '')).toBe(expected)
    expect(parameters.get('type')).toBe('page')
    expect(parameters.get('sort')).toBe('newest')
    expect(parameters.has('page')).toBe(false)
    await expect(page.locator('[data-search-match-kind="typo"]').first()).toBeVisible()
    await expect(page.locator('.search-results mark').first()).toBeVisible()

    const response = await request.get(
      `/api/search?${new URLSearchParams({ locale, q: original })}`,
    )
    expect(response.status()).toBe(200)
    const result = await response.json()
    expect(result.query).toBe(original)
    expect(normalizeSearchText(result.suggestedQuery)).toBe(expected)
    expect(result.items.some((item: { matchKind?: string }) => item.matchKind === 'typo')).toBe(
      true,
    )

    await correction.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new URL(href, page.url()).href)
    await expect(queryField).toHaveValue(parameters.get('q')!)
    await expect(page.locator('.search-correction')).toHaveCount(0)
    await expect(page.locator('.search-results article').first()).toBeVisible()
  })
}

for (const { locale, query } of [
  { locale: 'fr', query: 'infrastructures' },
  { locale: 'en', query: 'infrastructure' },
  { locale: 'ar', query: 'البنية التحتية' },
] as const) {
  test(`${locale}: related infrastructure results explain their match and open the public platform page`, async ({
    page,
  }) => {
    await page.goto(searchUrl(locale, { q: query, type: 'page' }))
    await expect(page.locator('.search-query-form input[name="q"]')).toHaveValue(query)
    const destination = pageHref('platforms', locale)
    const link = page.locator(`.search-results h2 a[href="${destination}"]`)
    await expect(link).toBeVisible()
    const result = page
      .locator('.search-results article')
      .filter({ has: page.locator(`h2 a[href="${destination}"]`) })
    await expect(result.locator('[data-search-match-kind="related"]')).toBeVisible()
    await expect(result.locator('mark').first()).toBeVisible()
    await link.click()
    await expect(page).toHaveURL((url) => decodeURI(url.pathname) === destination)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
}

test('the user example Insrastructure suggests the public infrastructure spelling', async ({
  page,
}) => {
  const original = 'Insrastructure'
  await page.goto(searchUrl('fr', { q: original }))
  await expect(page.locator('.search-query-form input[name="q"]')).toHaveValue(original)
  const correction = page.locator('.search-correction [data-search-correction]')
  await expect(correction).toBeVisible()
  const corrected = new URL((await correction.getAttribute('href'))!, page.url()).searchParams.get(
    'q',
  )!
  expect(normalizeSearchText(corrected)).toBe('infrastructure')
  await expect(
    page.locator('.search-results [data-search-match-kind="typo"]').first(),
  ).toBeVisible()
  // Public content can fill the first page with closer matches before related results.
  await page.locator('a[href="' + searchUrl('fr', { q: original, type: 'page' }) + '"]').click()
  await expect(page.locator('.search-query-form input[name="q"]')).toHaveValue(original)
  const platform = page.locator('.search-results article').filter({
    has: page.locator(`h2 a[href="${pageHref('platforms', 'fr')}"]`),
  })
  await expect(platform.locator('[data-search-match-kind="related"]')).toBeVisible()
})

for (const width of [1440, 390]) {
  test(`header correction comes first in keyboard suggestions and preserves the typed query until accepted at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(searchUrl('en', { q: 'research', type: 'page', sort: 'newest', page: '2' }))
    const header = page.getByRole('banner')
    const menu = header.locator('.site-menu')
    if (width === 390) {
      await menu.locator(':scope > summary').focus()
      await page.keyboard.press('Enter')
      await expect(menu).toHaveAttribute('open', '')
    }
    const disclosure = header.locator('.header-search-disclosure')
    const summary = disclosure.locator(':scope > summary')
    await summary.focus()
    await summary.press('Enter')
    const input = disclosure.locator('input[name="q"]')
    await expect(input).toBeFocused()
    await input.fill('platfroms')
    const correction = disclosure.locator('.header-search-correction [data-search-correction]')
    await expect(correction).toBeVisible()
    await expect(input).toHaveValue('platfroms')
    await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'research')
    const href = (await correction.getAttribute('href'))!
    const parameters = new URL(href, page.url()).searchParams
    expect(normalizeSearchText(parameters.get('q')!)).toBe('platforms')
    expect(parameters.get('type')).toBe('page')
    expect(parameters.get('sort')).toBe('newest')
    expect(parameters.has('page')).toBe(false)
    if (width === 390) {
      await input.press('Tab')
      await expect(correction).toBeFocused()
      await correction.press('Shift+Tab')
      await expect(input).toBeFocused()
    }
    await input.press('ArrowDown')
    await expect(correction).toBeFocused()
    await correction.press('ArrowUp')
    await expect(input).toBeFocused()
    await input.press('ArrowDown')
    await correction.press('Enter')
    await expect(page).toHaveURL(new URL(href, page.url()).href)
    const resultsInput = page.locator('.search-query-form input[name="q"]')
    await expect(resultsInput).toHaveValue(parameters.get('q')!)
    await expect(resultsInput).toBeVisible()
    if (width === 390) {
      await expect(menu).not.toHaveAttribute('open', '')
      await expect(page.locator('main#main-content')).toHaveJSProperty('inert', false)
      await resultsInput.focus()
      await expect(resultsInput).toBeFocused()
    }
  })
}

test('resizing a focused mobile correction to the compact header closes the menu and keeps search usable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto(searchUrl('en', { q: 'research', type: 'page', sort: 'newest', page: '2' }))
  const header = page.getByRole('banner')
  const menu = header.locator('.site-menu')
  await menu.locator(':scope > summary').focus()
  await page.keyboard.press('Enter')
  await expect(menu).toHaveAttribute('open', '')
  const disclosure = header.locator('.header-search-disclosure')
  await disclosure.locator(':scope > summary').focus()
  await page.keyboard.press('Enter')
  const input = disclosure.locator('input[name="q"]')
  await expect(input).toBeFocused()
  await input.fill('platfroms')
  const correction = disclosure.locator('.header-search-correction [data-search-correction]')
  await expect(correction).toBeVisible()
  const href = (await correction.getAttribute('href'))!
  await input.press('ArrowDown')
  await expect(correction).toBeFocused()

  await page.setViewportSize({ width: 700, height: 900 })
  await expect(menu).not.toHaveAttribute('open', '')
  await expect(disclosure).toHaveAttribute('open', '')
  await expect(correction).toBeVisible()
  await expect(correction).toBeFocused()
  await correction.press('Enter')
  await expect(page).toHaveURL(new URL(href, page.url()).href)
  await expect(page.locator('main#main-content')).toHaveJSProperty('inert', false)
  const resultsInput = page.locator('.search-query-form input[name="q"]')
  await expect(resultsInput).toHaveValue(new URL(href, page.url()).searchParams.get('q')!)
  await resultsInput.focus()
  await expect(resultsInput).toBeFocused()
})

test('Arabic correction links work without JavaScript and remain accessible at 200% text', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 320, height: 900 },
  })
  try {
    const page = await context.newPage()
    await page.goto(searchUrl('ar', { q: 'الاولويتا', type: 'page', sort: 'newest', page: '2' }))
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = '200%'
      await document.fonts.ready
    })
    const correction = page.locator('.search-correction [data-search-correction]')
    await expect(correction).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321)
    const href = (await correction.getAttribute('href'))!
    await correction.click()
    await expect(page).toHaveURL(new URL(href, baseURL).href)
    expect(normalizeSearchText(new URL(page.url()).searchParams.get('q')!)).toBe('الاولويات')
    await expect(page.locator('.search-correction')).toHaveCount(0)
    await expect(page.locator('.search-results article').first()).toBeVisible()
  } finally {
    await context.close()
  }

  const accessibilityContext = await browser.newContext({
    baseURL,
    viewport: { width: 320, height: 900 },
  })
  try {
    const page = await accessibilityContext.newPage()
    await page.goto(searchUrl('ar', { q: 'الاولويتا', type: 'page', sort: 'newest', page: '2' }))
    await expect(page.locator('.search-correction [data-search-correction]')).toBeVisible()
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = '200%'
      await document.fonts.ready
    })
    const accessibility = await new AxeBuilder({ page })
      .include('.search-page')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(accessibility.violations).toEqual([])
  } finally {
    await accessibilityContext.close()
  }
})

test('valid public words, short terms and acronyms stay unchanged without a correction prompt', async ({
  page,
  request,
}) => {
  for (const query of ['PV', 'IRESEN', 'RDI', 'lab', 'research']) {
    const response = await request.get(
      `/api/search?${new URLSearchParams({ locale: 'en', q: query })}`,
    )
    expect(response.status()).toBe(200)
    const result = await response.json()
    expect(result.query).toBe(query)
    expect(result.suggestedQuery).toBeUndefined()
  }
  await page.goto(searchUrl('fr', { q: 'PV' }))
  await expect(page.locator('.search-query-form input[name="q"]')).toHaveValue('PV')
  await expect(page.locator('.search-correction')).toHaveCount(0)
  await expect(page.locator('[data-search-match-kind="related"]').first()).toBeVisible()
})
