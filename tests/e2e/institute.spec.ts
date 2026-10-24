import { test, expect } from './fixtures'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { pageSections } from '../../src/lib/page-sections'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

const catalogs = { fr, en, ar }

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: institute missions, full journey and responsive reading`, async ({ page }) => {
    await page.goto(pageHref('institute', locale))
    await page.evaluate(() => document.fonts.ready)
    const institute = page.locator('[data-institute-page]')
    await expect(institute.locator('h1')).toHaveCount(1)
    await expect(institute.locator('.hero-photo')).toHaveAttribute('data-photo', 'headquarters')
    await expect(institute.locator('.hero-founding .key-figure-label')).toHaveText(
      { fr: 'Depuis', en: 'Since', ar: 'منذ' }[locale],
    )
    const foundingSharesRow = await institute.locator('.hero-founding').evaluate((el) => {
      const label = el.firstElementChild!.getBoundingClientRect()
      const year = el.lastElementChild!.getBoundingClientRect()
      return label.top < year.bottom && label.bottom > year.top
    })
    expect(foundingSharesRow).toBe(true)
    await expect(institute.locator('#mission blockquote p')).toHaveText(
      catalogs[locale].Institute.statement,
    )
    await expect(institute.locator('#institute-mission-title')).toHaveText(
      `${catalogs[locale].Institute.editorial.missionTitle} ${catalogs[locale].Institute.editorial.missionAccent}`,
    )
    if (locale === 'fr')
      await expect(institute).not.toContainText('Son action contribue à éclairer les décisions')
    await expect(institute.locator('details')).toHaveCount(3)
    await expect(institute.locator('#capabilities details[open]')).toHaveCount(0)
    await expect(institute.locator('#institute-history ol > li')).toHaveCount(8)
    await expect(institute.locator('#institute-history aside')).toHaveCount(0)
    await expect(institute.locator('#institute-history li').first()).toContainText('2011')
    await expect(institute.locator('#institute-history li').last()).toContainText('2026')
    if (locale === 'fr')
      await expect(institute).not.toContainText('Autres réalisations importantes')
    for (const section of pageSections.institute)
      for (const { id } of [section, ...(section.children ?? [])])
        await expect(institute.locator(`#${id}`)).toHaveCount(1)
    const summary = institute.locator('#institute-skills summary')
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(institute.locator('#institute-skills details')).toHaveAttribute('open', '')
    await expect(institute.locator('#capabilities details[open]')).toHaveCount(1)
    await expect(institute.locator('#institute-studies details')).not.toHaveAttribute('open')
    await expect(institute.locator('#institute-skills li')).toHaveCount(4)
    await page.keyboard.press('Enter')
    await expect(institute.locator('#institute-skills details')).not.toHaveAttribute('open')
    const tabs = institute.getByRole('tab')
    await expect(tabs).toHaveCount(3)
    await tabs.nth(0).focus()
    await page.keyboard.press(locale === 'ar' ? 'ArrowLeft' : 'ArrowRight')
    await expect(tabs.nth(1)).toBeFocused()
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect(institute.getByRole('tabpanel')).toHaveCount(1)
    await expect(institute.getByRole('tabpanel').locator('li')).toHaveCount(4)
    await page.keyboard.press('End')
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('Home')
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
    await page.goto(pageHref('institute', locale, 'institute-model-transfer'))
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
    await expect(institute.locator('#more-resources a[href="#"]')).toHaveCount(2)
    await expect(institute.locator('#more-resources a[download]')).toHaveCount(0)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const rail = institute.locator('#institute-history-rail')
    await expect.poll(() => rail.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true)
    await institute.locator('button[aria-controls="institute-history-rail"]').last().click()
    await expect.poll(() => rail.evaluate((el) => Math.abs(el.scrollLeft))).toBeGreaterThan(10)
    await expect(institute.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
    await institute.locator('button[aria-controls="institute-history-rail"]').first().click()
    await expect.poll(() => rail.evaluate((el) => Math.abs(el.scrollLeft))).toBeLessThan(2)
    for (let milestone = 2; milestone <= 8; milestone++) {
      await institute.locator('button[aria-controls="institute-history-rail"]').last().click()
      await expect(institute.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        String(milestone),
      )
    }
    await expect(
      institute.locator('button[aria-controls="institute-history-rail"]').last(),
    ).toBeDisabled()
    for (let milestone = 7; milestone >= 1; milestone--) {
      await institute.locator('button[aria-controls="institute-history-rail"]').first().click()
      await expect(institute.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        String(milestone),
      )
    }
    await rail.focus()
    await page.keyboard.press(locale === 'ar' ? 'ArrowLeft' : 'ArrowRight')
    await expect.poll(() => rail.evaluate((el) => Math.abs(el.scrollLeft))).toBeGreaterThan(10)
    const cover = institute.locator('img[src*="fifteen-year-report-cover"]')
    await cover.scrollIntoViewIfNeeded()
    await expect
      .poll(() => cover.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0)
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true)
      if (width <= 640) {
        const ambition = institute.locator('#ambition-2035')
        await expect(ambition.locator('blockquote img')).toHaveCount(0)
        for (const image of await ambition.locator('img').all()) await expect(image).toBeHidden()
        await expect(ambition.locator('blockquote p')).toContainText(
          catalogs[locale].Institute.ambition.statement,
        )
      }
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
    await expect
      .poll(() =>
        institute.locator('#ambition-2035').evaluate((el) => {
          const text = el.querySelector('blockquote p')!.getBoundingClientRect()
          const quote = el.querySelector('blockquote')!.getBoundingClientRect()
          return (
            text.height <= quote.height + 1 &&
            Math.abs(text.left + text.width / 2 - (quote.left + quote.width / 2)) < 1
          )
        }),
      )
      .toBe(true)
    const reportOrder = await institute.locator('#more-resources').evaluate((el) => {
      const text = el.querySelector('header')!.parentElement!.getBoundingClientRect()
      const image = el.querySelector('a img')!.getBoundingClientRect()
      const action = el.querySelector('.button')!.getBoundingClientRect()
      return text.bottom <= image.top && image.bottom <= action.top
    })
    expect(reportOrder).toBe(true)
    await institute.locator('#institute-cooperation summary').click()
    await expect(institute.locator('#institute-cooperation ul')).toBeVisible()
  })
}

test('institute works without JavaScript and has accessible expanded reading', async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const native = await context.newPage()
  await native.goto(pageHref('institute', 'fr'))
  await expect(native.locator('#institute-history')).toContainText('2011')
  await expect(native.locator('#institute-history button').first()).toBeHidden()
  await expect
    .poll(() =>
      native.locator('#institute-history-rail').evaluate((el) => el.scrollWidth > el.clientWidth),
    )
    .toBe(true)
  await native.locator('#institute-skills summary').click()
  await expect(native.locator('#institute-skills ul')).toBeVisible()
  await expect(native.locator('#capabilities details[open]')).toHaveCount(1)
  await expect(native.locator('[data-research-tabs] [id^="institute-model-"]:not(a)')).toHaveCount(
    3,
  )
  for (const id of ['develop', 'test', 'transfer'])
    await expect(native.locator(`#institute-model-${id}`)).toBeVisible()
  await context.close()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(pageHref('institute', 'fr'))
  await page
    .locator('[data-institute-page] details')
    .evaluateAll((items) => items.forEach((item) => item.setAttribute('open', '')))
  const results = await new AxeBuilder({ page }).include('[data-institute-page]').analyze()
  expect(
    results.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
  ).toEqual([])
})

test('the institute history is discoverable in every public language', async ({ page }) => {
  for (const locale of ['fr', 'en', 'ar'] as const) {
    await page.goto(
      `${pageHref('search', locale)}?${new URLSearchParams({ q: '2011', type: 'section' })}`,
    )
    await expect(
      page.locator(
        `.search-results a[href="${pageHref('institute', locale, 'institute-history')}"]`,
      ),
    ).toBeVisible()
    await page.goto(
      `${pageHref('search', locale)}?${new URLSearchParams({ q: '15 ANS D’IMPACT', type: 'media' })}`,
    )
    await expect(
      page.locator(
        '.search-results a[href="/images/institute/fifteen-year-report-cover-cutout.webp"]:not([aria-hidden])',
      ),
    ).toBeVisible()
  }
})

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: editorial composition remains contained across widths`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(pageHref('institute', locale, 'capabilities'))
    await page.evaluate(() => document.fonts.ready)
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 })
      const editorial = page.locator('[data-institute-editorial]')
      const diagram = editorial.locator('[data-positioning-diagram]')
      await expect(diagram.locator('li')).toHaveCount(3)
      await expect(diagram.getByRole('img', { name: 'IRESEN', exact: true })).toBeVisible()
      await expect
        .poll(() => editorial.evaluate((el) => el.scrollWidth <= el.clientWidth))
        .toBe(true)
      if (width > 1024) {
        const alignment = await editorial.locator('[data-institute-overview]').evaluate((el) => {
          const core = el.querySelector('#institute-research')!.getBoundingClientRect()
          const title = el.querySelector('#missions-title')!.getBoundingClientRect()
          const dimensions = el.querySelector('[data-mission-cards]')!.getBoundingClientRect()
          const rowTitle = el
            .querySelector('#institute-studies summary > svg')!
            .getBoundingClientRect()
          const rtl = getComputedStyle(el).direction === 'rtl'
          return [
            core.top - title.top,
            core.bottom - dimensions.bottom,
            rtl ? title.right - rowTitle.right : title.left - rowTitle.left,
          ]
        })
        for (const difference of alignment) expect(Math.abs(difference)).toBeLessThan(1)
      }

      for (const tab of await editorial.getByRole('tab').all()) {
        await expect(tab).toBeVisible()
        const box = await tab.boundingBox()
        expect(box!.height).toBeGreaterThanOrEqual(44)
      }
      if (width === 1440 || width === 390) {
        await editorial.locator('#missions-title').scrollIntoViewIfNeeded()
        await page.screenshot({ path: testInfo.outputPath(`${locale}-editorial-${width}.png`) })
      }
    }
  })
}

test('research pathway advances every ten seconds and pauses for a manual choice or reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.clock.install()
  await page.goto(pageHref('institute', 'fr', 'research-focus-title'))
  const pathway = page.locator('[data-research-tabs]')
  await pathway.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  await expect(pathway).toHaveAttribute('data-running', 'true')
  const tabs = pathway.getByRole('tab')
  const originalUrl = page.url()
  const height = await pathway.evaluate((el) => el.getBoundingClientRect().height)
  await page.clock.runFor(10050)
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  expect(page.url()).toBe(originalUrl)
  expect(await pathway.evaluate((el) => el.getBoundingClientRect().height)).toBeCloseTo(height, 0)
  await tabs.nth(2).click()
  await expect(pathway.getByRole('button')).toHaveCount(0)
  await expect(pathway).toHaveAttribute('data-running', 'false')
  await page.clock.runFor(40000)
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(pageHref('institute', 'fr', 'research-focus-title'))
  await pathway.scrollIntoViewIfNeeded()
  await expect(pathway).toHaveAttribute('data-enhanced', 'true')
  await expect(pathway).toHaveAttribute('data-running', 'false')
  await page.clock.runFor(40000)
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true')
})

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: complementary accordions navigate to reachable page sections`, async ({
    page,
  }) => {
    for (const [dimension, destination, anchor] of [
      ['studies', 'network', 'intervention-modes'],
      ['skills', 'network', 'skills-training'],
      ['cooperation', 'workWithUs', 'collaboration-references'],
    ] as const) {
      await page.goto(pageHref('institute', locale, 'capabilities'))
      await page.locator(`#institute-${dimension} summary`).click()
      const action = page.locator(`#institute-${dimension} details a`)
      await expect(action).toHaveAttribute('href', pageHref(destination, locale, anchor))
      await action.click()
      await expect(page).toHaveURL(new URL(pageHref(destination, locale, anchor), page.url()).href)
      await expect(page.locator(`#${anchor}`)).toBeAttached()
      await expect(page.locator('h1')).toBeVisible()
    }
  })
}
