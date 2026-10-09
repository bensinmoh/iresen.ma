import 'server-only'

import { getPayload } from 'payload'

import config from '../../payload.config'
import { isContentLocale, type ContentLocale } from './publication'
import { pageHref, pageIds, type PageId } from '../site'
import type { News, Page } from '../../payload-types'

/** Always use these access-controlled queries for public pages; never fetch drafts here. */
export async function findPublishedPage(
  pageId: string,
  locale: ContentLocale,
): Promise<Page | null> {
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

export async function findPublishedNews(locale: ContentLocale, limit = 12) {
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
    where: { publishedAt: { less_than_equal: new Date().toISOString() } },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      type: true,
      publishedAt: true,
      updatedAt: true,
    },
  })
}

/** A selected article stays on the canonical news route, independent of listing position. */
export async function findPublishedNewsArticle(
  id: string,
  locale: ContentLocale,
): Promise<News | null> {
  if (!isContentLocale(locale)) throw new Error('Unsupported content locale.')
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) return null
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'news',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1,
    where: {
      and: [
        { id: { equals: Number(id) } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
      ],
    },
    select: {
      id: true,
      title: true,
      summary: true,
      body: true,
      publishedAt: true,
    },
  })
  return docs[0] ?? null
}

/** Never derive a public rich-text link from an unchecked embedded related document. */
export async function findPublishedLinkTargets(
  references: { pages: number[]; news: number[] },
  locale: ContentLocale,
): Promise<Record<string, string>> {
  if (!isContentLocale(locale)) throw new Error('Unsupported content locale.')
  if (!references.pages.length && !references.news.length) return {}
  const payload = await getPayload({ config })
  const targets: Record<string, string> = {}
  for (const collection of ['pages', 'news'] as const) {
    const ids = [...new Set(references[collection])].filter(
      (id) => Number.isSafeInteger(id) && id > 0,
    )
    for (let offset = 0; offset < ids.length; offset += 100) {
      const batch = ids.slice(offset, offset + 100)
      const result = await payload.find({
        collection,
        locale,
        fallbackLocale: false,
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: batch.length,
        where:
          collection === 'news'
            ? {
                and: [
                  { id: { in: batch } },
                  { publishedAt: { less_than_equal: new Date().toISOString() } },
                ],
              }
            : { id: { in: batch } },
        select: collection === 'pages' ? { id: true, pageId: true } : { id: true },
      })
      for (const doc of result.docs) {
        if (collection === 'news') {
          targets[`news:${doc.id}`] = `${pageHref('news', locale)}?article=${doc.id}#news-${doc.id}`
        } else if ('pageId' in doc && pageIds.includes(doc.pageId as PageId)) {
          targets[`pages:${doc.id}`] = pageHref(doc.pageId as PageId, locale)
        }
      }
    }
  }
  return targets
}
