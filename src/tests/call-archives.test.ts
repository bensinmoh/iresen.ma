import { describe, expect, it } from 'vitest'
import { archiveCalls, archiveCard, callCards, filterCallCards } from '@/lib/call-archives'
import { callsListingHref, callReferenceFromPath, isCallReference } from '@/lib/calls'
import { staticSearchDocuments } from '@/lib/search/catalog'

describe('commissioned historical call catalogue', () => {
  it('retains all 21 separate editions with closed states and reachable localized registrations', () => {
    expect(archiveCalls).toHaveLength(21)
    expect(new Set(archiveCalls.map((call) => call.reference)).size).toBe(21)
    const docs = staticSearchDocuments()
    for (const locale of ['fr', 'en', 'ar'] as const) {
      const cards = callCards(locale)
      expect(cards.every((call) => call.state === 'closed')).toBe(true)
      expect(cards[0]?.reference).toBe('leap-se-2026')
      expect(cards[1]?.reference).toBe('ibtikar-al-omrane-2025')
      expect(callReferenceFromPath(callsListingHref(locale).slice(locale.length + 1), locale)).toBe(
        'calls',
      )
      for (const call of archiveCalls) {
        const card = archiveCard(call, locale)
        expect(card.summary.length).toBeGreaterThan(20)
        expect(callReferenceFromPath(card.href.slice(locale.length + 1), locale)).toBe(
          call.reference,
        )
        expect(
          docs.find((doc) => doc.id === `page:call-archive:${call.reference}:${locale}`)?.url,
        ).toBe(card.href)
      }
    }
    expect(isCallReference('calls')).toBe(false)
  })
  it('combines query, year, type and status without changing the historical data', () => {
    const cards = callCards('fr')
    expect(
      filterCallCards(cards, { query: 'énergie', kind: 'cooperation' }).length,
    ).toBeGreaterThan(0)
    expect(
      filterCallCards(cards, {
        query: 'IBTIKAR',
        year: '2025',
        kind: 'acceleration',
        state: 'closed',
      }).map((call) => call.reference),
    ).toEqual(['ibtikar-al-omrane-2025'])
    expect(filterCallCards(cards, { query: 'inno france maroc' })).toHaveLength(1)
    expect(filterCallCards(cards, { state: 'open' })).toEqual([])
    expect(filterCallCards(cards, { state: 'upcoming' })).toEqual([])
    expect(filterCallCards(cards, { query: 'no-such-programme' })).toEqual([])
  })
})

describe('call programme discovery', () => {
  it('uses historical labels without inventing a match for unrepresented programmes', async () => {
    const { archiveProjectProgramme } = await import('@/lib/call-archives')
    const { programmeProjectsHref } = await import('@/lib/projects-model')
    for (const locale of ['fr', 'en', 'ar'] as const) {
      for (const call of archiveCalls) {
        const programme = archiveProjectProgramme(call)
        const url = new URL(programmeProjectsHref(programme, locale), 'http://localhost')
        expect(url.searchParams.get('programme')).toBe(programme)
        expect(url.hash).toBe('#find-project')
      }
    }
    expect(
      archiveProjectProgramme(archiveCalls.find((c) => c.reference === 'innotherm-2013')!),
    ).toBe('InnoTherm III')
    expect(
      archiveProjectProgramme(archiveCalls.find((c) => c.reference === 'ibtikar-al-omrane-2025')!),
    ).toBe('IBTIKAR AL OMRANE 2025')
  })
})
