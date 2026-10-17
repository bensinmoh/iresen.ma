import { beforeEach, describe, expect, it, vi } from 'vitest'
import { retainedContentEntries } from '@/lib/cms-workspace/retained-content'
const mock = vi.hoisted(() => ({ content: vi.fn() }))
vi.mock('@/lib/cms-workspace/site-content', () => ({ siteContent: mock.content }))
import { siteEditorialIndicators } from '@/lib/cms-workspace/editorial-indicators'
beforeEach(() => vi.resetAllMocks())
function fixture() {
  const entries = retainedContentEntries('2026-10-16').filter(
    (entry) =>
      entry.module === 'figures' && ['collaborators', 'certification'].includes(entry.reference),
  )
  const rows = entries.map((entry) => ({ ...entry, public_variants: entry.publicVariants }))
  mock.content.mockResolvedValue(rows)
  return rows
}
describe('editable site editorial indicators', () => {
  it('retains the exact supplied values and approved existing labels in all locales', async () => {
    fixture()
    for (const locale of ['fr', 'en', 'ar'] as const)
      expect(await siteEditorialIndicators(locale)).toEqual({
        youngResearchers: '+1000',
        collaborators: '+120',
        certification: 'ISO 9001:2015',
      })
  })
  it('does not leak a draft value while a validated snapshot exists', async () => {
    const rows = fixture()
    rows.find((row) => row.reference === 'certification')!.shared.value = 'ISO TEST:2'
    expect((await siteEditorialIndicators('fr')).certification).toBe('ISO 9001:2015')
  })
  it('uses the next version once its shared snapshot has been validated', async () => {
    const rows = fixture()
    rows.find(
      (row) => row.reference === 'certification',
    )!.public_variants.fr!.fields._publishedShared = JSON.stringify({
      visibility: 'public',
      value: 'ISO TEST:2',
    })
    expect((await siteEditorialIndicators('fr')).certification).toBe('ISO TEST:2')
    expect((await siteEditorialIndicators('en')).certification).toBe('ISO 9001:2015')
  })
  it('excludes withdrawn, private or unapproved locale values instead of restoring the default', async () => {
    const rows = fixture()
    rows[0].public_variants.fr = undefined
    rows[1].public_variants.fr!.fields._publishedShared = JSON.stringify({
      visibility: 'private',
      value: '+120',
    })
    expect(await siteEditorialIndicators('fr')).toEqual({
      youngResearchers: '+1000',
      collaborators: null,
      certification: null,
    })
  })
})
