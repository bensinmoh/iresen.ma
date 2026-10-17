import {
  administrationEnabled,
  cmsInterfaceEnabled,
  publicCmsRequestAllowed,
  contentSecurityPolicy,
} from '@/lib/security/policy'
import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'
import { defaultLocale, isLocale } from '@/i18n/locales'
import {
  pageIds,
  pages,
  isNewsListingPath,
  pageHref,
  pageIdFromPathname,
  newsListingPaths,
} from '@/lib/site'
import { newsSlugFromPath } from '@/lib/content/routes'
import { findArchiveCall } from '@/lib/call-archives'
import { callReferenceFromPath, callsListingReference } from '@/lib/calls'
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

  // Resolve canonical localized pages directly. Rewriting the catch-all to an
  // internal next-intl pathname can redirect back to the same public URL.
  const localizedPageId = pageIdFromPathname(pagePath, locale)
  if (
    hasLocale &&
    ((localizedPageId && pages[localizedPageId].pathnames[locale] === pagePath) ||
      pagePath === newsListingPaths[locale])
  ) {
    const localeHeaders = new Headers(request.headers)
    localeHeaders.set('x-next-intl-locale', locale)
    return NextResponse.next({ request: { headers: localeHeaders } })
  }

  const callReference = callReferenceFromPath(pagePath, locale)
  // Decide before streaming so a private/missing translation is a real HTTP 404.
  // This is the live guarded source view, not a potentially stale search index.
  const publicCall =
    callReference === callsListingReference ||
    Boolean(callReference && findArchiveCall(callReference)) ||
    (callReference
      ? (
          await searchDatabase().query(
            "SELECT 1 FROM search_public_sources WHERE origin='calls' AND slug=$1 AND locale=$2 LIMIT 1",
            [callReference, locale],
          )
        ).rowCount === 1
      : false)
  if (hasLocale && callReference && !publicCall) {
    const localeHeaders = new Headers(request.headers)
    localeHeaders.set('x-next-intl-locale', locale)
    return NextResponse.next({
      status: 404,
      request: { headers: localeHeaders },
      headers: { 'X-Robots-Tag': 'noindex, nofollow' },
    })
  }
  if (
    isKnownPage ||
    isNewsListingPath(pagePath, locale) ||
    newsSlugFromPath(pagePath, locale) ||
    publicCall
  )
    return handleLocaleRouting(request)

  // Canonical unknown locale paths already reach the catch-all. Forward their
  // locale directly instead of rewriting the request back to the same URL.
  const localeHeaders = new Headers(request.headers)
  localeHeaders.set('x-next-intl-locale', locale)
  const options = {
    status: 404,
    request: { headers: localeHeaders },
    headers: { 'X-Robots-Tag': 'noindex, nofollow' },
  }
  if (hasLocale) return NextResponse.next(options)
  const localizedUrl = request.nextUrl.clone()
  localizedUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.rewrite(localizedUrl, options)
}

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path === '/cms-preview' || path.startsWith('/cms-preview/')) {
    if (!cmsInterfaceEnabled())
      return new NextResponse(null, {
        status: 404,
        headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' },
      })
    const destination = request.nextUrl.clone()
    destination.pathname = path.replace(/^\/cms-preview(?=\/|$)/, '/admin')
    return NextResponse.redirect(destination, 308)
  }
  if (path === '/admin' || path.startsWith('/admin/')) {
    const workspaceRoute =
      path === '/admin' || path === '/admin/api' || path.startsWith('/admin/api/')
    if (!(workspaceRoute ? cmsInterfaceEnabled() : administrationEnabled()))
      return new NextResponse(null, {
        status: 404,
        headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' },
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
