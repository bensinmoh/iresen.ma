import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { defaultLocale, isLocale } from '@/i18n/locales'
import { pageIds, pages, isNewsListingPath, pageHref } from '@/lib/site'
import { newsSlugFromPath } from '@/lib/content/routes'

const handleLocaleRouting = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  let pathname: string
  try {
    pathname = decodeURI(request.nextUrl.pathname).replace(/\/$/, '') || '/'
  } catch {
    // Let Next handle malformed URI encodings with its normal 400 response.
    return handleLocaleRouting(request)
  }

  const [, prefix, ...segments] = pathname.split('/')
  const locale = prefix && isLocale(prefix) ? prefix : defaultLocale
  const hasLocale = prefix === locale
  const pagePath = hasLocale ? `/${segments.join('/')}` : pathname
  const isKnownPage = pageIds.some(
    (id) => pages[id].pathnames[locale] === pagePath || pages[id].path === pagePath,
  )

  if (pagePath === pages.events.path || pagePath === pages.events.pathnames[locale]) {
    return NextResponse.redirect(new URL(pageHref('events', locale), request.url), 308)
  }

  if (isKnownPage || isNewsListingPath(pagePath, locale) || newsSlugFromPath(pagePath, locale))
    return handleLocaleRouting(request)

  // Set the HTTP status before rendering the localized unknown-page response.
  // Register future detail routes here alongside their shared page resolver.
  const localizedUrl = request.nextUrl.clone()
  if (!hasLocale) localizedUrl.pathname = `/${defaultLocale}${pathname}`
  const localizedRequest = hasLocale
    ? request
    : new NextRequest(localizedUrl, { headers: request.headers })
  const response = handleLocaleRouting(localizedRequest)
  const headers = new Headers(response.headers)
  headers.delete('link')
  headers.delete('x-middleware-next')
  headers.set('X-Robots-Tag', 'noindex, nofollow')
  return NextResponse.rewrite(localizedUrl, { status: 404, headers })
}

export const config = {
  matcher: [
    '/((?!api(?:/|$)|admin(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|.*\\..*).*)',
    '/fr/:path*',
    '/en/:path*',
    '/ar/:path*',
  ],
}
