import { expect, it, vi } from 'vitest'
const find = vi.hoisted(() => vi.fn())
vi.mock('payload', () => ({ getPayload: async () => ({ find }) }))
vi.mock('@/payload.config', () => ({ default: {} }))
import { totalPublicCalls } from '@/lib/call-count'
it('counts the deduplicated public catalogue with access and locale fallback enforced', async () => {
  find.mockResolvedValue({ docs: [{ reference: 'archive-a' }, { reference: 'current-b' }] })
  expect(await totalPublicCalls(['archive-a', 'archive-a'])).toBe(2)
  expect(find).toHaveBeenCalledWith(
    expect.objectContaining({
      collection: 'calls',
      locale: 'fr',
      overrideAccess: false,
      fallbackLocale: false,
      draft: false,
      pagination: false,
      limit: 0,
    }),
  )
})
