import { afterAll, describe, expect, it, vi } from 'vitest'
import { consumeSearchRequest, searchClientKey } from '@/lib/security/search-limit'
import { searchDatabase } from '@/lib/search/database'
const enabled = process.env.CMS_INTEGRATION === '1'
describe.skipIf(!enabled)('atomic shared public search quota', () => {
  afterAll(() => vi.unstubAllEnvs())
  it('permits 60 concurrent requests and rejects the 61st across independent calls', async () => {
    vi.stubEnv('TRUSTED_PROXY_CLIENT_IP_HEADER', 'x-real-ip')
    const headers = new Headers({ 'x-real-ip': '192.0.2.240' })
    const key = searchClientKey(headers)
    await searchDatabase().query('DELETE FROM public_search_limits WHERE client_key=$1', [key])
    try {
      const results = await Promise.all(
        Array.from({ length: 61 }, () => consumeSearchRequest(headers)),
      )
      expect(results.filter((r) => r.allowed)).toHaveLength(60)
      expect(results.find((r) => !r.allowed)?.retryAfter).toBeGreaterThan(0)
      const rows = await searchDatabase().query(
        'SELECT client_key,requests FROM public_search_limits WHERE client_key=$1',
        [key],
      )
      expect(rows.rows[0]).toMatchObject({ client_key: key, requests: 61 })
    } finally {
      await searchDatabase().query('DELETE FROM public_search_limits WHERE client_key=$1', [key])
    }
  })
})
