import 'server-only'

import { isContentLocale } from '@/lib/content/publication'
import { relatedSearchPhrases } from './concepts'
import { searchDatabase } from './database'
import { publicSearchEligibility } from './eligibility'
import { initializeSearchCatalog, startSearchWorker } from './indexer'
import { hasControlCharacters, normalizeSearchText, searchExcerpt } from './text'
import { suggestSearchQuery } from './vocabulary'
import {
  searchTypes,
  type SearchAdapter,
  type SearchInput,
  type SearchItem,
  type SearchMatchKind,
  type SearchResult,
  type SearchType,
} from './types'

export type {
  SearchAdapter,
  SearchInput,
  SearchItem,
  SearchLocale,
  SearchMatchKind,
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

const LANGUAGE_CONFIG =
  "CASE $1 WHEN 'fr' THEN 'french'::regconfig WHEN 'en' THEN 'english'::regconfig ELSE 'simple'::regconfig END"

function tokenQuery(query: string, allowPrefixes = false): string {
  // Search inputs/variants are bounded to 200 characters; retain every required term.
  return [...new Set(normalizeSearchText(query).split(' ').filter(Boolean))]
    .map((token) => (allowPrefixes && token.length >= 4 ? `${token}:*` : token))
    .join(' & ')
}

// Each expansion is a complete AND query, never a bag of OR-ed individual terms.
// The independent tier precedes the bounded score so frequency cannot outrank an exact match.
const MATCHED_CTE = `WITH query AS (
  SELECT $2::text AS normalized, to_tsquery('simple', $3) AS prefixes,
    plainto_tsquery(${LANGUAGE_CONFIG}, $2) AS stemmed,
    $5::text AS corrected,
    to_tsquery('simple',coalesce($6,'')) AS corrected_prefixes,
    plainto_tsquery(${LANGUAGE_CONFIG},coalesce($5,'')) AS corrected_stemmed,
    to_tsquery('simple',$7) AS related_prefixes,
    to_tsquery(${LANGUAGE_CONFIG},$7) AS related_stemmed
), variants AS MATERIALIZED (
  SELECT entry.text,to_tsquery('simple',entry.prefixes) AS prefixes,
    to_tsquery(${LANGUAGE_CONFIG},entry.prefixes) AS stemmed
  FROM jsonb_to_recordset($8::jsonb) AS entry(text text,prefixes text)
), candidates AS (
  SELECT d.*,
    position(' ' || q.normalized || ' ' in ' ' || d.title_norm || ' ')>0 AS title_phrase,
    position(' ' || q.normalized || ' ' in ' ' || d.body_norm || ' ')>0 AS body_phrase,
    (d.search_vector @@ q.prefixes OR d.search_vector @@ q.stemmed) AS original_match,
    (d.search_vector @@ q.corrected_prefixes OR d.search_vector @@ q.corrected_stemmed) AS corrected_match,
    CASE WHEN d.title_norm=q.normalized THEN 100 ELSE 0 END +
    CASE WHEN position(' ' || q.normalized || ' ' in ' ' || d.title_norm || ' ')>0 THEN 40 ELSE 0 END +
    CASE WHEN (to_tsvector('simple',d.title_norm) || to_tsvector(${LANGUAGE_CONFIG},d.title_norm)) @@ (q.prefixes || q.stemmed || q.corrected_prefixes || q.corrected_stemmed) THEN 20 ELSE 0 END +
    ts_rank_cd(d.search_vector,q.stemmed || q.prefixes || q.corrected_stemmed || q.corrected_prefixes,32)*10 +
    CASE d.type WHEN 'page' THEN 2 WHEN 'news' THEN 1.5 WHEN 'section' THEN 1 ELSE 0 END AS score
  FROM search_documents d CROSS JOIN query q
  WHERE d.locale=$1 AND (
    d.search_vector @@ q.prefixes OR d.search_vector @@ q.stemmed OR
    d.search_vector @@ q.corrected_prefixes OR d.search_vector @@ q.corrected_stemmed OR
    d.search_vector @@ q.related_prefixes OR d.search_vector @@ q.related_stemmed
  ) AND ${publicSearchEligibility('d', '$4')}
), matched AS (
  SELECT c.*,
    CASE WHEN c.title_phrase THEN 0 WHEN c.body_phrase THEN 1 WHEN c.original_match THEN 2 WHEN c.corrected_match THEN 3 ELSE 4 END AS tier,
    CASE WHEN c.title_phrase OR c.body_phrase THEN 'exact' WHEN c.original_match THEN 'linguistic' WHEN c.corrected_match THEN 'typo' ELSE 'related' END AS match_kind,
    CASE WHEN c.original_match THEN $2 WHEN c.corrected_match THEN $5 ELSE related.text END AS matched_query,
    coalesce(related.rank,0) AS related_rank
  FROM candidates c
  LEFT JOIN LATERAL (
    SELECT v.text,ts_rank_cd(c.search_vector,v.prefixes || v.stemmed,32) AS rank
    FROM variants v WHERE NOT c.original_match AND NOT c.corrected_match
      AND (c.search_vector @@ v.prefixes OR c.search_vector @@ v.stemmed)
    ORDER BY (c.title_norm=v.text) DESC,
      (position(' ' || v.text || ' ' in ' ' || c.title_norm || ' ')>0) DESC,
      rank DESC,v.text ASC LIMIT 1
  ) related ON true
)`

/** Locale-aware, indexed PostgreSQL search. Every query rechecks current publication eligibility. */
export const searchAdapter: SearchAdapter = {
  async search(input: SearchInput): Promise<SearchResult> {
    if (!validateSearchInput(input)) throw new Error('Invalid search input.')
    const query = input.query.trim()
    const normalized = normalizeSearchText(query)
    const sort = input.sort ?? 'relevance'
    const page = input.page ?? 1
    const response: Extract<SearchResult, { status: 'available' }> = {
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
      const suggestedQuery = await suggestSearchQuery(query, input.locale, revision)
      if (suggestedQuery) response.suggestedQuery = suggestedQuery
      const originalRelated = relatedSearchPhrases(query, input.locale)
      const correctedRelated = suggestedQuery
        ? relatedSearchPhrases(suggestedQuery, input.locale)
        : []
      const related = new Set<string>()
      for (let index = 0; related.size < 8 && index < 8; index++) {
        for (const text of [originalRelated[index], correctedRelated[index]]) {
          if (text && text.length <= SEARCH_QUERY_LIMIT) related.add(text)
          if (related.size === 8) break
        }
      }
      const variants = [...related].map((text) => ({ text, prefixes: tokenQuery(text) }))
      const params = [
        input.locale,
        normalized,
        tokenQuery(query, true),
        revision,
        suggestedQuery ? normalizeSearchText(suggestedQuery) : null,
        suggestedQuery ? tokenQuery(suggestedQuery, true) : null,
        variants.map(({ prefixes }) => `(${prefixes})`).join(' | '),
        JSON.stringify(variants),
      ]
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
        match_kind: SearchMatchKind
        matched_query: string
      }>(
        `${MATCHED_CTE} SELECT id,title,url,type,body,locale,published_at,match_kind,matched_query FROM matched WHERE ($9::text='all' OR type=$9)
         ORDER BY ${sort === 'newest' ? 'published_at DESC NULLS LAST,' : ''} tier ASC,(score+related_rank*10) DESC,title ASC,id ASC LIMIT $10 OFFSET $11`,
        [...params, input.type ?? 'all', SEARCH_PAGE_SIZE, (response.page - 1) * SEARCH_PAGE_SIZE],
      )
      response.items = results.rows.map((row) => ({
        id: row.id,
        title: row.title,
        url: row.url,
        type: row.type,
        excerpt: searchExcerpt(row.body, row.matched_query ?? query),
        locale: row.locale,
        matchKind: row.match_kind,
        matchedQuery: row.matched_query ?? normalized,
        ...(row.published_at ? { publishedAt: row.published_at.toISOString() } : {}),
      }))
      return response
    } catch {
      return { status: 'unavailable' }
    }
  },
}
