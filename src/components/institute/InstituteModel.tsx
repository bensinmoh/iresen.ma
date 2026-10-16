import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import type { Locale } from '@/i18n/locales'
import { researchMissions, complementaryDimensions } from '@/lib/institutional-narrative'
import { pageHref } from '@/lib/site'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import { ResearchTabs } from './ResearchTabs'
import styles from './InstituteModel.module.css'

export async function InstituteModel({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Narrative' })
  const editorial = await getTranslations({ locale, namespace: 'Institute.editorial' })
  return (
    <section
      id="capabilities"
      className={styles.model}
      data-integrated-model
      aria-labelledby="missions-title"
    >
      <div className={`container ${styles.contributions}`} data-institute-overview>
        <div className={styles.contributionLabel}>
          <SectionEyebrow>{editorial('contributionsLabel')}</SectionEyebrow>
        </div>
        <header className={styles.modelHeading}>
          <div>
            <Heading as="h2" id="missions-title">
              {editorial('contributionsTitle')}
            </Heading>
            <p>{editorial('contributionsIntro')}</p>
          </div>
        </header>
        <article id="institute-research" className={styles.core} data-mission="research">
          <Image
            src="/images/institute/green-energy-park-research.webp"
            width={1280}
            height={721}
            alt=""
            className={styles.coreImage}
            sizes="(max-width: 64rem) 65vw, 32vw"
          />
          <div id="institute-model-research">
            <SectionEyebrow tone="white">{t('coreLabel')}</SectionEyebrow>
            <Heading as="h3" size="mission">
              {t('coreTitle')}
            </Heading>
            <p>{t('coreDescription')}</p>
            <ul className={styles.trio}>
              {researchMissions.map(({ id }) => (
                <li key={id}>
                  <a href={`#institute-model-${id}`}>{t(`missions.${id}.title`)}</a>
                </li>
              ))}
            </ul>
          </div>
        </article>
        <div className={styles.dimensions} data-mission-cards>
          {complementaryDimensions.map(({ id, pageId, anchor }, i) => (
            <article key={id} id={`institute-${id}`} data-mission={id}>
              <details id={`institute-model-${id}`} name="institute-complementary-dimensions">
                <summary>
                  <ValorisationIcon
                    name={(['chart-line', 'bulb', 'arrows-exchange'] as const)[i]}
                  />
                  <Heading as="h3" size="compact">
                    {t(`dimensions.${id}.title`)}
                  </Heading>
                  <NavigationIcon name="chevron" />
                </summary>
                <div className={styles.dimensionBody}>
                  <p>{t(`dimensions.${id}.description`)}</p>
                  <ul role="list">
                    {Array.from({ length: 4 }, (_, j) => (
                      <li key={j}>{editorial(`dimensions.${id}.${j}`)}</li>
                    ))}
                  </ul>
                  <a href={pageHref(pageId, locale, anchor)}>
                    {t(`dimensions.${id}.action`)}
                    <NavigationIcon name="arrow" />
                  </a>
                </div>
              </details>
            </article>
          ))}
        </div>
      </div>
      <section className={styles.research} aria-labelledby="research-focus-title">
        <div className="container">
          <SectionEyebrow>{editorial('focusLabel')}</SectionEyebrow>
          <div className={styles.focusHeading}>
            <Heading as="h2" id="research-focus-title">
              {editorial('focusTitle')}
            </Heading>
            <p>{editorial('focusIntro')}</p>
          </div>
          <ResearchTabs
            label={editorial('tabsLabel')}
            controls={{
              title: editorial('pathwayTitle'),
              hint: editorial('pathwayHint'),
            }}
            direction={locale === 'ar' ? 'rtl' : 'ltr'}
            items={researchMissions.map(({ id, pageId }) => ({
              id: `institute-model-${id}`,
              title: t(`missions.${id}.title`),
              content: (
                <div className={styles.verbPanel}>
                  <div>
                    <p className={styles.verbPurpose}>{editorial(`verbs.${id}.purpose`)}</p>
                    <Heading as="h3" size="mission">
                      {editorial(`verbs.${id}.title`)}
                    </Heading>
                    <p>{t(`missions.${id}.description`)}</p>
                    <a href={pageHref(pageId, locale)}>
                      {t(`missions.${id}.action`)}
                      <NavigationIcon name="arrow" />
                    </a>
                  </div>
                  <ul className={styles.activities}>
                    {Array.from({ length: 4 }, (_, j) => (
                      <li key={j}>{editorial(`verbs.${id}.activities.${j}`)}</li>
                    ))}
                  </ul>
                </div>
              ),
            }))}
          />
        </div>
      </section>
    </section>
  )
}
