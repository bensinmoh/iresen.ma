import { expect, test, type Page, type Request } from '@playwright/test'
import { locales } from '../../src/i18n/locales'
import { pageHref } from '../../src/lib/site'

function isHomeVideo(request: Request) {
  return new URL(request.url()).pathname === '/videos/hero.mp4'
}

async function expectStillPhoto(page: Page) {
  const photo = page.locator('.page-hero .hero-photo')
  await photo.evaluate((element) => (element as HTMLImageElement).decode())
  await expect(photo).toBeVisible()
  const video = page.locator('.page-hero .hero-video')
  if (await video.count()) {
    await expect(video).toHaveJSProperty('paused', true)
    await expect(video).toHaveCSS('opacity', '0')
  }
  await expect(page.locator('.page-hero h1')).toBeVisible()
  await expect(page.locator('.hero-primary')).toBeVisible()
}

async function expectPlayback(page: Page) {
  const video = page.locator('.page-hero .hero-video')
  await expect(video).toHaveCount(1)
  await expect
    .poll(async () =>
      video.evaluate((element) => {
        const media = element as HTMLVideoElement
        return !media.paused && media.readyState >= 2 && media.videoWidth > 0
      }),
    )
    .toBe(true)
  await expect(video).toHaveCSS('opacity', '1')
  const media = await video.evaluate((element) => {
    const video = element as HTMLVideoElement
    return {
      source: new URL(video.currentSrc).pathname,
      muted: video.muted,
      loop: video.loop,
      playsInline: video.playsInline,
      controls: video.controls,
      time: video.currentTime,
    }
  })
  expect(media.source).toBe('/videos/hero.mp4')
  expect(media.muted).toBe(true)
  expect(media.loop).toBe(true)
  expect(media.playsInline).toBe(true)
  expect(media.controls).toBe(false)
  // Native media must advance; an autoplay attribute alone does not prove playback.
  await expect
    .poll(() => video.evaluate((element) => (element as HTMLVideoElement).currentTime))
    .toBeGreaterThan(media.time + 0.2)
}

for (const locale of locales) {
  for (const width of [1440, 390]) {
    test(`${locale}: the uploaded homepage hero video runs at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.goto(pageHref('home', locale))
      await expectPlayback(page)
      await expect(page.locator('.page-hero h1')).toBeVisible()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
      ).toBe(false)
    })
  }
}

test('reduced motion shows the homepage photo without downloading the video', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const requests: Request[] = []
  page.on('request', (request) => {
    if (isHomeVideo(request)) requests.push(request)
  })
  await page.goto(pageHref('home', 'fr'))
  await expectStillPhoto(page)
  expect(requests).toHaveLength(0)
})

test('a live reduced-motion change stops the video and restores the photo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(pageHref('home', 'fr'))
  await expectPlayback(page)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expectStillPhoto(page)
  const video = page.locator('.page-hero .hero-video')
  // currentSrc may retain the last URL after unload; native empty states prove no active media.
  await expect(video).not.toHaveAttribute('src', /.+/)
  await expect(video).toHaveJSProperty('readyState', 0)
  await expect(video).toHaveJSProperty('networkState', 0)
  await expect(video).toHaveJSProperty('currentTime', 0)

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expectPlayback(page)
})

test('an unavailable video leaves the homepage photo and actions usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.route('**/videos/hero.mp4', (route) => route.abort())
  const failedVideo = page.waitForEvent('requestfailed', { predicate: isHomeVideo })
  await page.goto(pageHref('home', 'en'))
  await failedVideo
  await expectStillPhoto(page)
  await page.locator('.hero-primary').click()
  await expect(page).toHaveURL(/#page-sections$/)
})

test('secondary pages keep their photo hero without downloading the homepage video', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const requests: Request[] = []
  page.on('request', (request) => {
    if (isHomeVideo(request)) requests.push(request)
  })
  await page.goto(pageHref('institute', 'fr'))
  await expectStillPhoto(page)
  await expect(page.locator('.page-hero .hero-video')).toHaveCount(0)
  expect(requests).toHaveLength(0)
})

test('without JavaScript the Arabic homepage keeps its photo and working section link', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
  })
  try {
    const page = await context.newPage()
    const requests: Request[] = []
    page.on('request', (request) => {
      if (isHomeVideo(request)) requests.push(request)
    })
    await page.goto(pageHref('home', 'ar'))
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expectStillPhoto(page)
    expect(requests).toHaveLength(0)
    await page.locator('.hero-primary').click()
    await expect(page).toHaveURL(/#page-sections$/)
  } finally {
    await context.close()
  }
})
