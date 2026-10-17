import 'server-only'
import { createHmac } from 'node:crypto'
import { getPayload, type Payload } from 'payload'
import type { User } from '@/payload-types'
import config from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import type { Role } from '@/lib/cms-preview/model'
import { cmsInterfaceEnabled } from '@/lib/security/policy'
import { matchesRequestOrigin } from './origin'

export class WorkspaceError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message)
  }
}
export function workspaceEnabled() {
  return process.env.CMS_WORKSPACE_ENABLED === 'true' && cmsInterfaceEnabled()
}
export async function workspacePayload() {
  if (!workspaceEnabled()) throw new WorkspaceError('Espace de gestion indisponible.', 404)
  return getPayload({ config })
}
export type WorkspaceActor = { id: number; role: Role; name: string }
export type AuthenticatedWorkspace = { payload: Payload; user: User; actor: WorkspaceActor }
export async function authenticateWorkspace(request: Request): Promise<AuthenticatedWorkspace> {
  const payload = await workspacePayload()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user || !['admin', 'editor'].includes(user.role))
    throw new WorkspaceError('Connectez-vous avec un compte administrateur ou éditeur.', 401)
  return {
    payload,
    user,
    actor: { id: user.id, role: user.role as Role, name: user.name || user.email },
  }
}
export function sameOrigin(request: Request) {
  if (!matchesRequestOrigin(request))
    throw new WorkspaceError('Origine de la requête refusée.', 403)
}
export function jsonResponse(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
export function workspaceFailure(error: unknown) {
  if (error instanceof WorkspaceError) return jsonResponse({ error: error.message }, error.status)
  const code = (error as { code?: string })?.code
  if (code === '42P01')
    return jsonResponse(
      { error: 'Les migrations du CMS doivent être appliquées à la base locale.' },
      503,
    )
  if (code === '23505')
    return jsonResponse(
      { error: 'Cette référence ou ce profil existe déjà. Rechargez la liste avant de continuer.' },
      409,
    )
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    typeof error.status === 'number' &&
    error.status >= 400 &&
    error.status < 500
  )
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Vérifier les champs.' },
      error.status,
    )
  console.error(
    '[cms-workspace]',
    error instanceof Error ? error.name : 'Unexpected database failure',
  )
  return jsonResponse(
    {
      error:
        'Opération impossible. Les modifications ne sont pas confirmées ; réessayez après vérification de la connexion.',
    },
    500,
  )
}
export async function readJson(request: Request, maxBytes = 8_000_000): Promise<unknown> {
  const reader = request.body?.getReader()
  if (!reader) throw new WorkspaceError('Requête vide.')
  const chunks: Uint8Array[] = []
  let bytes = 0
  while (true) {
    const next = await reader.read()
    if (next.done) break
    bytes += next.value.byteLength
    if (bytes > maxBytes) {
      await reader.cancel()
      throw new WorkspaceError('La requête est trop volumineuse.', 413)
    }
    chunks.push(next.value)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new WorkspaceError('Requête JSON invalide.')
  }
}
export async function limitLogin(payload: Payload, email: string) {
  const secret = process.env.PAYLOAD_SECRET!
  // Global + account buckets; no trust in proxy IP headers, no raw email in limit keys.
  for (const value of ['global', email.toLowerCase()]) {
    const key = createHmac('sha256', secret).update(`cms-login:${value}`).digest('hex')
    const result = await payload.db.drizzle.execute(
      sql`INSERT INTO cms_auth_limits(key,attempts,expires_at) VALUES(${key},1,now()+interval '15 minutes') ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN cms_auth_limits.expires_at<now() THEN 1 ELSE cms_auth_limits.attempts+1 END, expires_at=CASE WHEN cms_auth_limits.expires_at<now() THEN now()+interval '15 minutes' ELSE cms_auth_limits.expires_at END RETURNING attempts`,
    )
    if (Number(result.rows[0]?.attempts) > (value === 'global' ? 100 : 10))
      throw new WorkspaceError('Trop de tentatives. Réessayez dans 15 minutes.', 429)
  }
}
