import { describe, expect, it } from 'vitest'
import records from '@/data/publications.json'
import metadata from '../../docs/publications-import.json'
import { staticSearchDocuments } from '@/lib/search/catalog'

describe('staged owner-selected publication database', () => {
  it('contains only the 1,181 selected bibliographic records and public field allowlist', () => {
    expect(records).toHaveLength(1181)
    expect(new Set(records.map((r) => r.id)).size).toBe(1181)
    const fields = [
      'id',
      'doiUrl',
      'year',
      'title',
      'authors',
      'theme',
      'type',
      'quartile',
      'quartileStatus',
      'quartileYear',
      'scopusCitations',
      'scopusCitationsAsOf',
    ].sort()
    const dois = records.flatMap((r) => (r.doiUrl ? [r.doiUrl.toLowerCase()] : []))
    expect(new Set(dois).size).toBe(dois.length)
    for (const record of records) {
      expect(Object.keys(record).sort()).toEqual(fields)
      expect(record.title.trim()).not.toBe('')
      expect(record.authors).not.toMatch(/\(\d+\)/)
      if (record.doiUrl) expect(new URL(record.doiUrl).origin).toBe('https://doi.org')
      if (record.scopusCitations !== null) {
        expect(Number.isInteger(record.scopusCitations)).toBe(true)
        expect(record.scopusCitations).toBeGreaterThanOrEqual(0)
        expect(record.scopusCitationsAsOf).toBe('2026-10-08')
      } else expect(record.scopusCitationsAsOf).toBeNull()
      if (record.quartileStatus === 'reported') {
        expect(record.quartile).toMatch(/^Q[1-4]$/)
        expect(record.quartileYear).toBe(2025)
      } else {
        expect(['unknown', 'not-applicable']).toContain(record.quartileStatus)
        expect(record.quartile).toBeNull()
        expect(record.quartileYear).toBeNull()
      }
    }
    expect(records.filter((r) => r.scopusCitations === null)).toHaveLength(141)
    expect(records.some((r) => r.scopusCitations === 0)).toBe(true)
    expect(records.filter((r) => r.doiUrl === null)).toHaveLength(18)
    expect(records.filter((r) => r.theme === null)).toHaveLength(175)
    expect(records.filter((r) => r.year > 2026).map((r) => r.id)).toEqual(metadata.futureYearIds)
    expect(metadata.referencePeriod).toBe('T4 2026')
    expect(metadata.selection.excluded).toBe(202)
  })

  it('keeps staged records out of every public locale search projection', () => {
    expect(metadata.publicationStatus).toBe('staged-not-public')
    const documents = staticSearchDocuments()
    const publicText = documents.map((d) => `${d.id} ${d.body} ${d.url}`).join('\n')
    for (const record of records) expect(publicText).not.toContain(record.id)
    expect(publicText).not.toContain(metadata.sourceFilename)
    for (const record of records.slice(0, 10)) expect(publicText).not.toContain(record.title)
  })
})
