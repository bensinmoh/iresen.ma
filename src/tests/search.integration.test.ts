import { randomUUID } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { Pool } from 'pg'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { SEARCH_PAGE_SIZE, searchAdapter } from '@/lib/search/adapter'
import { initializeSearchCatalog, processSearchJobs, stopSearchWorker } from '@/lib/search/indexer'
import type { SearchInput, SearchLocale, SearchResult } from '@/lib/search/types'
import { pageHref, pageIds, type PageId } from '@/lib/site'

// Opt in only against a disposable migrated database. Raw fixtures never create,
// inspect, alter or authenticate CMS users, so the CMS suite can bootstrap independently.
const integration = process.env.CMS_INTEGRATION === '1' ? describe : describe.skip
type AvailableResult = Extract<SearchResult, { status: 'available' }>
type Origin = 'pages' | 'news' | 'media'
type PublicationOptions = {
  locale?: SearchLocale
  visibility?: 'public' | 'private'
  status?: 'published' | 'draft'
  publication?: 'published' | 'review' | 'draft'
  title?: string
  summary?: string
  body?: unknown
  date?: string
}

function term(): string {
  return `qz${randomUUID().replaceAll('-', '')}`
}

function richBody(text: string, heading?: string) {
  const textNode = (value: string) => ({ type: 'text', text: value, version: 1 })
  return {
    root: {
      type: 'root',
      version: 1,
      children: [
        ...(heading ? [{ type: 'heading', tag: 'h2', children: [textNode(heading)] }] : []),
        { type: 'paragraph', children: [textNode(text)] },
      ],
    },
  }
}

/** A real tiny PDF with a text layer; no binary fixture or private reference is committed. */
function textPdf(text: string): Buffer {
  const content = `BT /F1 12 Tf 72 720 Td (${text}) Tj ET\n`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}endstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  }
  const xref = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets.slice(1)) pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(pdf)
}

integration('public website search (PostgreSQL)', () => {
  let database: Pool | undefined
  let schemaReady = false
  let originalWorkerSetting: string | undefined
  const ids: Record<Origin, number[]> = { pages: [], news: [], media: [] }
  const versionIds: number[] = []
  const files: string[] = []

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) throw new Error('Search integration tests require DATABASE_URL.')
    originalWorkerSetting = process.env.SEARCH_WORKER_DISABLED
    process.env.SEARCH_WORKER_DISABLED = 'true'
    stopSearchWorker()
    database = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 2,
      allowExitOnIdle: true,
    })
    await database.query('SELECT 1 FROM search_public_sources LIMIT 0')
    schemaReady = true
    await initializeSearchCatalog()
  })

  afterAll(async () => {
    stopSearchWorker()
    if (originalWorkerSetting === undefined) delete process.env.SEARCH_WORKER_DISABLED
    else process.env.SEARCH_WORKER_DISABLED = originalWorkerSetting
    try {
      if (database && schemaReady) {
        await database.query('DELETE FROM _news_v WHERE id=ANY($1::int[])', [versionIds])
        for (const origin of ['news', 'pages', 'media'] as const) {
          await database.query(`DELETE FROM ${origin} WHERE id=ANY($1::int[])`, [ids[origin]])
          await database.query(
            'DELETE FROM search_documents WHERE origin=$1 AND source_id=ANY($2::text[])',
            [origin, ids[origin].map(String)],
          )
          await database.query(
            'DELETE FROM search_index_jobs WHERE origin=$1 AND source_id=ANY($2::text[])',
            [origin, ids[origin].map(String)],
          )
        }
      }
    } finally {
      await Promise.all(files.map((file) => rm(file, { force: true })))
      await database?.end()
      // The search module's separate pool is shared by other suites; leave it open.
    }
  })

  async function query(input: SearchInput): Promise<AvailableResult> {
    const result = await searchAdapter.search(input)
    expect(result.status).toBe('available')
    if (result.status !== 'available') throw new Error('Search database unexpectedly unavailable.')
    return result
  }

  async function createNews(marker: string, options: PublicationOptions = {}): Promise<number> {
    const inserted = await database!.query<{ id: number }>(
      `INSERT INTO news (visibility,_status,published_at,internal_notes) VALUES ($1,$2,$3,$4) RETURNING id`,
      [
        options.visibility ?? 'public',
        options.status ?? 'published',
        options.date ?? '2026-10-01T12:00:00Z',
        `editorial-secret-${marker}`,
      ],
    )
    const id = inserted.rows[0]!.id
    ids.news.push(id)
    await database!.query(
      `INSERT INTO news_locales (_parent_id,_locale,title,slug,summary,body,publication_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        id,
        options.locale ?? 'en',
        options.title ?? `${marker} public article`,
        `search-fixture-${randomUUID()}`,
        options.summary ?? `${marker} reviewed summary`,
        options.body ?? richBody(`${marker} reviewed article body`),
        options.publication ?? 'published',
      ],
    )
    return id
  }

  async function createMedia(
    marker: string,
    mime: string,
    options: PublicationOptions = {},
    contents?: Buffer,
  ): Promise<{ id: number; filename: string }> {
    const extension =
      mime === 'application/pdf'
        ? 'pdf'
        : mime === 'text/plain'
          ? 'txt'
          : mime === 'video/mp4'
            ? 'mp4'
            : 'png'
    const filename = `search-fixture-${randomUUID()}.${extension}`
    if (contents) {
      const uploadPath = path.resolve(process.cwd(), '.local/uploads', filename)
      await mkdir(path.dirname(uploadPath), { recursive: true })
      files.push(uploadPath)
      await writeFile(uploadPath, contents)
    }
    const inserted = await database!.query<{ id: number }>(
      `INSERT INTO media (visibility,_status,filename,mime_type,rights,internal_notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [
        options.visibility ?? 'public',
        options.status ?? 'published',
        filename,
        mime,
        'Synthetic test fixture',
        `editorial-secret-${marker}`,
      ],
    )
    const id = inserted.rows[0]!.id
    ids.media.push(id)
    await database!.query(
      `INSERT INTO media_locales (_parent_id,_locale,title,alt,caption,search_text,publication_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        id,
        options.locale ?? 'en',
        options.title ?? `${marker} public resource`,
        `${marker} resource description`,
        'Reviewed caption',
        options.summary ?? '',
        options.publication ?? 'published',
      ],
    )
    return { id, filename }
  }

  it('ranks title matches above body matches and supports French accents, English stemming and title typos', async () => {
    const marker = term()
    const exact = await createNews(marker, {
      title: `${marker} Photovoltaics`,
      body: richBody('Reviewed work'),
    })
    await createNews(marker, {
      title: 'Different public article',
      body: richBody(`${marker} Photovoltaics research`),
    })
    const frenchMarker = term()
    const french = await createNews(frenchMarker, {
      locale: 'fr',
      title: `${frenchMarker} Énergies renouvelables`,
    })
    const englishMarker = term()
    const english = await createNews(englishMarker, {
      title: `${englishMarker} Innovation`,
      body: richBody('Researchers developing technologies'),
    })
    await processSearchJobs(50)
    expect((await query({ query: `${marker} Photovoltaics`, locale: 'en' })).items[0]?.id).toBe(
      `news:${exact}:en`,
    )
    expect(
      (await query({ query: `${marker} Photovoltacs`, locale: 'en' })).items.map(({ id }) => id),
    ).toContain(`news:${exact}:en`)
    expect(
      (await query({ query: `${frenchMarker} energies renouvelable`, locale: 'fr' })).items.map(
        ({ id }) => id,
      ),
    ).toContain(`news:${french}:fr`)
    expect(
      (await query({ query: `${englishMarker} research technology`, locale: 'en' })).items.map(
        ({ id }) => id,
      ),
    ).toContain(`news:${english}:en`)
  })

  it('normalizes Arabic alef, diacritics and mixed IRESEN text while preserving display text', async () => {
    const marker = term()
    const title = `${marker} إِنْجَاز أَبْحَاث الطَّاقَة IRESEN`
    const id = await createNews(marker, { locale: 'ar', title })
    await processSearchJobs(50)
    const arabic = await query({ query: `${marker} انجاز ابحاث الطاقة`, locale: 'ar' })
    expect(arabic.items.find((item) => item.id === `news:${id}:ar`)?.title).toBe(title)
    expect(
      (await query({ query: `${marker} IRESEN الطاقة`, locale: 'ar' })).items.map(({ id }) => id),
    ).toContain(`news:${id}:ar`)
    expect((await query({ query: marker, locale: 'fr' })).total).toBe(0)
    expect((await query({ query: marker, locale: 'en' })).total).toBe(0)
  })

  it('excludes private, draft, unapproved and missing-locale content and editorial notes', async () => {
    const marker = term()
    const approved = await createNews(marker, { locale: 'fr' })
    const editorialSecret = term()
    await database!.query('UPDATE news SET internal_notes=$2 WHERE id=$1', [
      approved,
      editorialSecret,
    ])
    await createNews(marker, { locale: 'fr', visibility: 'private' })
    await createNews(marker, { locale: 'fr', status: 'draft' })
    await createNews(marker, { locale: 'fr', publication: 'review' })
    await createNews(marker, { locale: 'fr', publication: 'draft' })
    await createMedia(marker, 'image/png', { locale: 'fr', visibility: 'private' })
    await processSearchJobs(50)
    expect((await query({ query: marker, locale: 'fr' })).items.map(({ id }) => id)).toEqual([
      `news:${approved}:fr`,
    ])
    expect((await query({ query: marker, locale: 'ar' })).total).toBe(0)
    expect((await query({ query: editorialSecret, locale: 'fr' })).total).toBe(0)

    const draftMarker = term()
    const version = await database!.query<{ id: number }>(
      `INSERT INTO _news_v (parent_id,version__status,version_visibility,latest) VALUES ($1,'draft','public',true) RETURNING id`,
      [approved],
    )
    const versionId = version.rows[0]!.id
    versionIds.push(versionId)
    await database!.query(
      `INSERT INTO _news_v_locales (_parent_id,_locale,version_title,version_summary,version_body,version_publication_status)
       VALUES ($1,'fr',$2,$2,$3,'review')`,
      [versionId, draftMarker, richBody(draftMarker)],
    )
    await processSearchJobs(50)
    expect((await query({ query: draftMarker, locale: 'fr' })).total).toBe(0)
    expect((await query({ query: marker, locale: 'fr' })).items[0]?.id).toBe(`news:${approved}:fr`)
  })

  it('gates stale edits and withdrawals immediately, then processes queued reindex and deletion', async () => {
    const original = term()
    const replacement = term()
    const id = await createNews(original)
    await processSearchJobs(50)
    expect((await query({ query: original, locale: 'en' })).total).toBe(1)
    await database!.query(
      'UPDATE news_locales SET title=$2,summary=$2,body=$3 WHERE _parent_id=$1',
      [id, replacement, richBody(replacement)],
    )
    expect((await query({ query: original, locale: 'en' })).total).toBe(0)
    expect((await query({ query: replacement, locale: 'en' })).total).toBe(0)
    expect(
      (
        await database!.query('SELECT 1 FROM search_index_jobs WHERE origin=$1 AND source_id=$2', [
          'news',
          String(id),
        ])
      ).rowCount,
    ).toBe(1)
    await processSearchJobs(50)
    expect((await query({ query: replacement, locale: 'en' })).total).toBe(1)

    await database!.query("UPDATE news SET visibility='private' WHERE id=$1", [id])
    expect((await query({ query: replacement, locale: 'en' })).total).toBe(0)
    await processSearchJobs(50)
    expect(
      (
        await database!.query('SELECT 1 FROM search_documents WHERE origin=$1 AND source_id=$2', [
          'news',
          String(id),
        ])
      ).rowCount,
    ).toBe(0)
    await database!.query("UPDATE news SET visibility='public' WHERE id=$1", [id])
    await processSearchJobs(50)
    expect((await query({ query: replacement, locale: 'en' })).total).toBe(1)
    await database!.query(
      "UPDATE news_locales SET publication_status='review' WHERE _parent_id=$1",
      [id],
    )
    expect((await query({ query: replacement, locale: 'en' })).total).toBe(0)
    await database!.query(
      "UPDATE news_locales SET publication_status='published' WHERE _parent_id=$1",
      [id],
    )
    await processSearchJobs(50)
    await database!.query('DELETE FROM news WHERE id=$1', [id])
    expect((await query({ query: replacement, locale: 'en' })).total).toBe(0)
    await processSearchJobs(50)
    expect(
      (
        await database!.query('SELECT 1 FROM search_documents WHERE origin=$1 AND source_id=$2', [
          'news',
          String(id),
        ])
      ).rowCount,
    ).toBe(0)
  })

  it('hides ambiguous public news slugs and reindexes the surviving article after withdrawal or deletion', async () => {
    const marker = term()
    const survivor = await createNews(marker)
    const commonSlug = (
      await database!.query<{ slug: string }>(
        "SELECT slug FROM news_locales WHERE _parent_id=$1 AND _locale='en'",
        [survivor],
      )
    ).rows[0]!.slug
    await processSearchJobs(50)
    expect((await query({ query: marker, locale: 'en' })).items.map(({ id }) => id)).toEqual([
      `news:${survivor}:en`,
    ])

    const duplicate = await createNews(marker)
    await database!.query("UPDATE news_locales SET slug=$2 WHERE _parent_id=$1 AND _locale='en'", [
      duplicate,
      commonSlug,
    ])
    expect((await query({ query: marker, locale: 'en' })).total).toBe(0)
    await processSearchJobs(50)
    expect(
      (
        await database!.query(
          "SELECT 1 FROM search_documents WHERE origin='news' AND source_id=ANY($1::text[])",
          [[String(survivor), String(duplicate)]],
        )
      ).rowCount,
    ).toBe(0)

    await database!.query("UPDATE news SET visibility='private' WHERE id=$1", [duplicate])
    await processSearchJobs(50)
    expect((await query({ query: marker, locale: 'en' })).items.map(({ id }) => id)).toEqual([
      `news:${survivor}:en`,
    ])
    await database!.query("UPDATE news SET visibility='public' WHERE id=$1", [duplicate])
    expect((await query({ query: marker, locale: 'en' })).total).toBe(0)
    await processSearchJobs(50)
    await database!.query('DELETE FROM news WHERE id=$1', [duplicate])
    await processSearchJobs(50)
    const restored = await query({ query: marker, locale: 'en' })
    expect(restored.items.map(({ id }) => id)).toEqual([`news:${survivor}:en`])
    expect(restored.items[0]?.url).toBe(`${pageHref('news', 'en')}/${commonSlug}`)
  })

  it('returns page and heading anchors, type facets, disjoint pagination and newest sorting', async () => {
    const marker = term()
    const availablePage = await database!.query<{ page_id: PageId }>(
      'SELECT candidate AS page_id FROM unnest($1::text[]) candidate WHERE NOT EXISTS (SELECT 1 FROM pages WHERE page_id=candidate) LIMIT 1',
      [pageIds.filter((pageId) => pageId !== 'search')],
    )
    const pageId = availablePage.rows[0]?.page_id
    if (!pageId)
      throw new Error(
        'Search tests require an unused canonical page route in the disposable database.',
      )
    const inserted = await database!.query<{ id: number }>(
      "INSERT INTO pages (page_id,visibility,_status) VALUES ($1,'public','published') RETURNING id",
      [pageId],
    )
    const id = inserted.rows[0]!.id
    ids.pages.push(id)
    await database!.query(
      `INSERT INTO pages_locales (_parent_id,_locale,title,slug,summary,body,publication_status) VALUES ($1,'en',$2,$2,$2,$3,'published')`,
      [id, marker, richBody(`${marker} section description`, `${marker} section`)],
    )
    const newsIds: number[] = []
    for (let index = 0; index < 14; index++) {
      newsIds.push(
        await createNews(marker, {
          title: `${marker} article ${index}`,
          date: `2026-01-${String(index + 1).padStart(2, '0')}T12:00:00Z`,
        }),
      )
    }
    const document = await createMedia(marker, 'text/plain')
    const image = await createMedia(marker, 'image/png')
    await processSearchJobs(50)
    const first = await query({ query: marker, locale: 'en' })
    const second = await query({ query: marker, locale: 'en', page: 2 })
    expect(first.facets).toEqual({ page: 1, section: 1, news: 14, document: 1, media: 1 })
    expect(first.total).toBe(18)
    expect(first.totalPages).toBe(2)
    expect(first.items).toHaveLength(SEARCH_PAGE_SIZE)
    expect(second.items).toHaveLength(18 - SEARCH_PAGE_SIZE)
    expect(new Set([...first.items, ...second.items].map((item) => item.id)).size).toBe(18)
    expect(first.items.find((item) => item.id === `pages:${id}:en`)?.url).toBe(
      `${pageHref(pageId, 'en')}#published-content`,
    )
    expect(
      [...first.items, ...second.items].find(
        (item) => item.id === `pages:${id}:en:content-section-0`,
      )?.url,
    ).toBe(`${pageHref(pageId, 'en')}#content-section-0`)
    expect(
      [...first.items, ...second.items].find((item) => item.id === `media:${document.id}:en`)?.url,
    ).toBe(`/api/media/file/${document.filename}?locale=en`)
    expect(
      [...first.items, ...second.items].find((item) => item.id === `media:${image.id}:en`)?.type,
    ).toBe('media')
    const filtered = await query({ query: marker, locale: 'en', type: 'news', page: 2 })
    expect(filtered.total).toBe(14)
    expect(filtered.items).toHaveLength(2)
    expect(filtered.items.every((item) => item.type === 'news')).toBe(true)
    expect(filtered.facets).toEqual(first.facets)
    expect((await query({ query: marker, locale: 'en', page: 999 })).page).toBe(2)
    expect((await query({ query: marker, locale: 'en', sort: 'newest' })).items[0]?.id).toBe(
      `news:${newsIds.at(-1)}:en`,
    )
  })

  it('indexes public PDF/text contents and transcript metadata while excluding a private PDF', async () => {
    const publicText = term()
    const privateText = term()
    const metadata = term()
    const publicFile = await createMedia(metadata, 'application/pdf', {}, textPdf(publicText))
    const privateFile = await createMedia(
      term(),
      'application/pdf',
      { visibility: 'private' },
      textPdf(privateText),
    )
    const transcript = term()
    const publicVideo = await createMedia(term(), 'video/mp4', { summary: transcript })
    const plainText = term()
    const plainFile = await createMedia(term(), 'text/plain', {}, Buffer.from(`\u0000${plainText}`))
    await processSearchJobs(50)
    expect((await query({ query: publicText, locale: 'en' })).items.map(({ id }) => id)).toEqual([
      `media:${publicFile.id}:en`,
    ])
    expect((await query({ query: privateText, locale: 'en' })).total).toBe(0)
    expect((await query({ query: transcript, locale: 'en' })).items.map(({ id }) => id)).toEqual([
      `media:${publicVideo.id}:en`,
    ])
    expect((await query({ query: plainText, locale: 'en' })).items.map(({ id }) => id)).toEqual([
      `media:${plainFile.id}:en`,
    ])
    expect(
      (
        await database!.query('SELECT 1 FROM search_index_jobs WHERE origin=$1 AND source_id=$2', [
          'media',
          String(plainFile.id),
        ])
      ).rowCount,
    ).toBe(0)
    expect(
      (
        await database!.query('SELECT 1 FROM search_documents WHERE origin=$1 AND source_id=$2', [
          'media',
          String(privateFile.id),
        ])
      ).rowCount,
    ).toBe(0)
  })

  it('treats SQL and tsquery syntax as text and rejects invalid or control-character inputs', async () => {
    const before = await database!.query<{ count: string }>('SELECT count(*) FROM news')
    const result = await query({ query: "' OR 1=1; DROP TABLE news; -- & ! :*", locale: 'en' })
    expect(result.items).toEqual([])
    expect(
      (await database!.query<{ count: string }>('SELECT count(*) FROM news')).rows[0]?.count,
    ).toBe(before.rows[0]?.count)
    expect((await query({ query: ' & ! :* ', locale: 'en' })).total).toBe(0)
    await expect(
      searchAdapter.search({ query: 'secret\u0000query', locale: 'en' }),
    ).rejects.toThrow('Invalid search input')
    await expect(searchAdapter.search({ query: 'query', locale: 'en', page: -1 })).rejects.toThrow(
      'Invalid search input',
    )
  })
})
