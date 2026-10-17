import type { PublicSearchDocument } from '@/lib/search/types'
import { siteLibraryLinks } from './media-links'
import { pageHref } from '@/lib/site'
import { languages } from '@/lib/cms-preview/model'
import { siteIndicatorTotals } from './indicator-totals'
import { siteEditorialIndicators } from './editorial-indicators'
// Shared Node server / Payload CLI projection. The native pg dependency keeps this outside client bundles.
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'
import { siteMessages } from './site-content'
import { sitePublications, sitePatents, siteMedia, siteArchivedCalls } from './public-corpora'
import { staticSearchDocuments } from '@/lib/search/catalog'

/** Existing stable search references, rebuilt from the same approved DB projections as rendering. */
export async function siteSearchDocuments() {
  const [
    messagesFr,
    messagesEn,
    messagesAr,
    publications,
    patents,
    media,
    archives,
    indicatorsFr,
    indicatorsEn,
    indicatorsAr,
  ] = await Promise.all([
    siteMessages('fr', fr),
    siteMessages('en', en),
    siteMessages('ar', ar),
    sitePublications(),
    sitePatents(),
    siteMedia(),
    siteArchivedCalls(),
    siteEditorialIndicators('fr'),
    siteEditorialIndicators('en'),
    siteEditorialIndicators('ar'),
  ])
  const documents = staticSearchDocuments(
    { fr: messagesFr, en: messagesEn, ar: messagesAr },
    { publications, patents, reports: media.reports, archives },
    { fr: indicatorsFr, en: indicatorsEn, ar: indicatorsAr },
    await siteIndicatorTotals(),
  )
  const linkDocuments: PublicSearchDocument[] = (
    await Promise.all(
      languages.map(async (locale) =>
        (await siteLibraryLinks(locale)).map((link) => {
          const id = `section:library:link-${link.id}:${locale}`
          const original = documents.find((document) => document.id === id)
          const originalCopy = { fr: messagesFr, en: messagesEn, ar: messagesAr }[
            locale
          ].UsefulLinks.items.find((item) => item.id === link.id)
          const aliases =
            original && originalCopy
              ? original.body.slice(originalCopy.description.length).trim()
              : ''
          return {
            id: `section:library:link-${link.id}:${locale}`,
            locale,
            title: link.title,
            body: [link.description, aliases].filter(Boolean).join(' '),
            url: `${pageHref('media', locale)}#link-${encodeURIComponent(link.id)}`,
            type: 'section' as const,
          }
        }),
      ),
    )
  ).flat()
  return [
    ...linkDocuments,
    ...documents.flatMap((document) => {
      if (document.id.startsWith('section:library:link-')) return []
      const originalPhoto = document.id.startsWith('asset:library-photo-')
      if (!originalPhoto) return [document]
      const photo = media.photos.find((photo) => photo.src === document.url)
      return photo
        ? [
            {
              ...document,
              title: photo.title[document.locale],
              body: document.body.replaceAll(document.title, photo.title[document.locale]),
            },
          ]
        : []
    }),
  ]
}
