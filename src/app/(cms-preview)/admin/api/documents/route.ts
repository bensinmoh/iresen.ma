import { randomUUID } from 'node:crypto'
import { sql } from '@payloadcms/db-postgres'
import {
  authenticateWorkspace,
  jsonResponse,
  sameOrigin,
  workspaceFailure,
  WorkspaceError,
} from '@/lib/cms-workspace/auth'
import { limitedBody, documentMime, safeDocumentName } from '@/lib/cms-workspace/documents'
import { recruitmentData } from '@/lib/cms-workspace/recruitment'
import { transactionDb, workspaceTransaction } from '@/lib/cms-workspace/transaction'
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    const auth = await authenticateWorkspace(request)
    sameOrigin(request)
    const contentType = request.headers.get('content-type') || ''
    if (!contentType.startsWith('multipart/form-data;'))
      throw new WorkspaceError('Dépôt multipart requis.')
    const body = await new Response(
      new Uint8Array(await limitedBody(request, 5_100_000)).buffer as ArrayBuffer,
      {
        headers: { 'Content-Type': contentType },
      },
    ).formData()
    const file = body.get('file')
    const candidateId = body.get('candidateId')
    const kind = body.get('kind')
    const revision = Number(body.get('revision'))
    if (
      !(file instanceof File) ||
      typeof candidateId !== 'string' ||
      candidateId.length > 200 ||
      !['cv', 'coverLetter', 'portfolio'].includes(String(kind)) ||
      !Number.isInteger(revision) ||
      revision < 0
    )
      throw new WorkspaceError('Métadonnées du document invalides.')
    const bytes = new Uint8Array(await file.arrayBuffer())
    const name = safeDocumentName(file.name)
    const mime = documentMime(name, bytes)
    return jsonResponse(
      await workspaceTransaction(auth, 'recruitment', revision, async (req, current) => {
        const db = transactionDb(req)
        const owner = await db.execute(
          sql`SELECT id FROM cms_candidate_profiles WHERE id=${candidateId}`,
        )
        if (!owner.rows.length) throw new WorkspaceError('Profil candidat introuvable.', 404)
        const metadata = {
          id: randomUUID(),
          candidateId,
          kind: String(kind),
          name,
          mime,
          size: bytes.length,
          addedAt: new Date().toISOString(),
        }
        await db.execute(
          sql`INSERT INTO cms_candidate_documents(id,candidate_id,name,mime,size,content,metadata,actor_id) VALUES(${metadata.id},${candidateId},${name},${mime},${bytes.length},${Buffer.from(bytes)},${JSON.stringify(metadata)}::jsonb,${auth.actor.id})`,
        )
        await db.execute(
          sql`INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role) VALUES('recruitment',${candidateId},'Dépôt de document privé',${auth.actor.id},${auth.actor.role})`,
        )
        await db.execute(
          sql`UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='recruitment'`,
        )
        return { state: await recruitmentData(req), revision: current + 1, document: metadata }
      }),
    )
  } catch (error) {
    return workspaceFailure(error)
  }
}
