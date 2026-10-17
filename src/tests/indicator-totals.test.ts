import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createEntry } from '@/lib/cms-preview/model'
import {
  filedPatentReferences,
  grantedPatents,
  publicModuleCount,
} from '@/lib/cms-preview/indicators'
import { resolveHomeFigures } from '@/lib/figures'
import { archiveCalls } from '@/lib/call-archives'
const mocks = vi.hoisted(() => ({
  rows: vi.fn(),
  editorial: vi.fn(),
  publications: vi.fn(),
  archives: vi.fn(),
  calls: vi.fn(),
  projects: vi.fn(),
}))
vi.mock('@/lib/cms-workspace/site-content', () => ({ siteContent: mocks.rows }))
vi.mock('@/lib/cms-workspace/editorial-indicators', () => ({
  siteEditorialIndicators: mocks.editorial,
}))
vi.mock('@/lib/cms-workspace/public-corpora', () => ({
  sitePublications: mocks.publications,
  siteArchivedCalls: mocks.archives,
}))
vi.mock('@/lib/call-count', () => ({ totalPublicCalls: mocks.calls }))
vi.mock('@/lib/project-count', () => ({ totalProjects: mocks.projects }))
import { siteIndicatorTotals } from '@/lib/cms-workspace/indicator-totals'
function record(module: string, id: string, visibility = 'public', granted = 'false') {
  const entry = createEntry(module, id, '2026-10-16')
  entry.shared = { visibility, granted }
  entry.publicVariants.fr = {
    ...entry.variants.fr,
    title: 'Source validée',
    status: 'published',
    fields: { _publishedShared: JSON.stringify(entry.shared) },
  }
  return entry
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.stubEnv('SITE_CONTENT_DATABASE_ENABLED', 'true')
  mocks.projects.mockResolvedValue(70)
  mocks.editorial.mockResolvedValue({ youngResearchers: '+1000' })
  mocks.publications.mockResolvedValue(Array.from({ length: 12 }, () => ({})))
  mocks.archives.mockResolvedValue(archiveCalls.slice(0, 2))
  mocks.calls.mockImplementation(async (references: string[]) => new Set(references).size)
})
afterEach(() => vi.unstubAllEnvs())
describe('audited public indicator sources', () => {
  it('distinguishes approved portfolio totals from public grants and ignores draft flags', () => {
    const first = record('patents', 'accepted', 'public', 'true')
    const withheld = record('patents', 'filed', 'private')
    const draft = createEntry('patents', 'draft', '2026-10-16')
    first.shared.granted = 'false'
    expect(filedPatentReferences([first, withheld, draft])).toBe(2)
    expect(grantedPatents([first, withheld, draft])).toBe(1)
    first.publicVariants.fr = undefined
    expect(grantedPatents([first, withheld, draft])).toBe(0)
  })
  it('uses approved snapshots rather than private or incomplete pending edits', () => {
    const lab = record('laboratories', 'lab')
    lab.shared.visibility = 'private'
    expect(publicModuleCount([lab], 'laboratories')).toBe(1)
    lab.publicVariants.fr!.fields._publishedShared = '{bad json'
    expect(publicModuleCount([lab], 'laboratories')).toBe(0)
  })
  it('reads changed catalogue and project variables instead of literals', async () => {
    const entries = [record('patents', 'p', 'public', 'true'), record('laboratories', 'l')]
    mocks.rows.mockResolvedValue(
      entries.map((entry) => ({ ...entry, public_variants: entry.publicVariants })),
    )
    expect(await siteIndicatorTotals()).toMatchObject({
      publications: 12,
      patents: 1,
      grantedPatents: 1,
      calls: 2,
      laboratories: 1,
      projects: 70,
    })
    mocks.publications.mockResolvedValue(Array.from({ length: 13 }, () => ({})))
    mocks.projects.mockResolvedValue(71)
    mocks.archives.mockResolvedValue(archiveCalls.slice(0, 3))
    expect(await siteIndicatorTotals()).toMatchObject({ publications: 13, projects: 71, calls: 3 })
  })
  it('keeps rounded publication notation explicit and propagates unavailable totals', () => {
    const figures = resolveHomeFigures(70, 1199, {
      patents: 59,
      laboratories: 14,
      youngResearchers: '+1000',
    })
    expect(Object.fromEntries(figures.map((figure) => [figure.id, figure.value]))).toMatchObject({
      collaborativeProjects: '70',
      publications: '+1100',
      patents: '59',
      universityLaboratories: '14',
    })
    expect(
      resolveHomeFigures(null, null, {
        patents: null,
        laboratories: null,
        youngResearchers: null,
      }).every((figure) => figure.value === '—'),
    ).toBe(true)
  })
})
