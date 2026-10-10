import { execFile } from 'node:child_process'
import { readFile, realpath, stat } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import type { PoolClient } from 'pg'

import { careerHref, careerDownloadHref } from '@/lib/careers'
import { contentLocales } from '@/lib/content/publication'
import { mediaDirectory } from '@/cms/media-directory'
import { isPublicSlug, isNewsSlug, newsHref } from '@/lib/content/routes'
import { pageHref, pageIds, type PageId } from '@/lib/site'
import { catalogRevision, staticSearchDocuments } from './catalog'
import { searchDatabase } from './database'
import {
  hasControlCharacters,
  normalizeSearchText,
  richTextPlainText,
  richTextSections,
} from './text'
import type { PublicSearchDocument, SearchLocale } from './types'
import { VOCABULARY_VERSION, writePublicVocabulary } from './vocabulary'

const executeFile = promisify(execFile)
type Origin = 'pages' | 'news' | 'media' | 'opportunities'
type Source = {
  origin: Origin
  source_id: string
  locale: SearchLocale
  source_revision: string
  page_id: string | null
  title: string
  slug: string | null
  body_text: string | null
  rich_body: unknown
  filename: string | null
  mime_type: string | null
  published_at: Date | null
}

let catalogReady: Promise<string> | undefined
let currentRevision: string | undefined

async function writeDocument(
  client: PoolClient,
  document: PublicSearchDocument,
  origin: 'static' | Origin,
  sourceId: string | null,
  revision: string,
) {
  const title = document.title.slice(0, 1000)
  const body = document.body.slice(0, 100_000)
  await client.query(
    `INSERT INTO search_documents (id, origin, source_id, locale, source_revision, title, body, url, type, published_at, title_norm, body_norm)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     ON CONFLICT (id) DO UPDATE SET source_revision=EXCLUDED.source_revision, title=EXCLUDED.title, body=EXCLUDED.body, url=EXCLUDED.url, type=EXCLUDED.type,
       published_at=EXCLUDED.published_at, title_norm=EXCLUDED.title_norm, body_norm=EXCLUDED.body_norm`,
    [
      document.id,
      origin,
      sourceId,
      document.locale,
      revision,
      title,
      body,
      document.url,
      document.type,
      document.publishedAt ?? null,
      normalizeSearchText(title).slice(0, 1500),
      normalizeSearchText(body).slice(0, 100_000),
    ],
  )
  return { id: document.id, locale: document.locale, title, body }
}

/** Small explicit runtime catalog only; CMS reindex/extraction never runs in request latency. */
export async function initializeSearchCatalog(): Promise<string> {
  if (currentRevision) return currentRevision
  catalogReady ??= (async () => {
    const documents = staticSearchDocuments()
    const revision = catalogRevision(documents)
    const client = await searchDatabase().connect()
    try {
      // Serialize multiple app processes and avoid rewriting unchanged content.
      await client.query('BEGIN')
      await client.query('SELECT pg_advisory_xact_lock(739104102)')
      const existing = await client.query<{ count: string }>(
        "SELECT count(*) FROM search_documents WHERE origin='static' AND source_revision=$1 AND vocabulary_version=$2",
        [revision, VOCABULARY_VERSION],
      )
      if (Number(existing.rows[0]?.count) !== documents.length) {
        // One parameterized bulk write avoids a network round trip for every catalog entry.
        const rows = documents.map((document) => ({
          id: document.id,
          locale: document.locale,
          title: document.title,
          body: document.body,
          url: document.url,
          type: document.type,
          published_at: document.publishedAt ?? null,
          title_norm: normalizeSearchText(document.title),
          body_norm: normalizeSearchText(document.body),
        }))
        await client.query(
          `INSERT INTO search_documents (id,origin,locale,source_revision,title,body,url,type,published_at,title_norm,body_norm)
          SELECT id,'static',locale,$2,title,body,url,type,published_at,title_norm,body_norm
          FROM jsonb_to_recordset($1::jsonb) AS entry(id text,locale text,title text,body text,url text,type text,published_at timestamptz,title_norm text,body_norm text)
          ON CONFLICT (id) DO UPDATE SET source_revision=EXCLUDED.source_revision,title=EXCLUDED.title,body=EXCLUDED.body,url=EXCLUDED.url,type=EXCLUDED.type,
            published_at=EXCLUDED.published_at,title_norm=EXCLUDED.title_norm,body_norm=EXCLUDED.body_norm`,
          [JSON.stringify(rows), revision],
        )
        await writePublicVocabulary(client, documents)
      }
      await client.query(
        "DELETE FROM search_documents WHERE origin='static' AND source_revision <> $1",
        [revision],
      )
      await client.query('COMMIT')
      currentRevision = revision
      return revision
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  })().catch((error: unknown) => {
    catalogReady = undefined
    throw error
  })
  return catalogReady
}

/** Extract only local, public-source files. No URLs, shell, directory scan or private metadata. */
export async function extractPublicFileText(filename: string, mimeType: string): Promise<string> {
  if (!['application/pdf', 'text/plain'].includes(mimeType)) return ''
  if (
    !filename ||
    path.basename(filename) !== filename ||
    hasControlCharacters(filename) ||
    /[\\/]/.test(filename)
  )
    return ''
  try {
    const root = await realpath(mediaDirectory())
    const file = await realpath(path.join(root, filename))
    if (path.dirname(file) !== root) return ''
    const info = await stat(file)
    if (!info.isFile() || info.size > 10_000_000) return ''
    if (mimeType === 'text/plain')
      return (await readFile(file, 'utf8')).replaceAll(String.fromCharCode(0), '').slice(0, 100_000)
    const { stdout } = await executeFile(
      'pdftotext',
      ['-enc', 'UTF-8', '-nopgbrk', '-f', '1', '-l', '200', file, '-'],
      { timeout: 5_000, maxBuffer: 1_000_000, encoding: 'utf8' },
    )
    return stdout.replaceAll(String.fromCharCode(0), '').slice(0, 100_000)
  } catch {
    // Corrupt/encrypted/scanned files or an absent Poppler binary retain reviewed metadata.
    return ''
  }
}

function sourceUrl(source: Source): string | undefined {
  if (
    source.origin === 'pages' &&
    pageIds.includes(source.page_id as PageId) &&
    source.page_id !== 'search'
  )
    return `${pageHref(source.page_id as PageId, source.locale)}#published-content`
  if (source.origin === 'opportunities' && isPublicSlug(source.slug))
    return careerHref(source.slug, source.locale)
  if (source.origin === 'news' && isNewsSlug(source.slug, source.locale))
    return newsHref(source.slug, source.locale)
  if (
    source.origin === 'media' &&
    source.filename &&
    path.basename(source.filename) === source.filename &&
    !hasControlCharacters(source.filename) &&
    !/[\\/]/.test(source.filename)
  )
    return `/api/media/file/${encodeURIComponent(source.filename)}?locale=${source.locale}`
  return undefined
}

function mediaType(mime: string | null): 'document' | 'media' {
  return mime?.startsWith('image/') || mime?.startsWith('audio/') || mime?.startsWith('video/')
    ? 'media'
    : 'document'
}

/** Processes at most one bounded batch. Durable jobs survive app restarts and are idempotent. */
export async function processSearchJobs(batchSize = 5): Promise<number> {
  let processed = 0
  for (let index = 0; index < Math.min(Math.max(batchSize, 1), 50); index++) {
    const client = await searchDatabase().connect()
    let job: { origin: Origin; source_id: string } | undefined
    try {
      await client.query('BEGIN')
      const jobs = await client.query<{ origin: Origin; source_id: string }>(
        `SELECT origin, source_id FROM search_index_jobs WHERE next_try <= now() ORDER BY queued_at FOR UPDATE SKIP LOCKED LIMIT 1`,
      )
      job = jobs.rows[0]
      if (!job) {
        await client.query('COMMIT')
        break
      }
      const sources = await client.query<Source>(
        'SELECT * FROM search_public_sources WHERE origin=$1 AND source_id=$2',
        [job.origin, job.source_id],
      )
      await client.query('DELETE FROM search_documents WHERE origin=$1 AND source_id=$2', [
        job.origin,
        job.source_id,
      ])
      let fileText: string | undefined
      const vocabularyDocuments: Pick<PublicSearchDocument, 'id' | 'locale' | 'title' | 'body'>[] =
        []
      for (const source of sources.rows) {
        if (!contentLocales.includes(source.locale)) continue
        const url = sourceUrl(source)
        if (!url) continue
        if (source.origin === 'media' && source.filename && fileText === undefined)
          fileText = await extractPublicFileText(source.filename, source.mime_type ?? '')
        const document: PublicSearchDocument = {
          id: `${source.origin}:${source.source_id}:${source.locale}`,
          locale: source.locale,
          title: source.title,
          url,
          type:
            source.origin === 'pages'
              ? 'page'
              : source.origin === 'opportunities'
                ? 'section'
                : source.origin === 'news'
                  ? 'news'
                  : mediaType(source.mime_type),
          body: [source.body_text, richTextPlainText(source.rich_body), fileText]
            .filter(Boolean)
            .join(' '),
          ...(source.published_at ? { publishedAt: source.published_at.toISOString() } : {}),
        }
        vocabularyDocuments.push(
          await writeDocument(
            client,
            document,
            source.origin,
            source.source_id,
            source.source_revision,
          ),
        )
        if (source.origin === 'opportunities' && source.slug) {
          vocabularyDocuments.push(
            await writeDocument(
              client,
              {
                ...document,
                id: `${document.id}:download`,
                type: 'document',
                url: careerDownloadHref(source.slug, source.locale),
              },
              source.origin,
              source.source_id,
              source.source_revision,
            ),
          )
        }
        if (source.origin !== 'media')
          for (const section of richTextSections(source.rich_body)) {
            vocabularyDocuments.push(
              await writeDocument(
                client,
                {
                  ...document,
                  id: `${document.id}:${section.anchor}`,
                  title: section.title,
                  body: section.body,
                  type: 'section',
                  url: `${url.split('#')[0]}#${section.anchor}`,
                },
                source.origin,
                source.source_id,
                source.source_revision,
              ),
            )
          }
      }
      await writePublicVocabulary(client, vocabularyDocuments)
      await client.query('DELETE FROM search_index_jobs WHERE origin=$1 AND source_id=$2', [
        job.origin,
        job.source_id,
      ])
      await client.query('COMMIT')
      processed++
    } catch (error) {
      await client.query('ROLLBACK')
      if (job)
        await client.query(
          "UPDATE search_index_jobs SET attempts=attempts+1, next_try=now() + interval '30 seconds' WHERE origin=$1 AND source_id=$2",
          [job.origin, job.source_id],
        )
      throw error
    } finally {
      client.release()
    }
  }
  return processed
}

let worker: ReturnType<typeof setInterval> | undefined
let processing = false

/** In-process worker plus standalone script: no index work is awaited by public searches. */
export function startSearchWorker(): void {
  if (
    worker ||
    process.env.SEARCH_WORKER_DISABLED === 'true' ||
    process.env.NEXT_PHASE === 'phase-production-build'
  )
    return
  const tick = async () => {
    if (processing) return
    processing = true
    try {
      await processSearchJobs()
    } catch {
      /* durable retry; never log public queries or content */
    } finally {
      processing = false
    }
  }
  worker = setInterval(() => {
    void tick()
  }, 1_000)
  worker.unref()
  void tick()
}

export function stopSearchWorker(): void {
  if (worker) clearInterval(worker)
  worker = undefined
}

export async function rebuildSearchIndex(): Promise<number> {
  await initializeSearchCatalog()
  await searchDatabase().query(`INSERT INTO search_index_jobs (origin, source_id)
    SELECT 'pages', id::text FROM pages UNION ALL SELECT 'news', id::text FROM news UNION ALL SELECT 'media', id::text FROM media UNION ALL SELECT 'opportunities', id::text FROM opportunities
    ON CONFLICT (origin, source_id) DO UPDATE SET next_try=now(), attempts=0`)
  // Removed/private/stale rows cannot survive even an interrupted rebuild.
  await searchDatabase()
    .query(`DELETE FROM search_documents d WHERE origin <> 'static' AND NOT EXISTS
    (SELECT 1 FROM search_public_sources s WHERE s.origin=d.origin AND s.source_id=d.source_id AND s.locale=d.locale AND s.source_revision=d.source_revision)`)
  let processed = 0
  let batch: number
  do {
    batch = await processSearchJobs(50)
    processed += batch
  } while (batch)
  return processed
}
