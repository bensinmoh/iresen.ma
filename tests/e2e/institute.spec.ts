import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { pageSections } from '../../src/lib/page-sections'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: institute missions, full journey and responsive reading`, async ({ page }) => {
    await page.goto(pageHref('institute', locale))
    await page.evaluate(() => document.fonts.ready)
    const institute = page.locator('[data-institute-page]')
    await expect(institute.locator('h1')).toHaveCount(1)
    await expect(institute.locator('details')).toHaveCount(4)
    await expect(institute.locator('#institute-history ol > li')).toHaveCount(8)
    await expect(institute.locator('#institute-history aside')).toHaveCount(2)
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
      `${pageHref('search', locale)}?${new URLSearchParams({ q: 'MENALINKS', type: 'section' })}`,
    )
    await expect(
      page.locator(
        `.search-results a[href="${pageHref('institute', locale, 'institute-history')}"]`,
      ),
    ).toBeVisible()
  }
})
