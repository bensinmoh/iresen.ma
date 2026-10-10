import records from '@/data/publications.json' with { type: 'json' }
import type { Locale } from '@/i18n/locales'

/** Only the owner-retained bibliographic projection; never import either workbook. */
export const publications = records
export type Publication = (typeof records)[number]
const definitions = [
  ['solar', /\b(solar|photovoltaic|pv|csp|perovskite)/i],
  [
    'materials',
    /\b(materials?|nanoparticles?|nanocomposites?|thin films?|alloys?|semiconductors?|polymers?|graphene|oxide|doped|doping|crystal)/i,
  ],
  ['thermal', /\b(thermal|heat|cooling|temperature|combustion)/i],
  ['water', /\b(water|wastewater|desalination|adsorption|pollutant|membrane)/i],
  ['storage', /\b(storage|batter(?:y|ies)|supercapacitor|lithium|sodium.ion)/i],
  ['grids', /\b(grids?|microgrids?|power systems?|power management|electricity|smart grid)/i],
  ['hydrogen', /\b(hydrogen|electrolys|fuel cells?)/i],
  ['wind', /\b(wind|turbines?)/i],
  ['buildings', /\b(buildings?|airtightness|insulation|energy efficiency)/i],
  ['bioenergy', /\b(biomass|biogas|biofuel|anaerobic|bioenergy)/i],
  ['mobility', /\b(electric vehicles?|transportation|mobility)/i],
] as const
export type PublicationTopic = (typeof definitions)[number][0]
/** Multi-label title analysis, not a replacement for the sourced bibliographic domain. */
export function titleTopics(title: string) {
  return definitions.filter(([, pattern]) => pattern.test(title)).map(([id]) => id)
}
export const publicationTopics = definitions
  .map(([id]) => ({
    id,
    count: publications.filter((p) => titleTopics(p.title).includes(id)).length,
  }))
  .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
export const frequentPublicationTopics = publicationTopics.slice(0, 6)
export const publicationYears = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a)
const normalize = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
export function filterPublications(query: string, topics: string[] = [], years: string[] = []) {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  return publications
    .filter((p) => {
      const text = normalize([p.title, p.authors, p.doiUrl, p.theme, p.journal, p.type].join(' '))
      return (
        terms.every((term) => text.includes(term)) &&
        (!topics.length || titleTopics(p.title).some((id) => topics.includes(id))) &&
        (!years.length || years.includes(String(p.year)))
      )
    })
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
}
export function publicationDate(p: Publication, locale: Locale) {
  // The database supplies years only. Do not fabricate a month from a DOI or snapshot date.
  return p.year.toLocaleString(locale, { useGrouping: false })
}
export function publicationAnchor(id: string) {
  return `publication-${id}`
}
