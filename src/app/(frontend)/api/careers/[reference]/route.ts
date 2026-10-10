import { isLocale } from '@/i18n/locales'
import { careerText } from '@/lib/careers'
import { findCareerOffers } from '@/lib/content/careers'

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
