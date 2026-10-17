import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import type { Payload } from 'payload'
import { callActor } from '../../tests/fixtures/calls'
import { processSearchJobs } from '@/lib/search/indexer'
import { searchDatabase } from '@/lib/search/database'
import { GET as note } from '@/app/(frontend)/api/projects/[id]/note/route'
import { GET as asset } from '@/app/(frontend)/api/projects/[id]/asset/[kind]/route'
import { totalProjects } from '@/lib/project-count'

// Exercise data/access/search lifecycle without requiring a browser in the DB suite.
vi.mock('@/lib/project-note-renderer', () => ({
  renderProjectNote: vi.fn(async (html: string) => Buffer.from(html)),
}))

const integration = process.env.CMS_INTEGRATION === '1' ? describe : describe.skip
integration('real project schema and publication lifecycle', () => {
  let payload: Payload
  let id: number
  let assets: string
  const oldAssets = process.env.PROJECTS_ASSET_DIRECTORY
  const oldNotes = process.env.PROJECTS_NOTES_DIRECTORY
  const reference = `schema-test-${randomUUID()}`
  const oldReview = process.env.PROJECTS_LOCAL_REVIEW
  beforeAll(async () => {
    process.env.PROJECTS_LOCAL_REVIEW = 'false'
    assets = await mkdtemp(path.join(tmpdir(), 'iresen-project-assets-'))
    process.env.PROJECTS_ASSET_DIRECTORY = assets
    process.env.PROJECTS_NOTES_DIRECTORY = assets
    await mkdir(path.join(assets, reference))
    await writeFile(path.join(assets, reference, 'image.webp'), 'isolated test bytes')
    const { getPayload } = await import('payload')
    const { default: config } = await import('../payload.config')
    payload = await getPayload({ config })
  })
  afterAll(async () => {
    if (id)
      await payload.delete({ collection: 'projects', id, user: callActor, overrideAccess: false })
    await processSearchJobs(50)
    await rm(assets, { recursive: true, force: true })
    if (oldNotes === undefined) delete process.env.PROJECTS_NOTES_DIRECTORY
    else process.env.PROJECTS_NOTES_DIRECTORY = oldNotes
    if (oldAssets === undefined) delete process.env.PROJECTS_ASSET_DIRECTORY
    else process.env.PROJECTS_ASSET_DIRECTORY = oldAssets
    if (oldReview === undefined) delete process.env.PROJECTS_LOCAL_REVIEW
    else process.env.PROJECTS_LOCAL_REVIEW = oldReview
  })
  it('allows absent optional facts, blocks missing translations and immediately withdraws discovery', async () => {
    const baseline = await totalProjects()
    expect(baseline).not.toBeNull()
    const record = await payload.create({
      collection: 'projects',
      locale: 'fr',
      user: callActor,
      overrideAccess: false,
      data: {
        reference,
        acronym: 'Schema test',
        title: 'Temporary schema test',
        description: 'Temporary isolated database test.',
        imagePath: `/api/projects/${reference}/asset/image`,
        objectives: 'Test objective',
        internalNotes: 'PRIVATE_TEST_NOTES',
        sourceHash: 'PRIVATE_TEST_HASH',
        publicationStatus: 'published',
        visibility: 'public',
        _status: 'published',
      },
    })
    id = record.id
    expect(await totalProjects()).toBe(baseline! + 1)
    const imageRequest = new Request(
      `http://localhost/api/projects/${reference}/asset/image?locale=fr`,
    )
    expect(
      (await asset(imageRequest, { params: Promise.resolve({ id: reference, kind: 'image' }) }))
        .status,
    ).toBe(200)
    const privateTranslation = new Request(
      `http://localhost/api/projects/${reference}/asset/image?locale=ar`,
    )
    expect(
      (
        await asset(privateTranslation, {
          params: Promise.resolve({ id: reference, kind: 'image' }),
        })
      ).status,
    ).toBe(404)
    const noteRequest = new Request(`http://localhost/api/projects/${reference}/note?locale=fr`)
    const initialNote = await note(noteRequest, { params: Promise.resolve({ id: reference }) })
    expect(initialNote.status).toBe(200)
    expect(await initialNote.text()).toContain('Temporary isolated database test.')
    const query = {
      collection: 'projects' as const,
      where: { id: { equals: id } },
      overrideAccess: false,
      draft: true,
      fallbackLocale: 'fr' as const,
    }
    const publicRecord = (await payload.find({ ...query, locale: 'fr' })).docs[0]!
    expect(publicRecord.budgetMAD).toBeNull()
    expect(publicRecord.projectStatus).toBeNull()
    expect(publicRecord.internalNotes).toBeUndefined()
    expect(publicRecord.sourceHash).toBeUndefined()
    expect((await payload.find({ ...query, locale: 'en' })).docs).toHaveLength(0)
    await payload.update({
      collection: 'projects',
      id,
      locale: 'ar',
      overrideAccess: false,
      user: callActor,
      data: {
        title: 'اختبار',
        description: 'نص تجريبي في قاعدة بيانات معزولة.',
        publicationStatus: 'review',
        _status: 'published',
      },
    })
    expect((await payload.find({ ...query, locale: 'ar' })).docs).toHaveLength(0)
    await processSearchJobs(50)
    const sources = await searchDatabase().query(
      "SELECT * FROM search_public_sources WHERE origin='projects' AND source_id=$1",
      [String(id)],
    )
    expect(sources.rows.map((r) => r.locale)).toEqual(['fr'])
    expect(sources.rows[0].body_text).not.toContain('PRIVATE_TEST')
    const indexed = await searchDatabase().query(
      "SELECT url,type FROM search_documents WHERE origin='projects' AND source_id=$1",
      [String(id)],
    )
    expect(indexed.rows.filter((r) => r.type === 'project')).toEqual([
      {
        url: `/fr/recherche-innovation/projets?project=${reference}#project-details`,
        type: 'project',
      },
    ])
    expect(indexed.rows.some((r) => r.type === 'document')).toBe(true)
    await payload.update({
      collection: 'projects',
      id,
      locale: 'fr',
      user: callActor,
      overrideAccess: false,
      data: { description: 'Updated project description.' },
    })
    const updatedNote = await note(noteRequest, { params: Promise.resolve({ id: reference }) })
    expect(updatedNote.status).toBe(200)
    expect(await updatedNote.text()).toContain('Updated project description.')
    await processSearchJobs(50)
    expect(
      (
        await searchDatabase().query(
          "SELECT 1 FROM search_documents WHERE origin='projects' AND source_id=$1 AND type='document'",
          [String(id)],
        )
      ).rowCount,
    ).toBe(1)
    await payload.update({
      collection: 'projects',
      id,
      locale: 'fr',
      user: callActor,
      overrideAccess: false,
      data: { publicationStatus: 'review', _status: 'published' },
    })
    expect(await totalProjects()).toBe(baseline)
    expect((await note(noteRequest, { params: Promise.resolve({ id: reference }) })).status).toBe(
      404,
    )
    expect(
      (
        await searchDatabase().query(
          "SELECT 1 FROM search_public_sources WHERE origin='projects' AND source_id=$1",
          [String(id)],
        )
      ).rowCount,
    ).toBe(0)
    const response = await asset(
      new Request(`http://localhost/api/projects/${reference}/asset/image?locale=fr`),
      { params: Promise.resolve({ id: reference, kind: 'image' }) },
    )
    expect(response.status).toBe(404)
    expect(response.headers.get('cache-control')).toContain('no-store')
    await processSearchJobs(50)
    expect(
      (
        await searchDatabase().query(
          "SELECT 1 FROM search_documents WHERE origin='projects' AND source_id=$1",
          [String(id)],
        )
      ).rowCount,
    ).toBe(0)
    await expect(
      payload.update({
        collection: 'projects',
        id,
        locale: 'fr',
        overrideAccess: false,
        user: callActor,
        data: { reference: 'renamed-reference' },
      }),
    ).rejects.toThrow('stable project reference')
  })
})
