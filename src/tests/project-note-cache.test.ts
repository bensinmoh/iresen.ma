import { describe, expect, it, vi } from 'vitest'
import { ProjectNoteCache } from '../lib/project-note-cache'

describe('temporary project PDF cache', () => {
  it('coalesces requests, expires entries and separates content revisions', async () => {
    let time = 0
    const render = vi.fn(async (html: string) => Buffer.from(html))
    const cache = new ProjectNoteCache(render, () => time)
    const [first, same] = await Promise.all([cache.get('fr-v1', 'old'), cache.get('fr-v1', 'old')])
    expect(first).toBe(same)
    expect(render).toHaveBeenCalledTimes(1)
    expect((await cache.get('fr-v2', 'new')).toString()).toBe('new')
    expect((await cache.get('ar-v1', 'عربي')).toString()).toBe('عربي')
    await cache.get('fr-v1', 'old')
    expect(render).toHaveBeenCalledTimes(3)
    time = 600_001
    await cache.get('fr-v1', 'old')
    expect(render).toHaveBeenCalledTimes(4)
  })

  it('limits simultaneous renders and queued work, and retries failures', async () => {
    const releases: (() => void)[] = []
    const render = vi.fn(async () => {
      await new Promise<void>((resolve) => releases.push(resolve))
      return Buffer.from('pdf')
    })
    const cache = new ProjectNoteCache(render)
    const work = Array.from({ length: 8 }, (_, i) => cache.get(String(i), 'html'))
    expect(render).toHaveBeenCalledTimes(2)
    await expect(cache.get('overflow', 'html')).rejects.toThrow('queue is full')
    for (let i = 0; i < 8; i++) {
      releases[i]!()
      await work[i]
    }
    expect(render).toHaveBeenCalledTimes(8)
    const failing = vi
      .fn()
      .mockRejectedValueOnce(new Error('browser failed'))
      .mockResolvedValue(Buffer.from('ok'))
    const retry = new ProjectNoteCache(failing)
    await expect(retry.get('same', 'html')).rejects.toThrow('browser failed')
    expect((await retry.get('same', 'html')).toString()).toBe('ok')
  })
})
