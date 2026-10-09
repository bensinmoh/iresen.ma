import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { locales } from '../../src/i18n/locales'
import { pageHref } from '../../src/lib/site'

const platformQueries = { en: 'platforms', fr: 'plateformes', ar: 'المنصات' }

for (const locale of locales) {
  test(`${locale}: header search submits keywords to localized results with real destination links`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('home', locale))
    const headerSearch = page.locator('.header-search')
    const headerInput = headerSearch.locator('input[type="search"]')
    await expect(headerSearch).toHaveAttribute('method', /get/i)
    await expect(headerSearch).toHaveAttribute('action', pageHref('search', locale))
    await expect(headerInput).toHaveAttribute('name', 'q')
    await expect(headerInput).toHaveAttribute('placeholder', /\S/)

    await headerSearch.locator('.header-search-toggle').click()
    await expect(headerInput).toBeFocused()
    await expect(headerInput).toHaveAccessibleName(/\S/)
    await headerInput.fill(platformQueries[locale])
    await headerInput.press('Enter')
    await expect(page).toHaveURL(
      (url) =>
        decodeURI(url.pathname) === pageHref('search', locale) &&
        url.searchParams.get('q') === platformQueries[locale],
    )
    const results = page.locator('.search-page')
    const pageInput = results.locator('#page-search-input')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(pageInput).toHaveValue(platformQueries[locale])
    await expect(pageInput).toHaveAccessibleName(/\S/)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    const formNames = await page
      .getByRole('search')
      .evaluateAll((forms) => forms.map((form) => form.getAttribute('aria-label')))
    expect(formNames).toHaveLength(2)
    expect(formNames.every((name) => Boolean(name?.trim()))).toBe(true)
    expect(new Set(formNames).size).toBe(2)
    await expect(results.locator('.search-count')).toContainText(/\S/)

    const platformLink = results.locator(
      `.search-result-title[href="${pageHref('platforms', locale)}"]`,
    )
    await expect(platformLink).toBeVisible()
    await expect(platformLink).toHaveAccessibleName(/\S/)
    await expect(
      platformLink.locator('xpath=ancestor::li').locator('.search-result-excerpt'),
    ).toContainText(/\S/)
    const resultLinks = results.locator('.search-result-title')
    for (const href of await resultLinks.evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    )) {
      expect(href).toMatch(new RegExp(`^/${locale}(?:/|$)`))
    }
    await platformLink.click()
    await expect(page).toHaveURL((url) => decodeURI(url.pathname) === pageHref('platforms', locale))
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
}

for (const locale of ['en', 'ar'] as const) {
  test(`${locale}: pointer hover reveals the search field by expanding physically left`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('home', locale))
    await page.mouse.move(1, 899)
    const search = page.locator('.header-search')
    const toggle = search.locator('.header-search-toggle')
    const input = search.locator('#header-search-input')
    const collapsed = await search.boundingBox()
    const buttonBefore = await toggle.boundingBox()
    expect(collapsed).not.toBeNull()
    expect(buttonBefore).not.toBeNull()

    await page.evaluate(() => {
      const observed = window as Window & { searchButtonPositions?: Promise<number[]> }
      observed.searchButtonPositions = new Promise((resolve) => {
        const positions: number[] = []
        const until = performance.now() + 400
        function record() {
          positions.push(
            document.querySelector('.header-search-toggle')!.getBoundingClientRect().right,
          )
          if (performance.now() < until) requestAnimationFrame(record)
          else resolve(positions)
        }
        requestAnimationFrame(record)
      })
    })
    await toggle.hover()
    const positions = await page.evaluate(
      () =>
        (window as Window & { searchButtonPositions?: Promise<number[]> }).searchButtonPositions,
    )
    expect(Math.max(...positions!) - Math.min(...positions!)).toBeLessThanOrEqual(2)
    await expect.poll(async () => (await input.boundingBox())?.width ?? 0).toBeGreaterThan(100)
    await expect(input).toBeVisible()
    await expect
      .poll(async () => (await search.boundingBox())?.x ?? 0)
      .toBeLessThan(collapsed!.x - 80)
    const expanded = await search.boundingBox()
    const buttonAfter = await toggle.boundingBox()
    const field = await input.boundingBox()
    expect(
      Math.abs(expanded!.x + expanded!.width - collapsed!.x - collapsed!.width),
    ).toBeLessThanOrEqual(2)
    expect(Math.abs(buttonAfter!.x - buttonBefore!.x)).toBeLessThanOrEqual(2)
    expect(field!.x + field!.width).toBeLessThanOrEqual(buttonAfter!.x + 1)
    await input.click()
    await page.mouse.move(1, 899)
    await expect(input).toBeFocused()
    await expect(input).toBeVisible()
    expect((await input.boundingBox())!.width).toBeGreaterThan(100)
  })
}

test('keyboard users can reveal the field, submit a query and revise it with browser history', async ({
  page,
}) => {
  await page.goto(pageHref('home', 'en'))
  const toggle = page.locator('.header-search-toggle')
  const input = page.locator('#header-search-input')
  await toggle.focus()
  await expect(input).toBeVisible()
  await page.keyboard.press('Shift+Tab')
  await expect(input).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await page.keyboard.press('Enter')
  await expect(input).toBeFocused()
  await page.getByRole('heading', { level: 1 }).click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(input).not.toBeFocused()
  await toggle.click()
  await expect(input).toBeFocused()
  await input.fill('research')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'research')
  await expect(page.locator('#page-search-input')).toHaveValue('research')

  await page.locator('#page-search-input').fill('platforms')
  await page.locator('#page-search-input').press('Enter')
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'platforms')
  await page.goBack()
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === 'research')
  await expect(page.locator('#page-search-input')).toHaveValue('research')
})

test('blank and unmatched searches offer useful internal paths and retain editable keywords', async ({
  page,
}) => {
  await page.goto(pageHref('search', 'en'))
  const results = page.locator('.search-page')
  await expect(results.locator('#page-search-input')).toHaveValue('')
  await expect(results.locator('.search-result-title')).toHaveCount(0)
  await expect(results.locator(`a[href="${pageHref('sitemap', 'en')}"]`)).toBeVisible()
  await expect(results.locator(`a[href="${pageHref('contact', 'en')}"]`)).toBeVisible()

  const unmatched = 'unfindable-website-search-92741'
  await results.locator('#page-search-input').fill(unmatched)
  await results.locator('#page-search-input').press('Enter')
  await expect(page).toHaveURL((url) => url.searchParams.get('q') === unmatched)
  await expect(results.locator('#page-search-input')).toHaveValue(unmatched)
  await expect(results.locator('.search-result-title')).toHaveCount(0)
  await expect(results.locator(`a[href="${pageHref('sitemap', 'en')}"]`)).toBeVisible()
  await expect(results.locator(`a[href="${pageHref('contact', 'en')}"]`)).toBeVisible()
  await expect(results.getByRole('heading', { level: 3 })).toContainText(/no results/i)
})

test('pagination uses bookmarkable query URLs and returns a distinct second page', async ({
  page,
}) => {
  await page.goto(`${pageHref('search', 'en')}?q=research`)
  const resultLinks = page.locator('.search-result-title')
  const firstPage = await resultLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute('href')),
  )
  expect(firstPage.length).toBeGreaterThan(0)
  expect(firstPage.length).toBeLessThanOrEqual(8)
  const next = page.locator('.search-pagination a[href*="page=2"]')
  await expect(next).toBeVisible()
  await next.click()
  await expect(page).toHaveURL(
    (url) =>
      url.pathname === pageHref('search', 'en') &&
      url.searchParams.get('q') === 'research' &&
      url.searchParams.get('page') === '2',
  )
  await expect(page.locator('#page-search-input')).toHaveValue('research')
  const secondPage = await resultLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute('href')),
  )
  expect(secondPage.length).toBeGreaterThan(0)
  expect(secondPage.every((href) => !firstPage.includes(href))).toBe(true)
  await page.reload()
  await expect(page.locator('#page-search-input')).toHaveValue('research')
  await expect(resultLinks).toHaveCount(secondPage.length)
  await page.goBack()
  await expect(page).toHaveURL((url) => url.searchParams.get('page') === null)
  await expect(resultLinks).toHaveCount(firstPage.length)
})

test('language switching retains the search keywords before a supported page anchor', async ({
  page,
}) => {
  await page.goto(`${pageHref('search', 'en')}?q=research#main-content`)
  const header = page.getByRole('banner')
  const french = header.getByRole('link', { name: 'Français', exact: true })
  await expect(french).toHaveAttribute(
    'href',
    `${pageHref('search', 'fr')}?q=research#main-content`,
  )
  await french.click()
  await expect(page).toHaveURL(
    (url) =>
      url.pathname === pageHref('search', 'fr') &&
      url.searchParams.get('q') === 'research' &&
      url.hash === '#main-content',
  )
  await expect(page.locator('#page-search-input')).toHaveValue('research')
  await header.getByRole('link', { name: 'العربية', exact: true }).click()
  await expect(page).toHaveURL(
    (url) =>
      decodeURI(url.pathname) === pageHref('search', 'ar') &&
      url.searchParams.get('q') === 'research' &&
      url.hash === '#main-content',
  )
  await expect(page.locator('#page-search-input')).toHaveValue('research')
})

test('direct invalid keyword URLs show validation guidance before returning results', async ({
  page,
}) => {
  for (const query of ['x', '!!!', 'x'.repeat(121)]) {
    await page.goto(`${pageHref('search', 'en')}?${new URLSearchParams({ q: query })}`)
    const results = page.locator('.search-page')
    await expect(results.locator('#page-search-input')).toHaveValue(query.slice(0, 120))
    await expect(results.locator('#page-search-input')).toHaveAttribute('aria-invalid', 'true')
    await expect(results.locator('#page-search-input')).toHaveAttribute(
      'aria-describedby',
      /search-validation/,
    )
    await expect(results.getByRole('status')).toContainText(/between 2 and 120 characters/i)
    await expect(results.locator('.search-result-title')).toHaveCount(0)
    await expect(results.locator(`a[href="${pageHref('sitemap', 'en')}"]`)).toBeVisible()
  }
})

test('touch users can open the Arabic search field and submit without a hover interaction', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  try {
    await page.goto(pageHref('home', 'ar'))
    await page.locator('.header-search-toggle').tap()
    const input = page.locator('#header-search-input')
    await expect(input).toBeFocused()
    await input.fill(platformQueries.ar)
    await page.getByRole('heading', { level: 1 }).tap()
    await expect(page.locator('.header-search-toggle')).toHaveAttribute('aria-expanded', 'false')
    await page.locator('.header-search-toggle').tap()
    await expect(page).toHaveURL((url) => url.pathname === pageHref('home', 'ar'))
    await expect(input).toBeFocused()
    await expect(input).toHaveValue(platformQueries.ar)
    await page.locator('.header-search-toggle').tap()
    await expect(page).toHaveURL(
      (url) =>
        decodeURI(url.pathname) === pageHref('search', 'ar') &&
        url.searchParams.get('q') === platformQueries.ar,
    )
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.locator('.search-result-title').first()).toBeVisible()
  } finally {
    await context.close()
  }
})

test('Arabic open search and result forms reflow at mobile widths with enlarged text and pass scoped accessibility scans', async ({
  page,
}) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(pageHref('search', 'ar'))
    await page.locator('.header-search-toggle').click()
    for (const textSize of [100, 200]) {
      await page.evaluate((size) => {
        document.documentElement.style.fontSize = `${size}%`
      }, textSize)
      await expect(page.locator('#header-search-input')).toBeVisible()
      await expect(page.locator('#page-search-input')).toBeVisible()
      const overflow = await page.evaluate(() => ({
        pageFits: document.documentElement.scrollWidth <= window.innerWidth,
        outsideControls: [
          ...document.querySelectorAll<HTMLElement>(
            '.header-search input, .header-search button, .search-page input, .search-page button',
          ),
        ]
          .filter((control) => {
            const bounds = control.getBoundingClientRect()
            return bounds.width > 0 && (bounds.left < -1 || bounds.right > window.innerWidth + 1)
          })
          .map((control) => control.id || control.textContent?.trim()),
      }))
      expect(overflow, `${width}px, ${textSize}% text`).toEqual({
        pageFits: true,
        outsideControls: [],
      })
    }
  }
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '100%'
  })
  await page.locator('#page-search-input').fill(platformQueries.ar)
  await page.locator('#page-search-input').press('Enter')
  await expect(page.locator('.search-result-title').first()).toBeVisible()
  const scan = await new AxeBuilder({ page })
    .include('.site-header')
    .include('.search-page')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(scan.violations).toEqual([])
})

test('reduced motion keeps header search usable without an animated reveal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(pageHref('home', 'en'))
  await page.locator('.header-search-toggle').hover()
  const input = page.locator('#header-search-input')
  await expect(input).toBeVisible()
  expect((await input.boundingBox())!.width).toBeGreaterThan(100)
  const motion = await page.locator('.header-search').evaluate((form) =>
    [form, ...form.querySelectorAll('input, button')].map((element) => ({
      transition: getComputedStyle(element).transitionDuration,
      animation: getComputedStyle(element).animationDuration,
    })),
  )
  for (const element of motion) {
    for (const duration of `${element.transition},${element.animation}`.split(',')) {
      expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001)
    }
  }
  await input.fill(platformQueries.en)
  await input.press('Enter')
  await expect(page.locator('#page-search-input')).toHaveValue(platformQueries.en)
})

test('search results and query submissions work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false })
  const page = await context.newPage()
  try {
    await page.goto(pageHref('search', 'fr'))
    const input = page.locator('#page-search-input')
    await input.fill(platformQueries.fr)
    await input.press('Enter')
    await expect(page).toHaveURL((url) => url.searchParams.get('q') === platformQueries.fr)
    await expect(input).toHaveValue(platformQueries.fr)
    await page.locator(`.search-result-title[href="${pageHref('platforms', 'fr')}"]`).click()
    await expect(page).toHaveURL((url) => url.pathname === pageHref('platforms', 'fr'))
  } finally {
    await context.close()
  }
})
