import AxeBuilder from '@axe-core/playwright'
import { expect, test } from './fixtures'
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
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto(pageHref('home', locale, 'collaboration'))
    const section = page.locator('#collaboration')
    await expect(section.locator('h2')).toHaveText(catalogs[locale].HomeCollaboration.title)
    await expect(section.locator('article')).toHaveCount(5)
    await expect(section.locator('header a')).toHaveAttribute(
      'href',
      pageHref('workWithUs', locale, 'choose-pathway'),
    )
    await expect(section.locator('header a')).toHaveText(catalogs[locale].HomeCollaboration.action)
    await expect(section).toContainText('+120')
    await expect(section).toContainText('ISO 9001:2015')
    await expect(section.locator('aside')).toContainText(
      catalogs[locale].Hero.certification.description,
    )
    await expect(page.locator('.hero-certification-description')).toHaveText(
      catalogs[locale].HomeCollaboration.certification,
    )
    await expect(section.locator('article a').first()).toHaveAttribute(
      'href',
      pageHref('programmes', locale),
    )
    const desktop = await section.locator('header, article').evaluateAll((nodes) =>
      nodes.map((node) => {
        const r = node.getBoundingClientRect()
        return { top: r.top, left: r.left }
      }),
    )
    expect(new Set(desktop.map((r) => Math.round(r.top))).size).toBe(2)
    expect(new Set(desktop.map((r) => Math.round(r.left))).size).toBe(3)
    await section.screenshot({ path: `.cache/collaboration-review/${locale}-desktop.png` })
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 1000 })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      await expect(section.locator('article:visible')).toHaveCount(width > 640 ? 4 : 5)
      for (const link of await section.locator('a:visible').all()) {
        await link.focus()
        await expect(link).toBeFocused()
        await expect(link).toBeInViewport()
      }
    }
    await page.setViewportSize({ width: 390, height: 1000 })
    const controls = section.locator('[data-collaboration-navigation]')
    await expect(controls.locator('button')).toHaveCount(5)
    await controls.locator('button').last().click()
    await expect(controls.locator('button').last()).toHaveAttribute('aria-current', 'true')
    await expect(section.locator('article').last()).toBeInViewport()
    await section
      .locator('[data-collaboration-rail]')
      .evaluate((el) => el.scrollTo({ left: 0, behavior: 'instant' }))
    await expect(controls.locator('button').first()).toHaveAttribute('aria-current', 'true')
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
    await section.locator('[data-audience="industry"] a').click()
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
  await expect(page.locator('#collaboration article')).toHaveCount(5)
  await page.locator('#collaboration article a').first().focus()
  await expect(page.locator('#collaboration article a').first()).toBeFocused()
  await context.close()
})
