import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pageHref } from '../../src/lib/site'
import { demoProjects } from '../../src/lib/projects'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: project catalogue filters and pagination`, async ({ page }) => {
    await page.goto(pageHref('projects', locale))
    await expect(page.locator('[data-projects-page] article')).toHaveCount(6)
    await expect(page.locator('[data-projects-page]')).not.toContainText(/ficti|fiction|خيالي/iu)
    await page.locator('#project-catalogue nav a[aria-current="page"] + a').click()
    await expect(page.locator('#project-demo-007')).toBeVisible()
    await page.locator('select[name="domain"]').selectOption('hydrogen')
    await expect(page.locator('[data-projects-page] article')).toHaveCount(3)
    await expect(page.locator('#project-catalogue nav a[aria-current="page"]')).toHaveCount(0)
    await page.goto(pageHref('projects', locale))
    await page.locator('#find-project input[name="q"]').fill('CELL-PV')
    await page.locator('#find-project button[type="submit"]').click()
    await expect(page.locator('[data-projects-page] article')).toHaveCount(1)
    await expect(page.locator('#project-demo-005')).toContainText(demoProjects[4].title[locale])
    await page.locator('#find-project input[name="q"]').fill('no-such-project-xyz')
    await page.locator('#find-project button[type="submit"]').click()
    await expect(page.locator('[data-projects-page] article')).toHaveCount(0)
    await page.locator('#find-project .container > div a').click()
    await expect(page.locator('[data-projects-page] article')).toHaveCount(6)
    const axe = await new AxeBuilder({ page }).include('[data-projects-page]').analyze()
    expect(axe.violations).toEqual([])
  })
}

test('project form and pagination work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('projects', 'fr'))
  await page.locator('select[name="status"]').selectOption('completed')
  await page.locator('#find-project button[type="submit"]').click()
  await expect(page.locator('[data-projects-page] article')).toHaveCount(6)
  await expect(page.locator('select[name="status"]')).toHaveValue('completed')
  await page.locator('nav a[aria-current="page"] + a').click()
  await expect(page.locator('[data-projects-page] article')).toHaveCount(2)
  await context.close()
})

test('project layout contains FR/EN/AR at representative widths and enlarged text', async ({
  page,
}) => {
  for (const locale of ['fr', 'en', 'ar'] as const) {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(pageHref('projects', locale))
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      for (const image of await page.locator('[data-projects-page] img').all()) {
        await image.scrollIntoViewIfNeeded()
        await expect(image).toHaveJSProperty('complete', true)
        expect(await image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0)
      }
      if ([390, 1440].includes(width)) {
        await page.evaluate(() => (document.activeElement as HTMLElement)?.blur())
        await page.screenshot({
          path: `.local/projects-review/${locale}-${width}.png`,
          fullPage: true,
          animations: 'disabled',
        })
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 900 })
  await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

for (const locale of ['fr', 'ar'] as const) {
  test(`${locale}: filters preserve scroll, focus and history; cards open a right drawer`, async ({
    page,
  }) => {
    await page.goto(pageHref('projects', locale))
    const domain = page.locator('select[name="domain"]')
    await domain.scrollIntoViewIfNeeded()
    await domain.focus()
    const before = await page.evaluate(() => ({
      y: scrollY,
      height: document.querySelector('#project-catalogue')!.getBoundingClientRect().height,
    }))
    await domain.selectOption('hydrogen')
    await expect(page.locator('[data-projects-page] article')).toHaveCount(3)
    await expect(domain).toBeFocused()
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(before.y, 0)
    await expect
      .poll(() =>
        page.evaluate(() => document.querySelector('#project-catalogue')!.getAnimations().length),
      )
      .toBe(0)
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(before.y, 0)
    await expect(page).toHaveURL(/domain=hydrogen/)
    await page.goBack()
    await expect(page.locator('[data-projects-page] article')).toHaveCount(6)
    await expect(domain).toHaveValue('')
    const card = page.locator('[data-projects-page] article').first()
    const link = card.locator('h2 a')
    await card.hover()
    await expect(card).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -4)')
    await expect(card.locator('img')).toHaveCSS('transform', 'matrix(1.06, 0, 0, 1.06, 0, 0)')
    if (locale === 'fr') await page.screenshot({ path: '.local/projects-motion/hover-fr.png' })
    await link.click()
    const drawer = page.getByRole('dialog')
    await expect(drawer).toBeVisible()
    await expect(drawer).toContainText(demoProjects[0].description[locale])
    await expect(drawer).toContainText(demoProjects[0].details.presentation[locale][1])
    await expect(drawer.locator('ul').first().locator('li')).toHaveCount(3)
    await expect(drawer.locator('ul').last().locator('li')).toHaveCount(3)
    const contact = drawer.locator('.button[href^="mailto:"]')
    await expect(contact).toHaveAttribute('href', /mailto:contact@iresen\.ma\?subject=/)
    const note = drawer.locator('a[download]')
    await note.scrollIntoViewIfNeeded()
    const downloadPromise = page.waitForEvent('download')
    await note.click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe(`SOL-THERM-${locale}.pdf`)
    await expect(drawer).toBeVisible()
    await page.screenshot({ path: `.local/projects-motion/detail-${locale}-bottom.png` })
    await expect(drawer).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)')
    const rect = await drawer.boundingBox()
    expect(rect!.x + rect!.width).toBeCloseTo(page.viewportSize()!.width, 0)
    await drawer.evaluate((el) => {
      el.scrollTop = 0
    })
    await drawer.locator('button').focus()
    await expect(drawer.locator('button')).toBeFocused()
    await page.screenshot({ path: `.local/projects-motion/drawer-${locale}-desktop.png` })
    await drawer.locator('dl').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `.local/projects-motion/detail-${locale}-metadata.png` })
    expect((await new AxeBuilder({ page }).include('dialog').analyze()).violations).toEqual([])
    await page.keyboard.press('Escape')
    await expect(drawer).not.toBeVisible()
    await expect(link).toBeFocused()
    await link.click()
    await page.mouse.click(10, 100)
    await expect(drawer).not.toBeVisible()
  })
}

for (const locale of ['fr', 'ar'] as const) {
  test(`${locale}: project drawer and controls support reduced motion, mobile and direct links`, async ({
    page,
    browser,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${pageHref('projects', locale)}?domain=thermal`)
    await page.locator('#find-project .container > div a').click()
    await expect(page.locator('select[name="domain"]')).toHaveValue('')
    const corners = await page.locator('select[name="domain"]').evaluate((el) => {
      const s = getComputedStyle(el)
      return [
        s.borderTopLeftRadius,
        s.borderTopRightRadius,
        s.borderBottomRightRadius,
        s.borderBottomLeftRadius,
      ]
    })
    expect(corners).toEqual(['10px', '0px', '10px', '0px'])
    await page.locator('[data-projects-page] article h2 a').first().click()
    const drawer = page.getByRole('dialog')
    await expect(drawer).toBeVisible()
    await expect(drawer).toHaveCSS('animation-name', 'none')
    expect((await drawer.boundingBox())!.width).toBe(390)
    await page.screenshot({ path: `.local/projects-motion/drawer-${locale}-mobile.png` })
    await drawer.locator('a[download]').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `.local/projects-motion/detail-${locale}-mobile-bottom.png` })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.keyboard.press('Escape')
    await expect(drawer).not.toBeVisible()
    const context = await browser.newContext({ javaScriptEnabled: false })
    const fallback = await context.newPage()
    await fallback.goto(pageHref('projects', locale))
    await fallback.locator('[data-projects-page] article h2 a').first().click()
    await expect(fallback.locator('#project-details')).toContainText(
      demoProjects[0].description[locale],
    )
    await context.close()
  })
}
