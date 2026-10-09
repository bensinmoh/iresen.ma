import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { researchThemes } from '../../src/lib/home-research'

for (const locale of ['fr', 'en', 'ar']) {
  test(`${locale}: thematic selection, anchors, responsive reflow and accessibility`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(`/${locale}#research-priorities`)
    const section = page.locator('#research-priorities')
    await expect(section.locator('summary')).toHaveCount(7)
    for (const theme of researchThemes) {
      const details = section.locator(`#research-${theme}`)
      await details.locator('summary').focus()
      await page.keyboard.press('Enter')
      await expect(details).toHaveAttribute('open', '')
      await expect(section.locator('details[open]')).toHaveCount(1)
      await expect(details.locator('li')).toHaveCount(4)
      const axisRows = await details
        .locator('li')
        .evaluateAll((items) => items.map((item) => item.getBoundingClientRect().top))
      expect(Math.max(...axisRows) - Math.min(...axisRows)).toBeLessThanOrEqual(1)
      expect(
        await details
          .locator('summary > svg')
          .first()
          .evaluate((icon) => icon.getBoundingClientRect().height),
      ).toBeGreaterThanOrEqual(48)
      await expect(details.locator('img')).toBeVisible()
      await details.locator('img').scrollIntoViewIfNeeded()
      await expect
        .poll(() =>
          details
            .locator('img')
            .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
        )
        .toBe(true)
    }
    // Opening a result link reveals the right content even if another theme was selected.
    await page.evaluate(() => {
      window.location.hash = 'research-water'
    })
    await expect(section.locator('#research-water')).toHaveAttribute('open', '')
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect(section.locator('#research-water summary')).toBeVisible()
      if (width < 1024) {
        const photo = section.locator('#research-water [data-theme-image]')
        await expect(photo).toHaveCSS('position', 'absolute')
        const covers = await photo.evaluate((node) => {
          const frame = node.closest('section')!.getBoundingClientRect()
          const image = node.getBoundingClientRect()
          return (
            Math.abs(frame.height - image.height) <= 1 && Math.abs(frame.width - image.width) <= 1
          )
        })
        expect(covers).toBe(true)
        if (width === 768)
          await section.screenshot({
            style: '.skip-link, .home-section-navigation { visibility: hidden; }',
            path: testInfo.outputPath(locale + '-tablet.png'),
          })
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      ).toBe(true)
    }
    await section.screenshot({
      style: '.skip-link, .home-section-navigation { visibility: hidden; }',
      path: testInfo.outputPath(`${locale}-desktop.png`),
    })
    await page.setViewportSize({ width: 390, height: 844 })
    await section.locator('#research-mobility summary').click()
    await expect(section.locator('#research-mobility')).toHaveAttribute('open', '')
    await section.screenshot({
      style: '.skip-link, .home-section-navigation { visibility: hidden; }',
      path: testInfo.outputPath(`${locale}-mobile.png`),
    })
    await section.locator('#research-mobility summary').click()
    await expect(section.locator('#research-mobility')).not.toHaveAttribute('open', '')
    await section.locator('#research-hydrogen summary').click()
    const axes = section.locator('#research-hydrogen ol')
    await axes.focus()
    const direction = locale === 'ar' ? 'ArrowLeft' : 'ArrowRight'
    for (const item of await axes.locator('li').all()) {
      await expect
        .poll(
          async () => {
            const visible = await item.evaluate((node) => {
              const frame = node.parentElement!.getBoundingClientRect()
              const item = node.getBoundingClientRect()
              return item.left >= frame.left - 1 && item.right <= frame.right + 1
            })
            if (!visible) await page.keyboard.press(direction)
            return visible
          },
          { timeout: 10000 },
        )
        .toBe(true)
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true)
    const results = await new AxeBuilder({ page })
      .include('#research-priorities')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
}

test('native research disclosures remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto('/fr#research-priorities')
  const section = page.locator('#research-priorities')
  await section.locator('#research-water summary').click()
  await expect(section.locator('#research-water')).toHaveAttribute('open', '')
  await expect(section.locator('#research-water h3')).toHaveCount(4)
  await expect(section.locator('details[open]')).toHaveCount(1)
  await expect(section.locator('a')).toHaveAttribute(
    'href',
    '/fr/recherche-innovation/priorites#domains-directions',
  )
  await context.close()
})

for (const [locale, query] of [
  ['fr', 'Électrolyse dynamique et durabilité'],
  ['en', 'Dynamic electrolysis and durability'],
  ['ar', 'التحليل الكهربائي الديناميكي والمتانة'],
]) {
  test(`${locale}: research search opens the matching theme and serves its illustration`, async ({
    page,
    request,
  }) => {
    const { pageHref } = await import('../../src/lib/site')
    const lang = locale as 'fr' | 'en' | 'ar'
    await page.goto(
      `${pageHref('search', lang)}?${new URLSearchParams({ q: query, type: 'section' })}`,
    )
    const url = pageHref('home', lang, 'research-hydrogen')
    await page.locator(`.search-results a[href="${url}"]`).click()
    await expect(page.locator('#research-hydrogen')).toHaveAttribute('open', '')
    await expect(page.locator('#research-hydrogen h3').first()).toHaveText(query)
    const response = await request.get(
      `/api/search?${new URLSearchParams({ locale, q: await page.locator('#research-hydrogen summary span').innerText(), type: 'media' })}`,
    )
    expect(response.ok()).toBe(true)
    expect(JSON.stringify(await response.json())).toContain('/images/domains/hydrogen.webp')
    const image = await request.get('/images/domains/hydrogen.webp')
    expect(image.ok()).toBe(true)
    expect(image.headers()['content-type']).toContain('image/webp')
  })
}
