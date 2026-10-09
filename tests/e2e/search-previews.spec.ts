import { randomUUID } from 'node:crypto'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { Pool } from 'pg'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { mediaDirectory } from '../../src/cms/media-directory'
import { pageHref } from '../../src/lib/site'
import { newsHref } from '../../src/lib/content/routes'

test('public image, document and news previews retain native access and responsive layout', async ({
  page,
  request,
}, testInfo) => {
  test.setTimeout(120_000)
  const database = new Pool({ connectionString: process.env.DATABASE_URL })
  const marker = `preview${randomUUID().replaceAll('-', '')}`
  const filename = `${marker}.pdf`
  const file = path.join(mediaDirectory(), filename)
  let mediaId: number | undefined
  let newsId: number | undefined
  try {
    await mkdir(path.dirname(file), { recursive: true })
    const stream = 'BT /F1 12 Tf 72 720 Td (Synthetic preview test document) Tj ET\n'
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
      `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ]
    let pdf = '%PDF-1.4\n'
    const offsets = [0]
    for (const [index, object] of objects.entries()) {
      offsets.push(Buffer.byteLength(pdf))
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
    }
    const xref = Buffer.byteLength(pdf)
    pdf += `xref\n0 6\n0000000000 65535 f \n${offsets
      .slice(1)
      .map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`)
      .join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
    await writeFile(file, pdf)
    const media = await database.query<{ id: number }>(
      "INSERT INTO media (visibility,_status,filename,mime_type) VALUES ('public','published',$1,'application/pdf') RETURNING id",
      [filename],
    )
    mediaId = media.rows[0]!.id
    const news = await database.query<{ id: number }>(
      "INSERT INTO news (visibility,_status,published_at) VALUES ('public','published',now()) RETURNING id",
    )
    newsId = news.rows[0]!.id
    for (const locale of ['fr', 'en', 'ar'] as const) {
      await database.query(
        "INSERT INTO media_locales (_parent_id,_locale,title,alt,publication_status) VALUES ($1,$2,$3,$3,'published')",
        [mediaId, locale, marker],
      )
      await database.query(
        "INSERT INTO news_locales (_parent_id,_locale,title,slug,summary,publication_status) VALUES ($1,$2,$3,$3,$3,'published')",
        [newsId, locale, marker],
      )
    }
    await database.query(
      `INSERT INTO search_documents (id,origin,source_id,locale,source_revision,title,body,url,type,title_norm,body_norm)
      SELECT origin || ':' || source_id || ':' || locale,origin,source_id,locale,source_revision,title,$1,
      CASE WHEN origin='media' THEN '/api/media/file/' || filename || '?locale=' || locale ELSE $4::jsonb ->> locale END,
      CASE WHEN origin='media' THEN 'document' ELSE 'news' END,$1,$1
      FROM search_public_sources WHERE (origin='media' AND source_id=$2) OR (origin='news' AND source_id=$3)
      ON CONFLICT (id) DO NOTHING`,
      [
        marker,
        String(mediaId),
        String(newsId),
        JSON.stringify(
          Object.fromEntries(
            ['fr', 'en', 'ar'].map((locale) => [
              locale,
              newsHref(marker, locale as 'fr' | 'en' | 'ar'),
            ]),
          ),
        ),
      ],
    )
    for (const locale of ['fr', 'en', 'ar'] as const) {
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`${pageHref('search', locale)}?q=${marker}`)
        const resultRow = page
          .locator('.search-results article')
          .filter({ has: page.locator('.search-document-preview') })
        await expect(resultRow).toHaveCount(1)
        await expect(resultRow.locator('iframe')).toHaveCount(0)
        await resultRow.locator('summary').focus()
        await page.keyboard.press('Enter')
        await expect(resultRow.locator('iframe')).toHaveAttribute(
          'src',
          `/api/media/file/${filename}?locale=${locale}`,
        )
        await expect(resultRow.locator('iframe')).toHaveAccessibleName(new RegExp(marker))
        if (locale === 'en' && width === 1440) {
          await page.waitForLoadState('networkidle')
          await resultRow.screenshot({ path: testInfo.outputPath('expanded-document.png') })
        }
        await page.keyboard.press('Enter')
        await expect(resultRow.locator('iframe')).toHaveCount(0)
        await expect(page.locator('.search-file-preview')).toHaveCount(2)
        const axe = await new AxeBuilder({ page }).include('.search-results').analyze()
        expect(axe.violations).toEqual([])
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%'
        })
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        )
      }
      await page.goto(`${pageHref('search', locale)}?q=IRESEN&type=media`)
      const image = page.locator('.search-image-preview img').first()
      await expect(image).toBeVisible()
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
        .toBe(true)
    }
    await database.query("UPDATE media SET visibility='private' WHERE id=$1", [mediaId])
    const withdrawn = await request.get(`/api/media/file/${filename}?locale=en`)
    expect(withdrawn.status()).toBe(403)
    await page.goto(`${pageHref('search', 'en')}?q=${marker}`)
    await expect(page.locator('.search-document-preview')).toHaveCount(0)
    await page.goto(`${pageHref('search', 'en')}?q=video&type=media`)
    await expect(page.locator('.search-result-preview video')).toHaveAttribute('preload', 'none')
    await expect(page.locator('.search-result-preview video')).toHaveAttribute('controls', '')
    await expect(page.locator('.search-result-preview video')).not.toHaveAttribute('autoplay', '')
  } finally {
    if (newsId) await database.query('DELETE FROM news WHERE id=$1', [newsId])
    if (mediaId) await database.query('DELETE FROM media WHERE id=$1', [mediaId])
    await database.query('DELETE FROM search_documents WHERE title=$1', [marker])
    await rm(file, { force: true })
    await database.end()
  }
})
