import 'server-only'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Locale } from '@/i18n/locales'
import { findPublishedNews, findPublishedNewsBySlug } from './queries'
import { newsHref } from './routes'

export type PublicNewsCard = {
  id: string
  title: string
  summary: string
  href: string
  date?: string
  image?: { src: string; alt: string }
  source: 'cms'
}
export async function findPublicNewsCards(locale: Locale, page = 1) {
  const result = await findPublishedNews(locale, 12, page)
  const payload = await getPayload({ config })
  const cards = await Promise.all(
    result.docs.map(async (article): Promise<PublicNewsCard | null> => {
      if (
        !article.slug ||
        !article.title ||
        !article.summary ||
        !(await findPublishedNewsBySlug(article.slug, locale))
      )
        return null
      let image: PublicNewsCard['image']
      if (typeof article.heroImage === 'number') {
        const { docs } = await payload.find({
          collection: 'media',
          locale,
          fallbackLocale: false,
          overrideAccess: false,
          draft: false,
          depth: 0,
          limit: 1,
          where: { id: { equals: article.heroImage } },
          select: { url: true, alt: true, mimeType: true },
        })
        const media = docs[0]
        if (
          media?.url &&
          media.alt &&
          media.mimeType?.startsWith('image/') &&
          media.url.startsWith('/api/media/file/')
        )
          image = { src: media.url, alt: media.alt }
      }
      return {
        id: `cms-${article.id}`,
        title: article.title,
        summary: article.summary,
        href: newsHref(article.slug, locale),
        date: article.publishedAt ?? undefined,
        image,
        source: 'cms',
      }
    }),
  )
  return {
    cards: cards.filter((card): card is PublicNewsCard => card !== null),
    next: result.hasNextPage,
    previous: result.hasPrevPage,
  }
}
