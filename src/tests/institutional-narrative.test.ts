import { describe, expect, it } from 'vitest'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'
import { staticSearchDocuments } from '@/lib/search/catalog'
import { isSupportedAnchor, pageHref } from '@/lib/site'
import { pageSections } from '@/lib/page-sections'

describe('October institutional narrative', () => {
  it('keeps the PDF mission verbatim and uses one statement on both institutional entry points', () => {
    expect(fr.Institute.statement).toBe(
      'Relier la recherche aux besoins de la transition énergétique et du développement durable et construire, avec nos partenaires, les capacités nécessaires pour développer, éprouver et valoriser des solutions innovantes au service de cette ambition.',
    )
    for (const catalog of [fr, en, ar]) {
      expect(catalog.Institute.statement).toBe(
        catalog.PageSections.home['develop-test-transfer'].description,
      )
      expect(Object.keys(catalog.Narrative.dimensions)).toEqual([
        'studies',
        'skills',
        'cooperation',
      ])
      expect(Object.keys(catalog.HomeCollaboration.paths)).toHaveLength(5)
      expect(
        catalog.Engagement.workWithUs.sections['organisation-contributions'].items,
      ).toHaveLength(6)
    }
  })
  it.each(['fr', 'en', 'ar'] as const)(
    '%s: discovers the model, complementary contributions and actual evidence at stable URLs',
    (locale) => {
      const catalog = { fr, en, ar }[locale]
      const documents = staticSearchDocuments().filter((d) => d.locale === locale)
      for (const { id } of pageSections.institute.flatMap((s) => [s, ...(s.children ?? [])])) {
        expect(isSupportedAnchor('institute', id)).toBe(true)
        const record = documents.find((d) => d.id === `section:institute:${id}:${locale}`)
        expect(record?.url).toBe(pageHref('institute', locale, id))
      }
      const core = documents.find((d) => d.id === `section:home:mission-research:${locale}`)!
      expect(core.body).toContain(catalog.Narrative.coreDescription)
      const position = documents.find(
        (d) => d.id === `section:institute:institute-positioning:${locale}`,
      )!
      expect(position.body).toContain(catalog.Narrative.ecosystem.note)
      for (const [id, item] of Object.entries(catalog.HomeAchievements.items)) {
        const record = documents.find((d) => d.id === `section:home:achievement-${id}:${locale}`)!
        expect(record.body).toContain(item.proof.scope)
      }
      expect(catalog.Transfer.intro).toBe(catalog.Hero.descriptions.transfer)
      expect(
        documents.some((d) => /IRESEN_Narratif_Institutionnel|\/tmp\/|attachments/.test(d.url)),
      ).toBe(false)
    },
  )
})
