import { afterEach, describe, expect, it, vi } from 'vitest'
import { createEntry } from '@/lib/cms-preview/model'
const request = vi.hoisted(() => vi.fn())
vi.mock('@/lib/cms-workspace/client', () => ({ workspaceRequest: request }))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
  request.mockReset()
})
describe('authenticated client store across module refresh', () => {
  it('uploads an image with the current revision and keeps state intact after a failed retry', async () => {
    vi.stubGlobal('window', {})
    const store = await import('@/lib/cms-preview/store')
    const workspace = { version: 1 as const, entries: [], logs: [] }
    store.configureConnectedContent(workspace, 42)
    const entry = createEntry('media', 'media-99', '2026-10-16T20:00:00Z')
    entry.shared.assetPath = '/api/media/file/photo.png?locale=fr'
    const saved = { ...workspace, entries: [entry] }
    request.mockResolvedValueOnce({ workspace: saved, revision: 43, entry })
    const file = new File(['image bytes'], 'photo.png', { type: 'image/png' })
    expect(await store.uploadConnectedMedia(file, 'Portrait', 'image')).toEqual(entry)
    const body = request.mock.calls[0][1].body as FormData
    expect(body.get('kind')).toBe('image')
    expect(body.get('revision')).toBe('42')
    expect(body.get('file')).toBe(file)
    expect(store.getSnapshot()).toEqual(saved)
    request.mockRejectedValueOnce(new Error('Réseau indisponible'))
    await expect(store.uploadConnectedMedia(file, 'Portrait', 'image')).rejects.toThrow('Réseau')
    expect(store.getSnapshot()).toEqual(saved)
    request.mockResolvedValueOnce({ workspace: saved, revision: 44, entry })
    await store.uploadConnectedMedia(file, 'Portrait', 'image')
    expect(request.mock.calls[2][1].body.get('revision')).toBe('43')
  })
  it('keeps its database revision and never downgrades a connected save to localStorage', async () => {
    const localWrite = vi.fn()
    vi.stubGlobal('window', { localStorage: { setItem: localWrite } })
    const first = await import('@/lib/cms-preview/store')
    const workspace = { version: 1 as const, entries: [], logs: [] }
    first.configureConnectedContent(workspace, 42)
    vi.resetModules()
    const refreshed = await import('@/lib/cms-preview/store')
    expect(refreshed.contentConnected()).toBe(true)
    request.mockResolvedValue({ workspace, revision: 43 })
    await refreshed.persist(workspace)
    expect(JSON.parse(request.mock.calls[0][1].body).revision).toBe(42)
    expect(localWrite).not.toHaveBeenCalled()
    expect(refreshed.getSnapshot()).toEqual(workspace)
  })
  it('fails closed when the authenticated shell requires a missing database connection', async () => {
    const localWrite = vi.fn()
    vi.stubGlobal('window', { localStorage: { setItem: localWrite } })
    const store = await import('@/lib/cms-preview/store')
    await expect(store.persist({ version: 1, entries: [], logs: [] }, true)).rejects.toThrow(
      'connexion',
    )
    expect(localWrite).not.toHaveBeenCalled()
    expect(request).not.toHaveBeenCalled()
  })
  it('keeps recruitment persistence and authenticated document URLs connected', async () => {
    vi.stubGlobal('window', {})
    const first = await import('@/lib/cms-preview/recruitment-store')
    const state = {
      version: 1 as const,
      candidates: [],
      applications: [],
      documents: [],
      interviews: [],
      evaluations: [],
    }
    first.configureConnectedRecruitment(state, 17)
    vi.resetModules()
    const refreshed = await import('@/lib/cms-preview/recruitment-store')
    expect(refreshed.recruitmentConnected()).toBe(true)
    expect(refreshed.recruitmentFileUrl('document-1')).toBe('/admin/api/documents/document-1')
    request.mockResolvedValue({ state, revision: 18 })
    await refreshed.persistRecruitment(state)
    expect(JSON.parse(request.mock.calls[0][1].body).revision).toBe(17)
  })
})
