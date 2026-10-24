import { careersHeroPhoto } from '@/lib/careers-hero-photo'
import { careersEnvironmentPhoto } from '@/lib/careers-environment-photo'
import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import Image from 'next/image'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { findCareerOffers } from '@/lib/content/careers'
import { type CareerOffer } from '@/lib/careers'
import { siteEditorialIndicators } from '@/lib/cms-workspace/editorial-indicators'
import { totalProjects } from '@/lib/project-count'
import { CareersApplications } from './CareersApplications'
import styles from './CareersPage.module.css'
import { CareersIcon } from './CareersIcon'

export async function CareersPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Careers' })
  const indicators = await siteEditorialIndicators(locale)
  let offers: CareerOffer[] = []
  let unavailable = false
  try {
    offers = await findCareerOffers(locale)
  } catch {
    unavailable = true
  }
  const features = t.raw('environment.features') as { title: string; description: string }[]
  const projects = await totalProjects()
  return (
    <div className={styles.page} data-careers-page>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src={careersHeroPhoto.src}
          alt=""
          fill
          sizes="max(100vw, 150dvh)"
          loading="eager"
          fetchPriority="high"
          className={styles.heroPhoto}
        />
        <div className={styles.shade} />
        <div className={`container ${styles.heroContent}`}>
          <SectionEyebrow tone="white">{t('eyebrow')}</SectionEyebrow>
          <h1 id="hero-title">
            {t('titleStart')}
            <br />
            <span>{t('titleAccent')}</span> {t('titleEnd')}
          </h1>
          <a className="button button-primary" href="#open-opportunities">
            {t('offersAction')} <NavigationIcon name="chevron" />
          </a>
          <p className={styles.heroDescription}>{t('description')}</p>
        </div>
        <div className={styles.wordmark} aria-hidden="true" dir="ltr">
          <span className={styles.join}>{t('joinLabel')}</span>
          <span className={styles.heroLogo} />
        </div>
      </section>
      <div id="page-sections">
        <section
          id="working-at-iresen"
          className={styles.environment}
          aria-labelledby="environment-title"
        >
          <div className={`container ${styles.environmentGrid}`}>
            <div className={styles.environmentPhoto}>
              <Image
                src={careersEnvironmentPhoto.src}
                alt={careersEnvironmentPhoto.descriptions[locale]}
                fill
                sizes="(max-width: 63.999rem) 100vw, 50vw"
              />
            </div>
            <div className={styles.environmentCopy}>
              <header>
                <SectionEyebrow>{t('environment.eyebrow')}</SectionEyebrow>
                <Heading as="h2" size="section" id="environment-title">
                  {t('environment.title')}
                </Heading>
                <p>{t('environment.description')}</p>
              </header>
              <ul className={styles.features}>
                {features.map((feature, index) => (
                  <li key={feature.title}>
                    <span className={styles.featureIcon}>
                      <CareersIcon name={(['impact', 'equipment', 'ecosystem'] as const)[index]} />
                    </span>
                    <div>
                      <Heading as="h3" size="card">
                        {feature.title}
                      </Heading>
                      <p>{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className={styles.figures}>
                {[
                  [indicators.certification, t('environment.certified')],
                  [indicators.collaborators, t('environment.collaborators')],
                  [projects ?? '—', t('environment.projects')],
                ]
                  .filter(([value]) => value !== null)
                  .map(([value, label]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd
                        data-project-total={
                          label === t('environment.projects') ? (projects ?? undefined) : undefined
                        }
                      >
                        <bdi dir="ltr">{value}</bdi>
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          </div>
        </section>
        <CareersApplications locale={locale} offers={offers} unavailable={unavailable} />
      </div>
    </div>
  )
}
