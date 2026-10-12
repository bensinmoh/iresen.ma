import {
  administrationEnabled,
  publicCmsRequestAllowed,
  contentSecurityPolicy,
} from '@/lib/security/policy'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { defaultLocale, isLocale } from '@/i18n/locales'
import { pageIds, pages, isNewsListingPath, pageHref } from '@/lib/site'
import { newsSlugFromPath } from '@/lib/content/routes'
import { callReferenceFromPath } from '@/lib/calls'
import { searchDatabase } from '@/lib/search/database'

const handleLocaleRouting = createMiddleware(routing)

async function localeResponse(request: NextRequest) {
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

  const callReference = callReferenceFromPath(pagePath, locale)
  // Decide before streaming so a private/missing translation is a real HTTP 404.
  // This is the live guarded source view, not a potentially stale search index.
  const publicCall = callReference
    ? (
        await searchDatabase().query(
          "SELECT 1 FROM search_public_sources WHERE origin='calls' AND slug=$1 AND locale=$2 LIMIT 1",
          [callReference, locale],
        )
      ).rowCount === 1
    : false
  if (
    isKnownPage ||
    isNewsListingPath(pagePath, locale) ||
    newsSlugFromPath(pagePath, locale) ||
    publicCall
  )
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

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path === '/admin' || path.startsWith('/admin/')) {
    if (!administrationEnabled())
      return new NextResponse(null, {
        status: 404,
        headers: { 'Cache-Control': 'private, no-store' },
      })
    return NextResponse.next()
  }
  if (path === '/cms-preview' || path.startsWith('/cms-preview/')) {
    if (
      process.env.PUBLIC_RELEASE === 'true' ||
      (process.env.NODE_ENV === 'production' && process.env.CMS_LOCAL_REVIEW !== 'true')
    )
      return new NextResponse(null, {
        status: 404,
        headers: { 'Cache-Control': 'private, no-store' },
      })
    return NextResponse.next()
  }
  if (path.startsWith('/api/')) {
    if (path === '/api/search' || path.startsWith('/api/careers/')) return NextResponse.next()
    if (!administrationEnabled() && !publicCmsRequestAllowed(request.method, path))
      return new NextResponse(null, {
        status: 404,
        headers: { 'Cache-Control': 'private, no-store' },
      })
    return NextResponse.next()
  }
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const policy = contentSecurityPolicy(nonce, process.env.NODE_ENV !== 'production')
  const headers = new Headers(request.headers)
  headers.set('x-nonce', nonce)
  headers.set('content-security-policy', policy)
  const response = await localeResponse(new NextRequest(request, { headers }))
  response.headers.set('Content-Security-Policy', policy)
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/cms-preview/:path*',
    '/((?!api(?:/|$)|admin(?:/|$)|cms-preview(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|.*\\..*).*)',
    '/fr/:path*',
    '/en/:path*',
    '/ar/:path*',
  ],
}
