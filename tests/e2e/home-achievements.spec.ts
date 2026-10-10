import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { homeAchievements } from '../../src/lib/home-achievements'
import { pageHref } from '../../src/lib/site'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

const catalogs = { fr, en, ar }
for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: achievements, rail navigation, media and search`, async ({ page, request }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(pageHref('home', locale, 'results'))
    await page.evaluate(() => document.fonts.ready)
    const section = page.locator('#results')
    const rail = section.locator('#home-achievements')
    const copy = catalogs[locale].HomeAchievements
    await expect(section.locator('h2')).toHaveText(copy.title)
    await expect(section.locator('article')).toHaveCount(8)
    await expect(section.locator('a')).toHaveCount(0)
    await expect(section).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    const next = section.getByRole('button', { name: copy.next, exact: true })
    const previous = section.getByRole('button', { name: copy.previous, exact: true })
    await expect(previous).toBeDisabled()
    await next.click()
    await expect.poll(() => rail.evaluate((el) => Math.abs(el.scrollLeft))).toBeGreaterThan(100)
    await expect(previous).toBeEnabled()
    await previous.click()
    await expect(previous).toBeDisabled()
    await section.screenshot({ path: `.cache/achievements-review/${locale}-desktop.png` })
    for (const { id } of homeAchievements) {
      const card = section.locator(`#achievement-${id}`)
      await card.scrollIntoViewIfNeeded()
      await expect(card.locator('h3')).toHaveText(copy.items[id].name)
      await expect
        .poll(() => card.locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0)
      const response = await request.get(
        `/api/search?${new URLSearchParams({ locale, q: copy.items[id].name, type: 'section', limit: '50' })}`,
      )
      expect(response.status()).toBe(200)
      expect((await response.json()).items).toContainEqual(
        expect.objectContaining({ url: pageHref('home', locale, `achievement-${id}`) }),
      )
      const media = await request.get(
        `/api/search?${new URLSearchParams({ locale, q: copy.items[id].name, type: 'media', limit: '50' })}`,
      )
      expect((await media.json()).items).toContainEqual(
        expect.objectContaining({ url: `/images/achievements/${id}.webp` }),
      )
    }
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      await rail.scrollIntoViewIfNeeded()
      await rail.focus()
      await expect(rail).toBeFocused()
      await expect(rail).toBeInViewport()
    }
    await page.setViewportSize({ width: 390, height: 1000 })
    await previous.click()
    await rail.evaluate((el) => {
      el.scrollLeft = 0
    })
    await section.screenshot({
      path: `.cache/achievements-review/${locale}-mobile.png`,
      style: '.skip-link:not(:focus) { visibility: hidden; }',
    })
    await page.setViewportSize({ width: 320, height: 1000 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
      .toBe(true)
    expect(
      await section
        .locator('h2, h3, p')
        .evaluateAll((nodes) =>
          nodes
            .filter((node) => node.scrollWidth > node.clientWidth + 1)
            .map((node) => node.textContent),
        ),
    ).toEqual([])
    await page.evaluate(() => {
      document.documentElement.style.fontSize = ''
    })
    expect((await new AxeBuilder({ page }).include('#results').analyze()).violations).toEqual([])
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await next.click()
    expect(
      await next
        .locator('svg')
        .evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration)),
    ).toBeLessThan(0.001)
    // Canonical card anchors must reveal a later card in the scroll container.
    await page.goto(pageHref('home', locale, 'achievement-hydrogen-roadmap'))
    await expect(page.locator('#achievement-hydrogen-roadmap')).toBeInViewport()
    await page.setViewportSize({ width: 1440, height: 1000 })
    await section.screenshot({
      path: `.cache/achievements-review/${locale}-reports.png`,
      style: '.skip-link:not(:focus) { visibility: hidden; }',
    })
  })
}

test('all achievements remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:3000/ar#achievement-hydrogen-roadmap')
  await expect(page.locator('#results article')).toHaveCount(8)
  await expect(page.locator('#achievement-hydrogen-roadmap')).toBeInViewport()
  await expect(page.locator('#results button').first()).toBeHidden()
  await context.close()
})

test('automatic rail advances one card, reverses, and respects interaction and reduced motion', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.clock.install()
  await page.goto('/fr#results')
  const rail = page.locator('#home-achievements')
  await expect(page.locator('#results button')).toHaveCount(2)
  await expect(page.locator('#results button').last()).toBeVisible()
  await page.mouse.move(0, 0)
  const position = () => rail.evaluate((el) => Math.abs(el.scrollLeft))
  const step = await rail.evaluate(
    (el) =>
      el.firstElementChild!.getBoundingClientRect().width +
      parseFloat(getComputedStyle(el).columnGap),
  )
  await page.clock.runFor(6500)
  await expect.poll(position).toBeGreaterThan(step - 2)
  expect(await position()).toBeLessThan(step + 2)
  await rail.hover()
  const hovered = await position()
  await page.clock.fastForward(12000)
  expect(await position()).toBeCloseTo(hovered, 0)
  await page.mouse.move(0, 0)
  await rail.focus()
  await page.clock.fastForward(12000)
  expect(await position()).toBeCloseTo(hovered, 0)
  await rail.evaluate((el) => {
    el.blur()
    el.scrollLeft = el.scrollWidth
  })
  const end = await position()
  await page.clock.runFor(6500)
  await expect.poll(position).toBeLessThan(end - step + 2)
  expect(await position()).toBeGreaterThan(end - step - 2)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const reduced = await position()
  await page.clock.fastForward(12000)
  expect(await position()).toBeCloseTo(reduced, 0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await rail.evaluate((el) => {
    el.scrollLeft = 0
  })
  await page.clock.runFor(6500)
  await expect.poll(position).toBeGreaterThan(step - 2)
})
