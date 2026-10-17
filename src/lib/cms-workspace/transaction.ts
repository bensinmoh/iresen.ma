import 'server-only'
import { createLocalReq, type PayloadRequest } from 'payload'
import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import type { AuthenticatedWorkspace } from './auth'
import { WorkspaceError } from './auth'
export async function workspaceTransaction<T>(
  auth: AuthenticatedWorkspace,
  scope: 'content' | 'recruitment',
  expected: number | undefined,
  action: (req: PayloadRequest, revision: number) => Promise<T>,
) {
  const id = await auth.payload.db.beginTransaction()
  if (id === null) throw new WorkspaceError('Transactions PostgreSQL indisponibles.', 503)
  const req = await createLocalReq(
    { user: auth.user, locale: 'fr', fallbackLocale: false },
    auth.payload,
  )
  req.transactionID = id
  const db = transactionDb(req)
  try {
    const result = await db.execute(
      sql`SELECT revision FROM cms_workspace_meta WHERE scope=${scope} FOR UPDATE`,
    )
    const revision = Number(result.rows[0]?.revision)
    if (!Number.isFinite(revision)) throw new WorkspaceError('Migrations CMS manquantes.', 503)
    if (expected !== undefined && expected !== revision)
      throw new WorkspaceError(
        'Un autre utilisateur a modifié ces données. Exportez vos modifications puis rechargez.',
        409,
      )
    const data = await action(req, revision)
    await auth.payload.db.commitTransaction(id)
    return data
  } catch (error) {
    await auth.payload.db.rollbackTransaction(id)
    throw error
  }
}
export function transactionDb(req: PayloadRequest) {
  if (!req.transactionID || typeof req.transactionID === 'object')
    throw new WorkspaceError('Transaction requise.', 500)
  const session = (req.payload.db as unknown as PostgresAdapter).sessions?.[
    String(req.transactionID)
  ]
  if (!session) throw new WorkspaceError('Session de transaction introuvable.', 500)
  return session.db as {
    execute: (
      statement: Parameters<PostgresAdapter['drizzle']['execute']>[0],
    ) => Promise<{ rows: Record<string, unknown>[] }>
  }
}
