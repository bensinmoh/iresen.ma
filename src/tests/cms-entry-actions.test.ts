import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createEntry } from '@/lib/cms-preview/model'
const mocks = vi.hoisted(() => ({
  execute: vi.fn(),
  snapshot: vi.fn(),
  transaction: vi.fn(),
  sync: vi.fn(),
  index: vi.fn(),
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
vi.mock('@/lib/cms-workspace/sources', () => ({ syncSource: mocks.sync }))
vi.mock('@/lib/search/indexer', () => ({ rebuildSearchIndex: mocks.index }))
import { deletionImpact } from '@/lib/cms-workspace/delete-impact'
import { deletionReferences } from '@/lib/cms-preview/delete-impact'
import { contentAction } from '@/lib/cms-workspace/actions'
import type { AuthenticatedWorkspace } from '@/lib/cms-workspace/auth'
const admin = { actor: { id: 1, role: 'admin' } } as AuthenticatedWorkspace
const editor = { actor: { id: 2, role: 'editor' } } as AuthenticatedWorkspace
beforeEach(() => {
  vi.resetAllMocks()
  mocks.execute.mockResolvedValue({ rows: [] })
  mocks.transaction.mockImplementation((_auth, _scope, _revision, callback) => callback({}, 12))
  mocks.sync.mockImplementation(async (entry) => entry)
})
function fixture() {
  const entry = createEntry('faq', 'faq-fixture', '2026-10-16')
  entry.variants.fr = {
    ...entry.variants.fr,
    title: 'Question source',
    body: 'Réponse source',
    status: 'published',
  }
  entry.publicVariants.fr = structuredClone(entry.variants.fr)
  const workspace = { version: 1, entries: [entry], logs: [] }
  mocks.snapshot.mockResolvedValue(workspace)
  return { entry, workspace }
}
describe('content actions and recoverable deletion', () => {
  it('rejects editor deletion before opening a transaction', async () => {
    await expect(contentAction(editor, 'x', 'delete', 'fr', '', 12)).rejects.toMatchObject({
      status: 403,
    })
    expect(mocks.transaction).not.toHaveBeenCalled()
  })
  it('reopens an approved snapshot for review without editing or withdrawing the approved version', async () => {
    const { entry } = fixture()
    await contentAction(admin, entry.id, 'review', 'fr', 'Nouvelle vérification', 12)
    expect(mocks.transaction.mock.calls[0][2]).toBe(12)
    const updated = mocks.sync.mock.calls[0][0]
    expect(updated.variants.fr.status).toBe('review')
    expect(updated.publicVariants.fr).toEqual(entry.publicVariants.fr)
    expect(updated.variants.fr.body).toBe(entry.variants.fr.body)
  })
  it('requires a reason to return a reviewed entry to draft', async () => {
    const { entry } = fixture()
    entry.variants.fr.status = 'review'
    await expect(contentAction(admin, entry.id, 'draft', 'fr', '', 12)).rejects.toThrow('motif')
  })
  it('blocks deletion of a media entry referenced by a project', async () => {
    const media = createEntry('media', 'image-fixture', '2026-10-16')
    const project = createEntry('projects', 'project-fixture', '2026-10-16')
    project.shared.imageId = media.id
    mocks.snapshot.mockResolvedValue({ version: 1, entries: [media, project], logs: [] })
    await expect(contentAction(admin, media.id, 'delete', 'fr', '', 12)).rejects.toMatchObject({
      status: 409,
    })
  })
  it('requires a preview token and rejects a changed impact', async () => {
    const { entry } = fixture()
    await expect(contentAction(admin, entry.id, 'delete', 'fr', '', 12)).rejects.toMatchObject({
      status: 409,
    })
    const impact = await deletionImpact(admin, entry.id, 12)
    expect(impact.languages).toHaveLength(3)
    expect(impact.blockers).toEqual([])
    entry.variants.fr.body = 'Modification après aperçu'
    await expect(
      contentAction(admin, entry.id, 'delete', 'fr', '', 12, impact.token),
    ).rejects.toMatchObject({ status: 409 })
  })
  it('allows a deletion only after an unchanged impact preview', async () => {
    const { entry } = fixture()
    const impact = await deletionImpact(admin, entry.id, 12)
    await contentAction(admin, entry.id, 'delete', 'fr', 'Vérifié', 12, impact.token)
    const { PgDialect } = await import('@payloadcms/db-postgres/drizzle/pg-core')
    expect(
      mocks.execute.mock.calls.some(([query]) =>
        new PgDialect().sqlToQuery(query).sql.includes('INSERT INTO cms_deleted_entries'),
      ),
    ).toBe(true)
  })
  it('reports candidates without exposing their personal data and blocks deletion', async () => {
    const { entry } = fixture()
    mocks.execute.mockResolvedValue({ rows: [{ count: 3 }] })
    const impact = await deletionImpact(admin, entry.id, 12)
    expect(impact.applications).toBe(3)
    expect(impact.blockers.join(' ')).toContain('Clôturer')
    await expect(
      contentAction(admin, entry.id, 'delete', 'fr', '', 12, impact.token),
    ).rejects.toMatchObject({ status: 409 })
  })
  it('detects relations in approved translations even when the draft removed them', () => {
    const media = createEntry('media', 'media-fixture', '2026-10-16')
    const project = createEntry('projects', 'project-fixture', '2026-10-16')
    project.publicVariants.ar = structuredClone(project.variants.ar)
    project.publicVariants.ar.fields.imageId = media.id
    const impact = deletionReferences(media, [media, project])
    expect(impact.inbound[0].id).toBe(project.id)
  })
  it('detects embedded static media paths as dependencies and preserves outgoing media', () => {
    const media = createEntry('media', 'media-fixture', '2026-10-16')
    media.shared.assetPath = '/images/real-source.webp'
    const news = createEntry('news', 'news-fixture', '2026-10-16')
    news.shared.sourceImagePath = media.shared.assetPath
    expect(deletionReferences(media, [media, news]).inbound[0].id).toBe(news.id)
    news.shared.heroImage = media.id
    expect(deletionReferences(news, [media, news]).outgoing[0].id).toBe(media.id)
  })
  it('checks native draft and published uploads in every locale', async () => {
    const { entry, workspace } = fixture()
    entry.module = 'media'
    entry.source = { collection: 'media', id: 23, revision: '2026-10-16' }
    const find = vi
      .fn()
      .mockResolvedValue({ docs: [{ id: 99, title: 'Actualité liée' }], hasNextPage: false })
    mocks.transaction.mockImplementation((_auth, _scope, _revision, callback) =>
      callback({ payload: { find } }, 12),
    )
    const impact = await deletionImpact(admin, entry.id, 12)
    expect(find).toHaveBeenCalledTimes(12)
    expect(new Set(find.mock.calls.map(([options]) => options.locale))).toEqual(
      new Set(['fr', 'en', 'ar']),
    )
    expect(new Set(find.mock.calls.map(([options]) => options.draft))).toEqual(
      new Set([true, false]),
    )
    expect(impact.inbound).toHaveLength(2)
    expect(impact.blockers).toHaveLength(1)
    expect(workspace.entries).toHaveLength(1)
  })
  it('requires replacing the highlighted article before deletion', async () => {
    const { entry } = fixture()
    entry.module = 'news'
    entry.shared.highlight = 'true'
    const impact = await deletionImpact(admin, entry.id, 12)
    expect(impact.blockers.join(' ')).toContain('Choisir un autre article')
  })
  it('restores only as a private draft with no published snapshot', async () => {
    const { entry } = fixture()
    entry.shared.visibility = 'public'
    mocks.execute
      .mockResolvedValueOnce({ rows: [{ snapshot: entry }] })
      .mockResolvedValue({ rows: [] })
    await contentAction(admin, entry.id, 'restore', 'fr', '', 12)
    const { PgDialect } = await import('@payloadcms/db-postgres/drizzle/pg-core')
    const queries = mocks.execute.mock.calls.map(([query]) => new PgDialect().sqlToQuery(query))
    const update = queries.find((query) => query.sql.includes('UPDATE cms_authoring_entries'))!
    const shared = JSON.parse(update.params[0] as string)
    const variants = JSON.parse(update.params[1] as string)
    expect(shared.visibility).toBe('private')
    expect(
      Object.values(variants).every(
        (variant) => (variant as { status: string }).status === 'draft',
      ),
    ).toBe(true)
    expect(JSON.parse(update.params[2] as string)).toEqual({})
  })
})
