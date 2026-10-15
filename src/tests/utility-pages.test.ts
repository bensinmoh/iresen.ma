import { describe, expect, it } from 'vitest'
import { staticSearchDocuments, publicAssetReferences } from '@/lib/search/catalog'
import { footerPageIds, pageHref } from '@/lib/site'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'

describe('utility-page public discovery', () => {
  const documents = staticSearchDocuments()
  for (const locale of ['fr', 'en', 'ar'] as const) {
    it(`${locale}: indexes current notices and withdraws the unused sitemap scaffolds`, () => {
      const catalog = { fr, en, ar }[locale]
      for (const id of footerPageIds.filter((id) => id !== 'usefulLinks')) {
        const page = documents.find((entry) => entry.id === `page:${id}:${locale}`)!
        expect(page.url).toBe(pageHref(id, locale))
        expect(page.title).toBe(catalog.Pages[id])
        expect(page.body).not.toMatch(/À prévoir|To plan|يُخطط/)
      }
      const rights = documents.find(
        (entry) => entry.id === `section:privacy:rights-contact:${locale}`,
      )!
      expect(rights.url).toBe(pageHref('privacy', locale, 'rights-contact'))
      expect(rights.body).toContain(catalog.PageSections.privacy['rights-contact'].details[0])
      expect(rights.body).toContain('contact@iresen.ma')
      const sitemap = documents.find(
        (entry) => entry.id === `section:sitemap:site-pages:${locale}`,
      )!
      expect(sitemap.body).toContain(catalog.Pages.publications)
      expect(sitemap.body).toContain(catalog.Pages.governance)
      expect(sitemap.body).toContain(catalog.Navigation.patents)
      const formerCookieHero = publicAssetReferences.find(
        (entry) => entry.id === 'hero-wind-landscape',
      )
      expect(formerCookieHero).toBeDefined()
      expect(formerCookieHero!.text[locale]!.title).not.toContain(catalog.Pages.cookies)
      for (const id of ['catalogues-resources', 'search-useful-information'])
        expect(documents.some((entry) => entry.id === `section:sitemap:${id}:${locale}`)).toBe(
          false,
        )
    })
  }
})
