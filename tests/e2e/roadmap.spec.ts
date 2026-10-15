import { test, expect } from './fixtures'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { roadmapDomains } from '../../src/lib/roadmap'
import { pageSections } from '../../src/lib/page-sections'
import { readFileSync } from 'node:fs'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: roadmap chapters, native destinations and responsive reading`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('priorities', locale))
    await expect
      .poll(() =>
        page.locator('[data-roadmap-page] .page-hero').evaluate((hero) => {
          const copy = hero.querySelector('.container')!
          return Math.abs(
            hero.getBoundingClientRect().bottom -
              copy.getBoundingClientRect().bottom -
              parseFloat(getComputedStyle(hero).paddingBottom),
          )
        }),
      )
      .toBeLessThan(2)
    await expect(page.locator('main h1')).toHaveCount(1)
    const heroImages = page.locator('[data-roadmap-page] .page-hero img')
    await expect(heroImages).toHaveCount(1)
    await expect
      .poll(() =>
        heroImages.evaluateAll((images) =>
          images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
        ),
      )
      .toBe(true)
    await expect(page.locator('[data-roadmap-domain]')).toHaveCount(7)
    for (const { id } of pageSections.priorities)
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    for (const id of roadmapDomains) {
      const panel = page.locator(`#theme-${id}`)
      await expect(panel.locator('h2')).toBeVisible()
      await expect(panel.locator('details')).toHaveCount(4)
    }
    await expect(page.locator('[data-domain-link]')).toHaveCount(0)
    await expect(page.locator('#decision-resources')).toHaveText('')
    await page.locator('a[href="#theme-water"]').focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#theme-water$/)
    await expect
      .poll(async () => (await page.locator('#theme-water').boundingBox())!.y)
      .toBeLessThan(60)
    const firstAxis = page.locator('#theme-water details').first()
    await firstAxis.locator('summary').click()
    await expect(firstAxis).toHaveAttribute('open', '')
    await expect(firstAxis.locator('p')).toBeVisible()
    await expect(firstAxis.locator('summary svg')).toHaveCSS('transform', 'none')
    await expect(firstAxis.locator('summary svg')).toHaveCount(1)
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await page.evaluate(() => document.fonts.ready)
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
    await expect(page.locator('[data-immersive]')).toHaveCount(0)
  })
}

test('localized search discovers thematic sections and excludes generated technical images', async ({
  page,
}) => {
  for (const locale of ['fr', 'en', 'ar'] as const) {
    const title = JSON.parse(readFileSync(`src/messages/${locale}.json`, 'utf8')).Roadmap.chapters
      .mobility.title
    const query = new URLSearchParams({ q: title, type: 'section' })
    await page.goto(`${pageHref('search', locale)}?${query}`)
    await expect(
      page.locator(`.search-results a[href="${pageHref('priorities', locale, 'theme-mobility')}"]`),
    ).toBeVisible()
    query.set('type', 'media')
    await page.goto(`${pageHref('search', locale)}?${query}`)
    await expect(
      page.locator(
        '.search-results a[href="/images/roadmap/mobility-drawing.webp"]:not([aria-hidden])',
      ),
    ).toHaveCount(0)
  }
})

test('motion preference changes restore plain reading without hiding content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(pageHref('priorities', 'fr'))
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator('[data-immersive]')).toHaveCount(1)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('[data-immersive]')).toHaveCount(0)
  for (const id of roadmapDomains) {
    await page.locator(`#theme-${id}`).scrollIntoViewIfNeeded()
    await expect(page.locator(`#theme-${id} h2`)).toBeVisible()
    await expect(page.locator(`#theme-${id} figure`)).toHaveCSS('transform', 'none')
  }
  const violations = await new AxeBuilder({ page }).include('[data-roadmap-page]').analyze()
  expect(violations.violations).toEqual([])
})

test('server-rendered roadmap works with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto(pageHref('priorities', 'fr'))
  await page.locator('a[href="#theme-mobility"]').click()
  await expect(page).toHaveURL(/#theme-mobility$/)
  await expect(page.locator('#theme-mobility h2')).toBeVisible()
  await expect(page.locator('#theme-mobility details')).toHaveCount(4)
  await expect(page.locator('[data-immersive]')).toHaveCount(0)
  await expect(page.locator('#resources-collaboration a').first()).toHaveAttribute(
    'href',
    pageHref('workWithUs', 'fr'),
  )
  await context.close()
})
