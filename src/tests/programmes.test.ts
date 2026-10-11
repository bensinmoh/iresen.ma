import { describe, expect, it } from 'vitest'
import { staticSearchDocuments, publicAssetReferences } from '@/lib/search/catalog'
import { pageSections } from '@/lib/page-sections'
import { pageHref, isSupportedAnchor } from '@/lib/site'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'

describe('programme manuscript and public discovery', () => {
  it('includes every stage and historical scheme at a preserved localized destination', () => {
    const documents = staticSearchDocuments()
    for (const locale of ['fr', 'en', 'ar'] as const) {
      const copy = { fr, en, ar }[locale].Programmes
      for (const { id } of pageSections.programmes)
        expect(isSupportedAnchor('programmes', id)).toBe(true)
      for (const [anchor, items] of [
        ['programmes-collaborations', copy.intro.items],
        ['research-results', copy.impact.items],
        ['project-lifecycle', copy.process.items],
        ['calls-for-projects', copy.history.items],
      ] as const) {
        const document = documents.find(
          ({ id }) => id === `section:programmes:${anchor}:${locale}`,
        )!
        expect(document.url).toBe(pageHref('programmes', locale, anchor))
        for (const item of items) {
          expect(document.body).toContain(item.title)
          expect(document.body).toContain(item.description)
        }
      }
      const impact = documents.find(
        ({ id }) => id === `section:programmes:research-results:${locale}`,
      )!
      expect(impact.body).toContain('69')
      expect(impact.body).toContain(copy.reference)
      const page = documents.find(({ id }) => id === `page:programmes:${locale}`)!
      expect(page.body).toContain(copy.title)
      expect(page.body).not.toMatch(
        /30 novembre 2026|15 décembre 2026|15 janvier 2027|31 janvier 2027/,
      )
    }
  })
  it('registers the distinct illustration once with explicit localized provenance', () => {
    const media = publicAssetReferences.filter(
      ({ id }) => id === 'programmes-collaborative-prototyping',
    )
    expect(media).toHaveLength(1)
    for (const locale of ['fr', 'en', 'ar'] as const)
      expect(media[0]!.text[locale]?.description).toMatch(/fiction|ficti|خيالي/i)
    expect(
      publicAssetReferences.filter(({ url }) => url === '/images/achievements/aquasolar.webp'),
    ).toHaveLength(1)
  })
  it('keeps the private manuscript and screenshot out of public media', () => {
    expect(
      publicAssetReferences.some(({ url }) =>
        /IRESEN_Page_Programmes_RDI|codex-clipboard/.test(url),
      ),
    ).toBe(false)
  })
})
