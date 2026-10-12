import { describe, expect, it } from 'vitest'
import { usefulLinks } from '@/lib/useful-links'
import { pageHref, footerPageIds } from '@/lib/site'
import { staticSearchDocuments } from '@/lib/search/catalog'
it('preserves all four owner URLs and the MASEN map coordinates', () => {
  expect(usefulLinks).toHaveLength(4)
  expect(usefulLinks[3].href).toBe('https://solaratlas.masen.ma/map?s=31.625815:-7.989137')
  expect(footerPageIds).toContain('usefulLinks')
})
describe('localized useful links', () => {
  for (const locale of ['fr', 'en', 'ar'] as const)
    it(locale, () => {
      const docs = staticSearchDocuments()
      expect(
        docs.find((x) => x.id === `section:usefulLinks:masen-solar-atlas:${locale}`)?.body,
      ).toContain('MASEN')
      for (const link of usefulLinks)
        expect(docs.find((x) => x.id === `section:usefulLinks:${link.id}:${locale}`)?.url).toBe(
          pageHref('usefulLinks', locale, link.id),
        )
      expect(docs.find((x) => x.id === `page:usefulLinks:${locale}`)?.url).toBe(
        pageHref('usefulLinks', locale),
      )
      expect(
        docs.find((x) => x.id === `section:usefulLinks:mapping-tools:${locale}`)?.body,
      ).toBeTruthy()
    })
})
