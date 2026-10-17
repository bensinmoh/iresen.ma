'use client'
import { useEffect, useState, type FormEvent } from 'react'
import { CmsPreview } from './CmsPreview'
import { workspaceRequest } from '@/lib/cms-workspace/client'
import { configureConnectedContent } from '@/lib/cms-preview/store'
import { configureConnectedRecruitment } from '@/lib/cms-preview/recruitment-store'
import type { PageRegistry, Role, Workspace } from '@/lib/cms-preview/model'
import type { RecruitmentState } from '@/lib/cms-preview/recruitment'
type Actor = { id: number; name: string; role: Role; avatarUrl?: string }
export function ConnectedCms({ registry }: { registry: PageRegistry[] }) {
  const [actor, setActor] = useState<Actor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  async function loadSession() {
    const session = await workspaceRequest<{ actor: Actor }>('session')
    const [content, recruitment] = await Promise.all([
      workspaceRequest<{ workspace: Workspace; revision: number }>('content'),
      workspaceRequest<{ state: RecruitmentState; revision: number }>('recruitment'),
    ])
    configureConnectedContent(content.workspace, content.revision)
    configureConnectedRecruitment(recruitment.state, recruitment.revision)
    return session.actor
  }
  useEffect(() => {
    let active = true
    void loadSession()
      .then((user) => {
        if (active) {
          setError('')
          setActor(user)
        }
      })
      .catch((caught: unknown) => {
        if (active)
          setError(caught instanceof Error ? caught.message : 'Connexion au CMS impossible.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    const form = event.currentTarget
    const data = new FormData(form)
    try {
      await workspaceRequest('session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.get('email'), password: data.get('password') }),
      })
      form.reset()
      setActor(await loadSession())
      setError('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Connexion impossible.')
    } finally {
      setBusy(false)
    }
  }
  async function logout() {
    setBusy(true)
    try {
      await workspaceRequest('session', { method: 'DELETE' })
      window.location.reload()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Déconnexion impossible.')
    } finally {
      setBusy(false)
      setConfirmLogout(false)
    }
  }
  if (loading)
    return (
      <main className="cms-login">
        <section className="cms-panel">
          <h1>Gestion du site IRESEN</h1>
          <p role="status">Vérification de la session et chargement de PostgreSQL…</p>
        </section>
      </main>
    )
  if (!actor)
    return (
      <main className="cms-login">
        <section className="cms-panel">
          <h1>Connexion au CMS</h1>
          <p>
            Accès aux contenus et dossiers de recrutement de la base locale. Utilisez un compte
            administrateur ou éditeur existant.
          </p>
          {error && (
            <p role="alert" className="cms-error">
              {error}
            </p>
          )}
          <form onSubmit={login} className="cms-fields">
            <label>
              Courriel du compte
              <input name="email" type="email" required autoComplete="username" />
            </label>
            <label>
              Mot de passe
              <input name="password" type="password" required autoComplete="current-password" />
            </label>
            <button className="cms-button cms-primary" disabled={busy} type="submit">
              {busy ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <p className="cms-help">
            Les contenus et dossiers sont chargés depuis PostgreSQL après authentification.
          </p>
        </section>
      </main>
    )
  return (
    <>
      {error && (
        <p role="alert" className="cms-error">
          {error}
        </p>
      )}
      {confirmLogout && (
        <div role="alert" className="cms-connected-confirm">
          <p>Des modifications ne sont pas enregistrées.</p>
          <button className="cms-button" onClick={() => setConfirmLogout(false)}>
            Continuer la saisie
          </button>
          <button className="cms-button" onClick={() => void logout()}>
            Abandonner et se déconnecter
          </button>
        </div>
      )}
      <CmsPreview
        registry={registry}
        connected={actor}
        onDirty={setDirty}
        logoutBusy={busy}
        onLogout={() => (dirty ? setConfirmLogout(true) : void logout())}
      />
    </>
  )
}
