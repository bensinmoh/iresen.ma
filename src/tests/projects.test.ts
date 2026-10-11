import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import {
  projectNoteManifest,
  projectNotesMatchSource,
  projectNoteReferences,
} from '@/lib/project-notes'
import { GET as downloadNote } from '@/app/(frontend)/api/projects/[id]/note/route'
import { describe, expect, it } from 'vitest'
import { demoProjects, emptyProjectFilters, filterProjects } from '@/lib/projects'
import { staticSearchDocuments } from '@/lib/search/catalog'
import { filterProjectRecords } from '@/lib/projects-model'
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
        expect(p.details.presentation[l]).toHaveLength(2)
        expect(p.details.objectives[l].length).toBeGreaterThanOrEqual(3)
        expect(p.details.consortium[l].length).toBeGreaterThanOrEqual(3)
        expect(p.details.coordinator.email).toBe('contact@iresen.ma')
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
  it('filters the frontend projection without needing private provenance or placeholder coordinators', () => {
    const records = demoProjects.map((p) => ({
      id: p.id,
      acronym: p.acronym,
      title: p.title,
      description: p.description,
      domain: p.domain,
      status: p.status,
      programme: p.programme,
      year: p.year,
      durationMonths: p.durationMonths,
      budgetMAD: p.budgetMAD,
      image: p.image,
      details: p.details,
    }))
    for (const locale of contentLocales) {
      expect(
        filterProjectRecords(
          records,
          { ...emptyProjectFilters, query: records[4].acronym },
          locale,
        ),
      ).toEqual([records[4]])
      expect(
        filterProjectRecords(records, { ...emptyProjectFilters, domain: 'hydrogen' }, locale),
      ).toHaveLength(3)
      expect(
        filterProjectRecords(
          records,
          { ...emptyProjectFilters, query: records[4].acronym, status: 'active' },
          locale,
        ),
      ).toHaveLength(0)
    }
  })
  it('keeps localized notes current, complete and excluded from institutional search', () => {
    expect(projectNotesMatchSource).toBe(true)
    expect(projectNoteReferences).toHaveLength(72)
    for (const reference of projectNoteReferences) {
      expect(reference.searchEligible).toBe(false)
      expect(reference.url).toContain(`locale=${reference.locale}`)
      const entry =
        projectNoteManifest.files[
          `${reference.projectId}:${reference.locale}` as keyof typeof projectNoteManifest.files
        ]
      const bytes = readFileSync(`src/data/project-notes/${entry.filename}`)
      expect(bytes.subarray(0, 5).toString()).toBe('%PDF-')
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(entry.sha256)
    }
    expect(staticSearchDocuments().some((doc) => doc.id.includes('project-note:'))).toBe(false)
  })
  it('serves the requested localized note as an attachment and rejects unknown records/locales', async () => {
    const response = await downloadNote(
      new Request('http://localhost/api/projects/demo-001/note?locale=ar'),
      { params: Promise.resolve({ id: 'demo-001' }) },
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('application/pdf')
    expect(response.headers.get('content-disposition')).toContain('SOL-THERM-ar.pdf')
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(
      (
        await downloadNote(new Request('http://localhost/api/projects/demo-001/note?locale=es'), {
          params: Promise.resolve({ id: 'demo-001' }),
        })
      ).status,
    ).toBe(404)
    expect(
      (
        await downloadNote(new Request('http://localhost/api/projects/unknown/note?locale=fr'), {
          params: Promise.resolve({ id: 'unknown' }),
        })
      ).status,
    ).toBe(404)
  })
  it('registers page/media references but excludes fictional project records from institutional search', () => {
    const docs = staticSearchDocuments()
    for (const locale of contentLocales) {
      expect(docs.find((d) => d.id === `page:projects:${locale}`)?.body).not.toMatch(
        /ficti|fiction|خيالي/iu,
      )
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
