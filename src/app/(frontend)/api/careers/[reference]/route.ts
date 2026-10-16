import { isLocale } from '@/i18n/locales'
import { careerText } from '@/lib/careers'
import { findCareerOffers } from '@/lib/content/careers'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import documents from '@/data/career-documents.json'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params
  const locale = new URL(request.url).searchParams.get('locale')
  if (!locale || !isLocale(locale) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(reference))
    return new Response(null, { status: 404 })
  const offers = await findCareerOffers(locale)
  const offer = offers.find((offer) => offer.reference === reference)
  if (!offer) return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
  const document = documents[reference as keyof typeof documents]
  if (document) {
    if (locale !== document.locale)
      return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } })
    const bytes = await readFile(path.join(process.cwd(), 'assets/careers', document.file))
    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${document.file}"`,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }
  return new Response('IRESEN\n' + offer.reference + '\n\n' + careerText(offer), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${reference}-${locale}.txt"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
