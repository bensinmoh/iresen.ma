import type { Locale } from '@/i18n/locales'
import { findProjects, projectsLocalReview } from '@/lib/projects'
import { ProjectsExperience } from './ProjectsExperience'

export async function ProjectsPage({
  locale,
  parameters = {},
}: {
  locale: Locale
  parameters?: Record<string, string | string[] | undefined>
}) {
  const records = await findProjects(locale)
  return (
    <ProjectsExperience
      locale={locale}
      parameters={parameters}
      records={records}
      review={projectsLocalReview() && locale !== 'fr'}
    />
  )
}
