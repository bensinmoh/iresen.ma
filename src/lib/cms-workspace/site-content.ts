// Shared Node server / Payload CLI projection. The native pg dependency keeps this outside client bundles.
import { cache } from 'react'
import { searchDatabase } from '@/lib/search/database'
import type { Language, Variant } from '@/lib/cms-preview/model'

type SiteRecord = {
  id: string
  module: string
  reference: string
  shared: Record<string, string>
  public_variants: Partial<Record<Language, Variant>>
}
/** An explicit, public-only projection. Never select revisions, notes, accounts or applicants. */
export const siteContent = cache(async (): Promise<SiteRecord[]> => {
  if (process.env.SITE_CONTENT_DATABASE_ENABLED !== 'true') return []
  const result = await searchDatabase().query<SiteRecord>(
    `SELECT id,module,reference,shared,CASE WHEN EXISTS (SELECT 1 FROM cms_deleted_entries d WHERE d.entry_id=cms_authoring_entries.id) THEN '{}'::jsonb ELSE public_variants END AS public_variants FROM cms_authoring_entries
     WHERE shared->>'_sourceDataset' <> '' OR module='media' ORDER BY id`,
  )
  return result.rows
})
export function sameContentShape(original: unknown, proposed: unknown): boolean {
  if (typeof original === 'string') return typeof proposed === 'string'
  if (Array.isArray(original))
    return (
      Array.isArray(proposed) &&
      original.length === proposed.length &&
      original.every((value, index) => sameContentShape(value, proposed[index]))
    )
  if (original && typeof original === 'object') {
    if (!proposed || typeof proposed !== 'object' || Array.isArray(proposed)) return false
    const keys = Object.keys(original)
    return (
      keys.length === Object.keys(proposed).length &&
      keys.every(
        (key) =>
          Object.hasOwn(proposed, key) &&
          sameContentShape(
            (original as Record<string, unknown>)[key],
            (proposed as Record<string, unknown>)[key],
          ),
      )
    )
  }
  return original === proposed
}
/** Reuse delivered translations as the baseline; this does not approve working locales. */
export async function siteMessages<T extends Record<string, unknown>>(
  locale: Language,
  fallback: T,
): Promise<T> {
  const rows = await siteContent()
  if (!rows.length) return fallback
  const messages = structuredClone(fallback)
  for (const row of rows.filter((row) => row.shared.catalogNamespace)) {
    const namespace = row.shared.catalogNamespace
    if (!Object.hasOwn(messages, namespace)) continue
    const baseline = JSON.parse(row.shared.sourceRecord)[locale]
    const published = row.public_variants[locale]
    const eligible =
      published?.status === 'published' &&
      (!published.fields._publishedShared ||
        JSON.parse(published.fields._publishedShared).visibility !== 'private')
    const value =
      eligible && published.fields.structuredContent
        ? JSON.parse(published.fields.structuredContent)
        : baseline
    if (sameContentShape(messages[namespace], value))
      (messages as Record<string, unknown>)[namespace] = value
  }
  // Named records retain their own workflow and take precedence over the broader text blocks.
  const set = (path: string[], value: unknown) => {
    let parent: Record<string, unknown> = messages
    for (const key of path.slice(0, -1)) {
      if (!parent[key] || typeof parent[key] !== 'object') return
      parent = parent[key] as Record<string, unknown>
    }
    if (Object.hasOwn(parent, path.at(-1)!)) parent[path.at(-1)!] = value
  }
  for (const row of rows) {
    const variant = row.public_variants[locale]
    if (
      !variant ||
      variant.status !== 'published' ||
      (variant.fields._publishedShared &&
        JSON.parse(variant.fields._publishedShared).visibility === 'private')
    )
      continue
    const key = row.reference
    switch (row.module) {
      case 'faq': {
        const id = key.replace(/^contact-/, '')
        set(['Contact', 'faq', 'questions', id, 'question'], variant.title)
        set(['Contact', 'faq', 'questions', id, 'answer'], variant.body)
        break
      }
      case 'news':
        set(['NewsEvents', 'newsTitles', key], variant.title)
        set(['NewsEvents', 'summaries', key], variant.body)
        break
      case 'events': {
        set(['NewsEvents', 'events', key, 'name'], variant.title)
        const [description, ...detail] = variant.body.split('\n\n')
        set(['NewsEvents', 'events', key, 'description'], description)
        set(['NewsEvents', 'events', key, 'detail'], detail.join('\n\n'))
        set(['NewsEvents', 'events', key, 'place'], variant.fields.place ?? '')
        set(['NewsEvents', 'events', key, 'meta'], variant.fields.dateLabel ?? '')
        break
      }
      case 'platforms':
        set(['Platforms', 'platforms', key, 'name'], variant.title)
        set(['Platforms', 'platforms', key, 'paragraphs'], variant.body.split('\n\n'))
        set(['Platforms', 'platforms', key, 'location'], variant.fields.location ?? '')
        break
      case 'laboratories':
        set(['Network', 'labs', key, 'title'], variant.title)
        for (const field of ['institution', 'city'])
          set(['Network', 'labs', key, field], variant.fields[field] ?? '')
        break
      case 'board':
        set(['Governance', 'board', key], variant.title)
        break
      case 'scientific-council':
        set(['Governance', 'scientists', key, 'name'], variant.title)
        set(['Governance', 'scientists', key, 'role'], variant.fields.professionalRole ?? '')
        set(['Governance', 'scientists', key, 'country'], variant.fields.country ?? '')
        break
      case 'organigram':
        if (key.startsWith('pole-')) {
          const index = key.split('-')[1]
          set(['Governance', 'organisation', 'poles', index, 'title'], variant.title)
          set(['Governance', 'organisation', 'poles', index, 'tagline'], variant.body)
        } else if (key.startsWith('department-')) {
          const [, pole, department] = key.split('-')
          set(
            ['Governance', 'organisation', 'poles', pole, 'directions', department, 'title'],
            variant.title,
          )
          set(
            ['Governance', 'organisation', 'poles', pole, 'directions', department, 'description'],
            variant.body,
          )
        } else if (row.shared.recordType === 'person') {
          set(['Governance', 'team', key, 'name'], variant.title)
          set(['Governance', 'team', key, 'role'], variant.fields.function ?? '')
          set(['Governance', 'team', key, 'biography'], variant.body)
        }
        break
      case 'themes':
        set(['Transfer', 'themes', key], variant.title)
        break
      case 'pages':
        if (!row.shared.catalogNamespace) {
          set(['PageSections', row.shared.pageId, row.shared.sectionId, 'title'], variant.title)
          set(
            ['PageSections', row.shared.pageId, row.shared.sectionId, 'description'],
            variant.body,
          )
        }
        break
    }
  }
  const sections = messages.PageSections as
    { home?: { figures?: { description: string } } } | undefined
  const hero = messages.Hero as { figures?: Record<string, string> } | undefined
  if (sections?.home?.figures && hero?.figures) {
    const [{ siteIndicatorTotals }, { resolveHomeFigures }] = await Promise.all([
      import('./indicator-totals'),
      import('@/lib/figures'),
    ])
    const totals = await siteIndicatorTotals(locale)
    sections.home.figures.description = resolveHomeFigures(
      totals.projects,
      totals.publications,
      totals,
    )
      .map(({ id, value }) => `${value} ${hero.figures![id]?.replace(/\s+/g, ' ') ?? id}`)
      .join(' · ')
  }
  return messages
}
