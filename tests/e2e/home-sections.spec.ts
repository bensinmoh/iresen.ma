import { expect, test, type Page } from './fixtures'
import { locales } from '../../src/i18n/locales'
import { researchMissions, complementaryDimensions } from '../../src/lib/institutional-narrative'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }
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

const catalogs = { fr, en, ar }

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
              margin: getComputedStyle(target).scrollMarginBlockStart,
              scrollY,
              navHeight: getComputedStyle(target).getPropertyValue('--home-section-nav-height'),
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

  test(`${locale}: the research core and complementary dimensions have distinct working destinations`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(pageHref('home', locale))
    const section = page.locator('#develop-test-transfer')
    await expect(section).toHaveAccessibleName(/\S/)
    await expect(section.locator('blockquote')).toContainText(catalogs[locale].Institute.statement)
    const core = section.locator('#mission-research')
    await expect(core.locator('h3')).toHaveText(catalogs[locale].Narrative.coreTitle)
    await expect(core.locator('h4')).toHaveCount(3)
    if (locale === 'fr')
      await expect(core).not.toContainText('Trois missions complémentaires, sans étapes obligées.')
    for (const mission of researchMissions) {
      const item = page.locator(`#${mission.legacyAnchor}`)
      await expect(item.locator('h4')).toHaveText(
        catalogs[locale].Narrative.missions[mission.id].title,
      )
      await expect(item.locator('a')).toHaveAttribute('href', pageHref(mission.pageId, locale))
    }
    for (const dimension of complementaryDimensions) {
      const item = page.locator(`#mission-${dimension.id}`)
      await expect(item.locator('h3')).toHaveText(
        catalogs[locale].Narrative.dimensions[dimension.id].title,
      )
      await expect(item.locator('a')).toHaveAttribute(
        'href',
        pageHref(dimension.pageId, locale, dimension.anchor),
      )
    }
    for (const width of [1440, 1024, 768, 390, 320]) {
      await setViewportSize(page, { width, height: 900 })
      await waitForFonts(page)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      for (const link of await section.locator('a').all()) {
        await link.focus()
        await expect(link).toBeFocused()
        await expect(link).toBeInViewport()
        expect(
          await link.evaluate((el) => el.getBoundingClientRect().height),
        ).toBeGreaterThanOrEqual(44)
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
    expect(await card.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
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
    for (const link of await page.locator('[data-integrated-model] a').all()) {
      await link.focus()
      await expect(link).toBeInViewport()
    }
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
      void document.body.offsetHeight
      await document.fonts.ready
    })
    const nav = page.locator('.home-section-navigation')
    await expect(nav).toBeVisible()
    // Font readiness precedes the observers' layout frames. Both the pinned bar
    // and hero header must reflect the enlarged layout before native navigation.
    await expect
      .poll(() =>
        nav.evaluate((element) => {
          const main = element.closest('main')!
          const hero = document.querySelector('.page-hero')!
          const header = document.querySelector('.site-header')!
          return (
            parseFloat(getComputedStyle(main).getPropertyValue('--home-section-nav-height')) ===
              element.getBoundingClientRect().height &&
            parseFloat(getComputedStyle(hero).getPropertyValue('--hero-header-height')) ===
              header.getBoundingClientRect().height
          )
        }),
      )
      .toBe(true)
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    )

    // Wait for the enlarged document, not only its header, to settle before
    // testing the native anchor. Font swaps can move preceding body sections.
    let previousLayout = ''
    let stableLayouts = 0
    await expect
      .poll(async () => {
        const layout = await page.evaluate(() =>
          JSON.stringify([
            document.getElementById('research-priorities')!.getBoundingClientRect().top + scrollY,
            document.querySelector('.home-section-navigation')!.getBoundingClientRect().height,
            document.querySelector('main')!.getBoundingClientRect().height,
          ]),
        )
        stableLayouts = layout === previousLayout ? stableLayouts + 1 : 0
        previousLayout = layout
        return stableLayouts >= 3
      })
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
      await expect(page.locator('#develop-test-transfer').getByRole('article')).toHaveCount(7)
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
      for (const link of await page.locator('[data-integrated-model] a').all()) {
        await link.focus()
        await expect(link).toBeInViewport()
      }
      await page.goto(`${pageHref('home', locale)}#mission-skills`)
      await waitForFonts(page)
      const card = page.locator('#mission-skills')
      expect(await card.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
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
