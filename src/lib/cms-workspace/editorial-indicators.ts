import { editorialIndicatorDefaults } from '@/lib/editorial-indicators'
import type { Language } from '@/lib/cms-preview/model'
import { siteContent } from './site-content'
/** Display only the validated value; editing a shared field does not publish it. */
export async function siteEditorialIndicators(locale: Language) {
  const rows = await siteContent()
  function value(reference: keyof typeof editorialIndicatorDefaults): string | null {
    const row = rows.find(
      (row) =>
        row.module === 'figures' &&
        row.reference === (reference === 'youngResearchers' ? 'young-researchers' : reference),
    )
    if (!row) return editorialIndicatorDefaults[reference]
    const variant = row.public_variants[locale]
    if (!variant || variant.status !== 'published') return null
    const shared = variant.fields._publishedShared
      ? (JSON.parse(variant.fields._publishedShared) as Record<string, string>)
      : {}
    return shared.visibility === 'public' && shared.value?.trim() ? shared.value : null
  }
  return {
    youngResearchers: value('youngResearchers'),
    collaborators: value('collaborators'),
    certification: value('certification'),
  }
}
