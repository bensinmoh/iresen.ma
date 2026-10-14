import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { IntegratedModel } from '@/components/narrative/IntegratedModel'
import { homeMissionSectionId } from '@/lib/home-missions'
import styles from './MissionSection.module.css'

export async function MissionSection({ locale }: { locale: Locale }) {
  const narrative = await getTranslations({ locale, namespace: 'Narrative' })
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
      <aside id="home-figures-context" className={styles.figureContext}>
        {narrative('figuresNote')}
      </aside>
      <div className={styles.introduction}>
        <h2 id={`${homeMissionSectionId}-heading`} className={styles.eyebrow}>
          <Image
            src="/brand/apex-leaf.svg"
            alt=""
            aria-hidden="true"
            width={1773}
            height={2870}
            unoptimized
          />
          <span>{t('eyebrow')}</span>
        </h2>
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
