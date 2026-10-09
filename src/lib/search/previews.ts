import 'server-only'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { publicAssetReferences } from './catalog'
import type { SearchItem, SearchLocale } from './types'
import { hasControlCharacters } from './text'

export type SearchPreview = {
  kind: 'image' | 'video' | 'audio' | 'pdf' | 'file' | 'news'
  url?: string
  format?: string
}

function filePreview(url: string, mime: string): SearchPreview {
  if (mime.startsWith('image/')) return { kind: 'image', url }
  if (mime.startsWith('video/')) return { kind: 'video', url }
  if (mime.startsWith('audio/')) return { kind: 'audio', url }
  if (mime === 'application/pdf') return { kind: 'pdf', url, format: 'PDF' }
  const formats: Record<string, string> = {
    'text/plain': 'TXT',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  }
  return { kind: 'file', url, format: formats[mime] }
}

/** Results-only enrichment: bounded public queries; never use the image cache for CMS bytes. */
export async function searchResultPreviews(items: SearchItem[], locale: SearchLocale) {
  const previews: Record<string, SearchPreview> = {}
  const eligible = items.filter((item) => item.locale === locale).slice(0, 12)
  const mediaIds: number[] = []
  const newsIds: number[] = []
  for (const item of eligible) {
    if (!['media', 'document', 'news'].includes(item.type)) continue
    if (item.type === 'news') previews[item.id] = { kind: 'news' }
    const asset = publicAssetReferences.find(
      (asset) => asset.url === item.url && asset.text[locale],
    )
    if (asset) {
      const extension = asset.url.split('.').at(-1)?.toLowerCase()
      const mime =
        extension === 'mp4'
          ? 'video/mp4'
          : extension === 'pdf'
            ? 'application/pdf'
            : ['svg', 'webp', 'jpg', 'jpeg', 'png', 'avif'].includes(extension || '')
              ? `image/${extension}`
              : ''
      previews[item.id] = filePreview(asset.url, mime)
    }
    const match = /^(media|news):(\d+):(?:fr|en|ar)$/.exec(item.id)
    if (match) (match[1] === 'media' ? mediaIds : newsIds).push(Number(match[2]))
  }
  if (!mediaIds.length && !newsIds.length) return previews
  try {
    const payload = await getPayload({ config })
    const news = newsIds.length
      ? await payload.find({
          collection: 'news',
          locale,
          fallbackLocale: false,
          overrideAccess: false,
          draft: false,
          depth: 0,
          limit: 12,
          where: { id: { in: newsIds } },
          select: { heroImage: true },
        })
      : { docs: [] }
    const imageIds = news.docs.flatMap((doc) =>
      typeof doc.heroImage === 'number' ? [doc.heroImage] : [],
    )
    const ids = [...new Set([...mediaIds, ...imageIds])]
    const media = ids.length
      ? await payload.find({
          collection: 'media',
          locale,
          fallbackLocale: false,
          overrideAccess: false,
          draft: false,
          depth: 0,
          limit: 24,
          where: { id: { in: ids } },
          select: { filename: true, mimeType: true },
        })
      : { docs: [] }
    const files = new Map(
      media.docs.flatMap((doc) => {
        if (!doc.filename || /[\\/]/.test(doc.filename) || hasControlCharacters(doc.filename))
          return []
        return [
          [
            doc.id,
            filePreview(
              `/api/media/file/${encodeURIComponent(doc.filename)}?locale=${locale}`,
              doc.mimeType || '',
            ),
          ] as const,
        ]
      }),
    )
    for (const id of mediaIds) {
      const preview = files.get(id)
      if (preview) previews[`media:${id}:${locale}`] = preview
    }
    for (const doc of news.docs) {
      const preview = typeof doc.heroImage === 'number' ? files.get(doc.heroImage) : undefined
      if (preview?.kind === 'image') previews[`news:${doc.id}:${locale}`] = preview
    }
  } catch {
    // A missing optional preview must not make otherwise available results disappear.
  }
  return previews
}
