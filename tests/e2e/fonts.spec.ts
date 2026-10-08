import { expect, test } from '@playwright/test'
import { locales } from '../../src/i18n/locales'
import { navigationGroups, pageHref } from '../../src/lib/site'

const latinFamily = 'Plus Jakarta Sans'
const arabicFamily = 'Alexandria'

for (const locale of locales) {
  test(`${locale}: public text renders the intended local fonts for each script`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('home', locale))
    await page.evaluate(() => document.fonts.ready)
    const session = await page.context().newCDPSession(page)
    await session.send('DOM.enable')
    await session.send('CSS.enable')
    const { root } = await session.send('DOM.getDocument', { depth: 0 })
    const bodyFamily = locale === 'ar' ? arabicFamily : latinFamily
    const bodyFamilies = locale === 'ar' ? [arabicFamily, latinFamily] : [latinFamily]

    async function expectRenderedFonts(
      selector: string,
      expectedFamily = bodyFamily,
      allowedFamilies = bodyFamilies,
    ) {
      const { nodeIds } = await session.send('DOM.querySelectorAll', {
        nodeId: root.nodeId,
        selector,
      })
      expect(nodeIds.length, `${selector}: matching text elements`).toBeGreaterThan(0)
      for (const nodeId of nodeIds) {
        const { fonts } = await session.send('CSS.getPlatformFontsForNode', { nodeId })
        const renderedFonts = fonts.filter(({ glyphCount }) => glyphCount > 0)
        expect(renderedFonts.length, `${selector}: rendered glyphs`).toBeGreaterThan(0)
        expect(
          renderedFonts.map(({ familyName }) => familyName),
          selector,
        ).toContain(expectedFamily)
        for (const font of renderedFonts) {
          expect(font.isCustomFont, `${selector}: ${font.familyName}`).toBe(true)
          expect(allowedFamilies, selector).toContain(font.familyName)
        }
      }
    }

    await expectRenderedFonts(
      '.page-hero h1, .hero-description, .hero-primary, .hero-figures dt, ' +
        '.desktop-navigation-group > summary > span, .header-contact',
    )
    await expectRenderedFonts('.hero-figures dd bdi', latinFamily, [latinFamily])
    await expectRenderedFonts(
      '.site-header .locale-selector a[lang="fr"], .site-header .locale-selector a[lang="en"]',
      latinFamily,
      [latinFamily],
    )
    await expectRenderedFonts('.site-header .locale-selector a[lang="ar"]', arabicFamily, [
      arabicFamily,
    ])

    for (const group of navigationGroups) {
      const selector = `.desktop-navigation-group[data-navigation-group="${group.id}"]`
      const disclosure = page.locator(selector)
      await disclosure.locator(':scope > summary').focus()
      await page.keyboard.press('Enter')
      await expect(disclosure).toHaveAttribute('open', '')
      await page.evaluate(() => document.fonts.ready)
      await expectRenderedFonts(
        `${selector} .mega-menu-intro h2, ${selector} .mega-menu-intro-copy p, ` +
          `${selector} .mega-menu-link-title, ${selector} .mega-menu-link-description`,
      )
      if (group.id === 'institute' || group.id === 'research') {
        await expectRenderedFonts(
          `${selector} .mega-menu-feature-title, ${selector} .mega-menu-feature-description`,
        )
      }
      if (group.id === 'research') {
        await expectRenderedFonts(`${selector} .key-figure-value bdi`, latinFamily, [latinFamily])
      }
      await page.keyboard.press('Escape')
    }

    await page.locator('.footer-newsletter').scrollIntoViewIfNeeded()
    await expectRenderedFonts(
      '.footer-identity p, .footer-links h2, .footer-links a, .footer-contact-label, ' +
        '.footer-newsletter-copy h2, .footer-newsletter-copy p, #footer-newsletter-email, ' +
        '.footer-newsletter-button, .footer-newsletter-consent span, .footer-copyright',
    )
    await expectRenderedFonts('.footer-identity p bdi, .footer-contact-value bdi', latinFamily, [
      latinFamily,
    ])

    await page.setViewportSize({ width: 390, height: 844 })
    await page.locator('.menu-toggle').scrollIntoViewIfNeeded()
    await expectRenderedFonts('.menu-toggle > span')
    await session.detach()
  })
}
