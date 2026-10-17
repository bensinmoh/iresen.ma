import 'server-only'
import { cache } from 'react'
import { searchDatabase } from '@/lib/search/database'
import { featuredPostId } from '@/lib/news-events'
import type { Language, Variant } from '@/lib/cms-preview/model'
export const publicNewsHighlight = cache(async (locale: Language): Promise<string | null> => {
  if (process.env.SITE_CONTENT_DATABASE_ENABLED !== 'true') return `news-${featuredPostId}`
  const result = await searchDatabase().query<{
    reference: string
    source_id: string | null
    shared: Record<string, string>
    public_variants: Partial<Record<Language, Variant>>
  }>(
    `SELECT reference,source_id,shared,public_variants FROM cms_authoring_entries e WHERE module='news' AND shared->>'highlight'='true' AND NOT EXISTS(SELECT 1 FROM cms_deleted_entries d WHERE d.entry_id=e.id) LIMIT 1`,
  )
  const row = result.rows[0]
  const variant = row?.public_variants[locale]
  if (!row || !variant || variant.status !== 'published') return null
  const shared = variant.fields._publishedShared
    ? JSON.parse(variant.fields._publishedShared)
    : row.shared
  if (shared.visibility !== 'public') return null
  return row.source_id ? `cms-${row.source_id}` : `news-${row.reference}`
})
