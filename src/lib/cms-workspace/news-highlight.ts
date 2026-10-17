import 'server-only'
import { sql } from '@payloadcms/db-postgres'
import type { AuthenticatedWorkspace } from './auth'
import { WorkspaceError } from './auth'
import { contentSnapshot } from './content'
import { transactionDb, workspaceTransaction } from './transaction'
export async function setNewsHighlight(auth: AuthenticatedWorkspace, id: string, revision: number) {
  if (auth.actor.role !== 'admin')
    throw new WorkspaceError('La mise à la une est réservée à l’administrateur.', 403)
  return workspaceTransaction(auth, 'content', revision, async (req, current) => {
    const workspace = await contentSnapshot(req)
    const entry = workspace.entries.find((entry) => entry.id === id)
    if (!entry || entry.module !== 'news') throw new WorkspaceError('Article introuvable.', 404)
    if (
      entry.shared.visibility !== 'public' ||
      !Object.values(entry.publicVariants).some((variant) => variant?.status === 'published')
    )
      throw new WorkspaceError(
        'Valider une version publique de cet article avant de le mettre à la une.',
        409,
      )
    const previous = workspace.entries.find(
      (other) => other.module === 'news' && other.shared.highlight === 'true',
    )
    if (previous?.id === id) return { workspace, revision: current }
    const db = transactionDb(req)
    await db.execute(
      sql`UPDATE cms_authoring_entries SET shared=jsonb_set(shared,'{highlight}','"false"'::jsonb) WHERE module='news' AND shared->>'highlight'='true'`,
    )
    await db.execute(
      sql`UPDATE cms_authoring_entries SET shared=jsonb_set(shared,'{highlight}','"true"'::jsonb) WHERE id=${id} AND module='news'`,
    )
    await db.execute(
      sql`INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail) VALUES('content',${id},'Article à la une',${auth.actor.id},${auth.actor.role},${JSON.stringify({ previousId: previous?.id ?? null, selectedId: id })}::jsonb)`,
    )
    await db.execute(
      sql`UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'`,
    )
    return { workspace: await contentSnapshot(req), revision: current + 1 }
  })
}
