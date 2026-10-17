import { usefulLinks } from '@/lib/useful-links'
import { siteContent } from './site-content'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'
import type { Language } from '@/lib/cms-preview/model'
const catalogs = { fr, en, ar }
export type LibraryLink = { id: string; href: string; title: string; description: string }
const safeUrl = (value: string) => {
  try {
    return ['https:', 'http:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}
export function projectLibraryLinks(
  rows: Awaited<ReturnType<typeof siteContent>>,
  locale: Language,
): LibraryLink[] {
  const links = rows.filter(
    (row) =>
      row.module === 'media' &&
      (row.shared.resourceKind === 'links' ||
        row.shared._sourceDataset === 'src/lib/useful-links.ts' ||
        Object.values(row.public_variants).some((variant) => {
          try {
            return JSON.parse(variant?.fields._publishedShared || '{}').resourceKind === 'links'
          } catch {
            return false
          }
        })),
  )
  if (!links.length)
    return usefulLinks.map((link, index) => ({
      ...link,
      title: catalogs[locale].UsefulLinks.items[index].title,
      description: catalogs[locale].UsefulLinks.items[index].description,
    }))
  return links
    .flatMap((row) => {
      const variant = row.public_variants[locale]
      if (!variant || variant.status !== 'published' || !variant.title.trim()) return []
      let shared: Record<string, string>
      try {
        shared = JSON.parse(variant.fields._publishedShared || '{}')
      } catch {
        return []
      }
      if (
        shared.visibility !== 'public' ||
        shared.resourceKind !== 'links' ||
        !safeUrl(shared.sourceUrl || '')
      )
        return []
      return [
        {
          id: row.reference.startsWith('link-') ? row.reference.slice(5) : row.id,
          href: shared.sourceUrl,
          title: variant.title,
          description: variant.body,
        },
      ]
    })
    .sort((a, b) => {
      const ids: readonly string[] = usefulLinks.map((link) => link.id)
      const rank = (id: string) => (ids.includes(id) ? ids.indexOf(id) : ids.length)
      return rank(a.id) - rank(b.id) || a.title.localeCompare(b.title, locale)
    })
}
export async function siteLibraryLinks(locale: Language) {
  return projectLibraryLinks(await siteContent(), locale)
}
