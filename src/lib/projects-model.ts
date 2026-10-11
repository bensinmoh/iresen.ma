import type { Locale } from '@/i18n/locales'

export const projectDomains = [
  'thermal',
  'grids',
  'efficiency',
  'photovoltaic',
  'wind',
  'hydrogen',
  'storage',
] as const
export const projectStatuses = ['active', 'completed', 'planned'] as const
export type ProjectRecord = {
  id: string
  acronym: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  domain: (typeof projectDomains)[number]
  status: (typeof projectStatuses)[number]
  programme: string
  year: number
  durationMonths: number
  budgetMAD: number
  image: string
  details: {
    presentation: Record<Locale, string[]>
    hostingPlatform: Record<Locale, string>
    coordinator: {
      name: Record<Locale, string>
      email: string
      phone: string | null
      portrait: string | null
    }
    consortium: Record<Locale, string[]>
    objectives: Record<Locale, string[]>
  }
}
export type ProjectFilters = {
  query: string
  domain: string
  year: string
  status: string
  programme: string
}
export const emptyProjectFilters: ProjectFilters = {
  query: '',
  domain: '',
  year: '',
  status: '',
  programme: '',
}
export function filterProjectRecords(
  records: ProjectRecord[],
  filters: ProjectFilters,
  locale: Locale,
) {
  const normalize = (value: string) =>
    value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(locale)
  const terms = normalize(filters.query).trim().split(/\s+/).filter(Boolean)
  return records.filter((project) => {
    const text = normalize(
      [
        project.id,
        project.acronym,
        project.title[locale],
        project.description[locale],
        project.programme,
      ].join(' '),
    )
    return (
      terms.every((term) => text.includes(term)) &&
      (!filters.domain || project.domain === filters.domain) &&
      (!filters.year || String(project.year) === filters.year) &&
      (!filters.status || project.status === filters.status) &&
      (!filters.programme || project.programme === filters.programme)
    )
  })
}

/** Stable attachment destination; the API validates both the record ID and locale. */
export function projectNoteHref(id: string, locale: Locale) {
  return `/api/projects/${encodeURIComponent(id)}/note?locale=${locale}`
}
