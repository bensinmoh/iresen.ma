import { expect, test, type Browser, type Request } from '@playwright/test'
import sharp from 'sharp'
import { pageHref } from '../../src/lib/site'

const cases = [
  { pageId: 'home', locale: 'fr' },
  { pageId: 'priorities', locale: 'fr' },
  { pageId: 'priorities', locale: 'ar' },
] as const

function isHeroImage(request: Request) {
  if (request.resourceType() !== 'image') return false
  const url = new URL(request.url())
  const source =
    url.pathname === '/_next/image'
      ? new URL(url.searchParams.get('url') ?? '', url).pathname
      : url.pathname
  return source.startsWith('/images/heroes/')
}

async function delivery(
  browser: Browser,
  baseURL: string | undefined,
  viewport: { width: number; height: number },
  item: (typeof cases)[number],
) {
  // A fresh context also prevents a previous locale's cached photo masking a request.
  const context = await browser.newContext({ baseURL, viewport, deviceScaleFactor: 2 })
  try {
    const page = await context.newPage()
    const requests: Request[] = []
    page.on('request', (request) => {
      if (isHeroImage(request)) requests.push(request)
    })
    await page.goto(pageHref(item.pageId, item.locale))
    await page.evaluate(async () => {
      await document.fonts.ready
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      )
    })
    const image = page.locator('.page-hero .hero-photo')
    await image.evaluate((element) => (element as HTMLImageElement).decode())
    const rendered = await image.evaluate((element) => {
      const photo = element as HTMLImageElement
      const bounds = photo.getBoundingClientRect()
      return {
        currentSrc: photo.currentSrc,
        width: bounds.width,
        height: bounds.height,
        fit: getComputedStyle(photo).objectFit,
        dpr: window.devicePixelRatio,
      }
    })
    expect(rendered.dpr).toBe(2)
    expect(rendered.fit).toBe('cover')
    expect(rendered.width).toBeGreaterThan(0)
    expect(rendered.height).toBeGreaterThan(0)
    expect(
      requests,
      'initial hero delivery must not fetch both mobile and wide photos',
    ).toHaveLength(1)
    expect(requests[0].url()).toBe(rendered.currentSrc)
    const response = await requests[0].response()
    if (!response) throw new Error('The selected hero image did not receive a response')
    expect(response.status()).toBe(200)
    // Browser naturalWidth is density-adjusted; decode the received pixels instead.
    const pixels = await sharp(await response.body()).metadata()
    expect(pixels.width).toBeGreaterThan(0)
    expect(pixels.height).toBeGreaterThan(0)
    return {
      ...rendered,
      pixels: { width: pixels.width!, height: pixels.height! },
    }
  } finally {
    await context.close()
  }
}

test('mobile heroes download one native-height portrait crop instead of an undersized wide image', async ({
  browser,
  baseURL,
}) => {
  test.setTimeout(90_000)
  for (const item of cases) {
    await test.step(`${item.locale}: ${item.pageId}`, async () => {
      const image = await delivery(browser, baseURL, { width: 390, height: 844 }, item)
      const url = new URL(image.currentSrc)
      expect(url.pathname).toMatch(/^\/images\/heroes\/.+\.webp$/)
      expect(url.search).toBe('')
      expect(image.pixels.width / image.pixels.height).toBeCloseTo(2 / 3, 2)
      expect(image.pixels.height).toBeGreaterThanOrEqual(900)
      if (item.pageId === 'priorities') {
        const coverScale = Math.max(
          image.width / image.pixels.width,
          image.height / image.pixels.height,
        )
        expect(
          coverScale,
          'a tall priority hero must not upscale a short source',
        ).toBeLessThanOrEqual(1.01)
      }
    })
  }
})

test('wide heroes download one high-quality image with enough native pixels to cover the scene', async ({
  browser,
  baseURL,
}) => {
  test.setTimeout(90_000)
  for (const item of cases) {
    await test.step(`${item.locale}: ${item.pageId}`, async () => {
      const image = await delivery(browser, baseURL, { width: 1440, height: 900 }, item)
      const url = new URL(image.currentSrc)
      expect(url.pathname).toBe('/_next/image')
      expect(url.searchParams.get('q')).toBe('90')
      expect(url.searchParams.get('url')).toMatch(/^\/images\/heroes\/.+\.webp$/)
      expect(image.pixels.width).toBeGreaterThanOrEqual(1500)
      const coverScale = Math.max(
        image.width / image.pixels.width,
        image.height / image.pixels.height,
      )
      // Native sources may be smaller than a DPR-2 candidate; artificial enlargement is unnecessary.
      expect(coverScale).toBeLessThanOrEqual(1.01)
    })
  }
})
