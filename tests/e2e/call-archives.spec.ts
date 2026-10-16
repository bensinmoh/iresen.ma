import { expect, test } from '@playwright/test'
import archiveData from '../../src/data/call-archives.json' with { type: 'json' }
const archiveCalls = archiveData.records
import { callHref, callsListingHref } from '../../src/lib/calls'
import { pageHref } from '../../src/lib/site'
import { callCopy } from '../../src/lib/call-copy'

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale} catalogue, filters, details and responsive reading`, async ({
    page,
    request,
  }, testInfo) => {
    test.setTimeout(90000)
    const t = callCopy[locale]
    await page.setViewportSize({ width: 1440, height: 1000 })
    expect((await page.goto(callsListingHref(locale)))?.status()).toBe(200)
    await expect(page.locator('[data-call-origin="archive"]')).toHaveCount(21)
    await page.getByRole('searchbox', { name: t.search, exact: true }).fill('IBTIKAR')
    await expect(page.locator('[data-call-card]')).toHaveCount(2)
    await page.getByRole('combobox', { name: t.year, exact: true }).selectOption('2025')
    await expect(page.locator('[data-call-card]')).toHaveCount(1)
    await page.getByRole('combobox', { name: t.status, exact: true }).selectOption('open')
    await expect(page.getByText(t.empty, { exact: true })).toBeVisible()
    await page.getByRole('button', { name: t.reset }).click()
    await expect(page.locator('[data-call-origin="archive"]')).toHaveCount(21)
    await page.screenshot({ path: testInfo.outputPath(`${locale}-list-desktop.png`) })
    for (const width of [320, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 })
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      ).toBe(true)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.screenshot({ path: testInfo.outputPath(`${locale}-list-mobile.png`) })
    await page.getByRole('searchbox', { name: t.search, exact: true }).fill('IBTIKAR')
    await page
      .getByRole('link', { name: `${t.view} — IBTIKAR AL OMRANE 2025`, exact: true })
      .click()
    await expect(page.locator('[data-archive-call] h1')).toContainText('IBTIKAR AL OMRANE 2025')
    await expect(page.getByText(t.draft, { exact: true })).toBeVisible()
    await expect(page.locator('a[href*="submission"], a[download]')).toHaveCount(0)
    await page.screenshot({
      path: testInfo.outputPath(`${locale}-detail-mobile.png`),
      fullPage: true,
    })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.screenshot({ path: testInfo.outputPath(`${locale}-detail-desktop.png`) })
    await page.getByRole('link', { name: t.back, exact: true }).click()
    await expect(page.locator('[data-call-origin="archive"]')).toHaveCount(21)
    for (const call of archiveCalls)
      expect((await request.get(callHref(call.reference, locale))).status()).toBe(200)
    expect((await request.get(callHref('not-a-real-call', locale))).status()).toBe(404)
    await page.goto(pageHref('programmes', locale, 'calls-for-projects'))
    await expect(page.locator('#calls-for-projects [data-call-card]')).toHaveCount(4)
    await page
      .locator('#calls-for-projects')
      .screenshot({ path: testInfo.outputPath(`${locale}-section.png`) })
    await page.getByRole('link', { name: t.all, exact: true }).click()
    await expect(page.locator('[data-calls-listing]')).toBeVisible()
  })
}

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: call opens programme-filtered projects, including empty programmes`, async ({
    page,
  }, testInfo) => {
    for (const [reference, programme] of [
      ['innotherm-2013', 'InnoTherm III'],
      ['ibtikar-al-omrane-2025', 'IBTIKAR AL OMRANE 2025'],
    ]) {
      await page.goto(callHref(reference!, locale))
      const action = page.getByRole('link', { name: callCopy[locale].viewProjects, exact: true })
      await expect(action).toBeVisible()
      expect(
        await action.evaluate((el) =>
          Boolean(el.closest('aside')?.querySelector('#call-sources-title')),
        ),
      ).toBe(true)
      if (reference === 'innotherm-2013') {
        await page.setViewportSize({ width: 390, height: 844 })
        await action.scrollIntoViewIfNeeded()
        await page.screenshot({ path: testInfo.outputPath(`${locale}-projects-action.png`) })
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        ).toBe(true)
      }
      await action.click()
      await expect(page.locator('select[name="programme"]')).toHaveValue(programme!)
      expect(new URL(page.url()).searchParams.get('programme')).toBe(programme)
      if (reference === 'ibtikar-al-omrane-2025')
        await expect(page.locator('#featured-results article')).toHaveCount(0)
      await page.reload()
      await expect(page.locator('select[name="programme"]')).toHaveValue(programme!)
    }
  })
}
