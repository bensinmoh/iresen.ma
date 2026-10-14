import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import {
  researchMissions,
  complementaryDimensions,
  sharedCapabilities,
} from '@/lib/institutional-narrative'
import { pageHref } from '@/lib/site'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import styles from './InstituteModel.module.css'

export async function InstituteModel({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const t = await getTranslations({ locale, namespace: 'Narrative' })
  return (
    <div className={styles.model} data-integrated-model>
      <article
        id="institute-model-research"
        aria-labelledby="institute-model-research-title"
        data-mission="research"
      >
        <div className={styles.overview} data-institute-overview>
          <div className={styles.introduction}>{children}</div>
          <div className={styles.visual}>
            <div className={styles.diagram}>
              <svg viewBox="0 0 800 410" aria-hidden="true" className={styles.arc}>
                <path
                  d="M30 400 A370 370 0 0 1 770 400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 7"
                />
                <path
                  d="M50 400 A350 350 0 0 1 218 101 L288 224 A210 210 0 0 0 190 400 Z"
                  className={styles.develop}
                />
                <path
                  d="M232 93 A350 350 0 0 1 568 93 L498 216 A210 210 0 0 0 302 216 Z"
                  className={styles.test}
                />
                <path
                  d="M582 101 A350 350 0 0 1 750 400 L610 400 A210 210 0 0 0 512 224 Z"
                  className={styles.transfer}
                />
                <path d="M210 400 A190 190 0 0 1 590 400 Z" className={styles.center} />
              </svg>
              <div className={styles.core}>
                <ValorisationIcon name="flask" />
                <p>{t('coreLabel')}</p>
                <h3 id="institute-model-research-title">{t('coreTitle')}</h3>
              </div>
              {researchMissions.map(({ id }, i) => (
                <span key={id} className={`${styles.orbitLabel} ${styles[id]}`}>
                  <bdi>{String(i + 1).padStart(2, '0')}</bdi>
                  <strong>{t(`missions.${id}.title`)}</strong>
                </span>
              ))}
            </div>
            <p className={styles.description}>{t('coreDescription')}</p>
          </div>
        </div>
        <div className={styles.missions}>
          {researchMissions.map(({ id, pageId }, i) => (
            <article key={id} id={`institute-model-${id}`}>
              <div className={styles.missionHeading}>
                <ValorisationIcon name={(['bulb', 'flask', 'arrows-exchange'] as const)[i]} />
                <h4>{t(`missions.${id}.title`)}</h4>
              </div>
              <p>{t(`missions.${id}.description`)}</p>
              <a href={pageHref(pageId, locale)}>
                {t(`missions.${id}.action`)}
                <NavigationIcon name="arrow" />
              </a>
            </article>
          ))}
        </div>
      </article>
      <h3 className={styles.dimensionsTitle}>{t('dimensionsLabel')}</h3>
      <div className={styles.dimensions} data-mission-cards>
        {complementaryDimensions.map(({ id, pageId, anchor }, i) => (
          <article key={id} id={`institute-model-${id}`} data-mission={id}>
            <ValorisationIcon name={(['chart-line', 'bulb', 'arrows-exchange'] as const)[i]} />
            <h4>{t(`dimensions.${id}.title`)}</h4>
            <p>{t(`dimensions.${id}.description`)}</p>
            <a href={pageHref(pageId, locale, anchor)}>
              {t(`dimensions.${id}.action`)}
              <NavigationIcon name="arrow" />
            </a>
          </article>
        ))}
      </div>
      <aside className={styles.capabilities}>
        <h3>{t('capabilitiesLabel')}</h3>
        <ul>
          {sharedCapabilities.map((id) => (
            <li key={id}>{t(`capabilities.${id}`)}</li>
          ))}
        </ul>
        <p>{t('capabilitiesNote')}</p>
      </aside>
    </div>
  )
}
