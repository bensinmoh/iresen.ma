import { test, expect } from './fixtures'
import { pageIds, pageHref } from '../../src/lib/site'

// All canonical public entry points: unexpected inline icon families cannot hide
// behind a single page's visual review. Identity and structural SVGs are retained.
test('public routes use decorative Phosphor icons and retain only identity/structural SVG exceptions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 1000 })
  for (const id of pageIds) {
    await page.goto(pageHref(id, 'fr'))
    const icons = page.locator('svg[data-icon-set="phosphor"]')
    expect(await icons.count(), id).toBeGreaterThan(0)
    expect(
      await icons.evaluateAll((nodes) =>
        nodes.every(
          (el) =>
            el.getAttribute('viewBox') === '0 0 256 256' &&
            el.getAttribute('aria-hidden') === 'true' &&
            el.getAttribute('focusable') === 'false',
        ),
      ),
      id,
    ).toBe(true)
    const unknown = await page
      .locator('svg:not([data-icon-set])')
      .evaluateAll((nodes) =>
        nodes
          .filter(
            (el) =>
              !el.classList.contains('footer-icon') &&
              el.getAttribute('width') !== '0' &&
              el.getAttribute('viewBox') !== '0 0 65 65',
          )
          .map((el) => el.outerHTML.slice(0, 160)),
      )
    expect(unknown, id).toEqual([])
  }
})

test('Phosphor navigation and subject icons stay legible in desktop French and mobile Arabic', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const locale of ['fr', 'ar'] as const) {
    await page.setViewportSize({ width: locale === 'fr' ? 1440 : 390, height: 1000 })
    await page.goto(pageHref('home', locale))
    await page.evaluate(() => document.fonts.ready)
    await page
      .locator('.site-header')
      .screenshot({ path: `.cache/icon-review/${locale}-header.png` })
    await page
      .locator('#research-renewables > summary')
      .screenshot({ path: `.cache/icon-review/${locale}-research.png` })
    await page.goto(pageHref('contact', locale))
    await page
      .locator('.contact-faq-list details')
      .first()
      .screenshot({ path: `.cache/icon-review/${locale}-faq.png` })
    const external = page.locator('.contact-departments a').first()
    const inline = await external.evaluate((el) => {
      const text = [...el.childNodes].find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      )!
      const range = document.createRange()
      range.selectNodeContents(text)
      const label = range.getBoundingClientRect()
      const icon = el.querySelector('svg')!.getBoundingClientRect()
      return Math.abs((label.top + label.bottom) / 2 - (icon.top + icon.bottom) / 2) < 6
    })
    expect(inline).toBe(true)
    const plus = page.locator('.contact-faq-list details').first().locator('.faq-plus')
    const minus = page.locator('.contact-faq-list details').first().locator('.faq-minus')
    await expect(plus).toBeVisible()
    await expect(minus).toBeHidden()
    await page.locator('.contact-faq-list summary').first().click()
    await expect(plus).toBeHidden()
    await expect(minus).toBeVisible()
  }
})
