import videoMetadata from '@/data/media-videos.json'
import 'server-only'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Locale } from '@/i18n/locales'

export async function findPublicLibraryVideos(locale: Locale) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'media',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 100,
    sort: 'title',
    where: { mimeType: { in: ['video/mp4', 'video/webm'] } },
    select: {
      id: true,
      title: true,
      alt: true,
      caption: true,
      filename: true,
      url: true,
      mimeType: true,
    },
  })
  return result.docs
    .filter((doc) => doc.title && doc.url)
    .map((doc) => ({
      id: doc.id,
      title: doc.title!,
      caption: doc.caption,
      url: `/api/media/file/${encodeURIComponent(doc.filename!)}?locale=${locale}`,
      mimeType: doc.mimeType!,
      poster: videoMetadata.find((item) => item.filename === doc.filename)?.poster,
      durationSeconds: videoMetadata.find((item) => item.filename === doc.filename)
        ?.durationSeconds,
    }))
}
