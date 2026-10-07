export type SearchLocale = 'fr' | 'en' | 'ar'
export type SearchItem = { id: string; title: string; url: string }
export type SearchResult =
  { status: 'available'; items: SearchItem[]; total: number } | { status: 'unavailable' }

export interface SearchAdapter {
  search(input: { query: string; locale: SearchLocale; page: number }): Promise<SearchResult>
}

// The real PostgreSQL index and Arabic normalization belong to the search milestone.
export const searchAdapter: SearchAdapter = {
  async search() {
    return { status: 'unavailable' }
  },
}
