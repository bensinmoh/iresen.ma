import type { Locale } from '@/i18n/locales'
import { demoProjects } from '@/lib/projects'
import { ProjectsExperience } from './ProjectsExperience'

export function ProjectsPage({
  locale,
  parameters,
}: {
  locale: Locale
  parameters: Record<string, string | string[] | undefined>
}) {
  // Provenance and placeholder coordinators remain in the source database only.
  const records = demoProjects.map((project) => ({
    id: project.id,
    acronym: project.acronym,
    title: project.title,
    description: project.description,
    domain: project.domain,
    status: project.status,
    programme: project.programme,
    year: project.year,
    durationMonths: project.durationMonths,
    budgetMAD: project.budgetMAD,
    image: project.image,
    details: project.details,
  }))
  return <ProjectsExperience locale={locale} parameters={parameters} records={records} />
}
