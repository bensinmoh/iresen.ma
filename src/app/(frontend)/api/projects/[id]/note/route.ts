import { onDemandProjectNote } from '@/lib/project-note-document'
import { isContentLocale } from '@/lib/content/publication'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
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
  let bytes: Buffer | null
  try {
    bytes = await onDemandProjectNote(id, locale)
  } catch (error) {
    console.error('Project PDF generation failed', { reference: id, locale, error })
    // Rendering is retryable; never fall back to an outdated archived PDF.
    return new Response(null, { status: 503, headers: { ...headers, 'Retry-After': '5' } })
  }
  if (!bytes) return new Response(null, { status: 404, headers })
  return new Response(new Uint8Array(bytes), {
    headers: {
      ...headers,
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${id}-${locale}.pdf"`,
    },
  })
}
