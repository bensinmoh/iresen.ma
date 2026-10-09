import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { staticSearchDocuments } from '@/lib/search/catalog'
import { isSupportedAnchor, pageHref } from '@/lib/site'
import { researchThemes } from '@/lib/home-research'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'

describe('research source and public search references', () => {
  it('retains the seven French themes and 28 axis names from the supplied strategy', () => {
    const source = readFileSync(
      'docs/references/strategy/proposition-consolidee-rd-dprdire.md',
      'utf8',
    )
    for (const id of researchThemes) {
      const theme = fr.HomeResearch.themes[id]
      expect(source).toContain(theme.title.replaceAll(' & ', ' et '))
      expect(theme.axes).toHaveLength(4)
      for (const axis of theme.axes) expect(source).toContain(axis)
    }
  })
  it('uses reachable theme anchors and real localized metadata without indexing the repository reference', () => {
    const documents = staticSearchDocuments()
    for (const [locale, messages] of Object.entries({ fr, en, ar })) {
      for (const theme of researchThemes) {
        const anchor = `research-${theme}`
        expect(isSupportedAnchor('home', anchor)).toBe(true)
        const document = documents.find((entry) => entry.id === `section:home:${anchor}:${locale}`)!
        expect(document.url).toBe(pageHref('home', locale as 'fr' | 'en' | 'ar', anchor))
        for (const axis of messages.HomeResearch.themes[theme].axes)
          expect(document.body).toContain(axis)
        expect(document.body).toContain(messages.HomeResearch.themes[theme].searchText)
      }
    }
    expect(documents.some((entry) => entry.url.includes('proposition-consolidee'))).toBe(false)
  })
})
