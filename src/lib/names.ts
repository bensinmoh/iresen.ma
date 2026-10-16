import institutions from '../data/institution-names.json' with { type: 'json' }
import coordinators from '../data/project-coordinators.json' with { type: 'json' }

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export const exactNameReplacements: ReadonlyMap<string, string> = new Map([
  ['ville de marrakech', 'Marrakech'],
  ['city of marrakech', 'Marrakech'],
  ['مدينة مراكش', 'مراكش'],
])
const replacements = new Map<string, string>()
for (const institution of institutions) {
  if (institution.arabicName) {
    replacements.set(institution.arabicName, institution.arabicName)
    for (const alias of institution.arabicAliases) replacements.set(alias, institution.arabicName)
  }
  replacements.set(institution.name.toLocaleLowerCase('fr'), institution.name)
  for (const alias of institution.aliases)
    replacements.set(alias.toLocaleLowerCase('fr'), institution.name)
}
for (const [source, person] of Object.entries(coordinators)) {
  const name = `${person.givenName} ${person.familyName}`
  replacements.set(source.toLocaleLowerCase('fr'), name)
  replacements.set(name.toLocaleLowerCase('fr'), name)
}
replacements.set('région tahala- agadir -', 'Tahala')
replacements.set('tahala- agadir region -', 'Tahala')
replacements.set('تهالة – منطقة أكادير –', 'تهالة')
replacements.set('mascir, rabat', 'MAScIR')
replacements.set('mascir، الرباط', 'MAScIR')
replacements.set('mascir', 'MAScIR')
for (const city of ['benguerir', 'benguérir', 'ben guérir', 'ben guerir', 'بن جرير']) {
  replacements.set(`green energy park ${city}`, 'Green Energy Park')
  replacements.set(`gep ${city}`, 'Green Energy Park')
}
replacements.set('green energy park (gep)', 'Green Energy Park')
replacements.set('green energypark (gep)', 'Green Energy Park')
replacements.set('green energy park', 'Green Energy Park')
replacements.set('gep', 'Green Energy Park')
replacements.set('gep-mci côte d’ivoire', 'Green Energy Park Maroc–Côte d’Ivoire')
replacements.set('gep - mci côte d’ivoire', 'Green Energy Park Maroc–Côte d’Ivoire')
replacements.set('gep-mci', 'Green Energy Park Maroc–Côte d’Ivoire')
replacements.set('gep - mci', 'Green Energy Park Maroc–Côte d’Ivoire')
export const editorialNameReplacements: ReadonlyMap<string, string> = replacements

const matcher = new RegExp(
  `(?<![\\p{L}\\p{N}_-])(?:${[...replacements.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join('|')})(?![\\p{L}\\p{N}_-])`,
  'giu',
)

/** Explicit editorial identities only: never guess where a person's surname begins. */
export function canonicalNames(text: string): string {
  const exact = exactNameReplacements.get(text.trim().toLocaleLowerCase('fr'))
  if (exact) return exact
  return text.replace(matcher, (match) => replacements.get(match.toLocaleLowerCase('fr')) ?? match)
}
