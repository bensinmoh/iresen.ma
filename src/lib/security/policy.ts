/** The public server never exposes administrative mutation surfaces by default. */
export function administrationEnabled() {
  if (process.env.PUBLIC_RELEASE === 'true') return false
  return process.env.NODE_ENV !== 'production' || process.env.CMS_ADMIN_ENABLED === 'true'
}
export function publicCmsRequestAllowed(method: string, pathname: string) {
  return ['GET', 'HEAD'].includes(method) && /^\/api\/media\/file\/[^/]+$/.test(pathname)
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
