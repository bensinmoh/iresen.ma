import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/locales'
import { getSiteUrl, isIndexingEnabled, pageHref, pageIds, newsListingHref } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexingEnabled()) return []
  const baseUrl = getSiteUrl()

  return [
    ...locales.map((locale) => ({
      url: new URL(newsListingHref(locale), baseUrl).toString(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((language) => [
            language,
            new URL(newsListingHref(language), baseUrl).toString(),
          ]),
        ),
      },
    })),
    ...pageIds
      .filter((id) => id !== 'events')
      .flatMap((id) =>
        locales.map((locale) => ({
          url: new URL(pageHref(id, locale), baseUrl).toString(),
          alternates: {
            languages: Object.fromEntries(
              locales.map((language) => [
                language,
                new URL(pageHref(id, language), baseUrl).toString(),
              ]),
            ),
          },
        })),
      ),
  ]
}
