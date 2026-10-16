import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { projectReadActor } from '@/lib/projects'
import { isContentLocale } from '@/lib/content/publication'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' }

/** Same publication/locale gates as the catalogue; withdrawal immediately closes media URLs. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; kind: string }> },
) {
  const { id, kind } = await params
  const locale = new URL(request.url).searchParams.get('locale')
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ||
    !['image', 'portrait'].includes(kind) ||
    !isContentLocale(locale)
  )
    return new Response(null, { status: 404, headers })
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'projects',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    user: projectReadActor(),
    draft: false,
    depth: 0,
    limit: 1,
    where: {
      and: [
        { reference: { equals: id } },
        { visibility: { equals: 'public' } },
        { _status: { equals: 'published' } },
        { publicationStatus: { in: ['published', 'review'] } },
      ],
    },
    select: { imagePath: true, portraitPath: true, title: true, description: true },
  })
  const record = result.docs[0]
  const expected = `/api/projects/${id}/asset/${kind}`
  if (
    !record?.title?.trim() ||
    !record.description?.trim() ||
    (kind === 'image' ? record.imagePath : record.portraitPath) !== expected
  )
    return new Response(null, { status: 404, headers })
  try {
    const root = path.resolve(process.env.PROJECTS_ASSET_DIRECTORY || '.local/projects/assets')
    const file = await readFile(path.join(root, id, `${kind}.webp`))
    return new Response(file, { headers: { ...headers, 'Content-Type': 'image/webp' } })
  } catch {
    return new Response(null, { status: 404, headers })
  }
}
