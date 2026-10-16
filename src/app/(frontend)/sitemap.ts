import { archiveCalls } from '@/lib/call-archives'
import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/locales'
import { getSiteUrl, isIndexingEnabled, pageHref, pageIds, newsListingHref } from '@/lib/site'
import { findPublishedCalls } from '@/lib/content/call-queries'
import { callHref, callsListingHref } from '@/lib/calls'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexingEnabled()) return []
  const baseUrl = getSiteUrl()
  const calls = await Promise.all(
    locales.map(async (locale) =>
      (await findPublishedCalls(locale)).map((call) => ({
        url: new URL(callHref(call.reference, locale), baseUrl).toString(),
        lastModified: new Date(call.updatedAt),
      })),
    ),
  )

  return [
    ...locales.flatMap((locale) =>
      [
        callsListingHref(locale),
        ...archiveCalls.map((call) => callHref(call.reference, locale)),
      ].map((path) => ({ url: new URL(path, baseUrl).toString() })),
    ),
    ...calls.flat(),
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
      .filter((id) => id !== 'events' && id !== 'usefulLinks')
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
