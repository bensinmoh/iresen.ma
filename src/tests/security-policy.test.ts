import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  administrationEnabled,
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
  it('allows public media bytes only, never raw collections or writes', () => {
    expect(publicCmsRequestAllowed('GET', '/api/media/file/photo.webp')).toBe(true)
    for (const path of [
      '/api/users',
      '/api/pages',
      '/api/users/login',
      '/api/media/file/a/../secret',
    ])
      expect(publicCmsRequestAllowed('GET', path)).toBe(false)
    expect(publicCmsRequestAllowed('POST', '/api/media/file/photo.webp')).toBe(false)
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
