import 'server-only'

import { isLocale } from '@/i18n/locales'
import { pageSections, type SectionDefinition } from '@/lib/page-sections'
import ar from '@/messages/ar.json'
import en from '@/messages/en.json'
import fr from '@/messages/fr.json'

import { buildSearchDocuments, searchablePageIds } from './index'
import { prepareSearchQuery, SEARCH_PAGE_SIZE } from './normalization'
import { rankSearchDocuments } from './ranking'
import type { PublishedSearchContent, SearchAdapter, SearchLocale } from './types'

const sectionCatalogs = { fr, en, ar }

function sectionHeadings(locale: SearchLocale, pageId: keyof typeof pageSections): string {
  const titles = sectionCatalogs[locale].PageSections[pageId] as Record<string, { title: string }>
  function collect(sections: readonly SectionDefinition[]): string[] {
    return sections.flatMap((section) => [
      titles[section.id]?.title ?? '',
      ...collect(section.children ?? []),
    ])
  }
  // Section briefs are editorial placeholders and must never become search content.
  return collect(pageSections[pageId]).filter(Boolean).join(' ')
}

export { SEARCH_MIN_QUERY_LENGTH, SEARCH_MAX_QUERY_LENGTH, SEARCH_PAGE_SIZE } from './normalization'
export type { SearchAdapter, SearchItem, SearchLocale, SearchResult } from './types'

/** Live PostgreSQL corpus: publication and withdrawals take effect on the next request. */
async function loadPublishedContent(locale: SearchLocale): Promise<PublishedSearchContent> {
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@/payload.config'),
  ])
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: searchablePageIds.length,
    where: { pageId: { in: searchablePageIds } },
    select: { id: true, pageId: true, title: true, summary: true, body: true },
  })

  const news: PublishedSearchContent['news'] = []
  let page = 1
  const now = new Date().toISOString()
  // Each database read is bounded. Do not silently omit older approved articles.
  while (true) {
    const result = await payload.find({
      collection: 'news',
      locale,
      fallbackLocale: false,
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 100,
      page,
      sort: 'id',
      where: { publishedAt: { less_than_equal: now } },
      select: { id: true, title: true, summary: true, body: true, publishedAt: true },
    })
    news.push(...result.docs)
    if (!result.hasNextPage) break
    page += 1
  }
  return { pages: pages.docs, news }
}

export function createSearchAdapter(
  options: {
    loadPublishedContent?: (locale: SearchLocale) => Promise<PublishedSearchContent>
  } = {},
): SearchAdapter {
  const load = options.loadPublishedContent ?? loadPublishedContent
  return {
    async search({ query: rawQuery, locale, page: requestedPage = 1 }) {
      if (!isLocale(locale)) return { status: 'unavailable' }
      const query = prepareSearchQuery(rawQuery)
      const empty = {
        status: 'available' as const,
        items: [],
        total: 0,
        page: 1,
        pageSize: SEARCH_PAGE_SIZE,
        totalPages: 0,
      }
      if (!query.valid) return empty

      let content: PublishedSearchContent = { pages: [], news: [] }
      let contentUnavailable = false
      try {
        content = await load(locale)
      } catch {
        // Route discovery remains useful during a CMS outage. Never log private query text.
        contentUnavailable = true
      }
      const documents = buildSearchDocuments(locale, content.pages, content.news).map((document) =>
        document.type === 'page'
          ? {
              ...document,
              keywords: [document.keywords, sectionHeadings(locale, document.pageId)]
                .filter(Boolean)
                .join(' '),
            }
          : document,
      )
      const results = rankSearchDocuments(documents, query)
      const totalPages = Math.ceil(results.length / SEARCH_PAGE_SIZE)
      const page = Math.min(
        Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1),
        totalPages || 1,
      )
      return {
        status: 'available',
        items: results.slice((page - 1) * SEARCH_PAGE_SIZE, page * SEARCH_PAGE_SIZE),
        total: results.length,
        page,
        pageSize: SEARCH_PAGE_SIZE,
        totalPages,
        ...(contentUnavailable ? { contentUnavailable: true } : {}),
      }
    },
  }
}

export const searchAdapter = createSearchAdapter()
