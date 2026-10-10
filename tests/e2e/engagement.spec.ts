import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { locales } from '../../src/i18n/locales'
import { pageHref } from '../../src/lib/site'
import { engagementContactHref, engagementSections } from '../../src/lib/engagement'

for (const locale of locales) {
  for (const pageId of ['workWithUs', 'transfer'] as const) {
    test(`${locale}: ${pageId} offers readable sections and a real contact pathway`, async ({
      page,
    }) => {
      await page.goto(pageHref(pageId, locale))
      const content = page.locator(`[data-engagement-page="${pageId}"]`)
      await expect(content.locator('section')).toHaveCount(6)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      if (pageId === 'transfer') await expect(content.locator('nav')).toHaveCount(0)
      for (const { id } of engagementSections[pageId]) {
        if (pageId === 'workWithUs') await content.locator(`nav a[href="#${id}"]`).click()
        else await page.goto(pageHref(pageId, locale, id))
        await expect(page).toHaveURL(new RegExp(`#${id}$`))
        await expect(content.locator(`#${id} h2`)).toBeVisible()
      }
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 900 })
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        )
      }
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%'
      })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      await page.evaluate(() => {
        document.documentElement.style.fontSize = ''
      })
      if (pageId === 'transfer') {
        const disclosure = content.locator('details').first()
        await disclosure.locator('summary').focus()
        await page.keyboard.press('Enter')
        await expect(disclosure).toHaveAttribute('open', '')
        await expect(disclosure.locator('p')).toBeVisible()
      }
      expect(
        (await new AxeBuilder({ page }).include('[data-engagement-page]').analyze()).violations,
      ).toEqual([])
      await content.locator('[data-kind="contact"] .button').click()
      await expect
        .poll(() => decodeURI(page.url()).endsWith(engagementContactHref(locale)))
        .toBe(true)
      await expect(page.locator('select[name="subject"]')).toHaveValue('partnerships')
    })
  }
}

test('Arabic transfer disclosures and contact remain usable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  try {
    const page = await context.newPage()
    await page.goto(pageHref('transfer', 'ar'))
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    const disclosure = page.locator('#intellectual-property details').first()
    await disclosure.locator('summary').click()
    await expect(disclosure.locator('p')).toBeVisible()
    await page.locator('[data-kind="contact"] .button').click()
    await expect(page.locator('select[name="subject"]')).toHaveValue('partnerships')
  } finally {
    await context.close()
  }
})
