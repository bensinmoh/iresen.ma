import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pageHref } from '../../src/lib/site'
import { patents } from '../../src/lib/patents'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

for (const locale of ['fr', 'en', 'ar'] as const) {
  const copy = { fr, en, ar }[locale].Transfer
  test(`${locale}: patent filters, register links, direct anchors and contact context`, async ({
    page,
  }) => {
    await page.goto(pageHref('transfer', locale))
    await expect(page.locator('.breadcrumb')).toHaveCount(0)
    const section = page.locator('#adoption-initiatives')
    const product = page.locator('#ismart-example img[src*="ismart-product"]')
    await product.scrollIntoViewIfNeeded()
    await expect(product).toHaveJSProperty('complete', true)
    expect(await product.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(
      0,
    )
    await expect(page.locator('#ismart-example')).toContainText(copy.example.origin)
    await expect(
      page.locator('#ismart-example').getByRole('link', { name: copy.example.visit }),
    ).toHaveAttribute('href', 'https://www.i-smart.ma/')
    await expect(section.locator('article:visible')).toHaveCount(6)
    await section.getByRole('button', { name: copy.catalog.showMore, exact: true }).click()
    await expect(section.locator('article:visible')).toHaveCount(12)
    await section.getByRole('button', { name: copy.catalog.showAll, exact: true }).click()
    await expect(section.locator('article:visible')).toHaveCount(59)
    await section.getByLabel(copy.catalog.year, { exact: true }).selectOption('unknown')
    await expect(section.locator('article:visible')).toHaveCount(6)
    await section.getByRole('button', { name: copy.catalog.showAll, exact: true }).click()
    await expect(section.locator('article:visible')).toHaveCount(9)
    await section.getByLabel(copy.catalog.year, { exact: true }).selectOption('2014')
    await section.getByRole('searchbox').fill('37172')
    await expect(section.locator('article:visible')).toHaveCount(1)
    await expect(section.locator('#patent-37172').getByText('2014', { exact: true })).toBeVisible()
    await section.getByRole('button', { name: copy.catalog.reset, exact: true }).click()
    await section.getByRole('searchbox').fill('41528')
    await expect(section.locator('#patent-41528 h3')).toHaveText(
      patents.find((patent) => patent.reference === '41528')!.title,
    )
    await section.getByRole('searchbox').fill('53044')
    await expect(section.locator('article:visible')).toHaveCount(1)
    await section.getByLabel(copy.catalog.theme, { exact: true }).selectOption('mobility')
    await section.getByLabel(copy.catalog.year, { exact: true }).selectOption('2021')
    await section.getByLabel(copy.catalog.depositor, { exact: true }).selectOption('IRESEN')
    await expect(section.locator('#patent-53044')).toBeVisible()
    await expect(
      section.locator('#patent-53044').getByRole('link', { name: copy.catalog.view }),
    ).toHaveAttribute('href', patents.find((p) => p.reference === '53044')!.registerUrl)
    await section.getByRole('searchbox').fill('no-such-patent')
    await expect(section.getByText(copy.catalog.empty, { exact: true })).toBeVisible()
    await section.getByRole('button', { name: copy.catalog.reset, exact: true }).click()
    await expect(section.locator('article:visible')).toHaveCount(6)
    await page.goto(pageHref('transfer', locale, 'patent-74893'))
    await expect(page.locator('#patent-74893')).toBeVisible()
    await page.locator('#patent-74893').getByRole('link', { name: copy.catalog.discuss }).click()
    await expect(page.locator('select[name="subject"]')).toHaveValue('partnerships')
    await expect(page.locator('textarea[name="message"]')).toHaveValue(/74893/)
    await page.goto(pageHref('transfer', locale))
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      const hero = await page.locator('.page-hero').boundingBox()
      const intro = await page.locator('#results-to-transfer').boundingBox()
      expect(Math.abs(intro!.y - hero!.y - hero!.height)).toBeLessThan(1)
      if (width >= 1024) {
        const photo = await page.locator('#results-to-transfer img').boundingBox()
        const heading = await page.locator('#results-to-transfer-heading').boundingBox()
        if (locale === 'ar') expect(photo!.x).toBeGreaterThan(heading!.x)
        else expect(photo!.x + photo!.width).toBeLessThan(heading!.x)
      }
      const lastSection = await page.locator('#build-transfer').boundingBox()
      const footer = await page.locator('.site-footer').boundingBox()
      expect(Math.abs(footer!.y - lastSection!.y - lastSection!.height)).toBeLessThan(1)
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = ''
    })
    expect(
      (await new AxeBuilder({ page }).include('[data-engagement-page="transfer"]').analyze())
        .violations,
    ).toEqual([])
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      for (const id of [
        'results-to-transfer',
        'intellectual-property',
        'transfer-pathways',
        'build-transfer',
      ]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded()
        await page.screenshot({ path: `.cache/patents-review/${locale}-${width}-${id}.png` })
      }
      const doorPhotos = page.locator('#build-transfer article img')
      await expect(doorPhotos).toHaveCount(2)
      for (const photo of await doorPhotos.all()) {
        await expect(photo).toHaveJSProperty('complete', true)
        expect(
          await photo.evaluate((image: HTMLImageElement) => image.naturalWidth),
        ).toBeGreaterThan(0)
        const bounds = await photo.boundingBox()
        const article = await photo.locator('xpath=../..').boundingBox()
        expect(bounds!.width).toBeLessThan(bounds!.height)
        expect(bounds!.height).toBeGreaterThan(article!.height - 30)
      }
      await page.locator('#research-to-use').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `.cache/patents-review/${locale}-${width}-process.png` })
      await page.locator('#adoption-initiatives-heading').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `.cache/patents-review/${locale}-${width}-catalog.png` })
      await page.locator('#patent-37172').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `.cache/patents-review/${locale}-${width}-cards.png` })
    }
  })
  test(`${locale}: site search discovers a patent at its canonical anchor`, async ({ page }) => {
    await page.goto(`${pageHref('search', locale)}?q=53044`)
    const link = page.locator(`a[href$="#patent-53044"]`).first()
    await expect(link).toBeVisible()
    await link.click()
    await expect(page.locator('#patent-53044')).toBeVisible()
  })
}

test('all patents remain readable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  try {
    const page = await context.newPage()
    await page.goto(pageHref('transfer', 'ar', 'patent-74893'))
    await expect(page.locator('#adoption-initiatives article:visible')).toHaveCount(59)
    await expect(page.locator('#patent-74893')).toBeVisible()
    await expect(page.locator('#patent-74893 a').first()).toHaveAttribute('href', /numDepot=74893/)
  } finally {
    await context.close()
  }
})

test('compact desktop filters and classic card motion respect reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(pageHref('transfer', 'fr', 'adoption-initiatives'))
  const section = page.locator('#adoption-initiatives')
  const controls = section.locator('input[type="search"], select')
  await expect(controls).toHaveCount(4)
  const boxes = await controls.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return { y: rect.y, height: rect.height }
    }),
  )
  expect(
    Math.max(...boxes.map((box) => box.y)) - Math.min(...boxes.map((box) => box.y)),
  ).toBeLessThan(1)
  expect(boxes.every((box) => box.height >= 44)).toBe(true)
  const initialCards = section.locator('article:visible')
  await expect(initialCards).toHaveCount(6)
  const rows = await initialCards.evaluateAll((cards) =>
    cards.map((card) => Math.round(card.getBoundingClientRect().top)),
  )
  expect(new Set(rows).size).toBe(2)
  await page.waitForTimeout(300)
  await page.evaluate(() => {
    const original = Element.prototype.animate
    const recorded: Animation[] = []
    Element.prototype.animate = function (...args: Parameters<typeof original>) {
      const animation = original.apply(this, args)
      recorded.push(animation)
      return animation
    }
    ;(window as unknown as { patentAnimations: Animation[] }).patentAnimations = recorded
  })
  await section.getByLabel(fr.Transfer.catalog.theme, { exact: true }).selectOption('solar')
  const frames = await page.evaluate(() =>
    (window as unknown as { patentAnimations: Animation[] }).patentAnimations.flatMap((animation) =>
      (animation.effect as KeyframeEffect).getKeyframes(),
    ),
  )
  expect(frames.some((frame) => frame.transform && frame.transform !== 'translate(0, 0)')).toBe(
    true,
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect
    .poll(() =>
      section
        .locator('article:visible')
        .evaluateAll((cards) => cards.flatMap((card) => card.getAnimations()).length),
    )
    .toBe(0)
  await section.getByLabel(fr.Transfer.catalog.theme, { exact: true }).selectOption('')
  await expect(section.locator('article:visible')).toHaveCount(6)
  expect(
    await section
      .locator('article:visible')
      .evaluateAll((cards) => cards.flatMap((card) => card.getAnimations()).length),
  ).toBe(0)
})
