import { expect, test } from '@playwright/test'
import { pageHref, pageIds } from '../../src/lib/site'
import { locales } from '../../src/i18n/locales'

for (const locale of locales) {
  test(`${locale}: every page has a lightweight hero and a working section link`, async ({
    page,
  }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width: 1440, height: 900 })
    for (const id of pageIds) {
      await page.goto(pageHref(id, locale))
      const hero = page.locator('.page-hero')
      await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(hero.locator('.hero-description')).toBeVisible()
      if (id === 'home') {
        await expect(hero.locator('.hero-figures dt')).toHaveCount(5)
        await expect(hero.locator('.hero-figures dd')).toHaveText([
          '69',
          '+60',
          '+1000',
          '+1100',
          '+18',
        ])
        await expect(hero.locator('.hero-pathways')).toHaveCount(0)
        await expect(hero.locator('.hero-founding')).toHaveCount(0)
      }
      await expect(hero.locator('.hero-photo')).toHaveJSProperty('complete', true)
      expect(
        await hero
          .locator('.hero-photo')
          .evaluate((image) => (image as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0)
      const bounds = await hero.boundingBox()
      expect(bounds!.y).toBe(0)
      expect(Math.abs(bounds!.height - 900), id).toBeLessThanOrEqual(2)
      await hero.locator('.hero-primary').click()
      await expect(page).toHaveURL(/#page-sections$/)
      const section = await page.locator('#page-sections').boundingBox()
      expect(Math.abs(section!.y)).toBeLessThanOrEqual(25)
    }
  })

  test(`${locale}: the full landing resizes with the viewport, then reflows for enlarged text`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(pageHref('home', locale))
    const hero = page.locator('.page-hero')
    // Five homepage figures may require a taller landing on narrow screens.
    await expect.poll(async () => (await hero.boundingBox())!.height).toBeGreaterThanOrEqual(844)
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect.poll(async () => (await hero.boundingBox())!.height).toBe(1024)
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect.poll(async () => (await hero.boundingBox())!.height).toBe(900)

    await page.setViewportSize({ width: 320, height: 568 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(overflow).toBe(false)
    const lastFigure = hero.locator('.hero-figures .key-figure').last()
    await lastFigure.scrollIntoViewIfNeeded()
    await expect(lastFigure).toBeVisible()
    const headerBounds = await page.getByRole('banner').boundingBox()
    const titleBounds = await hero.locator('h1').boundingBox()
    expect(titleBounds!.y).toBeGreaterThan(headerBounds!.y + headerBounds!.height)
  })
}

test('without JavaScript the hero, section navigation and Arabic content remain usable', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:3000${pageHref('institute', 'ar')}`)
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('.page-hero h1')).toBeVisible()
  await page.locator('.hero-primary').click()
  await expect(page).toHaveURL(/#page-sections$/)
  await expect(page.locator('.section-navigation')).toBeVisible()
  await context.close()
})
