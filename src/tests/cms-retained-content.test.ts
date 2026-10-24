import { describe, expect, it } from 'vitest'
import publications from '@/data/publications.json'
import patents from '@/data/patents.json'
import fr from '@/messages/fr.json'
import { retainedContentEntries } from '@/lib/cms-workspace/retained-content'
import { validateEntry } from '@/lib/cms-preview/model'
import { relationErrors } from '@/lib/cms-preview/connection'
import { workspaceSchema } from '@/lib/cms-preview/schema'
const entries = retainedContentEntries('2026-10-16T20:00:00.000Z')
describe('retained CMS corpus ingestion', () => {
  it('uses stable identities and actual retained corpus sizes without fictional additions', () => {
    const count = (module: string) => entries.filter((entry) => entry.module === module).length
    expect(count('publications')).toBe(1199)
    expect(count('patents')).toBe(59)
    expect(count('laboratories')).toBe(14)
    expect(count('board')).toBe(16)
    expect(count('scientific-council')).toBe(8)
    expect(count('organigram')).toBe(17)
    expect(count('careers')).toBe(0)
    expect(count('media')).toBeGreaterThanOrEqual(189)
    expect(count('pages')).toBe(198)
    expect(count('glossary')).toBe(12)
    expect(
      entries
        .filter((entry) => entry.shared.catalogNamespace)
        .map((entry) => entry.shared.catalogNamespace)
        .sort(),
    ).toEqual(Object.keys(fr).sort())
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length)
    expect(retainedContentEntries('2027-01-01T00:00:00Z').map((entry) => entry.id)).toEqual(
      entries.map((entry) => entry.id),
    )
  })
  it('preserves original bibliographic values, missing abstracts and dated evidence', () => {
    for (const original of publications) {
      const entry = entries.find(
        (entry) => entry.module === 'publications' && entry.reference === original.id,
      )!
      expect(entry.variants.fr.title).toBe(original.title)
      expect(entry.variants.fr.body).toBe('')
      expect(entry.shared.authors).toBe(original.authors ?? '')
      expect(entry.shared.citationsAsOf).toBe(original.scopusCitationsAsOf ?? '')
      expect(JSON.parse(entry.shared.sourceRecord)).toEqual(original)
      expect(validateEntry(entry, 'fr', true)).toEqual([])
    }
  })
  it('keeps unsupported exact dates absent and source translations in review', () => {
    for (const entry of entries) {
      expect(entry.shared.visibility).toBe(entry.publicVariants.fr ? 'public' : 'private')
      for (const locale of ['en', 'ar'] as const) {
        if (
          entry.shared._sourceDataset === 'src/lib/useful-links.ts' ||
          (entry.module === 'figures' &&
            ['collaborators', 'certification'].includes(entry.reference))
        ) {
          // Exact, already-public localized links and editorial indicators.
          expect(entry.variants[locale].status).toBe('published')
          expect(entry.publicVariants[locale]?.title).toBe(entry.variants[locale].title)
        } else {
          expect(entry.variants[locale].status).toBe('review')
          expect(entry.publicVariants[locale]).toBeUndefined()
        }
      }
      if (entry.module === 'news') expect(entry.shared.publishedAt).toBeUndefined()
      if (entry.module === 'calls') expect(entry.shared.start).toBeUndefined()
      expect(validateEntry(entry, 'fr')).toEqual([])
      expect(relationErrors(entry, entries)).toEqual([])
    }
    for (const patent of patents.filter((patent) => !patent.granted))
      expect(
        entries.find((entry) => entry.module === 'patents' && entry.reference === patent.reference)
          ?.publicVariants.fr,
      ).toBeUndefined()
    expect(workspaceSchema.safeParse({ version: 1, entries, logs: [] }).success).toBe(true)
  })
})
