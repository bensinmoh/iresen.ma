import 'server-only'

import { getPayload } from 'payload'

import config from '../../payload.config'
import { isNewsSlug } from './routes'
import { isContentLocale, type ContentLocale } from './publication'

/** Always use these access-controlled queries for public pages; never fetch drafts here. */
export async function findPublishedPage(pageId: string, locale: ContentLocale) {
  if (!isContentLocale(locale)) throw new Error('Unsupported content locale.')
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'pages',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1,
    where: { pageId: { equals: pageId } },
    select: {
      id: true,
      pageId: true,
      title: true,
      slug: true,
      summary: true,
      body: true,
      seo: true,
      updatedAt: true,
    },
  })
  return docs[0] ?? null
}

export async function findPublishedNews(locale: ContentLocale, limit = 12, page = 1) {
  if (!isContentLocale(locale)) throw new Error('Unsupported content locale.')
  const payload = await getPayload({ config })
  return payload.find({
    collection: 'news',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: Math.min(Math.max(limit, 1), 100),
    sort: '-publishedAt',
    page,
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      type: true,
      heroImage: true,
      publishedAt: true,
      updatedAt: true,
    },
  })
}

export async function findPublishedNewsBySlug(slug: string, locale: ContentLocale) {
  if (!isNewsSlug(slug, locale)) return null
  if (!isContentLocale(locale)) throw new Error('Unsupported content locale.')
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'news',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 2,
    where: { slug: { equals: slug } },
    select: { title: true, slug: true, summary: true, body: true, seo: true, publishedAt: true },
  })
  // A duplicated approved slug has no unambiguous public destination. Search
  // applies the same rule; editors must resolve the duplicate before discovery.
  return docs.length === 1 ? docs[0]! : null
}
