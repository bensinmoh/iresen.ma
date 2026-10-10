import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import reports from '../../src/data/media-reports.json' with { type: 'json' }
import records from '../../src/data/publications.json' with { type: 'json' }

for (const [locale, path] of [
  ['fr', '/fr/ressources/publications-rapports'],
  ['en', '/en/resources/publications-reports'],
  ['ar', '/ar/الموارد/المنشورات-والتقارير'],
] as const) {
  test(`${locale}: bibliographic search, filters, DOI and reports`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('[data-publications-page]')).toBeVisible()
    await expect(page.locator('#publication-catalogue article')).toHaveCount(6)
    await expect(page.locator('#institutional-reports article')).toHaveCount(reports.length)
    const paper = records.find((p) => p.doiUrl && p.authors)!
    await page.locator('#publication-query').fill(paper.doiUrl!)
    await page.locator('#find-publication button').click()
    const notice = page.locator(`#publication-${paper.id}`)
    await expect(notice).toBeVisible()
    await expect(notice.locator('h3 a')).toHaveAttribute('href', paper.doiUrl!)
    await expect(notice).toContainText(paper.authors!)
    await expect(notice.locator('time')).toHaveAttribute('datetime', String(paper.year))
    await page.goto(`${path}?topic=solar&year=2026#publication-catalogue`)
    await expect(page.locator('input[name=topic][value=solar]')).toBeChecked()
    await expect(page.locator('input[name=year][value="2026"]')).toBeChecked()
    const topicCheckbox = page.locator('input[name=topic][value=solar]')
    const filteredTopicCount = await topicCheckbox.locator('..').locator('small').innerText()
    await page.locator('input[name=year][value="2026"]').uncheck()
    await expect(topicCheckbox.locator('..').locator('small')).toHaveText(
      (505).toLocaleString(locale),
    )
    await page.locator('input[name=year][value="2026"]').check()
    await expect(topicCheckbox.locator('..').locator('small')).toHaveText(filteredTopicCount)
    await topicCheckbox.uncheck()
    await expect(page).toHaveURL(/year=2026/)
    await expect(page).not.toHaveURL(/topic=solar/)
    await topicCheckbox.check()
    await expect(page).toHaveURL(/topic=solar/)
    await expect(page.locator('#publication-catalogue article')).toHaveCount(6)
    await expect(page.locator('#publication-catalogue [type=submit]')).toHaveCount(0)
    await page.goto(`${path}?q=nonexistent-publication-xyz#publication-catalogue`)
    await expect(page.locator('#publication-catalogue article')).toHaveCount(0)
    await page.goto(`${path}?publication=${records.at(-1)!.id}#publication-${records.at(-1)!.id}`)
    await expect(page.locator(`#publication-${records.at(-1)!.id}`)).toBeVisible()
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(path)
    await expect(
      page.locator('details').filter({ has: page.locator('input[name=topic]') }),
    ).not.toHaveAttribute('open', '')
    await page
      .locator('details')
      .filter({ has: page.locator('input[name=topic]') })
      .locator('summary')
      .click()
    await expect(page.locator('input[name=topic][value=solar]')).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    const accessibility = await new AxeBuilder({ page })
      .include('[data-publications-page]')
      .analyze()
    expect(accessibility.violations).toEqual([])
  })
}
test('native publication search works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/fr/ressources/publications-rapports?q=photovoltaic#publication-catalogue')
  await expect(page.locator('#publication-catalogue article')).toHaveCount(6)
  await expect(page.locator('#publication-query')).toHaveValue('photovoltaic')
  await context.close()
})

test('frequent searches align and automatic filters respect reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/fr/ressources/publications-rapports')
  const alignment = await page
    .locator('#featured-publications a')
    .first()
    .evaluate((link) => {
      const label = link.parentElement!.querySelector('span')!
      const a = link.getBoundingClientRect(),
        b = label.getBoundingClientRect()
      return Math.abs(a.top + a.height / 2 - (b.top + b.height / 2))
    })
  expect(alignment).toBeLessThan(1)
  await page.evaluate(() => {
    document.startViewTransition = () => {
      throw new Error('Reduced motion must bypass snapshots')
    }
  })
  await page.locator('input[name=topic][value=solar]').check()
  await expect(page.locator('#publication-catalogue [role=status]')).toContainText('505')
  await expect(
    page.locator('input[name=year][value="2026"]').locator('..').locator('small'),
  ).toHaveText('31')
  await page.locator('input[name=year][value="2026"]').check()
  await expect(page.locator('#publication-catalogue [role=status]')).toContainText('31')
  await expect(
    page.locator('input[name=topic][value=solar]').locator('..').locator('small'),
  ).toHaveText('31')
})

for (const [locale, path] of [
  ['fr', '/fr/ressources/publications-rapports'],
  ['en', '/en/resources/publications-reports'],
  ['ar', '/ar/الموارد/المنشورات-والتقارير'],
] as const) {
  test(`${locale}: compact responsive search and horizontal figures`, async ({ page }) => {
    await page.goto(path)
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 })
      await expect
        .poll(async () =>
          page.locator('[data-frequent-searches]').evaluate((element) => {
            const tops: number[] = []
            for (const child of element.children) {
              const range = document.createRange()
              range.selectNodeContents(child)
              for (const rect of range.getClientRects()) {
                if (!tops.some((top) => Math.abs(top - rect.top) < 2)) tops.push(rect.top)
              }
            }
            return tops.length
          }),
        )
        .toBeLessThanOrEqual(2)
      const field = await page.locator('#publication-query').boundingBox()
      const button = await page.locator('#find-publication button').boundingBox()
      expect(button!.y - (field!.y + field!.height)).toBeGreaterThanOrEqual(10)
      await expect(page.locator('#find-publication')).toHaveCSS(
        'background-color',
        'rgba(0, 0, 0, 0)',
      )
      const rail = page.locator('[data-publications-page] [role=region]')
      expect(await rail.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true)
      await rail.evaluate(
        (element, rtl) =>
          element.scrollTo({ left: (rtl ? -1 : 1) * element.scrollWidth, behavior: 'instant' }),
        locale === 'ar',
      )
      const last = await rail.locator(':scope > div').last().boundingBox()
      expect(last!.x).toBeGreaterThanOrEqual(-1)
      expect(last!.x + last!.width).toBeLessThanOrEqual(width + 1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
    await page.setViewportSize({ width: 320, height: 900 })
    await page.addStyleTag({ content: 'html { font-size: 200%; }' })
    await expect
      .poll(async () =>
        page.locator('[data-frequent-searches]').evaluate((element) => {
          const tops: number[] = []
          for (const child of element.children) {
            const range = document.createRange()
            range.selectNodeContents(child)
            for (const rect of range.getClientRects())
              if (!tops.some((top) => Math.abs(top - rect.top) < 2)) tops.push(rect.top)
          }
          return tops.length
        }),
      )
      .toBeLessThanOrEqual(2)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
