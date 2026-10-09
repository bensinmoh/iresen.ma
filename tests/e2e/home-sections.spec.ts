import { expect, test, type Locator, type Page } from '@playwright/test'
import { locales } from '../../src/i18n/locales'
import { homeNavigation } from '../../src/lib/home-navigation'
import { pageHref } from '../../src/lib/site'

const sectionIds = [
  'develop-test-transfer',
  'research-priorities',
  'results',
  'platforms-expertise',
  'collaboration',
  'news-events',
] as const

const missions = [
  { id: 'develop', pageId: 'programmes' },
  { id: 'test', pageId: 'platforms' },
  { id: 'transfer', pageId: 'transfer' },
] as const

async function waitForFonts(page: Page) {
  await page.evaluate(() => document.fonts.ready)
}

async function horizontallyContained(element: Locator) {
  return element.evaluate((node) => {
    const region = node.closest('[data-mission-cards]')!.getBoundingClientRect()
    const bounds = node.getBoundingClientRect()
    return bounds.left >= region.left - 1 && bounds.right <= region.right + 1
  })
}

async function visitMobileMissionsWithKeyboard(page: Page, direction: 'ltr' | 'rtl') {
  const cards = page.locator('[data-mission-cards]')
  await cards.focus()
  await expect(cards).toBeFocused()
  await expect(cards).toHaveAccessibleName(/\S/)
  await expect(cards).toHaveCSS('outline-style', 'solid')
  const key = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
  for (const card of await cards.getByRole('article').all()) {
    await expect
      .poll(
        async () => {
          const contained = await horizontallyContained(card)
          if (!contained) await page.keyboard.press(key)
          return contained
        },
        { timeout: 10_000, intervals: [100] },
      )
      .toBe(true)
  }
}

async function visitMissionLinksWithTab(page: Page) {
  const cards = page.locator('[data-mission-cards]')
  await cards.focus()
  for (const link of await cards.getByRole('link').all()) {
    await page.keyboard.press('Tab')
    await expect(link).toBeFocused()
    await expect(link).toBeInViewport()
    await expect.poll(() => horizontallyContained(link)).toBe(true)
    expect(
      await link.evaluate((node) => node.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(44)
  }
}

async function expectTargetBelowNavigation(page: Page, id: string, nativeFallback = false) {
  await expect
    .poll(
      () =>
        page.evaluate(
          ({ targetId, nativeFallback }) => {
            const nav = document.querySelector('.home-section-navigation')!
            const target = document.getElementById(targetId)!
            const bar = nav.getBoundingClientRect()
            const top = target.getBoundingClientRect().top
            const padding = parseFloat(
              getComputedStyle(document.documentElement).scrollPaddingBlockStart,
            )
            const clearance = top - bar.bottom - padding
            return (
              Math.abs(bar.top) <= 1 &&
              (nativeFallback ? clearance >= -2 : Math.abs(clearance) <= 2)
            )
          },
          { targetId: id, nativeFallback },
        ),
      { message: `#${id} must align below the pinned bar and the page's scroll padding` },
    )
    .toBe(true)
}

for (const locale of locales) {
  test(`${locale}: homepage navigation follows the figures and appears from 1024px`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1023, height: 900 })
    await page.goto(pageHref('home', locale))
    await waitForFonts(page)
    const nav = page.locator('.home-section-navigation')
    await expect(nav).toBeHidden()
    await expect(page.locator('#main-content > .page-hero + .home-section-navigation')).toHaveCount(
      1,
    )
    await expect(page.locator('#figures')).toHaveCount(1)

    await page.setViewportSize({ width: 1024, height: 900 })
    await expect(nav).toBeVisible()
    await expect(nav).toHaveAccessibleName(homeNavigation[locale].label)
    await expect(nav.locator('a')).toHaveText(
      homeNavigation[locale].items.map((item) => item.label),
    )
    expect(
      await nav.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
    ).toEqual(sectionIds.map((id) => `#${id}`))
    const positions = await nav.evaluate((element) => ({
      navTop: element.getBoundingClientRect().top,
      figuresBottom: document.getElementById('figures')!.getBoundingClientRect().bottom,
    }))
    expect(positions.navTop).toBeGreaterThanOrEqual(positions.figuresBottom - 1)
    await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)

    await page.goto(pageHref('institute', locale))
    await expect(page.locator('.home-section-navigation')).toHaveCount(0)
  })

  test(`${locale}: home anchors reveal their sections and scrolling updates the current link`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('home', locale))
    await waitForFonts(page)
    const nav = page.locator('.home-section-navigation')

    for (const [index, id] of sectionIds.entries()) {
      const link = nav.locator(`a[href="#${id}"]`)
      if (index === 0) {
        await link.focus()
        await expect(link).toHaveCSS('outline-style', 'solid')
        await page.keyboard.press('Enter')
      } else {
        await link.click()
      }
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expectTargetBelowNavigation(page, id)
      await expect(link).toHaveAttribute('aria-current', 'location')
      await expect(nav.locator('[aria-current="location"]')).toHaveCount(1)
      await expect(page.locator(`#${id}`).getByRole('heading', { level: 2 })).toBeInViewport()
    }
    expect(
      await page
        .locator('.site-header')
        .evaluate((header) => header.getBoundingClientRect().bottom),
    ).toBeLessThanOrEqual(0)

    const focusedLink = nav.locator('a[href="#research-priorities"]')
    await focusedLink.focus()
    const previousUrl = page.url()
    await page.evaluate(() => {
      const section = document.getElementById('results')!
      const nav = document.querySelector('.home-section-navigation')!
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingBlockStart)
      window.scrollTo({
        top:
          section.getBoundingClientRect().top +
          window.scrollY -
          nav.getBoundingClientRect().height -
          padding,
        behavior: 'instant',
      })
    })
    await expect(nav.locator('a[href="#results"]')).toHaveAttribute('aria-current', 'location')
    await expect(focusedLink).toBeFocused()
    expect(page.url()).toBe(previousUrl)
  })

  test(`${locale}: all three missions keep their images and canonical destinations on narrow screens`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('home', locale))
    await waitForFonts(page)
    const section = page.locator('#develop-test-transfer')
    await expect(section).toHaveAccessibleName(/\S/)
    await expect(section.getByRole('heading', { level: 2 })).toHaveCount(1)
    await expect(section.getByRole('article')).toHaveCount(3)

    for (const mission of missions) {
      const card = section.locator(`#mission-${mission.id}[data-mission="${mission.id}"]`)
      await expect(card).toHaveAccessibleName(/\S/)
      await expect(card.getByRole('heading', { level: 3 })).toBeVisible()
      const photo = card.getByRole('img')
      await expect(photo).toHaveCount(1)
      await expect(photo).toHaveAttribute('alt', /\S/)
      await photo.evaluate((image) => (image as HTMLImageElement).decode())
      expect(
        await photo.evaluate((image) => (image as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0)
      await expect(card.getByRole('link')).toHaveAttribute('href', pageHref(mission.pageId, locale))
      await expect(card.getByRole('link')).toHaveAccessibleName(/\S/)
    }
    const desktopRows = await section
      .getByRole('article')
      .evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().top))
    expect(Math.max(...desktopRows) - Math.min(...desktopRows)).toBeLessThanOrEqual(1)

    for (const width of [320, 390, 1023]) {
      await page.setViewportSize({ width, height: 900 })
      await expect(page.locator('.home-section-navigation')).toBeHidden()
      const cards = section.locator('[data-mission-cards]')
      // Start each responsive view at the first mission, including the RTL scroll origin.
      await cards.evaluate((element) => element.scrollTo({ left: 0, behavior: 'instant' }))
      const bounds = await section.getByRole('article').evaluateAll((cards) =>
        cards.map((card) => {
          const rect = card.getBoundingClientRect()
          return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }
        }),
      )
      if (width < 768) {
        expect(
          Math.max(...bounds.map((card) => card.top)) - Math.min(...bounds.map((card) => card.top)),
        ).toBeLessThanOrEqual(1)
        expect(await cards.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
          true,
        )
        expect(await horizontallyContained(section.getByRole('article').first())).toBe(true)
        const region = (await cards.boundingBox())!
        if (locale === 'ar') {
          expect(bounds[1].right, 'the next mission peeks from the inline end').toBeGreaterThan(
            region.x,
          )
          expect(bounds[1].left).toBeLessThan(region.x)
        } else {
          expect(bounds[1].left, 'the next mission peeks from the inline end').toBeLessThan(
            region.x + region.width,
          )
          expect(bounds[1].right).toBeGreaterThan(region.x + region.width)
        }
        await visitMobileMissionsWithKeyboard(page, locale === 'ar' ? 'rtl' : 'ltr')
        await visitMissionLinksWithTab(page)
      } else {
        for (const [index, card] of bounds.entries()) {
          expect(card.left).toBeGreaterThanOrEqual(-1)
          expect(card.right).toBeLessThanOrEqual(width + 1)
          if (index > 0) expect(card.top).toBeGreaterThanOrEqual(bounds[index - 1].bottom)
        }
        expect(await cards.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
          true,
        )
        await visitMissionLinksWithTab(page)
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${locale}, ${width}px: every mission remains available without horizontal page scrolling`,
      ).toBe(true)
    }
  })

  test(`${locale}: direct home section and mission links land below the sticky navigation`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 900 })
    for (const id of ['platforms-expertise', 'mission-test']) {
      await page.goto(`${pageHref('home', locale)}#${id}`)
      await waitForFonts(page)
      await expectTargetBelowNavigation(page, id)
      const activeId = id === 'mission-test' ? 'develop-test-transfer' : id
      await expect(page.locator(`.home-section-navigation a[href="#${activeId}"]`)).toHaveAttribute(
        'aria-current',
        'location',
      )
    }
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(`${pageHref('home', locale)}#mission-transfer`)
    await waitForFonts(page)
    const card = page.locator('#mission-transfer')
    await expect(page.locator('.home-section-navigation')).toBeHidden()
    await expect.poll(() => horizontallyContained(card)).toBe(true)
    await expect(card.getByRole('heading', { level: 3 })).toBeInViewport()
    await expect(card.getByRole('link')).toHaveAttribute('href', pageHref('transfer', locale))
  })
}

test('mobile missions remain readable and keyboard navigable at 200% text in every locale', async ({
  page,
}) => {
  test.setTimeout(60_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 900 })
  for (const locale of locales) {
    await page.goto(pageHref('home', locale))
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = '200%'
      await document.fonts.ready
    })
    await visitMobileMissionsWithKeyboard(page, locale === 'ar' ? 'rtl' : 'ltr')
    await visitMissionLinksWithTab(page)
    const clippedText = await page
      .locator('[data-mission-cards] :is(h3, p, a span)')
      .evaluateAll((nodes) =>
        nodes
          .filter(
            (node) =>
              node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1,
          )
          .map((node) => node.textContent),
      )
    expect(clippedText, `${locale}: enlarged mission copy wraps without clipping`).toEqual([])
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
})

test('wrapped home navigation uses its measured height when text is enlarged', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1024, height: 900 })
  for (const locale of locales) {
    await page.goto(pageHref('home', locale))
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = '200%'
      await document.fonts.ready
    })
    const nav = page.locator('.home-section-navigation')
    await expect(nav).toBeVisible()
    const link = nav.locator('a[href="#research-priorities"]')
    await link.click()
    await expectTargetBelowNavigation(page, 'research-priorities')
    await expect(link).toHaveAttribute('aria-current', 'location')
    expect(await nav.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
})

test('native home anchors remain usable without JavaScript in every locale', async ({
  browser,
  baseURL,
}) => {
  test.setTimeout(60_000)
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    reducedMotion: 'reduce',
    viewport: { width: 1440, height: 900 },
  })
  try {
    const page = await context.newPage()
    for (const locale of locales) {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(pageHref('home', locale))
      await waitForFonts(page)
      const nav = page.locator('.home-section-navigation')
      await expect(nav).toBeVisible()
      await nav.locator('a[href="#research-priorities"]').click()
      await expect(page).toHaveURL(/#research-priorities$/)
      await expectTargetBelowNavigation(page, 'research-priorities', true)
      await expect(nav.locator('[aria-current]')).toHaveCount(0)
      await expect(page.locator('#develop-test-transfer').getByRole('article')).toHaveCount(3)
      await page.goto(`${pageHref('home', locale)}#mission-transfer`)
      await waitForFonts(page)
      await expectTargetBelowNavigation(page, 'mission-transfer', true)
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%'
      })
      await nav.locator('a[href="#research-priorities"]').click()
      await expectTargetBelowNavigation(page, 'research-priorities', true)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true)

      await page.setViewportSize({ width: 390, height: 900 })
      await page.goto(pageHref('home', locale))
      await waitForFonts(page)
      await expect(nav).toBeHidden()
      await visitMobileMissionsWithKeyboard(page, locale === 'ar' ? 'rtl' : 'ltr')
      await visitMissionLinksWithTab(page)
      await page.goto(`${pageHref('home', locale)}#mission-transfer`)
      await waitForFonts(page)
      const card = page.locator('#mission-transfer')
      await expect.poll(() => horizontallyContained(card)).toBe(true)
      await expect(card.getByRole('heading', { level: 3 })).toBeInViewport()
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true)
    }
  } finally {
    await context.close()
  }
})

test('home anchor motion follows the visitor motion preference', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(pageHref('home', 'fr'))
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await expect(page.locator('.home-section-navigation a').first()).toHaveCSS(
    'transition-property',
    'none',
  )
  expect(
    await page
      .locator('.home-section-navigation a')
      .first()
      .evaluate((link) => getComputedStyle(link, '::after').transitionProperty),
  ).toBe('none')
})
