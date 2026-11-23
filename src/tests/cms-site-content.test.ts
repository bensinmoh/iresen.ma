vi.mock('@/lib/project-count', () => ({ totalProjects: async () => 70 }))
vi.mock('@/lib/call-count', () => ({
  totalPublicCalls: async (references: string[]) => new Set(references).size,
}))
import { afterEach, describe, expect, it, vi } from 'vitest'
import fr from '@/messages/fr.json'
import { retainedContentEntries } from '@/lib/cms-workspace/retained-content'
import { initialWorkspace } from '@/lib/cms-preview/model'
const database = vi.hoisted(() => ({ query: vi.fn() }))
vi.mock('@/lib/search/database', () => ({ searchDatabase: () => database }))
import { sameContentShape, siteMessages } from '@/lib/cms-workspace/site-content'
import {
  sitePublications,
  sitePatents,
  siteMedia,
  siteArchivedCalls,
} from '@/lib/cms-workspace/public-corpora'
const records = retainedContentEntries('2026-10-16T20:00:00Z')
const rows = () =>
  records.map((entry) => ({
    ...structuredClone(entry),
    public_variants: structuredClone(entry.publicVariants),
  }))
afterEach(() => {
  vi.unstubAllEnvs()
  database.query.mockReset()
})
describe('common site database projections', () => {
  it('starts without runtime fiction', () => {
    expect(initialWorkspace()).toEqual({ version: 1, entries: [], logs: [] })
  })
  it('rejects structural changes and preserves complete nested copy', () => {
    expect(sameContentShape({ sections: ['a', 'b'] }, { sections: ['new a', 'new b'] })).toBe(true)
    expect(sameContentShape({ sections: ['a', 'b'] }, { sections: ['a'] })).toBe(false)
    expect(sameContentShape({ title: 'a' }, { title: { html: 'a' } })).toBe(false)
    expect(sameContentShape({ title: 'a' }, { title: 'a', unapproved: 'x' })).toBe(false)
  })
  it('withdraws a patent from the granted catalogue when the approved grant flag becomes unknown', async () => {
    vi.stubEnv('SITE_CONTENT_DATABASE_ENABLED', 'true')
    const data = rows()
    const patent = data.find(
      (row) => row.module === 'patents' && JSON.parse(row.shared.sourceRecord).granted,
    )!
    patent.public_variants.fr!.fields._publishedShared = JSON.stringify({
      visibility: 'public',
      granted: '',
    })
    database.query.mockResolvedValue({ rows: data })
    expect((await sitePatents()).some((record) => record.reference === patent.reference)).toBe(
      false,
    )
  })
  it('renders approved snapshots while retaining draft text and shared metadata privately', async () => {
    vi.stubEnv('SITE_CONTENT_DATABASE_ENABLED', 'true')
    const data = rows()
    const publication = data.find((row) => row.module === 'publications')!
    const original = JSON.parse(publication.shared.sourceRecord)
    publication.shared.authors = 'Unapproved draft author'
    publication.variants.fr.title = 'Unapproved draft title'
    publication.variants.fr.status = 'draft'
    database.query.mockResolvedValue({ rows: data })
    const publicRecords = await sitePublications()
    expect(publicRecords.find((value) => value.id === original.id)?.title).toBe(original.title)
    expect(publicRecords.find((value) => value.id === original.id)?.authors).toBe(original.authors)
    expect(database.query.mock.calls[0][0]).not.toMatch(/cms_applications|users|comment|revisions/)
  })
  it('excludes a resource whose validated snapshot is explicitly private', async () => {
    vi.stubEnv('SITE_CONTENT_DATABASE_ENABLED', 'true')
    const data = rows()
    const publication = data.find((row) => row.module === 'publications')!
    const original = JSON.parse(publication.shared.sourceRecord)
    publication.shared.visibility = 'public'
    publication.public_variants.fr!.fields._publishedShared = JSON.stringify({
      visibility: 'private',
    })
    database.query.mockResolvedValue({ rows: data })
    expect((await sitePublications()).some((value) => value.id === original.id)).toBe(false)
  })
  it('uses the current council when older CMS snapshots still include superseded profiles', async () => {
    vi.stubEnv('SITE_CONTENT_DATABASE_ENABLED', 'true')
    const data = rows()
    const oldMember = data.find((row) => row.id === 'retained-scientific-council-miranda')!
    delete oldMember.shared._scientificCouncilRevision
    oldMember.public_variants.fr!.title = 'Dr. Vlademiro MIRANDA'
    oldMember.public_variants.fr!.fields.country = 'Brésil'
    const currentMember = data.find((row) => row.id === 'retained-scientific-council-lambert')!
    currentMember.public_variants.fr!.fields.professionalRole = 'Fonction approuvée pour Genvia'

    const section = data.find((row) => row.id === 'retained-pages-governance-scientific-council')!
    delete section.shared._scientificCouncilRevision
    section.public_variants.fr!.body = 'Membres du conseil : Abdelhakim ARTIBA'
    const governance = data.find((row) => row.id === 'retained-pages-catalog-Governance')!
    const copy = JSON.parse(governance.public_variants.fr!.fields.structuredContent)
    copy.introduction = 'Introduction approuvée'
    copy.scientists.artiba = { name: 'Abdelhakim ARTIBA', role: '', country: 'France' }
    governance.public_variants.fr!.fields.structuredContent = JSON.stringify(copy)

    database.query.mockResolvedValue({ rows: data })
    const messages = await siteMessages('fr', fr)
    expect(messages.Governance.introduction).toBe('Introduction approuvée')
    expect(messages.Governance.scientists).not.toHaveProperty('artiba')
    expect(messages.Governance.scientists.miranda).toEqual(fr.Governance.scientists.miranda)
    expect(messages.Governance.scientists.lambert.role).toBe('Fonction approuvée pour Genvia')
    expect(fr.Governance.scientists.lambert.role).toContain('Ancienne directrice')
    expect(messages.PageSections.governance['scientific-council'].description).not.toContain(
      'ARTIBA',
    )
  })
  it('uses delivered catalogue baselines without approving EN/AR and keeps media order', async () => {
    vi.stubEnv('SITE_CONTENT_DATABASE_ENABLED', 'true')
    database.query.mockResolvedValue({ rows: rows() })
    const messages = await siteMessages('fr', fr)
    expect(messages.Institute).toEqual(fr.Institute)
    expect(messages.Contact.faq).toEqual(fr.Contact.faq)
    const media = await siteMedia()
    expect(media.reports.map((value) => value.id)).toEqual(
      Array.from({ length: 10 }, (_, index) => `strategy-${index + 1}`),
    )
    expect(media.photos[0].id).toBe('portrait-dg-iresen-samir-rachidi')
    expect((await siteArchivedCalls()).length).toBe(21)
    expect(
      records
        .filter(
          (entry) =>
            entry.shared._sourceDataset !== 'src/lib/useful-links.ts' &&
            !(
              entry.module === 'figures' &&
              ['collaborators', 'certification'].includes(entry.reference)
            ),
        )
        .every((entry) => !entry.publicVariants.en && !entry.publicVariants.ar),
    ).toBe(true)
  })
})
