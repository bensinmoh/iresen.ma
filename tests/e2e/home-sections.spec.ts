import { expect, test, type Locator, type Page } from '@playwright/test'
import { locales } from '../../src/i18n/locales'
import { homeMissions } from '../../src/lib/home-missions'
import { homeNavigation } from '../../src/lib/home-navigation'
import { pageHref } from '../../src/lib/site'

const sectionIds = [
  'develop-test-transfer',
  'results',
  'research-priorities',
  'platforms-expertise',
  'collaboration',
  'news-events',
] as const

const missions = homeMissions

// Chrome can expose the new media-query state before recalculating vw-based gutters.
// Wait for layout frames before measuring or navigating to a responsive hash target.
async function setViewportSize(page: Page, size: Parameters<Page['setViewportSize']>[0]) {
  await page.setViewportSize(size)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
}

async function waitForFonts(page: Page) {
  await page.evaluate(() => document.fonts.ready)
}

async function expectPhotoCardComposition(card: Locator) {
  const composition = await card.evaluate((element) => {
    const frame = element.getBoundingClientRect()
    const image = element.querySelector('img')!
    const photo = image.parentElement!.getBoundingClientRect()
    const link = element.querySelector('a')!.getBoundingClientRect()
    return {
      imageFillsCard:
        Math.abs(photo.left - frame.left) <= 2 &&
        Math.abs(photo.top - frame.top) <= 2 &&
        Math.abs(photo.width - frame.width) <= 2 &&
        Math.abs(photo.height - frame.height) <= 2,
      imageCoversFrame: getComputedStyle(image).objectFit === 'cover',
      actionAtBottom: link.bottom > frame.top + frame.height / 2 && link.bottom <= frame.bottom,
    }
  })
  expect(composition).toEqual({
    imageFillsCard: true,
    imageCoversFrame: true,
    actionAtBottom: true,
  })
  for (const text of await card.locator('h3, p, a').all()) {
    await expect(text).toHaveCSS('color', /^rgba?\(255, 255, 255(?:, [\d.]+)?\)$/)
  }
}

async function missionVisualState(card: Locator) {
  return card.evaluate((element) => {
    const image = element.querySelector('img')!
    const imageStyle = getComputedStyle(image)
    const overlay = getComputedStyle(element, '::after')
    const frame = element.getBoundingClientRect()
    const heading = element.querySelector('h3')!.getBoundingClientRect()
    return {
      scale: new DOMMatrixReadOnly(imageStyle.transform).a,
      blueOpacity: Number(overlay.opacity),
      blueColor: overlay.backgroundColor,
      imageTransition: imageStyle.transitionProperty,
      overlayTransition: overlay.transitionProperty,
      width: frame.width,
      height: frame.height,
      headingLeft: heading.left - frame.left,
      headingTop: heading.top - frame.top,
      text: element.textContent,
    }
  })
}

async function expectMissionGeometryStable(
  card: Locator,
  previous: Awaited<ReturnType<typeof missionVisualState>>,
) {
  const current = await missionVisualState(card)
  for (const key of ['width', 'height', 'headingLeft', 'headingTop'] as const) {
    expect(
      Math.abs(current[key] - previous[key]),
      `${key} stays stable during visual feedback`,
    ).toBeLessThanOrEqual(1)
  }
  expect(current.text).toBe(previous.text)
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
    const id = await card.getAttribute('id')
    await expect
      .poll(
        async () => {
          const contained = await horizontallyContained(card)
          if (!contained) await page.keyboard.press(key)
          return contained
        },
        {
          message: `#${id} fits inside the collection after native arrow scrolling`,
          timeout: 10_000,
          intervals: [250],
        },
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
            return JSON.stringify({
              top,
              barTop: bar.top,
              barBottom: bar.bottom,
              padding,
              clearance,
              aligned:
                Math.abs(bar.top) <= 1 &&
                (nativeFallback ? clearance >= -2 : Math.abs(clearance) <= 2),
            })
          },
          { targetId: id, nativeFallback },
        ),
      { message: `#${id} must align below the pinned bar and the page's scroll padding` },
    )
    .toContain('"aligned":true')
}

for (const locale of locales) {
  test(`${locale}: homepage navigation follows the figures and appears from 1024px`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await setViewportSize(page, { width: 1023, height: 900 })
    await page.goto(pageHref('home', locale))
    await waitForFonts(page)
    const nav = page.locator('.home-section-navigation')
    await expect(nav).toBeHidden()
    await expect(page.locator('#main-content > .page-hero + .home-section-navigation')).toHaveCount(
      1,
    )
    await expect(page.locator('#figures')).toHaveCount(1)

    await setViewportSize(page, { width: 1024, height: 900 })
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
    await setViewportSize(page, { width: 1440, height: 900 })
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
    await setViewportSize(page, { width: 1440, height: 900 })
    await page.goto(pageHref('home', locale))
    await waitForFonts(page)
    const section = page.locator('#develop-test-transfer')
    await expect(section).toHaveAccessibleName(/\S/)
    await expect(section.getByRole('heading', { level: 2 })).toHaveCount(1)
    await expect(section.getByRole('article')).toHaveCount(3)
    await expect(section.locator('blockquote')).toContainText(/IRESEN/)
    const quotationMarks = section.locator('blockquote > p > span')
    await expect(quotationMarks).toHaveCount(2)
    const pairedStyles = await quotationMarks.evaluateAll((marks) =>
      marks.map((mark) => {
        const style = getComputedStyle(mark)
        return {
          display: style.display,
          size: style.fontSize,
          weight: style.fontWeight,
          margin: style.marginInline,
          color: style.color,
        }
      }),
    )
    expect(pairedStyles[0]).toEqual(pairedStyles[1])
    expect(pairedStyles[0].display).toBe('inline')
    const band = section.locator('#mission-cooperation')
    await expect(band).toHaveAccessibleName(/\S/)
    await expect(band.getByRole('link')).toHaveAttribute('href', pageHref('workWithUs', locale))
    const alignment = await section.evaluate((node) => {
      const quote = node.querySelector('blockquote')!.getBoundingClientRect()
      const cards = node.querySelector('[data-mission-cards]')!.getBoundingClientRect()
      const band = node.querySelector('#mission-cooperation')!.getBoundingClientRect()
      return { quoteWidth: quote.width, cardsWidth: cards.width, bandWidth: band.width }
    })
    expect(alignment.quoteWidth).toBeCloseTo(alignment.cardsWidth, 0)
    expect(alignment.bandWidth).toBeCloseTo(alignment.cardsWidth, 0)

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
      await expect(card.getByRole('link')).toHaveAttribute(
        'href',
        pageHref(mission.pageId, locale, mission.destinationAnchor),
      )
      await expect(card.getByRole('link')).toHaveAccessibleName(/\S/)
      await expectPhotoCardComposition(card)
    }
    const desktopRows = await section
      .getByRole('article')
      .evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().top))
    expect(Math.max(...desktopRows) - Math.min(...desktopRows)).toBeLessThanOrEqual(1)

    for (const width of [320, 390, 1023]) {
      await setViewportSize(page, { width, height: 900 })
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
      for (const card of await section.getByRole('article').all()) {
        await expectPhotoCardComposition(card)
      }
    }
  })

  test(`${locale}: direct home section and mission links land below the sticky navigation`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await setViewportSize(page, { width: 1440, height: 900 })
    for (const id of ['platforms-expertise', 'mission-research']) {
      await page.goto(`${pageHref('home', locale)}#${id}`)
      await waitForFonts(page)
      await expectTargetBelowNavigation(page, id)
      const activeId = id === 'mission-research' ? 'develop-test-transfer' : id
      await expect(page.locator(`.home-section-navigation a[href="#${activeId}"]`)).toHaveAttribute(
        'aria-current',
        'location',
      )
    }
    await setViewportSize(page, { width: 390, height: 900 })
    await page.goto(`${pageHref('home', locale)}#mission-skills`)
    await waitForFonts(page)
    const card = page.locator('#mission-skills')
    await expect(page.locator('.home-section-navigation')).toBeHidden()
    await expect.poll(() => horizontallyContained(card)).toBe(true)
    await expect(card.getByRole('heading', { level: 3 })).toBeInViewport()
    await expect(card.getByRole('link')).toHaveAttribute(
      'href',
      pageHref('network', locale, 'skills-training'),
    )
  })
}

test('mobile missions remain readable and keyboard navigable at 200% text in every locale', async ({
  page,
}) => {
  test.setTimeout(60_000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await setViewportSize(page, { width: 320, height: 900 })
  for (const locale of locales) {
    await page.goto(pageHref('home', locale))
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = '200%'
      // Force the enlarged layout to request its fonts before awaiting readiness.
      void document.body.offsetHeight
      await document.fonts.ready
    })
    const clippedText = await page
      .locator('[data-mission-cards] :is(h3, p, a span)')
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const text = node.getBoundingClientRect()
            const card = node.closest('[data-mission]')!.getBoundingClientRect()
            return (
              node.scrollWidth > node.clientWidth + 1 ||
              node.scrollHeight > node.clientHeight + 1 ||
              text.top < card.top - 1 ||
              text.bottom > card.bottom + 1 ||
              text.left < card.left - 1 ||
              text.right > card.right + 1
            )
          })
          .map((node) => node.textContent),
      )
    expect(clippedText, `${locale}: enlarged mission copy wraps without clipping`).toEqual([])
    await visitMobileMissionsWithKeyboard(page, locale === 'ar' ? 'rtl' : 'ltr')
    await visitMissionLinksWithTab(page)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  }
})

test('wrapped home navigation uses its measured height when text is enlarged', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await setViewportSize(page, { width: 1024, height: 900 })
  for (const locale of locales) {
    await page.goto(pageHref('home', locale))
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = '200%'
      // Force the enlarged layout to request its fonts before awaiting readiness.
      void document.body.offsetHeight
      await document.fonts.ready
    })
    const nav = page.locator('.home-section-navigation')
    await expect(nav).toBeVisible()
    // Text enlargement/font readiness can precede ResizeObserver's layout frame.
    // Test native navigation only after the measured bar reflects that layout.
    await expect
      .poll(() =>
        nav.evaluate((element) => {
          const main = element.closest('main')!
          return (
            parseFloat(getComputedStyle(main).getPropertyValue('--home-section-nav-height')) ===
            element.getBoundingClientRect().height
          )
        }),
      )
      .toBe(true)

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
      await page.goto(`${pageHref('home', locale)}#mission-skills`)
      await waitForFonts(page)
      await expectTargetBelowNavigation(page, 'mission-skills', true)
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
      await page.goto(`${pageHref('home', locale)}#mission-skills`)
      await waitForFonts(page)
      const card = page.locator('#mission-skills')
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
  await setViewportSize(page, { width: 1440, height: 900 })
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

test('mission photos zoom gently and gain a blue tint on hover without moving the copy', async ({
  page,
}) => {
  await setViewportSize(page, { width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(pageHref('home', 'fr'))
  await waitForFonts(page)
  expect(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)).toBe(
    true,
  )

  for (const card of await page.locator('[data-mission]').all()) {
    await card.scrollIntoViewIfNeeded()
    await page.mouse.move(0, 0)
    const initial = await missionVisualState(card)
    expect(initial.scale).toBe(1)
    expect(initial.blueOpacity).toBe(0)
    const rgb = initial.blueColor.match(/\d+/g)!.map(Number)
    expect(rgb[2], 'the feedback layer uses the institutional blue').toBeGreaterThan(rgb[0])
    expect(rgb[2]).toBeGreaterThan(rgb[1])

    await card.hover()
    await expect.poll(async () => (await missionVisualState(card)).scale).toBeGreaterThan(1.02)
    await expect.poll(async () => (await missionVisualState(card)).blueOpacity).toBeGreaterThan(0.1)
    expect((await missionVisualState(card)).scale, 'zoom remains subtle').toBeLessThanOrEqual(1.08)
    await expectMissionGeometryStable(card, initial)
    await expectPhotoCardComposition(card)

    await page.mouse.move(0, 0)
    await expect.poll(async () => (await missionVisualState(card)).scale).toBeLessThanOrEqual(1.001)
    await expect.poll(async () => (await missionVisualState(card)).blueOpacity).toBe(0)
    await expectMissionGeometryStable(card, initial)
  }
})

test('keyboard mission feedback remains visible when reduced motion disables photo zoom', async ({
  page,
}) => {
  await setViewportSize(page, { width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(pageHref('home', 'ar'))
  await waitForFonts(page)
  const card = page.locator('#mission-studies')
  const link = card.getByRole('link')
  await page.mouse.move(0, 0)
  const initial = await missionVisualState(card)
  await page.locator('[data-mission-cards]').focus()
  await page.keyboard.press('Tab')
  await expect(link).toBeFocused()
  await expect(link).toHaveCSS('outline-style', 'solid')
  await expect.poll(async () => (await missionVisualState(card)).blueOpacity).toBeGreaterThan(0.1)
  await expectMissionGeometryStable(card, initial)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect.poll(async () => (await missionVisualState(card)).scale).toBe(1)
  const reduced = await missionVisualState(card)
  expect(
    reduced.blueOpacity,
    'focus feedback survives the motion preference change',
  ).toBeGreaterThan(0.1)
  expect(reduced.imageTransition).toBe('none')
  expect(reduced.overlayTransition).toBe('none')
  await expectMissionGeometryStable(card, initial)

  // Exercise a hover independently of focus under the same reduced-motion preference.
  await page.locator('[data-mission-cards]').focus()
  await card.hover()
  const hovered = await missionVisualState(card)
  expect(hovered.scale).toBe(1)
  expect(hovered.blueOpacity).toBeGreaterThan(0.1)
  await page.mouse.move(0, 0)
  expect((await missionVisualState(card)).blueOpacity).toBe(0)
  await expectMissionGeometryStable(card, initial)
})

test('touching a mobile mission photo does not leave a hover zoom or tint', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
  })
  try {
    const page = await context.newPage()
    await page.goto(pageHref('home', 'fr'))
    await waitForFonts(page)
    expect(
      await page.evaluate(() => matchMedia('(hover: none) and (pointer: coarse)').matches),
    ).toBe(true)
    const card = page.locator('#mission-studies')
    await card.scrollIntoViewIfNeeded()
    const initial = await missionVisualState(card)
    await card.tap({ position: { x: 30, y: 30 } })
    const tapped = await missionVisualState(card)
    expect(tapped.scale).toBe(1)
    expect(tapped.blueOpacity).toBe(0)
    await expectMissionGeometryStable(card, initial)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  } finally {
    await context.close()
  }
})
