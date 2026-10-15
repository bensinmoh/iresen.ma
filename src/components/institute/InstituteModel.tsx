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
            <div className={styles.core}>
              <ValorisationIcon name="flask" />
              <p>{t('coreLabel')}</p>
              <h3 id="institute-model-research-title">{t('coreTitle')}</h3>
              <p className={styles.description}>{t('coreDescription')}</p>
            </div>
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
