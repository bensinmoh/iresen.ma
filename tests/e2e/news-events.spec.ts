import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { pageHref, pageLinkHref, newsListingHref, pages } from '../../src/lib/site'
import { newsEvents } from '../../src/lib/news-events'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: overview, listing, source thumbnails and legacy event redirect`, async ({
    page,
  }) => {
    await page.goto(pageHref('news', locale))
    const screen = page.locator('[data-news-events-page="overview"]')
    await expect(screen).toBeVisible()
    await expect(screen.locator('h1')).toHaveCount(1)
    await expect(screen.locator('#news article')).toHaveCount(6)
    await expect(screen.locator('#news article img:not([aria-hidden])')).toHaveCount(5)
    await expect(screen.locator('#events article')).toHaveCount(6)
    const eventCards = screen.locator('#events article')
    const heights = await eventCards.evaluateAll((cards) =>
      cards.map((card) => card.getBoundingClientRect().height),
    )
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(2)
    const track = screen.locator('#events [role="region"]')
    expect(await track.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true)
    await expect(screen.locator('[data-news-placeholder]')).toHaveCount(1)
    await expect(screen.locator('[data-event-placeholder]')).toHaveCount(3)
    const highlight = await screen.locator('#news article').first().boundingBox()
    const lastSecondary = await screen.locator('[data-news-placeholder]').boundingBox()
    expect(
      Math.abs(highlight!.y + highlight!.height - (lastSecondary!.y + lastSecondary!.height)),
    ).toBeLessThan(2)
    await expect(page.locator('.site-header')).toHaveClass(/site-header-overlay/)
    await expect(screen.locator('#follow-iresen li')).toHaveCount(5)
    for (const event of newsEvents) {
      await screen.locator(`#event-${event.id} summary`).click()
      await expect(screen.locator(`#event-${event.id} details`)).toHaveAttribute('open', '')
    }
    await expect(screen.locator('#event-cop31')).toContainText('MENALINKS')
    await expect(screen.locator('#event-cop31')).toContainText('LEAP-SE')
    await expect(screen.locator('#event-irsecx a')).toHaveAttribute('href', 'https://irsecx.ma/')
    const heroText = await screen.locator('h1').innerText()
    await screen.locator(`a[href="${newsListingHref(locale)}"]`).click()
    await expect(page).toHaveURL(new RegExp(`${encodeURI(newsListingHref(locale))}$`))
    const listing = page.locator('[data-news-events-page="listing"]')
    await expect(listing.locator('h1')).toHaveText(heroText, { useInnerText: true })
    await expect(listing.locator('#news article')).toHaveCount(5)
    await expect(listing.locator('#events')).toHaveCount(0)
    await expect(listing.locator('#follow-iresen')).toHaveCount(0)
    for (const target of ['fr', 'en', 'ar'] as const) {
      await expect(
        page.locator(`.site-header .locale-selector a[hreflang="${target}"]`),
      ).toHaveAttribute('href', newsListingHref(target))
    }
    const legacy = await page.goto(`/${locale}${pages.events.pathnames[locale]}`)
    expect(legacy?.status()).toBe(200)
    await expect(page).toHaveURL(new RegExp(`${encodeURI(pageLinkHref('events', locale))}$`))
    const response = await page.request.get(`/api/search?locale=${locale}&q=MENALINKS`)
    expect(response.ok()).toBe(true)
    const search = await response.json()
    expect(search.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: pageHref('news', locale, 'event-cop31'),
          locale,
        }),
      ]),
    )
  })
  test(`${locale}: responsive containment, accessible disclosures and social links`, async ({
    page,
  }) => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(pageHref('news', locale))
      await page.evaluate(() => document.fonts.ready)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      ).toBe(true)
      for (const image of await page.locator('[data-news-events-page] img').all()) {
        if (!(await image.isVisible())) continue
        await image.scrollIntoViewIfNeeded()
        await expect
          .poll(() =>
            image.evaluate(
              (img) =>
                (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0,
            ),
          )
          .toBe(true)
      }
    }
    const scan = await new AxeBuilder({ page })
      .include('[data-news-events-page]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(scan.violations).toEqual([])
    const rail = page.locator('#events [role="region"]')
    await rail.focus()
    const before = await rail.evaluate((el) => el.scrollLeft)
    await page.keyboard.press(locale === 'ar' ? 'ArrowLeft' : 'ArrowRight')
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).not.toBe(before)
    await page.locator('#event-cop31 summary').focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('#event-cop31 details')).toHaveAttribute('open', '')
    await page.setViewportSize({ width: 390, height: 900 })
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
  })
}
