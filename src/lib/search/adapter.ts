import 'server-only'

import { isContentLocale } from '@/lib/content/publication'
import { searchDatabase } from './database'
import { initializeSearchCatalog, startSearchWorker } from './indexer'
import { hasControlCharacters, normalizeSearchText, searchExcerpt, searchTokens } from './text'
import {
  searchTypes,
  type SearchAdapter,
  type SearchInput,
  type SearchItem,
  type SearchResult,
  type SearchType,
} from './types'

export type {
  SearchAdapter,
  SearchInput,
  SearchItem,
  SearchLocale,
  SearchResult,
  SearchSort,
  SearchType,
} from './types'
export const SEARCH_PAGE_SIZE = 12
export const SEARCH_QUERY_LIMIT = 200
export const SEARCH_MAX_PAGE = 1000

function emptyFacets(): Record<SearchType, number> {
  return { page: 0, section: 0, news: 0, document: 0, media: 0 }
}

export function validateSearchInput(input: SearchInput): boolean {
  return (
    typeof input.query === 'string' &&
    input.query.length <= SEARCH_QUERY_LIMIT &&
    !hasControlCharacters(input.query) &&
    isContentLocale(input.locale) &&
    (input.type === undefined || input.type === 'all' || searchTypes.includes(input.type)) &&
    (input.sort === undefined || input.sort === 'relevance' || input.sort === 'newest') &&
    (input.page === undefined ||
      (Number.isSafeInteger(input.page) && input.page >= 1 && input.page <= SEARCH_MAX_PAGE))
  )
}

const MATCHED_CTE = `WITH query AS (
  SELECT $2::text AS normalized, to_tsquery('simple', $3) AS prefixes,
    plainto_tsquery(CASE $1 WHEN 'fr' THEN 'french'::regconfig WHEN 'en' THEN 'english'::regconfig ELSE 'simple'::regconfig END, $2) AS stemmed
), matched AS (
  SELECT d.*, (
    CASE WHEN d.title_norm=q.normalized THEN 100 ELSE 0 END +
    CASE WHEN position(q.normalized in d.title_norm)>0 THEN 25 ELSE 0 END +
    ts_rank_cd(d.search_vector, q.stemmed)*10 + ts_rank_cd(d.search_vector, q.prefixes)*5 +
    word_similarity(q.normalized,d.title_norm)*5 +
    CASE d.type WHEN 'page' THEN 2 WHEN 'news' THEN 1.5 WHEN 'section' THEN 1 ELSE 0 END
  ) AS score
  FROM search_documents d CROSS JOIN query q
  WHERE d.locale=$1 AND (
    d.search_vector @@ q.prefixes OR d.search_vector @@ q.stemmed OR
    (length(q.normalized)>=3 AND (d.title_norm % q.normalized OR q.normalized <% d.title_norm))
  ) AND (
    (d.origin='static' AND d.source_revision=$4) OR
    EXISTS (SELECT 1 FROM search_public_sources s WHERE s.origin=d.origin AND s.source_id=d.source_id AND s.locale=d.locale AND s.source_revision=d.source_revision)
  )
)`

/** Locale-aware, indexed PostgreSQL search. Every query rechecks current publication eligibility. */
export const searchAdapter: SearchAdapter = {
  async search(input: SearchInput): Promise<SearchResult> {
    if (!validateSearchInput(input)) throw new Error('Invalid search input.')
    const query = input.query.trim()
    const normalized = normalizeSearchText(query)
    const sort = input.sort ?? 'relevance'
    const page = input.page ?? 1
    const response = {
      status: 'available' as const,
      query,
      items: [] as SearchItem[],
      total: 0,
      page,
      pageSize: SEARCH_PAGE_SIZE,
      totalPages: 0,
      sort,
      facets: emptyFacets(),
    }
    if (!normalized) return response
    try {
      const revision = await initializeSearchCatalog()
      startSearchWorker()
      const prefixes = searchTokens(query)
        .map((token) => `${token}:*`)
        .join(' & ')
      const params = [input.locale, normalized, prefixes, revision]
      const database = searchDatabase()
      const facets = await database.query<{ type: SearchType; count: string }>(
        `${MATCHED_CTE} SELECT type,count(*) FROM matched GROUP BY type`,
        params,
      )
      for (const facet of facets.rows) response.facets[facet.type] = Number(facet.count)
      response.total =
        input.type && input.type !== 'all'
          ? response.facets[input.type]
          : Object.values(response.facets).reduce((a, b) => a + b, 0)
      response.totalPages = Math.min(SEARCH_MAX_PAGE, Math.ceil(response.total / SEARCH_PAGE_SIZE))
      response.page = Math.min(page, Math.max(1, response.totalPages))
      const results = await database.query<{
        id: string
        title: string
        url: string
        type: SearchType
        body: string
        locale: SearchItem['locale']
        published_at: Date | null
      }>(
        `${MATCHED_CTE} SELECT id,title,url,type,body,locale,published_at FROM matched WHERE ($5::text='all' OR type=$5)
         ORDER BY ${sort === 'newest' ? 'published_at DESC NULLS LAST,' : ''} score DESC,title ASC,id ASC LIMIT $6 OFFSET $7`,
        [...params, input.type ?? 'all', SEARCH_PAGE_SIZE, (response.page - 1) * SEARCH_PAGE_SIZE],
      )
      response.items = results.rows.map((row) => ({
        id: row.id,
        title: row.title,
        url: row.url,
        type: row.type,
        excerpt: searchExcerpt(row.body, query),
        locale: row.locale,
        ...(row.published_at ? { publishedAt: row.published_at.toISOString() } : {}),
      }))
      return response
    } catch {
      return { status: 'unavailable' }
    }
  },
}
