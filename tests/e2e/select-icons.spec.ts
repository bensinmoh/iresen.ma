import { test, expect } from './fixtures'
import { pageHref } from '../../src/lib/site'
for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: native single selects share an inset Phosphor caret and reserved text space`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const id of ['contact', 'opportunities', 'transfer', 'search'] as const) {
      await page.goto(pageHref(id, locale) + (id === 'search' ? '?q=hydrogen' : ''))
      await page.evaluate(() => document.fonts.ready)
      const fields = page.locator('select:not([multiple]):not([size])')
      expect(await fields.count(), id).toBeGreaterThan(0)
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 1000 })
        for (const scale of ['100%', '200%']) {
          await page.evaluate((value) => (document.documentElement.style.fontSize = value), scale)
          const geometry = await fields.evaluateAll((nodes) =>
            nodes.map((el) => {
              const s = getComputedStyle(el)
              const size = parseFloat(s.backgroundSize)
              const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
              return {
                appearance: s.appearance,
                phosphor: s.backgroundImage.includes('data:image/svg+xml'),
                padding: parseFloat(s.paddingInlineEnd),
                size,
                inset: root * 1.25,
                position: s.backgroundPositionX,
                rtl: s.direction === 'rtl',
                count: el.parentElement?.querySelectorAll(':scope > svg').length,
              }
            }),
          )
          for (const field of geometry) {
            expect(field.appearance).toBe('none')
            expect(field.phosphor).toBe(true)
            expect(field.padding).toBeGreaterThanOrEqual(field.size + field.inset + 10)
            expect(field.position).toBe(
              field.rtl ? `${field.inset}px` : `calc(100% - ${field.inset}px)`,
            )
            expect(field.count).toBe(0)
          }
        }
        await page.evaluate(() => (document.documentElement.style.fontSize = ''))
      }
      if (id === 'contact') {
        const subject = page.locator('#contact-subject')
        await subject.selectOption('platforms')
        await expect(subject).toHaveValue('platforms')
        await subject.screenshot({ path: `.cache/select-review/${locale}.png` })
        await page.emulateMedia({ forcedColors: 'active' })
        await expect(subject).toHaveCSS('appearance', 'auto')
        await expect(subject).toHaveCSS('background-image', 'none')
        await page.emulateMedia({ forcedColors: 'none' })
      }
    }
  })
}
