import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { governanceBoardSites } from '../../src/lib/governance'
import { pageSections } from '../../src/lib/page-sections'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: governance councils, owner roles and responsive organisation`, async ({
    page,
  }) => {
    await page.goto(pageHref('governance', locale))
    await page.evaluate(() => document.fonts.ready)
    const governance = page.locator('[data-governance-page]')
    await expect(governance.locator('h1')).toHaveCount(1)
    await expect(governance.locator('#council-representatives li')).toHaveCount(16)
    for (const url of Object.values(governanceBoardSites))
      await expect(governance.locator(`#council-representatives a[href="${url}"]`)).toHaveCount(1)
    await expect(governance.locator('[id^="scientific-member-"]')).toHaveCount(8)
    await expect(governance.locator('#department-responsibilities article')).toHaveCount(7)
    await expect(governance.locator('#council-representatives')).not.toContainText(
      'Société d’Ingénierie Énergétique',
    )
    await expect(governance.locator('#council-representatives')).toContainText('UM6P')
    for (const entry of pageSections.governance) {
      for (const { id } of [entry, ...(entry.children ?? [])])
        await expect(governance.locator(`#${id}`)).toHaveCount(1)
    }
    for (const name of [
      'Soukaina BOUDOUDOU',
      'Ayoub HIRT',
      'Mouhcine BENMEZIANE',
      'Laila TYDRINI',
      'Imane MOUBACHIR',
      'Jamaleddine FOUHAM',
    ]) {
      await expect(governance.locator('#department-responsibilities')).toContainText(name)
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await expect
        .poll(() =>
          governance.locator('#council-representatives li img').evaluateAll((images) =>
            images.every((image) => {
              const imageBox = image.getBoundingClientRect()
              const slot = image.parentElement!.getBoundingClientRect()
              const label = image.parentElement!.nextElementSibling!.getBoundingClientRect()
              return (
                imageBox.width <= slot.width + 1 &&
                imageBox.height <= slot.height + 1 &&
                imageBox.bottom <= label.top + 1
              )
            }),
          ),
        )
        .toBe(true)
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = ''
    })
    await governance.locator('nav a[href="#leadership-organisation"]').click()
    await expect(page).toHaveURL(/#leadership-organisation$/)
    await expect(governance.locator('#organisation-title')).toBeVisible()
  })
}

test('French roles omit director titles for strategy and IT; page has no serious axe violations', async ({
  page,
}) => {
  await page.goto(pageHref('governance', 'fr'))
  for (const [name, role] of [
    ['Imane MOUBACHIR', 'Strat & Orga'],
    ['Jamaleddine FOUHAM', 'IT et SI'],
  ]) {
    const card = page.locator('#department-responsibilities article').filter({ hasText: name })
    await expect(card.locator('h4').first().locator('..').locator('p')).toHaveText(role)
  }
  const result = await new AxeBuilder({ page }).include('[data-governance-page]').analyze()
  expect(
    result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
  ).toEqual([])
})

test('governance remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('governance', 'fr'))
  await expect(page.locator('#scientific-council')).toContainText('Ahmed ENNAOUI')
  await expect(page.locator('#department-responsibilities')).toContainText('Soukaina BOUDOUDOU')
  await context.close()
})

test('scientific council and portraits are discoverable in all three locales', async ({ page }) => {
  for (const locale of ['fr', 'en', 'ar'] as const) {
    const query = new URLSearchParams({ q: 'Ahmed ENNAOUI', type: 'section' })
    await page.goto(`${pageHref('search', locale)}?${query}`)
    await expect(
      page.locator(
        `.search-results a[href="${pageHref('governance', locale, 'scientific-council')}"]`,
      ),
    ).toBeVisible()
    query.set('q', 'Soukaina BOUDOUDOU')
    query.set('type', 'media')
    await page.goto(`${pageHref('search', locale)}?${query}`)
    await expect(
      page.locator(
        '.search-results a[href="/images/governance/soukaina-portrait.png"]:not([aria-hidden])',
      ),
    ).toBeVisible()
  }
})
