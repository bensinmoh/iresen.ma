import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { homeAchievements, homeAchievementsSectionId } from '@/lib/home-achievements'
import { AchievementsRail } from './AchievementsRail'
import styles from './AchievementsSection.module.css'

export async function AchievementsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'HomeAchievements' })
  return (
    <section
      id={homeAchievementsSectionId}
      aria-labelledby="achievements-heading"
      className={styles.section}
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            <Image src="/brand/apex-leaf.svg" alt="" width={1773} height={2870} unoptimized />
            <span>{t('eyebrow')}</span>
          </p>
          <h2 id="achievements-heading">{t('title')}</h2>
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
              <h3 id={`achievement-${id}-heading`}>
                <bdi>{t(`items.${id}.name`)}</bdi>
              </h3>
              <p className={styles.description}>{t(`items.${id}.description`)}</p>
            </article>
          </li>
        ))}
      </AchievementsRail>
    </section>
  )
}
