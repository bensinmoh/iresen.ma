'use client'
import {
  mediaTypes,
  mediaType,
  mediaDefaults,
  mediaMimes,
  type MediaType,
} from '@/lib/cms-preview/media-types'
import { MediaTypeChooser } from './MediaTypeChooser'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { Recruitment } from './Recruitment'
import { OrganigramOverview } from './OrganigramOverview'
import { AccountMenu } from './AccountMenu'
import { DeleteImpactSummary } from './DeleteImpactSummary'
import type { DeleteImpact } from '@/lib/cms-preview/delete-impact'
import { EntryActions } from './EntryActions'
import { Trash } from './Trash'
import { Analytics, displayField } from './Analytics'
import { BusinessField, DataStructure, SchemaTable } from './DataStructure'
import { connectionRecord, relationErrors } from '@/lib/cms-preview/connection'
import {
  grantedPatents,
  supportedProjects,
  publicModuleCount,
  filedPatentReferences,
} from '@/lib/cms-preview/indicators'
import { externalConnections } from '@/lib/cms-preview/integrations'
import { CmsIcon, type IconName } from './CmsIcon'
import {
  canEdit,
  editorialTextComplete,
  fieldValue,
  fieldApplies,
  canTransition,
  createEntry,
  languages,
  modules,
  parseCsv,
  roleLabels,
  safeCsvCell,
  saveEntry,
  statusLabels,
  utilityModules,
  validateEntry,
  type Entry,
  type Language,
  type PageRegistry,
  type Role,
  type Status,
} from '@/lib/cms-preview/model'
import {
  contentConnected,
  getServerSnapshot,
  getSnapshot,
  getStorageError,
  persist,
  subscribe,
  uploadConnectedMedia,
  performContentAction,
  getDeleteImpact,
  type ContentAction,
} from '@/lib/cms-preview/store'

function subscribeRoute(listener: () => void) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}
function subscribeMobile(listener: () => void) {
  const media = window.matchMedia('(max-width: 760px)')
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}
function routeSnapshot() {
  const raw = window.location.hash.slice(1)
  const hash = raw === 'people' ? 'organigram' : raw === 'programmes' ? 'calls' : raw
  return modules.some((m) => m.id === hash) || utilityModules.some((m) => m.id === hash)
    ? hash
    : 'dashboard'
}

const date = (value: string) =>
  new Intl.DateTimeFormat('fr-MA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Casablanca',
  }).format(new Date(value))
const id = () => crypto.randomUUID()
function download(name: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
function Badge({ status }: { status: Status }) {
  return <span className={`cms-badge cms-badge-${status}`}>{statusLabels[status]}</span>
}
function Empty({
  title,
  children,
  action,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="cms-empty">
      <CmsIcon name="document" />
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </div>
  )
}
function Dialog({
  title,
  children,
  close,
  wide = false,
}: {
  title: string
  children: ReactNode
  close: () => void
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = ref.current
    element?.showModal()
    return () => element?.close()
  }, [])
  return (
    <dialog
      ref={ref}
      className={`cms-dialog ${wide ? 'cms-dialog-wide' : ''}`}
      aria-label={title}
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="cms-dialog-heading">
        <h2>{title}</h2>
        <button aria-label="Fermer" className="cms-icon-button" onClick={close}>
          <CmsIcon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  )
}

export function CmsPreview({
  registry,
  connected,
  onDirty,
  onLogout,
  logoutBusy,
}: {
  registry: PageRegistry[]
  connected?: { id: number; name: string; role: Role; avatarUrl?: string }
  onDirty?: (dirty: boolean) => void
  onLogout?: () => void
  logoutBusy?: boolean
}) {
  const mobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia('(max-width: 760px)').matches,
    () => false,
  )
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const workspace = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const routedView = useSyncExternalStore(subscribeRoute, routeSnapshot, () => 'dashboard')
  const [selectedView, setView] = useState<string | null>(null)
  const view = selectedView ?? routedView
  const [sidebar, setSidebar] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const role = connected?.role ?? 'admin'
  const [query, setQuery] = useState('')
  const [globalQuery, setGlobalQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [localeFilter, setLocaleFilter] = useState<Language>('fr')
  const [mediaKind, setMediaKind] = useState<MediaType>('photos')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)
  const [selection, setSelection] = useState<string[]>([])
  const [draft, setDraft] = useState<Entry | null>(null)
  const [baseline, setBaseline] = useState('')
  const [language, setLanguage] = useState<Language>('fr')
  const [tab, setTab] = useState('content')
  const [errors, setErrors] = useState<string[]>([])
  const [entryAction, setEntryAction] = useState<{
    id: string
    title: string
    action: ContentAction
    language: Language
    note: string
  } | null>(null)
  const [deleteImpact, setDeleteImpact] = useState<DeleteImpact | null>(null)
  const [impactLoading, setImpactLoading] = useState(false)
  const [impactReload, setImpactReload] = useState(0)
  const [actionBusy, setActionBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const impactId = entryAction?.action === 'delete' ? entryAction.id : null
  useEffect(() => {
    let cancelled = false
    if (impactId) {
      getDeleteImpact(impactId)
        .then((impact) => {
          if (!cancelled) setDeleteImpact(impact)
        })
        .catch((error) => {
          if (!cancelled)
            setActionError(
              error instanceof Error ? error.message : 'Analyse des impacts impossible.',
            )
        })
        .finally(() => {
          if (!cancelled) setImpactLoading(false)
        })
    }
    return () => {
      cancelled = true
    }
  }, [impactId, impactReload])

  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState<'desktop' | 'mobile' | null>(null)
  const [confirmation, setConfirmation] = useState<{
    title: string
    body: string
    label: string
    action: () => void
  } | null>(null)
  const [recruitmentDirty, setRecruitmentDirty] = useState(false)
  const dirty = Boolean(draft && JSON.stringify(draft) !== baseline) || recruitmentDirty
  useEffect(() => {
    onDirty?.(dirty)
    return () => onDirty?.(false)
  }, [dirty, onDirty])
  const workspaceList = ['review-queue', 'translations', 'drafts'].includes(view)
  const baseModule = modules.find((module) => module.id === view)
  const selectedMediaKind = draft?.module === 'media' ? mediaType(draft) : mediaKind
  const currentModule =
    baseModule?.id === 'media'
      ? {
          ...baseModule,
          columns: [...mediaTypes.find((type) => type.id === selectedMediaKind)!.columns],
          fields: baseModule.fields.filter(
            (field) =>
              selectedMediaKind !== 'links' ||
              ['resourceKind', 'sourceUrl', 'usage', 'visibility', 'sourceRecord'].includes(
                field.key,
              ),
          ),
        }
      : baseModule
  const title =
    currentModule?.label ??
    utilityModules.find((module) => module.id === view)?.label ??
    (
      {
        'review-queue': 'Révisions en attente',
        translations: 'Langues à compléter',
        drafts: 'Brouillons locaux',
      } as Record<string, string>
    )[view] ??
    'Tableau de bord'
  const availableModules = modules.filter((module) => module.id !== 'users' || role === 'admin')

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  useEffect(() => {
    if (!filePreview) return
    return () => URL.revokeObjectURL(filePreview)
  }, [filePreview])
  useEffect(() => {
    if (!sidebar || !mobile) return
    const panel = document.getElementById('cms-sidebar')!
    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>('button, a[href], select, input')).filter(
        (element) => element.getClientRects().length && !element.hasAttribute('disabled'),
      )
    focusables()[0]?.focus()
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebar(false)
        event.preventDefault()
      }
      if (event.key === 'Tab') {
        const items = focusables()
        const first = items[0]
        const last = items.at(-1)
        if (event.shiftKey && document.activeElement === first) {
          last?.focus()
          event.preventDefault()
        } else if (!event.shiftKey && document.activeElement === last) {
          first?.focus()
          event.preventDefault()
        }
      }
    }
    panel.addEventListener('keydown', keyboard)
    return () => {
      panel.removeEventListener('keydown', keyboard)
      document.getElementById('cms-mobile-toggle')?.focus()
    }
  }, [sidebar, mobile])

  function protect(action: () => void) {
    if (dirty)
      setConfirmation({
        title: 'Conserver vos modifications ?',
        body: 'Cette révision contient des modifications non enregistrées. Vous pouvez revenir à l’éditeur ou les abandonner.',
        label: 'Abandonner les modifications',
        action,
      })
    else action()
  }
  function navigate(target: string, filteredStatus = 'all') {
    protect(() => {
      setView(target)
      window.history.replaceState(null, '', `#${target}`)
      setDraft(null)
      setSidebar(false)
      setStatus(filteredStatus)
      setQuery('')
      setGlobalQuery('')
      setSelection([])
      setPage(1)
      setErrors([])
      setMessage('')
      requestAnimationFrame(() => document.getElementById('cms-heading')?.focus())
    })
  }
  function open(entry: Entry) {
    protect(() => {
      if (entry.module !== view) {
        setQuery('')
        setStatus('all')
        setPage(1)
        setSelection([])
      }
      setFilePreview(null)
      setDraft(structuredClone(entry))
      setBaseline(JSON.stringify(entry))
      setView(entry.module)
      setLanguage(
        ['review-queue', 'dashboard'].includes(view)
          ? (languages.find((lang) => entry.variants[lang].status === 'review') ?? localeFilter)
          : localeFilter,
      )
      setTab('content')
      setErrors([])
      setMessage('')
      setSidebar(false)
      window.scrollTo({ top: 0 })
      requestAnimationFrame(() => document.getElementById('cms-heading')?.focus())
    })
  }
  function create(module: string) {
    const entry = createEntry(module, id(), new Date().toISOString())
    if (module === 'media') entry.shared = { ...entry.shared, ...mediaDefaults(mediaKind) }
    open(entry)
  }
  function updateVariant(key: 'title' | 'body' | 'seoTitle' | 'seoDescription', value: string) {
    if (draft)
      setDraft({
        ...draft,
        variants: { ...draft.variants, [language]: { ...draft.variants[language], [key]: value } },
      })
  }
  async function save(nextStatus?: Status) {
    if (!draft) return
    try {
      const relations = relationErrors(draft, workspace.entries)
      if (relations.length) throw new Error(relations.join(' '))
      const next = saveEntry(workspace, draft, language, role, new Date().toISOString(), nextStatus)
      const committed = await persist(next, Boolean(connected))
      const saved = committed.entries.find((entry) => entry.id === draft.id)!
      setDraft(structuredClone(saved))
      setBaseline(JSON.stringify(saved))
      setErrors([])
      setMessage(
        nextStatus
          ? `${statusLabels[nextStatus]} en ${language.toUpperCase()} ${connected ? 'enregistré en base.' : 'dans cet atelier uniquement.'}`
          : connected
            ? 'Brouillon enregistré dans PostgreSQL.'
            : 'Brouillon enregistré dans ce navigateur.',
      )
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Vérifiez les champs.'])
    }
  }
  function requestEntryAction(entry: Entry, action: ContentAction, locale: Language) {
    protect(() => {
      setActionError('')
      setDeleteImpact(null)
      setImpactLoading(action === 'delete')
      setEntryAction({
        id: entry.id,
        title: entry.variants[locale].title || entry.reference,
        action,
        language: locale,
        note: '',
      })
    })
  }
  function transition(target: Status) {
    if (!draft) return
    const validation = target === 'draft' ? [] : validateEntry(draft, language, true)
    if (validation.length) {
      setErrors(validation)
      return
    }
    if (target === 'published')
      setConfirmation({
        title: connected
          ? 'Valider cette révision en base ?'
          : 'Valider et simuler la publication ?',
        body: `${draft.variants[language].title} · ${language.toUpperCase()}. ${connected ? 'La publication de la source conserve ses règles de visibilité et de validation de langue.' : 'Cette action est locale et n’affecte aucune page du site.'}`,
        label: connected ? 'Valider / publier en base' : 'Valider / publier dans l’atelier',
        action: () => save(target),
      })
    else save(target)
  }
  function archiveSelection() {
    const selected = workspace.entries.filter((entry) => selection.includes(entry.id))
    setConfirmation({
      title: `Retirer ${selected.length} élément(s) en brouillon ?`,
      body: `La variante ${localeFilter.toUpperCase()} de chaque élément sélectionné sera remise en brouillon et son instantané validé sera retiré dans cet atelier. Les autres langues restent inchangées.`,
      label: 'Retirer de la publication locale',
      action: async () => {
        let next = workspace
        for (const entry of selected) {
          const revision = structuredClone(entry)
          revision.comment = 'Retrait groupé par l’administrateur.'
          next = saveEntry(next, revision, localeFilter, role, new Date().toISOString(), 'draft')
          delete next.entries.find((item) => item.id === entry.id)!.publicVariants[localeFilter]
        }
        await persist(next, Boolean(connected))
        setSelection([])
        setMessage(`${selected.length} élément(s) retirés localement.`)
      },
    })
  }
  const accessibleEntries = workspace.entries.filter((entry) =>
    availableModules.some((m) => m.id === entry.module),
  )
  const inModule = accessibleEntries.filter((entry) =>
    workspaceList
      ? view === 'review-queue'
        ? languages.some((lang) => entry.variants[lang].status === 'review')
        : view === 'translations'
          ? !entry.variants.en.title || !entry.variants.ar.title
          : entry.variants.fr.status === 'draft'
      : entry.module === view && (view !== 'media' || mediaType(entry) === mediaKind),
  )
  const filtered = inModule
    .filter((entry) => {
      const variant = entry.variants[localeFilter]
      return (
        (status === 'all' || variant.status === status) &&
        `${variant.title} ${variant.body} ${entry.reference} ${Object.values(entry.shared).join(' ')}`
          .toLocaleLowerCase('fr')
          .includes(query.toLocaleLowerCase('fr'))
      )
    })
    .sort((a, b) => {
      if (view === 'news') {
        const highlightOrder =
          Number(b.shared.highlight === 'true') - Number(a.shared.highlight === 'true')
        if (highlightOrder) return highlightOrder
      }
      return sort === 'title'
        ? a.variants[localeFilter].title.localeCompare(b.variants[localeFilter].title, 'fr')
        : b.updatedAt.localeCompare(a.updatedAt)
    })
  const totalPages = Math.max(1, Math.ceil(filtered.length / 8))
  const visible = filtered.slice(
    (Math.min(page, totalPages) - 1) * 8,
    Math.min(page, totalPages) * 8,
  )
  const globalResults = globalQuery.trim()
    ? workspace.entries.filter(
        (entry) =>
          availableModules.some((m) => m.id === entry.module) &&
          languages.some((lang) =>
            `${entry.variants[lang].title} ${entry.reference}`
              .toLowerCase()
              .includes(globalQuery.toLowerCase()),
          ),
      )
    : []
  const pending = accessibleEntries.filter((entry) =>
    languages.some((lang) => entry.variants[lang].status === 'review'),
  )
  const missing = accessibleEntries.filter(
    (entry) => !entry.variants.en.title || !entry.variants.ar.title,
  )
  const draftCount = accessibleEntries.filter(
    (entry) => entry.variants.fr.status === 'draft',
  ).length

  return (
    <div className={`cms-app ${collapsed ? 'cms-collapsed' : ''}`}>
      <a className="cms-skip" href="#cms-main">
        Aller au contenu
      </a>
      {sidebar && (
        <button
          className="cms-backdrop"
          aria-label="Fermer la navigation"
          onClick={() => setSidebar(false)}
        />
      )}
      <aside
        id="cms-sidebar"
        inert={mobile && !sidebar}
        className={`cms-sidebar ${sidebar ? 'cms-sidebar-open' : ''}`}
        aria-label="Navigation de l’administration"
      >
        <div className="cms-brand">
          <Image src="/brand/logo-white.svg" alt="IRESEN" width={132} height={42} />
          <button
            className="cms-icon-button cms-collapse-button"
            aria-label={collapsed ? 'Déployer la navigation' : 'Replier la navigation'}
            onClick={() => setCollapsed(!collapsed)}
          >
            <CmsIcon name="menu" />
          </button>
          <button
            className="cms-icon-button cms-mobile-close"
            aria-label="Fermer la navigation"
            onClick={() => setSidebar(false)}
          >
            <CmsIcon name="close" />
          </button>
        </div>
        <div className="cms-workspace-name">
          <span>Atelier de contenu</span>
          <small>Version de validation</small>
        </div>
        <nav>
          <button
            className={`cms-nav-item ${view === 'dashboard' ? 'active' : ''}`}
            aria-current={view === 'dashboard' ? 'page' : undefined}
            title="Tableau de bord"
            onClick={() => navigate('dashboard')}
          >
            <CmsIcon name="dashboard" />
            <span>Tableau de bord</span>
          </button>
          {[...new Set([...availableModules.map((m) => m.group), 'Administration'])].map(
            (group) => (
              <div className="cms-nav-group" key={group}>
                <p>{group}</p>
                {availableModules
                  .filter((m) => m.group === group)
                  .map((module) => {
                    const records = accessibleEntries.filter((entry) => entry.module === module.id)
                    const attention = records.filter((entry) =>
                      languages.some(
                        (locale) =>
                          entry.variants[locale].status === 'review' ||
                          !editorialTextComplete(entry, locale),
                      ),
                    ).length
                    return (
                      <button
                        key={module.id}
                        title={module.label}
                        className={`cms-nav-item ${view === module.id ? 'active' : ''}`}
                        aria-current={view === module.id ? 'page' : undefined}
                        onClick={() => navigate(module.id)}
                      >
                        <CmsIcon name={module.icon} />
                        <span>{module.label}</span>
                        {connected && module.id !== 'users' && (
                          <em
                            className="cms-nav-total"
                            title={`${records.length} fiche(s) au total`}
                          >
                            {records.length}
                          </em>
                        )}
                        {attention > 0 && (
                          <b
                            className="cms-nav-attention"
                            aria-label={`${attention} fiche(s) en revue ou à compléter`}
                            title="En revue ou à compléter"
                          >
                            {attention}
                          </b>
                        )}
                      </button>
                    )
                  })}
                {group === 'Administration' &&
                  utilityModules
                    .filter((module) => module.id !== 'trash' || role === 'admin')
                    .map((module) => (
                      <button
                        key={module.id}
                        title={module.label}
                        className={`cms-nav-item ${view === module.id ? 'active' : ''}`}
                        aria-current={view === module.id ? 'page' : undefined}
                        onClick={() => navigate(module.id)}
                      >
                        <CmsIcon name={module.icon} />
                        <span>{module.label}</span>
                      </button>
                    ))}
              </div>
            ),
          )}
        </nav>
        <Link href="/fr" prefetch={false} className="cms-site-link">
          <CmsIcon name="globe" />
          <span>Voir le site</span>
          <CmsIcon name="arrow" />
        </Link>
      </aside>
      <div className="cms-shell" inert={mobile && sidebar}>
        <header className="cms-topbar">
          <button
            id="cms-mobile-toggle"
            className="cms-icon-button cms-mobile-menu"
            aria-label="Ouvrir la navigation"
            aria-expanded={sidebar}
            onClick={() => setSidebar(true)}
          >
            <CmsIcon name="menu" />
          </button>
          <div className="cms-global-search">
            <CmsIcon name="search" />
            <label className="cms-sr-only" htmlFor="global-search">
              Rechercher dans l’atelier
            </label>
            <input
              id="global-search"
              type="search"
              placeholder="Rechercher un contenu, une ressource…"
              value={globalQuery}
              onChange={(e) => setGlobalQuery(e.target.value)}
            />
          </div>
          <AccountMenu
            name={connected?.name ?? 'Compte'}
            avatarUrl={connected?.avatarUrl}
            role={role}
            busy={logoutBusy}
            onLogout={onLogout}
          />
        </header>
        <div className="cms-demo-band">
          <span className="cms-demo-dot" aria-hidden="true" />
          <strong>{connected ? 'CMS connecté' : 'Mode démonstration'}</strong>
          <span>
            {connected
              ? 'Enregistrements PostgreSQL · session authentifiée · CV privés'
              : 'Modifications locales · aucune connexion au site ou aux bases de données'}
          </span>
        </div>
        <main id="cms-main" className="cms-main">
          <div className="cms-page-heading">
            <div>
              {draft && (
                <button
                  className="cms-text-button"
                  onClick={() =>
                    protect(() => {
                      setDraft(null)
                      setErrors([])
                      setMessage('')
                      requestAnimationFrame(() => document.getElementById('cms-heading')?.focus())
                    })
                  }
                >
                  <CmsIcon name="back" />
                  Retour à {title.toLowerCase()}
                </button>
              )}
              <h1 id="cms-heading" tabIndex={-1} lang={draft ? language : 'fr'} dir="auto">
                {draft
                  ? draft.variants[language].title || 'Nouveau brouillon'
                  : globalQuery
                    ? 'Recherche dans l’atelier'
                    : title}
              </h1>
              <p>
                {draft
                  ? connected
                    ? 'Révision enregistrée dans PostgreSQL après sauvegarde'
                    : 'Révision locale · le site conserve son contenu actuel'
                  : connected && currentModule
                    ? currentModule.id === 'users'
                      ? 'Gérer les comptes réels et leurs droits.'
                      : `${workspace.entries.filter((entry) => entry.module === currentModule.id).length} fiches enregistrées dans PostgreSQL · formulaires, langues et historique.`
                    : (currentModule?.description ??
                      (view === 'dashboard'
                        ? 'Votre espace pour préparer, relire et organiser les contenus.'
                        : 'Contenus PostgreSQL, journal et état des services.'))}
              </p>
            </div>
            {!draft &&
              currentModule &&
              !currentModule.fixed &&
              !(connected && view === 'users') &&
              view !== 'careers' &&
              canEdit(role, view) && (
                <button className="cms-button cms-primary" onClick={() => create(view)}>
                  <CmsIcon name="plus" />
                  Ajouter
                </button>
              )}
          </div>
          <div role="status" className={message ? 'cms-feedback' : 'cms-sr-only'}>
            {message}
          </div>
          {getStorageError() && (
            <p role="alert" className="cms-error">
              {getStorageError()}
            </p>
          )}
          {errors.length > 0 && (
            <div role="alert" className="cms-error">
              <strong>La révision n’a pas été enregistrée.</strong>
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {globalQuery ? (
            <section className="cms-panel">
              <h2>{globalResults.length} résultat(s)</h2>
              {globalResults.length ? (
                globalResults.map((entry) => (
                  <button
                    className="cms-result-row"
                    key={entry.id}
                    onClick={() => {
                      setGlobalQuery('')
                      open(entry)
                    }}
                  >
                    <CmsIcon name="document" />
                    <span>
                      <strong>
                        {languages.map((lang) => entry.variants[lang].title).find(Boolean)}
                      </strong>
                      <small>{modules.find((m) => m.id === entry.module)?.label}</small>
                    </span>
                    <CmsIcon name="arrow" />
                  </button>
                ))
              ) : (
                <Empty title="Aucun contenu trouvé">
                  Essayez un titre ou un identifiant présent dans cette session locale.
                </Empty>
              )}
            </section>
          ) : draft ? (
            <div className="cms-editor-layout">
              <section className="cms-panel cms-editor">
                <div className="cms-editor-bar">
                  <div className="cms-language-tabs" aria-label="Langue du contenu">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        aria-pressed={language === lang}
                        onClick={() => {
                          setLanguage(lang)
                          setErrors([])
                        }}
                      >
                        {lang.toUpperCase()}
                        <span
                          className={`cms-language-dot ${draft.variants[lang].title ? 'filled' : ''}`}
                          aria-label={
                            draft.variants[lang].title ? 'Texte présent' : 'Texte manquant'
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <Badge status={draft.variants[language].status} />
                </div>
                <p className="cms-help">
                  Interface : français · contenu : {language.toUpperCase()}. Chaque langue suit sa
                  propre validation.
                </p>
                <div className="cms-tabs" aria-label="Panneau de l’éditeur">
                  {[
                    ['content', 'Contenu'],
                    ['seo', 'Recherche & SEO'],
                    ['history', 'Historique'],
                    ['schema', 'Structure & types'],
                  ].map(([value, label]) => (
                    <button key={value} aria-pressed={tab === value} onClick={() => setTab(value)}>
                      {label}
                    </button>
                  ))}
                </div>
                {tab === 'schema' && currentModule && (
                  <SchemaTable module={currentModule} entry={draft} />
                )}
                {tab === 'content' && (
                  <fieldset
                    disabled={!canEdit(role, view) || draft.variants[language].status === 'review'}
                    className="cms-fields"
                  >
                    {view === 'pages' && (
                      <p className="cms-context">
                        Page et section existantes :{' '}
                        {registry.find((p) => p.id === draft.shared.pageId)?.title} /{' '}
                        {
                          registry
                            .find((p) => p.id === draft.shared.pageId)
                            ?.sections.find((s) => s.id === draft.shared.sectionId)?.title
                        }
                        . Les champs sont un brouillon de structure éditable à valider.
                      </p>
                    )}
                    <label>
                      {view === 'faq' ? 'Question' : 'Titre'}{' '}
                      <span className="cms-required">requis</span>
                      <input
                        lang={language}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        value={draft.variants[language].title}
                        onChange={(e) => updateVariant('title', e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      {view === 'faq'
                        ? 'Réponse'
                        : view === 'projects'
                          ? 'Description du projet'
                          : (view === 'organigram' && draft.shared.recordType === 'person') ||
                              view === 'scientific-council'
                            ? 'Biographie'
                            : view === 'news'
                              ? 'Corps de l’actualité'
                              : view === 'publications'
                                ? 'Résumé bibliographique (facultatif)'
                                : 'Texte / présentation'}
                      <textarea
                        lang={language}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        rows={8}
                        value={draft.variants[language].body}
                        onChange={(e) => updateVariant('body', e.target.value)}
                      />
                      <small>
                        Le texte est enregistré en base ; les champs métier ci-dessous conservent la
                        structure de la rubrique.
                      </small>
                    </label>
                    {(currentModule?.fields ?? []).length > 0 && (
                      <div className="cms-section-divider">
                        <h2>Champs métier · {currentModule?.label}</h2>
                        {connected && draft.shared._sourceDataset && (
                          <p className="cms-context">
                            Source reprise en base : <code>{draft.shared._sourceDataset}</code>. Les
                            modifications de cette fiche sont conservées dans PostgreSQL ; la source
                            originale reste consultable ci-dessous.
                          </p>
                        )}
                        {draft.shared.sourceImagePath?.startsWith('/') && (
                          <Image
                            src={draft.shared.sourceImagePath}
                            alt=""
                            width={160}
                            height={110}
                            unoptimized
                            className="cms-record-image"
                          />
                        )}
                        <p>
                          Une modification partagée remet les langues en brouillon ; leurs versions
                          publiées locales sont conservées.
                        </p>
                      </div>
                    )}
                    <div className="cms-field-grid">
                      {currentModule?.fields
                        .filter(
                          (field) =>
                            fieldApplies(draft, field) &&
                            (!field.readOnly || fieldValue(draft, field, language)),
                        )
                        .filter(
                          (field) =>
                            view !== 'pages' || !['pageId', 'sectionId'].includes(field.key),
                        )
                        .map((field) => (
                          <BusinessField
                            key={field.key}
                            field={field}
                            entry={draft}
                            language={language}
                            entries={workspace.entries}
                            change={(value) =>
                              setDraft((current) =>
                                !current || current.id !== draft.id
                                  ? current
                                  : field.key === 'reference'
                                    ? { ...current, reference: value }
                                    : field.localized
                                      ? {
                                          ...current,
                                          variants: {
                                            ...current.variants,
                                            [language]: {
                                              ...current.variants[language],
                                              fields: {
                                                ...current.variants[language].fields,
                                                [field.key]: value,
                                              },
                                            },
                                          },
                                        }
                                      : {
                                          ...current,
                                          shared: { ...current.shared, [field.key]: value },
                                        },
                              )
                            }
                          />
                        ))}
                    </div>
                    {view === 'media' && selectedMediaKind !== 'links' && (
                      <label>
                        Choisir un fichier local
                        <input
                          type="file"
                          accept={mediaMimes(selectedMediaKind).join(',')}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            if (file.size > 10 * 1024 * 1024) {
                              setErrors(['Choisir un fichier de moins de 10 Mo.'])
                              return
                            }
                            if (!mediaMimes(selectedMediaKind).includes(file.type)) {
                              setErrors([
                                'Choisir un fichier correspondant au type de ressource sélectionné.',
                              ])
                              return
                            }
                            if (connected) {
                              try {
                                const entry = await uploadConnectedMedia(
                                  file,
                                  draft.variants.fr.title,
                                )
                                setDraft({
                                  ...entry,
                                  shared: { ...entry.shared, ...mediaDefaults(selectedMediaKind) },
                                })
                                setBaseline(JSON.stringify(entry))
                                setMessage(
                                  'Nouveau média privé téléversé et enregistré en base. Compléter ses métadonnées avant toute publication.',
                                )
                              } catch (error) {
                                setErrors([
                                  error instanceof Error
                                    ? error.message
                                    : 'Téléversement impossible.',
                                ])
                              }
                              return
                            }
                            setFilePreview(
                              file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                            )
                            setDraft({
                              ...draft,
                              shared: {
                                ...draft.shared,
                                fileName: file.name,
                                sizeBytes: String(file.size),
                                mimeType: file.type,
                              },
                            })
                            setMessage(
                              'Métadonnées du fichier ajoutées au brouillon. Aucun fichier envoyé ou servi.',
                            )
                          }}
                        />
                        {filePreview && (
                          <Image
                            src={filePreview}
                            alt="Aperçu local du fichier choisi"
                            width={500}
                            height={300}
                            unoptimized
                            className="cms-file-preview"
                          />
                        )}
                        <small>
                          Seuls le nom, le type déclaré et la taille sont conservés. Aucun
                          téléversement.
                        </small>
                      </label>
                    )}
                  </fieldset>
                )}
                {tab === 'seo' && (
                  <fieldset
                    disabled={!canEdit(role, view) || draft.variants[language].status === 'review'}
                    className="cms-fields"
                  >
                    <label>
                      Titre de recherche / SEO
                      <input
                        lang={language}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        value={draft.variants[language].seoTitle}
                        onChange={(e) => updateVariant('seoTitle', e.target.value)}
                      />
                    </label>
                    <label>
                      Description de recherche
                      <textarea
                        lang={language}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        rows={4}
                        value={draft.variants[language].seoDescription}
                        onChange={(e) => updateVariant('seoDescription', e.target.value)}
                      />
                    </label>
                    <div
                      className="cms-search-preview"
                      lang={language}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <strong>
                        {draft.variants[language].seoTitle ||
                          draft.variants[language].title ||
                          'Titre de votre ressource'}
                      </strong>
                      <p>
                        {draft.variants[language].seoDescription ||
                          'Ajouter une description utile et les acronymes développés.'}
                      </p>
                    </div>
                    <p className="cms-help">
                      {connected
                        ? 'Les collections publiques existantes conservent leurs règles d’indexation et de publication. Les nouveaux modules sont enregistrés en base ; leur projection sur le site reste à développer.'
                        : 'Aucun index public n’est mis à jour. Les URL, canonical et langues publiées seront calculés à la connexion.'}
                    </p>
                  </fieldset>
                )}
                {tab === 'history' && (
                  <div className="cms-history">
                    {draft.history.length ? (
                      draft.history.map((revision) => (
                        <div key={revision.id}>
                          <div>
                            <strong>{revision.variant.title}</strong>
                            <small>
                              {date(revision.at)} · {revision.language.toUpperCase()} ·{' '}
                              {statusLabels[revision.variant.status]}
                            </small>
                            {revision.note && <p>{revision.note}</p>}
                          </div>
                          <button
                            className="cms-button"
                            disabled={
                              !canEdit(role, view) ||
                              draft.variants[revision.language].status === 'review'
                            }
                            onClick={() => {
                              setDraft({
                                ...draft,
                                shared: structuredClone(revision.shared ?? draft.shared),
                                variants: {
                                  ...draft.variants,
                                  [revision.language]: { ...revision.variant, status: 'draft' },
                                },
                              })
                              setLanguage(revision.language)
                              setTab('content')
                              setMessage(
                                'Révision restaurée dans l’éditeur. Enregistrez ce nouveau brouillon.',
                              )
                            }}
                          >
                            Restaurer
                          </button>
                        </div>
                      ))
                    ) : (
                      <Empty title="Aucune révision enregistrée">
                        L’historique apparaîtra après votre premier enregistrement local.
                      </Empty>
                    )}
                  </div>
                )}
              </section>
              <aside className="cms-editor-aside">
                <section className="cms-panel">
                  <h2>Circuit de publication</h2>
                  {connected && (
                    <label className="cms-workflow-visibility">
                      Visibilité du contenu
                      <select
                        disabled={role !== 'admin'}
                        value={draft.shared.visibility ?? 'private'}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            shared: { ...draft.shared, visibility: event.target.value },
                          })
                        }
                      >
                        <option value="private">Privé · gestion interne</option>
                        <option value="public">Public · après validation</option>
                      </select>
                      <small className="cms-help">
                        Le serveur applique les droits et la validation de chaque langue. La
                        visibilité seule ne publie rien.
                      </small>
                    </label>
                  )}
                  <p className="cms-help">
                    L’éditeur rédige et soumet. L’administrateur valide / publie, ou décline avec un
                    motif. Une modification validée repart en brouillon.
                  </p>
                  <ol className="cms-workflow">
                    {(['draft', 'review', 'published'] as Status[]).map((step, index) => (
                      <li
                        className={draft.variants[language].status === step ? 'current' : ''}
                        key={step}
                      >
                        <span>{index + 1}</span>
                        {statusLabels[step]}
                      </li>
                    ))}
                  </ol>
                  <p className="cms-help">
                    {dirty
                      ? 'Modifications non enregistrées'
                      : connected
                        ? 'Révision enregistrée en base'
                        : 'Révision locale à jour'}
                    {draft.publicVariants[language] &&
                      ' · La version validée reste distincte du brouillon.'}
                  </p>
                  <div className="cms-stacked-actions">
                    {workspace.entries.some((entry) => entry.id === draft.id) && (
                      <EntryActions
                        entry={workspace.entries.find((entry) => entry.id === draft.id)!}
                        language={language}
                        role={role}
                        action={requestEntryAction}
                      />
                    )}
                    <button
                      className="cms-button cms-primary"
                      disabled={
                        !canEdit(role, view) || draft.variants[language].status === 'review'
                      }
                      onClick={() => save()}
                    >
                      Enregistrer le brouillon
                    </button>
                    <button
                      className="cms-button"
                      onClick={() =>
                        download(
                          'revision-atelier.json',
                          JSON.stringify(connectionRecord(draft), null, 2),
                          'application/json',
                        )
                      }
                    >
                      Exporter cette révision
                    </button>
                    <button className="cms-button" onClick={() => setPreview('desktop')}>
                      Prévisualiser
                    </button>
                    {(['review', 'published', 'draft'] as Status[])
                      .filter(
                        (target) =>
                          target === 'published' &&
                          target !== draft.variants[language].status &&
                          canTransition(role, draft.variants[language].status, target),
                      )
                      .map((target) => (
                        <button
                          className="cms-button"
                          key={target}
                          onClick={() => transition(target)}
                        >
                          {target === 'review'
                            ? 'Soumettre à validation'
                            : target === 'published'
                              ? 'Valider / publier'
                              : draft.variants[language].status === 'review'
                                ? 'Décliner · retour en brouillon'
                                : 'Préparer une nouvelle révision'}
                        </button>
                      ))}
                  </div>
                  <p className="cms-help">
                    {connected
                      ? `Droits du compte ${roleLabels[role].toLowerCase()}, contrôlés côté serveur.`
                      : `Droits simulés pour le profil ${roleLabels[role].toLowerCase()}. Ils ne constituent pas une authentification.`}
                  </p>
                </section>
                <section className="cms-panel">
                  <h2>Note interne</h2>
                  <label className="cms-sr-only" htmlFor="internal-note">
                    Note interne
                  </label>
                  <textarea
                    id="internal-note"
                    rows={4}
                    disabled={
                      !canEdit(role, view) ||
                      (role === 'editor' && draft.variants[language].status === 'review')
                    }
                    value={draft.comment}
                    onChange={(e) => setDraft({ ...draft, comment: e.target.value })}
                    placeholder="Motif de correction ou point à vérifier…"
                  />
                  <p className="cms-help">
                    Conservée avec la prochaine révision ; hors des aperçus.
                  </p>
                  <dl className="cms-meta">
                    <dt>Identifiant local</dt>
                    <dd>{draft.reference}</dd>
                    <dt>Dernière modification</dt>
                    <dd>{date(draft.updatedAt)}</dd>
                  </dl>
                </section>
              </aside>
            </div>
          ) : view === 'users' && connected ? (
            <section className="cms-panel">
              <h2>Comptes et droits</h2>
              <p>
                Les comptes réels sont gérés dans l’administration authentifiée. Les deux rôles
                disponibles sont administrateur et éditeur.
              </p>
              <Link className="cms-button" href="/admin/collections/users" prefetch={false}>
                Gérer les comptes
              </Link>
            </section>
          ) : view === 'trash' ? (
            <Trash
              role={role}
              version={workspace}
              restore={(id, title) => {
                setActionError('')
                setEntryAction({ id, title, action: 'restore', language: 'fr', note: '' })
              }}
            />
          ) : view === 'careers' ? (
            <Recruitment
              key={role}
              offers={workspace.entries.filter((entry) => entry.module === 'careers')}
              role={role}
              openOffer={open}
              offerActions={(entry) => (
                <EntryActions
                  entry={entry}
                  language="fr"
                  role={role}
                  open={open}
                  compact
                  action={requestEntryAction}
                />
              )}
              createOffer={() => create('careers')}
              onDirty={setRecruitmentDirty}
            />
          ) : view === 'data-model' ? (
            <DataStructure />
          ) : view === 'analytics' ? (
            <Analytics
              workspace={{ ...workspace, entries: accessibleEntries }}
              navigate={navigate}
            />
          ) : view === 'dashboard' ? (
            <>
              <Analytics
                workspace={{ ...workspace, entries: accessibleEntries }}
                compact
                navigate={navigate}
              />
              <div className={`cms-summary${draftCount === 0 ? ' cms-summary-three' : ''}`}>
                {[
                  {
                    title: 'En attente de revue',
                    count: pending.length,
                    icon: 'check',
                    action: () => navigate('review-queue'),
                    help: 'Revoir les contenus',
                  },
                  {
                    title: 'Langues à compléter',
                    count: missing.length,
                    icon: 'globe',
                    action: () => navigate('translations'),
                    help: 'Compléter les traductions',
                  },
                  {
                    title: connected ? 'Brouillons' : 'Brouillons locaux',
                    count: draftCount,
                    hidden: draftCount === 0,
                    icon: 'document',
                    action: () => navigate('drafts'),
                    help: 'Continuer la rédaction',
                  },
                  {
                    title: 'Services à connecter',
                    count: externalConnections.length,
                    icon: 'link',
                    action: () => navigate('integrations'),
                    help: 'Voir les dépendances',
                  },
                ]
                  .filter((item) => !item.hidden)
                  .map((item) => (
                    <button className="cms-summary-item" key={item.title} onClick={item.action}>
                      <div>
                        <span>{item.title}</span>
                        <CmsIcon name={item.icon as IconName} />
                      </div>
                      <strong>{item.count}</strong>
                      <small>
                        {item.help}
                        <CmsIcon name="arrow" />
                      </small>
                    </button>
                  ))}
              </div>
              <div className="cms-dashboard-grid">
                <section className="cms-panel">
                  <div className="cms-panel-heading">
                    <h2>À traiter</h2>
                    <span>{pending.length} révisions</span>
                  </div>
                  {pending.slice(0, 8).map((entry) => (
                    <button className="cms-task" key={entry.id} onClick={() => open(entry)}>
                      <span className="cms-task-icon">
                        <CmsIcon
                          name={modules.find((m) => m.id === entry.module)?.icon ?? 'document'}
                        />
                      </span>
                      <span>
                        <strong>{entry.variants.fr.title}</strong>
                        <small>
                          {modules.find((m) => m.id === entry.module)?.label} · Relecture éditoriale
                        </small>
                      </span>
                      <Badge status="review" />
                      <CmsIcon name="chevron" />
                    </button>
                  ))}
                  {!pending.length && (
                    <Empty title="Aucune revue en attente">
                      Les prochaines soumissions apparaîtront ici.
                    </Empty>
                  )}
                  <div className="cms-panel-footer">
                    {connected
                      ? 'Les compteurs décrivent les fiches enregistrées dans PostgreSQL.'
                      : 'Les compteurs décrivent uniquement les exemples de cet atelier.'}
                  </div>
                </section>
                <section className="cms-panel">
                  <h2>Deux rôles, trois étapes</h2>
                  <ol className="cms-workflow">
                    <li>
                      <span>1</span>Brouillon · rédaction par l’éditeur
                    </li>
                    <li>
                      <span>2</span>En revue · décision de l’administrateur
                    </li>
                    <li>
                      <span>3</span>Validé / publié · instantané local conservé
                    </li>
                  </ol>
                  <p>
                    Un refus motivé renvoie en brouillon. Les décisions sont propres à chaque langue
                    et figurent dans l’historique.
                  </p>
                  <button className="cms-button" onClick={() => navigate('review-queue')}>
                    Ouvrir la file de revue
                  </button>
                </section>
              </div>
              <section className="cms-panel">
                <div className="cms-panel-heading">
                  <h2>Derniers contenus de l’atelier</h2>
                  <button className="cms-text-button" onClick={() => navigate('news')}>
                    Toutes les actualités
                    <CmsIcon name="arrow" />
                  </button>
                </div>
                <div className="cms-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Contenu</th>
                        <th>Module</th>
                        <th>État FR</th>
                        <th>Langues</th>
                        <th>Modification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...accessibleEntries]
                        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                        .slice(0, 5)
                        .map((entry) => (
                          <tr key={entry.id}>
                            <td>
                              <button className="cms-title-button" onClick={() => open(entry)}>
                                {entry.variants.fr.title}
                              </button>
                            </td>
                            <td>{modules.find((m) => m.id === entry.module)?.label}</td>
                            <td>
                              <Badge status={entry.variants.fr.status} />
                            </td>
                            <td>
                              <Languages entry={entry} />
                            </td>
                            <td>{date(entry.updatedAt)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          ) : view === 'pages' ? (
            <PageChooser
              registry={registry}
              entries={workspace.entries}
              open={open}
              create={(page, section) => {
                const entry = createEntry(
                  'pages',
                  `${page.id}--${section.id}`,
                  new Date().toISOString(),
                )
                entry.shared = { pageId: page.id, sectionId: section.id }
                entry.variants.fr.title = section.title
                open(entry)
              }}
            />
          ) : view === 'figures' ? (
            <Figures
              role={role}
              entries={workspace.entries}
              open={open}
              actions={(entry) => (
                <EntryActions
                  entry={entry}
                  language="fr"
                  role={role}
                  open={open}
                  compact
                  action={requestEntryAction}
                />
              )}
            />
          ) : view === 'integrations' ? (
            <Integrations />
          ) : view === 'backups' ? (
            <section className="cms-panel">
              <Empty title="Export des contenus enregistrés">
                L’export reprend les contenus chargés depuis PostgreSQL. Il exclut les comptes, mots
                de passe et CV ; il ne remplace pas une sauvegarde complète de la base.
              </Empty>
              <div className="cms-panel-footer cms-actions">
                <button
                  className="cms-button"
                  onClick={() =>
                    download(
                      'iresen-contenus.json',
                      JSON.stringify(workspace, null, 2),
                      'application/json',
                    )
                  }
                >
                  Exporter les contenus JSON
                </button>
              </div>
            </section>
          ) : view === 'imports' ? (
            <Imports
              entries={workspace.entries}
              role={role}
              apply={async (entries) => {
                if (connected && !contentConnected())
                  throw new Error('Rechargez la connexion au CMS avant d’importer.')
                await persist({
                  ...workspace,
                  entries: [
                    ...workspace.entries.filter(
                      (entry) => !entries.some((imported) => imported.id === entry.id),
                    ),
                    ...entries,
                  ],
                  logs: [
                    {
                      id: id(),
                      at: new Date().toISOString(),
                      action: 'Import CSV local',
                      resource: `${entries.length} brouillon(s)`,
                      actor: role,
                      kind: 'audit',
                    },
                    ...workspace.logs,
                  ],
                })
                setMessage(
                  `${entries.length} brouillon(s) importés dans cet atelier. Aucune publication.`,
                )
              }}
            />
          ) : view === 'logs' ? (
            <Logs logs={workspace.logs} />
          ) : currentModule || workspaceList ? (
            <>
              {view === 'media' && (
                <MediaTypeChooser
                  entries={workspace.entries}
                  value={mediaKind}
                  change={(kind) => {
                    setMediaKind(kind)
                    setPage(1)
                    setSelection([])
                    setQuery('')
                    setStatus('all')
                  }}
                />
              )}
              {view === 'organigram' && (
                <OrganigramOverview
                  entries={workspace.entries}
                  language={localeFilter}
                  open={open}
                  create={(kind) => {
                    const entry = createEntry('organigram', id(), new Date().toISOString())
                    entry.shared.recordType = kind
                    open(entry)
                  }}
                />
              )}
              {view === 'news' && (
                <div className="cms-inline-notice">
                  <CmsIcon name="link" />
                  <span>
                    <strong>À traiter depuis LinkedIn</strong> — connecteur non relié. La rédaction
                    manuelle est disponible.
                  </span>
                  <button className="cms-text-button" onClick={() => navigate('integrations')}>
                    Détails
                    <CmsIcon name="arrow" />
                  </button>
                </div>
              )}
              {view === 'users' && (
                <section className="cms-panel cms-permission-panel">
                  <h2>Profils et parcours à valider</h2>
                  <div className="cms-table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Profil</th>
                          <th>Brouillons</th>
                          <th>Validation / publication</th>
                          <th>Utilisateurs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <tr key={value}>
                            <th>{label}</th>
                            <td>Rédaction et soumission</td>
                            <td>{value === 'admin' ? 'Simulation autorisée' : 'Indisponible'}</td>
                            <td>{value === 'admin' ? 'Simulation autorisée' : 'Indisponible'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="cms-help">
                    Le sélecteur en haut permet de tester ces parcours. Restrictions par module et
                    langue, identité et MFA seront traités à la connexion.
                  </p>
                </section>
              )}
              <section className="cms-panel">
                <div className="cms-list-toolbar">
                  <div className="cms-search-field">
                    <CmsIcon name="search" />
                    <input
                      aria-label={`Rechercher dans ${title}`}
                      type="search"
                      placeholder="Rechercher par titre ou référence…"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value)
                        setPage(1)
                        setSelection([])
                      }}
                    />
                  </div>
                  <select
                    aria-label="Filtrer par état"
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value)
                      setPage(1)
                      setSelection([])
                    }}
                  >
                    <option value="all">Tous les états</option>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Langue de la liste"
                    value={localeFilter}
                    onChange={(e) => {
                      setLocaleFilter(e.target.value as Language)
                      setPage(1)
                      setSelection([])
                    }}
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label="Trier les contenus"
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value)
                      setPage(1)
                    }}
                  >
                    <option value="recent">Modification récente</option>
                    <option value="title">Titre A–Z</option>
                  </select>
                </div>
                <div className="cms-list-count">
                  <span role="status">
                    {filtered.length} contenu(s){query && ` pour « ${query} »`}
                  </span>
                  <div className="cms-actions">
                    {selection.length > 0 && (
                      <>
                        <span>{selection.length} sélectionné(s)</span>
                        <button
                          className="cms-button"
                          disabled={role !== 'admin'}
                          onClick={archiveSelection}
                        >
                          Retirer en brouillon
                        </button>
                      </>
                    )}
                    <button
                      className="cms-text-button"
                      onClick={() =>
                        download(
                          `${view}-atelier.csv`,
                          [
                            [
                              'reference',
                              'title',
                              'body',
                              'status',
                              'language',
                              ...(currentModule?.fields
                                .filter((field) => field.key !== 'reference')
                                .map((field) => field.key) ?? []),
                            ],
                            ...filtered.map((e) => [
                              e.reference,
                              e.variants[localeFilter].title,
                              e.variants[localeFilter].body,
                              e.variants[localeFilter].status,
                              localeFilter,
                              ...(currentModule?.fields
                                .filter((field) => field.key !== 'reference')
                                .map((field) => fieldValue(e, field, localeFilter)) ?? []),
                            ]),
                          ]
                            .map((row) => row.map(safeCsvCell).join(','))
                            .join('\n'),
                          'text/csv',
                        )
                      }
                    >
                      Exporter la liste
                    </button>
                  </div>
                </div>
                {visible.length ? (
                  <>
                    <div className="cms-table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th className="cms-checkbox-cell">
                              <input
                                type="checkbox"
                                aria-label="Sélectionner cette page de résultats"
                                checked={visible.every((e) => selection.includes(e.id))}
                                onChange={(e) =>
                                  setSelection(
                                    e.target.checked
                                      ? [...new Set([...selection, ...visible.map((e) => e.id)])]
                                      : selection.filter(
                                          (selected) => !visible.some((e) => e.id === selected),
                                        ),
                                  )
                                }
                              />
                            </th>
                            <th>Contenu</th>
                            {currentModule?.columns?.map((key) => (
                              <th key={key}>
                                {currentModule.fields.find((field) => field.key === key)?.label ??
                                  key}
                              </th>
                            ))}
                            <th>État {localeFilter.toUpperCase()}</th>
                            <th>Langues</th>
                            <th>Modification</th>
                            <th scope="col" className="cms-actions-column">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {visible.map((entry) => (
                            <tr key={entry.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  aria-label={`Sélectionner ${entry.variants[localeFilter].title || entry.reference}`}
                                  checked={selection.includes(entry.id)}
                                  onChange={(e) =>
                                    setSelection(
                                      e.target.checked
                                        ? [...selection, entry.id]
                                        : selection.filter((selected) => selected !== entry.id),
                                    )
                                  }
                                />
                              </td>
                              <td>
                                {entry.shared.sourceImagePath?.startsWith('/') && (
                                  <Image
                                    src={entry.shared.sourceImagePath}
                                    alt=""
                                    width={72}
                                    height={48}
                                    unoptimized
                                    className="cms-row-thumbnail"
                                  />
                                )}
                                <button
                                  className="cms-title-button"
                                  dir="auto"
                                  onClick={() => open(entry)}
                                >
                                  {entry.variants[localeFilter].title || 'Traduction à compléter'}
                                </button>
                              </td>
                              {currentModule?.columns?.map((key) => (
                                <td key={key} className="cms-business-cell" dir="auto">
                                  {['sourceUrl', 'doi'].includes(key) &&
                                  /^https?:\/\//i.test(entry.shared[key] ?? '') ? (
                                    <a
                                      className="cms-source-link"
                                      href={entry.shared[key]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={entry.shared[key]}
                                      aria-label={`${key === 'doi' ? 'Accéder à la publication' : 'Lien · source de'} ${entry.variants[localeFilter].title || entry.reference}`}
                                    >
                                      {key === 'doi' ? 'Accéder à la publication' : 'Lien'}
                                    </a>
                                  ) : (
                                    displayField(entry, key, localeFilter, workspace.entries)
                                  )}
                                </td>
                              ))}
                              <td>
                                <Badge status={entry.variants[localeFilter].status} />
                              </td>
                              <td>
                                <Languages entry={entry} />
                              </td>
                              <td>{date(entry.updatedAt)}</td>
                              <td>
                                <EntryActions
                                  entry={entry}
                                  language={localeFilter}
                                  role={role}
                                  compact
                                  open={open}
                                  action={requestEntryAction}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="cms-pagination">
                      <span>
                        Page {Math.min(page, totalPages)} sur {totalPages} · 8 contenus par page
                      </span>
                      <div className="cms-actions">
                        <button
                          className="cms-button"
                          disabled={page <= 1}
                          onClick={() => setPage(page - 1)}
                        >
                          Précédente
                        </button>
                        <button
                          className="cms-button"
                          disabled={page >= totalPages}
                          onClick={() => setPage(page + 1)}
                        >
                          Suivante
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Empty
                    title={
                      query || status !== 'all'
                        ? 'Aucun résultat pour ces filtres'
                        : connected
                          ? 'Aucun contenu enregistré'
                          : 'Aucun contenu dans cet atelier'
                    }
                  >
                    {query || status !== 'all'
                      ? 'Modifiez votre recherche ou revenez à tous les états.'
                      : connected
                        ? 'Créez une fiche : son enregistrement sera conservé dans PostgreSQL.'
                        : 'Créez un brouillon local pour valider le formulaire et le parcours. Les bases réelles ne sont pas chargées.'}
                  </Empty>
                )}
              </section>
            </>
          ) : null}
          {!draft && currentModule && (
            <details className="cms-panel cms-schema-disclosure">
              <summary>Voir les champs et types · {currentModule.label}</summary>
              <SchemaTable module={currentModule} />
            </details>
          )}
          <footer className="cms-footer">
            <span>IRESEN · {connected ? 'Gestion du site' : 'Atelier de validation du CMS'}</span>
            <span>Interface FR · contenus FR / EN / AR · Africa/Casablanca</span>
          </footer>
        </main>
      </div>
      {entryAction && (
        <Dialog
          title={
            entryAction.action === 'highlight'
              ? 'Mettre cet article à la une ?'
              : entryAction.action === 'delete'
                ? 'Supprimer cette fiche ?'
                : entryAction.action === 'restore'
                  ? 'Restaurer cette fiche ?'
                  : entryAction.action === 'review'
                    ? 'Remettre en revue ?'
                    : 'Remettre en brouillon ?'
          }
          close={() => {
            if (!actionBusy) setEntryAction(null)
          }}
        >
          <p>
            <strong>{entryAction.title}</strong>
          </p>
          <p>
            {entryAction.action === 'highlight'
              ? 'Cet article deviendra le seul article à la une et remplacera la sélection actuelle. Les textes et leurs validations restent inchangés.'
              : entryAction.action === 'delete'
                ? 'La fiche sera retirée des listes et des publications dynamiques dans toutes les langues. Elle restera récupérable dans la corbeille.'
                : entryAction.action === 'restore'
                  ? 'La fiche reviendra en brouillon privé. Une nouvelle validation sera nécessaire.'
                  : `Cette action concerne la langue ${entryAction.language.toUpperCase()}. La version validée est conservée pendant la nouvelle rédaction ou revue.`}
          </p>
          {entryAction.action === 'delete' && (
            <>
              {impactLoading && <p role="status">Analyse des dépendances en base…</p>}
              {deleteImpact && <DeleteImpactSummary impact={deleteImpact} />}
              <button
                type="button"
                className="cms-button"
                disabled={impactLoading || actionBusy}
                onClick={() => {
                  setActionError('')
                  setDeleteImpact(null)
                  setImpactLoading(true)
                  setImpactReload((value) => value + 1)
                }}
              >
                Actualiser les impacts
              </button>
            </>
          )}
          <label className="cms-action-note">
            Motif / note interne
            <textarea
              rows={3}
              value={entryAction.note}
              disabled={actionBusy}
              onChange={(event) => setEntryAction({ ...entryAction, note: event.target.value })}
            />
          </label>
          {actionError && (
            <p role="alert" className="cms-error">
              {actionError}
            </p>
          )}
          <div className="cms-actions">
            <button
              className="cms-button"
              disabled={actionBusy}
              onClick={() => setEntryAction(null)}
            >
              Annuler
            </button>
            <button
              className="cms-button cms-primary"
              disabled={
                actionBusy ||
                (entryAction.action === 'delete' &&
                  (impactLoading ||
                    !deleteImpact ||
                    deleteImpact.id !== entryAction.id ||
                    deleteImpact.blockers.length > 0))
              }
              onClick={async () => {
                setActionBusy(true)
                setActionError('')
                try {
                  const updated = await performContentAction(
                    entryAction.id,
                    entryAction.action,
                    entryAction.language,
                    entryAction.note,
                    entryAction.action === 'delete' ? (deleteImpact ?? undefined) : undefined,
                  )
                  if (draft?.id === entryAction.id) {
                    const saved = updated.entries.find((entry) => entry.id === draft.id)
                    setDraft(saved ? structuredClone(saved) : null)
                    setBaseline(saved ? JSON.stringify(saved) : '')
                  }
                  setSelection((previous) => previous.filter((id) => id !== entryAction.id))
                  if (entryAction.action === 'delete') setPage(1)
                  setMessage(
                    entryAction.action === 'highlight'
                      ? 'Article mis à la une.'
                      : entryAction.action === 'delete'
                        ? 'Fiche déplacée dans la corbeille.'
                        : entryAction.action === 'restore'
                          ? 'Fiche restaurée en brouillon privé.'
                          : `Fiche remise en ${entryAction.action === 'review' ? 'revue' : 'brouillon'}.`,
                  )
                  setEntryAction(null)
                } catch (error) {
                  setActionError(error instanceof Error ? error.message : 'Action impossible.')
                } finally {
                  setActionBusy(false)
                }
              }}
            >
              {actionBusy
                ? 'Enregistrement…'
                : entryAction.action === 'delete'
                  ? 'Confirmer la suppression'
                  : 'Confirmer'}
            </button>
          </div>
        </Dialog>
      )}
      {confirmation && (
        <Dialog title={confirmation.title} close={() => setConfirmation(null)}>
          <p>{confirmation.body}</p>
          <div className="cms-actions">
            <button className="cms-button" onClick={() => setConfirmation(null)}>
              Revenir
            </button>
            <button
              className="cms-button cms-primary"
              onClick={async () => {
                try {
                  await confirmation.action()
                } catch (error) {
                  setErrors([error instanceof Error ? error.message : 'Action impossible.'])
                }
                setConfirmation(null)
              }}
            >
              {confirmation.label}
            </button>
          </div>
        </Dialog>
      )}
      {preview && draft && (
        <Dialog title="Aperçu de la révision locale" close={() => setPreview(null)} wide>
          <div className="cms-preview-controls">
            <button
              className="cms-button"
              aria-pressed={preview === 'desktop'}
              onClick={() => setPreview('desktop')}
            >
              Ordinateur
            </button>
            <button
              className="cms-button"
              aria-pressed={preview === 'mobile'}
              onClick={() => setPreview('mobile')}
            >
              Mobile
            </button>
            <span>Gabarit de lecture · aucune page du site remplacée</span>
          </div>
          <article
            className={`cms-content-preview cms-content-preview-${preview}`}
            lang={language}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <Image src="/brand/logo-primary.svg" alt="IRESEN" width={120} height={40} />
            <h2>{draft.variants[language].title || 'Titre à compléter'}</h2>
            <p>{draft.variants[language].body || 'Texte à compléter dans cette langue.'}</p>
            <dl className="cms-preview-fields">
              {currentModule?.fields
                .filter(
                  (field) =>
                    fieldApplies(draft, field) && fieldValue(draft, field, language).trim(),
                )
                .map((field) => (
                  <div key={field.key}>
                    <dt>{field.label}</dt>
                    <dd>{displayField(draft, field.key, language, workspace.entries)}</dd>
                  </div>
                ))}
            </dl>
          </article>
        </Dialog>
      )}
    </div>
  )
}
function Languages({ entry }: { entry: Entry }) {
  return (
    <span className="cms-languages">
      {languages.map((lang) => (
        <span
          key={lang}
          className={entry.variants[lang].title ? 'complete' : ''}
          title={`${lang.toUpperCase()} : ${entry.variants[lang].title ? statusLabels[entry.variants[lang].status] : 'Texte manquant'}`}
        >
          {lang.toUpperCase()}
        </span>
      ))}
    </span>
  )
}

function PageChooser({
  registry,
  entries,
  open,
  create,
}: {
  registry: PageRegistry[]
  entries: Entry[]
  open: (entry: Entry) => void
  create: (page: PageRegistry, section: PageRegistry['sections'][number]) => void
}) {
  const [chosen, setChosen] = useState(registry[0].id)
  const page = registry.find((p) => p.id === chosen)!
  return (
    <div className="cms-page-chooser">
      <section className="cms-panel">
        <h2>Choisir une page</h2>
        <label htmlFor="page-choice" className="cms-sr-only">
          Page existante
        </label>
        <select id="page-choice" value={chosen} onChange={(e) => setChosen(e.target.value)}>
          {registry.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <p className="cms-help">
          {registry.length} destinations existantes. Aucun ajout de page, de section ou de route.
        </p>
        <Link href={page.href} prefetch={false} className="cms-text-button">
          Consulter la page actuelle
          <CmsIcon name="arrow" />
        </Link>
      </section>
      <section className="cms-panel">
        <div className="cms-panel-heading">
          <h2>Sections de {page.title}</h2>
          <span>Structure fixe</span>
        </div>
        {page.sections.map((section) => {
          const entry = entries.find(
            (e) => e.shared.pageId === page.id && e.shared.sectionId === section.id,
          )
          return (
            <div key={section.id}>
              <button
                className="cms-result-row"
                key={section.id}
                onClick={() => (entry ? open(entry) : create(page, section))}
              >
                <CmsIcon name="document" />
                <span>
                  <strong>{section.title}</strong>
                  <small>
                    {entry
                      ? 'Contenu chargé depuis PostgreSQL'
                      : 'Aucun contenu enregistré pour cette section'}
                  </small>
                </span>
                <CmsIcon name="arrow" />
              </button>
            </div>
          )
        })}
        {!page.sections.length && (
          <Empty title="Aucun champ de section exposé">
            Les destinations utilitaires conservent leurs modèles actuels.
          </Empty>
        )}
        <div className="cms-section-divider">
          <h2>Textes détaillés du site</h2>
          <p>
            Missions, chronologie, axes de recherche, biographies, liens et autres textes imbriqués.
          </p>
          {entries
            .filter((entry) => entry.shared.catalogNamespace)
            .map((entry) => (
              <div key={entry.id}>
                <button className="cms-result-row" key={entry.id} onClick={() => open(entry)}>
                  <CmsIcon name="document" />
                  <span>
                    <strong>{entry.variants.fr.title}</strong>
                    <small>Contenu FR / EN / AR · PostgreSQL</small>
                  </span>
                  <CmsIcon name="arrow" />
                </button>
              </div>
            ))}
        </div>
        <div className="cms-panel-footer">
          Les textes et les contenus structurés du site sont enregistrés en base commune. Les
          variantes en cours de rédaction conservent leur étape de validation.
        </div>
      </section>
    </div>
  )
}
function Figures({
  role,
  entries,
  open,
  actions,
}: {
  role: Role
  entries: Entry[]
  open: (entry: Entry) => void
  actions: (entry: Entry) => ReactNode
}) {
  const calculated = [
    {
      title: 'Nombre d’appels à projets',
      value: String(publicModuleCount(entries, 'calls')),
      source: 'Répertoire des appels à projets · base commune',
      rule: 'Nombre de fiches d’appels à projets avec une version publique validée (FR), toutes éditions confondues. Ne représente pas uniquement les appels ouverts.',
    },
    {
      title: 'Projets collaboratifs soutenus',
      value: String(supportedProjects(entries)),
      source: 'Catalogue des projets · versions publiques validées en français',
      rule: 'Projets du catalogue public validé, hors fiches privées et brouillons sans version validée. Les modifications en cours ne remplacent pas la version validée.',
    },
    {
      title: 'Publications retenues',
      value: String(publicModuleCount(entries, 'publications')),
      source: 'Corpus structuré · T4 2026',
      rule: 'Références publiques validées dans la sélection approuvée ; exclusions conservées.',
    },
    {
      title: 'Références de dépôt de brevets',
      value: String(filedPatentReferences(entries)),
      source: 'Catalogue structuré de dépôts',
      rule: 'Références validées du portefeuille, y compris les dépôts dont la fiche individuelle reste privée. Ce total agrégé ne signifie ni actifs, ni délivrés, ni commercialisés.',
    },
    {
      title: 'Brevets accordés du portefeuille PI',
      value: String(grantedPatents(entries)),
      source: 'Portefeuille PI · statut accepté / délivré renseigné en base',
      rule: 'Versions publiques validées dont le champ « Accepté / délivré dans la source » vaut Oui. Les dépôts non accordés ou sans statut sont exclus ; aucune commercialisation n’est déduite.',
    },
    {
      title: 'Laboratoires du réseau',
      value: String(publicModuleCount(entries, 'laboratories')),
      source: 'Référentiel fourni',
      rule: 'Fiches de laboratoires ; positions des villes approximatives.',
    },
  ]
  return (
    <section className="cms-panel">
      <div className="cms-panel-heading">
        <h2>Registre des indicateurs</h2>
        <span>Aperçu de définition</span>
      </div>
      <div className="cms-table-scroll">
        <table>
          <thead>
            <tr>
              <th>Indicateur</th>
              <th>Référence connue</th>
              <th>Nature / source</th>
              <th>Règle</th>
            </tr>
          </thead>
          <tbody>
            {calculated.map((figure) => (
              <tr key={figure.title}>
                <th>{figure.title}</th>
                <td>{figure.value}</td>
                <td>
                  Calculé · lecture seule
                  <small className="cms-row-reference">{figure.source}</small>
                </td>
                <td>{figure.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="cms-panel-footer">
        Effectifs calculés à partir des fiches chargées depuis PostgreSQL. Aucun indicateur inventé.
      </div>
      <div className="cms-section-divider">
        <h2>Indicateurs éditoriaux du site</h2>
        {entries
          .filter((entry) => entry.module === 'figures')
          .map((entry) => (
            <div key={entry.id} className="cms-indicator-row">
              <button
                key={entry.id}
                className="cms-result-row"
                disabled={!canEdit(role, 'figures')}
                onClick={() => open(entry)}
              >
                <span>
                  <strong>{entry.variants.fr.title}</strong>
                  <small>
                    {entry.shared.value} · {entry.shared.source}
                  </small>
                </span>
              </button>
              {actions(entry)}
            </div>
          ))}
      </div>
    </section>
  )
}
function Integrations() {
  const records = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).entries
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <section className="cms-panel">
      <h2>Connexions des données</h2>
      {contentConnected() && (
        <>
          <p className="cms-context">
            PostgreSQL connecté. Les collections ci-dessous sont enregistrées en base. Les services
            externes figurent séparément.
          </p>
          <div className="cms-table-scroll">
            <table>
              <caption>État des rubriques du CMS</caption>
              <thead>
                <tr>
                  <th>Rubrique</th>
                  <th>Fiches</th>
                  <th>Stockage</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                {modules
                  .filter((module) => module.id !== 'users')
                  .map((module) => (
                    <tr key={module.id}>
                      <th>{module.label}</th>
                      <td>{records.filter((entry) => entry.module === module.id).length}</td>
                      <td>
                        <code>cms_authoring_entries</code> · {module.id}
                      </td>
                      <td>Connectée</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="cms-context">
        Recherche interne : moteur PostgreSQL et références FR / EN / AR raccordés aux versions
        validées.
      </p>
      <h3>Services externes</h3>
      {externalConnections.map((connection) => (
        <div className="cms-integration-row" key={connection.name}>
          <span className="cms-task-icon">
            <CmsIcon name="link" />
          </span>
          <div>
            <h3>{connection.name}</h3>
            <p>{connection.text}</p>
            {selected === connection.name && (
              <p className="cms-context">
                À fournir en phase de connexion : {connection.needs} Aucun secret n’est demandé dans
                cet atelier.
              </p>
            )}
          </div>
          <span className="cms-badge cms-badge-draft">Non connecté</span>
          <button
            className="cms-button"
            aria-expanded={selected === connection.name}
            onClick={() => setSelected(selected === connection.name ? null : connection.name)}
          >
            Préparer
          </button>
        </div>
      ))}
    </section>
  )
}
function Logs({ logs }: { logs: ReturnType<typeof getSnapshot>['logs'] }) {
  const [kind, setKind] = useState('audit')
  const [query, setQuery] = useState('')
  const filtered = logs.filter(
    (log) =>
      log.kind === kind &&
      `${log.action} ${log.resource}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <section className="cms-panel">
      <div className="cms-list-toolbar">
        <div className="cms-tabs">
          <button aria-pressed={kind === 'audit'} onClick={() => setKind('audit')}>
            Audit local
          </button>
          <button aria-pressed={kind === 'technical'} onClick={() => setKind('technical')}>
            Technique
          </button>
        </div>
        <input
          type="search"
          aria-label="Rechercher dans les journaux"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une action…"
        />
      </div>
      {filtered.length ? (
        <div className="cms-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Heure</th>
                <th>Action</th>
                <th>Ressource</th>
                <th>Langue</th>
                <th>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td>{date(log.at)}</td>
                  <td>{log.action}</td>
                  <td>{log.resource}</td>
                  <td>{log.language?.toUpperCase() ?? '—'}</td>
                  <td>{roleLabels[log.actor]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty
          title={
            kind === 'technical'
              ? 'Supervision technique non connectée'
              : 'Aucune action locale enregistrée'
          }
        >
          {kind === 'technical'
            ? 'Les erreurs, jobs et synchronisations apparaîtront après connexion. Aucun traitement serveur n’est lancé.'
            : 'Enregistrez, soumettez ou importez un brouillon pour consulter ses traces ici.'}
        </Empty>
      )}
      <div className="cms-panel-footer">
        Les actions sont enregistrées côté serveur avec le compte authentifié. Les 200 dernières
        traces sont affichées.
      </div>
    </section>
  )
}
function Imports({
  entries,
  role,
  apply,
}: {
  entries: Entry[]
  role: Role
  apply: (entries: Entry[]) => void | Promise<void>
}) {
  const [moduleId, setModuleId] = useState('news')
  const [rows, setRows] = useState<string[][]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({
    reference: '',
    title: '',
    body: '',
  })
  const importFields =
    modules.find((module) => module.id === moduleId)?.fields.filter((field) => !field.readOnly) ??
    []
  const [phase, setPhase] = useState(1)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const headers = rows[0] ?? []
  const records = rows.slice(1).map((row, index) => ({
    reference: row[headers.indexOf(mapping.reference)]?.trim() ?? '',
    title: row[headers.indexOf(mapping.title)]?.trim() ?? '',
    body: row[headers.indexOf(mapping.body)] ?? '',
    fields: Object.fromEntries(
      importFields.map((field) => [field.key, row[headers.indexOf(mapping[field.key])] ?? '']),
    ),
    line: index + 2,
  }))
  function prepareRecord(record: (typeof records)[number], newId: string): Entry {
    const existing = entries.find((e) => e.module === moduleId && e.reference === record.reference)
    const entry = existing
      ? structuredClone(existing)
      : createEntry(moduleId, newId, new Date().toISOString())
    entry.reference = record.reference
    entry.variants.fr = {
      ...entry.variants.fr,
      title: record.title,
      body: record.body,
      status: 'draft',
    }
    for (const field of importFields) {
      if (!mapping[field.key] || field.key === 'reference') continue
      if (field.localized) entry.variants.fr.fields[field.key] = record.fields[field.key]
      else entry.shared[field.key] = record.fields[field.key]
    }
    const errors = [...validateEntry(entry, 'fr'), ...relationErrors(entry, entries)]
    if (errors.length) throw new Error(`Ligne ${record.line} : ${errors.join(' ')}`)
    if (existing && JSON.stringify(existing.shared) !== JSON.stringify(entry.shared))
      for (const lang of languages) entry.variants[lang].status = 'draft'
    entry.updatedAt = new Date().toISOString()
    return entry
  }
  const issues = new Map(
    records.map((record) => {
      try {
        prepareRecord(record, `import-validation-${record.line}`)
        return [record.line, ''] as const
      } catch (error) {
        return [record.line, error instanceof Error ? error.message : 'Champs invalides'] as const
      }
    }),
  )
  const valid = records.filter(
    (record) =>
      record.reference &&
      record.title &&
      !issues.get(record.line) &&
      !entries.some(
        (entry) =>
          entry.module === moduleId &&
          entry.reference === record.reference &&
          entry.variants.fr.status === 'review',
      ) &&
      records.filter((other) => other.reference === record.reference).length === 1,
  )
  const duplicates = records.filter(
    (record) =>
      record.reference &&
      records.filter((other) => other.reference === record.reference).length > 1,
  )
  const updates = valid.filter((record) =>
    entries.some((entry) => entry.module === moduleId && entry.reference === record.reference),
  )
  return (
    <section className="cms-panel cms-import">
      <h2>Répéter un import métier</h2>
      <ol className="cms-import-steps">
        {['Fichier', 'Correspondance', 'Validation', 'Confirmation'].map((label, index) => (
          <li key={label} aria-current={phase === index + 1 ? 'step' : undefined}>
            <span>{index + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <p className="cms-help">
        CSV local, 1 Mo / 500 lignes maximum. Les cellules sont du texte. XLSX et import serveur
        restent à connecter.
      </p>
      {error && (
        <p role="alert" className="cms-error">
          {error}
        </p>
      )}
      {phase === 1 && (
        <div className="cms-fields">
          <label>
            Module de destination
            <select
              value={moduleId}
              onChange={(e) => {
                setModuleId(e.target.value)
                setDone(false)
              }}
            >
              {modules
                .filter((m) => !m.fixed && m.id !== 'users' && m.id !== 'careers')
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
            </select>
          </label>
          <button
            className="cms-button"
            onClick={() =>
              download(
                'modele-atelier.csv',
                [
                  'reference,title,body,' +
                    importFields
                      .map((field) => field.key)
                      .filter((key) => key !== 'reference')
                      .join(','),
                ].join('\n') + '\n',
                'text/csv',
              )
            }
          >
            Télécharger le modèle CSV
          </button>
          <label>
            Fichier CSV
            <input
              type="file"
              accept=".csv,text/csv"
              disabled={!canEdit(role, 'figures')}
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                try {
                  if (file.size > 1024 * 1024) throw new Error('Le fichier dépasse 1 Mo.')
                  const parsed = parseCsv(await file.text())
                  if (parsed.length < 2 || parsed.length > 501)
                    throw new Error('Le fichier doit comporter un en-tête et de 1 à 500 lignes.')
                  if (new Set(parsed[0]).size !== parsed[0].length)
                    throw new Error('Les noms de colonnes doivent être uniques.')
                  setRows(parsed)
                  setMapping({
                    reference: parsed[0].includes('reference') ? 'reference' : '',
                    title: parsed[0].includes('title') ? 'title' : '',
                    body: parsed[0].includes('body') ? 'body' : '',
                    ...Object.fromEntries(
                      importFields
                        .filter((field) => field.key !== 'reference')
                        .map((field) => [
                          field.key,
                          parsed[0].includes(field.key) ? field.key : '',
                        ]),
                    ),
                  })
                  setError('')
                  setPhase(2)
                  setDone(false)
                } catch (error) {
                  setError(error instanceof Error ? error.message : 'Fichier illisible.')
                }
              }}
            />
          </label>
        </div>
      )}
      {phase === 2 && (
        <div className="cms-fields">
          {Object.entries({
            reference: 'Identifiant métier (requis)',
            title: 'Titre français (requis)',
            body: 'Texte français',
            ...Object.fromEntries(
              importFields
                .filter((field) => field.key !== 'reference')
                .map((field) => [field.key, field.label + ' (' + field.type + ')']),
            ),
          }).map(([key, label]) => (
            <label key={key}>
              {label}
              <select
                value={mapping[key as keyof typeof mapping]}
                onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })}
              >
                <option value="">Choisir une colonne</option>
                {headers.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            className="cms-button cms-primary"
            disabled={!mapping.reference || !mapping.title || !canEdit(role, 'figures')}
            onClick={() => setPhase(3)}
          >
            Vérifier les lignes
          </button>
        </div>
      )}
      {phase === 3 && (
        <>
          <div className="cms-context">
            <strong>
              {valid.length} ligne(s) retenue(s) · {updates.length} mise(s) à jour ·{' '}
              {valid.length - updates.length} création(s)
            </strong>
            <p>
              {records.length - valid.length} ligne(s) ignorée(s), dont {duplicates.length} avec
              identifiant répété. Les mises à jour remplacent titre/texte FR et remettent cette
              langue en brouillon ; les versions publiées locales sont conservées. Les fiches en
              revue sont exclues des imports.
            </p>
          </div>
          <div className="cms-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Ligne</th>
                  <th>Référence</th>
                  <th>Titre</th>
                  <th>Résultat</th>
                </tr>
              </thead>
              <tbody>
                {records.slice(0, 25).map((record) => (
                  <tr key={record.line}>
                    <td>{record.line}</td>
                    <td>{record.reference || 'Manquant'}</td>
                    <td>{record.title || 'Manquant'}</td>
                    <td>
                      {valid.includes(record)
                        ? updates.includes(record)
                          ? 'Mise à jour FR'
                          : 'Création brouillon'
                        : issues.get(record.line) ||
                          'Ignorée : titre / référence manquant, doublon ou fiche en revue'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cms-help">
            Aperçu des 25 premières lignes ; le bilan couvre le fichier complet.
          </p>
          <button
            className="cms-button cms-primary"
            disabled={!valid.length || !canEdit(role, 'figures')}
            onClick={() => setPhase(4)}
          >
            Continuer vers la confirmation
          </button>
        </>
      )}
      {phase === 4 && (
        <>
          <h3>{done ? 'Import local terminé' : 'Confirmer ces changements locaux'}</h3>
          <p>
            {valid.length} brouillon(s) FR dans {modules.find((m) => m.id === moduleId)?.label}.
            {contentConnected()
              ? 'Ces brouillons seront enregistrés dans PostgreSQL après validation serveur, sans publication automatique.'
              : 'Aucune base, aucun indicateur et aucun index public ne sera modifié.'}
          </p>
          {!done && (
            <button
              className="cms-button cms-primary"
              disabled={!canEdit(role, 'figures')}
              onClick={async () => {
                try {
                  const imported = valid.map((record) => prepareRecord(record, id()))
                  await apply(imported)
                  setDone(true)
                } catch (error) {
                  setError(error instanceof Error ? error.message : 'Import local impossible.')
                }
              }}
            >
              Importer dans cet atelier
            </button>
          )}
        </>
      )}
      {phase > 1 && (
        <div className="cms-panel-footer">
          <button
            className="cms-text-button"
            onClick={() => {
              setPhase(done ? 1 : phase - 1)
              setDone(false)
            }}
          >
            {done ? 'Préparer un autre import' : 'Revenir à l’étape précédente'}
          </button>
        </div>
      )}
    </section>
  )
}
