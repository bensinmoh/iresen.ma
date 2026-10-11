import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { pageSections } from '../../src/lib/page-sections'
import { networkLaboratories } from '../../src/lib/network'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: laboratory discovery, filters, anchors and reflow`, async ({ page }) => {
    await page.goto(pageHref('network', locale))
    const response = await page.request.get(
      '/api/search?' +
        new URLSearchParams({
          locale,
          q:
            locale === 'ar'
              ? 'الجسيمات النانوية'
              : locale === 'en'
                ? 'Nanoparticles'
                : 'Nanoparticules',
        }),
    )
    const results = (await response.json()).items as { id: string; url: string }[]
    expect(
      results.find((item) => item.id === `section:network:laboratory-nanoparticles:${locale}`)?.url,
    ).toBe(`${pageHref('network', locale)}#laboratory-nanoparticles`)
    await expect(page.locator('main h1')).toHaveCount(1)
    for (const { id } of pageSections.network) await expect(page.locator(`#${id}`)).toHaveCount(1)
    await expect(page.locator('#request-expertise')).toHaveCount(0)
    const cards = page.locator('[data-laboratory-card]:visible')
    await expect(cards).toHaveCount(14)
    const directory = page.locator('#scientific-network')
    await directory.scrollIntoViewIfNeeded()
    const input = page.locator('#laboratory-query')
    await input.fill('marrakech')
    await input.press('Enter')
    await expect(cards).toHaveCount(3)
    await expect(directory.getByRole('status')).toContainText('3')
    await directory.getByRole('group').getByRole('button').nth(2).click()
    await expect(cards).toHaveCount(1)
    await expect(cards.first()).toHaveAttribute('id', 'laboratory-battery-testing')
    await input.fill('unknown laboratory')
    await input.press('Enter')
    await expect(cards).toHaveCount(0)
    await directory
      .locator('button')
      .filter({
        hasText:
          locale === 'ar'
            ? 'مسح المرشحات'
            : locale === 'en'
              ? 'Clear filters'
              : 'Effacer les filtres',
      })
      .first()
      .click()
    await expect(cards).toHaveCount(14)
    await input.fill(locale === 'ar' ? 'القنيطرة' : 'kenitra')
    await input.press('Enter')
    await expect(cards).toHaveCount(2)
    await input.fill('')
    await expect(cards).toHaveCount(14)
    await expect(directory.locator('a[href="mailto:elomari.hamid@gmail.com"]')).toHaveCount(1)
    await expect(
      new AxeBuilder({ page }).include('[data-network-page]').analyze(),
    ).resolves.toMatchObject({ violations: [] })
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await expect
        .poll(() =>
          page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
        )
        .toBe(true)
    }
    await page.setViewportSize({ width: 768, height: 900 })
    await page.addStyleTag({ content: 'html { font-size: 200% !important }' })
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      )
      .toBe(true)
  })
}

test('network: no-JavaScript reading and direct laboratory destination', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('network', 'fr', 'laboratory-nanoparticles'))
  await expect(page).toHaveURL(/#laboratory-nanoparticles$/)
  await expect(page.locator('[data-laboratory-card]')).toHaveCount(networkLaboratories.length)
  await expect(page.locator('#laboratory-nanoparticles')).toBeVisible()
  await expect(page.locator('#skills-training h2')).toBeVisible()
  await context.close()
})
