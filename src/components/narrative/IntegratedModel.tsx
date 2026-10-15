import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import {
  researchMissions,
  complementaryDimensions,
  sharedCapabilities,
} from '@/lib/institutional-narrative'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import styles from './Narrative.module.css'

export async function IntegratedModel({
  locale,
  prefix,
  detailed = false,
}: {
  locale: Locale
  prefix: 'mission' | 'institute-model'
  detailed?: boolean
}) {
  const t = await getTranslations({ locale, namespace: 'Narrative' })
  return (
    <div className={styles.model} data-integrated-model>
      <article
        id={`${prefix}-research`}
        className={styles.core}
        data-mission="research"
        aria-labelledby={`${prefix}-research-title`}
      >
        <header>
          <SectionEyebrow tone="cyan">{t('coreLabel')}</SectionEyebrow>
          <h2 id={`${prefix}-research-title`}>{t('coreTitle')}</h2>
          <p>{t('coreDescription')}</p>
        </header>
        <div className={styles.missions}>
          {researchMissions.map(({ id, legacyAnchor, pageId }, index) => (
            <article id={prefix === 'mission' ? legacyAnchor : `${prefix}-${id}`} key={id}>
              <ValorisationIcon name={(['bulb', 'flask', 'arrows-exchange'] as const)[index]} />
              <h3>{t(`missions.${id}.title`)}</h3>
              <p>{t(`missions.${id}.description`)}</p>
              <a href={pageHref(pageId, locale)}>
                {t(`missions.${id}.action`)}
                <NavigationIcon name="arrow" />
              </a>
            </article>
          ))}
        </div>
      </article>
      <p className={styles.dimensionLabel}>{t('dimensionsLabel')}</p>
      <div className={styles.dimensions} data-mission-cards>
        {complementaryDimensions.map(({ id, pageId, anchor }, index) => (
          <article
            id={`${prefix}-${id}`}
            key={id}
            data-mission={id}
            aria-labelledby={`${prefix}-${id}-title`}
          >
            <ValorisationIcon name={(['chart-line', 'bulb', 'arrows-exchange'] as const)[index]} />
            <h3 id={`${prefix}-${id}-title`}>{t(`dimensions.${id}.title`)}</h3>
            <p>{t(`dimensions.${id}.description`)}</p>
            <a href={pageHref(pageId, locale, anchor)}>
              {t(`dimensions.${id}.action`)}
              <NavigationIcon name="arrow" />
            </a>
          </article>
        ))}
      </div>
      {detailed && (
        <div className={styles.capabilities}>
          <h3>{t('capabilitiesLabel')}</h3>
          <ul>
            {sharedCapabilities.map((id) => (
              <li key={id}>{t(`capabilities.${id}`)}</li>
            ))}
          </ul>
          <p>{t('capabilitiesNote')}</p>
        </div>
      )}
    </div>
  )
}
