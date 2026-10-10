import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { homePlatforms, homePlatformsSectionId } from '@/lib/home-platforms'
import { pageHref } from '@/lib/site'
import { PlatformCard } from './PlatformCard'
import { PlatformNetworkIcon } from './PlatformNetworkIcon'
import styles from './PlatformsSection.module.css'

export async function PlatformsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'HomePlatforms' })
  return (
    <section
      id={homePlatformsSectionId}
      aria-labelledby="platforms-heading"
      className={styles.section}
    >
      <div className={styles.background} aria-hidden="true">
        <Image src="/images/platforms/outdoor.webp" alt="" fill sizes="100vw" />
      </div>
      <div className={styles.layout}>
        <header className={styles.introduction}>
          <p className={styles.eyebrow}>
            <Image src="/brand/apex-leaf.svg" alt="" width={1773} height={2870} unoptimized />
            <span>{t('eyebrow')}</span>
          </p>
          <h2 id="platforms-heading">{t('title')}</h2>
          <div className={styles.context}>
            <p>{t('description')}</p>
            <nav aria-label={t('navigation')} className={styles.destinations}>
              <a href={pageHref('platforms', locale)}>
                {t('platformsLink')} <NavigationIcon name="arrow" />
              </a>
              <a href={pageHref('network', locale)}>
                {t('expertiseLink')} <NavigationIcon name="arrow" />
              </a>
            </nav>
          </div>
        </header>
        <div className={styles.cards}>
          {homePlatforms.map((platform) => (
            <PlatformCard key={platform.id} id={`platform-${platform.id}`} className={styles.card}>
              <a
                className={styles.cardDestination}
                href={pageHref('platforms', locale)}
                aria-label={`${t('cardLink')} — ${t(`platforms.${platform.id}.name`)}`}
              >
                <div className={styles.visual}>
                  <Image
                    className={styles.photo}
                    src={`/images/platforms/${platform.id}.webp`}
                    alt={t(`platforms.${platform.id}.imageDescription`)}
                    width={platform.width}
                    height={platform.height}
                    sizes="(max-width: 39.999rem) 94vw, (max-width: 69.999rem) 46vw, (min-width: 128rem) 34rem, 29vw"
                  />
                </div>
                <div className={styles.body}>
                  <div className={styles.identity}>
                    <p className={styles.category}>{t(`platforms.${platform.id}.category`)}</p>
                    <Image
                      className={styles.logo}
                      src={`/brand/platforms/${platform.id}.svg`}
                      alt=""
                      aria-hidden="true"
                      width={platform.logoWidth}
                      height={platform.logoHeight}
                      unoptimized
                    />
                  </div>
                  <div className={styles.summary}>
                    <h3 id={`platform-${platform.id}-heading`}>
                      <bdi>{t(`platforms.${platform.id}.name`)}</bdi>
                    </h3>
                    <div className={styles.details} data-platform-details>
                      <p className={styles.description}>
                        {t(`platforms.${platform.id}.description`)}
                      </p>
                      <span className={styles.link}>
                        {t('cardLink')} <NavigationIcon name="arrow" />
                      </span>
                      {platform.id === 'greenh2a' && (
                        <p className={styles.visualLabel}>{t('visualization')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </PlatformCard>
          ))}
        </div>
      </div>
      <div className={styles.network}>
        {(['laboratories', 'expertise'] as const).map((id) => (
          <article
            key={id}
            id={`platform-network-${id}`}
            aria-labelledby={`platform-network-${id}-heading`}
          >
            <div className={styles.networkIcon}>
              <PlatformNetworkIcon kind={id} />
            </div>
            <div className={styles.networkCopy}>
              <h3 id={`platform-network-${id}-heading`}>
                <a href={pageHref('network', locale)}>
                  <span>{t(`network.${id}.title`)}</span> <NavigationIcon name="arrow" />
                </a>
              </h3>
              <p>{t(`network.${id}.description`)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
