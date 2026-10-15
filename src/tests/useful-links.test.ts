import { describe, expect, it } from 'vitest'
import { usefulLinks } from '@/lib/useful-links'
import { pageHref, footerPageIds } from '@/lib/site'
import { staticSearchDocuments } from '@/lib/search/catalog'
it('preserves all seven owner URLs and the MASEN map coordinates', () => {
  expect(usefulLinks).toHaveLength(7)
  expect(usefulLinks[3].href).toBe('https://solaratlas.masen.ma/map?s=31.625815:-7.989137')
  expect(usefulLinks.slice(4).map(({ href }) => href)).toEqual([
    'https://evplan.org/',
    'https://pvmapping.cartographie.ma/',
    'https://solartwin-webiste.vercel.app/',
  ])
  expect(footerPageIds).toContain('usefulLinks')
})
describe('localized useful links', () => {
  for (const locale of ['fr', 'en', 'ar'] as const)
    it(locale, () => {
      const docs = staticSearchDocuments()
      expect(
        docs.find((x) => x.id === `section:library:link-masen-solar-atlas:${locale}`)?.body,
      ).toContain('MASEN')
      for (const link of usefulLinks)
        expect(docs.find((x) => x.id === `section:library:link-${link.id}:${locale}`)?.url).toBe(
          pageHref('usefulLinks', locale, link.id),
        )
      expect(docs.some((x) => x.id.startsWith('section:usefulLinks:'))).toBe(false)
      for (const oldId of ['masen', 'anre', 'amee', 'onee', 'mtedd'])
        expect(docs.some((x) => x.id === `section:library:link-${oldId}:${locale}`)).toBe(false)
      expect(docs.some((x) => x.id === `page:usefulLinks:${locale}`)).toBe(false)
      expect(pageHref('usefulLinks', locale)).toBe(pageHref('media', locale, 'press-resources'))
    })
})
