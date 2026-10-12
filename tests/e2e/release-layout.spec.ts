import { test, expect } from './fixtures'
import { pageHref } from '../../src/lib/site'
import { mkdirSync } from 'node:fs'
for (const locale of ['fr', 'en', 'ar'] as const)
  test(`${locale}: programme geometry, text enlargement and screenshots`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(pageHref('programmes', locale))
    const section = page.locator('#programmes-collaborations')
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.evaluate(() => document.fonts.ready)
      await section.scrollIntoViewIfNeeded()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true)
      if (width === 1440) {
        const image = await section.locator('figure').boundingBox()
        const text = await section.locator('[data-motion-reveal]').nth(1).boundingBox()
        expect(Math.abs(image!.height - text!.height)).toBeLessThan(50)
        const title = await section.locator('header').boundingBox()
        expect(title!.y + title!.height).toBeLessThanOrEqual(image!.y + 1)
      }
      const process = page.locator('#project-lifecycle')
      expect(
        await process
          .locator('header > p:last-child')
          .evaluate((e) => getComputedStyle(e).textAlign),
      ).toBe('center')
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      })
      mkdirSync('.local/handoff-review/screenshots', { recursive: true })
      await section.screenshot({
        path: `.local/handoff-review/screenshots/programmes-${locale}-${width}.png`,
      })
    }
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
  })

for (const locale of ['fr', 'ar'] as const)
  test(`${locale}: retained headquarters photo and new empty/tool pages`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const id of ['contact', 'institute', 'projects', 'usefulLinks'] as const) {
        await page.goto(pageHref(id, locale))
        await page.evaluate(() => document.fonts.ready)
        const picture =
          id === 'contact'
            ? page.locator('.contact-intro-image')
            : id === 'institute'
              ? page.locator('.hero-photo')
              : null
        if (picture) {
          await expect(picture).toHaveAttribute('src', /q=60/)
          await picture.evaluate((e) => (e as HTMLImageElement).decode())
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true)
        await page.screenshot({
          path: `.local/handoff-review/screenshots/${id}-${locale}-${width}.png`,
        })
      }
    }
  })
