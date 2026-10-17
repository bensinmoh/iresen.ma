'use client'
import { useEffect, useState } from 'react'
import { workspaceRequest } from '@/lib/cms-workspace/client'
import type { Role } from '@/lib/cms-preview/model'
export function Trash({
  role,
  restore,
  version,
}: {
  role: Role
  restore: (id: string, title: string) => void
  version: unknown
}) {
  const [entries, setEntries] = useState<{ id: string; title: string; module: string }[] | null>(
    null,
  )
  const [error, setError] = useState('')
  useEffect(() => {
    if (role !== 'admin') return
    let active = true
    workspaceRequest<{ entries: { id: string; title: string; module: string }[] }>('actions')
      .then((result) => {
        if (active) {
          setEntries(result.entries)
          setError('')
        }
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Chargement impossible.')
      })
    return () => {
      active = false
    }
  }, [role, version])
  if (role !== 'admin') return <p>La corbeille est réservée aux administrateurs.</p>
  return (
    <section className="cms-panel">
      <h2>Corbeille</h2>
      <p>
        Les fiches supprimées restent récupérables. Une restauration revient en brouillon privé et
        nécessite une nouvelle validation.
      </p>
      {error && <p role="alert">{error}</p>}
      {entries === null ? (
        <p role="status">Chargement…</p>
      ) : entries.length ? (
        entries.map((entry) => (
          <div key={entry.id} className="cms-document-row">
            <span>
              <strong>{entry.title || entry.id}</strong>
              <small>{entry.module}</small>
            </span>
            <button className="cms-button" onClick={() => restore(entry.id, entry.title)}>
              Restaurer en brouillon
            </button>
          </div>
        ))
      ) : (
        <p>Aucune fiche dans la corbeille.</p>
      )}
    </section>
  )
}
