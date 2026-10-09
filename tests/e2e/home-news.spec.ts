import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pageHref } from '../../src/lib/site'
import { homeNewsPosts } from '../../src/lib/home-news'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }
const catalogs = { fr, en, ar }

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: LinkedIn news keeps localized titles, month precision and all five links`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(pageHref('home', locale, 'news-events'))
    const section = page.locator('#news-events')
    await expect(section.locator('h2')).toBeVisible()
    await expect(section.locator('li')).toHaveCount(5)
    await expect(section.locator(`h3[lang="${locale}"]`)).toHaveCount(5)
    await expect(section.locator('time[datetime="2026-10"]')).toHaveCount(2)
    await expect(section.locator('time[datetime="2026-09"]')).toHaveCount(3)
    await expect(section.locator('header a')).toHaveAttribute('href', pageHref('news', locale))
    await expect(section.locator('button').first()).toBeDisabled()
    await section.locator('button').last().click()
    await expect(section.locator('button').last()).toBeDisabled()
    await expect(section.locator('li').last()).toBeInViewport()
    await section.locator('button').first().click()
    await expect(section.locator('button').first()).toBeDisabled()
    await expect(section.locator('li').first()).toBeInViewport()
    await section.screenshot({ path: `.cache/news-review/${locale}-desktop.png` })
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      await section.locator('h3 a').first().focus()
      await section.locator('h3 a').last().focus()
      await expect(section.locator('h3 a').last()).toBeInViewport()
      await expect(section.locator('h3 a').last()).toBeFocused()
    }
    await page.setViewportSize({ width: 390, height: 1000 })
    await section.locator('h3 a').first().focus()
    await section.screenshot({ path: `.cache/news-review/${locale}-mobile.png` })
    const title = catalogs[locale].HomeNews.posts['7508575272049229824'].title
    const response = await request.get(
      `/api/search?${new URLSearchParams({ locale, q: title, type: 'section' })}`,
    )
    expect(response.status()).toBe(200)
    expect((await response.json()).items).toContainEqual(
      expect.objectContaining({ title, url: pageHref('home', locale, 'news-7508575272049229824') }),
    )
    const scan = await new AxeBuilder({ page }).include('#news-events').analyze()
    expect(scan.violations).toEqual([])
  })
}

test('original post search anchor survives locale switching and native keyboard scrolling without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  const last = homeNewsPosts.at(-1)!
  await page.goto(pageHref('home', 'ar', `news-${last.id.split(':').at(-1)}`))
  const link = page.locator('#news-events h3 a').last()
  await link.focus()
  await expect(link).toBeInViewport()
  await expect(link).toHaveAttribute('href', `https://www.linkedin.com/feed/update/${last.id}/`)
  await context.close()
})

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`news arrows glide one card at a time with ${reducedMotion} motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion })
    await page.setViewportSize({ width: 390, height: 1000 })
    await page.goto('/fr#news-events')
    const rail = page.locator('#home-news-posts')
    const next = page.locator('#news-events button').last()
    await next.click()
    await expect
      .poll(() => rail.evaluate((element) => Math.abs(element.scrollLeft)))
      .toBeGreaterThan(250)
    // A step must expose the second card, not jump to the last post on mobile.
    await expect(rail.locator('li').nth(1)).toBeInViewport()
    await expect(next).toBeEnabled()
    if (reducedMotion === 'reduce') {
      await next.hover()
      await expect(next.locator('svg')).toHaveCSS('translate', 'none')
    }
  })
}
