import AxeBuilder from '@axe-core/playwright'
import { expect, test } from './fixtures'
import {
  footerPageIds,
  pageHref,
  pageLinkHref,
  pageIds,
  newsListingHref,
  resourcePatentLink,
} from '../../src/lib/site'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: all utility notices have compact readable heroes and accessible responsive content`, async ({
    page,
  }) => {
    test.setTimeout(120_000)
    const catalog = { fr, en, ar }[locale]
    for (const id of footerPageIds.filter((id) => id !== 'usefulLinks')) {
      await page.goto(pageHref(id, locale))
      const root = page.locator('[data-utility-page]')
      await expect(page.locator('.footer-utilities button')).toHaveCount(0)
      await expect(root.getByRole('heading', { level: 1 })).toHaveText(catalog.Pages[id])
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(root.locator('.hero-photo, .hero-actions, .hero-highlights')).toHaveCount(0)
      await expect(root).not.toContainText('À prévoir')
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        const hero = (await root.locator('.utility-hero').boundingBox())!
        expect(hero.height).toBeLessThan(160)
        expect(await root.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        )
        if (width === 390 || width === 1440)
          await page.screenshot({ path: `/tmp/utility-${locale}-${id}-${width}.png` })
      }
      const results = await new AxeBuilder({ page }).include('[data-utility-page]').analyze()
      expect(results.violations).toEqual([])
      if (id === 'sitemap') {
        const map = root.locator('.utility-sitemap')
        await expect(map.locator('p')).toHaveCount(0)
        await expect(map.locator('a')).toHaveCount(pageIds.length + 1)
        for (const pageId of pageIds)
          await expect(map.locator(`a[href="${pageLinkHref(pageId, locale)}"]`)).toHaveCount(1)
        await expect(map.locator(`a[href="${newsListingHref(locale)}"]`)).toHaveCount(1)
        await expect(
          map
            .getByRole('region', { name: catalog.Navigation.resources, exact: true })
            .getByRole('link', { name: catalog.Navigation.patents, exact: true }),
        ).toHaveAttribute('href', resourcePatentLink(locale))
        await map.getByRole('link', { name: catalog.Navigation.patents, exact: true }).click()
        await expect(page).toHaveURL(resourcePatentLink(locale))
        await expect(page.locator('#adoption-initiatives')).toBeVisible()
        await page.goto(pageHref('sitemap', locale))
        await map.locator('a').first().focus()
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL(pageHref('home', locale))
      } else if (id === 'cookies') {
        await root.getByRole('button', { name: catalog.CookieConsent.manage }).click()
        await expect(page.getByRole('dialog')).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(root.getByRole('button', { name: catalog.CookieConsent.manage })).toBeFocused()
      } else if (id === 'privacy') {
        await expect(root.locator('#rights-contact a').first()).toHaveAttribute(
          'href',
          /^mailto:contact@iresen.ma\?subject=/,
        )
        await expect(root.locator('#rights-contact')).toContainText('CNDP')
      }
    }
    await page.goto(pageHref('privacy', locale))
    await page.setViewportSize({ width: 390, height: 900 })
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.locator('#rights-contact a').first()).toBeVisible()
    await page.screenshot({ path: `/tmp/utility-${locale}-privacy-200.png`, fullPage: true })
  })
}

test('without JavaScript the Arabic sitemap and notices keep their links and reading order', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('sitemap', 'ar'))
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await page
    .locator('.utility-sitemap')
    .getByRole('link', { name: ar.Pages.privacy, exact: true })
    .click()
  await expect(page.locator('#rights-contact')).toContainText('contact@iresen.ma')
  await expect(page.locator('#controller-scope a[href="tel:+212537682236"]')).toBeVisible()
  await context.close()
})
