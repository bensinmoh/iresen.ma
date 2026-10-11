import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { pageHref } from '../../src/lib/site'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: PV media search renders its permitted thumbnails without runtime errors`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(
      `${pageHref('search', locale)}?${new URLSearchParams({ q: 'PV', type: 'media' })}`,
    )
    const images = page.locator('.search-image-preview img')
    expect(await images.count()).toBeGreaterThan(0)
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded()
      await expect
        .poll(() =>
          image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0),
        )
        .toBe(true)
    }
    expect(errors).toEqual([])
  })
}

test('every source-backed static raster can be rendered as an optimized search preview', async ({
  request,
}) => {
  test.setTimeout(90_000)
  const inventory = JSON.parse(readFileSync('src/data/image-provenance.json', 'utf8')) as {
    path: string
    category: string
  }[]
  const urls = inventory
    .filter((image) => image.category !== 'ai-generated')
    .map((image) => image.path)
  for (let index = 0; index < urls.length; index += 5) {
    await Promise.all(
      urls.slice(index, index + 5).map(async (url) => {
        const response = await request.get(
          `/_next/image?${new URLSearchParams({ url, w: '384', q: '75' })}`,
        )
        expect(response.status(), url).toBe(200)
        expect(response.headers()['content-type'], url).toMatch(/^image\//)
      }),
    )
  }
})
