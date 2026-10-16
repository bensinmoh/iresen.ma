import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'

export const projectDomains = [
  'thermal',
  'grids',
  'efficiency',
  'photovoltaic',
  'wind',
  'hydrogen',
  'storage',
  'biomass',
  'materials',
  'water',
  'other',
] as const
export const projectStatuses = ['active', 'completed', 'planned'] as const
export type ProjectRecord = {
  institutionSearchText?: string
  id: string
  acronym: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  summary: Record<Locale, string>
  domain: (typeof projectDomains)[number]
  status: (typeof projectStatuses)[number] | null
  programme: string
  /** Calls.reference of the selection call; absent until the attribution is verified. */
  selectionCallReference?: string | null
  year: number | null
  durationMonths: number | null
  budgetMAD: number | null
  image: string | null
  theme: Record<Locale, string>
  startText: Record<Locale, string>
  location: Record<Locale, string>
  sourceUrl: string
  noteAvailable: boolean
  details: {
    presentation: Record<Locale, string[]>
    hostingPlatform: Record<Locale, string>
    coordinator: {
      name: Record<Locale, string>
      /** Original public Latin identity aliases for Arabic-name discovery. */
      searchAliases?: string[]
      email: string | null
      affiliation: Record<Locale, string>
      phone: string | null
      portrait: string | null
    }
    consortium: Record<Locale, string[]>
    consortiumLogos: { id: string; name: string; src: string }[]
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
  localizedMetadata: (project: ProjectRecord) => string[] = () => [],
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
        project.summary[locale],
        project.programme,
        project.selectionCallReference,
        project.domain,
        project.status,
        project.theme[locale],
        project.year,
        project.startText[locale],
        project.location[locale],
        project.institutionSearchText,
        project.durationMonths,
        project.budgetMAD,
        project.budgetMAD === null ? '' : new Intl.NumberFormat(locale).format(project.budgetMAD),
        project.sourceUrl,
        ...project.details.presentation[locale],
        project.details.hostingPlatform[locale],
        project.details.coordinator.name[locale],
        ...(project.details.coordinator.searchAliases ?? []),
        project.details.coordinator.affiliation[locale],
        project.details.coordinator.email,
        ...project.details.consortium[locale],
        ...project.details.consortiumLogos.map((partner) => partner.name),
        ...project.details.objectives[locale],
        ...localizedMetadata(project),
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

export function projectNoteHref(reference: string, locale: Locale) {
  return `/api/projects/${encodeURIComponent(reference)}/note?locale=${locale}`
}

export function programmeProjectsHref(programme: string, locale: Locale) {
  return `${pageHref('projects', locale)}?${new URLSearchParams({ programme })}#find-project`
}
