import { findProjects } from '@/lib/projects'
import { currentProjectNote } from '@/lib/project-notes'
import { isContentLocale } from '@/lib/content/publication'

export const dynamic = 'force-dynamic'
const headers = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const locale = new URL(request.url).searchParams.get('locale')
  // All withdrawn demonstration URLs remain closed without querying real records.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || /^demo-\d{3}$/.test(id) || !isContentLocale(locale))
    return new Response(null, { status: 404, headers })
  const project = (await findProjects(locale, id))[0]
  if (!project) return new Response(null, { status: 404, headers })
  const bytes = await currentProjectNote(id, locale)
  if (!bytes) return new Response(null, { status: 404, headers })
  return new Response(bytes, {
    headers: {
      ...headers,
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${id}-${locale}.pdf"`,
    },
  })
}
