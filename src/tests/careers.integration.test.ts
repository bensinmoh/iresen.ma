import { randomUUID } from 'node:crypto'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import type { Payload } from 'payload'
import type { User } from '../payload-types'
import { searchDatabase } from '../lib/search/database'
import { processSearchJobs } from '../lib/search/indexer'
const integration = process.env.CMS_INTEGRATION === '1' ? describe : describe.skip
integration('career publication and search boundaries', () => {
  let payload: Payload
  const ids: number[] = []
  const actor = { id: 0, role: 'admin', collection: 'users' } as User & { collection: 'users' }
  const reference = `test-${randomUUID()}`
  const copy = {
    title: 'Validated photovoltaic recruitment test',
    department: 'Research',
    location: 'Rabat',
    experience: 'Test experience',
    availability: 'Test availability',
    summary: 'Photovoltaic instrumentation research role test',
    missions: 'Analyse measurements',
    profile: 'Instrumentation expertise',
  }
  beforeAll(async () => {
    const { getPayload } = await import('payload')
    const { default: config } = await import('../payload.config')
    payload = await getPayload({ config })
  })
  afterAll(async () => {
    for (const id of ids)
      await payload.delete({ collection: 'opportunities', id, user: actor, overrideAccess: true })
    await processSearchJobs(50)
  })
  it('keeps demos private and rejects publication', async () => {
    const demo = await payload.create({
      collection: 'opportunities',
      locale: 'fr',
      user: actor,
      overrideAccess: true,
      draft: true,
      data: { reference: `${reference}-demo`, contract: 'CDI', isDemo: true, ...copy },
    })
    ids.push(demo.id)
    await expect(
      payload.update({
        collection: 'opportunities',
        id: demo.id,
        locale: 'fr',
        user: actor,
        overrideAccess: true,
        data: { _status: 'published', publicationStatus: 'published', visibility: 'public' },
      }),
    ).rejects.toThrow('Design examples')
    expect(
      (
        await payload.find({
          collection: 'opportunities',
          locale: 'fr',
          overrideAccess: false,
          draft: true,
          fallbackLocale: 'en',
        })
      ).docs.map((doc) => doc.id),
    ).not.toContain(demo.id)
    await processSearchJobs(50)
    expect(
      (
        await searchDatabase().query(
          "SELECT * FROM search_public_sources WHERE origin='opportunities' AND source_id=$1",
          [String(demo.id)],
        )
      ).rowCount,
    ).toBe(0)
  })
  it('indexes approved locales and removes closed/deleted offers immediately', async () => {
    const offer = await payload.create({
      collection: 'opportunities',
      locale: 'fr',
      user: actor,
      overrideAccess: true,
      data: {
        reference,
        contract: 'CDD',
        state: 'open',
        isDemo: false,
        visibility: 'public',
        publicationStatus: 'published',
        _status: 'published',
        ...copy,
      },
    })
    ids.push(offer.id)
    expect(
      (
        await payload.find({
          collection: 'opportunities',
          locale: 'fr',
          overrideAccess: false,
          fallbackLocale: false,
          draft: false,
          where: { id: { equals: offer.id } },
        })
      ).docs,
    ).toHaveLength(1)
    expect(
      (
        await payload.find({
          collection: 'opportunities',
          locale: 'ar',
          overrideAccess: false,
          fallbackLocale: 'fr',
          draft: false,
          where: { id: { equals: offer.id } },
        })
      ).docs,
    ).toHaveLength(0)
    await processSearchJobs(50)
    const docs = await searchDatabase().query(
      "SELECT * FROM search_documents WHERE origin='opportunities' AND source_id=$1",
      [String(offer.id)],
    )
    expect(docs.rows.map((row) => row.locale)).toEqual(['fr', 'fr'])
    expect(docs.rows.map((row) => row.type).sort()).toEqual(['document', 'section'])
    await payload.update({
      collection: 'opportunities',
      id: offer.id,
      locale: 'fr',
      user: actor,
      overrideAccess: true,
      data: { state: 'closed' },
    })
    expect(
      (
        await searchDatabase().query(
          "SELECT * FROM search_public_sources WHERE origin='opportunities' AND source_id=$1",
          [String(offer.id)],
        )
      ).rowCount,
    ).toBe(0)
    await processSearchJobs(50)
    expect(
      (
        await searchDatabase().query(
          "SELECT * FROM search_documents WHERE origin='opportunities' AND source_id=$1",
          [String(offer.id)],
        )
      ).rowCount,
    ).toBe(0)
  })
})
