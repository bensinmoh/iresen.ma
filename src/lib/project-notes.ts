import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { searchDatabase } from './search/database'
import type { Locale } from '@/i18n/locales'

/** Legacy archival exports only. Visitor downloads use onDemandProjectNote. */
export function projectNotesDirectory() {
  return path.resolve(process.env.PROJECTS_NOTES_DIRECTORY || '.local/projects/notes')
}

/** Call only after the access-controlled project query. No source text or private notes are returned. */
export async function projectNoteState(reference: string, locale: Locale) {
  const result = await searchDatabase().query<{
    project_id: number
    revision: string
    content_revision: string | null
    filename: string | null
    sha256: string | null
  }>(
    `SELECT p.id AS project_id, project_content_revision(p,l) AS revision,
       n.content_revision,n.filename,n.sha256
     FROM projects p JOIN projects_locales l ON l._parent_id=p.id AND l._locale::text=$2
       LEFT JOIN project_notes n ON n.project_id=p.id AND n.locale=$2
     WHERE p.reference=$1 LIMIT 1`,
    [reference, locale],
  )
  return result.rows[0]
}

export async function currentProjectNote(reference: string, locale: Locale) {
  const state = await projectNoteState(reference, locale)
  if (
    !state ||
    state.content_revision !== state.revision ||
    state.filename !== `${reference}-${locale}.pdf`
  )
    return null
  try {
    const file = await readFile(path.join(projectNotesDirectory(), state.filename))
    if (createHash('sha256').update(file).digest('hex') !== state.sha256) return null
    return file
  } catch {
    return null
  }
}
