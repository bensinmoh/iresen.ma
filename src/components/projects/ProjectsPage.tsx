import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './ProjectsPage.module.css'

/** No placeholder records: real projects require a separately commissioned source. */
export async function ProjectsPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Projects' })
  return (
    <div className={styles.page} data-projects-page>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src="/images/projects/hero.webp"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className={styles.heroPhoto}
        />
        <div className={`container ${styles.heroContent}`}>
          <SectionEyebrow tone="white">{t('eyebrow')}</SectionEyebrow>
          <h1 id="hero-title">
            {t('titleStart')} <span>{t('titleAccent')}</span>
          </h1>
          <p className={styles.description}>{t('description')}</p>
        </div>
      </section>
      <div id="page-sections">
        <span id="featured-results" />
        <span id="find-project" />
        <section
          id="project-catalogue"
          className={`container ${styles.emptyCatalogue}`}
          aria-labelledby="projects-empty-title"
        >
          <Heading as="h2" size="section" id="projects-empty-title">
            {t('updatingTitle')}
          </Heading>
          <p>{t('updatingDescription')}</p>
          <a className="button button-primary" href={pageHref('programmes', locale)}>
            {t('programmesLink')}
            <NavigationIcon name="arrow" />
          </a>
        </section>
        <span id="understanding-results" />
        <span id="related-capabilities" />
      </div>
    </div>
  )
}
