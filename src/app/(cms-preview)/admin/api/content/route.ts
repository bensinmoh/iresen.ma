import { z } from 'zod'
import {
  authenticateWorkspace,
  jsonResponse,
  readJson,
  sameOrigin,
  workspaceFailure,
  WorkspaceError,
} from '@/lib/cms-workspace/auth'
import { loadContent, writeContent } from '@/lib/cms-workspace/content'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    return jsonResponse(await loadContent(await authenticateWorkspace(request)))
  } catch (error) {
    return workspaceFailure(error)
  }
}
export async function PUT(request: Request) {
  try {
    const auth = await authenticateWorkspace(request)
    sameOrigin(request)
    const body = z
      .object({ workspace: z.unknown(), revision: z.number().int().nonnegative() })
      .safeParse(await readJson(request))
    if (!body.success) throw new WorkspaceError('Requête de contenu invalide.')
    return jsonResponse(await writeContent(auth, body.data.workspace, body.data.revision))
  } catch (error) {
    return workspaceFailure(error)
  }
}
