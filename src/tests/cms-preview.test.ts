import { fixtureWorkspace } from './fixtures/cms-workspace'
import { describe, expect, it } from 'vitest'
import {
  canEdit,
  canTransition,
  modules,
  migrateGovernance,
  roleLabels,
  statusLabels,
  createEntry,
  parseCsv,
  safeCsvCell,
  saveEntry,
  validateEntry,
} from '@/lib/cms-preview/model'
import { connectionRecord } from '@/lib/cms-preview/connection'

describe('isolated CMS interface workflows', () => {
  it('preserves the local published snapshot during editing and restores approval as a draft', () => {
    let workspace = fixtureWorkspace()
    let entry = createEntry('news', 'test', '2026-10-11T10:00:00Z')
    entry.variants.fr.title = 'Titre de test'
    entry.variants.fr.body = 'Texte de test'
    entry.shared = { publishedAt: '2026-10-16', type: 'news' }
    workspace = saveEntry(workspace, entry, 'fr', 'editor', '2026-10-11T10:01:00Z', 'review')
    entry = workspace.entries.find((e) => e.id === 'test')!
    expect(() =>
      saveEntry(workspace, entry, 'fr', 'editor', '2026-10-11T10:02:00Z', 'published'),
    ).toThrow()
    entry = workspace.entries.find((e) => e.id === 'test')!
    workspace = saveEntry(workspace, entry, 'fr', 'admin', '2026-10-11T10:04:00Z', 'published')
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
    expect(result.history).toHaveLength(3)
    expect(workspace.logs[0].action).toBe('Brouillon enregistré')
  })
  it('requires a new review after shared field changes and keeps other-language snapshots', () => {
    const workspace = fixtureWorkspace()
    const entry = structuredClone(workspace.entries[0])
    entry.variants.en = { ...entry.variants.fr, status: 'published' }
    entry.publicVariants.en = { ...entry.variants.en }
    workspace.entries[0] = structuredClone(entry)
    entry.variants.fr.status = 'draft'
    workspace.entries[0].variants.fr.status = 'draft'
    entry.shared.sourceUrl = 'https://example.org/source'
    expect(() =>
      saveEntry(workspace, entry, 'fr', 'admin', '2026-10-11T10:00:00Z', 'published'),
    ).toThrow()
    const result = saveEntry(workspace, entry, 'fr', 'admin', '2026-10-11T10:00:00Z').entries.find(
      (e) => e.id === entry.id,
    )!
    expect(result.variants.en.status).toBe('draft')
    expect(result.publicVariants.en?.status).toBe('published')
  })
  it('enforces simulated permissions even when actions are called directly', () => {
    const workspace = fixtureWorkspace()
    const entry = workspace.entries[0]
    expect(() => saveEntry(workspace, entry, 'fr', 'editor', '2026-10-11T10:00:00Z')).toThrow()
    expect(canEdit('editor', 'users')).toBe(false)
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
  it('exposes exactly two roles, three states and a typed contract for every module', () => {
    expect(Object.keys(roleLabels)).toEqual(['admin', 'editor'])
    expect(Object.keys(statusLabels)).toEqual(['draft', 'review', 'published'])
    for (const definition of modules) {
      expect(definition.storage).toBeTruthy()
      expect(definition.columns?.length).toBeGreaterThan(0)
      expect(new Set(definition.fields.map((field) => field.key)).size).toBe(
        definition.fields.length,
      )
      for (const field of definition.fields.filter((field) => field.type === 'relation'))
        expect(modules.some((target) => target.id === field.relationTo)).toBe(true)
    }
  })
  it('requires an administrator and a reason for rejection, then permits resubmission', () => {
    let workspace = fixtureWorkspace()
    const entry = structuredClone(workspace.entries[0])
    expect(canTransition('editor', 'review', 'draft')).toBe(false)
    expect(() =>
      saveEntry(workspace, entry, 'fr', 'admin', '2026-10-16T10:00:00Z', 'draft'),
    ).toThrow('motif')
    entry.comment = 'Préciser la source et la date.'
    workspace = saveEntry(workspace, entry, 'fr', 'admin', '2026-10-16T10:00:00Z', 'draft')
    const returned = structuredClone(workspace.entries.find((item) => item.id === entry.id)!)
    expect(returned.history[0].note).toContain('Préciser')
    returned.shared = { type: 'news', publishedAt: '2026-10-16' }
    workspace = saveEntry(workspace, returned, 'fr', 'editor', '2026-10-16T10:01:00Z', 'review')
    expect(workspace.entries.find((item) => item.id === entry.id)?.variants.fr.status).toBe(
      'review',
    )
  })
  it('checks business fields and serializes numbers and localized fields without a database', () => {
    const entry = createEntry('projects', 'contract-test', '2026-10-16T10:00:00Z')
    entry.variants.fr.title = 'Projet local'
    entry.variants.fr.body = 'Description locale'
    expect(validateEntry(entry, 'fr', true).some((error) => error.includes('Consortium'))).toBe(
      true,
    )
    entry.shared = { budgetMAD: '250', launchYear: '2026' }
    entry.variants.fr.fields = { location: 'Lieu de test', consortium: 'Consortium local' }
    const record = connectionRecord(entry)
    expect(record.shared.budgetMAD).toBe(250)
    expect(record.locales.fr.fields.location).toBe('Lieu de test')
    expect(record.locales.ar.fields.location).toBeNull()
    entry.shared.budgetMAD = '-1'
    expect(validateEntry(entry, 'fr').some((error) => error.includes('hors limites'))).toBe(true)
    entry.shared.callId = 'missing-local-id'
    expect(() =>
      saveEntry(fixtureWorkspace(), entry, 'fr', 'editor', '2026-10-16T10:00:00Z'),
    ).toThrow('référence locale')
  })
  it('uses the commissioned governance modules and keeps withdrawn records out of navigation', () => {
    expect(modules.map((definition) => definition.id)).toEqual(
      expect.arrayContaining(['organigram', 'board', 'scientific-council', 'calls']),
    )
    expect(
      modules.some((definition) =>
        ['organisations', 'people', 'programmes'].includes(definition.id),
      ),
    ).toBe(false)
    const previous = createEntry('people', 'previous-person', '2026-10-16T10:00:00Z')
    previous.variants.fr.title = 'Exemple local'
    const migrated = migrateGovernance({ version: 1, entries: [previous], logs: [] })
    expect(migrated.entries[0].module).toBe('organigram')
    expect(migrated.entries[0].shared.recordType).toBe('person')
    expect(migrated.entries[0].variants.fr.title).toBe('Exemple local')
  })
  it('validates organigram units without requiring a person’s function and prevents hierarchy cycles', () => {
    const workspace = fixtureWorkspace()
    const pole = createEntry('organigram', 'pole-local', '2026-10-16T10:00:00Z')
    pole.shared.recordType = 'pole'
    pole.variants.fr.title = 'Pôle local'
    pole.variants.fr.body = 'Présentation locale'
    expect(validateEntry(pole, 'fr', true)).toEqual([])
    workspace.entries.push(pole)
    const department = createEntry('organigram', 'department-local', '2026-10-16T10:00:00Z')
    department.shared = { recordType: 'department', parentId: pole.id }
    department.variants.fr.title = 'Département local'
    workspace.entries.push(department)
    const changedPole = structuredClone(pole)
    changedPole.shared.parentId = department.id
    expect(() => saveEntry(workspace, changedPole, 'fr', 'admin', '2026-10-16T10:00:00Z')).toThrow(
      'boucle',
    )
    const person = createEntry('organigram', 'person-local', '2026-10-16T10:00:00Z')
    person.variants.fr.title = 'Personne locale'
    person.variants.fr.body = 'Biographie locale'
    expect(validateEntry(person, 'fr', true)).toContain(
      'Fonction confirmée : champ requis avant revue.',
    )
    changedPole.shared.parentId = person.id
    workspace.entries.push(person)
    expect(() => saveEntry(workspace, changedPole, 'fr', 'admin', '2026-10-16T10:00:00Z')).toThrow(
      'référence locale',
    )
  })
})
