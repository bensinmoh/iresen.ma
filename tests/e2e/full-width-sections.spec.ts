import { test, expect } from './fixtures'
import { pageHref, type PageId } from '../../src/lib/site'

const surfaces: { pageId: PageId; selector: string }[] = [
  {
    pageId: 'home',
    selector: '#page-sections > .page-content > section:not(#develop-test-transfer)',
  },
  { pageId: 'media', selector: '[data-media-library], #videos, #reports' },
  { pageId: 'workWithUs', selector: '[data-engagement-page="workWithUs"] > section' },
  { pageId: 'transfer', selector: '[data-engagement-page="transfer"] > section' },
  { pageId: 'contact', selector: '.contact-intro' },
]
for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: full-width surfaces reach both viewport edges above the capped grid`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const { pageId, selector } of surfaces) {
      await page.goto(pageHref(pageId, locale))
      await page.evaluate(() => document.fonts.ready)
      for (const width of [390, 1440, 2560, 3440]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            ),
        )
        await expect
          .poll(
            () =>
              page.locator(selector).evaluateAll((nodes) =>
                Math.max(
                  ...nodes
                    .filter(
                      (el) =>
                        !el.closest('[data-engagement-page="transfer"]') ||
                        getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)',
                    )
                    .map((el) => {
                      const rect = el.getBoundingClientRect()
                      return Math.max(
                        Math.abs(rect.left),
                        Math.abs(rect.right - document.documentElement.clientWidth),
                      )
                    }),
                ),
              ),
            { message: `${pageId}/${width}: responsive breakout settles at viewport edges` },
          )
          .toBeLessThanOrEqual(1)
        const bounds = await page.locator(selector).evaluateAll((nodes) =>
          nodes
            .filter((el) => {
              // Transfer also contains deliberately contained white reading sections.
              return (
                !el.closest('[data-engagement-page="transfer"]') ||
                getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)'
              )
            })
            .map((el) => {
              const rect = el.getBoundingClientRect()
              return {
                id: el.id,
                left: rect.left,
                right: rect.right,
                viewport: document.documentElement.clientWidth,
              }
            }),
        )
        expect(bounds.length).toBeGreaterThan(0)
        for (const rect of bounds) {
          expect(
            Math.abs(rect.left),
            `${pageId}/${width}/${rect.id} leading edge`,
          ).toBeLessThanOrEqual(1)
          expect(
            Math.abs(rect.right - rect.viewport),
            `${pageId}/${width}/${rect.id} trailing edge`,
          ).toBeLessThanOrEqual(1)
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
          ),
          `${pageId}/${width}: page overflow`,
        ).toBe(true)
        if (width === 3440 && ['home', 'contact', 'media'].includes(pageId)) {
          const target = page.locator(
            pageId === 'home'
              ? '#platforms-expertise'
              : pageId === 'media'
                ? '#videos'
                : '.contact-intro',
          )
          await target.scrollIntoViewIfNeeded()
          await page.screenshot({ path: `.cache/full-width-review/${locale}-${pageId}.png` })
        }
      }
    }
  })
}
