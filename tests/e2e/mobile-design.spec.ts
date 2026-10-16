import { test, expect } from './fixtures'
import { pageHref, pageIds } from '../../src/lib/site'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: Figma mobile rules reflow current public pages`, async ({ page }) => {
    test.setTimeout(240_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const id of pageIds.filter((id) => !['events', 'usefulLinks'].includes(id))) {
      await page.goto(pageHref(id, locale))
      for (const width of [320, 402, 640, 768, 1440]) {
        await page.setViewportSize({ width, height: 874 })
        await page.evaluate(async () => {
          await document.fonts.ready
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          )
        })
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), {
            message: `${locale}/${id}/${width}: page containment`,
          })
          .toBe(true)
        if (width > 640) continue
        const heroActions = page.locator('.page-hero .hero-actions a')
        for (const action of await heroActions.all()) {
          const box = (await action.boundingBox())!
          expect(box.height, `${id}: touch target`).toBeGreaterThanOrEqual(50)
          expect(box.width, `${id}: stacked full-width action`).toBeGreaterThan(width - 50)
        }
        for (const title of await page.locator('.page-hero h1').all()) {
          await expect(title).toHaveCSS('font-size', '32px')
        }
      }
    }
    // The menu remains a usable full-screen sheet with native disclosure and focus return.
    await page.setViewportSize({ width: 402, height: 874 })
    await page.goto(pageHref('home', locale))
    const menu = page.locator('.site-menu > summary')
    await menu.click()
    await expect(page.locator('.site-menu')).toHaveAttribute('open', '')
    await expect(page.locator('#main-content')).toHaveAttribute('inert', '')
    await expect(page.locator('.menu-panel')).toBeVisible()
    await menu.focus()
    await page.keyboard.press('Escape')
    await expect(page.locator('.site-menu')).not.toHaveAttribute('open')
    await expect(menu).toBeFocused()

    // Enlarged text grows instead of clipping the hero or losing horizontal rail items.
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
    for (const action of await page.locator('.hero-actions a').all()) {
      const clipped = await action.evaluate((el) => el.scrollHeight > el.clientHeight + 1)
      expect(clipped).toBe(false)
    }
    await page.evaluate(() => (document.documentElement.style.fontSize = ''))
    // Keyboard/native access to every figure is covered by heroes.spec.ts, including RTL.

    for (const id of [
      'home',
      'institute',
      'platforms',
      'contact',
      'publications',
      'media',
    ] as const) {
      await page.goto(pageHref(id, locale))
      await page.evaluate(() => document.fonts.ready)
      await page.screenshot({ path: `.local/mobile-figma/${locale}-${id}-hero.png` })
      if (id === 'home') {
        await page
          .locator('#develop-test-transfer')
          .evaluate((el) => el.scrollIntoView({ block: 'start' }))
        await page.screenshot({ path: `.local/mobile-figma/${locale}-missions.png` })
        await page.locator('.site-footer').evaluate((el) => el.scrollIntoView({ block: 'start' }))
        await page.screenshot({ path: `.local/mobile-figma/${locale}-footer.png` })
      }
    }
  })
}
