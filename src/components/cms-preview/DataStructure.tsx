'use client'

import { useState } from 'react'
import {
  fieldValue,
  editorialBodyRequired,
  relationCandidate,
  modules,
  type Entry,
  type Field,
  type Language,
  type Module,
} from '@/lib/cms-preview/model'
import { contentConnected } from '@/lib/cms-preview/store'
import { connectionRecord } from '@/lib/cms-preview/connection'
import { PhotoUpload } from './PhotoUpload'

export function BusinessField({
  field,
  entry,
  language,
  entries,
  change,
}: {
  field: Field
  entry: Entry
  language: Language
  entries: Entry[]
  change: (value: string) => void
}) {
  const value = fieldValue(entry, field, language)
  const common = {
    value,
    disabled: field.readOnly,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => change(event.target.value),
  }
  const options = entries.filter((candidate) => relationCandidate(entry, field, candidate))
  if (field.imageUpload)
    return <PhotoUpload {...{ field, entry, language, entries, value, change }} />
  return (
    <label
      className={
        field.type === 'textarea' || field.type === 'json' || field.many ? 'cms-field-wide' : ''
      }
    >
      <span>
        {field.label} {field.required && <span className="cms-required">requis avant revue</span>}
      </span>
      {field.type === 'boolean' && field.readOnly ? (
        <output>{value === 'true' ? 'Oui · article à la une' : 'Non'}</output>
      ) : field.type === 'relation' ? (
        <select
          value={field.many ? value.split('\n').filter(Boolean) : value}
          multiple={field.many}
          disabled={field.readOnly}
          onChange={(event) =>
            change(
              field.many
                ? Array.from(event.target.selectedOptions)
                    .map((option) => option.value)
                    .join('\n')
                : event.target.value,
            )
          }
        >
          {!field.many && <option value="">Aucune sélection</option>}
          {value
            .split('\n')
            .filter((id) => id && !options.some((candidate) => candidate.id === id))
            .map((id) => (
              <option key={id} value={id}>
                Référence à vérifier : {id}
              </option>
            ))}
          {options.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.variants[language].title ||
                candidate.variants.fr.title ||
                candidate.reference}
            </option>
          ))}
        </select>
      ) : field.type === 'select' || field.type === 'boolean' ? (
        <select {...common}>
          <option value="">Non renseigné</option>
          {(field.options ?? ['true', 'false']).map((option) => (
            <option key={option} value={option}>
              {field.type === 'boolean'
                ? option === 'true'
                  ? 'Oui'
                  : 'Non'
                : (field.optionLabels?.[option] ?? option)}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' || field.type === 'json' ? (
        <textarea
          {...common}
          rows={4}
          dir={field.localized && language === 'ar' ? 'rtl' : 'auto'}
          lang={field.localized ? language : undefined}
        />
      ) : (
        <input
          {...common}
          type={field.type ?? 'text'}
          onInput={field.type === 'date' ? (event) => change(event.currentTarget.value) : undefined}
          min={field.min}
          max={field.max}
          step={field.type === 'number' ? 'any' : undefined}
          dir={field.localized && language === 'ar' ? 'rtl' : 'auto'}
          lang={field.localized ? language : undefined}
        />
      )}
      <small>
        <code>{field.key}</code> · {field.type}{' '}
        {field.localized ? `· ${language.toUpperCase()}` : '· partagé'}
        {field.relationTo && ` → ${field.relationTo}${field.many ? '[]' : ''}`}
      </small>
      {field.readOnly && field.key !== 'highlight' && (
        <small>
          Source conservée en lecture seule ; utilisez les champs métier pour modifier la fiche.
        </small>
      )}
      {field.help && <small>{field.help}</small>}
      {field.type === 'relation' && options.length === 0 && (
        <small>
          Aucune fiche locale disponible. Créez d’abord une fiche dans{' '}
          {modules.find((module) => module.id === field.relationTo)?.label}.
        </small>
      )}
    </label>
  )
}
const commonFields: Field[] = [
  { key: 'id', label: 'Identifiant technique', type: 'text', required: true },
  { key: 'reference', label: 'Référence stable', type: 'text', required: true },
  { key: 'title', label: 'Titre', type: 'text', localized: true, required: true },
  {
    key: 'body',
    label: 'Description / contenu',
    type: 'textarea',
    localized: true,
    required: true,
  },
  {
    key: 'status',
    label: 'Étape éditoriale',
    type: 'select',
    localized: true,
    options: ['draft', 'review', 'published'],
    required: true,
  },
  { key: 'seoTitle', label: 'Titre de recherche', type: 'text', localized: true },
  { key: 'seoDescription', label: 'Description de recherche', type: 'textarea', localized: true },
  {
    key: 'updatedAt',
    label: 'Dernière modification',
    type: 'date',
    required: true,
    help: 'Horodatage ISO 8601 ; fourni par le serveur au raccordement.',
  },
]
export function SchemaTable({ module, entry }: { module: Module; entry?: Entry }) {
  return (
    <section className="cms-schema">
      <h2>Structure des données · {module.label}</h2>
      <p>
        {contentConnected()
          ? `PostgreSQL · cms_authoring_entries · module=${module.id} · champs métier dans shared / variants (JSONB)`
          : module.storage}
      </p>
      <p className="cms-help">
        {contentConnected()
          ? 'Droits, références, transitions et conflits contrôlés côté serveur. Révisions conservées dans cms_authoring_revisions et acteurs dans cms_private_audit. Les collections Payload existantes disposent aussi de leur adaptateur natif.'
          : 'Contrat proposé pour le futur serveur.'}{' '}
        Les champs partagés ne sont pas traduits ; les champs localisés existent en FR / EN / AR.
      </p>
      <div className="cms-table-scroll">
        <table>
          <caption>Colonnes et types de {module.label}</caption>
          <thead>
            <tr>
              <th>Colonne</th>
              <th>Champ</th>
              <th>Type</th>
              <th>Langues</th>
              <th>Règle / relation</th>
            </tr>
          </thead>
          <tbody>
            {[
              ...commonFields
                .map((field) =>
                  field.key === 'body'
                    ? { ...field, required: editorialBodyRequired(module.id) }
                    : field,
                )
                .filter((field) => !module.fields.some((business) => business.key === field.key)),
              ...module.fields,
            ].map((field) => (
              <tr key={field.key}>
                <td>
                  <code>{field.key}</code>
                </td>
                <td>{field.label}</td>
                <td>
                  {field.imageUpload ? 'image (téléversement → relation)' : field.type}
                  {field.many ? '[]' : ''}
                </td>
                <td>{field.localized ? 'FR / EN / AR' : 'Partagé'}</td>
                <td>
                  {field.required ? 'Requis avant revue' : 'Facultatif'}
                  {field.relationTo && ` · → ${field.relationTo}`}
                  {field.options && ` · ${field.options.join(' / ')}`}
                  {field.showFor && ` · Pour : ${field.showFor.join(' / ')}`}
                  {field.relationKinds && ` · Types liés : ${field.relationKinds.join(' / ')}`}
                  {field.min !== undefined && ` · min ${field.min}`}
                  {field.max !== undefined && ` · max ${field.max}`}
                  {field.readOnly && field.key !== 'highlight' && (
                    <small>
                      Source conservée en lecture seule ; utilisez les champs métier pour modifier
                      la fiche.
                    </small>
                  )}
                  {field.help && <small>{field.help}</small>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="cms-help">
        Révisions : langue, date, contenu et motif. Journal : acteur, action, ressource et date.
        Version validée : instantané distinct de la prochaine révision de travail.
      </p>
      {entry && (
        <details>
          <summary>Voir l’objet de connexion de cette fiche</summary>
          <pre className="cms-json">
            {(() => {
              try {
                return JSON.stringify(connectionRecord(entry), null, 2)
              } catch {
                return 'Corriger les champs JSON avant de générer cet objet.'
              }
            })()}
          </pre>
        </details>
      )}
    </section>
  )
}
export function DataStructure({ selected }: { selected?: string }) {
  const [moduleId, setModuleId] = useState(selected ?? 'news')
  const selectedModule = modules.find((item) => item.id === moduleId)!
  return (
    <section className="cms-panel">
      <label>
        Collection à inspecter
        <select value={moduleId} onChange={(event) => setModuleId(event.target.value)}>
          {modules.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <SchemaTable module={selectedModule} />
    </section>
  )
}
