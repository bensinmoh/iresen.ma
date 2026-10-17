import { sql } from '@payloadcms/db-postgres'
import {
  authenticateWorkspace,
  jsonResponse,
  sameOrigin,
  workspaceFailure,
  WorkspaceError,
} from '@/lib/cms-workspace/auth'
import { limitedBody, documentMime, safeDocumentName } from '@/lib/cms-workspace/documents'
import { contentSnapshot } from '@/lib/cms-workspace/content'
import { sourceEntry } from '@/lib/cms-workspace/sources'
import { transactionDb, workspaceTransaction } from '@/lib/cms-workspace/transaction'
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    const auth = await authenticateWorkspace(request)
    sameOrigin(request)
    const type = request.headers.get('content-type') || ''
    if (!type.startsWith('multipart/form-data;'))
      throw new WorkspaceError('Dépôt multipart requis.')
    const bytes = await limitedBody(request, 10_100_000)
    const form = await new Response(new Uint8Array(bytes).buffer as ArrayBuffer, {
      headers: { 'Content-Type': type },
    }).formData()
    const file = form.get('file')
    const revision = Number(form.get('revision'))
    if (
      !(file instanceof File) ||
      !Number.isInteger(revision) ||
      revision < 0 ||
      file.size < 1 ||
      file.size > 10_000_000
    )
      throw new WorkspaceError('Média invalide ou supérieur à 10 Mo.')
    const buffer = Buffer.from(await file.arrayBuffer())
    let mime = ''
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) mime = 'image/jpeg'
    else if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
      mime = 'image/png'
    else if (
      buffer.subarray(0, 4).toString() === 'RIFF' &&
      buffer.subarray(8, 12).toString() === 'WEBP'
    )
      mime = 'image/webp'
    else if (buffer.subarray(4, 8).toString() === 'ftyp') mime = 'video/mp4'
    else if (file.name.toLowerCase().endsWith('.pdf')) mime = documentMime(file.name, buffer)
    if (!['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf'].includes(mime))
      throw new WorkspaceError('Format de média non reconnu.')
    if (form.get('kind') === 'image' && !mime.startsWith('image/'))
      throw new WorkspaceError('Choisir une image JPEG, PNG ou WebP pour ce champ.')
    return jsonResponse(
      await workspaceTransaction(auth, 'content', revision, async (req, current) => {
        const result = await auth.payload.create({
          collection: 'media',
          locale: 'fr',
          fallbackLocale: false,
          draft: true,
          overrideAccess: false,
          user: auth.user,
          req,
          data: {
            title: String(form.get('title') || file.name).slice(0, 5000),
            visibility: 'private',
            publicationStatus: 'draft',
          },
          file: {
            data: buffer,
            mimetype: mime,
            name: safeDocumentName(file.name, 200),
            size: buffer.length,
          },
        })
        const entry = sourceEntry('media', result as unknown as Record<string, unknown>)
        const db = transactionDb(req)
        await db.execute(
          sql`INSERT INTO cms_authoring_entries(id,module,reference,shared,variants,comment,public_variants,updated_at,source_collection,source_id,source_revision) VALUES(${entry.id},'media',${entry.reference},${JSON.stringify(entry.shared)}::jsonb,${JSON.stringify(entry.variants)}::jsonb,'','{}'::jsonb,${entry.updatedAt},'media',${String(result.id)},${result.updatedAt})`,
        )
        await db.execute(
          sql`UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'`,
        )
        await db.execute(
          sql`INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role) VALUES('content',${entry.id},'Téléversement d’un média privé',${auth.actor.id},${auth.actor.role})`,
        )
        return { workspace: await contentSnapshot(req), revision: current + 1, entry }
      }),
    )
  } catch (error) {
    return workspaceFailure(error)
  }
}
