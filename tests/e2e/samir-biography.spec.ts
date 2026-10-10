import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import photos from '../../src/data/media-photos.json' with { type: 'json' }
import biography from '../../src/data/samir-biography.json' with { type: 'json' }

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale} official portrait biography, copy and image-only download`, async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(pageHref('media', locale))
    const portrait = page.locator('#photo-portrait-dg-iresen-samir-rachidi > a')
    await portrait.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toHaveAttribute('data-viewer', 'biography')
    await expect(dialog.locator('[lang="fr"]')).toContainText(biography.paragraphs.at(-1)!)
    await expect(dialog.locator('img')).toHaveAttribute(
      'src',
      '/images/media-library/samir-rachidi-cutout-v2.webp',
    )
    await dialog
      .locator('button')
      .filter({ hasText: /Copier la biographie|Copy biography|نسخ السيرة الذاتية/ })
      .click()
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain(biography.paragraphs.at(-1)!)
    await expect(dialog.locator('a[download]')).toHaveAttribute('href', photos[0].src)
    const downloadEvent = page.waitForEvent('download')
    await dialog.locator('a[download]').click()
    const download = await downloadEvent
    expect(download.suggestedFilename()).toBe('portrait-dg-iresen-samir-rachidi-official.webp')
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
      const frame = await dialog.boundingBox()
      expect(frame!.width).toBeLessThanOrEqual(width * 0.8 + 2)
      expect(frame!.height).toBeLessThanOrEqual(900 * 0.8 + 2)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    expect(
      await dialog.evaluate(
        (el) => el.scrollWidth <= el.clientWidth && el.scrollHeight <= el.clientHeight,
      ),
    ).toBe(true)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = ''
    })
    await page.setViewportSize({ width: 1440, height: 900 })
    const imageFrame = await dialog
      .locator('img')
      .evaluate((el) => el.parentElement!.getBoundingClientRect().bottom)
    const dialogBottom = await dialog.evaluate((el) => el.getBoundingClientRect().bottom)
    expect(Math.abs(imageFrame - dialogBottom)).toBeLessThan(1)
    expect((await new AxeBuilder({ page }).include('dialog').analyze()).violations).toEqual([])
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(portrait).toBeFocused()
  })
}
