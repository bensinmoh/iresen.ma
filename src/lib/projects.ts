import records from '@/data/projects-demo.json' with { type: 'json' }
import type { ProjectRecord } from './projects-model'
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
export type DemoProject = ProjectRecord & {
  id: string
  fictional: true
  acronym: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  coordinator: Record<Locale, string>
  domain: (typeof projectDomains)[number]
  status: (typeof projectStatuses)[number]
  programme: string
  year: number
  durationMonths: number
  budgetMAD: number
  image: string
}
/** Isolated owner-requested demonstration database; never CMS/public search records. */
export const demoProjects = records as DemoProject[]
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
export function filterProjects(filters: ProjectFilters, locale: Locale) {
  const normalize = (value: string) =>
    value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase(locale)
  const terms = normalize(filters.query).trim().split(/\s+/).filter(Boolean)
  return demoProjects.filter((project) => {
    const text = normalize(
      [
        project.id,
        project.acronym,
        project.title[locale],
        project.description[locale],
        project.coordinator[locale],
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
