import { institutionalAffiliations } from '../lib/institutions'
import { describe, expect, it } from 'vitest'
import { canonicalNames } from '../lib/names'
import institutions from '../data/institution-names.json' with { type: 'json' }

describe('editorial identities', () => {
  it('keeps canonical institutions stable across repeated processing', () => {
    for (const institution of institutions) {
      for (const alias of [institution.name, ...institution.aliases]) {
        expect(canonicalNames(alias)).toBe(institution.name)
        expect(canonicalNames(canonicalNames(alias))).toBe(institution.name)
      }
      if (institution.arabicName)
        expect(canonicalNames(institution.arabicName)).toBe(institution.arabicName)
    }
  })
  it('preserves compound surnames and the curated given-name order', () => {
    expect(canonicalNames('Sebari Imane, Hamid EL OMARI, Samir Rachidi')).toBe(
      'Imane SEBARI, Hamid EL OMARI, Samir RACHIDI',
    )
  })
  it('connects faculty discovery to its parent without changing the label', () => {
    expect(canonicalNames('FST Settat')).toBe('Faculté des Sciences et Techniques de Settat - FSTS')
    expect(institutionalAffiliations('FST Settat', 'fr').searchText).toContain(
      'Université Hassan 1er - UH1',
    )
    expect(institutionalAffiliations('FST سطات', 'ar').searchText).toContain('جامعة الحسن الأول')
    expect(institutionalAffiliations('FST Tanger', 'fr').searchText).toContain(
      'Université Abdelmalek Essaâdi - UAE',
    )
  })
  it('places the CNESTEN acronym after a dash', () => {
    expect(
      canonicalNames(
        'Centre National de l’Energie des Sciences et Techniques de l’Energie Nucléaires (CNESTEN)',
      ),
    ).toBe('Centre National de l’Énergie, des Sciences et des Techniques Nucléaires - CNESTEN')
  })
  it('uses the owner-corrected location', () => {
    expect(canonicalNames('Région Tahala- Agadir -')).toBe('Tahala')
    expect(canonicalNames('Ville de Marrakech')).toBe('Marrakech')
    expect(canonicalNames('City of Marrakech')).toBe('Marrakech')
    expect(canonicalNames('مدينة مراكش')).toBe('مراكش')
    expect(canonicalNames('Dans la ville de Marrakech.')).toBe('Dans la ville de Marrakech.')
  })
  it('uses the foundation name without repeating its city', () => {
    expect(canonicalNames('MAScIR, Rabat')).toBe('MAScIR')
    expect(canonicalNames('MASCIR')).toBe('MAScIR')
  })
  it('expands platform names while preserving the filed invention acronym', () => {
    expect(canonicalNames('GEP')).toBe('Green Energy Park')
    expect(canonicalNames('Green Energy Park Benguerir')).toBe('Green Energy Park')
    expect(canonicalNames('GEP Benguerir')).toBe('Green Energy Park')
    expect(canonicalNames('GEP-PVSMS')).toBe('GEP-PVSMS')
  })
})
