import { describe, expect, it } from 'vitest'
import { developmentCsrfOrigins, matchesRequestOrigin } from '@/lib/cms-workspace/origin'
const request = (origin?: string, host = '127.0.0.1:3000', extra = {}) =>
  new Request('http://localhost:3000/admin/api/session', {
    headers: { host, ...(origin ? { origin } : {}), ...extra },
  })
describe('CMS same-origin write boundary', () => {
  it('uses the request authority when Next has an internal listening hostname', () => {
    expect(matchesRequestOrigin(request('http://127.0.0.1:3000'))).toBe(true)
    expect(matchesRequestOrigin(request('http://localhost:3000', 'localhost:3000'))).toBe(true)
  })
  it.each([
    undefined,
    'null',
    'http://localhost:3000',
    'http://127.0.0.1:3001',
    'https://127.0.0.1:3000',
    'https://attacker.invalid',
  ])('rejects a mismatching/missing origin %s', (origin) => {
    expect(matchesRequestOrigin(request(origin))).toBe(false)
  })
  it('ignores caller-supplied proxy headers', () => {
    expect(
      matchesRequestOrigin(
        request('https://attacker.invalid', '127.0.0.1:3000', {
          'x-forwarded-host': 'attacker.invalid',
          'x-forwarded-proto': 'https',
        }),
      ),
    ).toBe(false)
  })
  it.each(['attacker.invalid/path', 'user@attacker.invalid', 'attacker.invalid,127.0.0.1:3000'])(
    'rejects malformed Host %s',
    (host) => {
      expect(matchesRequestOrigin(request('http://attacker.invalid', host))).toBe(false)
    },
  )
})

describe('development loopback CSRF aliases', () => {
  it('keeps the configured port and does not add production or external aliases', () => {
    expect(developmentCsrfOrigins('http://localhost:3000', 'development')).toEqual([
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://[::1]:3000',
    ])
    expect(developmentCsrfOrigins('http://localhost:3000', 'production')).toEqual([
      'http://localhost:3000',
    ])
    expect(developmentCsrfOrigins('https://example.org', 'development')).toEqual([
      'https://example.org',
    ])
  })
})
