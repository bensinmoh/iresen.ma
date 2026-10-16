import { test, expect } from './fixtures'
import { pageHref, pageIds } from '../../src/lib/site'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: shared editorial roles survive page CSS, responsive layouts and navigation`, async ({
    page,
  }) => {
    test.setTimeout(240_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const id of pageIds.filter((id) => !['events', 'usefulLinks'].includes(id))) {
      await page.goto(pageHref(id, locale))
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.evaluate(async () => {
          await document.fonts.ready
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          )
        })
        const failures = await page
          .locator('[data-ui-heading], [data-ui-link], [data-ui-field]')
          .evaluateAll((nodes) => {
            const failures: string[] = []
            const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
            for (const node of nodes) {
              const el = node as HTMLElement
              if (!el.getClientRects().length) continue
              const style = getComputedStyle(el)
              const heading = el.dataset.uiHeading
              const problems: string[] = []
              if (heading) {
                const sizes: Record<string, number> = {
                  section: Math.max(1.75 * root, Math.min(innerWidth * 0.0261, 3.125 * root)),
                  display:
                    innerWidth <= 640
                      ? 1.75 * root
                      : Math.max(2 * root, Math.min(innerWidth * 0.04167, 3.75 * root)),
                  mission: Math.max(1.75 * root, Math.min(innerWidth * 0.034723, 3.125 * root)),
                  card:
                    innerWidth <= 640
                      ? 1.25 * root
                      : Math.max(1.125 * root, Math.min(innerWidth * 0.015, 1.5 * root)),
                  compact: innerWidth <= 640 ? root : 1.125 * root,
                  label: 0.875 * root,
                }
                // Roadmap scenes use the owner-requested viewport-sized display variant.
                if (
                  heading === 'display' &&
                  innerWidth >= 1024 &&
                  el.closest('[data-roadmap-domain]')
                )
                  sizes.display = Math.max(
                    1.75 * root,
                    Math.min(innerWidth * 0.033, innerHeight * 0.05, 3 * root),
                  )
                if (!/^H[1-6]$/.test(el.tagName)) problems.push('native heading rank')
                if (Math.abs(parseFloat(style.fontSize) - sizes[heading]) > 0.1)
                  problems.push(`size ${style.fontSize}`)
                const largeHeading = ['section', 'display', 'mission'].includes(heading)
                const mobile = innerWidth <= 640
                const weight =
                  mobile && largeHeading
                    ? '700'
                    : ['section', 'display'].includes(heading)
                      ? '500'
                      : '600'
                if (style.fontWeight !== weight) problems.push(`weight ${style.fontWeight}`)
                const leading = el.matches(':dir(rtl)')
                  ? 1.45
                  : largeHeading
                    ? mobile
                      ? 34 / 28
                      : 1.2
                    : heading === 'label'
                      ? 1.5
                      : 1.4
                if (Math.abs(parseFloat(style.lineHeight) - sizes[heading] * leading) > 0.2)
                  problems.push(`leading ${style.lineHeight}`)
                if (el.matches(':dir(rtl)') && !['normal', '0px'].includes(style.letterSpacing))
                  problems.push('Arabic tracking')
              } else if (el.hasAttribute('data-ui-field')) {
                if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName))
                  problems.push('native field')
                if (Math.abs(parseFloat(style.fontSize) - root) > 0.1)
                  problems.push(`field font ${style.fontSize}`)
                if (Math.abs(parseFloat(style.lineHeight) - 1.5 * root) > 0.1)
                  problems.push(`field leading ${style.lineHeight}`)
                if (parseFloat(style.minHeight) < 3.5 * root)
                  problems.push(`field height ${style.minHeight}`)
              } else {
                if (el.tagName !== 'A' || !el.hasAttribute('href'))
                  problems.push('native navigation link')
                if (Math.abs(parseFloat(style.fontSize) - root) > 0.1)
                  problems.push(`link font ${style.fontSize}`)
                if (style.gap !== `${0.75 * root}px`) problems.push(`link gap ${style.gap}`)
                if (style.fontWeight !== '600') problems.push(`link weight ${style.fontWeight}`)
              }
              if (problems.length)
                failures.push(
                  `${heading || el.tagName}: ${el.textContent?.trim().slice(0, 55)}: ${problems.join(', ')}`,
                )
            }
            return failures
          })
        expect(failures, `${locale}/${id}/${width}`).toEqual([])
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), {
            message: `${locale}/${id}/${width}: document reflow`,
          })
          .toBe(true)
      }
      if (['home', 'network', 'programmes', 'contact', 'platforms', 'media'].includes(id)) {
        await page
          .locator('main [data-ui-heading]')
          .first()
          .screenshot({
            path: `.local/elements-captures/${locale}-${id}.png`,
            animations: 'disabled',
          })
      }
    }
    // Text enlargement preserves native select clearance, labels and editable text.
    await page.goto(pageHref('contact', locale))
    await page.setViewportSize({ width: 390, height: 1000 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    const field = page.locator('[data-ui-field]').first()
    await field.fill('Test')
    await expect(field).toHaveValue('Test')
    await field.focus()
    expect(await field.evaluate((el) => getComputedStyle(el).outlineWidth)).toBe('2px')
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
    await page.locator('main').screenshot({
      path: `.local/elements-captures/${locale}-contact-enlarged.png`,
      animations: 'disabled',
    })
  })
}
