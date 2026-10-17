import { sql } from '@payloadcms/db-postgres'
import { authenticateWorkspace, workspaceFailure, WorkspaceError } from '@/lib/cms-workspace/auth'
export const dynamic = 'force-dynamic'
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { payload } = await authenticateWorkspace(request)
    const { id } = await params
    if (id.length > 200) throw new WorkspaceError('Document introuvable.', 404)
    const result = await payload.db.drizzle.execute(
      sql`SELECT name,mime,content FROM cms_candidate_documents WHERE id=${id}`,
    )
    const record = result.rows[0]
    if (!record || !Buffer.isBuffer(record.content))
      throw new WorkspaceError('Document introuvable.', 404)
    const file = record.content
    const range = request.headers.get('range')
    let start = 0
    let end = file.length - 1
    const headers = new Headers({
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Type': String(record.mime),
      'Accept-Ranges': 'bytes',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'self'",
      'Content-Disposition': `${record.mime === 'application/pdf' && !new URL(request.url).searchParams.has('download') ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(String(record.name))}`,
    })
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range)
      if (!match)
        return new Response(null, {
          status: 416,
          headers: {
            'Content-Range': `bytes */${file.length}`,
            'Cache-Control': 'private, no-store',
          },
        })
      start = Number(match[1])
      end = match[2] ? Number(match[2]) : end
      if (start > end || end >= file.length)
        return new Response(null, {
          status: 416,
          headers: {
            'Content-Range': `bytes */${file.length}`,
            'Cache-Control': 'private, no-store',
          },
        })
      headers.set('Content-Range', `bytes ${start}-${end}/${file.length}`)
    }
    headers.set('Content-Length', String(end - start + 1))
    return new Response(new Uint8Array(file.subarray(start, end + 1)), {
      status: range ? 206 : 200,
      headers,
    })
  } catch (error) {
    return workspaceFailure(error)
  }
}
