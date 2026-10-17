import { describe, expect, it, vi } from 'vitest'
import { mediaType, mediaDefaults } from '@/lib/cms-preview/media-types'
import { createEntry, validateEntry } from '@/lib/cms-preview/model'
import { retainedContentEntries } from '@/lib/cms-workspace/retained-content'
vi.mock('@/lib/cms-workspace/site-content', () => ({ siteContent: vi.fn() }))
import { projectLibraryLinks } from '@/lib/cms-workspace/media-links'

describe('separate CMS media management', () => {
  it('keeps public gallery photos apart from site imagery and hero video assets', () => {
    const record = createEntry('media', 'test', '2026-10-17')
    record.shared = { mimeType: 'image/webp', category: 'site-assets' }
    expect(mediaType(record)).toBe('resources')
    record.shared.mimeType = 'video/mp4'
    expect(mediaType(record)).toBe('resources')
    record.shared = { mimeType: 'image/webp', usage: 'media/photos' }
    expect(mediaType(record)).toBe('photos')
    record.shared = { mimeType: 'video/mp4' }
    expect(mediaType(record)).toBe('videos')
    record.shared = { _sourceDataset: 'src/data/media-reports.json' }
    expect(mediaType(record)).toBe('reports')
    record.shared = mediaDefaults('links')
    expect(mediaType(record)).toBe('links')
  })
  it('requires a link address and description without demanding file metadata', () => {
    const record = createEntry('media', 'test', '2026-10-17')
    record.shared = {
      ...mediaDefaults('links'),
      sourceUrl: 'https://iresen.ma',
      visibility: 'public',
    }
    record.variants.fr.title = 'Lien sourcé'
    record.variants.fr.body = 'Description sourcée'
    expect(validateEntry(record, 'fr', true)).toEqual([])
    record.shared.sourceUrl = ''
    expect(validateEntry(record, 'fr', true)).toContain(
      'Adresse du lien : champ requis avant revue.',
    )
  })
  it('uses only validated locale snapshots and excludes withdrawn or unsafe destinations', () => {
    const rows = retainedContentEntries('2026-10-17')
      .filter((entry) => entry.shared.resourceKind === 'links')
      .map((entry) => ({ ...entry, public_variants: entry.publicVariants }))
    expect(projectLibraryLinks(rows, 'fr')).toHaveLength(7)
    const row = rows[0]
    const approved = row.public_variants.fr!
    row.shared.sourceUrl = 'https://unapproved.example/'
    expect(
      projectLibraryLinks(rows, 'fr').find((link) => link.id === row.reference.slice(5))?.href,
    ).not.toBe(row.shared.sourceUrl)
    delete row.public_variants.ar
    expect(projectLibraryLinks(rows, 'ar')).toHaveLength(6)
    approved.fields._publishedShared = JSON.stringify({
      visibility: 'public',
      resourceKind: 'links',
      sourceUrl: 'javascript:alert(1)',
    })
    expect(projectLibraryLinks(rows, 'fr')).toHaveLength(6)
    for (const item of rows) item.public_variants = {}
    expect(projectLibraryLinks(rows, 'fr')).toEqual([])
  })
})
