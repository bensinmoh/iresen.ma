'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/locales'
import { type ProjectRecord, projectNoteHref } from '@/lib/projects-model'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './ProjectsPage.module.css'

export function ProjectDetail({ project, locale }: { project: ProjectRecord; locale: Locale }) {
  const t = useTranslations('Projects')
  const contact = project.details.coordinator
  const metadata = [
    [t('acronym'), project.acronym],
    [t('launch'), project.startText[locale]],
    [t('programme'), project.programme],
    [t('status'), project.status ? t(`statuses.${project.status}`) : ''],
    [t('hostingPlatform'), project.details.hostingPlatform[locale]],
    [t('location'), project.location[locale]],
    [
      t('duration'),
      project.durationMonths === null ? '' : t('months', { count: project.durationMonths }),
    ],
    [
      t('budget'),
      project.budgetMAD === null
        ? ''
        : `${new Intl.NumberFormat(locale).format(project.budgetMAD)} MAD`,
    ],
  ].filter(([, value]) => value)
  return (
    <>
      {project.image && (
        <Image
          src={`${project.image}?locale=${locale}`}
          alt={project.imageIllustration || ''}
          width={900}
          height={430}
          unoptimized
          className={styles.detailPhoto}
        />
      )}
      <div className={styles.drawerBody}>
        <p className={styles.detailDomain}>{project.theme[locale]}</p>
        <h3 data-ui-heading="card" className={styles.drawerTitle}>
          {project.title[locale]}
        </h3>
        <div className={styles.detailSummary}>
          {project.details.presentation[locale].map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
        <dl className={styles.detailMetadata}>
          {metadata.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                <bdi>{value}</bdi>
              </dd>
            </div>
          ))}
        </dl>
        {contact.name[locale] && (
          <section className={styles.detailSection} aria-labelledby={`coordinator-${project.id}`}>
            <h3 data-ui-heading="compact" id={`coordinator-${project.id}`}>
              {t('coordinator')}
            </h3>
            <div className={styles.projectContact}>
              {contact.portrait && (
                <Image
                  src={`${contact.portrait}?locale=${locale}`}
                  alt=""
                  width={96}
                  height={96}
                  unoptimized
                />
              )}
              <div>
                <p className={styles.contactName}>
                  <bdi>{contact.name[locale]}</bdi>
                </p>
                {contact.affiliation[locale] && <p>{contact.affiliation[locale]}</p>}
                {contact.email && (
                  <a href={`mailto:${contact.email}`}>
                    <bdi>{contact.email}</bdi>
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
        {project.details.consortium[locale].length > 0 && (
          <section className={styles.detailSection} aria-labelledby={`consortium-${project.id}`}>
            <h3 data-ui-heading="compact" id={`consortium-${project.id}`}>
              {t('consortium')}
            </h3>
            {project.details.consortium[locale].map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </section>
        )}
        {project.details.objectives[locale].length > 0 && (
          <section className={styles.detailSection} aria-labelledby={`objectives-${project.id}`}>
            <h3 data-ui-heading="compact" id={`objectives-${project.id}`}>
              {t('objectives')}
            </h3>
            <ul className={styles.objectives}>
              {project.details.objectives[locale].map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </section>
        )}
        <div className={styles.detailActions}>
          {contact.email && (
            <a
              className="button button-primary"
              href={`mailto:${contact.email}?subject=${encodeURIComponent(t('contactSubject', { name: project.acronym }))}`}
            >
              {t('contactCoordinator')}
              <NavigationIcon name="arrow" />
            </a>
          )}
          {project.noteAvailable && (
            <a
              data-ui-link
              href={projectNoteHref(project.id, locale)}
              type="application/pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('sourceLink')}
              <NavigationIcon name="arrow" />
            </a>
          )}
        </div>
      </div>
    </>
  )
}
