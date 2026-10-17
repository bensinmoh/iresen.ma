import {
  fieldApplies,
  hierarchyErrors,
  relationCandidate,
  fieldValue,
  languages,
  modules,
  type Entry,
  type Field,
} from './model'
import type { ConnectionRecord } from './contracts'

export function typedValue(
  value: string,
  field: Field,
): string | number | boolean | string[] | object | null {
  if (!value.trim()) return null
  if (field.type === 'number') return Number(value)
  if (field.type === 'boolean') return value === 'true'
  if (field.type === 'relation' && field.many) return value.split('\n').filter(Boolean)
  if (field.type === 'json') return JSON.parse(value)
  return value
}
export function connectionRecord(entry: Entry): ConnectionRecord {
  const fields =
    modules
      .find((module) => module.id === entry.module)
      ?.fields.filter((field) => fieldApplies(entry, field)) ?? []
  return {
    id: entry.id,
    collection: entry.module,
    reference: entry.reference,
    updatedAt: entry.updatedAt,
    shared: Object.fromEntries(
      fields
        .filter((field) => !field.localized)
        .map((field) => [field.key, typedValue(fieldValue(entry, field, 'fr'), field)]),
    ),
    locales: Object.fromEntries(
      languages.map((language) => [
        language,
        {
          ...entry.variants[language],
          fields: Object.fromEntries(
            fields
              .filter((field) => field.localized)
              .map((field) => [field.key, typedValue(fieldValue(entry, field, language), field)]),
          ),
        },
      ]),
    ),
  }
}
export function relationErrors(entry: Entry, entries: Entry[]): string[] {
  return [
    ...hierarchyErrors(entry, entries),
    ...(
      modules
        .find((module) => module.id === entry.module)
        ?.fields.filter((field) => fieldApplies(entry, field)) ?? []
    ).flatMap((field) => {
      if (field.type !== 'relation' || !entry.shared[field.key]) return []
      return entry.shared[field.key]
        .split('\n')
        .filter(Boolean)
        .some(
          (id) =>
            !entries.some(
              (candidate) => candidate.id === id && relationCandidate(entry, field, candidate),
            ),
        )
        ? [
            `${field.label} : référence locale introuvable ; sélectionner une fiche de ${field.relationTo}.`,
          ]
        : []
    }),
  ]
}
