import { test, expect } from './fixtures'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { pageSections } from '../../src/lib/page-sections'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: institute missions, full journey and responsive reading`, async ({ page }) => {
    await page.goto(pageHref('institute', locale))
    await page.evaluate(() => document.fonts.ready)
    const institute = page.locator('[data-institute-page]')
    await expect(institute.locator('h1')).toHaveCount(1)
    await expect(institute.locator('.hero-photo')).toHaveAttribute('data-photo', 'headquarters')
    await expect(institute.locator('.hero-founding .key-figure-label')).toHaveText(
      { fr: 'Depuis', en: 'Since', ar: 'منذ' }[locale],
    )
    const founding = await institute
      .locator('.hero-founding')
      .evaluate(
        (el) =>
          el.firstElementChild!.getBoundingClientRect().bottom <=
          el.lastElementChild!.getBoundingClientRect().top,
      )
    expect(founding).toBe(true)
    await expect(institute.locator('#mission blockquote')).toBeVisible()
    await expect(institute.locator('#mission blockquote p')).toContainText('«')
    await expect(institute.locator('#mission blockquote p')).toContainText('»')
    await expect(institute.locator('#mission')).toHaveCSS('background-color', 'rgb(18, 52, 90)')
    if (locale === 'fr')
      await expect(institute).not.toContainText('Son action contribue à éclairer les décisions')
    await expect(institute.locator('details')).toHaveCount(4)
    await expect(institute.locator('#institute-history ol > li')).toHaveCount(8)
    await expect(institute.locator('#institute-history aside')).toHaveCount(0)
    await expect(institute.locator('#institute-history li').first()).toContainText('2011')
    await expect(institute.locator('#institute-history li').last()).toContainText('2026')
    if (locale === 'fr')
      await expect(institute).not.toContainText('Autres réalisations importantes')
    for (const section of pageSections.institute)
      for (const { id } of [section, ...(section.children ?? [])])
        await expect(institute.locator(`#${id}`)).toHaveCount(1)
    const summary = institute.locator('#institute-research summary')
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(institute.locator('#institute-research details')).toHaveAttribute('open', '')
    await expect(institute.locator('#institute-research dt')).toHaveCount(5)
    await page.keyboard.press('Enter')
    await expect(institute.locator('#institute-research details')).not.toHaveAttribute('open')
    await expect(institute.locator('#more-resources a[href="#"]')).toHaveCount(2)
    await expect(institute.locator('#more-resources a[download]')).toHaveCount(0)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const rail = institute.locator('#institute-history-rail')
    await expect.poll(() => rail.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true)
    await institute.locator('button[aria-controls="institute-history-rail"]').last().click()
    await expect.poll(() => rail.evaluate((el) => Math.abs(el.scrollLeft))).toBeGreaterThan(10)
    await expect(institute.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
    await institute.locator('button[aria-controls="institute-history-rail"]').first().click()
    await expect.poll(() => rail.evaluate((el) => Math.abs(el.scrollLeft))).toBeLessThan(2)
    for (let milestone = 2; milestone <= 8; milestone++) {
      await institute.locator('button[aria-controls="institute-history-rail"]').last().click()
      await expect(institute.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        String(milestone),
      )
    }
    await expect(
      institute.locator('button[aria-controls="institute-history-rail"]').last(),
    ).toBeDisabled()
    for (let milestone = 7; milestone >= 1; milestone--) {
      await institute.locator('button[aria-controls="institute-history-rail"]').first().click()
      await expect(institute.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        String(milestone),
      )
    }
    await rail.focus()
    await page.keyboard.press(locale === 'ar' ? 'ArrowLeft' : 'ArrowRight')
    await expect.poll(() => rail.evaluate((el) => Math.abs(el.scrollLeft))).toBeGreaterThan(10)
    const cover = institute.locator('img[src*="fifteen-year-report-cover"]')
    await cover.scrollIntoViewIfNeeded()
    await expect
      .poll(() => cover.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true)
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
    const reportOrder = await institute.locator('#more-resources').evaluate((el) => {
      const text = el.querySelector('header')!.parentElement!.getBoundingClientRect()
      const image = el.querySelector('a img')!.getBoundingClientRect()
      const action = el.querySelector('.button')!.getBoundingClientRect()
      return text.bottom <= image.top && image.bottom <= action.top
    })
    expect(reportOrder).toBe(true)
    await institute.locator('#institute-cooperation summary').click()
    await expect(institute.locator('#institute-cooperation dl')).toBeVisible()
  })
}

test('institute works without JavaScript and has accessible expanded reading', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const native = await context.newPage()
  await native.goto(pageHref('institute', 'fr'))
  await expect(native.locator('#institute-history')).toContainText('2011')
  await expect(native.locator('#institute-history button').first()).toBeHidden()
  await expect
    .poll(() =>
      native.locator('#institute-history-rail').evaluate((el) => el.scrollWidth > el.clientWidth),
    )
    .toBe(true)
  await native.locator('#institute-studies summary').click()
  await expect(native.locator('#institute-studies dl')).toBeVisible()
  await context.close()
  await page.goto(pageHref('institute', 'fr'))
  await page
    .locator('[data-institute-page] details')
    .evaluateAll((items) => items.forEach((item) => item.setAttribute('open', '')))
  const results = await new AxeBuilder({ page }).include('[data-institute-page]').analyze()
  expect(
    results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
  ).toEqual([])
})

test('the institute history is discoverable in every public language', async ({ page }) => {
  for (const locale of ['fr', 'en', 'ar'] as const) {
    await page.goto(
      `${pageHref('search', locale)}?${new URLSearchParams({ q: '2011', type: 'section' })}`,
    )
    await expect(
      page.locator(
        `.search-results a[href="${pageHref('institute', locale, 'institute-history')}"]`,
      ),
    ).toBeVisible()
    await page.goto(
      `${pageHref('search', locale)}?${new URLSearchParams({ q: '15 ANS D’IMPACT', type: 'media' })}`,
    )
    await expect(
      page.locator(
        '.search-results a[href="/images/institute/fifteen-year-report-cover-cutout.webp"]:not([aria-hidden])',
      ),
    ).toBeVisible()
  }
})
