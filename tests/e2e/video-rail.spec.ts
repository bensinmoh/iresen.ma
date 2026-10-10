import { test, expect } from '@playwright/test'
import { pageHref } from '../../src/lib/site'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale} video indicators follow native scrolling and center below the rail`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(pageHref('media', locale))
    const rail = page.locator('[data-video-rail]')
    const controls = page.locator('[data-video-navigation]')
    if (!(await rail.count())) {
      await expect(controls).toHaveCount(0)
      return // CI has no approved library videos; it must retain the genuine empty state.
    }
    await expect(rail.locator('article')).not.toHaveCount(0)
    await expect(controls).toBeVisible()
    const buttons = controls.getByRole('button')
    await expect(buttons).toHaveCount(await rail.locator('article').count())
    await expect(buttons.first()).toHaveAttribute('aria-current', 'true')
    await buttons.nth(1).focus()
    await page.keyboard.press('Enter')
    await expect(buttons.nth(1)).toHaveAttribute('aria-current', 'true')
    await expect(buttons.nth(1)).toBeFocused()
    await rail.evaluate((element, rtl) => {
      element.scrollTo({
        left: (element.scrollWidth - element.clientWidth) * (rtl ? -1 : 1),
        behavior: 'instant',
      })
    }, locale === 'ar')
    await expect(buttons.last()).toHaveAttribute('aria-current', 'true')
    for (const button of await buttons.all()) {
      expect(await button.evaluate((el) => getComputedStyle(el, '::after').borderWidth)).toBe('0px')
      expect(await button.evaluate((el) => getComputedStyle(el, '::after').boxShadow)).toBe('none')
    }
    expect(await rail.evaluate((el) => getComputedStyle(el).scrollbarWidth)).toBe('none')
    const upper = (await rail.boundingBox())!
    const navigation = (await controls.boundingBox())!
    const lower = (await page.locator('#videos > a').boundingBox())!
    expect(
      Math.abs(navigation.y + navigation.height / 2 - (upper.y + upper.height + lower.y) / 2),
    ).toBeLessThan(2)
    expect(
      Math.abs(navigation.x + navigation.width / 2 - (upper.x + upper.width / 2)),
    ).toBeLessThan(2)
    expect(await controls.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0)
    await page.screenshot({
      path: `.cache/video-rail-screenshots/${locale}-mobile.png`,
      fullPage: false,
    })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await expect(controls).toBeVisible()
    await expect(buttons).toHaveCount(await rail.locator('article').count())
    for (let index = 0; index < (await buttons.count()); index++) {
      await buttons.nth(index).click()
      await expect(buttons.nth(index)).toHaveAttribute('aria-current', 'true')
      const card = rail.locator('article').nth(index)
      expect(
        await card.evaluate((el) => {
          const card = el.getBoundingClientRect(),
            viewport = el.parentElement!.getBoundingClientRect()
          return card.left >= viewport.left - 2 && card.right <= viewport.right + 2
        }),
      ).toBe(true)
    }
    await page.locator('#videos').scrollIntoViewIfNeeded()
    await page.screenshot({
      path: `.cache/video-rail-screenshots/${locale}-desktop.png`,
      fullPage: false,
    })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await page.setViewportSize({ width: 320, height: 900 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    // A rail that fits has no redundant navigation, including after resizing.
    await rail.evaluate((el) => {
      el.style.gap = '0px'
    })
    await rail.locator('article').evaluateAll((cards) => {
      for (const card of cards) (card as HTMLElement).style.flex = '0 0 1px'
    })
    await expect(controls).toHaveCount(0)
  })
}

test('video rail preserves native overflow without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  const page = await context.newPage()
  await page.goto(pageHref('media', 'fr'))
  await expect(page.locator('[data-video-navigation]')).toHaveCount(0)
  const rail = page.locator('[data-video-rail]')
  if (await rail.count()) {
    expect(await rail.evaluate((el) => getComputedStyle(el).scrollbarWidth)).not.toBe('none')
    await expect(rail.locator('article noscript a').first()).toBeVisible()
  }
  await context.close()
})

test('video pill selection settles after smooth scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(pageHref('media', 'fr'))
  const pills = page.locator('[data-video-navigation] button')
  if ((await pills.count()) < 3) return
  await pills.nth(2).click()
  await expect(pills.nth(2)).toHaveAttribute('aria-current', 'true')
  await expect
    .poll(() =>
      page.locator('[data-video-rail]').evaluate((el) => {
        const card = el.querySelectorAll('article')[2].getBoundingClientRect()
        const viewport = el.getBoundingClientRect()
        return Math.abs(card.left - viewport.left)
      }),
    )
    .toBeLessThan(2)
  await expect(pills.nth(2)).toHaveAttribute('aria-current', 'true')
})
