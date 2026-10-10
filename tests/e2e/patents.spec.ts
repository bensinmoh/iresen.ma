import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pageHref } from '../../src/lib/site'
import { patents } from '../../src/lib/patents'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

for (const locale of ['fr', 'en', 'ar'] as const) {
  const copy = { fr, en, ar }[locale].Transfer
  test(`${locale}: patent filters, register links, direct anchors and contact context`, async ({
    page,
  }) => {
    await page.goto(pageHref('transfer', locale))
    const section = page.locator('#adoption-initiatives')
    await expect(section.locator('article:visible')).toHaveCount(12)
    await section.getByRole('button', { name: copy.catalog.showMore, exact: true }).click()
    await expect(section.locator('article:visible')).toHaveCount(24)
    await section.getByRole('button', { name: copy.catalog.showAll, exact: true }).click()
    await expect(section.locator('article:visible')).toHaveCount(59)
    await section.getByRole('searchbox').fill('53044')
    await expect(section.locator('article:visible')).toHaveCount(1)
    await section.getByLabel(copy.catalog.theme, { exact: true }).selectOption('mobility')
    await section.getByLabel(copy.catalog.year, { exact: true }).selectOption('2021')
    await section.getByLabel(copy.catalog.depositor, { exact: true }).selectOption('IRESEN')
    await expect(section.locator('#patent-53044')).toBeVisible()
    await expect(
      section.locator('#patent-53044').getByRole('link', { name: copy.catalog.view }),
    ).toHaveAttribute('href', patents.find((p) => p.reference === '53044')!.registerUrl)
    await section.getByRole('searchbox').fill('no-such-patent')
    await expect(section.getByText(copy.catalog.empty, { exact: true })).toBeVisible()
    await section.getByRole('button', { name: copy.catalog.reset, exact: true }).click()
    await expect(section.locator('article:visible')).toHaveCount(12)
    await page.goto(pageHref('transfer', locale, 'patent-74893'))
    await expect(page.locator('#patent-74893')).toBeVisible()
    await page.locator('#patent-74893').getByRole('link', { name: copy.catalog.discuss }).click()
    await expect(page.locator('select[name="subject"]')).toHaveValue('partnerships')
    await expect(page.locator('textarea[name="message"]')).toHaveValue(/74893/)
    await page.goto(pageHref('transfer', locale))
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = ''
    })
    expect(
      (await new AxeBuilder({ page }).include('[data-engagement-page="transfer"]').analyze())
        .violations,
    ).toEqual([])
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const id of ['results-to-transfer', 'transfer-pathways']) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded()
        await page.screenshot({ path: `.cache/patents-review/${locale}-${width}-${id}.png` })
      }
      await page.locator('#research-to-use').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `.cache/patents-review/${locale}-${width}-process.png` })
      await page.locator('#adoption-initiatives-heading').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `.cache/patents-review/${locale}-${width}-catalog.png` })
      await page.locator('#patent-37172').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `.cache/patents-review/${locale}-${width}-cards.png` })
    }
  })
  test(`${locale}: site search discovers a patent at its canonical anchor`, async ({ page }) => {
    await page.goto(`${pageHref('search', locale)}?q=53044`)
    const link = page.locator(`a[href$="#patent-53044"]`).first()
    await expect(link).toBeVisible()
    await link.click()
    await expect(page.locator('#patent-53044')).toBeVisible()
  })
}

test('all patents remain readable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  try {
    const page = await context.newPage()
    await page.goto(pageHref('transfer', 'ar', 'patent-74893'))
    await expect(page.locator('#adoption-initiatives article:visible')).toHaveCount(59)
    await expect(page.locator('#patent-74893')).toBeVisible()
    await expect(page.locator('#patent-74893 a').first()).toHaveAttribute('href', /numDepot=74893/)
  } finally {
    await context.close()
  }
})
