import { test, expect } from './fixtures'

for (const locale of ['fr', 'en', 'ar']) {
  test(`${locale}: homepage surtitles share typography, semantics and Apex Leaf`, async ({
    page,
    request,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(`/${locale}`)
    await page.evaluate(() => document.fonts.ready)
    const labels = page.locator('[data-section-eyebrow]')
    await expect(labels).toHaveCount(7)
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      const values = await labels.evaluateAll((nodes) =>
        nodes.map((node) => {
          const style = getComputedStyle(node)
          const leaf = getComputedStyle(node.firstElementChild!)
          return {
            tag: node.tagName,
            font: style.fontSize,
            weight: style.fontWeight,
            line: style.lineHeight,
            tracking: style.letterSpacing,
            transform: style.textTransform,
            leaf: leaf.maskImage.includes('/brand/apex-leaf.svg') && parseFloat(leaf.width) > 0,
            overflow: node.scrollWidth > node.clientWidth + 1,
          }
        }),
      )
      expect(new Set(values.map(({ tag }) => tag))).toEqual(new Set(['P']))
      expect(
        new Set(
          values.map(({ font, weight, line, tracking, transform }) =>
            JSON.stringify({ font, weight, line, tracking, transform }),
          ),
        ).size,
      ).toBe(1)
      expect(values.every(({ font, leaf, overflow }) => font === '18px' && leaf && !overflow)).toBe(
        true,
      )
      const bridge = page.locator('#capabilities-cooperation')
      await expect(bridge).toHaveCSS('background-color', 'rgb(234, 241, 248)')
      expect(
        await bridge.evaluate(
          (el) =>
            el.previousElementSibling?.id === 'platforms-expertise' &&
            el.nextElementSibling?.id === 'collaboration',
        ),
      ).toBe(true)
      if (width === 1440)
        expect(await bridge.evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(260)
      const mission = page.locator('#develop-test-transfer [data-section-eyebrow]').first()
      const centered = await mission.evaluate((el) => {
        const box = el.closest('section')!.getBoundingClientRect()
        const first = el.firstElementChild!.getBoundingClientRect()
        const last = el.lastElementChild!.getBoundingClientRect()
        return (
          Math.abs(
            (Math.min(first.left, last.left) + Math.max(first.right, last.right)) / 2 -
              (box.left + box.right) / 2,
          ) < 2
        )
      })
      expect(centered).toBe(true)
      if (width === 390 || width === 1440) {
        await bridge.screenshot({ path: `.cache/eyebrow-review/${locale}-${width}-bridge.png` })
        for (const index of [0, 1, 3]) {
          await labels
            .nth(index)
            .screenshot({ path: `.cache/eyebrow-review/${locale}-${width}-${index}.png` })
        }
      }
    }
    const bridgeTitle = await page.locator('#capabilities-cooperation h2').innerText()
    const response = await request.get(
      `/api/search?${new URLSearchParams({ locale, q: bridgeTitle, type: 'section' })}`,
    )
    expect(response.status()).toBe(200)
    expect((await response.json()).items).toContainEqual(
      expect.objectContaining({ url: `/${locale}#capabilities-cooperation` }),
    )
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
    expect(
      await labels.evaluateAll((nodes) =>
        nodes.every((el) => el.scrollWidth <= el.clientWidth + 1),
      ),
    ).toBe(true)
  })
}
