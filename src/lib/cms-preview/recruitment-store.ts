'use client'

import { workspaceRequest } from '@/lib/cms-workspace/client'
import {
  emptyRecruitment,
  validateRecruitment,
  type RecruitmentState,
  type RecruitmentDocument,
} from './recruitment'
const initial = emptyRecruitment()

type RecruitmentRuntime = {
  current: RecruitmentState
  connected: boolean
  revision: number
  saving: boolean
  listeners: Set<() => void>
}
const browser =
  typeof window === 'undefined'
    ? undefined
    : (window as Window & { __iresenCmsRecruitmentRuntime?: RecruitmentRuntime })
const runtime: RecruitmentRuntime = browser?.__iresenCmsRecruitmentRuntime ?? {
  current: initial,
  connected: false,
  revision: 0,
  saving: false,
  listeners: new Set(),
}
if (browser) browser.__iresenCmsRecruitmentRuntime = runtime
export const recruitmentConnected = () => runtime.connected
export function configureConnectedRecruitment(state: RecruitmentState, version: number) {
  runtime.connected = true
  runtime.current = validateRecruitment(state)
  runtime.revision = version
  for (const notify of runtime.listeners) notify()
}
// Applicant text and bytes deliberately never enter localStorage, public CMS entries or global search.
const files = new Map<string, File>()
const urls = new Map<string, string>()
export const recruitmentFileUrl = (id: string) =>
  runtime.connected ? `/admin/api/documents/${encodeURIComponent(id)}` : (urls.get(id) ?? '')
export function subscribeRecruitment(listener: () => void) {
  runtime.listeners.add(listener)
  return () => {
    runtime.listeners.delete(listener)
  }
}
export const recruitmentSnapshot = () => runtime.current
export const recruitmentServerSnapshot = () => initial
export async function persistRecruitment(state: RecruitmentState): Promise<void> {
  if (runtime.connected) {
    if (runtime.saving) throw new Error('Un enregistrement de recrutement est en cours.')
    runtime.saving = true
    try {
      const result = await workspaceRequest<{ state: RecruitmentState; revision: number }>(
        'recruitment',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state, revision: runtime.revision }),
        },
      )
      runtime.current = validateRecruitment(result.state)
      runtime.revision = result.revision
      for (const notify of runtime.listeners) notify()
      return
    } finally {
      runtime.saving = false
    }
  }
  runtime.current = validateRecruitment(state)
  for (const notify of runtime.listeners) notify()
}
export const recruitmentFile = (id: string) => files.get(id)
export async function attachRecruitmentFile(
  state: RecruitmentState,
  candidateId: string,
  kind: RecruitmentDocument['kind'],
  file: File,
  id: string,
  at: string,
) {
  if (runtime.connected) {
    if (runtime.saving) throw new Error('Un enregistrement de recrutement est en cours.')
    runtime.saving = true
    try {
      const body = new FormData()
      body.set('file', file)
      body.set('candidateId', candidateId)
      body.set('kind', kind)
      body.set('revision', String(runtime.revision))
      const result = await workspaceRequest<{ state: RecruitmentState; revision: number }>(
        'documents',
        { method: 'POST', body },
      )
      runtime.current = validateRecruitment(result.state)
      runtime.revision = result.revision
      for (const notify of runtime.listeners) notify()
      return runtime.current
    } finally {
      runtime.saving = false
    }
  }
  if (!file.size || file.size > 5_000_000)
    throw new Error('Choisir un PDF, DOC ou DOCX de 5 Mo maximum.')
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer())
  const pdf =
    file.name.toLowerCase().endsWith('.pdf') &&
    String.fromCharCode(...bytes.slice(0, 5)) === '%PDF-'
  const docx = file.name.toLowerCase().endsWith('.docx') && bytes[0] === 0x50 && bytes[1] === 0x4b
  const doc =
    file.name.toLowerCase().endsWith('.doc') &&
    [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every((value, index) => bytes[index] === value)
  if (!pdf && !docx && !doc)
    throw new Error('Le contenu du fichier ne correspond pas à un PDF, DOC ou DOCX reconnu.')
  const next = validateRecruitment({
    ...state,
    documents: [
      ...state.documents,
      {
        id,
        candidateId,
        kind,
        name: file.name,
        mime: pdf
          ? 'application/pdf'
          : docx
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : 'application/msword',
        size: file.size,
        addedAt: at,
      },
    ],
  })
  files.set(id, file)
  urls.set(
    id,
    URL.createObjectURL(
      new Blob([file], { type: next.documents.find((document) => document.id === id)!.mime }),
    ),
  )
  return next
}
