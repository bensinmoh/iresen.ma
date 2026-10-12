import {
  administrationEnabled,
  anonymousCmsHeaders,
  publicCmsRequestAllowed,
} from '@/lib/security/policy'
import { NextRequest } from 'next/server'
import config from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

function guard(handler: ReturnType<typeof REST_GET>) {
  return async (...args: Parameters<typeof handler>) => {
    const [request, context] = args
    if (!administrationEnabled()) {
      if (!publicCmsRequestAllowed(request.method, new URL(request.url).pathname))
        return new Response(null, {
          status: 404,
          headers: { 'Cache-Control': 'private, no-store' },
        })
      return handler(
        new NextRequest(request, { headers: anonymousCmsHeaders(request.headers) }),
        context,
      )
    }
    return handler(...args)
  }
}
export const GET = guard(REST_GET(config))
export const POST = guard(REST_POST(config))
export const DELETE = guard(REST_DELETE(config))
export const PATCH = guard(REST_PATCH(config))
export const PUT = guard(REST_PUT(config))
export const OPTIONS = guard(REST_OPTIONS(config))
