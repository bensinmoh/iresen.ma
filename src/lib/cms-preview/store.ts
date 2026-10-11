'use client'

import { z } from 'zod'
import { initialWorkspace, type Workspace } from './model'

export const storageKey = 'iresen.cms-interface.v1'
const variant = z.object({
  title: z.string(),
  body: z.string(),
  status: z.enum(['draft', 'review', 'validated', 'published', 'archived']),
  seoTitle: z.string(),
  seoDescription: z.string(),
})
const schema = z.object({
  version: z.literal(1),
  entries: z.array(
    z.object({
      id: z.string(),
      module: z.string(),
      reference: z.string(),
      shared: z.record(z.string(), z.string()),
      variants: z.object({ fr: variant, en: variant, ar: variant }),
      updatedAt: z.string(),
      history: z.array(
        z.object({
          id: z.string(),
          at: z.string(),
          language: z.enum(['fr', 'en', 'ar']),
          variant,
          note: z.string(),
        }),
      ),
      comment: z.string(),
      publicVariants: z.object({
        fr: variant.optional(),
        en: variant.optional(),
        ar: variant.optional(),
      }),
    }),
  ),
  logs: z.array(
    z.object({
      id: z.string(),
      at: z.string(),
      action: z.string(),
      resource: z.string(),
      language: z.enum(['fr', 'en', 'ar']).optional(),
      actor: z.enum(['admin', 'editor', 'publisher', 'translator', 'reader']),
      kind: z.enum(['audit', 'technical']),
    }),
  ),
})
const initial = initialWorkspace()
let current = initial
let loaded = false
let storageError = ''
let conflict = false
const listeners = new Set<() => void>()
export function subscribe(listener: () => void) {
  listeners.add(listener)
  if (!loaded) {
    loaded = true
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) current = schema.parse(JSON.parse(raw))
    } catch {
      current = { ...current }
      storageError =
        'Le stockage local est indisponible ou incompatible. La session reste utilisable ; exportez votre travail avant de fermer.'
    }
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey) {
      // Keep this tab's work; never silently replace a colleague/tab's unsaved revision.
      conflict = true
      current = { ...current }
      storageError =
        'Une autre fenêtre a modifié l’atelier. Rechargez après avoir exporté vos changements.'
      for (const notify of listeners) notify()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}
export const getSnapshot = () => current
export const getServerSnapshot = () => initial
export const getStorageError = () => storageError
export function persist(workspace: Workspace) {
  if (conflict)
    throw new Error(
      'Une autre fenêtre a modifié la session. Exportez votre travail puis rechargez avant de sauvegarder.',
    )
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(workspace))
    storageError = ''
  } catch {
    storageError =
      'Enregistrement conservé en mémoire uniquement. Le stockage du navigateur est plein ou bloqué ; exportez la session.'
  }
  current = workspace
  for (const notify of listeners) notify()
}
