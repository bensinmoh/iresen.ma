import { describe, expect, it } from 'vitest'
import records from '@/data/publications.json'
import metadata from '../../docs/publications-import.json'
import { staticSearchDocuments } from '@/lib/search/catalog'

describe('owner-selected publication database', () => {
  it('contains the updated 1,199 selected records with no withdrawn IDs or private fields', () => {
    expect(records).toHaveLength(1199)
    expect(new Set(records.map((r) => r.id)).size).toBe(1199)
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
      'journal',
      'quartileSourceUrl',
      'quartileEvidence',
      'historicalQuartile',
      'historicalQuartileYear',
      'historicalQuartileSourceUrl',
      'historicalQuartileEvidence',
    ].sort()
    const dois = records.flatMap((r) => (r.doiUrl ? [r.doiUrl.toLowerCase()] : []))
    expect(new Set(dois).size).toBe(dois.length)
    for (const record of records) {
      expect(Object.keys(record).sort()).toEqual(fields)
      expect(record.title.trim()).not.toBe('')
      if (record.authors !== null) expect(record.authors).not.toMatch(/\(\d+\)/)
      if (record.doiUrl) expect(new URL(record.doiUrl).origin).toBe('https://doi.org')
      if (record.scopusCitations !== null) {
        expect(Number.isInteger(record.scopusCitations)).toBe(true)
        expect(record.scopusCitations).toBeGreaterThanOrEqual(0)
        expect(['2026-10-08', '2026-10-10']).toContain(record.scopusCitationsAsOf)
      } else expect(record.scopusCitationsAsOf).toBeNull()
      if (record.quartileStatus === 'reported') {
        expect(record.quartile).toMatch(/^Q[1-4]$/)
        expect(record.quartileYear).toBe(2025)
      } else {
        expect(['unknown', 'not-applicable']).toContain(record.quartileStatus)
        expect(record.quartile).toBeNull()
        expect(record.quartileYear).toBeNull()
      }
      if (record.quartileEvidence === 'source-reported') {
        expect(record.quartile).toMatch(/^Q[1-4]$/)
        expect(new URL(record.quartileSourceUrl!).protocol).toBe('https:')
      } else expect(record.quartileSourceUrl).toBeNull()
      if (record.historicalQuartile) {
        expect(record.historicalQuartile).toMatch(/^Q[1-4]$/)
        expect(record.historicalQuartileYear).toBe(record.year)
        expect(record.historicalQuartileYear).toBeLessThanOrEqual(2025)
        expect(new URL(record.historicalQuartileSourceUrl!).protocol).toBe('https:')
        expect(['primary-source-reported', 'secondary-source-reported']).toContain(
          record.historicalQuartileEvidence,
        )
      } else {
        expect(record.historicalQuartileYear).toBeNull()
        expect(record.historicalQuartileSourceUrl).toBeNull()
      }
    }
    expect(records.filter((r) => r.scopusCitations === null)).toHaveLength(161)
    expect(records.some((r) => r.scopusCitations === 0)).toBe(true)
    expect(records.filter((r) => r.doiUrl === null)).toHaveLength(29)
    expect(records.filter((r) => r.theme === null)).toHaveLength(187)
    expect(records.filter((r) => r.authors === null)).toHaveLength(13)
    expect(records.filter((r) => r.year > 2026).map((r) => r.id)).toEqual(metadata.futureYearIds)
    expect(metadata.referencePeriod).toBe('T4 2026')
    expect(metadata.selection.excluded).toBe(184)
    expect(metadata.reconciliation.addedIds).toHaveLength(22)
    expect(metadata.reconciliation.removedIds).toHaveLength(4)
    for (const id of metadata.reconciliation.addedIds)
      expect(records.some((r) => r.id === id)).toBe(true)
    for (const id of metadata.reconciliation.removedIds)
      expect(records.some((r) => r.id === id)).toBe(false)
    expect(records.every((r) => r.year <= 2026)).toBe(true)
    expect(records.filter((r) => r.historicalQuartile)).toHaveLength(395)
    expect(records.filter((r) => r.scopusCitationsAsOf === '2026-10-10')).toHaveLength(619)
    expect(records.find((r) => r.id === 'PUB_056FC0C588DD')?.scopusCitations).toBe(89)
    expect(records.find((r) => r.id === 'PUB_056FC0C588DD')?.quartile).toBe('Q1')
  })

  it('registers retained bibliographic records in all three locales without importing workbooks', () => {
    const documents = staticSearchDocuments()
    const notices = documents.filter(
      (d) => d.type === 'publication' && d.id.startsWith('publication:'),
    )
    expect(notices).toHaveLength(records.length * 3)
    for (const locale of ['fr', 'en', 'ar']) {
      for (const record of records) {
        const notice = notices.find((d) => d.id === `publication:${record.id}:${locale}`)!
        expect(notice.title).toBe(record.title)
        expect(notice.url).toContain(`?publication=${record.id}#publication-${record.id}`)
        if (record.authors) expect(notice.body).toContain(record.authors)
      }
    }
    const publicText = documents.map((d) => `${d.id} ${d.body} ${d.url}`).join('\n')
    expect(publicText).not.toContain(metadata.sourceFilename)
    expect(publicText).not.toContain(metadata.reconciliation.sourceFilename)
    for (const id of metadata.reconciliation.removedIds) expect(publicText).not.toContain(id)
  })
})
