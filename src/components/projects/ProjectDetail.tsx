'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/locales'
import { type ProjectRecord, projectNoteHref } from '@/lib/projects-model'
import styles from './ProjectsPage.module.css'

/** Existing record fields only; mail links create a local draft, never send it. */
export function ProjectDetail({ project, locale }: { project: ProjectRecord; locale: Locale }) {
  const t = useTranslations('Projects')
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
  const details = project.details
  const contact = details.coordinator
  const mail = `mailto:${contact.email}?subject=${encodeURIComponent(t('contactSubject', { name: project.acronym }))}`
  return (
    <>
      <Image
        src={`/images/projects/${project.image}.webp`}
        alt={t(`photos.${project.image}`)}
        width={900}
        height={430}
        unoptimized
        className={styles.detailPhoto}
      />
      <div className={styles.drawerBody}>
        <p className={styles.detailDomain}>{t(`domains.${project.domain}`)}</p>
        <h3 className={styles.drawerTitle}>{project.title[locale]}</h3>
        <div className={styles.detailSummary}>
          {details.presentation[locale].map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <dl className={styles.detailMetadata}>
          {[
            [t('acronym'), project.acronym],
            [t('launch'), String(project.year)],
            [t('duration'), t('months', { count: project.durationMonths })],
            [t('budget'), `${number.format(project.budgetMAD / 1000000)} MMAD`],
            [t('hostingPlatform'), details.hostingPlatform[locale]],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                <bdi>{value}</bdi>
              </dd>
            </div>
          ))}
          <div>
            <dt>{t('coordinator')}</dt>
            <dd className={styles.projectContact}>
              {contact.portrait ? (
                <Image src={contact.portrait} alt="" width={96} height={96} unoptimized />
              ) : (
                <svg
                  className={styles.contactIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
                </svg>
              )}
              <div>
                <p>{contact.name[locale]}</p>
                <a href={mail}>
                  <bdi>{contact.email}</bdi>
                </a>
                {contact.phone && (
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>
                    <bdi>{contact.phone}</bdi>
                  </a>
                )}
              </div>
            </dd>
          </div>
        </dl>
        <section className={styles.detailSection} aria-labelledby={`consortium-${project.id}`}>
          <h3 id={`consortium-${project.id}`}>{t('consortium')}</h3>
          <ul className={styles.consortium}>
            {details.consortium[locale].map((partner) => (
              <li key={partner}>{partner}</li>
            ))}
          </ul>
        </section>
        <section className={styles.detailSection} aria-labelledby={`objectives-${project.id}`}>
          <h3 id={`objectives-${project.id}`}>{t('objectives')}</h3>
          <ul className={styles.objectives}>
            {details.objectives[locale].map((objective) => (
              <li key={objective}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8 12 2.5 2.5L16 9" />
                </svg>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </section>
        <div className={styles.detailActions}>
          <a className="button button-primary" href={mail}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="1" />
              <path d="m3 5 9 7 9-7" />
            </svg>
            {t('contactCoordinator')}
          </a>
          <a
            className="button button-secondary"
            href={projectNoteHref(project.id, locale)}
            download
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M14 3H5v18h14V8Z M14 3v5h5 M12 11v6 m-3-3 3 3 3-3" />
            </svg>
            {t('downloadNote')}
          </a>
        </div>
      </div>
    </>
  )
}
