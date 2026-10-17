import { setNewsHighlight } from '@/lib/cms-workspace/news-highlight'
import { z } from 'zod'
import {
  authenticateWorkspace,
  jsonResponse,
  readJson,
  sameOrigin,
  workspaceFailure,
  WorkspaceError,
} from '@/lib/cms-workspace/auth'
import { deletionImpact } from '@/lib/cms-workspace/delete-impact'
import { contentAction } from '@/lib/cms-workspace/actions'
import { sql } from '@payloadcms/db-postgres'
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    const auth = await authenticateWorkspace(request)
    sameOrigin(request)
    const body = z
      .object({
        id: z.string().min(1).max(200),
        action: z.enum(['draft', 'review', 'delete', 'restore', 'highlight']),
        language: z.enum(['fr', 'en', 'ar']),
        note: z.string().max(2000).default(''),
        revision: z.number().int().nonnegative(),
        deleteImpactToken: z
          .string()
          .regex(/^[a-f0-9]{64}$/)
          .optional(),
      })
      .safeParse(await readJson(request, 10000))
    if (!body.success) throw new WorkspaceError('Action ou paramètres invalides.')
    if (body.data.action === 'highlight')
      return jsonResponse(await setNewsHighlight(auth, body.data.id, body.data.revision))
    return jsonResponse(
      await contentAction(
        auth,
        body.data.id,
        body.data.action,
        body.data.language,
        body.data.note,
        body.data.revision,
        body.data.deleteImpactToken,
      ),
    )
  } catch (error) {
    return workspaceFailure(error)
  }
}
export async function GET(request: Request) {
  try {
    const auth = await authenticateWorkspace(request)
    if (auth.actor.role !== 'admin')
      throw new WorkspaceError('Corbeille réservée à l’administrateur.', 403)
    const params = new URL(request.url).searchParams
    if (params.get('action') === 'delete-impact') {
      const input = z
        .object({ id: z.string().min(1).max(200), revision: z.coerce.number().int().nonnegative() })
        .safeParse({ id: params.get('id'), revision: params.get('revision') ?? undefined })
      if (!input.success) throw new WorkspaceError('Fiche ou révision invalide.')
      return jsonResponse(await deletionImpact(auth, input.data.id, input.data.revision))
    }
    const result = await auth.payload.db.drizzle.execute(
      sql`SELECT entry_id AS id,snapshot->>'module' AS module,snapshot->'variants'->'fr'->>'title' AS title,deleted_at FROM cms_deleted_entries ORDER BY deleted_at DESC`,
    )
    return jsonResponse({ entries: result.rows })
  } catch (error) {
    return workspaceFailure(error)
  }
}
