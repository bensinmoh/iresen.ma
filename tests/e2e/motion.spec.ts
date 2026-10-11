import { expect, test } from '@playwright/test'
import { pageHref } from '../../src/lib/site'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const animate = Element.prototype.animate
    const log: { id: string; duration: number }[] = []
    Object.assign(window, { motionLog: log })
    Element.prototype.animate = function (frames, options) {
      const duration = typeof options === 'object' ? Number(options.duration) : Number(options)
      log.push({ id: this.id, duration })
      return animate.call(this, frames, options)
    }
  })
})

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: first scroll reveals once, native anchors retain later reveals`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`)
    await expect(page.locator('h1')).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior))
      .toBe('smooth')
    // Follow the actual hero link: it must not mark the entire body as already revealed.
    await page.locator('.hero-primary').click()
    await expect(page).toHaveURL(/#page-sections$/)
    const heading = page.locator('#research-heading')
    await heading.evaluate((element) =>
      element.scrollIntoView({ behavior: 'instant', block: 'center' }),
    )
    const count = () =>
      page.evaluate(
        () =>
          (window as unknown as { motionLog: { id: string; duration: number }[] }).motionLog.filter(
            (entry) => entry.id === 'research-heading' && entry.duration === 420,
          ).length,
      )
    await expect.poll(count).toBe(1)
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await heading.evaluate((element) =>
      element.scrollIntoView({ behavior: 'instant', block: 'center' }),
    )
    await expect.poll(count).toBe(1)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior))
      .toBe('auto')
    await expect.poll(() => heading.evaluate((element) => element.getAnimations().length)).toBe(0)
  })
}

test('shared motion reaches resource and institutional pages on mobile and tablet', async ({
  page,
}) => {
  for (const [id, width] of [
    ['publications', 390],
    ['transfer', 768],
    ['news', 1024],
  ] as const) {
    await page.setViewportSize({ width, height: 850 })
    await page.goto(pageHref(id, 'fr'))
    await expect
      .poll(() =>
        page.evaluate(() =>
          (window as unknown as { motionLog: { duration: number }[] }).motionLog.some(
            (entry) => entry.duration === 420,
          ),
        ),
      )
      .toBe(true)
    await expect(page.locator('h1')).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
})

test('reduced motion, missing observer and no JavaScript leave content readable', async ({
  page,
  browser,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/ar')
  await expect(page.locator('h1')).toBeVisible()
  expect(
    await page.evaluate(() =>
      (window as unknown as { motionLog: { duration: number }[] }).motionLog.some(
        (entry) => entry.duration === 420,
      ),
    ),
  ).toBe(false)
  const unavailable = await browser.newContext()
  await unavailable.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined })
  })
  const fallback = await unavailable.newPage()
  await fallback.goto('/fr')
  await expect(fallback.locator('h1')).toBeVisible()
  await fallback
    .locator('#research-heading')
    .evaluate((element) => element.scrollIntoView({ behavior: 'instant' }))
  await expect(fallback.locator('#research-heading')).toBeVisible()
  await unavailable.close()
  const native = await browser.newContext({ javaScriptEnabled: false })
  const nativePage = await native.newPage()
  await nativePage.goto(pageHref('publications', 'en'))
  await expect(nativePage.locator('h1')).toBeVisible()
  await expect(nativePage.locator('#publication-catalogue h2')).toBeVisible()
  await native.close()
})

test('new content reveals once and keyboard focus immediately settles its card', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 850 })
  await page.goto('/en')
  await expect(page.locator('h1')).toBeVisible()
  await page.evaluate(() => {
    const card = document.createElement('article')
    card.id = 'motion-test-card'
    const link = document.createElement('a')
    link.href = '#main-content'
    link.textContent = 'Keyboard motion verification'
    card.append(link)
    document.getElementById('main-content')!.append(card)
    card.scrollIntoView({ behavior: 'instant', block: 'center' })
  })
  const card = page.locator('#motion-test-card')
  await expect.poll(() => card.evaluate((element) => element.getAnimations().length)).toBe(1)
  await expect(card).toHaveCSS('opacity', '1')
  await card.locator('a').focus()
  await expect(card.locator('a')).toBeFocused()
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior))
    .toBe('auto')
  await expect.poll(() => card.evaluate((element) => element.getAnimations().length)).toBe(0)
  await expect(card).toHaveCSS('opacity', '1')
  await card.evaluate((element) => element.remove())
})
