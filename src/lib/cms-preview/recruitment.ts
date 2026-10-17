// Local recruitment domain. No CMS client, public projection, network or applicant import.
import { z } from 'zod'
import type { Role } from './model'

export const applicationKinds = {
  offer: 'Réponse à une offre',
  internship: 'Demande de stage',
  spontaneous: 'Candidature spontanée',
} as const
export type ApplicationKind = keyof typeof applicationKinds
export const recruitmentStages = {
  received: 'Reçue',
  screening: 'À étudier',
  shortlisted: 'Shortlist',
  interview: 'Entretien',
  accepted: 'Retenue',
  rejected: 'Non retenue',
  withdrawn: 'Retirée',
} as const
export type RecruitmentStage = keyof typeof recruitmentStages
export const internshipTypes = {
  pfe: 'PFE',
  observation: 'Observation',
  practical: 'Pratique',
  hybrid: 'Hybride',
  volunteering: 'Volontariat',
  other: 'Autre',
} as const
const candidateSchema = z.object({
  id: z.string(),
  firstName: z.string().trim().min(1, 'Le prénom est requis.'),
  lastName: z.string().trim().min(1, 'Le nom est requis.'),
  email: z.email('Vérifier le courriel.'),
  phone: z.string(),
  city: z.string(),
  education: z.string(),
  discipline: z.string(),
  experienceYears: z.number().min(0).max(80),
  skills: z.array(z.string()),
  languages: z.string(),
  portfolio: z.string(),
  createdAt: z.iso.datetime(),
})
const eventSchema = z.object({
  id: z.string(),
  at: z.iso.datetime(),
  actor: z.enum(['admin', 'editor']),
  action: z.string(),
  note: z.string(),
})
const applicationSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  kind: z.enum(['offer', 'internship', 'spontaneous']),
  offerId: z.string(),
  internshipType: z.string(),
  availableFrom: z.string(),
  durationMonths: z.number().min(0).max(48),
  studyInstitution: z.string(),
  studyLevel: z.string(),
  motivation: z.string(),
  status: z.enum([
    'received',
    'screening',
    'shortlisted',
    'interview',
    'accepted',
    'rejected',
    'withdrawn',
  ]),
  assignedTo: z.enum(['admin', 'editor']),
  receivedAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  history: z.array(eventSchema),
})
const documentSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  kind: z.enum(['cv', 'coverLetter', 'portfolio']),
  name: z.string(),
  mime: z.string(),
  size: z.number().max(5_000_000),
  addedAt: z.iso.datetime(),
})
const interviewSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  startAt: z.iso.datetime(),
  format: z.enum(['onsite', 'video', 'phone']),
  location: z.string(),
  interviewers: z.string().min(1, 'Indiquer les évaluateurs.'),
  status: z.enum(['planned', 'completed', 'cancelled']),
  notes: z.string(),
})
const evaluationSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  criterion: z.string().min(1, 'Indiquer le critère professionnel.'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1, 'Justifier l’évaluation.'),
  actor: z.enum(['admin', 'editor']),
  at: z.iso.datetime(),
})
export const recruitmentSchema = z.object({
  version: z.literal(1),
  candidates: z.array(candidateSchema),
  applications: z.array(applicationSchema),
  documents: z.array(documentSchema),
  interviews: z.array(interviewSchema),
  evaluations: z.array(evaluationSchema),
})
export type Candidate = z.infer<typeof candidateSchema>
export type Application = z.infer<typeof applicationSchema>
export type RecruitmentDocument = z.infer<typeof documentSchema>
export type Interview = z.infer<typeof interviewSchema>
export type Evaluation = z.infer<typeof evaluationSchema>
export type RecruitmentState = z.infer<typeof recruitmentSchema>
export function recruitmentError(error: unknown): string {
  return error instanceof z.ZodError
    ? error.issues.map((issue) => issue.message).join(' ')
    : error instanceof Error
      ? error.message
      : 'Vérifier les champs du dossier.'
}
export const emptyRecruitment = (): RecruitmentState => ({
  version: 1,
  candidates: [],
  applications: [],
  documents: [],
  interviews: [],
  evaluations: [],
})
export const newCandidate = (id: string, at: string): Candidate => ({
  id,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  education: '',
  discipline: '',
  experienceYears: 0,
  skills: [],
  languages: '',
  portfolio: '',
  createdAt: at,
})
export const newApplication = (
  id: string,
  candidateId: string,
  kind: ApplicationKind,
  at: string,
): Application => ({
  id,
  candidateId,
  kind,
  offerId: '',
  internshipType: '',
  availableFrom: '',
  durationMonths: 0,
  studyInstitution: '',
  studyLevel: '',
  motivation: '',
  status: 'received',
  assignedTo: 'editor',
  receivedAt: at,
  updatedAt: at,
  history: [],
})
export function validateRecruitment(state: RecruitmentState): RecruitmentState {
  const parsed = recruitmentSchema.parse(state)
  for (const records of [
    parsed.candidates,
    parsed.applications,
    parsed.documents,
    parsed.interviews,
    parsed.evaluations,
  ]) {
    if (new Set(records.map((record) => record.id)).size !== records.length)
      throw new Error('Identifiants de recrutement dupliqués.')
  }
  if (
    new Set(parsed.candidates.map((candidate) => candidate.email.toLowerCase())).size !==
    parsed.candidates.length
  )
    throw new Error('Ce courriel possède déjà un profil candidat ; utiliser ce profil.')
  for (const candidate of parsed.candidates) {
    if (candidate.portfolio) {
      try {
        if (!['https:', 'http:'].includes(new URL(candidate.portfolio).protocol)) throw new Error()
      } catch {
        throw new Error('Le portfolio doit utiliser une URL http ou https.')
      }
    }
  }
  for (const application of parsed.applications) {
    if (!parsed.candidates.some((candidate) => candidate.id === application.candidateId))
      throw new Error('Profil candidat introuvable.')
    if (application.kind === 'offer' && !application.offerId)
      throw new Error('Sélectionner une offre locale.')
    if (
      application.kind === 'internship' &&
      !Object.keys(internshipTypes).includes(application.internshipType)
    )
      throw new Error('Préciser le type de stage.')
    if (
      application.availableFrom &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(application.availableFrom) ||
        Number.isNaN(Date.parse(application.availableFrom)) ||
        new Date(application.availableFrom).toISOString().slice(0, 10) !==
          application.availableFrom)
    )
      throw new Error('Date de disponibilité invalide.')
  }
  for (const document of parsed.documents)
    if (!parsed.candidates.some((candidate) => candidate.id === document.candidateId))
      throw new Error('Candidat du document introuvable.')
  for (const record of [...parsed.interviews, ...parsed.evaluations])
    if (!parsed.applications.some((application) => application.id === record.applicationId))
      throw new Error('Candidature liée introuvable.')
  return parsed
}
const nextStages: Record<RecruitmentStage, RecruitmentStage[]> = {
  received: ['screening', 'shortlisted', 'rejected', 'withdrawn'],
  screening: ['shortlisted', 'interview', 'rejected', 'withdrawn'],
  shortlisted: ['screening', 'interview', 'rejected', 'withdrawn'],
  interview: ['shortlisted', 'accepted', 'rejected', 'withdrawn'],
  accepted: ['screening'],
  rejected: ['screening'],
  withdrawn: ['screening'],
}
export function canRecruitmentTransition(
  role: Role,
  from: RecruitmentStage,
  to: RecruitmentStage,
): boolean {
  if (!['admin', 'editor'].includes(role) || !nextStages[from]?.includes(to)) return false
  return (
    role === 'admin' ||
    (!['accepted', 'rejected', 'withdrawn'].includes(to) &&
      !['accepted', 'rejected', 'withdrawn'].includes(from))
  )
}
export function moveApplication(
  state: RecruitmentState,
  ids: string[],
  to: RecruitmentStage,
  role: Role,
  note: string,
  at: string,
): RecruitmentState {
  if (
    !ids.length ||
    ids.some((id) => !state.applications.some((application) => application.id === id))
  )
    throw new Error('Sélectionner des candidatures existantes.')
  if (!note.trim()) throw new Error('Indiquer un motif professionnel pour cette décision.')
  const next = structuredClone(state)
  for (const application of next.applications.filter((item) => ids.includes(item.id))) {
    if (!canRecruitmentTransition(role, application.status, to))
      throw new Error('Cette étape n’est pas accessible pour ce profil ou cette candidature.')
    const before = application.status
    application.status = to
    application.updatedAt = at
    application.history.unshift({
      id: `${application.id}-${at}`,
      at,
      actor: role,
      action: `${recruitmentStages[before]} → ${recruitmentStages[to]}`,
      note: note.trim(),
    })
  }
  return validateRecruitment(next)
}
export function saveApplication(
  state: RecruitmentState,
  candidate: Candidate,
  application: Application,
  role: Role,
  at: string,
  offerIds: readonly string[] = [],
): RecruitmentState {
  if (application.kind === 'offer' && !offerIds.includes(application.offerId))
    throw new Error('Offre locale introuvable.')
  if (
    application.kind === 'offer' &&
    state.applications.some(
      (item) =>
        item.id !== application.id &&
        item.candidateId === candidate.id &&
        item.kind === 'offer' &&
        item.offerId === application.offerId,
    )
  )
    throw new Error('Ce candidat possède déjà un dossier pour cette offre.')
  const existing = state.applications.find((item) => item.id === application.id)
  if (!existing && application.status !== 'received')
    throw new Error('Une nouvelle candidature doit commencer à l’étape Reçue.')
  if (candidate.id !== application.candidateId)
    throw new Error('Le profil ne correspond pas au dossier.')
  if (existing && application.status !== existing.status)
    throw new Error('Utiliser le circuit de décision pour changer l’étape.')
  if (!['admin', 'editor'].includes(role)) throw new Error('Profil non autorisé.')
  const next = structuredClone(state)
  next.candidates = [...next.candidates.filter((item) => item.id !== candidate.id), candidate]
  const saved = {
    ...application,
    updatedAt: at,
    history: [
      {
        id: `${application.id}-${at}`,
        at,
        actor: role,
        action: existing ? 'Dossier mis à jour' : 'Dossier créé',
        note: 'Aucun envoi depuis le site ou un formulaire externe.',
      },
      ...(existing?.history ?? []),
    ],
  }
  next.applications = [...next.applications.filter((item) => item.id !== application.id), saved]
  return validateRecruitment(next)
}
function recruitmentAudit(
  state: RecruitmentState,
  applicationId: string,
  action: string,
  note: string,
  role: Role,
  at: string,
): RecruitmentState {
  const next = structuredClone(state)
  const application = next.applications.find((item) => item.id === applicationId)
  if (!application) throw new Error('Candidature introuvable.')
  application.history.unshift({
    id: `${applicationId}-${at}-${action}`,
    at,
    actor: role,
    action,
    note,
  })
  application.updatedAt = at
  return validateRecruitment(next)
}
export function saveInterview(
  state: RecruitmentState,
  interview: Interview,
  role: Role,
  at: string,
): RecruitmentState {
  return recruitmentAudit(
    {
      ...state,
      interviews: [...state.interviews.filter((item) => item.id !== interview.id), interview],
    },
    interview.applicationId,
    state.interviews.some((item) => item.id === interview.id)
      ? 'Entretien mis à jour'
      : 'Entretien planifié localement',
    `${interview.startAt} · ${interview.interviewers}. Aucune invitation envoyée.`,
    role,
    at,
  )
}
export function saveEvaluation(state: RecruitmentState, evaluation: Evaluation): RecruitmentState {
  return recruitmentAudit(
    { ...state, evaluations: [...state.evaluations, evaluation] },
    evaluation.applicationId,
    'Évaluation humaine',
    `${evaluation.criterion} : ${evaluation.rating}/5. ${evaluation.comment}`,
    evaluation.actor,
    evaluation.at,
  )
}
export function addRecruitmentNote(
  state: RecruitmentState,
  id: string,
  note: string,
  role: Role,
  at: string,
): RecruitmentState {
  if (!note.trim()) throw new Error('Saisir une note.')
  const next = structuredClone(state)
  const application = next.applications.find((item) => item.id === id)
  if (!application) throw new Error('Candidature introuvable.')
  application.history.unshift({
    id: `${id}-${at}`,
    at,
    actor: role,
    action: 'Note interne',
    note: note.trim(),
  })
  application.updatedAt = at
  return validateRecruitment(next)
}
export const recruitmentContracts = [
  {
    name: 'candidates',
    purpose:
      'Profils privés ; un courriel identifie un profil, plusieurs candidatures peuvent le référencer.',
    fields: {
      id: 'UUID PK',
      firstName: 'text requis',
      lastName: 'text requis',
      email: 'email unique requis',
      phone: 'text nullable',
      city: 'text nullable',
      education: 'text nullable',
      discipline: 'text nullable',
      experienceYears: 'number 0–80',
      skills: 'text[]',
      languages: 'text nullable',
      portfolio: 'URL nullable',
      createdAt: 'timestamp ISO',
    },
  },
  {
    name: 'applications',
    purpose:
      'Dossiers privés ; circuit de recrutement indépendant des trois étapes éditoriales des offres.',
    fields: {
      id: 'UUID PK',
      candidateId: 'FK candidates',
      kind: 'enum offer | internship | spontaneous',
      offerId: 'FK opportunities requis pour réponse à une offre',
      internshipType: 'enum pfe | observation | practical | hybrid | volunteering | other',
      availableFrom: 'date nullable',
      durationMonths: 'number 0–48',
      studyInstitution: 'text nullable',
      studyLevel: 'text nullable',
      motivation: 'text',
      status:
        'enum received | screening | shortlisted | interview | accepted | rejected | withdrawn',
      assignedTo: 'enum admin | editor (simulation ; userId au raccordement)',
      receivedAt: 'timestamp ISO',
      updatedAt: 'timestamp ISO',
      history: 'RecruitmentEvent[]',
    },
  },
  {
    name: 'application_events',
    purpose:
      'Historique immuable du dossier ; tableau history dans le preview, relation privée au raccordement.',
    fields: {
      id: 'UUID PK',
      applicationId: 'FK applications',
      at: 'timestamp ISO',
      actor: 'enum admin | editor (userId au raccordement)',
      action: 'text',
      note: 'text privé ; motif professionnel de décision',
    },
  },
  {
    name: 'candidate_documents',
    purpose:
      'CV et pièces jointes privés. Les octets restent en mémoire dans le preview, hors médiathèque publique.',
    fields: {
      id: 'UUID PK',
      candidateId: 'FK candidates',
      kind: 'enum cv | coverLetter | portfolio',
      name: 'text',
      mime: 'MIME PDF / DOC / DOCX',
      size: 'number ≤ 5 000 000 octets',
      addedAt: 'timestamp ISO',
      storageKey: 'futur stockage privé uniquement, absent du preview',
    },
  },
  {
    name: 'interviews',
    purpose:
      'Planification locale sans invitation, email, agenda externe ou visioconférence créée.',
    fields: {
      id: 'UUID PK',
      applicationId: 'FK applications',
      startAt: 'timestamp ISO',
      format: 'enum onsite | video | phone',
      location: 'text',
      interviewers: 'text requis',
      status: 'enum planned | completed | cancelled',
      notes: 'text privé',
    },
  },
  {
    name: 'evaluations',
    purpose:
      'Évaluation humaine selon des critères professionnels explicites ; aucune décision ou note automatique.',
    fields: {
      id: 'UUID PK',
      applicationId: 'FK applications',
      criterion: 'text requis',
      rating: 'integer 1–5',
      comment: 'text requis',
      actor: 'enum admin | editor',
      at: 'timestamp ISO',
    },
  },
] as const
