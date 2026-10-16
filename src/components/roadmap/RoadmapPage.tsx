import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import {
  roadmapDomains,
  roadmapDimensions,
  roadmapMediaPath,
  roadmapDrawingPath,
  roadmapHeroPath,
} from '@/lib/roadmap'
import { HeroViewport } from '@/components/hero/HeroViewport'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { RoadmapMotion } from './RoadmapMotion'
import { RoadmapAxisIcon } from './RoadmapAxisIcon'
import styles from './RoadmapPage.module.css'

export async function RoadmapPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Roadmap' })
  return (
    <div data-roadmap-page>
      <HeroViewport className={`page-hero ${styles.hero}`}>
        <div className={styles.heroArtwork} aria-hidden="true">
          <Image src={roadmapHeroPath} alt="" fill priority quality={90} sizes="100vw" />
        </div>
        <div className={styles.shade} />
        <div className={`container ${styles.heroContent}`}>
          <SectionEyebrow tone="white">{t('eyebrow')}</SectionEyebrow>
          <h1 id="hero-title">{t('title')}</h1>
          <p className={styles.tagline}>{t('tagline')}</p>
          <p className={styles.introduction}>{t('description')}</p>
          <div className={styles.actions}>
            <a className="button button-primary" href="#theme-renewables">
              {t('explore')}
              <NavigationIcon name="chevron" />
            </a>
            <a data-ui-link className={styles.secondary} href={pageHref('programmes', locale)}>
              {t('programmes')}
              <NavigationIcon name="arrow" />
            </a>
          </div>
        </div>
      </HeroViewport>
      <div id="page-sections">
        <section
          id="needs-challenges"
          className={`container ${styles.strategy}`}
          aria-labelledby="strategy-title"
        >
          <span id="technology-roadmaps" className={styles.anchor} />
          <div className={styles.strategyIntro}>
            <Heading as="h2" size="section" id="strategy-title">
              {t('introductionTitle')}
            </Heading>
            <div>
              {[0, 1].map((index) => (
                <p key={index}>{t(`introductionParagraphs.${index}`)}</p>
              ))}
            </div>
          </div>
          <ol className={styles.steps}>
            {[0, 1, 2].map((index) => (
              <li key={index}>
                <Heading as="h3" size="card">
                  {t(`steps.${index}.title`)}
                </Heading>
                <p>{t(`steps.${index}.description`)}</p>
              </li>
            ))}
          </ol>
          <span id="decision-resources" className={styles.anchor} />
        </section>
        <RoadmapMotion>
          <div id="domains-directions">
            {roadmapDomains.map((id, index) => (
              <section
                key={id}
                id={`theme-${id}`}
                data-roadmap-domain={id}
                className={`${styles.panel} ${styles[id]}`}
                aria-labelledby={`theme-${id}-title`}
              >
                <div className={styles.stage}>
                  <div className={`container ${styles.scene}`} data-scene-content>
                    <header className={styles.copy}>
                      <p className={styles.label}>
                        {t('theme')} <bdi>{String(index + 1).padStart(2, '0')}</bdi>
                      </p>
                      <div className={styles.titleFrame}>
                        <Heading as="h2" size="display" id={`theme-${id}-title`}>
                          {t(`chapters.${id}.title`)}
                        </Heading>
                      </div>
                      <p className={styles.headline}>{t(`chapters.${id}.headline`)}</p>
                    </header>
                    <figure className={styles.artwork}>
                      <div className={styles.imageLayers}>
                        <Image
                          src={roadmapMediaPath(id)}
                          alt={t(`chapters.${id}.imageAlt`)}
                          width={roadmapDimensions[id].width}
                          height={roadmapDimensions[id].height}
                          sizes="(max-width: 63.99rem) 100vw, 55vw"
                          className={styles.original}
                        />
                        <Image
                          src={roadmapDrawingPath(id)}
                          alt=""
                          fill
                          sizes="(max-width: 63.99rem) 100vw, 55vw"
                          className={styles.drawing}
                        />
                      </div>
                      <figcaption className="sr-only">{t('imageNote')}</figcaption>
                    </figure>
                    <div className={styles.questions}>
                      <p className={styles.description}>{t(`chapters.${id}.description`)}</p>
                      <div className={styles.axes}>
                        <Heading as="h3" size="label">
                          {t('axes')}
                        </Heading>
                        {[0, 1, 2, 3].map((axis) => (
                          <details key={axis} className={styles.axis}>
                            <summary>
                              <span>{t(`chapters.${id}.axes.${axis}.title`)}</span>
                              <RoadmapAxisIcon theme={id} axis={axis} className={styles.axisIcon} />
                            </summary>
                            <p>{t(`chapters.${id}.axes.${axis}.description`)}</p>
                          </details>
                        ))}
                      </div>
                      <div className={styles.benefits}>
                        <Heading as="h3" size="label">
                          {t('benefitsLabel')}
                        </Heading>
                        <p>{t(`chapters.${id}.benefits`)}</p>
                      </div>
                    </div>
                    <div className={styles.chapterFooter}>
                      <span aria-hidden="true">
                        <bdi>{String(index + 1).padStart(2, '0')} / 07</bdi>
                      </span>
                      {index < roadmapDomains.length - 1 && (
                        <a href={`#theme-${roadmapDomains[index + 1]}`}>
                          {t('next')}
                          <NavigationIcon name="chevron" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </RoadmapMotion>
        <section
          id="resources-collaboration"
          className={`container ${styles.collaboration}`}
          aria-labelledby="collaboration-title"
        >
          <span id="priorities-projects" className={styles.anchor} />
          <Heading as="h2" size="section" id="collaboration-title">
            {t('collaborationTitle')}
          </Heading>
          {[0, 1].map((index) => (
            <p key={index}>{t(`collaborationParagraphs.${index}`)}</p>
          ))}
          <div className={styles.actions}>
            <a className="button button-primary" href={pageHref('workWithUs', locale)}>
              {t('collaboration')}
              <NavigationIcon name="arrow" />
            </a>
            <a data-ui-link className={styles.secondary} href={pageHref('projects', locale)}>
              {t('projects')}
              <NavigationIcon name="arrow" />
            </a>
          </div>
        </section>
        <div className="container">
          <PublishedPageContent pageId="priorities" locale={locale} />
        </div>
      </div>
    </div>
  )
}
