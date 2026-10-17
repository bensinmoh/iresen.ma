// Next can construct the internal request URL with the listening hostname while
// the browser uses another hostname. Host is the actual request authority; proxy
// forwarding headers are deliberately not trusted here.
export function matchesRequestOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin || origin === 'null') return false
  try {
    const url = new URL(request.url)
    const host = request.headers.get('host') ?? url.host
    if (/[\s/\\?#@,]/.test(host)) return false
    const expected = new URL(`${url.protocol}//${host}`)
    return ['http:', 'https:'].includes(expected.protocol) && origin === expected.origin
  } catch {
    return false
  }
}

// Explicit loopback aliases only in development, with the configured scheme/port.
// Production CSRF origins remain exactly those configured by the owner.
export function developmentCsrfOrigins(siteURL: string, environment: string | undefined): string[] {
  const origins = [siteURL]
  if (environment !== 'development') return origins
  try {
    const local = new URL(siteURL)
    if (!['localhost', '127.0.0.1', '[::1]'].includes(local.hostname)) return origins
    for (const host of ['localhost', '127.0.0.1', '[::1]']) {
      const alias = new URL(local.origin)
      alias.hostname = host
      if (!origins.includes(alias.origin)) origins.push(alias.origin)
    }
  } catch {
    /* Invalid configuration remains subject to Payload's own validation. */
  }
  return origins
}
