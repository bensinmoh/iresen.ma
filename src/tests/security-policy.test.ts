import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  administrationEnabled,
  cmsInterfaceEnabled,
  anonymousCmsRequest,
  contentSecurityPolicy,
  publicCmsRequestAllowed,
} from '@/lib/security/policy'
import { searchClientKey } from '@/lib/security/search-limit'
afterEach(() => vi.unstubAllEnvs())
describe('public production boundaries', () => {
  it('closes admin even when a conflicting opt-in exists in a public release', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('CMS_ADMIN_ENABLED', 'true')
    vi.stubEnv('PUBLIC_RELEASE', 'true')
    expect(administrationEnabled()).toBe(false)
  })
  it('preserves both local review opt-ins for the renamed custom CMS', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('PUBLIC_RELEASE', 'false')
    vi.stubEnv('CMS_LOCAL_REVIEW', 'true')
    vi.stubEnv('CMS_INTERFACE_PREVIEW_ENABLED', 'false')
    expect(cmsInterfaceEnabled()).toBe(false)
    vi.stubEnv('CMS_INTERFACE_PREVIEW_ENABLED', 'true')
    expect(cmsInterfaceEnabled()).toBe(true)
    vi.stubEnv('PUBLIC_RELEASE', 'true')
    expect(cmsInterfaceEnabled()).toBe(false)
  })
  it('allows public media bytes only, never raw collections or writes', () => {
    expect(publicCmsRequestAllowed('GET', '/api/media/file/photo.webp')).toBe(true)
    expect(publicCmsRequestAllowed('GET', '/api/projects/microcsp/asset/image')).toBe(true)
    expect(publicCmsRequestAllowed('POST', '/api/projects/microcsp/asset/image')).toBe(false)
    for (const path of [
      '/api/users',
      '/api/projects',
      '/api/projects/microcsp/asset/secret',
      '/api/pages',
      '/api/users/login',
      '/api/media/file/a/../secret',
    ])
      expect(publicCmsRequestAllowed('GET', path)).toBe(false)
    expect(publicCmsRequestAllowed('POST', '/api/media/file/photo.webp')).toBe(false)
  })
  it('forces public CMS bytes to anonymous access while preserving range and locale headers', () => {
    const original = new Headers({
      Cookie: 'payload-token=staff-token; iresen_consent=choice',
      Authorization: 'Bearer staff-token',
      Range: 'bytes=0-1023',
      'Accept-Language': 'ar',
    })
    const anonymous = anonymousCmsRequest({
      url: 'https://example.test/api/media/file/approved.pdf?locale=ar',
      method: 'GET',
      headers: original,
    })
    expect(anonymous.url).toBe('https://example.test/api/media/file/approved.pdf?locale=ar')
    expect(anonymous.method).toBe('GET')
    const headers = anonymous.headers
    expect(headers.has('cookie')).toBe(false)
    expect(headers.has('authorization')).toBe(false)
    expect(headers.get('range')).toBe('bytes=0-1023')
    expect(headers.get('accept-language')).toBe('ar')
    expect(original.has('cookie')).toBe(true)
  })
  it('uses nonce scripts without unsafe-eval in production', () => {
    const csp = contentSecurityPolicy('random-nonce', false)
    expect(csp).toContain("'nonce-random-nonce'")
    expect(csp).not.toContain('unsafe-eval')
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-src 'self' https://www.google.com")
  })
  it('ignores spoofable headers unless the proxy trust contract is explicitly set', () => {
    vi.stubEnv('PAYLOAD_SECRET', 'test-only-32-characters-secret-key')
    vi.stubEnv('TRUSTED_PROXY_CLIENT_IP_HEADER', '')
    expect(searchClientKey(new Headers({ 'cf-connecting-ip': '192.0.2.1' }))).toBe(
      searchClientKey(new Headers({ 'cf-connecting-ip': '192.0.2.2' })),
    )
    vi.stubEnv('TRUSTED_PROXY_CLIENT_IP_HEADER', 'cf-connecting-ip')
    expect(searchClientKey(new Headers({ 'cf-connecting-ip': '192.0.2.1' }))).not.toBe(
      searchClientKey(new Headers({ 'cf-connecting-ip': '192.0.2.2' })),
    )
    expect(searchClientKey(new Headers({ 'cf-connecting-ip': '192.0.2.1' }))).toMatch(
      /^[a-f0-9]{64}$/,
    )
  })
})
