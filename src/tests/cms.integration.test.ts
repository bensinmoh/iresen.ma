import { randomUUID } from 'node:crypto'
import { spawnSync } from 'node:child_process'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Opt in against a disposable database after running the checked-in migrations.
// These tests never bootstrap or operate on the owner's real administrator.
const integration = process.env.CMS_INTEGRATION === '1' ? describe : describe.skip

integration('CMS authorization and localized publication (PostgreSQL)', () => {
  let payload: import('payload').Payload
  let administrator: import('../payload-types').User
  let editor: import('../payload-types').User
  let publisher: import('../payload-types').User
  const pageIDs: (number | string)[] = []
  const mediaIDs: (number | string)[] = []
  const userIDs: (number | string)[] = []
  const suffix = randomUUID()
  const body = {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: null,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: null,
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Integration test copy',
              version: 1,
            },
          ],
        },
      ],
    },
  }

  beforeAll(async () => {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import('payload'),
      import('../payload.config'),
    ])
    payload = await getPayload({ config })
    const existing = await payload.count({ collection: 'users', overrideAccess: true })
    if (existing.totalDocs !== 0)
      throw new Error('CMS integration tests require a disposable database with no existing users.')

    await expect(
      payload.create({
        collection: 'users',
        overrideAccess: true,
        data: { email: `blocked-${suffix}@example.invalid`, password: randomUUID(), role: 'admin' },
      }),
    ).rejects.toThrow('Account creation requires an administrator')
    const bootstrapEmail = `admin-${suffix}@example.invalid`
    const bootstrapEnvironment = {
      ...process.env,
      CMS_BOOTSTRAP_EMAIL: bootstrapEmail,
      CMS_BOOTSTRAP_PASSWORD: randomUUID(),
    }
    const bootstrap = () =>
      spawnSync(process.execPath, ['scripts/run.mjs', 'tsx', 'scripts/bootstrap-admin.ts'], {
        env: bootstrapEnvironment,
        encoding: 'utf8',
        timeout: 30_000,
      })
    const created = bootstrap()
    expect(created.status, created.stderr).toBe(0)
    const account = await payload.find({
      collection: 'users',
      overrideAccess: true,
      where: { email: { equals: bootstrapEmail } },
    })
    administrator = account.docs[0]!
    userIDs.push(administrator.id)
    const repeated = bootstrap()
    expect(repeated.status).not.toBe(0)
    expect(repeated.stderr).toContain('Users already exist')
    editor = await payload.create({
      collection: 'users',
      overrideAccess: false,
      user: { ...administrator, collection: 'users' },
      data: { email: `editor-${suffix}@example.invalid`, password: randomUUID(), role: 'editor' },
    })
    userIDs.push(editor.id)
    publisher = await payload.create({
      collection: 'users',
      overrideAccess: false,
      user: { ...administrator, collection: 'users' },
      data: {
        email: `publisher-${suffix}@example.invalid`,
        password: randomUUID(),
        role: 'publisher',
      },
    })
    userIDs.push(publisher.id)
  }, 60_000)

  afterAll(async () => {
    if (!payload || !administrator) return
    for (const id of mediaIDs)
      await payload.delete({ collection: 'media', id, overrideAccess: true })
    for (const id of pageIDs)
      await payload.delete({ collection: 'pages', id, overrideAccess: true })
    for (const id of [...userIDs].reverse())
      await payload.delete({ collection: 'users', id, overrideAccess: true })
    await payload.destroy()
  }, 60_000)

  it('blocks anonymous user creation and protects account roles', async () => {
    await expect(
      payload.create({
        collection: 'users',
        overrideAccess: false,
        data: { email: `signup-${suffix}@example.invalid`, password: randomUUID(), role: 'admin' },
      }),
    ).rejects.toThrow()
    await payload
      .update({
        collection: 'users',
        id: editor.id,
        overrideAccess: false,
        user: { ...editor, collection: 'users' },
        data: { role: 'admin' },
      })
      .catch(() => undefined)
    const unchanged = await payload.findByID({
      collection: 'users',
      id: editor.id,
      overrideAccess: true,
    })
    expect(unchanged.role).toBe('editor')
    await expect(
      payload.create({
        collection: 'users',
        overrideAccess: true,
        context: { bootstrapInitialAdministrator: true },
        data: { email: `second-${suffix}@example.invalid`, password: randomUUID(), role: 'admin' },
      }),
    ).rejects.toThrow('already been created')
  })

  it('does not expose drafts or let editors publish, including crafted _status writes', async () => {
    const page = await payload.create({
      collection: 'pages',
      draft: true,
      overrideAccess: false,
      user: { ...editor, collection: 'users' },
      locale: 'fr',
      data: {
        pageId: `draft-${suffix}`,
        title: 'Draft title',
        slug: 'draft-title',
        summary: 'Draft summary',
        body,
      },
    })
    pageIDs.push(page.id)
    const publicResult = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      locale: 'fr',
      draft: true,
      where: { id: { equals: page.id } },
    })
    expect(publicResult.docs).toHaveLength(0)
    await expect(
      payload.findVersions({
        collection: 'pages',
        overrideAccess: false,
        where: { parent: { equals: page.id } },
      }),
    ).rejects.toThrow()
    await expect(
      payload.update({
        collection: 'pages',
        id: page.id,
        overrideAccess: false,
        user: { ...editor, collection: 'users' },
        locale: 'fr',
        data: { _status: 'published', publicationStatus: 'published' },
      }),
    ).rejects.toThrow('Only a publisher')
  })

  it('keeps private media metadata inaccessible to anonymous readers', async () => {
    const image = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4KkAAAAASUVORK5CYII=',
      'base64',
    )
    const media = await payload.create({
      collection: 'media',
      draft: true,
      overrideAccess: false,
      user: { ...editor, collection: 'users' },
      locale: 'fr',
      file: {
        data: image,
        mimetype: 'image/png',
        name: `private-${suffix}.png`,
        size: image.length,
      },
      data: { title: 'Private image', alt: 'Private image description' },
    })
    mediaIDs.push(media.id)
    await expect(
      payload.findByID({ collection: 'media', id: media.id, overrideAccess: false, locale: 'fr' }),
    ).rejects.toThrow()
    const publicResult = await payload.find({
      collection: 'media',
      overrideAccess: false,
      locale: 'fr',
      draft: true,
      where: { id: { equals: media.id } },
    })
    expect(publicResult.docs).toHaveLength(0)
  })

  it('publishes an approved French locale without leaking French into Arabic', async () => {
    const page = await payload.create({
      collection: 'pages',
      overrideAccess: false,
      user: { ...publisher, collection: 'users' },
      locale: 'fr',
      data: {
        pageId: `published-${suffix}`,
        title: 'Approved French title',
        slug: 'approved-title',
        summary: 'Approved summary',
        body,
        publicationStatus: 'published',
        visibility: 'public',
        _status: 'published',
        internalNotes: 'Private editorial note',
      },
    })
    pageIDs.push(page.id)
    const french = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      locale: 'fr',
      fallbackLocale: false,
      where: { id: { equals: page.id } },
    })
    expect(french.docs[0]?.title).toBe('Approved French title')
    expect(french.docs[0]).not.toHaveProperty('internalNotes')
    const arabic = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      locale: 'ar',
      fallbackLocale: 'fr',
      where: { id: { equals: page.id } },
    })
    expect(arabic.docs).toHaveLength(0)
    await expect(
      payload.update({
        collection: 'pages',
        id: page.id,
        overrideAccess: false,
        user: { ...publisher, collection: 'users' },
        locale: 'ar',
        fallbackLocale: 'fr',
        data: { publicationStatus: 'published', _status: 'published' },
      }),
    ).rejects.toThrow('Complete the ar translation')

    // An editor creates a new revision without replacing the approved live copy.
    await payload.update({
      collection: 'pages',
      id: page.id,
      overrideAccess: false,
      user: { ...editor, collection: 'users' },
      locale: 'fr',
      data: { title: 'Unapproved replacement', publicationStatus: 'review' },
    })
    const live = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      locale: 'fr',
      where: { id: { equals: page.id } },
    })
    expect(live.docs[0]?.title).toBe('Approved French title')
  })
})
