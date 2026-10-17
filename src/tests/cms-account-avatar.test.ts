import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PgDialect } from '@payloadcms/db-postgres/drizzle/pg-core'

const mocks = vi.hoisted(() => ({ authenticate: vi.fn(), execute: vi.fn() }))
vi.mock('@/lib/cms-workspace/auth', () => ({
  authenticateWorkspace: mocks.authenticate,
  WorkspaceError: class extends Error {
    constructor(
      message: string,
      public status: number,
    ) {
      super(message)
    }
  },
  workspaceFailure: (error: { status?: number }) =>
    new Response(null, { status: error.status ?? 500 }),
}))
import { GET } from '@/app/(cms-preview)/admin/api/avatar/route'

beforeEach(() => {
  vi.resetAllMocks()
  mocks.authenticate.mockResolvedValue({
    user: { id: 55 },
    payload: { db: { drizzle: { execute: mocks.execute } } },
  })
})
describe('private own-account profile portraits', () => {
  it('requires authentication before reading any image bytes', async () => {
    mocks.authenticate.mockRejectedValue({ status: 401 })
    expect((await GET(new Request('http://localhost/admin/api/avatar'))).status).toBe(401)
    expect(mocks.execute).not.toHaveBeenCalled()
  })
  it('uses only the authenticated account and prevents shared caching/indexing', async () => {
    const bytes = Buffer.from('private-avatar-fixture')
    mocks.execute.mockResolvedValue({ rows: [{ content: bytes, mime: 'image/webp' }] })
    const response = await GET(new Request('http://localhost/admin/api/avatar?user_id=999'))
    expect(new PgDialect().sqlToQuery(mocks.execute.mock.calls[0][0]).params).toEqual([55])
    expect(response.headers.get('cache-control')).toBe('private, no-store')
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(response.headers.get('content-type')).toBe('image/webp')
    expect(Buffer.from(await response.arrayBuffer())).toEqual(bytes)
  })
  it('returns 404 for an account without a portrait', async () => {
    mocks.execute.mockResolvedValue({ rows: [] })
    expect((await GET(new Request('http://localhost/admin/api/avatar'))).status).toBe(404)
  })
})
