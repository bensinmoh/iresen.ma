import { describe, it, expect } from 'vitest'
import { patents, patentThemes, filterPatents, patentContactHref, findPatent } from '@/lib/patents'
import { staticSearchDocuments } from '@/lib/search/catalog'
import { pageHref } from '@/lib/site'
import { contentLocales } from '@/lib/content/publication'

describe('owner-selected patent catalogue', () => {
  it('retains exactly 59 unique filings with only permitted fields and no excluded references', () => {
    expect(patents).toHaveLength(59)
    expect(new Set(patents.map((p) => p.reference)).size).toBe(59)
    for (const id of ['34695', '35299', '20150313', '20150464'])
      expect(findPatent(id)).toBeUndefined()
    for (const p of patents) {
      expect(Object.keys(p).sort()).toEqual(
        [
          'reference',
          'title',
          'description',
          'themes',
          'depositor',
          'filingYear',
          ...(p.filingDate ? ['filingDate'] : []),
          'registerUrl',
        ].sort(),
      )
      const url = new URL(p.registerUrl)
      expect(url.origin).toBe('https://patentregister.ompic.ma')
      expect(url.searchParams.get('numDepot')).toBe(p.reference)
      for (const locale of contentLocales) expect(p.title[locale].trim()).not.toBe('')
      expect(p.depositor?.trim()).toBeTruthy()
      for (const locale of contentLocales) expect(p.description[locale].trim()).not.toBe('')
      expect(p.themes.length).toBeGreaterThan(0)
      expect(p.themes.every((theme) => patentThemes.includes(theme))).toBe(true)
    }
    expect(findPatent('37172')?.filingYear).toBe(2014)
    expect(findPatent('37172')?.filingDate).toBe('2014-07-01')
    expect(patents.filter((p) => p.filingDate)).toHaveLength(12)
    for (const p of patents.filter((p) => p.filingDate)) {
      expect(p.filingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(new Date(p.filingDate!).toISOString().slice(0, 10)).toBe(p.filingDate)
      expect(p.filingYear).toBe(Number(p.filingDate!.slice(0, 4)))
    }
    expect(findPatent('71194')?.filingYear).toBeNull()
    expect(findPatent('53044')?.filingYear).toBe(2021)
  })
  it('uses sentence-case titles while preserving scientific names and acronyms', () => {
    expect(findPatent('41528')?.title.fr).toBe(
      "Procédé et système pour le nettoyage des panneaux photovoltaïques avec un système de collecte, de traitement, de stockage et de recyclage de l'eau",
    )
    expect(findPatent('41925')?.title.fr).toBe('Smart fiche prise (PV/hybrid/grid)')
    expect(findPatent('53044')?.title.fr).toContain('V2X')
    expect(findPatent('56600')?.title.fr).toMatch(/^GEP-PVSMS : système/)
    expect(findPatent('71194')?.title.fr).toMatch(/^Intel.PV : système/)
    expect(findPatent('58719')?.title.fr).toContain('(doum) BrickDOUM')
    expect(findPatent('51690')?.title.fr).toContain('Fresnel')
    expect(findPatent('40800')?.title.fr).toContain('Chamaerops humilis L.')
    expect(findPatent('72762')?.title.fr).toContain('PV/BIPV')
  })
  it('combines accent-insensitive search, theme, year and individual co-applicant filters', () => {
    expect(
      filterPatents('53044', 'mobility', '2021', 'IRESEN', 'fr').map((p) => p.reference),
    ).toEqual(['53044'])
    expect(filterPatents('electrodes', 'storage', '', '', 'fr').map((p) => p.reference)).toEqual([
      '56609',
    ])
    expect(filterPatents('', 'mobility', '2024', 'IRESEN', 'fr').map((p) => p.reference)).toEqual([
      '68028',
    ])
    expect(filterPatents('', '', 'unknown', '', 'fr')).toHaveLength(9)
    expect(filterPatents('not-a-patent', '', '', '', 'en')).toEqual([])
    expect(filterPatents('الهيدروجين', '', '', '', 'ar').length).toBeGreaterThan(0)
    expect(filterPatents('', '', '', '', 'fr')).toHaveLength(59)
    expect(findPatent(['53044'])).toBeUndefined()
    expect(patentContactHref('ar', '53044')).toContain(
      'subject=partnerships&patent=53044#send-request',
    )
  })
  it('searches localized titles and preserves the French source', () => {
    for (const p of patents) {
      for (const locale of contentLocales) {
        expect(filterPatents(p.title[locale], '', '', '', locale)).toContain(p)
      }
      expect(p.title.en).not.toBe(p.title.fr)
      expect(p.title.ar).toMatch(/[\u0600-\u06ff]/)
    }
    for (const locale of contentLocales) {
      expect(findPatent('53044')?.title[locale]).toContain('V2X')
      expect(findPatent('72762')?.title[locale]).toContain('PV/BIPV')
    }
  })
  it('registers the supplied iSmart product and localized example destinations', () => {
    const documents = staticSearchDocuments()
    for (const locale of contentLocales) {
      const example = documents.find(
        (record) => record.id === `section:transfer:ismart-example:${locale}`,
      )
      expect(example?.url).toBe(pageHref('transfer', locale, 'ismart-example'))
      expect(example?.body).toContain('iSmart')
      expect(
        documents.some(
          (record) =>
            record.locale === locale && record.url === '/images/transfer/ismart-product.webp',
        ),
      ).toBe(true)
    }
  })
  it('projects every record to reachable localized anchors and removes withdrawn records', () => {
    const documents = staticSearchDocuments()
    for (const locale of contentLocales) {
      const records = documents.filter(
        (p) => p.id.startsWith('section:transfer:patent-') && p.locale === locale,
      )
      expect(records).toHaveLength(59)
      for (const p of patents) {
        const record = records.find(
          (r) => r.id === `section:transfer:patent-${p.reference}:${locale}`,
        )!
        expect(record.type).toBe('patent')
        expect(record.url).toBe(pageHref('transfer', locale, `patent-${p.reference}`))
        expect(record.url).toContain(`#patent-${p.reference}`)
        expect(record.title).toContain(p.title[locale])
        expect(record.body).toContain(p.title[locale])
        expect(record.body).toContain(p.description[locale])
        expect(record.body).toContain(p.depositor)
        if (p.filingDate) expect(record.body).toContain(p.filingDate)
      }
    }
    const withdrawn = patents.pop()!
    try {
      expect(
        staticSearchDocuments().some((r) => r.id.includes(`patent-${withdrawn.reference}:`)),
      ).toBe(false)
    } finally {
      patents.push(withdrawn)
    }
  })
})
