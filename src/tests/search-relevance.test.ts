import { describe, expect, it } from 'vitest'

import { recognizedConceptTerms, relatedSearchPhrases } from '@/lib/search/concepts'
import { normalizeSearchText } from '@/lib/search/text'
import type { SearchLocale } from '@/lib/search/types'
import {
  editDistance,
  publicVocabularyTerms,
  selectSpellingCandidate,
  type SpellingCandidate,
} from '@/lib/search/vocabulary'

function candidate(surface: string, frequency = 1): SpellingCandidate {
  return { term: normalizeSearchText(surface), surface, frequency }
}

describe('public search spelling', () => {
  it.each([
    ['reserach', 'research'],
    ['soliares', 'solaires'],
    ['الاولويتا', 'الاولويات'],
  ])('counts an adjacent transposition in %s as one edit', (input, expected) => {
    expect(editDistance(input, expected)).toBe(1)
    expect(selectSpellingCandidate(input, [candidate(expected)])?.term).toBe(expected)
  })

  it('bounds edit distance for unrelated, excessively long and short inputs', () => {
    expect(editDistance('research', 'photovoltaics')).toBe(3)
    expect(editDistance('solar', 'soul', 1)).toBe(2)
    expect(editDistance('a'.repeat(49), 'a'.repeat(49))).toBe(3)
    expect(editDistance('', 'a', 1)).toBe(1)
    expect(editDistance('same', 'same')).toBe(0)
  })

  it.each([
    ['Résulats', 'Résultats'],
    ['Insrastructure', 'Infrastructure'],
    ['photovoltacs', 'photovoltaics'],
  ])('chooses an unambiguous public word for %s', (input, expected) => {
    const publicWord = candidate(expected)
    expect(selectSpellingCandidate(input, [publicWord])).toEqual(publicWord)
  })

  it('does not replace a valid word, deliberate prefix or linguistic inflection', () => {
    expect(selectSpellingCandidate('color', [candidate('color'), candidate('colon', 100)])).toBe(
      undefined,
    )
    expect(selectSpellingCandidate('infrastr', [candidate('infrastructure')])).toBe(undefined)
    expect(
      selectSpellingCandidate('researchers', [{ ...candidate('researcher'), linguistic: true }]),
    ).toBe(undefined)
  })

  it.each(['PV', 'pv', 'RDI', 'IRESEN', 'CMS', 'lab', 'job', '1234', 'pv2026'])(
    'preserves short words, acronyms and identifiers: %s',
    (input) => {
      expect(
        selectSpellingCandidate(input, [
          candidate('iresin'),
          candidate('camps'),
          candidate('love'),
        ]),
      ).toBe(undefined)
    },
  )

  it('rejects competing corrections even when one word is much more frequent', () => {
    expect(selectSpellingCandidate('solor', [candidate('solar', 100), candidate('color')])).toBe(
      undefined,
    )
    expect(selectSpellingCandidate('gardens', [candidate('photovoltaics', 1000)])).toBe(undefined)
    expect(selectSpellingCandidate('iresin', [candidate('IRESEN', 1000)])).toBe(undefined)
  })

  it('keeps original public surfaces while normalizing and deduplicating vocabulary', () => {
    const words = publicVocabularyTerms('Énergie PV 2026', 'energie الأَوْلَوِيَات الأولويات')
    expect(words).toContainEqual({ term: 'energie', surface: 'Énergie' })
    expect(words).toContainEqual({ term: 'الاولويات', surface: 'الأَوْلَوِيَات' })
    expect(words.filter(({ term }) => term === 'energie')).toHaveLength(1)
    expect(words.filter(({ term }) => term === 'الاولويات')).toHaveLength(1)
    expect(words.some(({ term }) => /\d/u.test(term) || term === 'pv')).toBe(false)
  })
})

describe('explicit related search concepts', () => {
  it.each([
    ['fr', 'qz8472 panneaux solaires certification', ['panneaux', 'solaires']],
    ['en', 'qz8472 jobs certification', ['jobs']],
    ['ar', 'qz8472 الألواح الشمسية certification', ['الالواح', 'الشمسية']],
  ] as const)(
    '%s: protects exact curated topic words from spelling replacement',
    (locale, query, expected) => {
      expect(recognizedConceptTerms(query, locale)).toEqual(expected)
      expect(recognizedConceptTerms('Insrastructure platfrm spv', locale)).toEqual([])
    },
  )

  it.each([
    ['fr', 'Plateformes', 'infrastructure'],
    ['en', 'platforms', 'infrastructure'],
    ['ar', 'المنصات', 'البنية التحتية'],
    ['fr', 'PV', 'solaire photovoltaique'],
    ['en', 'PV', 'solar photovoltaics'],
    ['ar', 'PV', 'الطاقة الشمسية'],
    ['fr', 'panneaux solaires', 'photovoltaique'],
    ['en', 'solar panels', 'photovoltaic'],
    ['ar', 'الألواح الشمسية', 'كهروضويية'],
    ['fr', 'emplois', 'carrieres'],
    ['en', 'jobs', 'careers'],
    ['ar', 'وظائف', 'مسار مهني'],
    ['fr', 'tests', 'experimentation'],
    ['en', 'tests', 'experimentation'],
    ['ar', 'اختبارات', 'تجريب'],
  ] as const)('%s: relates %s to an explicit public topic', (locale, query, expected) => {
    expect(relatedSearchPhrases(query, locale)).toContain(normalizeSearchText(expected))
  })

  it.each(['fr', 'en', 'ar'] as const)(
    '%s: infrastructure and solar queries preserve unmatched constraints',
    (locale) => {
      const topic = locale === 'ar' ? 'البنية التحتية' : 'infrastructure'
      const query = `qz8472 ${topic} 2026`
      const related = relatedSearchPhrases(query, locale)
      expect(related.length).toBeGreaterThan(0)
      expect(related.length).toBeLessThanOrEqual(8)
      expect(new Set(related).size).toBe(related.length)
      expect(
        related.every((phrase) => phrase.startsWith('qz8472 ') && phrase.endsWith(' 2026')),
      ).toBe(true)
    },
  )

  it('combines related topics while preserving unmatched constraints', () => {
    const related = relatedSearchPhrases('solar battery certification', 'en')
    expect(
      related.some((phrase) => phrase.includes('photovoltaic') && phrase.includes('storage')),
    ).toBe(true)
    expect(related.every((phrase) => phrase.endsWith(' certification'))).toBe(true)
    expect(related).not.toContain('photovoltaic')
    expect(related).not.toContain('storage')
    expect(related.length).toBeLessThanOrEqual(8)
  })

  it('uses the complete longest phrase when topics overlap', () => {
    const facilities = relatedSearchPhrases('test facilities', 'en')
    expect(facilities).toContain('infrastructure')
    expect(facilities.some((phrase) => phrase.endsWith(' facilities'))).toBe(false)
    const careers = relatedSearchPhrases('employment opportunities', 'en')
    expect(careers).toContain('careers')
    expect(careers.some((phrase) => phrase.startsWith('employment '))).toBe(false)
  })

  it.each(['IRESEN', 'spv', 'solarized', 'insrastructure', 'accounting gardens', ''])(
    'does not invent a topic or fuzzy concept expansion for %s',
    (query) => {
      for (const locale of ['fr', 'en', 'ar'] satisfies SearchLocale[]) {
        expect(relatedSearchPhrases(query, locale)).toEqual([])
      }
    },
  )
})
