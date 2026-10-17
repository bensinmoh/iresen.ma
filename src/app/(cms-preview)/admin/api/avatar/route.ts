import { sql } from '@payloadcms/db-postgres'
import { authenticateWorkspace, workspaceFailure, WorkspaceError } from '@/lib/cms-workspace/auth'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    const { payload, user } = await authenticateWorkspace(request)
    const result = await payload.db.drizzle.execute(
      sql`SELECT content,mime FROM cms_account_avatars WHERE user_id=${user.id}`,
    )
    const avatar = result.rows[0]
    if (!avatar || !Buffer.isBuffer(avatar.content))
      throw new WorkspaceError('Portrait de compte introuvable.', 404)
    return new Response(new Uint8Array(avatar.content), {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': String(avatar.content.length),
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      },
    })
  } catch (error) {
    return workspaceFailure(error)
  }
}
