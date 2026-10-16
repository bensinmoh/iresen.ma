import { describe, expect, it } from 'vitest'
import {
  canonicalInstitutionNames,
  establishmentsForUniversity,
  identifyInstitutions,
  institutionalAffiliations,
  universityRegistry,
} from '../lib/institutions'

describe('sourced Moroccan university relationships', () => {
  it('keeps every establishment attached to an identified university and source', () => {
    const universities = new Set(universityRegistry.universities.map((entry) => entry.id))
    const sources = new Set(universityRegistry.sources.map((source) => source.id))
    const entries = [
      ...universityRegistry.universities,
      ...universityRegistry.establishments,
      ...universityRegistry.independentInstitutions,
    ]
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length)
    for (const entry of entries) {
      expect(entry.sourceIds.length).toBeGreaterThan(0)
      for (const source of entry.sourceIds) expect(sources.has(source)).toBe(true)
      for (const label of [entry.name, entry.arabicName].filter(Boolean)) {
        expect(canonicalInstitutionNames(label)).toBe(label)
      }
    }
    for (const entry of universityRegistry.establishments)
      expect(universities.has(entry.universityId)).toBe(true)
  })
  it.each([
    ['FSTS', 'ma-university-uh1'],
    ['FST Tanger', 'ma-university-uae'],
    ['EMI', 'ma-university-um5'],
    ['FSBM', 'ma-university-uh2c'],
    ['FSSM', 'ma-university-uca'],
    ['CNEREE', 'ma-university-uca'],
    ['FSR', 'ma-university-um5'],
    ['ENSIAS', 'ma-university-um5'],
    ['ENSA KENITRA', 'ma-university-uit'],
    ['ENSAM Meknes', 'ma-university-umi'],
    ['EST Fès', 'ma-university-usmba'],
    ['ESIN', 'ma-university-uir'],
    ['FST سطات', 'ma-university-uh1'],
  ])('resolves %s and its inverse university edge', (alias, parent) => {
    const affiliations = institutionalAffiliations(alias, 'fr')
    expect(affiliations.universities.map((identity) => identity.id)).toContain(parent)
    const children = establishmentsForUniversity(parent).map((identity) => identity.id)
    expect(affiliations.institutions.some((identity) => children.includes(identity.id))).toBe(true)
  })
  it('does not assign an ambiguous faculty acronym or an autonomous school to a university', () => {
    expect(identifyInstitutions('FST')).toEqual([])
    expect(institutionalAffiliations('INPT', 'fr').universities).toEqual([])
    expect(institutionalAffiliations('INPT', 'fr').institutions).toHaveLength(1)
    expect(institutionalAffiliations('Université Hassan 1er', 'fr').institutions).toEqual([])
  })
  it('fixes owner-reported display variants without changing their parent relationships', () => {
    expect(
      canonicalInstitutionNames(
        'Ecole Nationale Supérieure d’Arts et Métiers (École Nationale Supérieure des Arts et Métiers Rabat - ENSAM Rabat)',
      ),
    ).toBe('École Nationale Supérieure d’Arts et Métiers de Rabat - ENSAM Rabat')
    expect(canonicalInstitutionNames('MAScIR, Rabat')).toBe('MAScIR')
    expect(canonicalInstitutionNames('CNEREE - Université Cadi Ayyad - Marrakech')).toBe(
      'Centre national d’études et de recherches sur l’eau et l’énergie - CNEREE',
    )
    expect(
      canonicalInstitutionNames(
        'Faculté des sciences Semlalia - Université Cadi Ayyad - UCA, Marrakech',
      ),
    ).toBe('Faculté des Sciences Semlalia - FSSM')
  })
})
