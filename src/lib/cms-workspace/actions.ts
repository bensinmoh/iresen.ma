import 'server-only'
import { sql } from '@payloadcms/db-postgres'
import {
  canTransition,
  languages,
  validateEntry,
  type Entry,
  type Language,
} from '@/lib/cms-preview/model'
import { entrySchema } from '@/lib/cms-preview/schema'
import { contentSnapshot } from './content'
import { type AuthenticatedWorkspace, WorkspaceError } from './auth'
import { transactionDb, workspaceTransaction } from './transaction'
import { syncSource } from './sources'
import { analyzeDeletion } from './delete-impact'
import type { DeleteImpact } from '@/lib/cms-preview/delete-impact'
import { rebuildSearchIndex } from '@/lib/search/indexer'

export type ContentAction = 'draft' | 'review' | 'delete' | 'restore'
export async function contentAction(
  auth: AuthenticatedWorkspace,
  id: string,
  action: ContentAction,
  language: Language,
  note: string,
  revision: number,
  deleteImpactToken?: string,
) {
  if (['delete', 'restore'].includes(action) && auth.actor.role !== 'admin')
    throw new WorkspaceError('Suppression et restauration réservées à l’administrateur.', 403)
  const result = await workspaceTransaction(auth, 'content', revision, async (req, current) => {
    const db = transactionDb(req)
    const workspace = await contentSnapshot(req)
    const trash = await db.execute(
      sql`SELECT snapshot FROM cms_deleted_entries WHERE entry_id=${id}`,
    )
    const before =
      action === 'restore' && trash.rows[0]
        ? entrySchema.parse(trash.rows[0].snapshot)
        : workspace.entries.find((entry) => entry.id === id)
    if (!before || (action === 'restore' && !trash.rows.length))
      throw new WorkspaceError('Fiche introuvable. Recharger la liste.', 404)
    if (before.module === 'users') throw new WorkspaceError('Utiliser la gestion des comptes.', 403)
    const entry: Entry = structuredClone(before)
    let confirmedImpact: DeleteImpact | undefined
    if (action === 'delete') {
      const impact = await analyzeDeletion(req, before, workspace.entries, current)
      confirmedImpact = impact
      if (impact.blockers.length) throw new WorkspaceError(impact.blockers.join(' '), 409)
      if (!deleteImpactToken || deleteImpactToken !== impact.token)
        throw new WorkspaceError(
          'Consulter à nouveau les impacts avant de confirmer la suppression : les données ou les liens ont pu changer.',
          409,
        )
      await db.execute(
        sql`INSERT INTO cms_deleted_entries(entry_id,snapshot,deleted_by) VALUES(${id},${JSON.stringify(before)}::jsonb,${auth.actor.id})`,
      )
      if (entry.source) {
        const latest = await req.payload.findByID({
          collection: entry.source.collection,
          id: entry.source.id,
          locale: 'fr',
          fallbackLocale: false,
          draft: true,
          overrideAccess: false,
          user: auth.user,
          req,
        })
        if (latest.updatedAt !== entry.source.revision)
          throw new WorkspaceError('La source a changé. Recharger avant de supprimer.', 409)
        for (const locale of languages) {
          const source = await req.payload.update({
            collection: entry.source.collection,
            id: entry.source.id,
            locale,
            fallbackLocale: false,
            overrideAccess: false,
            user: auth.user,
            req,
            draft: false,
            data: { visibility: 'private', publicationStatus: 'draft', _status: 'published' },
          })
          entry.source.revision = source.updatedAt
        }
      }
    }
    if (action === 'restore') {
      const stored = await db.execute(
        sql`SELECT source_revision FROM cms_authoring_entries WHERE id=${id}`,
      )
      if (entry.source) entry.source.revision = String(stored.rows[0].source_revision)
      await db.execute(sql`DELETE FROM cms_deleted_entries WHERE entry_id=${id}`)
    }
    if (action === 'delete' || action === 'restore') {
      entry.shared.visibility = 'private'
      entry.publicVariants = {}
      for (const locale of languages) entry.variants[locale].status = 'draft'
    } else {
      if (!canTransition(auth.actor.role, entry.variants[language].status, action))
        throw new WorkspaceError('Ce rôle ne permet pas cette transition.', 403)
      if (action === 'draft' && entry.variants[language].status === 'review' && !note.trim())
        throw new WorkspaceError('Indiquer le motif du retour en brouillon.')
      if (action === 'review' && !entry.publicVariants[language]) {
        const errors = validateEntry(entry, language, true)
        if (errors.length) throw new WorkspaceError(errors.join(' '))
      }
      entry.variants[language].status = action
      if (note.trim()) entry.comment = note.trim()
      const synced = await syncSource(entry, before, language, req)
      entry.source = synced.source
    }
    const at = new Date().toISOString()
    await db.execute(
      sql`UPDATE cms_authoring_entries SET shared=${JSON.stringify(entry.shared)}::jsonb,variants=${JSON.stringify(entry.variants)}::jsonb,public_variants=${JSON.stringify(entry.publicVariants)}::jsonb,comment=${entry.comment},source_revision=${entry.source?.revision ?? null},updated_at=${at} WHERE id=${id}`,
    )
    for (const locale of action === 'delete' || action === 'restore' ? languages : [language])
      await db.execute(
        sql`INSERT INTO cms_authoring_revisions(entry_id,language,variant,shared,note,actor_id) VALUES(${id},${locale},${JSON.stringify(before.variants[locale])}::jsonb,${JSON.stringify(before.shared)}::jsonb,${note.trim() || action},${auth.actor.id})`,
      )
    await db.execute(
      sql`INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail) VALUES('content',${id},${action === 'delete' ? 'Suppression vers la corbeille' : action === 'restore' ? 'Restauration en brouillon privé' : `Remise en ${action === 'review' ? 'revue' : 'brouillon'}`},${auth.actor.id},${auth.actor.role},${JSON.stringify({ language, note, deletionImpact: confirmedImpact })}::jsonb)`,
    )
    await db.execute(
      sql`UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'`,
    )
    return { workspace: await contentSnapshot(req), revision: current + 1 }
  })
  if (action === 'delete' || action === 'restore') {
    try {
      await rebuildSearchIndex()
    } catch (error) {
      console.error('[cms-trash-search]', error instanceof Error ? error.name : 'Failure')
    }
  }
  return result
}
