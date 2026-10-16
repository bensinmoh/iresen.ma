import registry from '../data/moroccan-universities.json' with { type: 'json' }
import { editorialNameReplacements, exactNameReplacements } from './names'
import type { Locale } from '@/i18n/locales'

export type InstitutionIdentity = {
  id: string
  name: string
  arabicName: string
  acronym: string
  aliases: string[]
  universityId?: string
}
export type InstitutionReference = { id: string; label: string }
export type InstitutionalAffiliations = {
  institutions: InstitutionReference[]
  universities: InstitutionReference[]
  searchText: string
}
const identities: InstitutionIdentity[] = [
  ...registry.universities,
  ...registry.establishments,
  ...registry.independentInstitutions,
]
const universityIds = new Set(registry.universities.map((identity) => identity.id))
const byId = new Map(identities.map((identity) => [identity.id, identity]))
export const universityRegistry = registry

export function normalizeInstitutionText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\p{M}\u0640]/gu, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .toLocaleLowerCase('fr')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}
function identityAliases(identity: InstitutionIdentity): string[] {
  return [identity.name, identity.arabicName, identity.acronym, ...identity.aliases].filter(Boolean)
}
// A generic FS, EST, ENSA or FST never identifies one campus. Only unique aliases
// qualify; city-qualified source abbreviations remain usable across all locales.
const aliases = new Map<string, Set<string>>()
for (const identity of identities) {
  for (const alias of identityAliases(identity)) {
    const key = normalizeInstitutionText(alias)
    if (key.length < 3) continue
    const ids = aliases.get(key) ?? new Set<string>()
    ids.add(identity.id)
    aliases.set(key, ids)
  }
}
const uniqueAliases = new Map(
  [...aliases].flatMap(([alias, ids]) => (ids.size === 1 ? [[alias, [...ids][0]] as const] : [])),
)
const matcher = new RegExp(
  `(?<![\\p{L}\\p{N}])(?:${[...uniqueAliases.keys()].sort((a, b) => b.length - a.length).join('|')})(?![\\p{L}\\p{N}])`,
  'gu',
)

export function institutionLabel(identity: InstitutionIdentity, locale: Locale): string {
  return locale === 'ar' && identity.arabicName
    ? identity.arabicName
    : identity.name || identity.arabicName
}
export function identifyInstitutions(text: string): InstitutionIdentity[] {
  const ids = new Set<string>()
  for (const match of normalizeInstitutionText(text).matchAll(matcher)) {
    const id = uniqueAliases.get(match[0])
    if (id) ids.add(id)
  }
  return [...ids].flatMap((id) => {
    const identity = byId.get(id)
    return identity ? [identity] : []
  })
}

/** Institutional relationships are metadata, never inferred project participants. */
export function institutionalAffiliations(text: string, locale: Locale): InstitutionalAffiliations {
  const direct = identifyInstitutions(text)
  const parentIds = new Set(direct.map((identity) => identity.universityId ?? identity.id))
  const universities = [...parentIds].flatMap((id) => {
    const parent = byId.get(id)
    return parent && universityIds.has(parent.id) ? [parent] : []
  })
  const reference = (identity: InstitutionIdentity) => ({
    id: identity.id,
    label: institutionLabel(identity, locale),
  })
  return {
    institutions: direct.filter((identity) => !universityIds.has(identity.id)).map(reference),
    universities: universities.map(reference),
    searchText: [...new Set([...direct, ...universities].flatMap(identityAliases))].join(' '),
  }
}

// Match complete, explicit source forms for display; ambiguous abbreviations are
// kept as supplied until context identifies a campus. Dates and URLs are untouched.
const displayAliases = new Map(editorialNameReplacements)
for (const identity of identities) {
  for (const alias of identityAliases(identity)) {
    const key = normalizeInstitutionText(alias)
    if (uniqueAliases.get(key) !== identity.id) continue
    displayAliases.set(
      alias.toLocaleLowerCase('fr'),
      institutionLabel(identity, /[\u0600-\u06ff]/.test(alias) ? 'ar' : 'fr'),
    )
  }
}
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const displayMatcher = new RegExp(
  `(?<![\\p{L}\\p{N}_-])(?:${[...displayAliases.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join('|')})(?![\\p{L}\\p{N}_-])`,
  'giu',
)
export function canonicalInstitutionNames(text: string): string {
  const exact = exactNameReplacements.get(text.trim().toLocaleLowerCase('fr'))
  if (exact) return exact
  return text.replace(
    displayMatcher,
    (match) => displayAliases.get(match.toLocaleLowerCase('fr')) ?? match,
  )
}

/** Inverse edge for consumers that need to navigate an institution family. */
export function establishmentsForUniversity(universityId: string): InstitutionIdentity[] {
  return identities.filter((identity) => identity.universityId === universityId)
}
