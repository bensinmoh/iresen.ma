import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { governanceDepartments, governanceTeamLinkedin } from '@/lib/governance'
import { samirCutout, samirBiographies } from '@/lib/samir-biography'
import { TeamBiography } from './TeamBiography'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import styles from './GovernanceDiagrams.module.css'

export async function GovernanceDiagram({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Governance.diagrams' })
  return (
    <figure className={styles.governance} aria-labelledby="governance-mission-title">
      <div className={styles.flow}>
        <section className={styles.framework} aria-labelledby="governance-framework-title">
          <h4 id="governance-framework-title" className={styles.stage}>
            {t('columns.0')}
          </h4>
          <ul>
            {[0, 1, 2].map((i) => (
              <li key={i}>
                <strong>{t(`framework.${i}.title`)}</strong>
                <p>{t(`framework.${i}.description`)}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.decision} aria-labelledby="governance-decision-title">
          <h4 id="governance-decision-title" className={styles.stage}>
            {t('columns.1')}
          </h4>
          <div className={styles.boardNode}>
            <h5>{t('board')}</h5>
            <p>{t('chair')}</p>
          </div>
          <p className={styles.decisionText}>{t('decision')}</p>
        </section>
        <section className={styles.oversight} aria-labelledby="governance-monitoring-title">
          <h4 id="governance-monitoring-title" className={styles.stage}>
            {t('columns.2')}
          </h4>
          <ul>
            {[0, 1, 2, 3].map((i) => (
              <li key={i}>
                <strong>{t(`oversight.${i}.title`)}</strong>
                <p>{t(`oversight.${i}.description`)}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className={styles.execution} aria-labelledby="governance-execution-title">
          <h4 id="governance-execution-title" className={styles.stage}>
            {t('columns.3')}
          </h4>
          <div>
            <ValorisationIcon name="arrows-exchange" />
            <h5>{t('execution')}</h5>
            <p>{t('executionDescription')}</p>
          </div>
        </section>
      </div>
    </figure>
  )
}

export async function OrganisationDiagram({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Governance' })
  return (
    <figure className={styles.organisation} aria-labelledby="organisation-title">
      <div className={styles.general}>
        <div className={styles.generalCard}>
          <TeamBiography
            id="team-member-samir"
            diagram
            name={t('directorGeneralName')}
            role={t('directorGeneral')}
            photo={samirCutout}
            biographyPhoto={samirCutout}
            biographyFullWidth
            portraitAlt={t('portrait', { name: t('directorGeneralName') })}
            paragraphs={samirBiographies[locale].paragraphs}
            linkedin={governanceTeamLinkedin.samir}
            biographyLabel={t('biography.label')}
            linkedinLabel={t('biography.linkedin')}
            closeLabel={t('biography.close')}
          />
        </div>
      </div>
      <div id="department-responsibilities" className={styles.branches}>
        {[1, 0, 2].map((pole) => (
          <section
            key={pole}
            className={styles.branch}
            aria-labelledby={`organisation-pole-${pole}`}
          >
            <h4 id={`organisation-pole-${pole}`}>
              <ValorisationIcon name={pole === 1 ? 'flask' : pole === 0 ? 'rocket' : 'bulb'} />
              {t(`organisation.poles.${pole}.title`)}
            </h4>
            <ul>
              {(pole === 1 ? [1, 0] : pole === 0 ? [0, 1, 2] : [0, 1]).map((i) => {
                const person = governanceDepartments[pole][i]
                return (
                  <li key={i}>
                    <TeamBiography
                      id={
                        person === 'samir'
                          ? 'team-member-samir-scientific'
                          : `team-member-${person}`
                      }
                      diagram
                      name={t(`team.${person}.name`)}
                      role={t(`team.${person}.role`)}
                      photo={
                        person === 'samir'
                          ? samirCutout
                          : `/images/governance/${person}-portrait.png`
                      }
                      biographyPhoto={
                        person === 'samir'
                          ? samirCutout
                          : `/images/governance/${person}-portrait.png`
                      }
                      biographyFullWidth={person === 'samir'}
                      portraitAlt={t('portrait', { name: t(`team.${person}.name`) })}
                      paragraphs={
                        person === 'samir'
                          ? samirBiographies[locale].paragraphs
                          : t(`team.${person}.biography`).split('\n\n')
                      }
                      linkedin={governanceTeamLinkedin[person] ?? undefined}
                      biographyLabel={t('biography.label')}
                      linkedinLabel={t('biography.linkedin')}
                      closeLabel={t('biography.close')}
                    />
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </figure>
  )
}
