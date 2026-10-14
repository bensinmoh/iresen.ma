import { expect, test } from './fixtures'
import AxeBuilder from '@axe-core/playwright'
import { locales } from '../../src/i18n/locales'
import { pageHref } from '../../src/lib/site'

for (const locale of locales) {
  test(`${locale}: innovation pathway connects research to platforms and transfer`, async ({
    page,
  }) => {
    await page.goto(`/${locale}#innovation-value-chain`)
    const section = page.locator('#innovation-value-chain')
    await expect(section.locator('ul > li')).toHaveCount(3)
    await expect(section.locator('a')).toHaveAttribute('href', pageHref('transfer', locale))
    const order = await page
      .locator('main section[id]')
      .evaluateAll((nodes) => nodes.map((node) => node.id))
    expect(order.indexOf('research-priorities')).toBeLessThan(
      order.indexOf('innovation-value-chain'),
    )
    expect(order.indexOf('innovation-value-chain')).toBeLessThan(
      order.indexOf('platforms-expertise'),
    )
    await expect(page.locator('#figures')).toBeAttached()
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await page.evaluate(() => document.fonts.ready)
      expect(await section.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
      if (width === 1440) {
        const height = (await section.boundingBox())!.height
        expect(height).toBeLessThan(500)
        expect(height).toBeLessThan(
          (await page.locator('#research-priorities').boundingBox())!.height,
        )
        expect(height).toBeLessThan(
          (await page.locator('#platforms-expertise').boundingBox())!.height,
        )
      }
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = ''
    })
    const scan = await new AxeBuilder({ page }).include('#innovation-value-chain').analyze()
    expect(scan.violations).toEqual([])
    await section.locator('a').click()
    await expect(page).toHaveURL((url) => decodeURI(url.pathname) === pageHref('transfer', locale))
  })
}

for (const locale of ['fr', 'ar'] as const) {
  test(`${locale}: all alternative pathways remain readable without JavaScript`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled: false,
      reducedMotion: 'reduce',
      viewport: { width: 320, height: 900 },
    })
    const page = await context.newPage()
    await page.goto(pageHref('home', locale, 'innovation-value-chain'))
    const section = page.locator('#innovation-value-chain')
    await expect(section.locator('ul > li')).toHaveCount(3)
    for (const item of await section.locator('li').all()) {
      await item.scrollIntoViewIfNeeded()
      await expect(item).toBeInViewport()
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await context.close()
  })
}
