import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createEntry } from '@/lib/cms-preview/model'
const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
  snapshot: vi.fn(),
  transaction: vi.fn(),
  query: vi.fn(),
}))
vi.mock('@/lib/cms-workspace/auth', () => ({
  WorkspaceError: class extends Error {
    constructor(
      message: string,
      public status = 400,
    ) {
      super(message)
    }
  },
}))
vi.mock('@/lib/cms-workspace/content', () => ({ contentSnapshot: mocks.snapshot }))
vi.mock('@/lib/cms-workspace/transaction', () => ({
  transactionDb: () => ({ execute: mocks.execute }),
  workspaceTransaction: mocks.transaction,
}))
vi.mock('@/lib/search/database', () => ({ searchDatabase: () => ({ query: mocks.query }) }))
import { setNewsHighlight } from '@/lib/cms-workspace/news-highlight'
import { publicNewsHighlight } from '@/lib/cms-workspace/public-news-highlight'
import type { AuthenticatedWorkspace } from '@/lib/cms-workspace/auth'
const admin = { actor: { role: 'admin', id: 1 } } as AuthenticatedWorkspace
beforeEach(() => {
  vi.resetAllMocks()
  mocks.execute.mockResolvedValue({ rows: [] })
  mocks.transaction.mockImplementation((_auth, _scope, _revision, callback) => callback({}, 5))
})
afterEach(() => vi.unstubAllEnvs())
function fixture() {
  const first = createEntry('news', 'first', '2026-10-16')
  const next = createEntry('news', 'next', '2026-10-16')
  first.shared.highlight = 'true'
  next.shared.visibility = 'public'
  next.publicVariants.fr = { ...next.variants.fr, status: 'published' }
  mocks.snapshot.mockResolvedValue({ version: 1, entries: [first, next], logs: [] })
  return { first, next }
}
describe('unique article highlight', () => {
  it('rejects editors before opening a transaction', async () => {
    await expect(
      setNewsHighlight({ actor: { role: 'editor' } } as AuthenticatedWorkspace, 'x', 5),
    ).rejects.toMatchObject({ status: 403 })
    expect(mocks.transaction).not.toHaveBeenCalled()
  })
  it('clears the previous flag before setting the new flag and audits both identities', async () => {
    const { next } = fixture()
    await setNewsHighlight(admin, next.id, 5)
    const { PgDialect } = await import('@payloadcms/db-postgres/drizzle/pg-core')
    const queries = mocks.execute.mock.calls.map(([query]) => new PgDialect().sqlToQuery(query))
    expect(queries[0].sql).toContain('"false"')
    expect(queries[1].sql).toContain('"true"')
    expect(queries[1].params).toContain(next.id)
    expect(JSON.parse(queries[2].params.at(-1) as string)).toEqual({
      previousId: 'first',
      selectedId: 'next',
    })
  })
  it('rejects an unpublished article and a wrong module', async () => {
    const { next } = fixture()
    next.publicVariants = {}
    await expect(setNewsHighlight(admin, next.id, 5)).rejects.toMatchObject({ status: 409 })
    next.module = 'events'
    await expect(setNewsHighlight(admin, next.id, 5)).rejects.toMatchObject({ status: 404 })
    expect(mocks.execute).not.toHaveBeenCalled()
  })
  it('keeps the current selection idempotent', async () => {
    const { first } = fixture()
    first.shared.visibility = 'public'
    first.publicVariants.fr = { ...first.variants.fr, status: 'published' }
    const result = await setNewsHighlight(admin, first.id, 5)
    expect(result.revision).toBe(5)
    expect(mocks.execute).not.toHaveBeenCalled()
  })
  it('does not promote a missing or private translation publicly', async () => {
    vi.stubEnv('SITE_CONTENT_DATABASE_ENABLED', 'true')
    const { next } = fixture()
    mocks.query.mockResolvedValue({
      rows: [
        {
          reference: 'real-post',
          source_id: null,
          shared: next.shared,
          public_variants: next.publicVariants,
        },
      ],
    })
    expect(await publicNewsHighlight('fr')).toBe('news-real-post')
    expect(await publicNewsHighlight('ar')).toBeNull()
    next.publicVariants.fr!.fields._publishedShared = JSON.stringify({ visibility: 'private' })
    expect(await publicNewsHighlight('fr')).toBeNull()
  })
})
