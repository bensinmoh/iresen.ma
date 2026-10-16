import { expect, test } from './fixtures'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }

for (const locale of ['fr', 'en', 'ar'] as const) {
  const copy = { fr, en, ar }[locale].Projects
  test(`${locale}: project catalogue retains anchors and excludes withdrawn notes`, async ({
    page,
    request,
  }) => {
    await page.goto(
      `${pageHref('projects', locale)}?project=demo-001&q=not-a-real-project-reference`,
    )
    await expect(page.locator('#find-project form')).toBeVisible()
    await expect(page.getByRole('heading', { name: copy.empty, exact: true })).toBeVisible()
    await expect(page.locator('#project-drawer')).not.toBeVisible()
    for (const id of [
      'featured-results',
      'find-project',
      'project-catalogue',
      'understanding-results',
      'related-capabilities',
    ])
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    expect((await request.get(`/api/projects/demo-001/note?locale=${locale}`)).status()).toBe(404)
    expect(
      (await request.get(`/api/projects/demo-001/asset/image?locale=${locale}`)).status(),
    ).toBe(404)
    await page.setViewportSize({ width: 390, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    )
  })

  test(`${locale}: sourced projects filters, pagination, responsive detail and focus`, async ({
    page,
  }, testInfo) => {
    test.skip(
      process.env.PROJECTS_SOURCE_REVIEW !== 'true',
      'Requires the owner-selected local source import.',
    )
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(pageHref('projects', locale))
    await expect(page.locator('#featured-results article')).toHaveCount(6)
    await expect(page.locator('#find-project [role="status"]')).toContainText('60')
    await expect(page.locator('select[name="status"]')).toHaveCount(0)
    // Coordinator discovery is independent of card text, including Latin aliases in AR.
    await page.locator('#project-query').fill('rachidi')
    await page.locator('#find-project button[type="submit"]').click()
    await expect(page.locator('#featured-results article')).toHaveCount(1)
    await expect(page.locator('#featured-results article')).toHaveAttribute('id', 'project-melhy')
    if (locale === 'ar') {
      await page.locator('#project-query').fill('رشيدي')
      await page.locator('#find-project button[type="submit"]').click()
      await expect(page.locator('#featured-results article')).toHaveAttribute('id', 'project-melhy')
    }
    await page.getByRole('link', { name: copy.reset, exact: true }).click()
    const previews = page.locator('[data-project-summary]')
    await expect(previews).toHaveCount(6)
    expect(
      await previews.evaluateAll((nodes) =>
        nodes.every((el) => (el.textContent?.length ?? 0) <= 150),
      ),
    ).toBe(true)
    await page
      .locator('#project-catalogue nav')
      .getByRole('link', { name: copy.page.replace('{number}', '2'), exact: true })
      .click()
    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator('#project-catalogue nav [aria-current="page"]')).toHaveText('2')
    await page.getByRole('link', { name: copy.reset, exact: true }).click()
    await page.locator('select[name="domain"]').selectOption('storage')
    await expect(page.locator('#find-project [role="status"]')).not.toContainText('60')
    await page.locator('#project-query').fill('VANABAT')
    await page.locator('#find-project button[type="submit"]').click()
    await expect(page.locator('#featured-results article')).toHaveCount(1)
    const trigger = page.getByRole('link', {
      name: copy.details.replace('{name}', 'VANABAT'),
      exact: true,
    })
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('h2')).toHaveText('VANABAT')
    await expect(dialog.locator('a[href^="mailto:"]')).toHaveCount(2)
    await expect(dialog.locator('a[href^="tel:"]')).toHaveCount(0)
    await expect(dialog.locator('a[download]')).toHaveCount(0)
    const brief = dialog.locator('a[href*="/api/projects/vanabat/note"]')
    await expect(brief).toHaveText(copy.sourceLink)
    const response = await page.request.get((await brief.getAttribute('href'))!)
    expect(response.headers()['content-type']).toContain('application/pdf')
    expect(response.headers()['cache-control']).toContain('no-store')
    expect(response.status()).toBe(200)
    expect(
      await dialog
        .locator('li')
        .evaluateAll((nodes) =>
          nodes.every(
            (el) =>
              getComputedStyle(el).marginTop === '0px' &&
              getComputedStyle(el).marginBottom === '0px',
          ),
        ),
    ).toBe(true)
    await expect(dialog.locator('dt').filter({ hasText: copy.budget })).toHaveCount(0)
    await expect(dialog.locator('dt').filter({ hasText: copy.duration })).toHaveCount(0)
    expect(
      (await new AxeBuilder({ page }).include('#project-drawer').analyze()).violations,
    ).toEqual([])
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true)
      expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true)
      if (width === 390 || width === 1440)
        await page.screenshot({ path: testInfo.outputPath(`${locale}-${width}-detail.png`) })
    }
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await page.getByRole('link', { name: copy.reset, exact: true }).click()
    await page.setViewportSize({ width: 390, height: 900 })
    await page.locator('#find-project').scrollIntoViewIfNeeded()
    await page.screenshot({ path: testInfo.outputPath(`${locale}-390-catalogue.png`) })
    expect(
      (await new AxeBuilder({ page }).include('[data-projects-page]').analyze()).violations,
    ).toEqual([])
    const images = page.locator('#featured-results img')
    await expect(images).toHaveCount(6)
    await expect
      .poll(() =>
        images.evaluateAll((nodes) =>
          nodes.every(
            (node) =>
              (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0,
          ),
        ),
      )
      .toBe(true)
  })
}

test('project detail has a native no-JavaScript reading path', async ({ browser, baseURL }) => {
  test.skip(process.env.PROJECTS_SOURCE_REVIEW !== 'true', 'Requires local source data.')
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(baseURL + pageHref('projects', 'fr') + '?project=vanabat')
  await expect(page.locator('#project-details')).toBeVisible()
  await expect(page.locator('#project-details')).toContainText('VANABAT')
  await context.close()
})
