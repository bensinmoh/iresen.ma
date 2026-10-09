export const searchTypes = ['page', 'section', 'news', 'document', 'media'] as const
export type SearchType = (typeof searchTypes)[number]
export type SearchLocale = 'fr' | 'en' | 'ar'
export type SearchSort = 'relevance' | 'newest'
export type SearchItem = {
  id: string
  title: string
  url: string
  type: SearchType
  excerpt: string
  locale: SearchLocale
  publishedAt?: string
}
export type SearchInput = {
  query: string
  locale: SearchLocale
  page?: number
  type?: SearchType | 'all'
  sort?: SearchSort
}
export type SearchResult =
  | {
      status: 'available'
      query: string
      items: SearchItem[]
      total: number
      page: number
      pageSize: number
      totalPages: number
      sort: SearchSort
      facets: Record<SearchType, number>
    }
  | { status: 'unavailable' }

export interface SearchAdapter {
  search(input: SearchInput): Promise<SearchResult>
}

/** Explicit public registration. Derivatives share their original's entry. */
export type PublicSearchDocument = {
  id: string
  locale: SearchLocale
  title: string
  body: string
  url: string
  type: SearchType
  publishedAt?: string
}
