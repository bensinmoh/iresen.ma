import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { pageSections } from '../../src/lib/page-sections'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: programme discovery, archives, truthful empty state and reflow`, async ({
    page,
  }, testInfo) => {
    const copy = { fr, en, ar }[locale].Programmes
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(pageHref('programmes', locale))
    const region = page.locator('[data-programmes-page]')
    await expect(region.locator('h1')).toHaveText(copy.title)
    for (const { id } of pageSections.programmes)
      await expect(region.locator(`#${id}`)).toHaveCount(1)
    await expect(region.locator('.hero-photo')).toHaveAttribute('data-photo', 'research')
    await expect(region.locator('#programmes-collaborations img')).toHaveAttribute(
      'src',
      /collaborative-prototyping/,
    )
    await expect(region.locator('#research-results img')).toHaveAttribute('src', /aquasolar/)
    await expect(region.locator('#project-lifecycle li')).toHaveCount(6)
    await expect(region.locator('#calls-for-projects article[id^="historical-call-"]')).toHaveCount(
      3,
    )
    const activeCount = await region.locator('#participate article').count()
    await expect(region.locator('#participate h2')).toHaveText(
      activeCount ? { fr, en, ar }[locale].Calls.active : copy.current.title,
    )
    await region.locator('.hero-primary').click()
    await expect(page).toHaveURL(/#participate$/)
    await expect(region.locator('#participate h2')).toBeInViewport()
    const disclosure = region.locator('details').first()
    await disclosure.locator('summary').focus()
    await page.keyboard.press('Enter')
    await expect(disclosure).toHaveAttribute('open', '')
    await expect(disclosure.locator('a')).toHaveAttribute('href', /uit.ac.ma/)
    await region.locator('#practical-questions a').first().click()
    await expect(page).toHaveURL(`${pageHref('contact', locale)}?subject=agency`)
    await expect(page.locator('select[name="subject"]')).toHaveValue('agency')
    await page.goto(pageHref('programmes', locale))
    expect(
      (await new AxeBuilder({ page }).include('[data-programmes-page]').analyze()).violations,
    ).toEqual([])
    const response = await page.request.get(
      '/api/search?' + new URLSearchParams({ locale, q: 'GREEN INNOBOOST' }),
    )
    const results = (await response.json()).items as { id: string; url: string }[]
    expect(
      results.find(({ id }) => id === `section:programmes:calls-for-projects:${locale}`)?.url,
    ).toBe(pageHref('programmes', locale, 'calls-for-projects'))
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.evaluate(() => document.fonts.ready)
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true)
      const eyebrow = await region.locator('.hero-eyebrow').boundingBox()
      expect(Math.abs(eyebrow!.x + eyebrow!.width / 2 - width / 2)).toBeLessThan(2)
      if (width === 390 || width === 1440) {
        for (const target of [
          '.page-hero',
          '#programmes-collaborations',
          '#research-results',
          '#project-lifecycle',
          '#calls-for-projects',
          '#participate',
        ]) {
          await region
            .locator(target)
            .evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
          await region.locator(target).evaluate(async (element) => {
            await Promise.all(
              Array.from(element.querySelectorAll('img')).map((img) =>
                img.decode().catch(() => {}),
              ),
            )
          })
          await page.screenshot({
            path: testInfo.outputPath(`${locale}-${width}-${target.replace(/[.#]/g, '')}.png`),
          })
        }
      }
    }
    await page.setViewportSize({ width: 768, height: 900 })
    await page.addStyleTag({ content: 'html { font-size: 200% !important }' })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
  })
}
test('Arabic programme content and archives work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('programmes', 'ar'))
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  const archives = page.locator('[data-programmes-page] #calls-for-projects')
  await archives.locator('details summary').first().click()
  await expect(archives.locator('details[open] a')).toBeVisible()
  await expect(page.locator('#project-lifecycle li')).toHaveCount(6)
  await context.close()
})
