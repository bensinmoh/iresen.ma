import type { AccessArgs, PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { publishedMediaOnly } from '@/cms/access/public-media'

const publicationWhere = {
  and: [
    { _status: { equals: 'published' } },
    { visibility: { equals: 'public' } },
    { publicationStatus: { equals: 'published' } },
  ],
}

function fileRequest(
  locale: unknown = 'fr',
  docs: { id: number }[] = [{ id: 17 }],
  role?: 'admin' | 'editor' | 'publisher',
) {
  const find = vi.fn<(options: Record<string, unknown>) => Promise<{ docs: { id: number }[] }>>()
  find.mockResolvedValue({ docs })
  const req = {
    locale,
    fallbackLocale: 'fr',
    user: role ? { role, collection: 'users' } : null,
    payload: { find, collections: { media: { config: { upload: {} } } } },
  } as unknown as PayloadRequest
  const args: AccessArgs = { req, isReadingStaticFile: true, data: { filename: 'approved.pdf' } }
  return { args, find }
}

describe('localized public media file authorization', () => {
  it('authorizes approved anonymous bytes through an exact-locale canonical metadata lookup', async () => {
    const { args, find } = fileRequest()
    await expect(publishedMediaOnly(args)).resolves.toBe(true)
    expect(find).toHaveBeenCalledExactlyOnceWith({
      collection: 'media',
      locale: 'fr',
      fallbackLocale: false,
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1,
      req: args.req,
      select: { filename: true },
      where: { or: [{ filename: { equals: 'approved.pdf' } }] },
    })
    expect(args.req.user).toBeNull()
    expect(args.req.fallbackLocale).toBe(false)
  })

  it.each(['missing translation', 'withdrawn publication', 'private visibility'])(
    'denies anonymous bytes when public metadata excludes %s',
    async () => {
      const { args, find } = fileRequest('ar', [])
      await expect(publishedMediaOnly(args)).resolves.toBe(false)
      expect(find).toHaveBeenCalledOnce()
      expect(find.mock.calls[0]?.[0]).toMatchObject({
        locale: 'ar',
        fallbackLocale: false,
        overrideAccess: false,
        draft: false,
      })
    },
  )

  it.each(['all', 'es', undefined, null])(
    'rejects unsupported file locale %s without a lookup',
    async (locale) => {
      const { args, find } = fileRequest(locale)
      // Explicit undefined must remain unsupported instead of taking the helper default.
      args.req.locale = locale as PayloadRequest['locale']
      await expect(publishedMediaOnly(args)).resolves.toBe(false)
      expect(find).not.toHaveBeenCalled()
      expect(args.req.fallbackLocale).toBe(false)
    },
  )

  it('rejects a missing filename without a metadata lookup', async () => {
    const { args, find } = fileRequest()
    args.data = {}
    await expect(publishedMediaOnly(args)).resolves.toBe(false)
    expect(find).not.toHaveBeenCalled()
  })

  it('uses normal publication gates for the nested metadata read without recursively checking files', async () => {
    const { args, find } = fileRequest()
    find.mockImplementation(async (options) => {
      expect(
        await publishedMediaOnly({
          req: options.req as PayloadRequest,
          isReadingStaticFile: false,
        }),
      ).toEqual(publicationWhere)
      return { docs: [{ id: 17 }] }
    })
    await expect(publishedMediaOnly(args)).resolves.toBe(true)
    expect(find).toHaveBeenCalledOnce()
  })

  it.each(['admin', 'editor', 'publisher'] as const)(
    'preserves authorized %s file preview and metadata access without a public lookup',
    async (role) => {
      const { args, find } = fileRequest('all', [], role)
      await expect(publishedMediaOnly(args)).resolves.toBe(true)
      await expect(publishedMediaOnly({ ...args, isReadingStaticFile: false })).resolves.toBe(true)
      expect(find).not.toHaveBeenCalled()
      expect(args.req.fallbackLocale).toBe(false)
    },
  )

  it('allows configured responsive derivatives through the same public metadata gates', async () => {
    const { args, find } = fileRequest()
    args.data.filename = 'approved-thumbnail.webp'
    args.req.payload.collections.media!.config.upload = {
      staticDir: undefined,
      imageSizes: [{ name: 'thumbnail', width: 320 }],
    }
    await expect(publishedMediaOnly(args)).resolves.toBe(true)
    expect(find.mock.calls[0]?.[0].where).toEqual({
      or: [
        { filename: { equals: 'approved-thumbnail.webp' } },
        { 'sizes.thumbnail.filename': { equals: 'approved-thumbnail.webp' } },
      ],
    })
  })
})
