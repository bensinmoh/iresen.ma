import { z } from 'zod'
import {
  authenticateWorkspace,
  jsonResponse,
  readJson,
  sameOrigin,
  workspaceFailure,
  WorkspaceError,
} from '@/lib/cms-workspace/auth'
import { loadRecruitment, writeRecruitment } from '@/lib/cms-workspace/recruitment'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    return jsonResponse(await loadRecruitment(await authenticateWorkspace(request)))
  } catch (error) {
    return workspaceFailure(error)
  }
}
export async function PUT(request: Request) {
  try {
    const auth = await authenticateWorkspace(request)
    sameOrigin(request)
    const body = z
      .object({ state: z.unknown(), revision: z.number().int().nonnegative() })
      .safeParse(await readJson(request))
    if (!body.success) throw new WorkspaceError('Requête de recrutement invalide.')
    return jsonResponse(await writeRecruitment(auth, body.data.state, body.data.revision))
  } catch (error) {
    return workspaceFailure(error)
  }
}
