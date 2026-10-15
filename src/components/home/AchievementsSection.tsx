import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { homeAchievements, homeAchievementsSectionId } from '@/lib/home-achievements'
import { AchievementsRail } from './AchievementsRail'
import styles from './AchievementsSection.module.css'

export async function AchievementsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'HomeAchievements' })
  const narrative = await getTranslations({ locale, namespace: 'Narrative' })
  return (
    <section
      id={homeAchievementsSectionId}
      aria-labelledby="achievements-heading"
      className={styles.section}
    >
      <header className={styles.header}>
        <div>
          <SectionEyebrow>{t('eyebrow')}</SectionEyebrow>
          <Heading as="h2" size="display" id="achievements-heading">
            {t('title')}
          </Heading>
        </div>
        <p className={styles.introduction}>{t('description')}</p>
      </header>
      <AchievementsRail label={t('label')} previous={t('previous')} next={t('next')}>
        {homeAchievements.map(({ id, width, height }) => (
          <li key={id} className={styles.card}>
            <article id={`achievement-${id}`} aria-labelledby={`achievement-${id}-heading`}>
              <div
                className={`${styles.visual} ${id === 'hydrogen-roadmap' ? styles.reports : ''}`}
              >
                {id === 'hydrogen-roadmap' && (
                  <>
                    <div className={styles.stackBottom} aria-hidden="true" />
                    <div className={styles.stackTop} aria-hidden="true" />
                  </>
                )}
                <Image
                  src={`/images/achievements/${id}.webp`}
                  alt={t(`items.${id}.imageDescription`)}
                  width={width}
                  height={height}
                  sizes="(max-width: 39.999rem) 85vw, (max-width: 69.999rem) 46vw, (min-width: 128rem) 28rem, 24vw"
                  className={id === 'hydrogen-roadmap' ? styles.reportCover : styles.photo}
                />
              </div>
              <p className={styles.category}>{t(`items.${id}.category`)}</p>
              <Heading as="h3" size="card" id={`achievement-${id}-heading`}>
                <bdi>{t(`items.${id}.name`)}</bdi>
              </Heading>
              <p className={styles.description}>{t(`items.${id}.description`)}</p>
              <details className={styles.proof}>
                <summary>{narrative('proofLabel')}</summary>
                <dl>
                  {(['need', 'contribution', 'result', 'scope'] as const).map((field) => (
                    <div key={field}>
                      <dt>{narrative(`proofFields.${field}`)}</dt>
                      <dd>{t(`items.${id}.proof.${field}`)}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            </article>
          </li>
        ))}
      </AchievementsRail>
    </section>
  )
}
