import 'server-only'
import { sql } from '@payloadcms/db-postgres'
import type { PayloadRequest } from 'payload'
import {
  addRecruitmentNote,
  emptyRecruitment,
  moveApplication,
  recruitmentSchema,
  saveApplication,
  saveEvaluation,
  saveInterview,
  validateRecruitment,
  type RecruitmentState,
} from '@/lib/cms-preview/recruitment'
import type { AuthenticatedWorkspace } from './auth'
import { WorkspaceError } from './auth'
import { transactionDb, workspaceTransaction } from './transaction'
export async function recruitmentData(req: PayloadRequest): Promise<RecruitmentState> {
  const db = transactionDb(req)
  const candidates = await db.execute(sql`SELECT data FROM cms_candidate_profiles ORDER BY id`)
  const applications = await db.execute(sql`SELECT data FROM cms_applications ORDER BY id`)
  const documents = await db.execute(
    sql`SELECT metadata FROM cms_candidate_documents ORDER BY created_at,id`,
  )
  const interviews = await db.execute(
    sql`SELECT data FROM cms_recruitment_interviews ORDER BY start_at,id`,
  )
  const evaluations = await db.execute(
    sql`SELECT data FROM cms_recruitment_evaluations ORDER BY created_at,id`,
  )
  return validateRecruitment({
    version: 1,
    candidates: candidates.rows.map((row) => row.data),
    applications: applications.rows.map((row) => row.data),
    documents: documents.rows.map((row) => row.metadata),
    interviews: interviews.rows.map((row) => row.data),
    evaluations: evaluations.rows.map((row) => row.data),
  } as RecruitmentState)
}
export async function loadRecruitment(auth: AuthenticatedWorkspace) {
  return workspaceTransaction(auth, 'recruitment', undefined, async (req, revision) => ({
    state: await recruitmentData(req),
    revision,
  }))
}
export async function writeRecruitment(
  auth: AuthenticatedWorkspace,
  input: unknown,
  expected: number,
) {
  const parsed = recruitmentSchema.safeParse(input)
  if (!parsed.success) throw new WorkspaceError('Structure du dossier de recrutement invalide.')
  const incoming = parsed.data
  if (incoming.applications.length > 5000 || incoming.candidates.length > 5000)
    throw new WorkspaceError('La limite de dossiers de cet espace est atteinte.', 413)
  return workspaceTransaction(auth, 'recruitment', expected, async (req, revision) => {
    const db = transactionDb(req)
    const current = await recruitmentData(req)
    let next = structuredClone(current)
    for (const key of [
      'candidates',
      'applications',
      'interviews',
      'evaluations',
      'documents',
    ] as const)
      if (current[key].some((record) => !incoming[key].some((item) => item.id === record.id)))
        throw new WorkspaceError(
          'Le retrait définitif des dossiers et documents n’est pas disponible dans cette interface.',
          403,
        )
    if (JSON.stringify(incoming.documents) !== JSON.stringify(current.documents))
      throw new WorkspaceError('Les pièces jointes doivent utiliser le dépôt privé.', 403)
    const offers = await db.execute(
      sql`SELECT id FROM cms_authoring_entries WHERE module='careers'`,
    )
    const offerIds = offers.rows.map((row) => String(row.id))
    const at = new Date().toISOString()
    const compare = (value: unknown) => JSON.stringify(value)
    // Candidate edits are validated together, including unique profile/email identity.
    next.candidates = structuredClone(incoming.candidates)
    for (const application of incoming.applications) {
      const candidate = next.candidates.find((record) => record.id === application.candidateId)
      if (!candidate) throw new WorkspaceError('Profil candidat introuvable.')
      const existing = current.applications.find((record) => record.id === application.id)
      if (!existing && application.status !== 'received')
        throw new WorkspaceError('Une nouvelle candidature doit commencer à l’étape Reçue.')
      if (existing && existing.candidateId !== application.candidateId)
        throw new WorkspaceError('Le profil lié à ce dossier ne peut pas être remplacé.')
      const editable = (value: typeof application) => {
        return Object.fromEntries(
          Object.entries(value).filter(
            ([key]) => !['history', 'updatedAt', 'status'].includes(key),
          ),
        )
      }
      if (!existing || compare(editable(existing)) !== compare(editable(application))) {
        next = saveApplication(
          next,
          candidate,
          {
            ...application,
            status: existing?.status ?? 'received',
            history: existing?.history ?? [],
          },
          auth.actor.role,
          at,
          offerIds,
        )
      }
      if (existing && application.status !== existing.status)
        next = moveApplication(
          next,
          [application.id],
          application.status,
          auth.actor.role,
          application.history[0]?.note ?? '',
          at,
        )
      else if (
        existing &&
        application.history[0]?.action === 'Note interne' &&
        application.history[0]?.id !== existing.history[0]?.id
      )
        next = addRecruitmentNote(
          next,
          application.id,
          application.history[0].note,
          auth.actor.role,
          at,
        )
    }
    for (const interview of incoming.interviews)
      if (
        compare(interview) !==
        compare(current.interviews.find((record) => record.id === interview.id))
      )
        next = saveInterview(next, interview, auth.actor.role, at)
    for (const evaluation of incoming.evaluations) {
      const existing = current.evaluations.find((record) => record.id === evaluation.id)
      if (existing && compare(existing) !== compare(evaluation))
        throw new WorkspaceError(
          'Une évaluation enregistrée est immuable. Ajouter une nouvelle appréciation.',
        )
      if (!existing) next = saveEvaluation(next, { ...evaluation, actor: auth.actor.role, at })
    }
    for (const application of next.applications) {
      const previous = current.applications.find((item) => item.id === application.id)
      for (const event of application.history.filter(
        (item) => !previous?.history.some((old) => old.id === item.id),
      )) {
        event.actor = auth.actor.role
        if (event.action === 'Réception locale simulée') {
          event.action = 'Dossier créé'
          event.note = 'Saisie manuelle authentifiée dans le CMS.'
        }
      }
    }
    next = validateRecruitment(next)
    for (const candidate of next.candidates)
      await db.execute(
        sql`INSERT INTO cms_candidate_profiles(id,normalized_email,data) VALUES(${candidate.id},${candidate.email.toLowerCase()},${JSON.stringify(candidate)}::jsonb) ON CONFLICT(id) DO UPDATE SET normalized_email=excluded.normalized_email,data=excluded.data,updated_at=now()`,
      )
    for (const application of next.applications)
      await db.execute(
        sql`INSERT INTO cms_applications(id,candidate_id,kind,offer_entry_id,status,data) VALUES(${application.id},${application.candidateId},${application.kind},${application.kind === 'offer' ? application.offerId : null},${application.status},${JSON.stringify(application)}::jsonb) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,offer_entry_id=excluded.offer_entry_id,status=excluded.status,data=excluded.data,updated_at=now()`,
      )
    for (const interview of next.interviews)
      await db.execute(
        sql`INSERT INTO cms_recruitment_interviews(id,application_id,start_at,data) VALUES(${interview.id},${interview.applicationId},${interview.startAt},${JSON.stringify(interview)}::jsonb) ON CONFLICT(id) DO UPDATE SET start_at=excluded.start_at,data=excluded.data,updated_at=now()`,
      )
    for (const evaluation of next.evaluations.filter(
      (record) => !current.evaluations.some((item) => item.id === record.id),
    ))
      await db.execute(
        sql`INSERT INTO cms_recruitment_evaluations(id,application_id,actor_id,rating,data) VALUES(${evaluation.id},${evaluation.applicationId},${auth.actor.id},${evaluation.rating},${JSON.stringify(evaluation)}::jsonb)`,
      )
    await db.execute(
      sql`INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail) VALUES('recruitment','workspace','Mise à jour des dossiers',${auth.actor.id},${auth.actor.role},${JSON.stringify({ applications: next.applications.length, candidates: next.candidates.length })}::jsonb)`,
    )
    await db.execute(
      sql`UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='recruitment'`,
    )
    return { state: next, revision: revision + 1 }
  })
}
export const emptyConnectedRecruitment = emptyRecruitment
