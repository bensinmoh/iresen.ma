import { describe, expect, it } from 'vitest'
import { researchPlatforms, platformLegacyAnchors } from '@/lib/platforms'
import { staticSearchDocuments, publicAssetReferences } from '@/lib/search/catalog'
import { isSupportedAnchor, pageHref } from '@/lib/site'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'

describe('platform manuscript discovery and source boundaries', () => {
  it('indexes capabilities at their working localized destinations and preserves legacy links', () => {
    const documents = staticSearchDocuments()
    for (const locale of ['fr', 'en', 'ar'] as const) {
      const copy = { fr, en, ar }[locale].Platforms
      for (const anchor of platformLegacyAnchors)
        expect(isSupportedAnchor('platforms', anchor)).toBe(true)
      for (const { id, anchor } of researchPlatforms) {
        const result = documents.find(({ id }) => id === `section:platforms:${anchor}:${locale}`)!
        expect(result.url).toBe(`${pageHref('platforms', locale)}#${anchor}`)
        expect(result.body).toContain(copy.platforms[id].paragraphs[1])
        for (const card of Object.values(copy.platforms[id].infrastructure)) {
          expect(result.body).toContain(card.title)
          expect(result.body).toContain(card.description)
        }
        if (id === 'greenh2a') {
          expect(result.body).toContain(copy.development)
          expect(result.body).toContain(copy.visualization)
        }
      }
    }
  })
  it('does not manufacture official destinations, reference downloads or duplicate photograph results', () => {
    expect(researchPlatforms.filter(({ url }) => Boolean(url)).map(({ id }) => id)).toEqual(['gep'])
    expect(
      publicAssetReferences.filter(({ url }) => url === '/images/platforms/gep.webp'),
    ).toHaveLength(1)
    expect(
      publicAssetReferences.some(({ url }) =>
        /IRESEN_Page_Infrastructures|Screenshot 2026-10-11/.test(url),
      ),
    ).toBe(false)
  })
})
