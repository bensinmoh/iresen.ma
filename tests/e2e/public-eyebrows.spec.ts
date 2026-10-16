import { test, expect } from './fixtures'
import { pageHref, pageIds } from '../../src/lib/site'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: public surtitles share homepage typography and original Apex Leaf`, async ({
    page,
  }) => {
    test.setTimeout(180_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const id of pageIds.filter((id) => id !== 'events' && id !== 'usefulLinks')) {
      await page.goto(pageHref(id, locale))
      await page.evaluate(() => document.fonts.ready)
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 1000 })
        if (await page.locator('[data-section-eyebrow]').count()) {
          await expect
            .poll(() =>
              page
                .locator('[data-section-eyebrow]')
                .first()
                .evaluate((el) => getComputedStyle(el).fontSize),
            )
            .toBe(width <= 640 ? '14px' : '18px')
        }
        await page.evaluate(
          () =>
            new Promise<void>((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
            ),
        )
        const values = await page.locator('[data-section-eyebrow]').evaluateAll((nodes) => {
          const colors: Record<string, string> = {}
          for (const [tone, token] of Object.entries({
            blue: 'blue',
            white: 'white',
            cyan: 'energy-cyan',
            navy: 'navy',
          })) {
            const probe = document.createElement('span')
            probe.style.color = `var(--color-${token})`
            document.body.append(probe)
            colors[tone] = getComputedStyle(probe).color
            probe.remove()
          }
          return nodes.map((node) => {
            const style = getComputedStyle(node)
            const leaf = getComputedStyle(node.firstElementChild!)
            return {
              text: node.textContent,
              tag: node.tagName,
              font: style.fontSize,
              weight: style.fontWeight,
              line: style.lineHeight,
              tracking: style.letterSpacing,
              transform: style.textTransform,
              tone: style.color === colors[(node as HTMLElement).dataset.tone!],
              leaf:
                leaf.maskImage.includes('/brand/apex-leaf.svg') &&
                parseFloat(leaf.width) > 0 &&
                leaf.backgroundColor === style.color,
              overflow: node.scrollWidth > node.clientWidth + 1,
            }
          })
        })
        for (const value of values) {
          expect(value, `${locale}/${id}/${width}: ${value.text}`).toMatchObject({
            tag: 'P',
            font: width <= 640 ? '14px' : '18px',
            weight: '400',
            line: width <= 640 ? '21px' : '27px',
            tracking: locale === 'ar' ? 'normal' : width <= 640 ? '1.4px' : '1.08px',
            transform: 'uppercase',
            tone: true,
            leaf: true,
            overflow: false,
          })
        }
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), {
            message: `${locale}/${id}/${width}`,
          })
          .toBe(true)
          .catch(async (error) => {
            console.log(
              await page.evaluate(() => ({
                viewport: innerWidth,
                scroll: document.documentElement.scrollWidth,
                nodes: [...document.querySelectorAll('main *')]
                  .filter(
                    (node) =>
                      node.getBoundingClientRect().right > innerWidth + 1 ||
                      node.getBoundingClientRect().left < -1,
                  )
                  .slice(0, 12)
                  .map((node) => ({
                    tag: node.tagName,
                    class: node.className,
                    text: node.textContent?.slice(0, 80),
                    left: node.getBoundingClientRect().left,
                    right: node.getBoundingClientRect().right,
                  })),
              })),
            )
            throw error
          })
      }
      if (
        locale === 'fr' &&
        ['network', 'institute', 'programmes', 'contact', 'media', 'news'].includes(id)
      ) {
        const labels = page.locator('[data-section-eyebrow]')
        for (let i = 0; i < (await labels.count()); i++)
          await labels
            .nth(i)
            .screenshot({ path: `/tmp/shared-surtitle-${id}-${i}.png`, animations: 'disabled' })
      }
    }
  })
}
