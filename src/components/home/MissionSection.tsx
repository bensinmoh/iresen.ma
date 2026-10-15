import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { IntegratedModel } from '@/components/narrative/IntegratedModel'
import { homeMissionSectionId } from '@/lib/home-missions'
import styles from './MissionSection.module.css'

export async function MissionSection({ locale }: { locale: Locale }) {
  const [sections, t] = await Promise.all([
    getTranslations({ locale, namespace: 'PageSections.home' }),
    getTranslations({ locale, namespace: 'HomeMissions' }),
  ])

  return (
    <section
      id={homeMissionSectionId}
      aria-labelledby={`${homeMissionSectionId}-heading`}
      className={styles.section}
    >
      <div className={styles.introduction}>
        <SectionEyebrow id={`${homeMissionSectionId}-heading`} centered>
          {t('eyebrow')}
        </SectionEyebrow>
        <blockquote className={styles.statement}>
          <p>
            <span className={styles.quoteMark} aria-hidden="true">
              {t('openQuote')}
            </span>
            {locale === 'fr' ? '\u202f' : ''}
            {sections(`${homeMissionSectionId}.description`)}
            {locale === 'fr' ? '\u202f' : ''}
            <span className={styles.quoteMark} aria-hidden="true">
              {t('closeQuote')}
            </span>
          </p>
        </blockquote>
      </div>
      <IntegratedModel locale={locale} prefix="mission" />
    </section>
  )
}
