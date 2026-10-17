import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Locale } from '../i18n/locales'
import type { ProjectRecord } from './projects-model'
import { findProjects } from './projects'
import { projectNoteHtml } from './project-note-template'
import { renderProjectNote } from './project-note-renderer'
import { ProjectNoteCache } from './project-note-cache'

const cache = new ProjectNoteCache(renderProjectNote)

/** Only call with an access-controlled project. Never fetch a CMS-supplied URL. */
export async function projectNoteDocument(project: ProjectRecord, locale: Locale) {
  let image: Buffer | undefined
  if (project.image === `/api/projects/${project.id}/asset/image`) {
    const root = path.resolve(process.env.PROJECTS_ASSET_DIRECTORY || '.local/projects/assets')
    try {
      image = await readFile(path.join(root, project.id, 'image.webp'))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
  }
  const html = await projectNoteHtml(project, locale, image)
  // Actual HTML fingerprints the localized data, image bytes, layout, logo and fonts.
  return { html, key: createHash('sha256').update(html).digest('hex') }
}

export async function onDemandProjectNote(reference: string, locale: Locale) {
  const project = (await findProjects(locale, reference))[0]
  if (!project) return null
  const document = await projectNoteDocument(project, locale)
  const bytes = await cache.get(document.key, document.html)
  // A warm cache never authorizes access. Also reject changes/withdrawal during rendering.
  const current = (await findProjects(locale, reference))[0]
  if (!current) return null
  if ((await projectNoteDocument(current, locale)).key !== document.key)
    throw new Error('Project changed during PDF generation')
  return bytes
}
