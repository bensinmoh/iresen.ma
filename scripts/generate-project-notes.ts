import { mkdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { renderProjectNote } from '../src/lib/project-note-renderer'
import { projectNoteDocument } from '../src/lib/project-note-document'
import { findProjects } from '../src/lib/projects'
import { projectNotesDirectory, projectNoteState } from '../src/lib/project-notes'
import { searchDatabase } from '../src/lib/search/database'
import type { Locale } from '../src/i18n/locales'

// Offline previews never access PostgreSQL or register/replace the site's current notes.
const preview = process.argv.includes('--workbook-preview')
const workbook = preview ? await import('./project-workbook-data') : null
const output = preview ? path.resolve('.local/projects/workbook-1026/pdf') : projectNotesDirectory()
await mkdir(output, { recursive: true, mode: 0o700 })
const projectOption = process.argv.slice(2).find((value) => value.startsWith('--project='))
const reference = projectOption?.slice('--project='.length)
if (reference !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(reference))
  throw new Error('Invalid project reference.')
const requested = process.argv
  .slice(2)
  .filter((value) => value !== '--workbook-preview' && value !== projectOption)
const locales: Locale[] = requested.length
  ? requested.filter((v): v is Locale => ['fr', 'en', 'ar'].includes(v))
  : ['fr', 'en', 'ar']
if (!locales.length) throw new Error('Choose fr, en or ar.')

try {
  for (const locale of locales) {
    const projects = workbook
      ? workbook.workbookPreview(locale).filter((project) => !reference || project.id === reference)
      : await findProjects(locale, reference)
    if (!projects.length)
      throw new Error(
        `No readable projects for ${locale}; enable explicit local review for pending translations.`,
      )
    for (const entry of projects) {
      const before = preview ? null : await projectNoteState(entry.id, locale)
      const project = preview ? entry : (await findProjects(locale, entry.id))[0]
      if ((!before && !preview) || !project) throw new Error('The project is no longer readable.')
      const bytes = await renderProjectNote((await projectNoteDocument(project, locale)).html)
      const current = preview ? null : await projectNoteState(project.id, locale)
      if (!preview && (!before || current?.revision !== before.revision))
        throw new Error(`Project changed during generation: ${project.id}/${locale}`)
      const filename = `${project.id}-${locale}.pdf`
      const target = path.join(output, filename)
      await writeFile(target + '.tmp', bytes, { mode: 0o600 })
      await rename(target + '.tmp', target)
      if (current)
        await searchDatabase().query(
          `INSERT INTO project_notes(project_id,locale,content_revision,filename,sha256) VALUES($1,$2,$3,$4,$5)
        ON CONFLICT(project_id,locale) DO UPDATE SET content_revision=EXCLUDED.content_revision,filename=EXCLUDED.filename,sha256=EXCLUDED.sha256,generated_at=now()`,
          [
            current.project_id,
            locale,
            current.revision,
            filename,
            createHash('sha256').update(bytes).digest('hex'),
          ],
        )
      console.log(`Generated ${project.id}/${locale}`)
    }
  }
} finally {
  if (!preview) {
    await searchDatabase().end()
    const { getPayload } = await import('payload')
    const { default: config } = await import('../src/payload.config')
    await (await getPayload({ config })).destroy()
  }
}

// All writes and teardown have completed; close residual library timers in this one-shot CLI.
process.exit(0)
