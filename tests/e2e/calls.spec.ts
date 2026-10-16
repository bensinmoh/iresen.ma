import { randomUUID } from 'node:crypto'
import { test, expect } from './fixtures'
import AxeBuilder from '@axe-core/playwright'
import { Pool } from 'pg'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { mediaDirectory } from '../../src/cms/media-directory'
import { pageHref } from '../../src/lib/site'
import { callHref } from '../../src/lib/calls'
import { callTestDates, callTestCopy, textPdf } from '../fixtures/calls'

test('CMS call pages, files, dates, archives and withdrawal in all public locales', async ({
  page,
}, testInfo) => {
  test.skip(
    !process.env.CI && process.env.CALLS_E2E_FIXTURES !== 'true',
    'Requires a disposable CMS database.',
  )
  const database = new Pool({ connectionString: process.env.DATABASE_URL, allowExitOnIdle: true })
  const reference = `browser-call-${randomUUID()}`
  let callId: number | undefined
  let mediaId: number | undefined
  try {
    const filename = `${reference}.pdf`
    const bytes = textPdf('Temporary browser call conditions.')
    await mkdir(mediaDirectory(), { recursive: true })
    await writeFile(path.join(mediaDirectory(), filename), bytes)
    mediaId = (
      await database.query<{ id: number }>(
        "INSERT INTO media (filename,mime_type,filesize,url,rights,visibility,_status) VALUES ($1,'application/pdf',$2,$3,'Test-only file','public','published') RETURNING id",
        [filename, bytes.length, `/api/media/file/${filename}`],
      )
    ).rows[0]!.id
    callId = (
      await database.query<{ id: number }>(
        "INSERT INTO calls (reference,acronym,launch_year,budget_amount,budget_currency,opening_at,deadline_at,evaluation_starts_at,evaluation_ends_at,results_at,visibility,_status) VALUES ($1,'CMS-TEST',2026,2500000,'MAD',$2,$3,$4,$5,$6,'public','published') RETURNING id",
        [
          reference,
          callTestDates.openingAt,
          callTestDates.deadlineAt,
          callTestDates.evaluationStartsAt,
          callTestDates.evaluationEndsAt,
          callTestDates.resultsAt,
        ],
      )
    ).rows[0]!.id
    const addLocale = async (locale: 'fr' | 'en' | 'ar') => {
      const copy = callTestCopy(locale)
      await database.query(
        "INSERT INTO media_locales (_parent_id,_locale,title,alt,publication_status) VALUES ($1,$2,'Test call terms','Temporary browser test document','published')",
        [mediaId, locale],
      )
      await database.query(
        "INSERT INTO calls_locales (_parent_id,_locale,title,description,recipients,themes,funding_partners,conditions_document_id,submission_url,publication_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'published')",
        [
          callId,
          locale,
          copy.title,
          copy.description,
          copy.recipients,
          copy.themes,
          copy.fundingPartners,
          mediaId,
          copy.submissionUrl,
        ],
      )
    }
    await addLocale('fr')
    expect((await page.request.get(callHref(reference, 'ar'))).status()).toBe(404)
    await addLocale('en')
    await addLocale('ar')
    for (const locale of ['fr', 'en', 'ar'] as const) {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(pageHref('programmes', locale))
      await page.locator(`#participate #call-${reference} a`).click()
      await expect(page).toHaveURL((url) => decodeURI(url.pathname) === callHref(reference, locale))
      const region = page.locator('[data-call-page]')
      await expect(region.locator('h1')).toHaveText(callTestCopy(locale).title)
      await expect(region.locator('#call-calendar li')).toHaveCount(4)
      await expect(region.locator('a[href="https://example.org/call-test-form"]')).toBeVisible()
      const termsHref = await region.locator('a[download]').getAttribute('href')
      const response = await page.request.get(termsHref!)
      expect(response.status()).toBe(200)
      expect(response.headers()['content-type']).toContain('application/pdf')
      expect(response.headers()['cache-control']).toContain('no-store')
      expect(
        (await new AxeBuilder({ page }).include('[data-call-page]').analyze()).violations,
      ).toEqual([])
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
          .toBe(true)
        if (width === 390 || width === 1440)
          await page.screenshot({
            path: testInfo.outputPath(`${locale}-${width}-call.png`),
            fullPage: true,
          })
      }
      await page.setViewportSize({ width: 768, height: 900 })
      await page.addStyleTag({ content: 'html { font-size: 200% !important }' })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true)
    }
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(callHref(reference, 'fr'))
    await page.locator('.header-meta .locale-selector a[lang="ar"]').click()
    await expect(page).toHaveURL((url) => decodeURI(url.pathname) === callHref(reference, 'ar'))
    const context = await page
      .context()
      .browser()!
      .newContext({ javaScriptEnabled: false, baseURL: testInfo.project.use.baseURL })
    try {
      const native = await context.newPage()
      await native.goto(callHref(reference, 'ar'))
      await expect(native.locator('[data-call-page] h1')).toHaveText(callTestCopy('ar').title)
      await expect(native.locator('#call-calendar li')).toHaveCount(4)
      await expect(native.locator('[data-call-page] a[download]')).toBeVisible()
    } finally {
      await context.close()
    }
    await database.query(
      "UPDATE calls SET deadline_at='2020-02-01T17:00:00Z',evaluation_starts_at='2020-03-01T09:00:00Z',evaluation_ends_at='2020-03-31T17:00:00Z',results_at='2020-04-01T09:00:00Z',updated_at=now() WHERE id=$1",
      [callId],
    )
    await page.goto(callHref(reference, 'fr'))
    await expect(
      page.locator('[data-call-page] a[href="https://example.org/call-test-form"]'),
    ).toHaveCount(0)
    await expect(page.locator('[data-call-page] a[download]')).toBeVisible()
    await page.goto(pageHref('programmes', 'fr'))
    await expect(page.locator(`#calls-for-projects #call-${reference}`)).toBeVisible()
    await database.query("UPDATE media SET visibility='private',updated_at=now() WHERE id=$1", [
      mediaId,
    ])
    await page.goto(callHref(reference, 'fr'))
    await expect(page.locator('[data-call-page] a[download]')).toHaveCount(0)
    expect((await page.request.get(`/api/media/file/${filename}?locale=fr`)).status()).not.toBe(200)
    await database.query("UPDATE calls SET visibility='private',updated_at=now() WHERE id=$1", [
      callId,
    ])
    expect((await page.request.get(callHref(reference, 'fr'))).status()).toBe(404)
  } finally {
    if (callId) await database.query('DELETE FROM calls WHERE id=$1', [callId])
    if (mediaId) await database.query('DELETE FROM media WHERE id=$1', [mediaId])
    await rm(path.join(mediaDirectory(), `${reference}.pdf`), { force: true })
    await database.end()
  }
})
