import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { researchPlatforms, platformLegacyAnchors } from '../../src/lib/platforms'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: platform discovery, real destinations, accessibility and reflow`, async ({
    page,
  }, testInfo) => {
    await page.goto(pageHref('platforms', locale))
    const region = page.locator('[data-platforms-page]')
    expect((await page.title()).match(/IRESEN/g)).toHaveLength(1)
    await expect(region.locator('h1')).toHaveCount(1)
    await expect(region.locator('[data-platform]')).toHaveCount(4)
    for (const anchor of platformLegacyAnchors)
      await expect(region.locator(`#${anchor}`)).toHaveCount(1)
    await expect(region.locator('.hero-primary')).toHaveAttribute('href', '#green-energy-park')
    await region.locator('.hero-primary').click()
    await expect(page).toHaveURL(/#green-energy-park$/)
    await expect(region.locator('#green-energy-park h2')).toBeInViewport()
    await expect(region.locator('a[href="https://www.greenenergypark.ma/"]')).toHaveCount(1)
    await expect(region.locator('a[href="#"]')).toHaveCount(0)
    await expect(region.locator(`a[href="${pageHref('network', locale)}"]`)).toHaveCount(2)
    await expect(region.locator('#greenh2a figcaption')).toContainText(
      locale === 'ar' ? 'ثلاثي الأبعاد' : '3D',
    )
    await page.emulateMedia({ reducedMotion: 'reduce' })
    expect(
      (await new AxeBuilder({ page }).include('[data-platforms-page]').analyze()).violations,
    ).toEqual([])
    const response = await page.request.get(
      '/api/search?' + new URLSearchParams({ locale, q: 'GEPMCI' }),
    )
    const items = (await response.json()).items as { id: string; url: string }[]
    expect(
      items.find(
        ({ id }) => id === `section:platforms:green-energy-park-maroc-cote-ivoire:${locale}`,
      )?.url,
    ).toBe(pageHref('platforms', locale, 'green-energy-park-maroc-cote-ivoire'))
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.evaluate(() => document.fonts.ready)
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true)
      if (width === 390 || width === 1440) {
        for (const target of [
          '.page-hero',
          ...researchPlatforms.map(({ anchor }) => `#${anchor}`),
        ]) {
          const section = region.locator(target)
          await section.evaluate((element) =>
            element.scrollIntoView({ block: 'start', behavior: 'instant' }),
          )
          await section.locator('img').evaluateAll(async (images) => {
            await Promise.all(images.map((image) => (image as HTMLImageElement).decode()))
          })
          await page.screenshot({
            path: testInfo.outputPath(`${locale}-${width}-${target.replace(/[.#]/g, '')}.png`),
          })
        }
      }
    }
    await page.setViewportSize({ width: 768, height: 900 })
    await page.addStyleTag({ content: 'html { font-size: 200% !important }' })
    await page.evaluate(() => document.fonts.ready)
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
    await region.locator('a[href="https://www.greenenergypark.ma/"]').focus()
    await expect(region.locator('a[href="https://www.greenenergypark.ma/"]')).toBeFocused()
  })
}

test('platforms: all chapters remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('platforms', 'ar', 'greenh2a'))
  for (const { anchor } of researchPlatforms)
    await expect(page.locator(`#${anchor} h2`)).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('#greenh2a article')).toHaveCount(3)
  await context.close()
})
