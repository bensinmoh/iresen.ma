import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { homePlatforms } from '../../src/lib/home-platforms'
import { pageHref } from '../../src/lib/site'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

const catalogs = { fr, en, ar }
for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: real platform media, destinations, search and responsive reading`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(pageHref('home', locale, 'platforms-expertise'))
    await page.evaluate(() => document.fonts.ready)
    const section = page.locator('#platforms-expertise')
    await expect(section.locator('h2')).toHaveText(catalogs[locale].HomePlatforms.title)
    await expect(
      section.locator('article[id^="platform-"]:not([id^="platform-network-"])'),
    ).toHaveCount(4)
    await expect(section.locator('article[id^="platform-network-"]')).toHaveCount(2)
    await expect(section.locator('nav a').last()).toHaveAttribute(
      'href',
      pageHref('network', locale),
    )
    for (const { id } of homePlatforms) {
      const card = section.locator(`#platform-${id}`)
      await card.scrollIntoViewIfNeeded()
      await expect(card.locator('img').first()).toHaveJSProperty('complete', true)
      await expect
        .poll(() =>
          card
            .locator('img')
            .first()
            .evaluate((img: HTMLImageElement) => img.naturalWidth),
        )
        .toBeGreaterThan(0)
      await expect(card.locator('a')).toHaveAttribute('href', pageHref('platforms', locale))
    }
    await expect(section.locator('#platform-greenh2a')).toContainText(
      catalogs[locale].HomePlatforms.visualization,
    )
    await section.screenshot({ path: `.cache/platforms-review/${locale}-desktop.png` })
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      for (const link of await section.locator('a').all()) {
        await link.focus()
        await expect(link).toBeFocused()
        await expect(link).toBeInViewport()
      }
    }
    await page.setViewportSize({ width: 390, height: 1000 })
    await page.mouse.click(2, 2)
    await page.evaluate(() => {
      document.querySelectorAll<HTMLElement>(':focus').forEach((element) => element.blur())
    })
    await expect(page.locator('.skip-link')).not.toBeFocused()
    await section.scrollIntoViewIfNeeded()
    await section.screenshot({
      path: `.cache/platforms-review/${locale}-mobile.png`,
      // Element capture expands the viewport: keep the unfocused, offscreen skip link offscreen.
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
    const scan = await new AxeBuilder({ page }).include('#platforms-expertise').analyze()
    expect(scan.violations).toEqual([])
    for (const [query, url] of [
      [catalogs[locale].HomePlatforms.mapLabel, '/brand/platforms/morocco.svg'],
      [catalogs[locale].HomePlatforms.expertiseIconLabel, '/brand/platforms/consulting.svg'],
    ]) {
      const mediaResponse = await request.get(
        `/api/search?${new URLSearchParams({ locale, q: query, type: 'media' })}`,
      )
      expect(mediaResponse.status()).toBe(200)
      expect((await mediaResponse.json()).items).toContainEqual(expect.objectContaining({ url }))
    }
    const query = catalogs[locale].HomePlatforms.platforms.greenh2a.name
    const response = await request.get(
      `/api/search?${new URLSearchParams({ locale, q: query, type: 'section' })}`,
    )
    expect(response.status()).toBe(200)
    expect((await response.json()).items).toContainEqual(
      expect.objectContaining({ url: pageHref('home', locale, 'platform-greenh2a') }),
    )
  })
}

test('platforms remain readable without JavaScript and with reduced motion', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto('/ar#platforms-expertise')
  await expect(
    page.locator('#platforms-expertise article[id^="platform-"]:not([id^="platform-network-"])'),
  ).toHaveCount(4)
  await page.locator('#platform-greenh2a a').focus()
  await expect(page.locator('#platform-greenh2a a')).toBeFocused()
  await context.close()
})
