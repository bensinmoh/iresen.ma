import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { pageSections } from '../../src/lib/page-sections'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }
import photos from '../../src/data/media-photos.json' with { type: 'json' }
const messages = { fr, en, ar }

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale} library media, filters, dialog and responsive access`, async ({ page }) => {
    const copy = messages[locale].MediaLibrary
    await page.goto(pageHref('media', locale))
    const library = page.locator('[data-media-library]')
    await expect(library).toBeVisible()
    await expect(page.locator('.page-hero--media .hero-highlights')).toHaveCount(0)
    for (const { id } of pageSections.media)
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
    await expect(library.locator('figure')).toHaveCount(20)
    await expect(library.locator('figure').first()).toHaveAttribute(
      'id',
      'photo-portrait-dg-iresen-samir-rachidi',
    )
    await expect(library.locator('article[id^="report-"]')).toHaveCount(10)
    await expect(library.locator('#press-resources .navigation-icon')).toHaveCount(5)
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
    await page.getByRole('button', { name: copy.categories.institution, exact: true }).click()
    await expect(library.locator('figure')).toHaveCount(2)
    const portrait = library.locator('#photo-portrait-dg-iresen-samir-rachidi > a')
    await portrait.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const centered = await dialog.boundingBox()
    const viewport = page.viewportSize()!
    expect(centered!.width).toBeLessThanOrEqual(viewport.width * 0.8 + 2)
    expect(centered!.height).toBeLessThanOrEqual(viewport.height * 0.8 + 2)
    expect(Math.abs(centered!.x + centered!.width / 2 - viewport.width / 2)).toBeLessThan(2)
    expect(Math.abs(centered!.y + centered!.height / 2 - viewport.height / 2)).toBeLessThan(2)
    await dialog.evaluate((el) =>
      Promise.all(el.getAnimations({ subtree: true }).map((animation) => animation.finished)),
    )
    expect(await dialog.evaluate((el) => el.scrollHeight <= el.clientHeight)).toBe(true)
    await expect(dialog.locator('img')).toHaveJSProperty('complete', true)
    await expect
      .poll(() => dialog.locator('img').evaluate((img) => (img as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
    await page.keyboard.press(locale === 'ar' ? 'ArrowLeft' : 'ArrowRight')
    await expect(dialog.locator('h2')).not.toContainText(
      photos.find(({ id }) => id === 'portrait-dg-iresen-samir-rachidi')!.title[locale],
    )
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(portrait).toBeFocused()
    await page.getByRole('button', { name: copy.all, exact: true }).click()
    await expect(library.locator('figure')).toHaveCount(20)
    await library.evaluate((el) =>
      Promise.all(el.getAnimations({ subtree: true }).map((animation) => animation.finished)),
    )
    const videoCard = page.locator('#videos article button').first()
    if (await videoCard.count()) {
      await videoCard.click()
      await expect(page.getByRole('dialog')).toBeVisible()
      const video = page.getByRole('dialog').locator('video')
      await expect(video).toHaveAttribute('preload', 'none')
      await expect(video.locator('source')).toHaveAttribute(
        'src',
        new RegExp(`/api/media/file/.+[?]locale=${locale}$`),
      )
      await page.keyboard.press('Escape')
      await expect(page.getByRole('dialog')).not.toBeVisible()
      await expect(videoCard).toBeFocused()
    }
    const violations = (
      await new AxeBuilder({ page })
        .include('[data-media-library]')
        .disableRules(['video-caption'])
        .analyze()
    ).violations
    expect(violations).toEqual([])
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await page.setViewportSize({ width: 390, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await library.locator('figure > a').first().click()
    await dialog.evaluate((el) =>
      Promise.all(el.getAnimations({ subtree: true }).map((animation) => animation.finished)),
    )
    expect(
      await dialog.evaluate(
        (el) => el.scrollHeight <= el.clientHeight && el.scrollWidth <= el.clientWidth,
      ),
    ).toBe(true)
    await page.keyboard.press('Escape')
    for (const video of await library.locator('video').all()) {
      await expect(video).toHaveAttribute('preload', 'none')
      await expect(video).not.toHaveAttribute('autoplay')
      await expect(video.locator('source')).toHaveAttribute(
        'src',
        new RegExp(`/api/media/file/.+\\?locale=${locale}$`),
      )
    }
  })
}

test('photos and report source links remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('media', 'fr'))
  await expect(page.locator('figure[id^="photo-"] > a')).toHaveCount(20)
  await expect(page.locator('#reports article a')).toHaveCount(10)
  await expect(page.locator('figure[id^="photo-"] > a').first()).toHaveAttribute(
    'href',
    '/images/media-library/portrait-dg-iresen-samir-rachidi.webp',
  )
  await context.close()
})

test('media motion respects reduced-motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(pageHref('media', 'fr'))
  await page.locator('#photo-gep-vue-aerienne > a').click()
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(
    await page
      .getByRole('dialog')
      .evaluate((element) => element.getAnimations({ subtree: true }).length),
  ).toBe(0)
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  )
})
