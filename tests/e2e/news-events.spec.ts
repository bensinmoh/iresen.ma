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

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: mobile event pills track native scrolling and keyboard navigation`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('news', locale))
    const rail = page.locator('[data-event-rail]')
    const navigation = page.locator('[data-event-navigation]')
    await expect.poll(() => rail.evaluate((el) => getComputedStyle(el).scrollbarWidth)).toBe('none')
    await expect(navigation).toBeHidden()
    await page.setViewportSize({ width: 390, height: 900 })
    await expect(navigation).toBeVisible()
    const socials = page.locator('#follow-iresen ul')
    const socialLinks = socials.getByRole('link')
    await expect(socialLinks).toHaveCount(5)
    for (const name of ['Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'ResearchGate'])
      await expect(socials.getByRole('link', { name, exact: true })).toBeVisible()
    expect(await socials.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true)
    const rows = await socialLinks.evaluateAll((links) =>
      links.map((link) => link.getBoundingClientRect().y),
    )
    expect(Math.max(...rows) - Math.min(...rows)).toBeLessThan(1)
    expect(
      await socials
        .locator('bdi')
        .first()
        .evaluate((el) => getComputedStyle(el).display),
    ).toBe('none')
    const pills = navigation.getByRole('button')
    await expect(pills).toHaveCount(6)
    await expect(pills.first()).toHaveAttribute('aria-current', 'true')
    await pills.last().click()
    await expect(pills.last()).toHaveAttribute('aria-current', 'true')
    await expect
      .poll(() =>
        rail.evaluate((el) => Math.abs(el.scrollLeft) >= el.scrollWidth - el.clientWidth - 2),
      )
      .toBe(true)
    await rail.evaluate((el) => el.scrollTo({ left: 0, behavior: 'instant' }))
    await expect(pills.first()).toHaveAttribute('aria-current', 'true')
    await pills.nth(2).focus()
    await page.keyboard.press('Enter')
    await expect(pills.nth(2)).toHaveAttribute('aria-current', 'true')
    expect(await pills.nth(2).evaluate((el) => el.matches(':focus-visible'))).toBe(true)
    const marks = await pills.evaluateAll((buttons) =>
      buttons.map((button) => {
        const mark = getComputedStyle(button, '::after')
        return {
          width: parseFloat(mark.width),
          border: getComputedStyle(button).borderWidth,
          transition: mark.transitionDuration,
        }
      }),
    )
    expect(marks[2].width).toBe(60)
    expect(marks[0].width).toBe(20)
    expect(
      marks.every(
        (mark) =>
          mark.border === '0px' &&
          mark.transition.split(',').every((duration) => parseFloat(duration) <= 0.001),
      ),
    ).toBe(true)
    const gap = await page.locator('#events').evaluate((section) => {
      const cards = section.querySelector('[data-event-rail]')!.getBoundingClientRect()
      const controls = section.querySelector('[data-event-navigation]')!.getBoundingClientRect()
      return Math.abs(
        controls.y +
          controls.height / 2 -
          (cards.bottom + section.getBoundingClientRect().bottom) / 2,
      )
    })
    expect(gap).toBeLessThan(2)
    await page.setViewportSize({ width: 320, height: 900 })
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
    await expect(navigation).toBeVisible()
    await expect(pills).toHaveCount(6)
    const scan = await new AxeBuilder({ page })
      .include('#events')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(scan.violations).toEqual([])
  })
}

test('events retain native scrolling without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  })
  const page = await context.newPage()
  await page.goto(pageHref('news', 'fr'))
  await expect(page.locator('#events article')).toHaveCount(6)
  await expect(page.locator('[data-event-navigation]')).toHaveCount(0)
  expect(
    await page.locator('[data-event-rail]').evaluate((el) => el.scrollWidth > el.clientWidth),
  ).toBe(true)
  await context.close()
})
