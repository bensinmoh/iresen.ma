import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { homeInnovationSectionId, innovationSteps } from '@/lib/home-innovation'
import { pageHref } from '@/lib/site'
import { InnovationRail } from './InnovationRail'
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
          <SectionEyebrow>{t('eyebrow')}</SectionEyebrow>
          <Heading as="h2" size="section" id="innovation-heading">
            {t('title')}
          </Heading>
        </div>
        <p className={styles.introduction}>{t('description')}</p>
      </header>
      <InnovationRail label={t('label')}>
        {innovationSteps.map((id, index) => (
          <li key={id}>
            <div className={styles.marker}>
              <bdi dir="ltr">{String(index + 1).padStart(2, '0')}</bdi>
              {index < innovationSteps.length - 1 && <NavigationIcon name="arrow" />}
            </div>
            <Heading as="h3" size="compact">
              {t(`steps.${id}.title`)}
            </Heading>
            <p>{t(`steps.${id}.description`)}</p>
          </li>
        ))}
      </InnovationRail>
      <div className={styles.footer}>
        <p className={styles.continuity}>
          <span>{t('support')}</span>
          <span>{t('feedback')}</span>
        </p>
        <a data-ui-link className={styles.link} href={pageHref('transfer', locale)}>
          {t('action')} <NavigationIcon name="arrow" />
        </a>
      </div>
    </section>
  )
}
