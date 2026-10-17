'use client'
export async function workspaceRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/admin/api/${path}`, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...options,
  })
  const result = await response.json().catch(() => ({ error: 'Réponse serveur illisible.' }))
  if (!response.ok)
    throw new Error(
      typeof result.error === 'string' ? result.error : 'La connexion au CMS a échoué.',
    )
  return result as T
}
