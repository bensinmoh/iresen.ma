import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { staticSearchDocuments, publicAssetReferences } from '@/lib/search/catalog'
import {
  roadmapDomains,
  roadmapMedia,
  roadmapMediaPath,
  roadmapDrawingPath,
  roadmapHeroPath,
} from '@/lib/roadmap'
import { isSupportedAnchor, pageHref } from '@/lib/site'

describe('roadmap discovery', () => {
  it('registers all technical chapters with localized axes and reachable canonical anchors', () => {
    const documents = staticSearchDocuments()
    for (const locale of ['fr', 'en', 'ar'] as const) {
      for (const id of roadmapDomains) {
        const anchor = `theme-${id}`
        expect(isSupportedAnchor('priorities', anchor)).toBe(true)
        const document = documents.find(
          (item) => item.id === `section:priorities:${anchor}:${locale}`,
        )
        expect(document).toMatchObject({
          type: 'section',
          locale,
          url: pageHref('priorities', locale, anchor),
        })
        expect(document!.body).not.toMatch(/À prévoir|Content to add/)
        expect(document!.body.length).toBeGreaterThan(100)
      }
    }
  })
  it('registers local illustrations while keeping the source recording outside public discovery', () => {
    for (const id of roadmapMedia) {
      const resource = publicAssetReferences.find((item) => item.id === `roadmap-visual-${id}`)
      expect(resource?.url).toBe(roadmapMediaPath(id))
      expect(existsSync(`public${resource!.url}`)).toBe(true)
      expect(Object.keys(resource!.text)).toHaveLength(3)
      const drawing = publicAssetReferences.find(
        (item) => item.id === `roadmap-visual-${id}-drawing`,
      )
      expect(drawing?.url).toBe(roadmapDrawingPath(id))
      expect(existsSync(`public${drawing!.url}`)).toBe(true)
      expect(Object.keys(drawing!.text)).toHaveLength(3)
    }
    expect(JSON.stringify(publicAssetReferences)).not.toContain('05.08.31.mov')
    const hero = publicAssetReferences.find((item) => item.id === 'roadmap-hero-board')
    expect(hero?.url).toBe(roadmapHeroPath)
    expect(existsSync(`public${hero!.url}`)).toBe(true)
    expect(Object.keys(hero!.text)).toHaveLength(3)
    const withdrawn = {
      fr: 'Le développement des compétences',
      en: 'Skills development and strategic intelligence support this approach.',
      ar: 'تواكب تنمية الكفاءات والذكاء الاستراتيجي هذا النهج.',
    }
    for (const locale of ['fr', 'en', 'ar'] as const) {
      const documents = staticSearchDocuments().filter(
        (item) => item.locale === locale && /^(page|section):priorities:/.test(item.id),
      )
      for (const document of documents) expect(document.body).not.toContain(withdrawn[locale])
    }
  })
})
