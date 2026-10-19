import { createLocalReq, logoutOperation } from 'payload'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sql } from '@payloadcms/db-postgres'
import {
  authenticateWorkspace,
  jsonResponse,
  limitLogin,
  readJson,
  sameOrigin,
  workspaceFailure,
  workspacePayload,
  WorkspaceError,
} from '@/lib/cms-workspace/auth'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const { actor, payload } = await authenticateWorkspace(request)
    const profile = await payload.db.drizzle.execute(
      sql`SELECT display_name,sha256 FROM cms_account_avatars WHERE user_id=${actor.id}`,
    )
    const avatar = profile.rows[0]
    return jsonResponse({
      actor: {
        ...actor,
        ...(avatar
          ? {
              name: String(avatar.display_name),
              avatarUrl: `/admin/api/avatar?v=${String(avatar.sha256)}`,
            }
          : {}),
      },
    })
  } catch (error) {
    return workspaceFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    const payload = await workspacePayload()
    sameOrigin(request)
    const parsed = z
      .object({ email: z.email().max(320), password: z.string().min(1).max(1000) })
      .safeParse(await readJson(request, 5000))
    if (!parsed.success) throw new WorkspaceError('Saisir un courriel et un mot de passe valides.')
    await limitLogin(payload, parsed.data.email)
    let result
    try {
      result = await payload.login({ collection: 'users', data: parsed.data })
    } catch {
      throw new WorkspaceError('Identifiants incorrects ou compte temporairement verrouillé.', 401)
    }
    if (!result.user || !['admin', 'editor'].includes(result.user.role))
      throw new WorkspaceError('Ce compte ne possède pas de rôle autorisé.', 403)
    const response = NextResponse.json(
      {
        actor: {
          id: result.user.id,
          role: result.user.role,
          name: result.user.name || result.user.email,
        },
      },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
    response.cookies.set(`${payload.config.cookiePrefix}-token`, result.token!, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production' || new URL(request.url).protocol === 'https:',
      path: '/',
      maxAge: 7200,
    })
    return response
  } catch (error) {
    return workspaceFailure(error)
  }
}
export async function DELETE(request: Request) {
  try {
    const { payload, user } = await authenticateWorkspace(request)
    sameOrigin(request)
    const req = await createLocalReq({ user, req: { headers: request.headers } }, payload)
    await logoutOperation({ collection: payload.collections.users, req })
    const response = NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
    response.cookies.set(`${payload.config.cookiePrefix}-token`, '', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production' || new URL(request.url).protocol === 'https:',
      path: '/',
      maxAge: 0,
    })
    return response
  } catch (error) {
    return workspaceFailure(error)
  }
}
