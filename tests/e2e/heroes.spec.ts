import { expect, test, type Locator, type Page } from '@playwright/test'
import { pageHref, pageIds } from '../../src/lib/site'
import { locales } from '../../src/i18n/locales'
import ar from '../../src/messages/ar.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import fr from '../../src/messages/fr.json' with { type: 'json' }

const catalogs = { ar, en, fr }

async function figureIsContained(figure: Locator) {
  return figure.evaluate((element) => {
    const strip = element.closest('.hero-figures')!
    const region = strip.getBoundingClientRect()
    const item = element.getBoundingClientRect()
    return (
      item.left >= region.left - 1 &&
      item.right <= region.right + 1 &&
      item.top >= region.top - 1 &&
      item.bottom <= region.bottom + 1
    )
  })
}

async function expectFigureLabelsUnclipped(figures: Locator) {
  const clippedLabels = await figures.locator('.key-figure-label').evaluateAll((labels) =>
    labels
      .filter((element) => {
        const label = element as HTMLElement
        return (
          label.scrollWidth > label.clientWidth + 1 || label.scrollHeight > label.clientHeight + 1
        )
      })
      .map((element) => element.textContent),
  )
  expect(clippedLabels, 'every figure description must wrap without clipping').toEqual([])
}

async function visitFiguresWithKeyboard(page: Page, direction: 'ltr' | 'rtl') {
  const figures = page.locator('.hero-figures')
  await page.locator('.hero-actions a').last().focus()
  await page.keyboard.press('Tab')
  await expect(figures).toBeFocused()
  await expect(figures).toHaveAccessibleName(/\S/)
  await expect(figures).toHaveCSS('outline-style', 'solid')
  const key = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
  for (const figure of await figures.locator('.key-figure').all()) {
    await expect
      .poll(
        async () => {
          const contained = await figureIsContained(figure)
          if (!contained) await page.keyboard.press(key)
          return contained
        },
        { timeout: 10_000, intervals: [100] },
      )
      .toBe(true)
  }
  await expectFigureLabelsUnclipped(figures)
}

for (const locale of locales) {
  test(`${locale}: standard page heroes retain a working section link`, async ({ page }) => {
    test.setTimeout(120_000)
    await page.setViewportSize({ width: 1440, height: 900 })
    // Contact follows its own approved split introduction and is covered in contact.spec.ts.
    for (const id of pageIds.filter((pageId) => pageId !== 'contact' && pageId !== 'search')) {
      await page.goto(pageHref(id, locale))
      const hero = page.locator('.page-hero')
      await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(hero.locator('.hero-description')).toBeVisible()
      if (id === 'home') {
        await expect(hero.locator('.hero-certification')).toBeVisible()
        await expect(hero.locator('.hero-certification')).toContainText('9001:2015')
        await expect(hero.locator('.hero-figures dt')).toHaveCount(5)
        await expect(hero.locator('.hero-figures dd')).toHaveText([
          '69',
          '+60',
          '+1000',
          '+1100',
          '+18',
        ])
        await expect(hero.locator('.hero-pathways')).toHaveCount(0)
        await expect(hero.locator('.hero-founding')).toHaveCount(0)
      } else {
        await expect(hero.locator('.hero-certification')).toHaveCount(0)
      }
      await expect(hero.locator('.hero-photo')).toHaveJSProperty('complete', true)
      expect(
        await hero
          .locator('.hero-photo')
          .evaluate((image) => (image as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0)
      const bounds = await hero.boundingBox()
      expect(bounds!.y).toBe(0)
      expect(Math.abs(bounds!.height - 900), id).toBeLessThanOrEqual(2)
      await hero.locator('.hero-primary').click()
      await expect(page).toHaveURL(/#page-sections$/)
      const section = await page.locator('#page-sections').boundingBox()
      expect(Math.abs(section!.y)).toBeLessThanOrEqual(25)
    }
  })

  test(`${locale}: the full landing resizes with the viewport, then reflows for enlarged text`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(pageHref('home', locale))
    const hero = page.locator('.page-hero')
    // Narrow landings may grow for the copy and stacked actions.
    await expect.poll(async () => (await hero.boundingBox())!.height).toBeGreaterThanOrEqual(844)
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect.poll(async () => (await hero.boundingBox())!.height).toBe(1024)
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect.poll(async () => (await hero.boundingBox())!.height).toBe(900)

    await page.setViewportSize({ width: 320, height: 568 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(overflow).toBe(false)
    const figures = hero.locator('.hero-figures')
    for (const figure of await figures.locator('.key-figure').all()) {
      await figure.scrollIntoViewIfNeeded()
      await expect.poll(() => figureIsContained(figure)).toBe(true)
    }
    await expectFigureLabelsUnclipped(figures)
    const headerBounds = await page.getByRole('banner').boundingBox()
    const titleBounds = await hero.locator('h1').boundingBox()
    expect(titleBounds!.y).toBeGreaterThan(headerBounds!.y + headerBounds!.height)
  })

  test(`${locale}: the mobile homepage keeps clear actions and all five figures across its breakpoint`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const width of [320, 390, 640, 641, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(pageHref('home', locale))
      const hero = page.locator('.page-hero')
      const figures = hero.locator('.hero-figures')
      const actions = hero.locator('.hero-actions')
      await expect(figures).toHaveAccessibleName(catalogs[locale].Hero.figuresLabel)
      await expect(figures.locator('.key-figure-value')).toHaveText([
        '69',
        '+60',
        '+1000',
        '+1100',
        '+18',
      ])
      await expect(actions.locator('a')).toHaveCount(2)
      await expectFigureLabelsUnclipped(figures)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
        `${locale} at ${width}px must contain the strip within the page`,
      ).toBe(false)
      const overflow = await figures.evaluate(
        (element) => element.scrollWidth > element.clientWidth + 1,
      )
      if (width <= 640) {
        await expect(hero.locator('.hero-certification')).toBeHidden()
        await expect(hero.locator('.hero-scroll')).toBeHidden()
        expect(
          overflow,
          'the figures should remain available through their own scroll region',
        ).toBe(true)
        const bounds = (await actions.boundingBox())!
        const first = (await actions.locator('a').first().boundingBox())!
        const second = (await actions.locator('a').last().boundingBox())!
        expect(Math.abs(first.x - bounds.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(second.x - bounds.x)).toBeLessThanOrEqual(1)
        expect(Math.abs(first.width - bounds.width)).toBeLessThanOrEqual(1)
        expect(Math.abs(second.width - bounds.width)).toBeLessThanOrEqual(1)
        expect(second.y).toBeGreaterThanOrEqual(first.y + first.height)
        expect(first.height).toBeGreaterThanOrEqual(44)
        expect(second.height).toBeGreaterThanOrEqual(44)
        const rows = await figures
          .locator('.key-figure')
          .evaluateAll((items) => items.map((element) => element.getBoundingClientRect().y))
        expect(Math.max(...rows) - Math.min(...rows)).toBeLessThanOrEqual(1)
      } else {
        await expect(hero.locator('.hero-certification')).toBeVisible()
        await expect(hero.locator('.hero-scroll')).toBeVisible()
        expect(overflow, 'larger layouts retain the existing wrapping figure grid').toBe(false)
      }
    }
  })

  test(`${locale}: keyboard users can read every mobile homepage figure`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(pageHref('home', locale))
    await visitFiguresWithKeyboard(page, locale === 'ar' ? 'rtl' : 'ltr')
  })
}

test('the centered scroll cue supports motion preferences and keyboard navigation', async ({
  page,
}) => {
  for (const locale of locales) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: width === 390 ? 'reduce' : 'no-preference' })
      // The homepage mobile cue is redundant with its full-width section action.
      await page.goto(pageHref(width === 390 ? 'institute' : 'home', locale))
      const cue = page.locator('.hero-scroll')
      await expect(cue).toHaveAccessibleName(/\S/)
      const wheel = cue.locator('.hero-scroll-wheel')
      await expect(wheel).toHaveCSS('animation-name', width === 390 ? 'none' : 'hero-scroll-wheel')
      const cueBounds = (await cue.boundingBox())!
      const actionsBounds = (await page.locator('.hero-actions').boundingBox())!
      const bandBounds = (await page.locator('.hero-highlights').boundingBox())!
      expect(Math.abs(cueBounds.x + cueBounds.width / 2 - width / 2)).toBeLessThan(1)
      expect(cueBounds.width).toBeGreaterThanOrEqual(44)
      expect(cueBounds.height).toBeGreaterThanOrEqual(44)
      expect(cueBounds.y - actionsBounds.y - actionsBounds.height).toBeGreaterThanOrEqual(15)
      expect(bandBounds.y - cueBounds.y - cueBounds.height).toBeGreaterThanOrEqual(11)
      await cue.focus()
      await expect(cue).toBeFocused()
      await expect(cue).toHaveCSS('outline-style', 'solid')
      await page.keyboard.press('Enter')
      await expect(page).toHaveURL(/#page-sections$/)
      const section = (await page.locator('#page-sections').boundingBox())!
      expect(Math.abs(section.y)).toBeLessThanOrEqual(25)
    }
  }
})

test('without JavaScript the Arabic mobile homepage figures remain keyboard accessible', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  })
  try {
    const page = await context.newPage()
    await page.goto(pageHref('home', 'ar'))
    await expect(page.locator('.hero-certification')).toBeHidden()
    await expect(page.locator('.hero-scroll')).toBeHidden()
    await visitFiguresWithKeyboard(page, 'rtl')
    await page.locator('.hero-primary').click()
    await expect(page).toHaveURL(/#page-sections$/)
  } finally {
    await context.close()
  }
})

test('without JavaScript the hero, section navigation and Arabic content remain usable', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto(`http://127.0.0.1:3000${pageHref('institute', 'ar')}`)
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('.page-hero h1')).toBeVisible()
  await page.locator('.hero-scroll').click()
  await expect(page).toHaveURL(/#page-sections$/)
  await expect(page.locator('.section-navigation')).toBeVisible()
  await context.close()
})
