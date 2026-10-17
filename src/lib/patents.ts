import { canonicalNames } from './names'
import { totalPatents } from './patent-count'
import records from '@/data/patents.json' with { type: 'json' }
import type { Locale } from '@/i18n/locales'
import { pageHref } from './site'

export const patentThemes = [
  'solar',
  'storage',
  'buildings',
  'mobility',
  'water',
  'hydrogen',
  'bioenergy',
  'grids',
  'measurement',
  'thermal',
] as const
export type PatentTheme = (typeof patentThemes)[number]
export type Patent = {
  reference: string
  /** French bibliographic wording with owner-requested English/Arabic display translations. */
  title: Record<Locale, string>
  description: Record<Locale, string>
  themes: PatentTheme[]
  depositor: string | null
  filingYear: number | null
  /** Exact ISO filing date when verified in the official register. */
  filingDate?: string
  /** Accepted / granted in the owner source dated 2026-10-07; not a current validity claim. */
  granted: boolean
  registerUrl: string
}

/** Owner-selected, minimal public projection. The source workbook is never served. */
export const filedPatents = records.map((record) => ({
  ...record,
  depositor: record.depositor ? canonicalNames(record.depositor) : null,
})) as Patent[]
export const filedPatentCount = totalPatents
/** Public IP portfolio: only source-confirmed accepted / granted patents. */
export const patents = filedPatents.filter((patent) => patent.granted === true)
/** Filter values must be represented in the granted IP portfolio. */
export const getPatentFilterOptions = (patents: Patent[]) => ({
  themes: patentThemes.filter((theme) => patents.some((patent) => patent.themes.includes(theme))),
  years: [
    ...new Set(
      patents.flatMap((patent) => (patent.filingYear === null ? [] : [patent.filingYear])),
    ),
  ].sort((a, b) => b - a),
  depositors: [...new Set(patents.flatMap((patent) => patent.depositor?.split(' ; ') ?? []))].sort(
    (a, b) => a.localeCompare(b, 'fr'),
  ),
  unknownYear: patents.some((patent) => patent.filingYear === null),
})
export const patentFilterOptions = getPatentFilterOptions(patents)
export const patentSourceDate = '2026-10-07'
export function patentAnchor(reference: string) {
  return `patent-${reference}`
}
export function patentContactHref(locale: Locale, reference: string) {
  const [path, anchor] = pageHref('contact', locale, 'send-request').split('#')
  return `${path}?subject=partnerships&patent=${encodeURIComponent(reference)}#${anchor}`
}
export function findPatent(reference: unknown) {
  return typeof reference === 'string' ? patents.find((p) => p.reference === reference) : undefined
}
export function filterPatents(
  query: string,
  theme: string,
  year: string,
  depositor: string,
  locale: Locale,
  records: Patent[] = patents,
) {
  const normalize = (text: string) =>
    text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(locale)
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean)
  return records.filter((p) => {
    const text = normalize(
      [p.reference, p.title[locale], p.description[locale], p.depositor ?? ''].join(' '),
    )
    return (
      terms.every((term) => text.includes(term)) &&
      (!theme || p.themes.includes(theme as PatentTheme)) &&
      (!year || (year === 'unknown' ? p.filingYear === null : String(p.filingYear) === year)) &&
      (!depositor || p.depositor?.split(' ; ').includes(depositor))
    )
  })
}
