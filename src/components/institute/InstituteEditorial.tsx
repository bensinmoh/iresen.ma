import { getTranslations } from 'next-intl/server'
import { Lightning } from '@phosphor-icons/react/dist/ssr/Lightning'
import { TrendUp } from '@phosphor-icons/react/dist/ssr/TrendUp'
import { Plant } from '@phosphor-icons/react/dist/ssr/Plant'
import { SiteIcon } from '@/components/ui/SiteIcon'
import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import type { Locale } from '@/i18n/locales'
import { InstituteModel } from './InstituteModel'
import { PositioningDiagram } from './PositioningDiagram'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import styles from './InstituteModel.module.css'

export async function InstituteEditorial({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Institute' })
  const narrative = await getTranslations({ locale, namespace: 'Narrative' })
  const closingIcons = [Lightning, TrendUp, Plant]
  return (
    <div className={styles.editorial} data-institute-editorial>
      <section
        id="about"
        className={`container ${styles.mission}`}
        aria-labelledby="institute-mission-title"
      >
        <div id="mission">
          <SectionEyebrow>{t('missionLabel')}</SectionEyebrow>
          <Heading
            as="h2"
            size="display"
            id="institute-mission-title"
            className={styles.missionTitle}
          >
            {t('editorial.missionTitle')} <em>{t('editorial.missionAccent')}</em>
          </Heading>
          <div className={styles.missionBottom}>
            <p className={styles.slogan}>{t('editorial.slogan')}</p>
            <blockquote>
              <span className={styles.missionQuoteMark} aria-hidden="true">
                “
              </span>
              <p>{t('statement')}</p>
              <span className={styles.missionQuoteMark} aria-hidden="true">
                ”
              </span>
            </blockquote>
          </div>
        </div>
      </section>
      <section
        id="institute-positioning"
        className={styles.positionSection}
        aria-labelledby="position-title"
      >
        <div className={`container ${styles.position}`}>
          <div className={styles.positionCopy}>
            <header>
              <SectionEyebrow tone="cyan">{t('positionLabel')}</SectionEyebrow>
              <Heading as="h2" id="position-title">
                {t('editorial.positionTitle')}
              </Heading>
            </header>
            <p>{t('editorial.positionBody')}</p>
          </div>
          <PositioningDiagram locale={locale} />
          <div className={styles.positionCapabilities}>
            <Heading as="h3" size="compact">
              {narrative('capabilitiesLabel')}
            </Heading>
            <ul>
              {(['expertise', 'programmes', 'platforms', 'partnerships'] as const).map(
                (id, index) => (
                  <li key={id}>
                    <ValorisationIcon
                      name={
                        (['search', 'flask', 'building-factory-2', 'arrows-exchange'] as const)[
                          index
                        ]
                      }
                    />
                    <span>{narrative(`capabilities.${id}`)}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>
      <InstituteModel locale={locale} />
      <aside
        className={styles.closingSection}
        aria-labelledby="institute-closing-title"
        data-institute-closing
      >
        <div className={`container ${styles.closing}`}>
          <Heading as="h2" id="institute-closing-title" className={styles.closingTitle}>
            {t('editorial.closing')
              .split('\n')
              .map((line, index) => (
                <span key={index}>{line}</span>
              ))}
          </Heading>
          <ul className={styles.closingTopics}>
            {t('editorial.closingTopics')
              .split(' · ')
              .map((topic, index) => (
                <li key={topic}>
                  <SiteIcon icon={closingIcons[index] ?? Plant} size={24} />
                  <span>{topic}</span>
                </li>
              ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
