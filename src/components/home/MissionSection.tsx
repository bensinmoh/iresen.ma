import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import {
  homeMissions,
  homeMissionSectionId,
  homeCooperationAnchor,
  legacyMissionAnchors,
} from '@/lib/home-missions'
import { missionImages } from '@/lib/mission-images'
import { pageHref } from '@/lib/site'
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
          <span className={styles.quoteMark} aria-hidden="true">
            {t('openQuote')}
          </span>
          <p>
            {sections(`${homeMissionSectionId}.description`)}
            <span className={styles.closeQuote} aria-hidden="true">
              {t('closeQuote')}
            </span>
          </p>
        </blockquote>
      </div>
      <div
        className={`${styles.cards} horizontal-scroll`}
        data-mission-cards
        role="region"
        aria-label={t('domainsLabel')}
        tabIndex={0}
      >
        {homeMissions.map((mission) => {
          const image = missionImages[mission.imageId]

          return (
            <article
              key={mission.id}
              id={mission.anchor}
              aria-labelledby={`${mission.anchor}-heading`}
              className={styles.card}
              data-mission={mission.id}
            >
              <div className={styles.photo}>
                <Image
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt={t(`${mission.id}.imageAlt`)}
                  sizes="(max-width: 47.999rem) 140vw, (max-width: 63.999rem) 94vw, (min-width: 128rem) 62rem, 52vw"
                  quality={90}
                />
              </div>
              <div className={styles.body}>
                {mission.id === 'research' &&
                  legacyMissionAnchors.map((id) => (
                    <span key={id} id={id} className={styles.legacyAnchor} aria-hidden="true" />
                  ))}
                <p className={styles.purpose}>{t(`${mission.id}.purpose`)}</p>
                <h3 id={`${mission.anchor}-heading`}>{sections(`${mission.anchor}.title`)}</h3>
                {mission.id === 'research' && <p className={styles.functions}>{t('functions')}</p>}
                <p>{sections(`${mission.anchor}.description`)}</p>
                <a
                  href={pageHref(mission.pageId, locale, mission.destinationAnchor)}
                  className={styles.link}
                >
                  <span>{t(`${mission.id}.link`)}</span>
                  <NavigationIcon name="arrow" />
                </a>
              </div>
            </article>
          )
        })}
      </div>
      <aside
        id={homeCooperationAnchor}
        aria-labelledby={`${homeCooperationAnchor}-heading`}
        className={styles.cooperation}
      >
        <h3 id={`${homeCooperationAnchor}-heading`}>
          {sections(`${homeCooperationAnchor}.title`)}
        </h3>
        <p>{sections(`${homeCooperationAnchor}.description`)}</p>
        <a href={pageHref('workWithUs', locale)} className={styles.link}>
          <span>{t('cooperation.link')}</span>
          <NavigationIcon name="arrow" />
        </a>
      </aside>
    </section>
  )
}
