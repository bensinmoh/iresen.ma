import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/locales'
import { getSiteUrl, isIndexingEnabled, pageHref, type PageId } from '@/lib/site'

export async function createPageMetadata(pageId: PageId, locale: Locale): Promise<Metadata> {
  const title = await getTranslations({ locale, namespace: 'Pages' })
  const metadata = await getTranslations({ locale, namespace: 'Metadata' })
  const baseUrl = getSiteUrl()
  const canonical = new URL(pageHref(pageId, locale), baseUrl).toString()

  return {
    title: title(pageId),
    description: metadata('description'),
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          locales.map((language) => [
            language,
            new URL(pageHref(pageId, language), baseUrl).toString(),
          ]),
        ),
        'x-default': new URL(pageHref(pageId, 'fr'), baseUrl).toString(),
      },
    },
    robots: { index: pageId !== 'search' && isIndexingEnabled(), follow: isIndexingEnabled() },
  }
}
