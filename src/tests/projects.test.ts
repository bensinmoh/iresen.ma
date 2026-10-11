import { describe, expect, it } from 'vitest'
import { demoProjects, emptyProjectFilters, filterProjects } from '@/lib/projects'
import { staticSearchDocuments } from '@/lib/search/catalog'
import { contentLocales } from '@/lib/content/publication'

describe('isolated fictional project database', () => {
  it('contains 24 distinct, explicitly fictional records with complete localized metadata', () => {
    expect(demoProjects).toHaveLength(24)
    expect(new Set(demoProjects.map((p) => p.id)).size).toBe(24)
    for (const p of demoProjects) {
      expect(p.fictional).toBe(true)
      expect(p.budgetMAD).toBeGreaterThan(0)
      for (const l of contentLocales) {
        expect(p.title[l]).toBeTruthy()
        expect(p.description[l]).toBeTruthy()
        expect(p.coordinator[l]).toBeTruthy()
      }
    }
  })
  it('combines all facets and searches acronyms, coordinators and accents', () => {
    for (const locale of contentLocales) {
      const p = demoProjects[0]
      expect(filterProjects({ ...emptyProjectFilters, query: p.acronym }, locale)).toEqual([p])
      expect(
        filterProjects({ ...emptyProjectFilters, query: p.coordinator[locale] }, locale),
      ).toContainEqual(p)
      expect(
        filterProjects(
          {
            query: p.acronym,
            domain: p.domain,
            year: String(p.year),
            status: p.status,
            programme: p.programme,
          },
          locale,
        ),
      ).toEqual([p])
      expect(
        filterProjects({ ...emptyProjectFilters, query: p.acronym, year: '2026' }, locale),
      ).toEqual([])
    }
    expect(filterProjects({ ...emptyProjectFilters, query: 'caracterisation' }, 'fr')).toHaveLength(
      1,
    )
    expect(filterProjects({ ...emptyProjectFilters, query: 'unknown-project' }, 'en')).toEqual([])
  })
  it('registers page/media references but excludes fictional project records from institutional search', () => {
    const docs = staticSearchDocuments()
    for (const locale of contentLocales) {
      expect(docs.find((d) => d.id === `page:projects:${locale}`)?.body).toContain('24')
      expect(
        docs.filter((d) => d.id.startsWith('asset:projects-') && d.locale === locale),
      ).toHaveLength(7)
      for (const p of demoProjects)
        expect(docs.some((d) => d.body.includes(p.acronym) || d.title.includes(p.acronym))).toBe(
          false,
        )
    }
  })
})
