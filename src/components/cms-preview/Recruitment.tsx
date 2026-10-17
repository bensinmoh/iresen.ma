'use client'

import { useEffect, useState, useSyncExternalStore, type FormEvent } from 'react'
import { type Entry, type Role, roleLabels, statusLabels } from '@/lib/cms-preview/model'
import { safeCsvCell } from '@/lib/cms-preview/model'
import {
  addRecruitmentNote,
  applicationKinds,
  canRecruitmentTransition,
  internshipTypes,
  moveApplication,
  newApplication,
  newCandidate,
  recruitmentContracts,
  recruitmentError,
  recruitmentStages,
  saveApplication,
  saveEvaluation,
  saveInterview,
  type Application,
  type ApplicationKind,
  type Candidate,
  type Interview,
  type RecruitmentDocument,
  type RecruitmentStage,
} from '@/lib/cms-preview/recruitment'
import {
  attachRecruitmentFile,
  persistRecruitment,
  recruitmentFile,
  recruitmentConnected,
  recruitmentFileUrl,
  recruitmentServerSnapshot,
  recruitmentSnapshot,
  subscribeRecruitment,
} from '@/lib/cms-preview/recruitment-store'
import { CmsIcon } from './CmsIcon'

const now = () => new Date().toISOString()
const uid = () => crypto.randomUUID()
const formatted = (value: string) =>
  new Intl.DateTimeFormat('fr-MA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Casablanca',
  }).format(new Date(value))
const personName = (candidate?: Candidate) =>
  candidate ? `${candidate.firstName} ${candidate.lastName}` : 'Profil indisponible'
const offerName = (offers: Entry[], id: string) =>
  offers.find((offer) => offer.id === id)?.variants.fr.title || 'Offre locale indisponible'
function exportFile(name: string, value: string, type = 'application/json') {
  const href = URL.createObjectURL(new Blob([value], { type }))
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = name
  anchor.click()
  URL.revokeObjectURL(href)
}
const tabs = {
  offers: 'Offres',
  applications: 'Candidatures',
  internships: 'Stages',
  spontaneous: 'Spontanées',
  shortlist: 'Shortlist',
  interviews: 'Entretiens',
  structure: 'Structure des données',
} as const
type Tab = keyof typeof tabs

type Props = {
  offers: Entry[]
  role: Role
  openOffer: (entry: Entry) => void
  createOffer: () => void
  onDirty: (dirty: boolean) => void
  offerActions?: (entry: Entry) => React.ReactNode
}
export function Recruitment({
  offers,
  role,
  openOffer,
  createOffer,
  onDirty,
  offerActions,
}: Props) {
  const connected = recruitmentConnected()
  const state = useSyncExternalStore(
    subscribeRecruitment,
    recruitmentSnapshot,
    recruitmentServerSnapshot,
  )
  const [tab, setTab] = useState<Tab>('offers')
  const [selectedId, setSelectedId] = useState('')
  const [selectedPanel, setSelectedPanel] = useState('profile')
  const [editor, setEditor] = useState<{ candidate: Candidate; application: Application } | null>(
    null,
  )
  const [baseline, setBaseline] = useState('')
  const [childDirty, setChildDirty] = useState(false)
  const dirty = Boolean(editor && JSON.stringify(editor) !== baseline) || childDirty
  const [pending, setPending] = useState<(() => void) | null>(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    query: '',
    stage: '',
    offerId: '',
    skills: '',
    experience: '',
    assignedTo: '',
    from: '',
    to: '',
    sort: 'recent',
  })
  const [selection, setSelection] = useState<string[]>([])
  const [target, setTarget] = useState<RecruitmentStage>('screening')
  const [reason, setReason] = useState('')
  const [page, setPage] = useState(1)
  const [offerSearch, setOfferSearch] = useState('')
  const [offerStage, setOfferStage] = useState('')
  const [vacancyState, setVacancyState] = useState('')
  useEffect(() => {
    onDirty(dirty)
    return () => onDirty(false)
  }, [dirty, onDirty])
  function guard(action: () => void) {
    if (dirty) setPending(() => action)
    else action()
  }
  function chooseTab(next: Tab) {
    guard(() => {
      setTab(next)
      setEditor(null)
      setSelectedId('')
      setSelection([])
      setPage(1)
      setError('')
      setNotice('')
    })
  }
  function filter(key: keyof typeof filters, value: string) {
    setFilters({ ...filters, [key]: value })
    setPage(1)
    setSelection([])
  }
  async function run(action: () => void | Promise<void>, message: string) {
    try {
      await action()
      setError('')
      setNotice(message)
    } catch (caught) {
      setError(recruitmentError(caught))
    }
  }
  function create(kind: ApplicationKind) {
    guard(() => {
      const candidate = newCandidate(uid(), now())
      const application = newApplication(uid(), candidate.id, kind, now())
      const draft = { candidate, application }
      setEditor(draft)
      setBaseline(JSON.stringify(draft))
      setSelectedId('')
      setError('')
      setNotice('')
    })
  }
  function edit(candidate: Candidate, application: Application) {
    guard(() => {
      const draft = structuredClone({ candidate, application })
      setEditor(draft)
      setBaseline(JSON.stringify(draft))
      setSelectedId('')
      setError('')
    })
  }
  function save(event: FormEvent) {
    event.preventDefault()
    if (!editor) return
    run(
      async () => {
        if (
          editor.application.kind === 'offer' &&
          !offers.some((offer) => offer.id === editor.application.offerId)
        )
          throw new Error('Sélectionner une offre présente dans cet atelier.')
        await persistRecruitment(
          saveApplication(
            state,
            editor.candidate,
            editor.application,
            role,
            now(),
            offers.map((offer) => offer.id),
          ),
        )
        setSelectedId(editor.application.id)
        setEditor(null)
        setTab(
          editor.application.kind === 'internship'
            ? 'internships'
            : editor.application.kind === 'spontaneous'
              ? 'spontaneous'
              : 'applications',
        )
      },
      connected
        ? 'Dossier enregistré dans PostgreSQL. Aucune confirmation envoyée.'
        : 'Dossier enregistré en mémoire dans cet atelier. Aucun dépôt reçu du site, aucune confirmation envoyée.',
    )
  }
  const filtered = state.applications
    .filter((application) => {
      const candidate = state.candidates.find((item) => item.id === application.candidateId)
      if (!candidate) return false
      if (tab === 'internships' && application.kind !== 'internship') return false
      if (tab === 'spontaneous' && application.kind !== 'spontaneous') return false
      if (tab === 'shortlist' && !['shortlisted', 'interview'].includes(application.status))
        return false
      const haystack =
        `${personName(candidate)} ${candidate.email} ${candidate.discipline} ${candidate.education} ${candidate.skills.join(' ')} ${application.motivation}`.toLocaleLowerCase(
          'fr',
        )
      return (
        haystack.includes(filters.query.toLocaleLowerCase('fr')) &&
        (!filters.stage || application.status === filters.stage) &&
        (!filters.offerId || application.offerId === filters.offerId) &&
        (!filters.assignedTo || application.assignedTo === filters.assignedTo) &&
        (!filters.experience || candidate.experienceYears >= Number(filters.experience)) &&
        filters.skills
          .split(',')
          .map((skill) => skill.trim().toLocaleLowerCase('fr'))
          .filter(Boolean)
          .every((skill) =>
            candidate.skills.some((value) => value.toLocaleLowerCase('fr').includes(skill)),
          ) &&
        (!filters.from || application.receivedAt.slice(0, 10) >= filters.from) &&
        (!filters.to || application.receivedAt.slice(0, 10) <= filters.to)
      )
    })
    .sort((a, b) =>
      filters.sort === 'name'
        ? personName(
            state.candidates.find((candidate) => candidate.id === a.candidateId),
          ).localeCompare(
            personName(state.candidates.find((candidate) => candidate.id === b.candidateId)),
            'fr',
          )
        : filters.sort === 'oldest'
          ? a.receivedAt.localeCompare(b.receivedAt)
          : b.receivedAt.localeCompare(a.receivedAt),
    )
  const totalPages = Math.max(1, Math.ceil(filtered.length / 10))
  const visible = filtered.slice(
    (Math.min(page, totalPages) - 1) * 10,
    Math.min(page, totalPages) * 10,
  )
  const selected = state.applications.find((application) => application.id === selectedId)
  const selectedCandidate = state.candidates.find(
    (candidate) => candidate.id === selected?.candidateId,
  )
  const visibleOffers = offers.filter(
    (offer) =>
      `${offer.variants.fr.title} ${offer.reference}`
        .toLowerCase()
        .includes(offerSearch.toLowerCase()) &&
      (!offerStage || offer.variants.fr.status === offerStage) &&
      (!vacancyState || offer.shared.vacancyStatus === vacancyState),
  )
  return (
    <div className="cms-recruitment">
      <p className="cms-context">
        {connected
          ? 'Recrutement connecté à PostgreSQL · dossiers et CV privés enregistrés en base. La saisie manuelle est disponible ; les formulaires externes et les notifications ne sont pas raccordés.'
          : 'Atelier de recrutement local · aucune réception depuis le site ou Tally. Utilisez des données de test. Dossiers et fichiers conservés en mémoire uniquement jusqu’au rechargement ; aucun CV n’est envoyé ou stocké dans la médiathèque publique.'}
      </p>
      <nav className="cms-tabs cms-recruitment-tabs" aria-label="Espace recrutement">
        {Object.entries(tabs).map(([key, label]) => (
          <button key={key} aria-pressed={tab === key} onClick={() => chooseTab(key as Tab)}>
            {label}
            {key === 'applications' && ` (${state.applications.length})`}
            {key === 'shortlist' &&
              ` (${state.applications.filter((application) => ['shortlisted', 'interview'].includes(application.status)).length})`}
          </button>
        ))}
      </nav>
      <div className="cms-recruitment-counts">
        {[
          ['Offres locales', offers.length],
          ['Dossiers reçus localement', state.applications.length],
          [
            'À étudier',
            state.applications.filter((application) =>
              ['received', 'screening'].includes(application.status),
            ).length,
          ],
          [
            'Shortlist',
            state.applications.filter((application) =>
              ['shortlisted', 'interview'].includes(application.status),
            ).length,
          ],
          [
            'Entretiens planifiés',
            state.interviews.filter((interview) => interview.status === 'planned').length,
          ],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      {pending && (
        <div role="alert" className="cms-context">
          <p>Le dossier contient des modifications non enregistrées.</p>
          <div className="cms-actions">
            <button className="cms-button" onClick={() => setPending(null)}>
              Revenir au dossier
            </button>
            <button
              className="cms-button"
              onClick={() => {
                pending()
                setPending(null)
              }}
            >
              Abandonner les modifications du dossier
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="cms-error">
          {error}
        </p>
      )}
      <p role="status" className={notice ? 'cms-feedback' : 'cms-sr-only'}>
        {notice}
      </p>
      {editor ? (
        <section className="cms-panel">
          <h2>
            {state.applications.some((application) => application.id === editor.application.id)
              ? 'Modifier le dossier'
              : 'Réception locale d’une candidature'}
          </h2>
          <form onSubmit={save} className="cms-fields">
            <div className="cms-field-grid">
              {!state.applications.some(
                (application) => application.id === editor.application.id,
              ) && (
                <label className="cms-field-wide">
                  Profil candidat
                  <select
                    value={
                      state.candidates.some((candidate) => candidate.id === editor.candidate.id)
                        ? editor.candidate.id
                        : ''
                    }
                    onChange={(event) => {
                      const candidate =
                        state.candidates.find((item) => item.id === event.target.value) ??
                        newCandidate(uid(), now())
                      setEditor({
                        candidate: structuredClone(candidate),
                        application: { ...editor.application, candidateId: candidate.id },
                      })
                    }}
                  >
                    <option value="">Nouveau profil</option>
                    {state.candidates.map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {personName(candidate)} · {candidate.email}
                      </option>
                    ))}
                  </select>
                  <small>
                    Un profil peut avoir plusieurs candidatures. Ses coordonnées et CV sont partagés
                    entre ses dossiers.
                  </small>
                </label>
              )}
              {(
                [
                  ['firstName', 'Prénom'],
                  ['lastName', 'Nom'],
                  ['email', 'Courriel'],
                  ['phone', 'Téléphone'],
                  ['city', 'Ville'],
                  ['education', 'Formation / diplôme'],
                  ['discipline', 'Spécialité'],
                  ['languages', 'Langues professionnelles'],
                  ['portfolio', 'Portfolio professionnel'],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    required={['firstName', 'lastName', 'email'].includes(key)}
                    type={key === 'email' ? 'email' : key === 'portfolio' ? 'url' : 'text'}
                    dir="auto"
                    value={editor.candidate[key]}
                    onChange={(event) =>
                      setEditor({
                        ...editor,
                        candidate: { ...editor.candidate, [key]: event.target.value },
                      })
                    }
                  />
                </label>
              ))}
              <label>
                Années d’expérience
                <input
                  type="number"
                  min="0"
                  max="80"
                  step="0.5"
                  value={editor.candidate.experienceYears}
                  onChange={(event) =>
                    setEditor({
                      ...editor,
                      candidate: {
                        ...editor.candidate,
                        experienceYears: Number(event.target.value),
                      },
                    })
                  }
                />
              </label>
              <label className="cms-field-wide">
                Compétences (séparées par des virgules)
                <input
                  value={editor.candidate.skills.join(',')}
                  onChange={(event) =>
                    setEditor({
                      ...editor,
                      candidate: { ...editor.candidate, skills: event.target.value.split(',') },
                    })
                  }
                />
              </label>
              <label>
                Origine du dossier
                <select
                  value={editor.application.kind}
                  onChange={(event) =>
                    setEditor({
                      ...editor,
                      application: {
                        ...editor.application,
                        kind: event.target.value as ApplicationKind,
                        offerId: '',
                        internshipType: '',
                      },
                    })
                  }
                >
                  {Object.entries(applicationKinds).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {editor.application.kind === 'offer' && (
                <label>
                  Offre concernée
                  <select
                    required
                    value={editor.application.offerId}
                    onChange={(event) =>
                      setEditor({
                        ...editor,
                        application: { ...editor.application, offerId: event.target.value },
                      })
                    }
                  >
                    <option value="">Choisir une offre locale</option>
                    {offers.map((offer) => (
                      <option key={offer.id} value={offer.id}>
                        {offer.variants.fr.title || offer.reference} ·{' '}
                        {statusLabels[offer.variants.fr.status]}
                      </option>
                    ))}
                  </select>
                  {!offers.length && (
                    <small>
                      Créez d’abord une offre dans l’onglet Offres, ou choisissez un stage / une
                      candidature spontanée.
                    </small>
                  )}
                </label>
              )}
              {editor.application.kind === 'internship' && (
                <>
                  <label>
                    Type de stage
                    <select
                      required
                      value={editor.application.internshipType}
                      onChange={(event) =>
                        setEditor({
                          ...editor,
                          application: {
                            ...editor.application,
                            internshipType: event.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Choisir</option>
                      {Object.entries(internshipTypes).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Établissement de formation
                    <input
                      value={editor.application.studyInstitution}
                      onChange={(event) =>
                        setEditor({
                          ...editor,
                          application: {
                            ...editor.application,
                            studyInstitution: event.target.value,
                          },
                        })
                      }
                    />
                  </label>
                  <label>
                    Niveau d’études
                    <input
                      value={editor.application.studyLevel}
                      onChange={(event) =>
                        setEditor({
                          ...editor,
                          application: { ...editor.application, studyLevel: event.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Durée souhaitée en mois
                    <input
                      type="number"
                      min="0"
                      max="48"
                      value={editor.application.durationMonths}
                      onChange={(event) =>
                        setEditor({
                          ...editor,
                          application: {
                            ...editor.application,
                            durationMonths: Number(event.target.value),
                          },
                        })
                      }
                    />
                  </label>
                </>
              )}
              <label>
                Disponible à partir du
                <input
                  type="date"
                  value={editor.application.availableFrom}
                  onInput={(event) =>
                    setEditor({
                      ...editor,
                      application: {
                        ...editor.application,
                        availableFrom: event.currentTarget.value,
                      },
                    })
                  }
                  onChange={(event) =>
                    setEditor({
                      ...editor,
                      application: { ...editor.application, availableFrom: event.target.value },
                    })
                  }
                />
              </label>
              <label>
                Responsable du suivi (rôle)
                <select
                  value={editor.application.assignedTo}
                  onChange={(event) =>
                    setEditor({
                      ...editor,
                      application: {
                        ...editor.application,
                        assignedTo: event.target.value as Role,
                      },
                    })
                  }
                >
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Motivations
              <textarea
                rows={5}
                dir="auto"
                value={editor.application.motivation}
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    application: { ...editor.application, motivation: event.target.value },
                  })
                }
              />
            </label>
            <p className="cms-help">
              Enregistrez le dossier pour y joindre un CV ou une lettre. Cette saisie enregistre une
              réception et ne transmet rien.
            </p>
            <div className="cms-actions">
              <button type="submit" className="cms-button cms-primary">
                Enregistrer le dossier
              </button>
              <button
                type="button"
                className="cms-button"
                onClick={() => guard(() => setEditor(null))}
              >
                Fermer le dossier
              </button>
            </div>
          </form>
        </section>
      ) : selected && selectedCandidate ? (
        <ApplicationDetail
          key={selected.id}
          initialPanel={selectedPanel}
          application={selected}
          candidate={selectedCandidate}
          offers={offers}
          role={role}
          edit={() => edit(selectedCandidate, selected)}
          close={() => guard(() => setSelectedId(''))}
          onDirty={setChildDirty}
          report={(message) => {
            setError('')
            setNotice(message)
          }}
          fail={setError}
        />
      ) : tab === 'offers' ? (
        <section className="cms-panel">
          <div className="cms-panel-heading">
            <h2>Gestion des offres</h2>
            <button className="cms-button cms-primary" onClick={createOffer}>
              <CmsIcon name="plus" />
              Créer une offre
            </button>
          </div>
          <div className="cms-analytics-filters">
            <label>
              Rechercher une offre
              <input
                type="search"
                value={offerSearch}
                onChange={(event) => setOfferSearch(event.target.value)}
              />
            </label>
            <label>
              État éditorial de l’offre
              <select value={offerStage} onChange={(event) => setOfferStage(event.target.value)}>
                <option value="">Tous</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Ouverture de l’offre
              <select
                value={vacancyState}
                onChange={(event) => setVacancyState(event.target.value)}
              >
                <option value="">Toutes</option>
                <option value="open">Ouverte</option>
                <option value="closed">Clôturée</option>
              </select>
            </label>
          </div>
          {!visibleOffers.length ? (
            <div className="cms-empty">
              <h3>Aucune offre locale</h3>
              <p>
                {offers.length
                  ? 'Aucune offre ne correspond aux filtres.'
                  : 'Créez une offre pour tester son circuit éditorial et les candidatures associées. Les offres publiques réelles ne sont pas importées.'}
              </p>
            </div>
          ) : (
            <div className="cms-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Offre</th>
                    <th>Contrat / lieu</th>
                    <th>Échéance</th>
                    <th>Publication</th>
                    <th>Ouverture</th>
                    <th>Candidatures locales</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOffers.map((offer) => (
                    <tr key={offer.id}>
                      <td>
                        <button className="cms-title-button" onClick={() => openOffer(offer)}>
                          {offer.variants.fr.title || offer.reference}
                        </button>
                      </td>
                      <td>
                        {offer.shared.contract ||
                          offer.variants.fr.fields.contract ||
                          'Non renseigné'}{' '}
                        · {offer.variants.fr.fields.place || 'Non renseigné'}
                      </td>
                      <td>{offer.shared.end || 'Non renseignée'}</td>
                      <td>{statusLabels[offer.variants.fr.status]}</td>
                      <td>
                        {offer.shared.vacancyStatus === 'closed'
                          ? 'Clôturée'
                          : offer.shared.vacancyStatus === 'open'
                            ? 'Ouverte'
                            : 'Non renseignée'}
                      </td>
                      <td>
                        {
                          state.applications.filter(
                            (application) => application.offerId === offer.id,
                          ).length
                        }
                      </td>
                      <td>
                        <div className="cms-offer-actions">
                          {offerActions?.(offer)}
                          <div className="cms-entry-actions cms-entry-actions-compact">
                            <button
                              className="cms-entry-action cms-entry-action-dossiers"
                              aria-label={`Voir les dossiers · ${offer.variants.fr.title || offer.reference}`}
                              title="Voir les dossiers"
                              onClick={() => {
                                setTab('applications')
                                filter('offerId', offer.id)
                              }}
                            >
                              <span className="cms-entry-action-icon">
                                <CmsIcon name="folder" />
                              </span>
                              <span className="cms-entry-action-tooltip" aria-hidden="true">
                                Voir les dossiers
                              </span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : tab === 'structure' ? (
        <RecruitmentStructure />
      ) : tab === 'interviews' ? (
        <section className="cms-panel">
          <h2>Entretiens</h2>
          <p>
            Planification en heure du Maroc. Aucune invitation ou visioconférence n’est envoyée.
          </p>
          {!state.interviews.length ? (
            <p>Aucun entretien planifié. Ouvrez une candidature pour préparer un entretien.</p>
          ) : (
            <div className="cms-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Candidat</th>
                    <th>Date · Africa/Casablanca</th>
                    <th>Format</th>
                    <th>Évaluateurs</th>
                    <th>État</th>
                    <th>Dossier</th>
                  </tr>
                </thead>
                <tbody>
                  {[...state.interviews]
                    .sort((a, b) => a.startAt.localeCompare(b.startAt))
                    .map((interview) => {
                      const application = state.applications.find(
                        (item) => item.id === interview.applicationId,
                      )
                      return (
                        <tr key={interview.id}>
                          <td>
                            {personName(
                              state.candidates.find(
                                (candidate) => candidate.id === application?.candidateId,
                              ),
                            )}
                          </td>
                          <td>{formatted(interview.startAt)}</td>
                          <td>
                            {interview.format === 'onsite'
                              ? 'Sur place'
                              : interview.format === 'video'
                                ? 'Visioconférence'
                                : 'Téléphone'}
                          </td>
                          <td>{interview.interviewers}</td>
                          <td>
                            {interview.status === 'planned'
                              ? 'Planifié'
                              : interview.status === 'completed'
                                ? 'Réalisé'
                                : 'Annulé'}
                          </td>
                          <td>
                            <button
                              className="cms-text-button"
                              onClick={() => setSelectedId(interview.applicationId)}
                            >
                              Ouvrir le dossier
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="cms-panel">
          <div className="cms-panel-heading">
            <h2>{tabs[tab]}</h2>
            <button
              className="cms-button cms-primary"
              onClick={() =>
                create(
                  tab === 'internships'
                    ? 'internship'
                    : tab === 'spontaneous'
                      ? 'spontaneous'
                      : 'offer',
                )
              }
            >
              Saisir une candidature locale
            </button>
          </div>
          <div className="cms-recruitment-filters">
            <label>
              Rechercher un candidat
              <input
                type="search"
                value={filters.query}
                onChange={(event) => filter('query', event.target.value)}
              />
            </label>
            <label>
              Étape du recrutement
              <select
                value={filters.stage}
                onChange={(event) => filter('stage', event.target.value)}
              >
                <option value="">Toutes les étapes</option>
                {Object.entries(recruitmentStages).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Offre
              <select
                value={filters.offerId}
                onChange={(event) => filter('offerId', event.target.value)}
              >
                <option value="">Toutes les offres et demandes</option>
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.variants.fr.title || offer.reference}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Compétences recherchées
              <input
                value={filters.skills}
                placeholder="Séparer les critères par des virgules"
                onChange={(event) => filter('skills', event.target.value)}
              />
            </label>
            <label>
              Expérience minimale (années)
              <input
                type="number"
                min="0"
                max="80"
                value={filters.experience}
                onChange={(event) => filter('experience', event.target.value)}
              />
            </label>
            <label>
              Responsable du suivi
              <select
                value={filters.assignedTo}
                onChange={(event) => filter('assignedTo', event.target.value)}
              >
                <option value="">Tous</option>
                {Object.entries(roleLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Reçue à partir du
              <input
                type="date"
                value={filters.from}
                onChange={(event) => filter('from', event.target.value)}
              />
            </label>
            <label>
              Reçue jusqu’au
              <input
                type="date"
                value={filters.to}
                onChange={(event) => filter('to', event.target.value)}
              />
            </label>
            <label>
              Trier les candidatures
              <select value={filters.sort} onChange={(event) => filter('sort', event.target.value)}>
                <option value="recent">Plus récentes</option>
                <option value="oldest">Plus anciennes</option>
                <option value="name">Nom du candidat</option>
              </select>
            </label>
          </div>
          <div className="cms-list-count">
            <span>
              {filtered.length} dossier(s) · sélection manuelle selon les critères professionnels
            </span>
            <div className="cms-actions">
              <button
                className="cms-text-button"
                onClick={() => {
                  setFilters({
                    query: '',
                    stage: '',
                    offerId: '',
                    skills: '',
                    experience: '',
                    assignedTo: '',
                    from: '',
                    to: '',
                    sort: 'recent',
                  })
                  setSelection([])
                  setPage(1)
                }}
              >
                Réinitialiser les filtres
              </button>
              <button
                className="cms-text-button"
                disabled={!filtered.length}
                onClick={() =>
                  exportFile(
                    'dossiers-locaux.csv',
                    [
                      ['reference', 'candidat', 'origine', 'offre', 'etape', 'date'],
                      ...filtered.map((application) => [
                        application.id,
                        personName(
                          state.candidates.find(
                            (candidate) => candidate.id === application.candidateId,
                          ),
                        ),
                        applicationKinds[application.kind],
                        application.offerId ? offerName(offers, application.offerId) : '',
                        recruitmentStages[application.status],
                        application.receivedAt,
                      ]),
                    ]
                      .map((row) => row.map(safeCsvCell).join(','))
                      .join('\n'),
                    'text/csv',
                  )
                }
              >
                Exporter la liste filtrée
              </button>
            </div>
          </div>
          {selection.length > 0 && (
            <div className="cms-context">
              <h3>{selection.length} dossier(s) sélectionné(s)</h3>
              <div className="cms-field-grid">
                <label>
                  Étape à appliquer
                  <select
                    value={target}
                    onChange={(event) => setTarget(event.target.value as RecruitmentStage)}
                  >
                    {Object.entries(recruitmentStages).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Motif professionnel de la décision
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    rows={2}
                  />
                </label>
              </div>
              <button
                className="cms-button"
                disabled={
                  !reason.trim() ||
                  selection.some((id) => {
                    const application = state.applications.find((item) => item.id === id)
                    return (
                      !application || !canRecruitmentTransition(role, application.status, target)
                    )
                  })
                }
                onClick={() =>
                  run(async () => {
                    await persistRecruitment(
                      moveApplication(state, selection, target, role, reason, now()),
                    )
                    setSelection([])
                    setReason('')
                  }, 'Décision locale enregistrée pour la sélection. Aucun candidat contacté.')
                }
              >
                Appliquer à la sélection
              </button>
            </div>
          )}
          {!visible.length ? (
            <div className="cms-empty">
              <h3>Aucun dossier dans cette vue</h3>
              <p>
                Les dossiers saisis par l’équipe sont enregistrés en base. Aucune candidature reçue
                dans cette vue ; vérifiez les filtres ou ajoutez un dossier réel.
              </p>
            </div>
          ) : (
            <div className="cms-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Sélectionner les candidatures visibles"
                        checked={visible.every((application) => selection.includes(application.id))}
                        onChange={(event) =>
                          setSelection(
                            event.target.checked
                              ? [
                                  ...new Set([
                                    ...selection,
                                    ...visible.map((application) => application.id),
                                  ]),
                                ]
                              : selection.filter(
                                  (id) => !visible.some((application) => application.id === id),
                                ),
                          )
                        }
                      />
                    </th>
                    <th>Candidat</th>
                    <th>Origine / offre</th>
                    <th>Compétences</th>
                    {tab === 'shortlist' && (
                      <>
                        <th>Formation</th>
                        <th>Expérience</th>
                        <th>Disponibilité</th>
                      </>
                    )}
                    <th>Étape</th>
                    <th>CV</th>
                    <th>Réception locale</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((application) => {
                    const candidate = state.candidates.find(
                      (item) => item.id === application.candidateId,
                    )!
                    return (
                      <tr key={application.id}>
                        <td>
                          <input
                            type="checkbox"
                            aria-label={`Sélectionner ${personName(candidate)}`}
                            checked={selection.includes(application.id)}
                            onChange={(event) =>
                              setSelection(
                                event.target.checked
                                  ? [...selection, application.id]
                                  : selection.filter((id) => id !== application.id),
                              )
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="cms-title-button"
                            dir="auto"
                            onClick={() => {
                              setSelectedPanel('profile')
                              setSelectedId(application.id)
                            }}
                          >
                            {personName(candidate)}
                          </button>
                          <small>{candidate.email}</small>
                        </td>
                        <td>
                          {applicationKinds[application.kind]}
                          <small>
                            {application.kind === 'offer'
                              ? offerName(offers, application.offerId)
                              : application.kind === 'internship'
                                ? internshipTypes[
                                    application.internshipType as keyof typeof internshipTypes
                                  ]
                                : 'Vivier spontané'}
                          </small>
                        </td>
                        <td>{candidate.skills.filter(Boolean).join(', ') || 'Non renseignées'}</td>
                        {tab === 'shortlist' && (
                          <>
                            <td>{candidate.education || 'Non renseignée'}</td>
                            <td>{candidate.experienceYears} an(s)</td>
                            <td>{application.availableFrom || 'Non renseignée'}</td>
                          </>
                        )}
                        <td>
                          <span className="cms-badge">{recruitmentStages[application.status]}</span>
                        </td>
                        <td>
                          {state.documents.some(
                            (document) =>
                              document.candidateId === candidate.id && document.kind === 'cv',
                          ) ? (
                            <button
                              className="cms-text-button"
                              onClick={() => {
                                setSelectedPanel('documents')
                                setSelectedId(application.id)
                              }}
                            >
                              Consulter le CV
                            </button>
                          ) : (
                            'Absent'
                          )}
                        </td>
                        <td>{formatted(application.receivedAt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="cms-pagination">
            <span>
              Page {Math.min(page, totalPages)} / {totalPages} · 10 dossiers par page
            </span>
            <div className="cms-actions">
              <button className="cms-button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
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
        </section>
      )}
      <div className="cms-panel-footer">
        Le circuit de recrutement est distinct de la publication des offres. L’administrateur
        confirme les décisions finales.{' '}
        <button
          className="cms-text-button"
          disabled={!state.applications.length}
          onClick={() => exportFile('recrutement-local.json', JSON.stringify(state, null, 2))}
        >
          Exporter les dossiers locaux (sans fichiers)
        </button>
      </div>
    </div>
  )
}

function ApplicationDetail({
  initialPanel,
  application,
  candidate,
  offers,
  role,
  edit,
  close,
  report,
  fail,
  onDirty,
}: {
  initialPanel: string
  application: Application
  candidate: Candidate
  offers: Entry[]
  role: Role
  edit: () => void
  close: () => void
  report: (message: string) => void
  fail: (message: string) => void
  onDirty: (dirty: boolean) => void
}) {
  const state = useSyncExternalStore(
    subscribeRecruitment,
    recruitmentSnapshot,
    recruitmentServerSnapshot,
  )
  const [panel, setPanel] = useState(initialPanel)
  const [decision, setDecision] = useState<RecruitmentStage>('screening')
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [criterion, setCriterion] = useState('')
  const [rating, setRating] = useState(3)
  const [comment, setComment] = useState('')
  const [meeting, setMeeting] = useState<{
    id: string
    localTime: string
    format: Interview['format']
    location: string
    interviewers: string
    status: Interview['status']
    notes: string
  } | null>(null)
  const [documentKind, setDocumentKind] = useState<RecruitmentDocument['kind']>('cv')
  const [selectedDocument, setSelectedDocument] = useState('')
  const [busy, setBusy] = useState(false)
  const dirty = Boolean(reason || note || criterion || comment || meeting || busy)
  useEffect(() => {
    onDirty(dirty)
    return () => onDirty(false)
  }, [dirty, onDirty])
  const connected = recruitmentConnected()
  const documents = state.documents.filter((document) => document.candidateId === candidate.id)
  const interviews = state.interviews.filter(
    (interview) => interview.applicationId === application.id,
  )
  async function act(action: () => void | Promise<void>, message: string) {
    try {
      await action()
      report(message)
    } catch (caught) {
      fail(recruitmentError(caught))
    }
  }
  function localInterview(interview: Interview) {
    const parts = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Africa/Casablanca',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(interview.startAt))
    const part = (type: string) => parts.find((value) => value.type === type)?.value ?? ''
    return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`
  }
  return (
    <section className="cms-panel">
      <button className="cms-text-button" onClick={close}>
        <CmsIcon name="back" />
        Retour aux dossiers
      </button>
      <div className="cms-panel-heading">
        <div>
          <h2 dir="auto">{personName(candidate)}</h2>
          <p>
            {applicationKinds[application.kind]} ·{' '}
            <strong>{recruitmentStages[application.status]}</strong>
          </p>
        </div>
        <button className="cms-button" onClick={edit}>
          Modifier le dossier
        </button>
      </div>
      <p className="cms-help">
        {application.kind === 'offer'
          ? offerName(offers, application.offerId)
          : application.kind === 'internship'
            ? `${internshipTypes[application.internshipType as keyof typeof internshipTypes]} · ${application.durationMonths || 'Durée non renseignée'} mois`
            : 'Candidature du vivier spontané'}{' '}
        · Suivi : {roleLabels[application.assignedTo]} · Saisie locale :{' '}
        {formatted(application.receivedAt)}
      </p>
      <nav className="cms-tabs" aria-label="Détail de la candidature">
        {Object.entries({
          profile: 'Profil',
          documents: 'CV & pièces jointes',
          evaluation: 'Évaluation',
          interviews: 'Entretiens',
          history: 'Historique & notes',
        }).map(([key, label]) => (
          <button key={key} aria-pressed={panel === key} onClick={() => setPanel(key)}>
            {label}
          </button>
        ))}
      </nav>
      {panel === 'profile' && (
        <>
          <dl className="cms-recruitment-profile">
            {[
              ['Courriel', candidate.email],
              ['Téléphone', candidate.phone],
              ['Ville', candidate.city],
              ['Formation', candidate.education],
              ['Spécialité', candidate.discipline],
              ['Expérience professionnelle', `${candidate.experienceYears} an(s)`],
              ['Compétences', candidate.skills.filter(Boolean).join(', ')],
              ['Langues', candidate.languages],
              ['Portfolio', candidate.portfolio],
              ['Disponibilité', application.availableFrom],
              ['Établissement de formation', application.studyInstitution],
              ['Niveau d’études', application.studyLevel],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd dir="auto">{value}</dd>
                </div>
              ))}
          </dl>
          <h3>Motivations</h3>
          <p className="cms-preserve-lines" dir="auto">
            {application.motivation || 'Non renseignées.'}
          </p>
        </>
      )}
      {panel === 'documents' && (
        <div className="cms-fields">
          <h3>CV et documents privés du candidat</h3>
          <p className="cms-help">
            PDF, DOC ou DOCX · 5 Mo maximum par fichier.{' '}
            {connected
              ? 'Stockage privé en base.'
              : 'Les fichiers restent en mémoire dans cette page.'}{' '}
            Le contrôle de signature local ne remplace pas la validation et l’analyse des fichiers
            au raccordement.
          </p>
          <label>
            Type de pièce
            <select
              value={documentKind}
              onChange={(event) =>
                setDocumentKind(event.target.value as RecruitmentDocument['kind'])
              }
            >
              <option value="cv">CV</option>
              <option value="coverLetter">Lettre de motivation</option>
              <option value="portfolio">Dossier professionnel</option>
            </select>
          </label>
          <label>
            Joindre un fichier local
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              disabled={busy}
              onChange={async (event) => {
                const file = event.target.files?.[0]
                if (!file) return
                setBusy(true)
                try {
                  const id = uid()
                  const next = await attachRecruitmentFile(
                    recruitmentSnapshot(),
                    candidate.id,
                    documentKind,
                    file,
                    id,
                    now(),
                  )
                  if (!connected) await persistRecruitment(next)
                  setSelectedDocument(connected ? (next.documents.at(-1)?.id ?? '') : id)
                  report(
                    connected
                      ? 'Pièce jointe enregistrée dans la base privée. Accès réservé aux comptes authentifiés.'
                      : 'Pièce jointe disponible dans cet atelier uniquement. Aucun fichier téléversé.',
                  )
                } catch (caught) {
                  fail(caught instanceof Error ? caught.message : 'Fichier illisible.')
                } finally {
                  setBusy(false)
                }
                event.target.value = ''
              }}
            />
          </label>
          {busy && <p role="status">Vérification du fichier local…</p>}
          {!documents.length && (
            <p>
              Aucun CV ou document associé. Joignez un fichier de test pour vérifier sa
              consultation.
            </p>
          )}
          {documents.map((document) => (
            <div className="cms-document-row" key={document.id}>
              <span>
                <strong>
                  {document.kind === 'cv'
                    ? 'CV'
                    : document.kind === 'coverLetter'
                      ? 'Lettre de motivation'
                      : 'Dossier professionnel'}{' '}
                  · {document.name}
                </strong>
                <small>
                  {Math.ceil(document.size / 1000)} Ko · {formatted(document.addedAt)}
                </small>
              </span>
              <button className="cms-button" onClick={() => setSelectedDocument(document.id)}>
                Consulter {document.name}
              </button>
            </div>
          ))}
          <DocumentViewer
            document={documents.find((document) => document.id === selectedDocument)}
          />
        </div>
      )}
      {panel === 'evaluation' && (
        <div className="cms-fields">
          <h3>Évaluation selon les critères du poste ou du stage</h3>
          <p>
            Aucune analyse automatique des CV ni classement automatique. Chaque appréciation est
            saisie et justifiée par un évaluateur.
          </p>
          <form
            className="cms-fields"
            onSubmit={(event) => {
              event.preventDefault()
              act(async () => {
                await persistRecruitment(
                  saveEvaluation(state, {
                    id: uid(),
                    applicationId: application.id,
                    criterion: criterion.trim(),
                    rating,
                    comment: comment.trim(),
                    actor: role,
                    at: now(),
                  }),
                )
                setCriterion('')
                setComment('')
              }, 'Évaluation humaine enregistrée localement.')
            }}
          >
            <div className="cms-field-grid">
              <label>
                Critère professionnel
                <input
                  required
                  value={criterion}
                  onChange={(event) => setCriterion(event.target.value)}
                  placeholder="Ex. expérience dans le domaine du poste"
                />
              </label>
              <label>
                Appréciation de 1 à 5
                <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option value={value} key={value}>
                      {value} / 5
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Justification de l’appréciation
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </label>
            <button className="cms-button" type="submit">
              Enregistrer l’évaluation
            </button>
          </form>
          {state.evaluations
            .filter((evaluation) => evaluation.applicationId === application.id)
            .map((evaluation) => (
              <section className="cms-recruitment-note" key={evaluation.id}>
                <h4>
                  {evaluation.criterion} · {evaluation.rating}/5
                </h4>
                <p>{evaluation.comment}</p>
                <small>
                  {roleLabels[evaluation.actor]} · {formatted(evaluation.at)}
                </small>
              </section>
            ))}
        </div>
      )}
      {panel === 'interviews' && (
        <div className="cms-fields">
          <div className="cms-panel-heading">
            <h3>Entretiens du dossier</h3>
            <button
              className="cms-button"
              disabled={Boolean(meeting)}
              onClick={() =>
                setMeeting({
                  id: uid(),
                  localTime: '',
                  format: 'onsite',
                  location: '',
                  interviewers: '',
                  status: 'planned',
                  notes: '',
                })
              }
            >
              Planifier un entretien local
            </button>
          </div>
          <p className="cms-help">
            Saisir l’heure au Maroc (Africa/Casablanca). Aucun lien de réunion, événement de
            calendrier ou message n’est créé.
          </p>
          {interviews.map((interview) => (
            <section className="cms-recruitment-note" key={interview.id}>
              <h4>
                {formatted(interview.startAt)} ·{' '}
                {interview.status === 'planned'
                  ? 'Planifié'
                  : interview.status === 'completed'
                    ? 'Réalisé'
                    : 'Annulé'}
              </h4>
              <p>
                {interview.interviewers} · {interview.location || 'Lieu à préciser'}
              </p>
              <p>{interview.notes}</p>
              <button
                className="cms-button"
                disabled={Boolean(meeting)}
                onClick={() => setMeeting({ ...interview, localTime: localInterview(interview) })}
              >
                Modifier cet entretien
              </button>
            </section>
          ))}
          {meeting && (
            <form
              className="cms-fields"
              onSubmit={(event) => {
                event.preventDefault()
                act(async () => {
                  // Resolve the Morocco wall-clock through Intl (including Ramadan offset changes).
                  const target = new Date(`${meeting.localTime}:00Z`)
                  if (Number.isNaN(target.getTime()))
                    throw new Error('Indiquer une date et une heure valides.')
                  let instant = target.getTime()
                  for (let attempt = 0; attempt < 3; attempt++) {
                    const parts = new Intl.DateTimeFormat('sv-SE', {
                      timeZone: 'Africa/Casablanca',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hourCycle: 'h23',
                    }).formatToParts(new Date(instant))
                    const part = (type: string) =>
                      parts.find((value) => value.type === type)?.value ?? ''
                    const wall = Date.parse(
                      `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}:${part('second')}Z`,
                    )
                    instant += target.getTime() - wall
                  }
                  const record: Interview = {
                    id: meeting.id,
                    applicationId: application.id,
                    startAt: new Date(instant).toISOString(),
                    format: meeting.format,
                    location: meeting.location,
                    interviewers: meeting.interviewers.trim(),
                    status: meeting.status,
                    notes: meeting.notes,
                  }
                  if (localInterview(record) !== meeting.localTime)
                    throw new Error(
                      'Cette heure locale n’existe pas lors du changement d’heure ; choisir un autre horaire.',
                    )
                  await persistRecruitment(saveInterview(state, record, role, now()))
                  setMeeting(null)
                }, 'Entretien enregistré localement. Aucune invitation envoyée.')
              }}
            >
              <div className="cms-field-grid">
                <label>
                  Date et heure au Maroc
                  <input
                    type="datetime-local"
                    required
                    value={meeting.localTime}
                    onInput={(event) =>
                      setMeeting({ ...meeting, localTime: event.currentTarget.value })
                    }
                    onChange={(event) => setMeeting({ ...meeting, localTime: event.target.value })}
                  />
                </label>
                <label>
                  Format de l’entretien
                  <select
                    value={meeting.format}
                    onChange={(event) =>
                      setMeeting({ ...meeting, format: event.target.value as Interview['format'] })
                    }
                  >
                    <option value="onsite">Sur place</option>
                    <option value="video">Visioconférence</option>
                    <option value="phone">Téléphone</option>
                  </select>
                </label>
                <label>
                  Lieu / indication de réunion
                  <input
                    value={meeting.location}
                    onChange={(event) => setMeeting({ ...meeting, location: event.target.value })}
                  />
                </label>
                <label>
                  Évaluateurs de l’entretien
                  <input
                    required
                    value={meeting.interviewers}
                    onChange={(event) =>
                      setMeeting({ ...meeting, interviewers: event.target.value })
                    }
                  />
                </label>
                <label>
                  État de l’entretien
                  <select
                    value={meeting.status}
                    onChange={(event) =>
                      setMeeting({ ...meeting, status: event.target.value as Interview['status'] })
                    }
                  >
                    <option value="planned">Planifié</option>
                    <option value="completed">Réalisé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </label>
              </div>
              <label>
                Notes d’entretien
                <textarea
                  rows={3}
                  value={meeting.notes}
                  onChange={(event) => setMeeting({ ...meeting, notes: event.target.value })}
                />
              </label>
              <div className="cms-actions">
                <button className="cms-button" type="submit">
                  Enregistrer l’entretien
                </button>
                <button className="cms-button" type="button" onClick={() => setMeeting(null)}>
                  Fermer sans enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      {panel === 'history' && (
        <div className="cms-fields">
          <h3>Historique et notes internes</h3>
          <label>
            Nouvelle note interne
            <textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <button
            className="cms-button"
            disabled={!note.trim()}
            onClick={() =>
              act(async () => {
                await persistRecruitment(
                  addRecruitmentNote(state, application.id, note, role, now()),
                )
                setNote('')
              }, 'Note enregistrée dans le dossier local.')
            }
          >
            Ajouter la note au dossier
          </button>
          <ol className="cms-recruitment-history">
            {application.history.map((event) => (
              <li key={event.id}>
                <strong>{event.action}</strong>
                <small>
                  {formatted(event.at)} · {roleLabels[event.actor]}
                </small>
                <p className="cms-preserve-lines">{event.note}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
      <section className="cms-section-divider">
        <h3>Décision de recrutement</h3>
        <p>
          Motif professionnel obligatoire. Les décisions finales et la réouverture d’un dossier clos
          sont réservées à l’administrateur.
        </p>
        <div className="cms-field-grid">
          <label>
            Prochaine étape
            <select
              value={decision}
              onChange={(event) => setDecision(event.target.value as RecruitmentStage)}
            >
              {Object.entries(recruitmentStages).map(([key, label]) => (
                <option
                  key={key}
                  value={key}
                  disabled={
                    !canRecruitmentTransition(role, application.status, key as RecruitmentStage)
                  }
                >
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Motif de la décision
            <textarea rows={3} value={reason} onChange={(event) => setReason(event.target.value)} />
          </label>
        </div>
        <button
          className="cms-button cms-primary"
          disabled={!reason.trim() || !canRecruitmentTransition(role, application.status, decision)}
          onClick={() =>
            act(async () => {
              await persistRecruitment(
                moveApplication(state, [application.id], decision, role, reason, now()),
              )
              setReason('')
            }, 'Étape mise à jour dans cet atelier uniquement. Aucun candidat contacté.')
          }
        >
          Enregistrer la décision locale
        </button>
      </section>
    </section>
  )
}

function DocumentViewer({ document }: { document?: RecruitmentDocument }) {
  const file = document ? recruitmentFile(document.id) : undefined
  const url = document ? recruitmentFileUrl(document.id) : ''
  if (!document) return null
  return (
    <section className="cms-cv-viewer">
      <h4>{document.name}</h4>
      {!file && !url ? (
        <p>
          Les octets ne sont plus disponibles dans cette session. Joignez à nouveau le fichier
          local.
        </p>
      ) : (
        <>
          <a className="cms-button" href={url} download={document.name}>
            Télécharger le document local
          </a>
          {document.mime === 'application/pdf' && url ? (
            <iframe
              src={url}
              title={`CV ou document PDF : ${document.name}`}
              className="cms-pdf-preview"
            />
          ) : (
            <p>
              La lecture Word se fait dans votre application habituelle après téléchargement. Aucune
              conversion externe n’est utilisée.
            </p>
          )}
        </>
      )}
    </section>
  )
}
function RecruitmentStructure() {
  return (
    <section className="cms-panel">
      <h2>Structure des données de recrutement</h2>
      <p>
        {recruitmentConnected()
          ? 'Tables PostgreSQL privées : cms_candidate_profiles, cms_applications, cms_candidate_documents, cms_recruitment_interviews, cms_recruitment_evaluations.'
          : 'Contrats privés à raccorder ultérieurement.'}{' '}
        Aucun dossier ne peut devenir une page publiée, un résultat de recherche public ou un média
        public. Les droits serveur, le dépôt sécurisé, la conservation, les notifications et
        l’intégration éventuelle de Tally restent à implémenter.
      </p>
      {recruitmentContracts.map((collection) => (
        <section className="cms-schema" key={collection.name}>
          <h3>{collection.name}</h3>
          <p>{collection.purpose}</p>
          <div className="cms-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Colonne</th>
                  <th>Type / relation</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(collection.fields).map(([key, type]) => (
                  <tr key={key}>
                    <td>
                      <code>{key}</code>
                    </td>
                    <td>{type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </section>
  )
}
