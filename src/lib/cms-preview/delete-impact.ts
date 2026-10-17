import { languages, modules, type Entry } from './model'

export type DeleteReference = { id: string; title: string; module: string; fields: string[] }
export type DeleteImpact = {
  id: string
  title: string
  module: string
  revision: number
  languages: { language: string; status: string; published: boolean }[]
  inbound: DeleteReference[]
  outgoing: DeleteReference[]
  applications: number
  effects: string[]
  blockers: string[]
  token: string
}

/** Check saved drafts AND validated snapshots: either can still use a relationship. */
export function entryRelations(entry: Entry) {
  const relations = new Map<string, Set<string>>()
  for (const field of modules.find((module) => module.id === entry.module)?.fields ?? []) {
    if (field.type !== 'relation') continue
    const values = [
      entry.shared[field.key],
      ...languages.flatMap((language) => [
        entry.variants[language].fields[field.key],
        entry.publicVariants[language]?.fields[field.key],
      ]),
    ]
    for (const value of values)
      for (const id of value
        ?.split('\n')
        .map((id) => id.trim())
        .filter(Boolean) ?? []) {
        if (!relations.has(id)) relations.set(id, new Set())
        relations.get(id)!.add(field.label)
      }
  }
  return relations
}
export function deletionReferences(entry: Entry, entries: Entry[]) {
  const outgoing = entryRelations(entry)
  const describe = (other: Entry, fields: Set<string>): DeleteReference => ({
    id: other.id,
    title: other.variants.fr.title || other.reference,
    module: modules.find((module) => module.id === other.module)?.label || other.module,
    fields: [...fields].sort(),
  })
  const assetPaths =
    entry.module === 'media'
      ? [entry.shared.assetPath, entry.shared.sourceImagePath].filter((path) =>
          path?.startsWith('/'),
        )
      : []
  const incoming = (other: Entry) => {
    const fields = entryRelations(other).get(entry.id) ?? new Set<string>()
    const definition = modules.find((module) => module.id === other.module)
    const records = [
      other.shared,
      ...languages.flatMap((language) => [
        other.variants[language].fields,
        other.publicVariants[language]?.fields ?? {},
      ]),
    ]
    for (const record of records)
      for (const [key, value] of Object.entries(record)) {
        const field = definition?.fields.find((field) => field.key === key)
        if (field?.readOnly || key === 'sourceRecord') continue
        if (assetPaths.some((path) => value.includes(path))) fields.add(field?.label || key)
      }
    for (const language of languages)
      if (
        assetPaths.some(
          (path) =>
            other.variants[language].body.includes(path) ||
            other.publicVariants[language]?.body.includes(path),
        )
      )
        fields.add('Corps du contenu')
    return fields
  }
  return {
    inbound: entries
      .filter((other) => other.id !== entry.id && incoming(other).size > 0)
      .map((other) => describe(other, incoming(other))),
    outgoing: entries
      .filter((other) => outgoing.has(other.id))
      .map((other) => describe(other, outgoing.get(other.id)!)),
  }
}
