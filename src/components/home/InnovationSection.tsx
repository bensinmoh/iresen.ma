import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { homeInnovationSectionId, innovationSteps } from '@/lib/home-innovation'
import { pageHref } from '@/lib/site'
import styles from './InnovationSection.module.css'

export async function InnovationSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'HomeInnovation' })
  return (
    <section
      id={homeInnovationSectionId}
      aria-labelledby="innovation-heading"
      className={styles.section}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t('eyebrow')}</p>
          <h2 id="innovation-heading">{t('title')}</h2>
        </div>
        <p className={styles.introduction}>{t('description')}</p>
      </header>
      <ol className={styles.steps}>
        {innovationSteps.map((id, index) => (
          <li key={id}>
            <div className={styles.marker}>
              <bdi dir="ltr">{String(index + 1).padStart(2, '0')}</bdi>
              {index < innovationSteps.length - 1 && <NavigationIcon name="arrow" />}
            </div>
            <h3>{t(`steps.${id}.title`)}</h3>
            <p>{t(`steps.${id}.description`)}</p>
          </li>
        ))}
      </ol>
      <div className={styles.footer}>
        <p className={styles.continuity}>
          <span>{t('support')}</span>
          <span>{t('feedback')}</span>
        </p>
        <a className={styles.link} href={pageHref('transfer', locale)}>
          {t('action')} <NavigationIcon name="arrow" />
        </a>
      </div>
    </section>
  )
}
