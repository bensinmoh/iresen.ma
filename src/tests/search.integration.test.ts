import { randomUUID } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { Pool } from 'pg'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { SEARCH_PAGE_SIZE, searchAdapter } from '@/lib/search/adapter'
import { staticSearchDocuments } from '@/lib/search/catalog'
import { initializeSearchCatalog, processSearchJobs, stopSearchWorker } from '@/lib/search/indexer'
import { normalizeSearchText } from '@/lib/search/text'
import type { SearchInput, SearchLocale, SearchResult } from '@/lib/search/types'
import { VOCABULARY_VERSION } from '@/lib/search/vocabulary'
import { pageHref, pageIds, type PageId } from '@/lib/site'
import { mediaDirectory } from '@/cms/media-directory'

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

/** A unique alphabetic word suitable for testing the spelling dictionary. */
function vocabularyWord(): string {
  const suffix = randomUUID()
    .replaceAll('-', '')
    .slice(0, 8)
    .replace(/\d/g, (digit) => String.fromCharCode(103 + Number(digit)))
  return `zephyroscope${suffix}`
}

function misspell(word: string): string {
  return `${word.slice(0, 4)}${word.slice(5)}`
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
      const uploadPath = path.join(mediaDirectory(), filename)
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

  it('rebuilds vocabulary at startup for an unchanged static catalog upgraded from the previous index schema', async () => {
    const document = staticSearchDocuments().find(
      ({ locale, type, title }) =>
        locale === 'en' && type === 'page' && title.includes('platforms'),
    )!
    const previous = await database!.query<{ source_revision: string }>(
      'SELECT source_revision FROM search_documents WHERE id=$1',
      [document.id],
    )
    await database!.query('UPDATE search_documents SET vocabulary_version=0 WHERE id=$1', [
      document.id,
    ])
    await database!.query('DELETE FROM search_document_vocabulary WHERE document_id=$1', [
      document.id,
    ])
    // A fresh process has no cached catalog promise, as on the first startup after migration.
    vi.resetModules()
    const freshIndexer = await import('@/lib/search/indexer')
    await freshIndexer.initializeSearchCatalog()
    const rebuilt = await database!.query<{
      source_revision: string
      vocabulary_version: number
      term: string
      surface: string
    }>(
      `SELECT d.source_revision,d.vocabulary_version,v.term,v.surface FROM search_documents d
       JOIN search_document_vocabulary v ON v.document_id=d.id WHERE d.id=$1 AND v.term='platforms'`,
      [document.id],
    )
    expect(rebuilt.rows).toHaveLength(1)
    expect(rebuilt.rows[0]?.source_revision).toBe(previous.rows[0]?.source_revision)
    expect(rebuilt.rows[0]?.vocabulary_version).toBe(VOCABULARY_VERSION)
    expect(rebuilt.rows[0]?.surface).toBe('platforms')
  })

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

  it('keeps exact title and body phrases ahead of repeated related content and excludes near spellings of valid words', async () => {
    const marker = term()
    const phrase = `${marker} photovoltaic`
    const exactTitle = await createNews(marker, {
      title: phrase,
      summary: '',
      body: richBody('Reviewed technical work'),
      date: '2026-01-01T12:00:00Z',
    })
    const exactBody = await createNews(marker, {
      title: 'A published experimental report',
      summary: '',
      body: richBody(`${phrase} `.repeat(1000)),
      date: '2026-02-01T12:00:00Z',
    })
    const typo = await createNews(marker, {
      title: `${marker} photovoltac`,
      summary: '',
      body: richBody(`${marker} photovoltac `.repeat(1000)),
      date: '2026-03-01T12:00:00Z',
    })
    const related = await createNews(marker, {
      title: `${marker} solar`,
      summary: '',
      body: richBody(`${marker} solar `.repeat(1000)),
      date: '2026-04-01T12:00:00Z',
    })
    await processSearchJobs(50)
    const result = await query({ query: phrase, locale: 'en', type: 'news' })
    expect(result.items.slice(0, 2).map(({ id }) => id)).toEqual([
      `news:${exactTitle}:en`,
      `news:${exactBody}:en`,
    ])
    expect(result.items.slice(0, 2).every(({ matchKind }) => matchKind === 'exact')).toBe(true)
    expect(result.items.some(({ id }) => id === `news:${typo}:en`)).toBe(false)
    expect(result.items.find(({ id }) => id === `news:${related}:en`)?.matchKind).toBe('related')
    expect(result.suggestedQuery).toBeUndefined()
    const newest = await query({ query: phrase, locale: 'en', type: 'news', sort: 'newest' })
    expect(newest.items[0]?.id).toBe(`news:${related}:en`)
  })

  it('ranks literal PV titles before related photovoltaic content without correcting the acronym', async () => {
    const exact = await createNews(term(), { title: 'PV', summary: '', body: richBody('Reviewed') })
    const body = await createNews(term(), {
      title: 'Reviewed measurement note',
      summary: '',
      body: richBody('PV '.repeat(1000)),
    })
    const related = await createNews(term(), {
      title: 'Solar photovoltaics',
      summary: '',
      body: richBody('Solar photovoltaics '.repeat(1000)),
    })
    await processSearchJobs(50)
    const result = await query({ query: 'PV', locale: 'en', type: 'news' })
    expect(result.query).toBe('PV')
    expect(result.suggestedQuery).toBeUndefined()
    expect(result.items[0]?.id).toBe(`news:${exact}:en`)
    const literalBodyPosition = result.items.findIndex(({ id }) => id === `news:${body}:en`)
    const relatedPosition = result.items.findIndex(({ id }) => id === `news:${related}:en`)
    expect(literalBodyPosition).toBeGreaterThan(0)
    expect(relatedPosition).toBeGreaterThan(literalBodyPosition)
    expect(result.items[relatedPosition]?.matchKind).toBe('related')
    expect(normalizeSearchText(result.items[relatedPosition]?.matchedQuery ?? '')).toMatch(
      /solar|photovoltaic/,
    )
  })

  it('suggests multiple transposed public words in French, English and Arabic while retaining the original query', async () => {
    const cases = [
      { locale: 'fr', title: 'Énergies solaires', typo: 'eneriges soliares' },
      { locale: 'en', title: 'Photovoltaics research', typo: 'photovoltacis reserach' },
      { locale: 'ar', title: 'الأَوْلَوِيَات والطَّاقة', typo: 'الاولويتا والطاقه' },
    ] as const
    const fixtures = []
    for (const item of cases) {
      const marker = term()
      const id = await createNews(marker, { locale: item.locale, title: `${marker} ${item.title}` })
      fixtures.push({ ...item, marker, id })
    }
    await processSearchJobs(50)
    for (const fixture of fixtures) {
      const original = `${fixture.marker} ${fixture.typo}`
      const expected = normalizeSearchText(`${fixture.marker} ${fixture.title}`)
      const result = await query({ query: original, locale: fixture.locale, type: 'news' })
      expect(result.query).toBe(original)
      expect(normalizeSearchText(result.suggestedQuery ?? '')).toBe(expected)
      const item = result.items.find(({ id }) => id === `news:${fixture.id}:${fixture.locale}`)
      expect(item?.title).toBe(`${fixture.marker} ${fixture.title}`)
      expect(item?.matchKind).toBe('typo')
      expect(normalizeSearchText(item?.matchedQuery ?? '')).toBe(expected)
    }
  })

  it('uses public Infrastructure for Insrastructure and preserves valid words and opaque identifiers', async () => {
    const marker = term()
    const id = await createNews(marker, { locale: 'fr', title: `${marker} Infrastructure` })
    await createNews(term(), { title: 'color colon', body: richBody('color colon') })
    await createNews(term(), {
      title: 'Photovoltaics phone',
      body: richBody('Photovoltaics phone'),
    })
    await processSearchJobs(50)
    const original = `${marker} Insrastructure`
    const result = await query({ query: original, locale: 'fr', type: 'news' })
    expect(result.query).toBe(original)
    expect(normalizeSearchText(result.suggestedQuery ?? '')).toBe(`${marker} infrastructure`)
    expect(result.items.find((item) => item.id === `news:${id}:fr`)?.matchKind).toBe('typo')
    for (const value of ['PV', 'pv', 'RDI', 'IRESEN', 'lab', 'job', 'color', 'photo', marker]) {
      expect((await query({ query: value, locale: 'en' })).suggestedQuery, value).toBeUndefined()
    }
  })

  it('matches curated concepts in each locale and keeps unmatched terms required', async () => {
    const cases = [
      { locale: 'fr', query: 'infrastructure', title: 'Plateformes' },
      { locale: 'en', query: 'infrastructure', title: 'Platforms' },
      { locale: 'ar', query: 'البنية التحتية', title: 'المنصات' },
      { locale: 'fr', query: 'panneaux solaires', title: 'Photovoltaïque' },
      { locale: 'en', query: 'solar panels', title: 'Photovoltaics' },
      { locale: 'ar', query: 'الألواح الشمسية', title: 'كهروضوئية' },
      { locale: 'fr', query: 'emplois', title: 'Carrières' },
      { locale: 'en', query: 'jobs', title: 'Careers' },
      { locale: 'ar', query: 'وظائف', title: 'مسار مهني' },
      { locale: 'fr', query: 'tests', title: 'Expérimentation' },
      { locale: 'en', query: 'tests', title: 'Experimentation' },
      { locale: 'ar', query: 'اختبارات', title: 'تجريب' },
    ] as const
    const fixtures = []
    for (const item of cases) {
      const marker = term()
      const matched = await createNews(marker, {
        locale: item.locale,
        title: `${marker} ${item.title}`,
      })
      const irrelevant = await createNews(marker, {
        locale: item.locale,
        title: `${marker} accounting gardens`,
      })
      const otherMarker = term()
      const missingConstraint = await createNews(otherMarker, {
        locale: item.locale,
        title: `${otherMarker} ${item.title}`,
      })
      fixtures.push({ ...item, marker, matched, irrelevant, missingConstraint })
    }
    await processSearchJobs(100)
    for (const fixture of fixtures) {
      const original = `${fixture.marker} ${fixture.query}`
      const result = await query({ query: original, locale: fixture.locale, type: 'news' })
      expect(result.query).toBe(original)
      expect(result.suggestedQuery, `${fixture.locale}: ${fixture.query}`).toBeUndefined()
      const matched = result.items.find(
        ({ id }) => id === `news:${fixture.matched}:${fixture.locale}`,
      )
      expect(matched, `${fixture.locale}: ${fixture.query}`).toBeDefined()
      expect(matched?.matchKind).toBe('related')
      expect(normalizeSearchText(matched?.matchedQuery ?? '')).toContain(fixture.marker)
      const resultIds = result.items.map(({ id }) => id)
      expect(resultIds).not.toContain(`news:${fixture.irrelevant}:${fixture.locale}`)
      expect(resultIds).not.toContain(`news:${fixture.missingConstraint}:${fixture.locale}`)
    }
    const ordinary = await query({ query: 'accounting gardens', locale: 'en', type: 'news' })
    expect(ordinary.suggestedQuery).toBeUndefined()
    expect(ordinary.items.length).toBeGreaterThan(0)
    expect(ordinary.items.every(({ matchKind }) => matchKind === 'exact')).toBe(true)
  })

  it('retains the final required term in 12- and 13-token queries and longer related expansions', async () => {
    const constraints = [
      'cedar',
      'maple',
      'willow',
      'oak',
      'ash',
      'pine',
      'birch',
      'elm',
      'fir',
      'yew',
      'beech',
    ]
    const fixtures = []
    for (const count of [10, 11]) {
      const marker = term()
      const required = constraints.slice(0, count).join(' ')
      const matching = await createNews(marker, {
        title: `photovoltaic ${required} ${marker}`,
        summary: '',
        body: richBody('Reviewed'),
      })
      const unrelated = await createNews(term(), {
        title: `solar energy ${required}`,
        summary: '',
        body: richBody('Reviewed'),
      })
      fixtures.push({ marker, matching, unrelated, original: `solar ${required} ${marker}` })
    }
    await processSearchJobs(50)
    for (const fixture of fixtures) {
      const result = await query({ query: fixture.original, locale: 'en', type: 'news' })
      expect(
        result.items.map(({ id }) => id),
        fixture.original,
      ).toEqual([`news:${fixture.matching}:en`])
      expect(result.items[0]?.matchKind).toBe('related')
      expect(result.items[0]?.matchedQuery).toContain(fixture.marker)
      expect(result.items.some(({ id }) => id === `news:${fixture.unrelated}:en`)).toBe(false)
    }
  })

  it('never suggests draft, private, unapproved, missing-locale or editorial vocabulary', async () => {
    const secretCases: PublicationOptions[] = [
      { visibility: 'private' },
      { status: 'draft' },
      { publication: 'review' },
      { publication: 'draft' },
      { locale: 'ar' },
    ]
    const secrets: string[] = []
    for (const options of secretCases) {
      const word = vocabularyWord()
      secrets.push(word)
      await createNews(term(), { ...options, title: word, body: richBody(word) })
    }
    const publicWord = vocabularyWord()
    const published = await createNews(term(), { title: publicWord })
    const editorialSecret = vocabularyWord()
    secrets.push(editorialSecret)
    await database!.query('UPDATE news SET internal_notes=$2 WHERE id=$1', [
      published,
      editorialSecret,
    ])
    const draftSecret = vocabularyWord()
    secrets.push(draftSecret)
    const version = await database!.query<{ id: number }>(
      `INSERT INTO _news_v (parent_id,version__status,version_visibility,latest) VALUES ($1,'draft','public',true) RETURNING id`,
      [published],
    )
    versionIds.push(version.rows[0]!.id)
    await database!.query(
      `INSERT INTO _news_v_locales (_parent_id,_locale,version_title,version_summary,version_body,version_publication_status)
       VALUES ($1,'en',$2,$2,$3,'review')`,
      [version.rows[0]!.id, draftSecret, richBody(draftSecret)],
    )
    await processSearchJobs(50)
    expect((await query({ query: misspell(publicWord), locale: 'en' })).suggestedQuery).toBe(
      publicWord,
    )
    for (const secret of secrets) {
      const result = await query({ query: misspell(secret), locale: 'en' })
      expect(result.suggestedQuery, secret).toBeUndefined()
      expect(JSON.stringify(result), secret).not.toContain(secret)
    }
  })

  it('withdraws stale, private, unapproved and deleted spelling surfaces before index jobs run', async () => {
    const original = vocabularyWord()
    const replacement = vocabularyWord()
    const id = await createNews(term(), { title: original, summary: '', body: richBody(original) })
    await processSearchJobs(50)
    expect((await query({ query: misspell(original), locale: 'en' })).suggestedQuery).toBe(original)
    await database!.query(
      "UPDATE news_locales SET title=$2,summary='',body=$3 WHERE _parent_id=$1 AND _locale='en'",
      [id, replacement, richBody(replacement)],
    )
    expect(
      (await query({ query: misspell(original), locale: 'en' })).suggestedQuery,
    ).toBeUndefined()
    expect(
      (await query({ query: misspell(replacement), locale: 'en' })).suggestedQuery,
    ).toBeUndefined()
    await processSearchJobs(50)
    expect((await query({ query: misspell(replacement), locale: 'en' })).suggestedQuery).toBe(
      replacement,
    )
    await database!.query("UPDATE news SET visibility='private' WHERE id=$1", [id])
    expect(
      (await query({ query: misspell(replacement), locale: 'en' })).suggestedQuery,
    ).toBeUndefined()
    await database!.query("UPDATE news SET visibility='public' WHERE id=$1", [id])
    await processSearchJobs(50)
    await database!.query(
      "UPDATE news_locales SET publication_status='review' WHERE _parent_id=$1 AND _locale='en'",
      [id],
    )
    expect(
      (await query({ query: misspell(replacement), locale: 'en' })).suggestedQuery,
    ).toBeUndefined()
    await database!.query(
      "UPDATE news_locales SET publication_status='published' WHERE _parent_id=$1 AND _locale='en'",
      [id],
    )
    await processSearchJobs(50)
    await database!.query('DELETE FROM news WHERE id=$1', [id])
    expect(
      (await query({ query: misspell(replacement), locale: 'en' })).suggestedQuery,
    ).toBeUndefined()
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
