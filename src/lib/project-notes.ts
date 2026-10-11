import { createHash } from 'node:crypto'
import manifest from '@/data/project-notes/manifest.json' with { type: 'json' }
import { demoProjects } from './projects'
import { projectNoteHref } from './projects-model'
import { locales } from '@/i18n/locales'

/** Explicit download references; demonstration/editorial records stay outside public search. */
export const projectNoteReferences = demoProjects.flatMap((project) =>
  locales.map((locale) => ({
    id: `project-note:${project.id}:${locale}`,
    projectId: project.id,
    locale,
    url: projectNoteHref(project.id, locale),
    type: 'document' as const,
    title: `${project.acronym} — ${project.title[locale]}`,
    description: [
      ...project.details.presentation[locale],
      ...project.details.objectives[locale],
    ].join(' '),
    searchEligible: false as const,
  })),
)
export const projectNoteManifest = manifest
export const projectNotesMatchSource =
  manifest.sourceSHA256 === createHash('sha256').update(JSON.stringify(demoProjects)).digest('hex')
