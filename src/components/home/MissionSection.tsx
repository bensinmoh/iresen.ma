import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { homeMissions, homeMissionSectionId } from '@/lib/home-missions'
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
        <p className={styles.eyebrow}>
          <Image
            src="/brand/apex-leaf.svg"
            alt=""
            aria-hidden="true"
            width={1773}
            height={2870}
            unoptimized
          />
          <span>{t('eyebrow')}</span>
        </p>
        <h2 id={`${homeMissionSectionId}-heading`} className={styles.heading}>
          {sections(`${homeMissionSectionId}.title`)}
        </h2>
        <p className={styles.description}>{sections(`${homeMissionSectionId}.description`)}</p>
      </div>
      <div className={styles.cards}>
        {homeMissions.map((mission) => {
          const image = missionImages[mission.id]

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
                  sizes="(max-width: 47.999rem) calc(100vw - 2.5rem), (max-width: 63.999rem) 45vw, (min-width: 128rem) 37rem, 31vw"
                  quality={90}
                />
              </div>
              <div className={styles.body}>
                <h3 id={`${mission.anchor}-heading`}>{sections(`${mission.anchor}.title`)}</h3>
                <p>{sections(`${mission.anchor}.description`)}</p>
                <a href={pageHref(mission.pageId, locale)} className={styles.link}>
                  <span>{t(`${mission.id}.link`)}</span>
                  <NavigationIcon name="arrow" />
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
