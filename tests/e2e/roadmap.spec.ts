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
    await page.locator('a[href="#theme-water"]').first().focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#theme-water$/)
    await expect
      .poll(async () => Math.abs((await page.locator('#theme-water').boundingBox())!.y))
      .toBeLessThan(2)
    const firstAxis = page.locator('#theme-water details').first()
    await firstAxis.locator('summary').click()
    await expect(firstAxis).toHaveAttribute('open', '')
    await expect(firstAxis.locator('p')).toBeVisible()
    await expect(firstAxis.locator('summary svg')).toHaveCSS('transform', 'none')
    await expect(firstAxis.locator('summary svg')).toHaveCount(1)
    const secondAxis = page.locator('#theme-water details').nth(1)
    await secondAxis.locator('summary').click()
    await expect(secondAxis).toHaveAttribute('open', '')
    await expect(firstAxis).not.toHaveAttribute('open', '')
    await expect(page.locator('#theme-water details[open]')).toHaveCount(1)
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

test('chapter covers preserve native scroll, expanded reading and reverse keyboard access', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(pageHref('priorities', 'fr', 'theme-renewables'))
  await expect(page.locator('[data-immersive]')).toHaveCount(1)
  const first = page.locator('#theme-renewables')
  const second = page.locator('#theme-hydrogen')
  await page.evaluate(() => document.fonts.ready)
  await expect.poll(async () => Math.abs((await first.boundingBox())!.y)).toBeLessThan(2)
  await page.evaluate(() => window.scrollBy(0, 400))
  await expect.poll(async () => Math.abs((await first.boundingBox())!.y)).toBeLessThan(2)
  const secondBounds = (await second.boundingBox())!
  expect(secondBounds.y).toBeGreaterThan(0)
  expect(secondBounds.y).toBeLessThan(900)
  expect(
    await page.evaluate(() => {
      const second = document.querySelector('#theme-hydrogen')!
      const bounds = second.getBoundingClientRect()
      return second.contains(document.elementFromPoint(20, bounds.top + 20))
    }),
  ).toBe(true)

  await expect
    .poll(() =>
      second.locator('figure').evaluate((art) => parseFloat(getComputedStyle(art).opacity)),
    )
    .toBeGreaterThan(0)
  expect(
    await second.locator('figure').evaluate((art) => parseFloat(getComputedStyle(art).opacity)),
  ).toBeLessThan(1)

  await page.setViewportSize({ width: 1440, height: 620 })
  await first.locator('a').focus()
  await first.locator('summary').first().focus()
  await page.keyboard.press('Enter')
  await expect(first.locator('details').first()).toHaveAttribute('open', '')
  await expect
    .poll(() =>
      first.evaluate((panel) => {
        return Math.abs(
          parseFloat(getComputedStyle(panel).top) - Math.min(0, innerHeight - panel.clientHeight),
        )
      }),
    )
    .toBeLessThan(2)
  await page.evaluate(() => window.scrollBy(0, 400))
  await first.locator('a').focus()
  await expect.poll(async () => (await second.boundingBox())!.y).toBeGreaterThan(620)
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#theme-hydrogen$/)
  await page.locator('#theme-hydrogen a[href="#theme-renewables"]').click()
  await expect(page).toHaveURL(/#theme-renewables$/)
  await expect.poll(async () => Math.abs((await first.boundingBox())!.y)).toBeLessThan(2)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(first).toHaveCSS('position', 'relative')
  await expect(page.locator('[data-immersive]')).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(first).toHaveCSS('position', 'relative')
})

test('idle chapter snapping returns short gestures and advances longer ones', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(pageHref('priorities', 'fr', 'theme-renewables'))
  await expect(page.locator('[data-immersive]')).toHaveCount(1)
  const first = page.locator('#theme-renewables')
  const second = page.locator('#theme-hydrogen')
  await expect.poll(async () => Math.abs((await first.boundingBox())!.y)).toBeLessThan(2)
  await page.mouse.move(1100, 600)
  await page.mouse.wheel(0, 240)
  await expect.poll(async () => Math.abs((await second.boundingBox())!.y - 900)).toBeLessThan(2)
  await page.mouse.wheel(0, 650)
  await expect.poll(async () => Math.abs((await second.boundingBox())!.y)).toBeLessThan(2)
  await expect(second.locator('header')).toHaveCSS('opacity', '1')
  await expect(second.locator('figure')).toHaveCSS('opacity', '1')
  await page.mouse.wheel(0, -240)
  await expect.poll(async () => Math.abs((await second.boundingBox())!.y)).toBeLessThan(2)
  await page.mouse.wheel(0, -650)
  await expect.poll(async () => Math.abs((await second.boundingBox())!.y - 900)).toBeLessThan(2)

  await page.setViewportSize({ width: 1440, height: 620 })
  await first.locator('summary').first().focus()
  await page.keyboard.press('Enter')
  await expect(first.locator('details').first()).toHaveAttribute('open', '')
  await first.locator('a').focus()
  await page.evaluate(() =>
    window.scrollTo({
      top: scrollY + document.querySelector('#domains-directions')!.getBoundingClientRect().top,
      behavior: 'instant',
    }),
  )
  const readingStart = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 60)
  await expect
    .poll(() => page.evaluate((start) => scrollY - start, readingStart))
    .toBeGreaterThan(40)
  await expect.poll(() => page.evaluate((start) => scrollY - start, readingStart)).toBeLessThan(80)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('[data-immersive]')).toHaveCount(0)
  await expect(second.locator('figure')).toHaveCSS('transform', 'none')
})

test('slow wheel input stays uninterrupted until the gesture and movement stop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(pageHref('priorities', 'fr', 'theme-renewables'))
  await expect(page.locator('[data-immersive]')).toHaveCount(1)
  await expect
    .poll(() =>
      page.locator('#theme-renewables').evaluate((p) => Math.abs(p.getBoundingClientRect().top)),
    )
    .toBeLessThan(2)
  const start = await page.evaluate(() => scrollY)
  await page.mouse.move(1100, 600)
  for (let step = 1; step <= 8; step++) {
    await page.mouse.wheel(0, 65)
    // Deliberately slower than the former 180ms timer and between native scrollend events.
    await page.waitForTimeout(500)
    const offset = (await page.evaluate(() => scrollY)) - start
    expect(offset).toBeGreaterThan(step * 65 - 3)
    expect(offset).toBeLessThan(step * 65 + 3)
  }
  await expect
    .poll(() =>
      page.locator('#theme-hydrogen').evaluate((p) => Math.abs(p.getBoundingClientRect().top)),
    )
    .toBeLessThan(2)
})
