import { describe, expect, it } from 'vitest'
import {
  addRecruitmentNote,
  canRecruitmentTransition,
  emptyRecruitment,
  moveApplication,
  newApplication,
  newCandidate,
  saveApplication,
  saveEvaluation,
  saveInterview,
  validateRecruitment,
} from '@/lib/cms-preview/recruitment'
import { attachRecruitmentFile } from '@/lib/cms-preview/recruitment-store'

const at = '2026-10-16T10:00:00Z'
function dossier() {
  const candidate = {
    ...newCandidate('candidate-1', at),
    firstName: 'Exemple',
    lastName: 'LOCAL',
    email: 'preview@example.invalid',
    skills: ['énergie', 'Python'],
  }
  const application = newApplication('application-1', candidate.id, 'spontaneous', at)
  const state = saveApplication(emptyRecruitment(), candidate, application, 'editor', at)
  return { state, candidate, application: state.applications[0] }
}

describe('isolated recruitment domain', () => {
  it('starts empty, validates stages and keeps final decisions with administrators', () => {
    expect(emptyRecruitment().applications).toEqual([])
    const { state } = dossier()
    expect(() =>
      moveApplication(state, ['application-1'], 'shortlisted', 'editor', '', at),
    ).toThrow('motif')
    const shortlist = moveApplication(
      state,
      ['application-1'],
      'shortlisted',
      'editor',
      'Critères professionnels de test.',
      at,
    )
    expect(shortlist.applications[0].status).toBe('shortlisted')
    expect(shortlist.applications[0].history[0].actor).toBe('editor')
    expect(state.applications[0].status).toBe('received')
    expect(canRecruitmentTransition('editor', 'shortlisted', 'rejected')).toBe(false)
    expect(() =>
      moveApplication(shortlist, ['application-1'], 'rejected', 'editor', 'Motif de test.', at),
    ).toThrow()
    const rejected = moveApplication(
      shortlist,
      ['application-1'],
      'rejected',
      'admin',
      'Critère professionnel non satisfait.',
      at,
    )
    expect(canRecruitmentTransition('editor', 'rejected', 'screening')).toBe(false)
    expect(
      moveApplication(
        rejected,
        ['application-1'],
        'screening',
        'admin',
        'Nouvelle revue humaine.',
        at,
      ).applications[0].status,
    ).toBe('screening')
  })
  it('requires actual local offer references and an initial received stage', () => {
    const { candidate } = dossier()
    const response = {
      ...newApplication('offer-response', candidate.id, 'offer', at),
      offerId: 'local-offer',
    }
    expect(() => saveApplication(emptyRecruitment(), candidate, response, 'editor', at)).toThrow(
      'Offre locale',
    )
    expect(
      saveApplication(emptyRecruitment(), candidate, response, 'editor', at, ['local-offer'])
        .applications,
    ).toHaveLength(1)
    expect(() =>
      saveApplication(
        emptyRecruitment(),
        candidate,
        { ...response, status: 'accepted' },
        'admin',
        at,
        ['local-offer'],
      ),
    ).toThrow('Reçue')
    const state = saveApplication(emptyRecruitment(), candidate, response, 'editor', at, [
      'local-offer',
    ])
    expect(() =>
      saveApplication(state, candidate, { ...response, id: 'duplicate' }, 'editor', at, [
        'local-offer',
      ]),
    ).toThrow('déjà un dossier')
  })
  it('supports internship categories and a shared candidate profile without fabricating submissions', () => {
    const { state, candidate } = dossier()
    const internship = {
      ...newApplication('internship', candidate.id, 'internship', at),
      internshipType: 'pfe',
      durationMonths: 4,
    }
    const next = saveApplication(state, candidate, internship, 'editor', at)
    expect(next.candidates).toHaveLength(1)
    expect(next.applications).toHaveLength(2)
    expect(next.applications[1].history[0].action).toBe('Dossier créé')
    expect(() =>
      saveApplication(state, candidate, { ...internship, internshipType: '' }, 'editor', at),
    ).toThrow('type de stage')
    expect(() =>
      saveApplication(
        state,
        candidate,
        { ...internship, availableFrom: '2026-02-30' },
        'editor',
        at,
      ),
    ).toThrow('disponibilité')
    expect(() =>
      saveApplication(
        state,
        { ...candidate, id: 'second-profile' },
        newApplication('second-app', 'second-profile', 'spontaneous', at),
        'editor',
        at,
      ),
    ).toThrow('courriel')
  })
  it('applies batch decisions atomically and refuses direct status edits', () => {
    const { state, candidate, application } = dossier()
    expect(() =>
      moveApplication(
        state,
        [application.id, 'unknown'],
        'shortlisted',
        'admin',
        'Motif de test.',
        at,
      ),
    ).toThrow('existantes')
    expect(state.applications[0].status).toBe('received')
    expect(() =>
      saveApplication(state, candidate, { ...application, status: 'accepted' }, 'admin', at),
    ).toThrow('circuit de décision')
  })
  it('records human evaluations, interviews and notes in the application history', () => {
    const { state, application } = dossier()
    const evaluated = saveEvaluation(state, {
      id: 'evaluation',
      applicationId: application.id,
      criterion: 'Compétence professionnelle',
      rating: 4,
      comment: 'Justification de test.',
      actor: 'editor',
      at,
    })
    expect(evaluated.applications[0].history[0].action).toBe('Évaluation humaine')
    const scheduled = saveInterview(
      evaluated,
      {
        id: 'interview',
        applicationId: application.id,
        startAt: '2026-10-20T09:00:00Z',
        format: 'onsite',
        location: 'Lieu de test',
        interviewers: 'Évaluateur local',
        status: 'planned',
        notes: '',
      },
      'editor',
      at,
    )
    expect(scheduled.interviews).toHaveLength(1)
    expect(scheduled.applications[0].status).toBe('received')
    expect(scheduled.applications[0].history[0].action).toContain('Entretien planifié')
    expect(
      addRecruitmentNote(scheduled, application.id, 'Note de test.', 'admin', at).applications[0]
        .history[0].note,
    ).toBe('Note de test.')
    expect(() =>
      validateRecruitment({
        ...state,
        interviews: [{ ...scheduled.interviews[0], applicationId: 'missing' }],
      }),
    ).toThrow('liée introuvable')
  })
  it('keeps CV bytes outside the domain object and checks local file signatures and limits', async () => {
    const { state, candidate } = dossier()
    const pdf = new File(['%PDF-1.4\nLocal test document'], 'cv-local.pdf', {
      type: 'application/pdf',
    })
    const attached = await attachRecruitmentFile(state, candidate.id, 'cv', pdf, 'document', at)
    expect(attached.documents[0].mime).toBe('application/pdf')
    expect(JSON.stringify(attached)).not.toContain('%PDF-')
    await expect(
      attachRecruitmentFile(
        state,
        candidate.id,
        'cv',
        new File(['not a PDF'], 'fake.pdf'),
        'invalid',
        at,
      ),
    ).rejects.toThrow('reconnu')
    await expect(
      attachRecruitmentFile(
        state,
        candidate.id,
        'cv',
        new File([new Uint8Array(5_000_001)], 'large.pdf'),
        'large',
        at,
      ),
    ).rejects.toThrow('5 Mo')
  })
})
