import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pageHref } from '../../src/lib/site'
import { demoProjects } from '../../src/lib/projects'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: project catalogue filters and pagination`, async ({ page }) => {
    await page.goto(pageHref('projects', locale))
    await expect(page.locator('[data-projects-page] article')).toHaveCount(6)
    await expect(page.locator('#understanding-results')).toContainText('24')
    await page.locator('#project-catalogue nav a[aria-current="page"] + a').click()
    await expect(page.locator('#project-demo-007')).toBeVisible()
    await page.locator('select[name="domain"]').selectOption('hydrogen')
    await expect(page.locator('[data-projects-page] article')).toHaveCount(3)
    await expect(page.locator('#project-catalogue nav a[aria-current="page"]')).toHaveCount(0)
    await page.goto(pageHref('projects', locale))
    await page.locator('#find-project input[name="q"]').fill('CELL-PV')
    await page.locator('#find-project button[type="submit"]').click()
    await expect(page.locator('[data-projects-page] article')).toHaveCount(1)
    await expect(page.locator('#project-demo-005')).toContainText(demoProjects[4].title[locale])
    await page.locator('#find-project input[name="q"]').fill('no-such-project-xyz')
    await page.locator('#find-project button[type="submit"]').click()
    await expect(page.locator('[data-projects-page] article')).toHaveCount(0)
    await page.locator('#find-project .container > div a').click()
    await expect(page.locator('[data-projects-page] article')).toHaveCount(6)
    const axe = await new AxeBuilder({ page }).include('[data-projects-page]').analyze()
    expect(axe.violations).toEqual([])
  })
}

test('project form and pagination work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('projects', 'fr'))
  await page.locator('select[name="status"]').selectOption('completed')
  await page.locator('#find-project button[type="submit"]').click()
  await expect(page.locator('[data-projects-page] article')).toHaveCount(6)
  await expect(page.locator('select[name="status"]')).toHaveValue('completed')
  await page.locator('nav a[aria-current="page"] + a').click()
  await expect(page.locator('[data-projects-page] article')).toHaveCount(2)
  await context.close()
})

test('project layout contains FR/EN/AR at representative widths and enlarged text', async ({
  page,
}) => {
  for (const locale of ['fr', 'en', 'ar'] as const) {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(pageHref('projects', locale))
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      for (const image of await page.locator('[data-projects-page] img').all()) {
        await image.scrollIntoViewIfNeeded()
        await expect(image).toHaveJSProperty('complete', true)
        expect(await image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
      }
      if ([390, 1440].includes(width))
        await page.screenshot({
          path: `.local/projects-review/${locale}-${width}.png`,
          fullPage: true,
        })
    }
  }
  await page.setViewportSize({ width: 390, height: 900 })
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
