import ar from '@/messages/ar.json'
import en from '@/messages/en.json'
import fr from '@/messages/fr.json'
import { footerPageIds, pageHref, pageIds, type PageId } from '@/lib/site'

import type {
  PublishedSearchNews,
  PublishedSearchPage,
  SearchDocument,
  SearchLocale,
} from './types'

const catalogs = { fr, en, ar }
const utilityPageIds = new Set<PageId>(['search', ...footerPageIds])
export const searchablePageIds = pageIds.filter((pageId) => !utilityPageIds.has(pageId))
const searchablePages = new Set<PageId>(searchablePageIds)

/** Read text nodes only, never editor attributes, links or embedded document metadata. */
export function richTextToSearchText(body: unknown): string {
  let visited = 0
  function read(value: unknown, depth = 0, isRoot = false): string {
    if (!value || typeof value !== 'object' || depth > 32 || visited++ > 10_000) return ''
    const node = value as { type?: unknown; text?: unknown; root?: unknown; children?: unknown }
    if (node.root) return read(node.root, depth + 1, true)
    if (node.type === 'text' && typeof node.text === 'string') return node.text
    if (node.type === 'linebreak') return '\n'
    if (node.type === 'tab') return ' '
    const supported = [
      'root',
      'paragraph',
      'heading',
      'quote',
      'list',
      'listitem',
      'link',
      'autolink',
      'table',
      'tablerow',
      'tablecell',
    ]
    if (!isRoot && !supported.includes(String(node.type))) return ''
    if (!Array.isArray(node.children)) return ''
    const text = node.children.map((child) => read(child, depth + 1)).join('')
    return ['paragraph', 'heading', 'quote', 'listitem', 'tablecell'].includes(String(node.type))
      ? `${text}\n`
      : text
  }
  return read(body).replace(/\s+/gu, ' ').trim()
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** Input CMS records must come from an anonymous, access-enforced localized query. */
export function buildSearchDocuments(
  locale: SearchLocale,
  publishedPages: PublishedSearchPage[] = [],
  publishedNews: PublishedSearchNews[] = [],
): SearchDocument[] {
  const catalog = catalogs[locale]
  const descriptions: Partial<Record<PageId, string>> = catalog.Header.pages
  const documents = new Map<string, SearchDocument>()

  for (const pageId of searchablePageIds) {
    documents.set(pageId, {
      id: `page:${pageId}`,
      pageId,
      type: 'page',
      locale,
      title: catalog.Pages[pageId],
      url: pageHref(pageId, locale),
      summary: catalog.Hero.descriptions[pageId],
      body: '',
      keywords: [
        descriptions[pageId],
        pageId === 'home' ? catalog.Hero.homeTitle : '',
        pageId === 'institute' ? Object.values(catalog.Institute).join(' ') : '',
      ]
        .filter(Boolean)
        .join(' '),
    })
  }

  for (const page of publishedPages) {
    const pageId = page.pageId as PageId
    if (!searchablePages.has(pageId)) continue
    const baseline = documents.get(pageId)!
    const title = text(page.title)
    const summary = text(page.summary)
    const body = richTextToSearchText(page.body)
    // Partially completed translations must not contribute hidden or fallback content.
    if (!title || !summary || !body) continue
    documents.set(pageId, {
      ...baseline,
      title,
      summary,
      body,
      keywords: [baseline.title, baseline.summary, baseline.keywords].filter(Boolean).join(' '),
    })
  }

  for (const article of publishedNews) {
    const id = String(article.id)
    const title = text(article.title)
    const summary = text(article.summary)
    const body = richTextToSearchText(article.body)
    const publishedAt = text(article.publishedAt)
    const timestamp = Date.parse(publishedAt)
    if (
      !/^[1-9]\d*$/u.test(id) ||
      !Number.isSafeInteger(Number(id)) ||
      !title ||
      !summary ||
      !body ||
      !Number.isFinite(timestamp) ||
      timestamp > Date.now()
    )
      continue
    documents.set(`news:${id}`, {
      id: `news:${id}`,
      pageId: 'news',
      type: 'news',
      locale,
      title,
      summary,
      body,
      publishedAt,
      url: `${pageHref('news', locale)}?article=${id}#news-${id}`,
    })
  }

  return [...documents.values()]
}
