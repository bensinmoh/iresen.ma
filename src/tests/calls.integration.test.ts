import { randomUUID } from 'node:crypto'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import type { Payload } from 'payload'
import {
  callActor,
  callTestDates,
  callTestCopy,
  createCallTestPdf,
} from '../../tests/fixtures/calls'
import { processSearchJobs } from '@/lib/search/indexer'
import { searchDatabase } from '@/lib/search/database'
import { callHref } from '@/lib/calls'
const integration = process.env.CMS_INTEGRATION === '1' ? describe : describe.skip
integration('call CMS publication and search lifecycle', () => {
  let payload: Payload
  let mediaId: number
  let callId: number
  const reference = `call-test-${randomUUID()}`
  beforeAll(async () => {
    const { getPayload } = await import('payload')
    const { default: config } = await import('../payload.config')
    payload = await getPayload({ config })
    mediaId = (await createCallTestPdf(payload, reference)).id
  })
  afterAll(async () => {
    if (callId)
      await payload.delete({
        collection: 'calls',
        id: callId,
        user: callActor,
        overrideAccess: true,
      })
    if (mediaId)
      await payload.delete({
        collection: 'media',
        id: mediaId,
        user: callActor,
        overrideAccess: true,
      })
    await processSearchJobs(50)
  })
  it('rejects incomplete publication, exposes only approved locales and indexes all metadata', async () => {
    const draft = await payload.create({
      collection: 'calls',
      locale: 'fr',
      user: callActor,
      overrideAccess: true,
      draft: true,
      data: { reference, launchYear: 2026, acronym: 'CMS-TEST' },
    })
    callId = draft.id
    await expect(
      payload.update({
        collection: 'calls',
        id: callId,
        locale: 'fr',
        user: callActor,
        overrideAccess: true,
        data: { publicationStatus: 'published', _status: 'published', visibility: 'public' },
      }),
    ).rejects.toThrow('Complete all call information')
    await payload.update({
      collection: 'calls',
      id: callId,
      locale: 'fr',
      user: callActor,
      overrideAccess: true,
      data: {
        ...callTestCopy('fr'),
        ...callTestDates,
        budgetAmount: 2500000,
        budgetCurrency: 'MAD',
        conditionsDocument: mediaId,
        publicationStatus: 'published',
        _status: 'published',
        visibility: 'public',
        internalNotes: 'Private unreleased administrative detail',
      },
    })
    const query = {
      collection: 'calls' as const,
      where: { id: { equals: callId } },
      overrideAccess: false,
      draft: true,
      fallbackLocale: 'fr' as const,
    }
    expect((await payload.find({ ...query, locale: 'fr' })).docs).toHaveLength(1)
    expect((await payload.find({ ...query, locale: 'ar' })).docs).toHaveLength(0)
    expect((await payload.find({ ...query, locale: 'fr' })).docs[0]?.internalNotes).toBeUndefined()
    await processSearchJobs(50)
    const result = await searchDatabase().query(
      "SELECT * FROM search_documents WHERE origin='calls' AND source_id=$1",
      [String(callId)],
    )
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].url).toBe(callHref(reference, 'fr'))
    expect(result.rows[0].body).toContain('Green hydrogen')
    expect(result.rows[0].body).toContain('2500000')
    expect(result.rows[0].body).not.toContain('Private unreleased')
    await expect(
      payload.update({
        collection: 'calls',
        id: callId,
        locale: 'fr',
        user: callActor,
        overrideAccess: true,
        data: { reference: 'changed-reference' },
      }),
    ).rejects.toThrow('stable URL')
    for (const locale of ['en', 'ar'] as const) {
      await payload.update({
        collection: 'media',
        id: mediaId,
        locale,
        user: callActor,
        overrideAccess: true,
        data: {
          title: 'Test call conditions',
          alt: 'Test document',
          publicationStatus: 'published',
          _status: 'published',
        },
      })
      await payload.update({
        collection: 'calls',
        id: callId,
        locale,
        user: callActor,
        overrideAccess: true,
        data: {
          ...callTestCopy(locale),
          conditionsDocument: mediaId,
          publicationStatus: 'published',
          _status: 'published',
        },
      })
    }
    await processSearchJobs(50)
    const localized = await searchDatabase().query(
      "SELECT locale,url FROM search_documents WHERE origin='calls' AND source_id=$1 ORDER BY locale",
      [String(callId)],
    )
    expect(localized.rows.map((row) => row.locale)).toEqual(['ar', 'en', 'fr'])
    for (const row of localized.rows) expect(row.url).toBe(callHref(reference, row.locale))
  })
  it('keeps archive discovery but immediately excludes withdrawn calls and stale vocabulary', async () => {
    await payload.update({
      collection: 'calls',
      id: callId,
      locale: 'fr',
      user: callActor,
      overrideAccess: true,
      data: {
        deadlineAt: '2020-02-01T17:00:00Z',
        evaluationStartsAt: '2020-03-01T09:00:00Z',
        evaluationEndsAt: '2020-03-31T17:00:00Z',
        resultsAt: '2020-04-01T09:00:00Z',
      },
    })
    await processSearchJobs(50)
    expect(
      (
        await searchDatabase().query(
          "SELECT * FROM search_public_sources WHERE origin='calls' AND source_id=$1",
          [String(callId)],
        )
      ).rows,
    ).toHaveLength(3)
    await payload.update({
      collection: 'calls',
      id: callId,
      locale: 'fr',
      user: callActor,
      overrideAccess: true,
      data: { visibility: 'private' },
    })
    expect(
      (
        await searchDatabase().query(
          "SELECT * FROM search_public_sources WHERE origin='calls' AND source_id=$1",
          [String(callId)],
        )
      ).rows,
    ).toHaveLength(0)
    expect(
      (
        await payload.find({
          collection: 'calls',
          locale: 'fr',
          overrideAccess: false,
          where: { id: { equals: callId } },
        })
      ).docs,
    ).toHaveLength(0)
    await processSearchJobs(50)
    expect(
      (
        await searchDatabase().query(
          "SELECT * FROM search_documents WHERE origin='calls' AND source_id=$1",
          [String(callId)],
        )
      ).rows,
    ).toHaveLength(0)
  })
})
