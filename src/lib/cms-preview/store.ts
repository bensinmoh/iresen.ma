'use client'

import type { DeleteImpact } from './delete-impact'
import { workspaceRequest } from '@/lib/cms-workspace/client'
import { workspaceSchema } from './schema'
import { initialWorkspace, type Entry, type Workspace } from './model'

export const storageKey = 'iresen.cms-interface.v1'
const initial = initialWorkspace()

type ContentRuntime = {
  current: Workspace
  connected: boolean
  revision: number
  saving: boolean
  loaded: boolean
  storageError: string
  conflict: boolean
  listeners: Set<() => void>
}
const browser =
  typeof window === 'undefined'
    ? undefined
    : (window as Window & { __iresenCmsContentRuntime?: ContentRuntime })
// Keep the authenticated in-memory store across development module refreshes.
// Server rendering gets a separate, unconfigured instance; no private browser
// records enter server globals or localStorage through this mechanism. The same
// runtime also lets an in-flight save finish safely during a module refresh.
const runtime: ContentRuntime = browser?.__iresenCmsContentRuntime ?? {
  current: initial,
  connected: false,
  revision: 0,
  saving: false,
  loaded: false,
  storageError: '',
  conflict: false,
  listeners: new Set(),
}
if (browser) browser.__iresenCmsContentRuntime = runtime
export const contentConnected = () => runtime.connected
export function configureConnectedContent(workspace: Workspace, version: number) {
  runtime.connected = true
  runtime.loaded = true
  runtime.current = workspaceSchema.parse(workspace)
  runtime.revision = version
  runtime.storageError = ''
  runtime.conflict = false
  for (const notify of runtime.listeners) notify()
}
export function subscribe(listener: () => void) {
  runtime.listeners.add(listener)
  if (!runtime.loaded) {
    runtime.loaded = true
    // Discard the obsolete browser demonstration; authenticated DB state is authoritative.
    try {
      window.localStorage.removeItem(storageKey)
    } catch {
      /* Storage may be disabled. */
    }
  }
  const onStorage = (event: StorageEvent) => {
    if (!runtime.connected && event.key === storageKey) {
      // Keep this tab's work; never silently replace a colleague/tab's unsaved revision.
      runtime.conflict = true
      runtime.current = { ...runtime.current }
      runtime.storageError =
        'Une autre fenêtre a modifié l’atelier. Rechargez après avoir exporté vos changements.'
      for (const notify of runtime.listeners) notify()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    runtime.listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}
export const getSnapshot = () => runtime.current
export const getServerSnapshot = () => initial
export const getStorageError = () => runtime.storageError
export type ContentAction = 'draft' | 'review' | 'delete' | 'restore' | 'highlight'
export async function getDeleteImpact(id: string) {
  if (!runtime.connected || runtime.saving)
    throw new Error('Attendre la connexion ou la fin de l’enregistrement en cours.')
  return workspaceRequest<DeleteImpact>(
    `actions?action=delete-impact&id=${encodeURIComponent(id)}&revision=${runtime.revision}`,
  )
}
export async function performContentAction(
  id: string,
  action: ContentAction,
  language: 'fr' | 'en' | 'ar',
  note: string,
  impact?: DeleteImpact,
) {
  if (!runtime.connected || runtime.saving)
    throw new Error('Attendre la connexion ou la fin de l’enregistrement en cours.')
  runtime.saving = true
  try {
    const result = await workspaceRequest<{ workspace: Workspace; revision: number }>('actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        action,
        language,
        note,
        revision: action === 'delete' ? impact?.revision : runtime.revision,
        deleteImpactToken: impact?.token,
      }),
    })
    configureConnectedContent(result.workspace, result.revision)
    return runtime.current
  } finally {
    runtime.saving = false
  }
}
export async function persist(workspace: Workspace, requireConnection = true): Promise<Workspace> {
  if ((requireConnection || !runtime.connected) && !runtime.connected)
    throw new Error(
      'La connexion du CMS doit être rechargée avant d’enregistrer. Aucune copie locale n’a été créée.',
    )
  if (runtime.connected) {
    if (runtime.saving)
      throw new Error('Un enregistrement est déjà en cours. Attendez sa confirmation.')
    runtime.saving = true
    try {
      const result = await workspaceRequest<{ workspace: Workspace; revision: number }>('content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace: {
            version: 1,
            entries: workspace.entries.filter(
              (entry) =>
                JSON.stringify(entry) !==
                JSON.stringify(runtime.current.entries.find((saved) => saved.id === entry.id)),
            ),
            logs: [],
          },
          revision: runtime.revision,
        }),
      })
      runtime.current = workspaceSchema.parse(result.workspace)
      runtime.revision = result.revision
      runtime.storageError = ''
      for (const notify of runtime.listeners) notify()
      return runtime.current
    } finally {
      runtime.saving = false
    }
  }
  throw new Error('Connexion à PostgreSQL requise pour enregistrer.')
}

export async function uploadConnectedMedia(
  file: File,
  title: string,
  kind?: 'image',
): Promise<Entry> {
  if (!runtime.connected) throw new Error('Connexion au CMS requise.')
  if (runtime.saving) throw new Error('Un enregistrement est en cours.')
  runtime.saving = true
  try {
    const body = new FormData()
    body.set('file', file)
    body.set('title', title)
    body.set('revision', String(runtime.revision))
    if (kind) body.set('kind', kind)
    const result = await workspaceRequest<{ workspace: Workspace; revision: number; entry: Entry }>(
      'media',
      { method: 'POST', body },
    )
    runtime.current = workspaceSchema.parse(result.workspace)
    runtime.revision = result.revision
    for (const notify of runtime.listeners) notify()
    return result.entry
  } finally {
    runtime.saving = false
  }
}
