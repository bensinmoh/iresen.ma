import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { RoadmapAxisIcon } from '@/components/roadmap/RoadmapAxisIcon'
import { researchPlatforms } from '@/lib/platforms'
import { PageHero } from '@/components/hero/PageHero'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import styles from './PlatformsPage.module.css'

const themeIcons = {
  gep: [
    ['renewables', 0],
    ['buildings', 3],
    ['industry', 3],
    ['renewables', 1],
  ],
  gsbp: [
    ['buildings', 0],
    ['buildings', 1],
    ['renewables', 2],
    ['mobility', 1],
  ],
  'gep-mci': [
    ['renewables', 0],
    ['buildings', 3],
    ['water', 1],
    ['water', 0],
  ],
  greenh2a: [
    ['hydrogen', 0],
    ['hydrogen', 1],
    ['hydrogen', 2],
    ['hydrogen', 3],
  ],
} as const

export async function PlatformsPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Platforms' })
  const home = await getTranslations({ locale, namespace: 'HomePlatforms' })
  const intro = t.raw('intro.paragraphs') as string[]
  return (
    <div className={styles.page} data-platforms-page>
      <PageHero
        pageId="platforms"
        locale={locale}
        title={t('title')}
        lead={t('lead')}
        description={t('description')}
        primaryAction={{ label: t('discover'), href: '#green-energy-park' }}
      />
      <div id="page-sections">
        <section
          id="choose-by-need"
          className={`container ${styles.intro}`}
          aria-labelledby="platform-intro-title"
        >
          <header className={styles.introHeading}>
            <div>
              <p className={styles.eyebrow}>
                <span aria-hidden="true" />
                {t('eyebrow')}
              </p>
              <h2 id="platform-intro-title">{t('intro.title')}</h2>
            </div>
            <div>
              {intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </header>
          <div className={styles.values}>
            {(['arrows-exchange', 'flask', 'chart-line'] as const).map((icon, i) => (
              <article key={icon}>
                <ValorisationIcon name={icon} />
                <h3>{t(`intro.values.${i}.title`)}</h3>
                <p>{t(`intro.values.${i}.description`)}</p>
              </article>
            ))}
          </div>
          <p className={styles.accessNote}>{t('accessNote')}</p>
        </section>
        <div id="platform-network">
          {researchPlatforms.map((platform, index) => {
            const { id, anchor, url, infrastructureCount } = platform
            const paragraphs = t.raw(`platforms.${id}.paragraphs`) as string[]
            const themes = t.raw(`platforms.${id}.themes`) as string[]
            const development = id === 'greenh2a'
            return (
              <section
                key={id}
                id={anchor}
                className={`${styles.chapter} ${index % 2 ? styles.tinted : ''} ${development ? styles.development : ''}`}
                aria-labelledby={`${anchor}-title`}
                data-platform={id}
              >
                {id === 'gsbp' && <span id="testing-demonstration" className={styles.anchor} />}
                <div className="container">
                  <div className={`${styles.feature} ${index % 2 ? styles.reverse : ''}`}>
                    <figure className={styles.photograph}>
                      <Image
                        src={`/images/platforms/${id}.webp`}
                        alt={t(`imageAlt.${id}`)}
                        width={platform.width}
                        height={platform.height}
                        sizes="(max-width: 63.999rem) 94vw, (min-width: 128rem) 60rem, 49vw"
                      />
                      <figcaption>
                        {development ? t('visualization') : home(`platforms.${id}.name`)}
                      </figcaption>
                    </figure>
                    <div className={styles.copy}>
                      <header className={styles.chapterHeading}>
                        <div>
                          <h2 id={`${anchor}-title`}>
                            <bdi>{t(`platforms.${id}.name`)}</bdi>
                          </h2>
                          <p className={styles.location}>{t(`platforms.${id}.location`)}</p>
                        </div>
                        <Image
                          className={styles.logo}
                          src={platform.logoSrc}
                          alt=""
                          width={platform.logoWidth}
                          height={platform.logoHeight}
                        />
                      </header>
                      {development && <p className={styles.status}>{t('development')}</p>}
                      <h3 className={styles.lead}>{t(`platforms.${id}.lead`)}</h3>
                      <ul className={styles.themes} aria-label={t('themesLabel')} tabIndex={0}>
                        {themes.map((theme, i) => (
                          <li key={theme}>
                            <RoadmapAxisIcon
                              theme={themeIcons[id][i]![0]}
                              axis={themeIcons[id][i]![1]}
                            />
                            <span>{theme}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={styles.prose}>
                        <div className={styles.fullCopy}>
                          {paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                        <div className={styles.compactCopy}>
                          <p className={styles.tabletSummary}>{t(`platforms.${id}.compact`)}</p>
                          <p className={styles.mobileSummary}>{t(`platforms.${id}.mobile`)}</p>
                          <details>
                            <summary>{t('readDetails')}</summary>
                            {paragraphs.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </details>
                        </div>
                      </div>
                      {url && (
                        <a className="button button-primary" href={url}>
                          {t(`platforms.${id}.action`)}
                          <NavigationIcon name="arrow" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className={styles.infrastructure}>
                    <p
                      className={styles.infrastructureLabel}
                      id={id === 'gep' ? 'capabilities-availability' : undefined}
                    >
                      {t(development ? 'developmentLabel' : 'infrastructureLabel')}
                    </p>
                    <div
                      className={`${styles.infrastructureGrid} ${infrastructureCount === 4 ? styles.four : ''}`}
                    >
                      {Array.from({ length: infrastructureCount }, (_, i) => (
                        <article key={i}>
                          <div
                            className={styles.infrastructurePhoto}
                            aria-label={t('photoPending', {
                              title: t(`platforms.${id}.infrastructure.${i}.title`),
                            })}
                            role="img"
                          >
                            <ValorisationIcon
                              name={(['flask', 'bulb', 'chart-line', 'search'] as const)[i]!}
                            />
                            <span>{t('photoPendingLabel')}</span>
                          </div>
                          <h3>{t(`platforms.${id}.infrastructure.${i}.title`)}</h3>
                          <p>{t(`platforms.${id}.infrastructure.${i}.description`)}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>
        <section
          id="access-platforms"
          className={styles.network}
          aria-labelledby="platform-network-title"
        >
          <span id="projects-resources" className={styles.anchor} />
          <div className={`container ${styles.networkInner}`}>
            <div>
              <h2 id="platform-network-title">{t('network.title')}</h2>
              <p>{t('network.description')}</p>
            </div>
            <a className="button button-primary" href={pageHref('network', locale)}>
              {t('network.action')}
              <NavigationIcon name="arrow" />
            </a>
          </div>
        </section>
        <div className="container">
          <PublishedPageContent pageId="platforms" locale={locale} />
        </div>
      </div>
    </div>
  )
}
