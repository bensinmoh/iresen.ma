import { test, expect } from './fixtures'
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
    const response = await page.goto(pageHref('media', locale))
    expect(response?.headers()['content-security-policy']).toContain(
      'https://www.youtube-nocookie.com',
    )
    const library = page.locator('[data-media-library]')
    await expect(library).toBeVisible()
    await expect(page.locator('.page-hero--media .hero-highlights')).toHaveCount(0)
    for (const { id } of pageSections.media)
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
    await expect(library.locator('figure')).toHaveCount(photos.length)
    await expect(library.locator('figure').first()).toHaveAttribute(
      'id',
      'photo-portrait-dg-iresen-samir-rachidi',
    )
    await expect(library.locator('article[id^="report-"]')).toHaveCount(10)
    await expect(library.locator('#press-resources .navigation-icon')).toHaveCount(7)
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
    await expect(library.locator('figure')).toHaveCount(photos.length)
    await library.evaluate((el) =>
      Promise.all(el.getAnimations({ subtree: true }).map((animation) => animation.finished)),
    )
    await expect(page.locator('#videos article')).toHaveCount(7)
    await expect(page.locator('[data-viewer="video"] iframe')).toHaveCount(0)
    const videoCard = page.locator('#videos article button').first()
    await videoCard.click()
    const videoDialog = page.locator('[data-viewer="video"]')
    await expect(videoDialog).toBeVisible()
    await expect(
      videoDialog.getByRole('link', { name: messages[locale].YouTubePlayer.watch }),
    ).toHaveAttribute('href', 'https://www.youtube.com/watch?v=bu14dpbes2E')
    await expect(videoDialog.locator('a[download], video')).toHaveCount(0)
    // External services remain disabled until the visitor explicitly allows them.
    if (!(await videoDialog.locator('iframe').count())) {
      await page.route('https://www.youtube-nocookie.com/**', (route) =>
        route.fulfill({
          contentType: 'text/html',
          body: '<html><body>YouTube player fixture</body></html>',
        }),
      )
      await videoDialog.getByRole('button', { name: messages[locale].YouTubePlayer.allow }).click()
    }
    await expect(videoDialog.locator('iframe')).toHaveAttribute(
      'src',
      `https://www.youtube-nocookie.com/embed/bu14dpbes2E?playsinline=1&hl=${locale}&rel=0`,
    )
    await page.keyboard.press('Escape')
    await expect(videoDialog).not.toBeVisible()
    await expect(videoDialog.locator('iframe')).toHaveCount(0)
    await expect(videoCard).toBeFocused()
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
    await expect(library.locator('video, iframe')).toHaveCount(0)
  })
}

test('photos and report source links remain available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('media', 'fr'))
  await expect(page.locator('figure[id^="photo-"] > a')).toHaveCount(photos.length)
  await expect(page.locator('#reports article a')).toHaveCount(10)
  await expect(page.locator('figure[id^="photo-"] > a').first()).toHaveAttribute(
    'href',
    photos[0].src,
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
