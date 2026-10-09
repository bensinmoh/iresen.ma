import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pageHref } from '../../src/lib/site'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

const catalogs = { fr, en, ar }
for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: collaboration guides each audience with accessible destinations and search`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(pageHref('home', locale, 'collaboration'))
    const section = page.locator('#collaboration')
    await expect(section.locator('h2')).toHaveText(catalogs[locale].HomeCollaboration.title)
    await expect(section.locator('article')).toHaveCount(4)
    await expect(section).toContainText('+120')
    await expect(section).toContainText('ISO 9001:2015')
    await expect(section.locator('article a').first()).toHaveAttribute(
      'href',
      pageHref('opportunities', locale),
    )
    await section.screenshot({ path: `.cache/collaboration-review/${locale}-desktop.png` })
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      for (const link of await section.locator('a').all()) {
        await link.focus()
        await expect(link).toBeFocused()
        await expect(link).toBeInViewport()
      }
    }
    await page.setViewportSize({ width: 390, height: 1000 })
    await section.screenshot({ path: `.cache/collaboration-review/${locale}-mobile.png` })
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%'
      })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      expect(
        await section
          .locator('h2, h3, p')
          .evaluateAll((nodes) =>
            nodes
              .filter((node) => node.scrollWidth > node.clientWidth + 1)
              .map((node) => node.textContent),
          ),
      ).toEqual([])
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = ''
    })
    const scan = await new AxeBuilder({ page }).include('#collaboration').analyze()
    expect(scan.violations).toEqual([])
    const response = await request.get(
      `/api/search?${new URLSearchParams({ locale, q: catalogs[locale].HomeCollaboration.paths.decision.title, type: 'section' })}`,
    )
    expect(response.status()).toBe(200)
    expect((await response.json()).items).toContainEqual(
      expect.objectContaining({ url: pageHref('home', locale, 'collaboration') }),
    )
    await section.locator('article a').nth(2).click()
    await expect(page).toHaveURL(/subject=platforms#send-request$/)
    await expect(page.locator('select[name="subject"]')).toHaveValue('platforms')
  })
}

test('collaboration remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto('/ar#collaboration')
  await expect(page.locator('#collaboration article')).toHaveCount(4)
  await page.locator('#collaboration article a').first().focus()
  await expect(page.locator('#collaboration article a').first()).toBeFocused()
  await context.close()
})
