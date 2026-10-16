import { describe, it, expect } from 'vitest'
import {
  filedPatents,
  filedPatentCount,
  patents,
  patentThemes,
  patentFilterOptions,
  filterPatents,
  patentContactHref,
  findPatent,
} from '@/lib/patents'
import { staticSearchDocuments } from '@/lib/search/catalog'
import { pageHref } from '@/lib/site'
import { contentLocales } from '@/lib/content/publication'

const findFiledPatent = (reference: string) =>
  filedPatents.find((patent) => patent.reference === reference)

describe('owner-selected patent catalogue', () => {
  it('retains exactly 59 unique filings with only permitted fields and no excluded references', () => {
    expect(filedPatents).toHaveLength(59)
    expect(new Set(filedPatents.map((p) => p.reference)).size).toBe(59)
    for (const id of ['34695', '35299', '20150313', '20150464'])
      expect(findFiledPatent(id)).toBeUndefined()
    for (const p of filedPatents) {
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
          'granted',
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
    expect(findFiledPatent('37172')?.filingYear).toBe(2014)
    expect(findFiledPatent('37172')?.filingDate).toBe('2014-07-01')
    expect(filedPatents.filter((p) => p.filingDate)).toHaveLength(12)
    for (const p of filedPatents.filter((p) => p.filingDate)) {
      expect(p.filingDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(new Date(p.filingDate!).toISOString().slice(0, 10)).toBe(p.filingDate)
      expect(p.filingYear).toBe(Number(p.filingDate!.slice(0, 4)))
    }
    expect(findFiledPatent('71194')?.filingYear).toBeNull()
    expect(findFiledPatent('53044')?.filingYear).toBe(2021)
  })
  it('uses sentence-case titles while preserving scientific names and acronyms', () => {
    expect(findFiledPatent('41528')?.title.fr).toBe(
      "Procédé et système pour le nettoyage des panneaux photovoltaïques avec un système de collecte, de traitement, de stockage et de recyclage de l'eau",
    )
    expect(findFiledPatent('41925')?.title.fr).toBe('Smart fiche prise (PV/hybrid/grid)')
    expect(findFiledPatent('53044')?.title.fr).toContain('V2X')
    expect(findFiledPatent('56600')?.title.fr).toMatch(/^GEP-PVSMS : système/)
    expect(findFiledPatent('71194')?.title.fr).toMatch(/^Intel.PV : système/)
    expect(findFiledPatent('58719')?.title.fr).toContain('(doum) BrickDOUM')
    expect(findFiledPatent('51690')?.title.fr).toContain('Fresnel')
    expect(findFiledPatent('40800')?.title.fr).toContain('Chamaerops humilis L.')
    expect(findFiledPatent('72762')?.title.fr).toContain('PV/BIPV')
  })
  it('distinguishes 59 filings from 30 granted portfolio patents and excludes other filings', () => {
    expect(filedPatentCount).toBe(59)
    expect(patents).toHaveLength(30)
    for (const patent of patents) expect(patent.granted).toBe(true)
    const documents = staticSearchDocuments()
    for (const patent of filedPatents.filter((p) => !p.granted)) {
      expect(findPatent(patent.reference)).toBeUndefined()
      expect(
        documents.some((d) => d.id.startsWith(`section:transfer:patent-${patent.reference}:`)),
      ).toBe(false)
    }
  })
  it('offers only filter values represented among granted patents', () => {
    expect(patentFilterOptions.themes).not.toContain('hydrogen')
    expect(patentFilterOptions.themes).not.toContain('measurement')
    expect(patentFilterOptions.unknownYear).toBe(false)
    for (const theme of patentFilterOptions.themes)
      expect(patents.some((patent) => patent.themes.includes(theme))).toBe(true)
    expect(new Set(patentFilterOptions.themes)).toEqual(
      new Set(patents.flatMap((patent) => patent.themes)),
    )
    expect(new Set(patentFilterOptions.years)).toEqual(
      new Set(patents.map((patent) => patent.filingYear)),
    )
    expect(new Set(patentFilterOptions.depositors)).toEqual(
      new Set(patents.flatMap((patent) => patent.depositor?.split(' ; ') ?? [])),
    )
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
    expect(filterPatents('', '', 'unknown', '', 'fr')).toHaveLength(
      patents.filter((p) => p.filingYear === null).length,
    )
    expect(filterPatents('not-a-patent', '', '', '', 'en')).toEqual([])
    expect(filterPatents('شمسي', '', '', '', 'ar').length).toBeGreaterThan(0)
    expect(filterPatents('', '', '', '', 'fr')).toHaveLength(30)
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
      expect(findPatent('72762')).toBeUndefined()
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
      expect(records).toHaveLength(30)
      for (const p of patents) {
        const record = records.find(
          (r) => r.id === `section:transfer:patent-${p.reference}:${locale}`,
        )!
        expect(record.type).toBe('patent')
        expect(record.url).toBe(pageHref('patents', locale, `patent-${p.reference}`))
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
