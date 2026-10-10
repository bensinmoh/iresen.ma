import { describe, expect, it } from 'vitest'
import { isNewsListingPath, newsListingHref, pageHref, pageLinkHref } from '@/lib/site'
import { isNewsSlug, newsSlugFromPath } from '@/lib/content/routes'
import { staticSearchDocuments } from '@/lib/search/catalog'

describe('combined news/events destinations', () => {
  for (const locale of ['fr', 'en', 'ar'] as const) {
    it(`${locale}: keeps listing segments out of CMS article routes and index destinations`, () => {
      const listing = newsListingHref(locale).slice(locale.length + 1)
      expect(isNewsListingPath(listing, locale)).toBe(true)
      expect(newsSlugFromPath(listing, locale)).toBeNull()
      expect(isNewsSlug(listing.split('/').at(-1), locale)).toBe(false)
      expect(isNewsSlug('list', locale)).toBe(false)
      expect(isNewsSlug('research-update', locale)).toBe(true)
      expect(pageLinkHref('events', locale)).toBe(pageHref('news', locale, 'events'))
      expect(pageLinkHref('news', locale)).toBe(pageHref('news', locale, 'news'))
      const docs = staticSearchDocuments().filter((doc) => doc.locale === locale)
      expect(docs.find((doc) => doc.id === `page:news-listing:${locale}`)?.url).toBe(
        newsListingHref(locale),
      )
      expect(docs.find((doc) => doc.id === `section:news:event-cop31:${locale}`)?.body).toContain(
        'MENALINKS',
      )
      expect(docs.some((doc) => doc.id === `page:events:${locale}`)).toBe(false)
      expect(docs.filter((doc) => doc.id.startsWith('section:news:linkedin:'))).toHaveLength(5)
    })
  }
})
