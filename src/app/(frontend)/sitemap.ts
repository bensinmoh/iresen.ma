import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/locales'
import { getSiteUrl, isIndexingEnabled, pageHref, pageIds } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexingEnabled()) return []
  const baseUrl = getSiteUrl()

  return pageIds.flatMap((id) =>
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
  )
}
