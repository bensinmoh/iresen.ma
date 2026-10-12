import 'server-only'
import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'
import { searchDatabase } from '@/lib/search/database'

export const SEARCH_REQUESTS_PER_MINUTE = 60
export function searchClientKey(headers: Pick<Headers, 'get'>) {
  const header = process.env.TRUSTED_PROXY_CLIENT_IP_HEADER
  // The reverse proxy must strip inbound values and overwrite this one header.
  const raw =
    header && ['cf-connecting-ip', 'x-real-ip'].includes(header) ? headers.get(header) : null
  const address = raw && isIP(raw.trim()) ? raw.trim() : 'unattributed'
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('Search limiter secret is not configured.')
  return createHmac('sha256', secret).update(`public-search:${address}`).digest('hex')
}
export async function consumeSearchRequest(headers: Pick<Headers, 'get'>) {
  const key = searchClientKey(headers)
  const db = searchDatabase()
  // Indexed, bounded expiry cleanup; raw addresses and typed queries are never stored.
  await db.query(`DELETE FROM public_search_limits WHERE ctid IN (
    SELECT ctid FROM public_search_limits WHERE expires_at <= clock_timestamp() LIMIT 100)`)
  const result = await db.query<{ requests: number; retry_after: number }>(
    `
    INSERT INTO public_search_limits (client_key, window_start, requests, expires_at)
    VALUES ($1, date_trunc('minute', clock_timestamp()), 1,
      date_trunc('minute', clock_timestamp()) + interval '1 minute')
    ON CONFLICT (client_key, window_start) DO UPDATE
      SET requests = LEAST(public_search_limits.requests + 1, 61)
    RETURNING requests, GREATEST(1, CEIL(EXTRACT(EPOCH FROM expires_at - clock_timestamp())))::int AS retry_after
  `,
    [key],
  )
  return {
    allowed: result.rows[0].requests <= SEARCH_REQUESTS_PER_MINUTE,
    retryAfter: result.rows[0].retry_after,
  }
}
