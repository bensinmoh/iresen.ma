import { describe, expect, it } from 'vitest'
import {
  canEdit,
  createEntry,
  initialWorkspace,
  parseCsv,
  safeCsvCell,
  saveEntry,
  validateEntry,
} from '@/lib/cms-preview/model'

describe('isolated CMS interface workflows', () => {
  it('preserves the local published snapshot during editing and restores approval as a draft', () => {
    let workspace = initialWorkspace()
    let entry = createEntry('news', 'test', '2026-10-11T10:00:00Z')
    entry.variants.fr.title = 'Titre de test'
    entry.variants.fr.body = 'Texte de test'
    workspace = saveEntry(workspace, entry, 'fr', 'editor', '2026-10-11T10:01:00Z', 'review')
    entry = workspace.entries.find((e) => e.id === 'test')!
    expect(() =>
      saveEntry(workspace, entry, 'fr', 'editor', '2026-10-11T10:02:00Z', 'validated'),
    ).toThrow()
    workspace = saveEntry(workspace, entry, 'fr', 'publisher', '2026-10-11T10:03:00Z', 'validated')
    entry = workspace.entries.find((e) => e.id === 'test')!
    workspace = saveEntry(workspace, entry, 'fr', 'publisher', '2026-10-11T10:04:00Z', 'published')
    entry = workspace.entries.find((e) => e.id === 'test')!
    const unchangedSave = saveEntry(workspace, entry, 'fr', 'editor', '2026-10-11T10:04:30Z')
    expect(unchangedSave.entries.find((e) => e.id === 'test')?.variants.fr.status).toBe('draft')
    entry = structuredClone(workspace.entries.find((e) => e.id === 'test')!)
    entry.variants.fr.title = 'Titre modifié'
    workspace = saveEntry(workspace, entry, 'fr', 'editor', '2026-10-11T10:05:00Z')
    const result = workspace.entries.find((e) => e.id === 'test')!
    expect(result.variants.fr.status).toBe('draft')
    expect(result.publicVariants.fr?.title).toBe('Titre de test')
    expect(result.publicVariants.en).toBeUndefined()
    expect(result.history).toHaveLength(4)
    expect(workspace.logs[0].action).toBe('Brouillon enregistré')
  })
  it('requires a new review after shared field changes and keeps other-language snapshots', () => {
    const workspace = initialWorkspace()
    const entry = structuredClone(workspace.entries[0])
    entry.variants.en = { ...entry.variants.fr, status: 'published' }
    entry.publicVariants.en = { ...entry.variants.en }
    workspace.entries[0] = structuredClone(entry)
    entry.shared.theme = 'Nouvelle thématique'
    expect(() =>
      saveEntry(workspace, entry, 'fr', 'admin', '2026-10-11T10:00:00Z', 'validated'),
    ).toThrow()
    const result = saveEntry(workspace, entry, 'fr', 'editor', '2026-10-11T10:00:00Z').entries.find(
      (e) => e.id === entry.id,
    )!
    expect(result.variants.en.status).toBe('draft')
    expect(result.publicVariants.en?.status).toBe('published')
  })
  it('enforces simulated permissions even when actions are called directly', () => {
    const workspace = initialWorkspace()
    const entry = workspace.entries[0]
    expect(() => saveEntry(workspace, entry, 'fr', 'reader', '2026-10-11T10:00:00Z')).toThrow()
    expect(canEdit('publisher', 'users')).toBe(false)
    expect(canEdit('admin', 'users')).toBe(true)
    expect(() =>
      saveEntry(workspace, entry, 'ar', 'admin', '2026-10-11T10:00:00Z', 'published'),
    ).toThrow()
    expect(workspace.entries.filter((e) => e.module === 'careers')).toHaveLength(0)
  })
  it('validates external URLs and ordered dates without interpreting HTML or formulas', () => {
    const entry = createEntry('calls', 'call-test', '2026-10-11T10:00:00Z')
    entry.variants.fr.title = 'Test'
    entry.shared = { start: '2026-11-10', end: '2026-10-01', application: 'javascript:alert(1)' }
    expect(validateEntry(entry, 'fr')).toHaveLength(2)
    expect(parseCsv('reference,title,body\nR1,"Title, with comma","First\nSecond"\n')).toEqual([
      ['reference', 'title', 'body'],
      ['R1', 'Title, with comma', 'First\nSecond'],
    ])
    expect(parseCsv('reference;title\nR1;"A ""quoted"" title"')).toEqual([
      ['reference', 'title'],
      ['R1', 'A "quoted" title'],
    ])
    expect(() => parseCsv('a,b\n1,"unfinished')).toThrow()
    expect(safeCsvCell(' =SUM(A1:A3)')).toBe('"\' =SUM(A1:A3)"')
  })
})
