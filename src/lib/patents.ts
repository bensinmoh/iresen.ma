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
  /** Original bibliographic title and applicant names are not translated. */
  title: string
  description: Record<Locale, string>
  themes: PatentTheme[]
  depositor: string | null
  filingYear: number | null
  /** Exact ISO filing date when verified in the official register. */
  filingDate?: string
  registerUrl: string
}

/** Owner-selected, minimal public projection. The source workbook is never served. */
export const patents = records as Patent[]
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
) {
  const normalize = (text: string) =>
    text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(locale)
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean)
  return patents.filter((p) => {
    const text = normalize(
      [p.reference, p.title, p.description[locale], p.depositor ?? ''].join(' '),
    )
    return (
      terms.every((term) => text.includes(term)) &&
      (!theme || p.themes.includes(theme as PatentTheme)) &&
      (!year || (year === 'unknown' ? p.filingYear === null : String(p.filingYear) === year)) &&
      (!depositor || p.depositor?.split(' ; ').includes(depositor))
    )
  })
}
