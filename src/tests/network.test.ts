import { describe, it, expect } from 'vitest'
import { normalizeLaboratoryQuery, networkLaboratories } from '@/lib/network'
import { staticSearchDocuments } from '@/lib/search/catalog'
import { pageHref, isSupportedAnchor } from '@/lib/site'
import { pageSections } from '@/lib/page-sections'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'

describe('owner-supplied laboratory network', () => {
  it('supports accented Latin and Arabic city discovery', () => {
    expect(normalizeLaboratoryQuery('KÉNITRA')).toBe('kenitra')
    expect(normalizeLaboratoryQuery('إفران')).toBe(normalizeLaboratoryQuery('اِفْرَان'))
  })
  it('projects all supplied laboratory identities and withdraws section six in each locale', () => {
    const documents = staticSearchDocuments()
    expect(networkLaboratories).toHaveLength(14)
    expect(pageSections.network).toHaveLength(5)
    for (const locale of ['fr', 'en', 'ar'] as const) {
      const catalog = { fr, en, ar }[locale]
      expect(documents.some(({ id }) => id === `section:network:request-expertise:${locale}`)).toBe(
        false,
      )
      for (const { id } of networkLaboratories) {
        const lab = catalog.Network.labs[id]
        const result = documents.find(
          (document) => document.id === `section:network:laboratory-${id}:${locale}`,
        )!
        expect(result.url).toBe(`${pageHref('network', locale)}#laboratory-${id}`)
        expect(isSupportedAnchor('network', `laboratory-${id}`)).toBe(true)
        expect(result.body).toContain(lab.title)
        expect(result.body).toContain(lab.institution)
        expect(result.body).toContain(fr.Network.labs[id].title)
        expect(result.body).toContain(lab.city)
      }
    }
  })
})
