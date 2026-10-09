import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { locales } from '../../src/i18n/locales'
import { pageHref } from '../../src/lib/site'

function searchUrl(locale: (typeof locales)[number], parameters: Record<string, string>) {
  return `${pageHref('search', locale)}?${new URLSearchParams(parameters)}`
}

async function expectSearchUrl(page: Page, locale: (typeof locales)[number], query: string) {
  await expect(page).toHaveURL(
    (url) =>
      decodeURI(url.pathname) === pageHref('search', locale) && url.searchParams.get('q') === query,
  )
}

function headerSearch(page: Page) {
  const disclosure = page.getByRole('banner').locator('.header-search-disclosure')
  return {
    disclosure,
    trigger: disclosure.locator(':scope > summary'),
    form: disclosure.locator('.header-search-form'),
    input: disclosure.locator('input[name="q"]'),
  }
}

async function openHeaderSearch(page: Page) {
  const parts = headerSearch(page)
  if (!(await parts.trigger.isVisible())) {
    const menu = page.getByRole('banner').locator('.site-menu')
    if ((await menu.getAttribute('open')) === null) {
      await menu.locator(':scope > summary').focus()
      await page.keyboard.press('Enter')
    }
  }
  if ((await parts.disclosure.getAttribute('open')) === null) {
    await parts.trigger.focus()
    await parts.trigger.press('Enter')
  }
  await expect(parts.input).toBeVisible()
  await parts.input.focus()
  return parts
}

for (const locale of ['fr', 'ar'] as const) {
  test(`${locale}: header search reveals its input on hover and remains available by keyboard`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('institute', locale))
    const { disclosure, trigger, form, input } = headerSearch(page)
    await expect(form).toHaveAttribute('action', pageHref('search', locale))
    await expect(form).toHaveJSProperty('method', 'get')
    await expect(input).toHaveAttribute('placeholder', /\S/)
    await expect(trigger).toHaveAccessibleName(/\S/)
    const anchor = (await trigger.boundingBox())!
    await trigger.hover()
    await expect(disclosure).toHaveAttribute('open', '')
    await expect(input).toBeVisible()
    await expect(input).toHaveAccessibleName(/\S/)
    await expect
      .poll(async () => {
        const expanded = (await form.boundingBox())!
        return locale === 'fr'
          ? anchor.x - expanded.x
          : expanded.x + expanded.width - anchor.x - anchor.width
      })
      .toBeGreaterThan(100)
    const after = (await trigger.boundingBox())!
    expect(Math.abs(after.x - anchor.x)).toBeLessThanOrEqual(2)
    expect(Math.abs(after.y - anchor.y)).toBeLessThanOrEqual(2)
    await page.mouse.move(1, 899)
    await openHeaderSearch(page)
    await expect(input).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(input).not.toBeFocused()
    await expect(disclosure).not.toHaveAttribute('open', '')
    await expect(trigger).toBeFocused()
    await openHeaderSearch(page)
    const query = locale === 'fr' ? 'plateformes' : 'المنصات'
    await input.fill(query)
    await page.keyboard.press('Enter')
    await expectSearchUrl(page, locale, query)
    await expect(page.locator('.search-query-form input[name="q"]')).toHaveValue(query)
    await expect(page.locator('.search-results article').first()).toBeVisible()
  })
}

test('a populated header search button submits its retained query', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(pageHref('institute', 'en'))
  const { trigger, input } = await openHeaderSearch(page)
  await input.fill('research')
  await trigger.click()
  await expectSearchUrl(page, 'en', 'research')
  await expect(page.locator('.search-results article').first()).toBeVisible()
})

test('leaving search by keyboard clears the reveal while the pointer is parked on its input', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const locale of ['fr', 'ar'] as const) {
    await page.goto(pageHref('institute', locale))
    const { disclosure, trigger, input } = await openHeaderSearch(page)
    await input.hover()
    await page.keyboard.press('Shift+Tab')
    await expect(trigger).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    const previousLanguage = page.getByRole('banner').locator('.locale-selector a').last()
    await expect(previousLanguage).toBeFocused()
    await expect(disclosure).not.toHaveAttribute('open', '')
    expect(
      await previousLanguage.evaluate((link) => {
        const bounds = link.getBoundingClientRect()
        const visible = document.elementFromPoint(
          bounds.x + bounds.width / 2,
          bounds.y + bounds.height / 2,
        )
        return visible === link || (visible !== null && link.contains(visible))
      }),
    ).toBe(true)
  }
})

for (const width of [1440, 390]) {
  test(`public search suggestions support keyboard navigation, containment and destination links at ${width}px`, async ({
    page,
    baseURL,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(pageHref('institute', 'en'))
    const { trigger, input } = await openHeaderSearch(page)
    await input.fill('research')
    const suggestions = page.locator('[data-search-suggestion]')
    await expect(suggestions.first()).toBeVisible()
    expect(await suggestions.count()).toBeLessThanOrEqual(4)
    await expect
      .poll(() =>
        page.locator('.header-search-suggestions').evaluate((element) => {
          const bounds = element.getBoundingClientRect()
          return bounds.left >= -1 && bounds.right <= window.innerWidth + 1
        }),
      )
      .toBe(true)
    if (width === 390) {
      await input.press('Tab')
      await expect(suggestions.first()).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await expect(input).toBeFocused()
    }
    await input.press('ArrowDown')
    await expect(suggestions.first()).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(suggestions.nth(1)).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(suggestions.first()).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(input).toBeFocused()
    const accessibility = await new AxeBuilder({ page })
      .include('.site-header')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(accessibility.violations).toEqual([])
    await input.press('ArrowDown')
    await page.keyboard.press('Escape')
    await expect(input).not.toBeFocused()
    await expect(trigger).toBeFocused()
    await expect(suggestions).toHaveCount(0)
    if (width === 390) {
      await expect(page.locator('.site-menu')).toHaveAttribute('open', '')
    }
    await openHeaderSearch(page)
    await expect(suggestions.first()).toBeVisible()
    const destination = (await suggestions.first().getAttribute('href'))!
    await input.press('ArrowDown')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(new URL(destination, baseURL).href)
  })
}

test('touch search opens its input before submitting, without needing hover', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  })
  try {
    const page = await context.newPage()
    await page.goto(pageHref('institute', 'fr'))
    const { trigger, input } = headerSearch(page)
    await expect(trigger).toBeHidden()
    await page.locator('.site-menu > summary').tap()
    await trigger.tap()
    await expect(input).toBeFocused()
    await input.fill('plateformes')
    await trigger.tap()
    await expectSearchUrl(page, 'fr', 'plateformes')
    await expect(page.locator('.search-results article').first()).toBeVisible()
  } finally {
    await context.close()
  }
})

for (const width of [1440, 390]) {
  test(`header and results native GET search remain functional without JavaScript at ${width}px`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      viewport: { width, height: 900 },
    })
    try {
      const page = await context.newPage()
      await page.goto(pageHref('institute', 'en'))
      const { input: headerInput } = await openHeaderSearch(page)
      await headerInput.fill('research')
      await page.keyboard.press('Enter')
      await expectSearchUrl(page, 'en', 'research')
      await expect(page.locator('.search-results article').first()).toBeVisible()
      const resultForm = page.locator('.search-query-form')
      await resultForm.locator('input[name="q"]').fill('platforms')
      await resultForm.locator('button[type="submit"]').click()
      await expectSearchUrl(page, 'en', 'platforms')
      await expect(page.locator('.search-results article').first()).toBeVisible()
    } finally {
      await context.close()
    }
  })
}

test('result filters, sorting, pagination and browser history preserve the URL query', async ({
  page,
}) => {
  await page.goto(searchUrl('en', { q: 'content' }))
  const sectionFilter = page.locator('.search-facets a').filter({ hasText: /sections/i })
  await expect(sectionFilter).toHaveCount(1)
  await sectionFilter.click()
  await expect(page).toHaveURL(
    (url) => url.searchParams.get('type') === 'section' && url.searchParams.get('q') === 'content',
  )
  const filteredUrl = page.url()
  const sortForm = page.locator('.search-sort-form')
  await sortForm.locator('select[name="sort"]').selectOption('newest')
  await sortForm.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(
    (url) =>
      url.searchParams.get('sort') === 'newest' &&
      url.searchParams.get('type') === 'section' &&
      url.searchParams.get('q') === 'content',
  )
  const sortedUrl = page.url()
  const nextPage = page.locator('.search-pagination a').filter({ hasText: /next/i })
  await expect(nextPage).toHaveCount(1)
  await nextPage.click()
  await expect(page).toHaveURL(
    (url) =>
      url.searchParams.get('page') === '2' &&
      url.searchParams.get('sort') === 'newest' &&
      url.searchParams.get('type') === 'section' &&
      url.searchParams.get('q') === 'content',
  )
  await page.goBack()
  await expect(page).toHaveURL(sortedUrl)
  await page.goBack()
  await expect(page).toHaveURL(filteredUrl)
})

for (const { locale, query, resultHref } of [
  { locale: 'fr', query: 'reseau', resultHref: pageHref('network', 'fr') },
  { locale: 'en', query: 'laboratry', resultHref: pageHref('network', 'en') },
  { locale: 'ar', query: 'الاولويات', resultHref: pageHref('priorities', 'ar') },
] as const) {
  test(`${locale}: normalized and misspelled queries retrieve relevant public destinations`, async ({
    page,
  }) => {
    await page.goto(searchUrl(locale, { q: query }))
    await expect(page.locator(`.search-results a[href="${resultHref}"]`).first()).toBeVisible()
    await expect(page.locator('.search-query-form input[name="q"]')).toHaveValue(query)
  })
}

test('exact text highlights remain semantic and query markup is escaped', async ({ page }) => {
  await page.goto(searchUrl('en', { q: 'research' }))
  const highlights = page.locator('.search-results mark')
  await expect(highlights.first()).toBeVisible()
  for (const highlight of await highlights.all()) {
    await expect(highlight).toHaveText(/research/i)
  }
  const markup = '<img src=x onerror="window.__searchXss=1">'
  await page.goto(searchUrl('en', { q: markup }))
  await expect(page.locator('.search-query-form input[name="q"]')).toHaveValue(markup)
  await expect(page.locator('.search-page img[onerror]')).toHaveCount(0)
  expect(await page.evaluate(() => '__searchXss' in window)).toBe(false)
})

test('section results open their rendered anchor and registered public files are searchable', async ({
  page,
  request,
}) => {
  await page.goto(searchUrl('en', { q: 'mission', type: 'section' }))
  const mission = pageHref('institute', 'en', 'mission')
  const section = page.locator(`.search-results a[href="${mission}"]`)
  await expect(section).toBeVisible()
  await section.click()
  await expect(page).toHaveURL((url) => `${url.pathname}${url.hash}` === mission)
  await expect(page.locator('#mission')).toBeVisible()

  await page.goto(searchUrl('en', { q: 'IRESEN', type: 'media' }))
  const logo = page.locator('.search-results a[href="/brand/logo-color.svg"]')
  await expect(logo).toBeVisible()
  const download = await request.get((await logo.getAttribute('href'))!)
  expect(download.status()).toBe(200)
  expect(download.headers()['content-type']).toContain('image/svg+xml')
})

test('language switching retains the search query and filters, resetting pagination', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(searchUrl('fr', { q: 'IRESEN', type: 'media', sort: 'newest', page: '2' }))
  await page.locator('.locale-selector').getByRole('link', { name: 'English', exact: true }).click()
  await expect(page).toHaveURL(
    (url) =>
      url.pathname === pageHref('search', 'en') &&
      url.searchParams.get('q') === 'IRESEN' &&
      url.searchParams.get('type') === 'media' &&
      url.searchParams.get('sort') === 'newest' &&
      !url.searchParams.has('page'),
  )
  await expect(page.locator('.search-query-form input[name="q"]')).toHaveValue('IRESEN')
  await page.locator('.locale-selector').getByRole('link', { name: 'العربية', exact: true }).click()
  await expect(page).toHaveURL(
    (url) =>
      decodeURI(url.pathname) === pageHref('search', 'ar') &&
      url.searchParams.get('q') === 'IRESEN' &&
      url.searchParams.get('type') === 'media' &&
      url.searchParams.get('sort') === 'newest' &&
      !url.searchParams.has('page'),
  )
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
})

test('empty and zero-result searches retain an editable search field', async ({ page }) => {
  await page.goto(pageHref('search', 'en'))
  const form = page.locator('.search-query-form')
  await expect(form.locator('input[name="q"]')).toHaveValue('')
  await expect(page.locator('.search-results article')).toHaveCount(0)
  const query = 'zzunmatchedpublicsearchzz'
  await form.locator('input[name="q"]').fill(query)
  await form.locator('button[type="submit"]').click()
  await expectSearchUrl(page, 'en', query)
  await expect(form.locator('input[name="q"]')).toHaveValue(query)
  await expect(page.locator('.search-results article')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('the reveal animation respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(pageHref('institute', 'en'))
  const { form } = await openHeaderSearch(page)
  const durations = await form.evaluate((element) => {
    const style = getComputedStyle(element)
    return [...style.transitionDuration.split(','), ...style.animationDuration.split(',')].map(
      (duration) => parseFloat(duration),
    )
  })
  expect(Math.max(...durations)).toBeLessThanOrEqual(0.02)
})

for (const locale of locales) {
  test(`${locale}: search results remain accessible and contained at all widths and enlarged text`, async ({
    page,
  }) => {
    test.setTimeout(120_000)
    const query = locale === 'ar' ? 'البحث' : locale === 'fr' ? 'recherche' : 'research'
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(searchUrl(locale, { q: query }))
      await expect(page.locator('.search-results article').first()).toBeVisible()
      for (const textSize of width === 320 || width === 1440 ? [100, 200] : [100]) {
        await page.evaluate(async (size) => {
          document.documentElement.style.fontSize = `${size}%`
          await document.fonts.ready
        }, textSize)
        const { input: headerInput } = await openHeaderSearch(page)
        await expect
          .poll(async () => (await headerInput.boundingBox())!.width, {
            message: `${locale}: ${width}px, ${textSize}% text must leave a usable input`,
          })
          .toBeGreaterThanOrEqual(84)
        await expect
          .poll(
            () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
            { message: `${locale}: ${width}px, ${textSize}% text must fit` },
          )
          .toBeLessThanOrEqual(1)
        const overflowing = await page.locator('.search-page').evaluate((main) =>
          [...main.querySelectorAll<HTMLElement>('input, button, select, a')]
            .filter((control) => {
              const bounds = control.getBoundingClientRect()
              return (
                bounds.width > 0 &&
                bounds.height > 0 &&
                (bounds.left < -1 || bounds.right > window.innerWidth + 1)
              )
            })
            .map((control) => control.textContent?.trim() || control.getAttribute('name')),
        )
        expect(overflowing, `${locale}: ${width}px, ${textSize}% text`).toEqual([])
        const selectSpacing = await page.locator('.search-sort-select').evaluate((wrapper) => {
          const select = wrapper.querySelector('select')!
          const icon = wrapper.querySelector('svg')!
          const field = select.getBoundingClientRect()
          const arrow = icon.getBoundingClientRect()
          const style = getComputedStyle(select)
          const canvas = document.createElement('canvas').getContext('2d')!
          canvas.font = style.font
          const textWidth = Math.max(
            ...Array.from(select.options, (option) => canvas.measureText(option.text).width),
          )
          return {
            inset: style.direction === 'rtl' ? arrow.left - field.left : field.right - arrow.right,
            textSpace:
              select.clientWidth -
              parseFloat(style.paddingInlineStart) -
              parseFloat(style.paddingInlineEnd) -
              textWidth,
            gap:
              parseFloat(style.paddingInlineEnd) -
              arrow.width -
              parseFloat(getComputedStyle(icon).insetInlineEnd),
          }
        })
        expect(
          selectSpacing.inset,
          'select arrow needs an inset from the edge',
        ).toBeGreaterThanOrEqual(12)
        expect(
          selectSpacing.textSpace,
          'longest option must fit before the arrow reserve',
        ).toBeGreaterThanOrEqual(-1)
        expect(
          selectSpacing.gap,
          'select text needs clearance before its arrow',
        ).toBeGreaterThanOrEqual(12)
      }
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(searchUrl(locale, { q: query }))
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('.page-hero')).toHaveCount(0)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
}

test('search and its API stay noindex and reject invalid public inputs', async ({ request }) => {
  const results = await request.get(searchUrl('en', { q: 'research' }))
  expect(results.status()).toBe(200)
  expect(await results.text()).toMatch(/name="robots" content="noindex(?:,|%2C)/)
  const response = await request.get('/api/search?locale=en&q=research')
  expect(response.status()).toBe(200)
  expect(response.headers()['x-robots-tag']).toContain('noindex')
  expect(response.headers()['cache-control']).toContain('no-store')
  const result = await response.json()
  expect(result.status).toBe('available')
  expect(result.items.length).toBeGreaterThan(0)
  for (const item of result.items) {
    expect(item.locale).toBe('en')
    expect(item.url).toMatch(/^\/(?![/\\])/)
    expect(item).not.toHaveProperty('body')
    expect(item).not.toHaveProperty('source_revision')
    expect(item).not.toHaveProperty('internalNotes')
  }
  const invalidParameters: Record<string, string>[] = [
    { locale: 'es', q: 'research' },
    { locale: 'en', q: 'x'.repeat(201) },
    { locale: 'en', q: 'research', type: 'private' },
    { locale: 'en', q: 'research', page: '0' },
  ]
  for (const parameters of invalidParameters) {
    const invalid = await request.get(`/api/search?${new URLSearchParams(parameters)}`)
    expect(invalid.status(), JSON.stringify(parameters)).toBe(400)
  }
})
