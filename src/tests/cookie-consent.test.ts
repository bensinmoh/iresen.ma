import { staticSearchDocuments } from '@/lib/search/catalog'
import { pageHref } from '@/lib/site'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'
import { describe, expect, it } from 'vitest'
import { consentMaxAge, parseConsent } from '@/lib/cookie-consent'

describe('consent expiry and policy gates', () => {
  const now = 1800000000000
  it('recognizes explicit acceptance and refusal for the same lifetime', () => {
    for (const external of [true, false]) {
      const value = { version: 1, external, expires: now + consentMaxAge * 1000 }
      expect(parseConsent(JSON.stringify(value), now)).toEqual(value)
    }
  })
  it('fails closed for invalid, expired, future-duration or outdated decisions', () => {
    for (const raw of [
      '',
      'null',
      '{}',
      'broken',
      JSON.stringify({ version: 1, external: 'true', expires: now + 1000 }),
      JSON.stringify({ version: 1, external: true, expires: now }),
      JSON.stringify({ version: 0, external: true, expires: now + 1000 }),
      JSON.stringify({ version: 1, external: true, expires: now + consentMaxAge * 1000 + 1 }),
    ])
      expect(parseConsent(raw, now)).toBeNull()
  })
})

it('registers current cookie information and preference anchors in every public language', () => {
  const documents = staticSearchDocuments()
  for (const locale of ['fr', 'en', 'ar'] as const) {
    const copy = { fr, en, ar }[locale].CookieConsent
    const page = documents.find((item) => item.id === `page:cookies:${locale}`)!
    expect(page.url).toBe(pageHref('cookies', locale))
    expect(page.body).toContain(copy.necessaryDescription)
    expect(page.body).toContain(copy.retention)
    const section = documents.find(
      (item) => item.id === `section:cookies:manage-preferences:${locale}`,
    )!
    expect(section.url).toBe(pageHref('cookies', locale, 'manage-preferences'))
    expect(section.body).toContain(
      { fr, en, ar }[locale].PageSections.cookies['manage-preferences'].description,
    )
  }
})
