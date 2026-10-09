import type { Locale } from '@/i18n/locales'
import type { PageId } from '@/lib/site'

export type SearchLocale = Locale
export type SearchContentType = 'page' | 'news'

export type SearchItem = {
  id: string
  pageId: PageId
  title: string
  url: string
  excerpt: string
  type: SearchContentType
  locale: SearchLocale
  publishedAt?: string
}

/** Private, transient search projection; never returned in full to a client. */
export type SearchDocument = Omit<SearchItem, 'excerpt'> & {
  summary: string
  body: string
  keywords?: string
}

export type SearchResult =
  | {
      status: 'available'
      items: SearchItem[]
      total: number
      page: number
      pageSize: number
      totalPages: number
      contentUnavailable?: boolean
    }
  | { status: 'unavailable' }

export type SearchInput = { query: string; locale: SearchLocale; page?: number }

export interface SearchAdapter {
  search(input: SearchInput): Promise<SearchResult>
}

export type PublishedSearchPage = {
  id: number | string
  pageId: string
  title?: string | null
  summary?: string | null
  body?: unknown
}

export type PublishedSearchNews = {
  id: number | string
  title?: string | null
  summary?: string | null
  body?: unknown
  publishedAt?: string | null
}

export type PublishedSearchContent = {
  pages: PublishedSearchPage[]
  news: PublishedSearchNews[]
}
