'use client'

import { useState } from 'react'
import { CmsIcon } from './CmsIcon'
import { type Entry, type Language } from '@/lib/cms-preview/model'

export const organigramKinds: Record<string, string> = {
  pole: 'Pôle',
  department: 'Direction',
  person: 'Personne',
}

export function OrganigramOverview({
  entries,
  language,
  open,
  create,
}: {
  entries: Entry[]
  language: Language
  open: (entry: Entry) => void
  create: (kind: string) => void
}) {
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim()
  const search = normalize(query)
  const records = entries
    .filter((entry) => entry.module === 'organigram')
    .sort((a, b) => Number(a.shared.sortOrder || 0) - Number(b.shared.sortOrder || 0))
  const title = (entry: Entry) =>
    entry.variants[language].title || entry.variants.fr.title || 'Fiche à compléter'
  const childrenOf = (entry: Entry) => records.filter((child) => child.shared.parentId === entry.id)
  function matches(entry: Entry, ancestors = new Set<string>()): boolean {
    if (ancestors.has(entry.id)) return false
    return (
      normalize(`${title(entry)} ${entry.variants[language].fields.function || ''}`).includes(
        search,
      ) || childrenOf(entry).some((child) => matches(child, new Set([...ancestors, entry.id])))
    )
  }
  function branch(entry: Entry, ancestors: Set<string>) {
    if (ancestors.has(entry.id) || (search && !matches(entry))) return null
    const children = childrenOf(entry)
    const expanded = Boolean(search) || !collapsed.has(entry.id)
    const kind = entry.shared.recordType
    const label = organigramKinds[kind] ?? 'Personne'
    return (
      <li key={entry.id}>
        <div className={`cms-org-row cms-org-row-${kind}`}>
          {children.length ? (
            <button
              className="cms-org-toggle"
              aria-expanded={expanded}
              aria-label={`${expanded ? 'Replier' : 'Déplier'} ${title(entry)}`}
              onClick={() =>
                setCollapsed((previous) => {
                  const next = new Set(previous)
                  if (next.has(entry.id)) next.delete(entry.id)
                  else next.add(entry.id)
                  return next
                })
              }
            >
              <CmsIcon name="chevron" />
            </button>
          ) : (
            <span className="cms-org-symbol">
              <CmsIcon name={kind === 'person' ? 'users' : 'network'} />
            </span>
          )}
          <button
            className="cms-org-open"
            onClick={() => open(entry)}
            aria-label={`Modifier ${title(entry)}`}
          >
            <span className="cms-org-kind">{label}</span>
            <strong dir="auto">{title(entry)}</strong>
            {entry.variants[language].fields.function && (
              <small dir="auto">{entry.variants[language].fields.function}</small>
            )}
          </button>
          {children.length > 0 && (
            <span className="cms-org-child-count">
              {children.length} rattachement{children.length > 1 ? 's' : ''}
            </span>
          )}
          <button
            className="cms-org-edit"
            onClick={() => open(entry)}
            aria-label={`Ouvrir la fiche de ${title(entry)}`}
            title="Modifier la fiche"
          >
            <CmsIcon name="edit" />
          </button>
        </div>
        {children.length > 0 && expanded && (
          <ul>{children.map((child) => branch(child, new Set([...ancestors, entry.id])))}</ul>
        )}
      </li>
    )
  }
  const roots = records.filter(
    (entry) =>
      !entry.shared.parentId ||
      !records.some((candidate) => candidate.id === entry.shared.parentId),
  )
  return (
    <section className="cms-panel cms-org-overview">
      <h2>Gérer l’organigramme</h2>
      <p className="cms-help">
        Parcourez les unités, puis ouvrez une fiche pour modifier ses informations ou son
        rattachement.
      </p>
      <div className="cms-org-toolbar">
        <label className="cms-org-search">
          <span>Rechercher une unité ou une personne</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, direction, fonction…"
          />
        </label>
        <div className="cms-actions">
          {Object.keys(organigramKinds).map((kind) => (
            <button
              key={kind}
              className={`cms-button${kind === 'person' ? ' cms-primary' : ''}`}
              onClick={() => create(kind)}
            >
              <CmsIcon name="plus" />
              {kind === 'person' ? 'Une personne' : kind === 'pole' ? 'Un pôle' : 'Une direction'}
            </button>
          ))}
        </div>
      </div>
      <div className="cms-org-summary">
        <p>
          {records.filter((e) => e.shared.recordType === 'pole').length} pôles ·{' '}
          {records.filter((e) => e.shared.recordType === 'department').length} directions ·{' '}
          {records.filter((e) => e.shared.recordType === 'person').length} personnes
        </p>
        <div className="cms-actions">
          <button
            className="cms-text-button"
            disabled={Boolean(search) || !collapsed.size}
            onClick={() => setCollapsed(new Set())}
          >
            Tout déplier
          </button>
          <button
            className="cms-text-button"
            disabled={
              Boolean(search) ||
              collapsed.size === records.filter((e) => childrenOf(e).length).length
            }
            onClick={() =>
              setCollapsed(new Set(records.filter((e) => childrenOf(e).length).map((e) => e.id)))
            }
          >
            Tout replier
          </button>
        </div>
      </div>
      {records.length ? (
        <div>
          <ul className="cms-org-tree">{roots.map((entry) => branch(entry, new Set()))}</ul>
          {search && !roots.some((entry) => matches(entry)) && (
            <p role="status" className="cms-help">
              Aucun résultat pour « {query} ». Essayez un autre nom ou une fonction.
            </p>
          )}
          {!roots.length && (
            <p>
              La hiérarchie importée contient une boucle. Ouvrez les fiches dans la liste pour
              corriger leurs rattachements.
            </p>
          )}
        </div>
      ) : (
        <p className="cms-help">
          Aucun organigramme réel n’est chargé. Commencez par un pôle ou une personne dans cet
          atelier.
        </p>
      )}
    </section>
  )
}
