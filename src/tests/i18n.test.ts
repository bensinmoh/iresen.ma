import { describe, expect, it } from 'vitest'
import ar from '@/messages/ar.json'
import en from '@/messages/en.json'
import fr from '@/messages/fr.json'
import { isSupportedAnchor, pageHref, pageIds, pages } from '@/lib/site'

function messageKeys(value: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(value)
    .flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key
      if (typeof child === 'string') {
        if (!child.trim()) throw new Error(`Empty translation: ${path}`)
        return [path]
      }
      return messageKeys(child as Record<string, unknown>, path)
    })
    .sort()
}

describe('trilingual UI contract', () => {
  it('has complete nonempty message catalogs in every language', () => {
    expect(messageKeys(en)).toEqual(messageKeys(fr))
    expect(messageKeys(ar)).toEqual(messageKeys(fr))
    expect(Object.keys(fr.Pages).sort()).toEqual([...pageIds].sort())
  })
  it('uses equivalent localized destinations and preserves only supported section anchors', () => {
    expect(pageHref('governance', 'fr')).toBe('/fr/institut/gouvernance')
    expect(pageHref('governance', 'en')).toBe('/en/institute/governance')
    expect(pageHref('institute', 'ar', '#mission')).toBe('/ar/المعهد#mission')
    expect(pageHref('home', 'fr', '#unknown')).toBe('/fr')
    expect(isSupportedAnchor('institute', 'mission')).toBe(true)
    expect(isSupportedAnchor('home', 'mission')).toBe(false)
  })
  it('keeps each locale route map unambiguous', () => {
    for (const locale of ['fr', 'en', 'ar'] as const) {
      const paths = pageIds.map((id) => pages[id].pathnames[locale])
      expect(new Set(paths).size).toBe(paths.length)
    }
  })
})
