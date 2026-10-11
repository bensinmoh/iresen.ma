import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { heroImages } from '@/lib/hero-images'
import { PageHero } from '@/components/hero/PageHero'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { TimelineRail } from './TimelineRail'
import styles from './InstitutePage.module.css'

export async function InstitutePage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Institute' })
  const pages = await getTranslations({ locale, namespace: 'Pages' })
  const paragraphs = (key: string, count: number) =>
    Array.from({ length: count }, (_, i) => <p key={i}>{t(`${key}.${i}`)}</p>)
  const label = (text: string) => (
    <p className={styles.eyebrow}>
      <Image src="/brand/apex-leaf.svg" alt="" width={1773} height={2870} unoptimized />
      {text}
    </p>
  )
  const activities = (index: number, count: number) => (
    <dl className={styles.activities}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <dt>{t(`missions.${index}.activities.${i}.title`)}</dt>
          <dd>{t(`missions.${index}.activities.${i}.description`)}</dd>
        </div>
      ))}
    </dl>
  )
  return (
    <div data-institute-page className={styles.page}>
      <PageHero
        pageId="institute"
        locale={locale}
        title={t('title')}
        description={t('introduction.0')}
      />
      <div id="page-sections">
        <section id="about" aria-labelledby="institute-mission-title">
          <div id="mission" className={styles.statement}>
            <Image
              src={heroImages['solar-aerial'].src}
              alt=""
              fill
              sizes="100vw"
              className={styles.statementImage}
            />
            <div className={`container ${styles.statementContent}`}>
              <h2 id="institute-mission-title" className={styles.eyebrow}>
                <Image src="/brand/apex-leaf.svg" alt="" width={1773} height={2870} unoptimized />
                {t('missionLabel')}
              </h2>
              <blockquote>
                <p>
                  <span className={styles.quoteMark} aria-hidden="true">
                    «{' '}
                  </span>
                  {t('statement')}
                  <span className={styles.quoteMark} aria-hidden="true">
                    {' '}
                    »
                  </span>
                </p>
              </blockquote>
            </div>
          </div>
        </section>
        <section
          id="institute-positioning"
          className={`container ${styles.position}`}
          aria-labelledby="position-title"
        >
          <header>
            {label(t('positionLabel'))}
            <h2 id="position-title">{t('position.title')}</h2>
          </header>
          <div className={styles.reading}>{paragraphs('position.paragraphs', 3)}</div>
        </section>
        <section
          id="capabilities"
          className={`container ${styles.missions}`}
          aria-labelledby="missions-title"
        >
          <header className={styles.missionsHeading}>
            <h2 id="missions-title">{t('missionsLabel')}</h2>
            <div className={styles.reading}>{paragraphs('missionsIntro', 3)}</div>
          </header>
          {(['institute-studies', 'institute-research', 'institute-skills'] as const).map(
            (id, i) => (
              <section key={id} id={id} className={styles.mission} aria-labelledby={`${id}-title`}>
                <header>
                  <span className={styles.number} aria-hidden="true">
                    0{i + 1}
                  </span>
                  <p className={styles.purpose}>{t(`missions.${i}.purpose`)}</p>
                  <h3 id={`${id}-title`}>{t(`missions.${i}.title`)}</h3>
                </header>
                <div className={styles.reading}>
                  {t(`missions.${i}.introduction`)
                    .split('\n\n')
                    .map((text, j) => (
                      <p key={j}>{text}</p>
                    ))}
                  <details className={styles.details}>
                    <summary>
                      {t('detailsLabel')}
                      <NavigationIcon name="chevron" />
                    </summary>
                    {activities(i, i === 0 ? 4 : 5)}
                  </details>
                </div>
              </section>
            ),
          )}
        </section>
        <section
          id="institute-cooperation"
          className={styles.cooperation}
          aria-labelledby="cooperation-title"
        >
          <div className={`container ${styles.split}`}>
            <header>
              {label(t('cooperationLabel'))}
              <h2 id="cooperation-title">{t('missions.3.title')}</h2>
              <p className={styles.purpose}>{t('missions.3.purpose')}</p>
            </header>
            <div className={styles.reading}>
              <p>{t('missions.3.introduction')}</p>
              <details className={styles.details}>
                <summary>
                  {t('detailsLabel')}
                  <NavigationIcon name="chevron" />
                </summary>
                {activities(3, 5)}
              </details>
            </div>
          </div>
        </section>
        <section
          id="institute-values"
          className={`container ${styles.values}`}
          aria-labelledby="values-title"
        >
          <header>
            <h2 id="values-title">{t('valuesLabel')}</h2>
          </header>
          <dl>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i}>
                <dt>{t(`values.${i}.title`)}</dt>
                <dd>{t(`values.${i}.description`)}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section id="ambition-2035" className={styles.ambition} aria-labelledby="ambition-title">
          <div className={styles.ambitionCopy}>
            {label(t('ambitionLabel'))}
            <h2 id="ambition-title">{t('ambition.statement')}</h2>
            <div className={styles.reading}>{paragraphs('ambition.paragraphs', 2)}</div>
          </div>
          <div className={styles.ambitionImage} aria-hidden="true">
            <Image
              src={heroImages.workshop.src}
              alt=""
              fill
              sizes="(max-width: 64rem) 100vw, 45vw"
            />
          </div>
        </section>
        <section id="institute-history" className={styles.history} aria-labelledby="history-title">
          <div className="container">
            <div id="key-figures" className={styles.historyHeading}>
              {label(t('historyLabel'))}
              <h2 id="history-title">{t('historyTitle')}</h2>
              <div className={styles.reading}>{paragraphs('historyIntro', 1)}</div>
            </div>
            <TimelineRail
              label={t('historyLabel')}
              previous={t('previous')}
              next={t('next')}
              progressLabel={t('historyProgressLabel')}
              direction={locale === 'ar' ? 'rtl' : 'ltr'}
            >
              {Array.from({ length: 8 }, (_, index) => 7 - index).map((i) => (
                <li key={i}>
                  <p className={styles.year}>
                    <bdi>{t(`timeline.${i}.year`)}</bdi>
                  </p>
                  <span className={styles.marker} aria-hidden="true" />
                  <h3>{t(`timeline.${i}.title`)}</h3>
                  <p>{t(`timeline.${i}.description`)}</p>
                </li>
              ))}
            </TimelineRail>
          </div>
        </section>
        <section id="more-resources" className={styles.report} aria-labelledby="report-title">
          <div className={`container ${styles.split}`}>
            <div className={styles.reading}>
              <header className={styles.reportHeading}>
                {label(t('reportLabel'))}
                <h2 id="report-title">{t('reportTitle')}</h2>
              </header>
              {paragraphs('report', 3)}
            </div>
            <a href="#" className={styles.reportCoverFrame} aria-label={t('reportRead')}>
              <Image
                className={styles.reportCover}
                src="/images/institute/fifteen-year-report-cover-cutout.webp"
                alt={t('coverAlt')}
                width={1317}
                height={1194}
                sizes="(max-width: 64rem) 100vw, 45vw"
              />
            </a>
            {/* Owner-selected placeholder until the public PDF is supplied. */}
            <div className={styles.reportActions}>
              <a href="#" className="button button-primary">
                {t('reportRead')}
                <NavigationIcon name="arrow" />
              </a>
            </div>
          </div>
          <nav className={`container ${styles.resources}`} aria-label={t('resourcesLabel')}>
            {(['publications', 'media'] as const).map((id) => (
              <a
                key={id}
                href={pageHref(
                  id,
                  locale,
                  id === 'publications' ? 'institutional-reports' : 'reports',
                )}
              >
                <span>{pages(id)}</span>
                <NavigationIcon name="arrow" />
              </a>
            ))}
          </nav>
        </section>
        <div className="container">
          <PublishedPageContent pageId="institute" locale={locale} />
        </div>
      </div>
    </div>
  )
}
