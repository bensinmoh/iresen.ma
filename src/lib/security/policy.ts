/** The public server never exposes administrative mutation surfaces by default. */
export function administrationEnabled() {
  if (process.env.PUBLIC_RELEASE === 'true') return false
  return process.env.NODE_ENV !== 'production' || process.env.CMS_ADMIN_ENABLED === 'true'
}
/** Private custom CMS entry, including its authenticated workspace endpoints. */
export function cmsInterfaceEnabled() {
  if (process.env.PUBLIC_RELEASE === 'true') return process.env.CMS_WORKSPACE_ENABLED === 'true'
  return (
    process.env.PUBLIC_RELEASE !== 'true' &&
    (process.env.NODE_ENV !== 'production' ||
      (process.env.CMS_LOCAL_REVIEW === 'true' &&
        process.env.CMS_INTERFACE_PREVIEW_ENABLED === 'true'))
  )
}
export function publicCmsRequestAllowed(method: string, pathname: string) {
  return (
    ['GET', 'HEAD'].includes(method) &&
    (/^\/api\/media\/file\/[^/]+$/.test(pathname) ||
      /^\/api\/projects\/[a-z0-9]+(?:-[a-z0-9]+)*\/(?:asset\/(image|portrait)|note)$/.test(
        pathname,
      ))
  )
}
/** Public media reads must not inherit staff privileges from an old cookie/API token. */
export function anonymousCmsRequest(source: Pick<Request, 'url' | 'method' | 'headers'>) {
  const headers = new Headers(source.headers)
  headers.delete('cookie')
  headers.delete('authorization')
  // Rebuild from primitives: Next's wrapped request can have a different private
  // state brand from the runtime Request constructor. Only GET/HEAD reaches here.
  return new Request(source.url, { method: source.method, headers })
}
export function contentSecurityPolicy(nonce: string, development: boolean) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ''}`,
    // Native React style attributes and the existing responsive navigation style are required.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "media-src 'self' blob:",
    `connect-src 'self'${development ? ' ws: wss:' : ''}`,
    "frame-src 'self' https://www.google.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(development ? [] : ['upgrade-insecure-requests']),
  ].join('; ')
}
