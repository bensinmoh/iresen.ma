import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import Image from 'next/image'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { findCareerOffers } from '@/lib/content/careers'
import { type CareerOffer } from '@/lib/careers'
import { collaborationCount } from '@/lib/home-collaboration'
import { homeFigures } from '@/lib/figures'
import { CareersApplications } from './CareersApplications'
import styles from './CareersPage.module.css'
import { CareersIcon } from './CareersIcon'

export async function CareersPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Careers' })
  let offers: CareerOffer[] = []
  let unavailable = false
  try {
    offers = await findCareerOffers(locale)
  } catch {
    unavailable = true
  }
  const features = t.raw('environment.features') as { title: string; description: string }[]
  const projects = homeFigures.find((figure) => figure.id === 'collaborativeProjects')!.value
  return (
    <div className={styles.page} data-careers-page>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src="/images/careers/hero.webp"
          alt=""
          fill
          unoptimized
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
                src="/images/careers/environment.webp"
                alt={t('photos.environment')}
                fill
                unoptimized
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
                  ['ISO 9001:2015', t('environment.certified')],
                  [collaborationCount, t('environment.collaborators')],
                  [projects, t('environment.projects')],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
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
