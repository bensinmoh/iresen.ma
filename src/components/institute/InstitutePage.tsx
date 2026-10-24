import { Flask } from '@phosphor-icons/react/dist/ssr/Flask'
import { Target } from '@phosphor-icons/react/dist/ssr/Target'
import { Handshake } from '@phosphor-icons/react/dist/ssr/Handshake'
import { BookOpen } from '@phosphor-icons/react/dist/ssr/BookOpen'
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr/ShieldCheck'
import { SiteIcon } from '@/components/ui/SiteIcon'
import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { heroImages } from '@/lib/hero-images'
import { PageHero } from '@/components/hero/PageHero'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { TimelineRail } from './TimelineRail'
import { InstituteEditorial } from './InstituteEditorial'
import styles from './InstitutePage.module.css'

export async function InstitutePage({ locale }: { locale: Locale }) {
  const valueIcons = [Flask, Target, Handshake, BookOpen, ShieldCheck]
  const t = await getTranslations({ locale, namespace: 'Institute' })
  const pages = await getTranslations({ locale, namespace: 'Pages' })
  const paragraphs = (key: string, count: number) =>
    Array.from({ length: count }, (_, i) => <p key={i}>{t(`${key}.${i}`)}</p>)
  const label = (text: string, tone: 'blue' | 'white' = 'blue') => (
    <SectionEyebrow tone={tone}>{text}</SectionEyebrow>
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
        <InstituteEditorial locale={locale} />
        <section id="institute-values" className={styles.values} aria-labelledby="values-title">
          <div className="container">
            <header className={styles.valuesHeading}>
              <Heading as="h2" size="section" id="values-title">
                {t('valuesLabel')}
              </Heading>
            </header>
            <dl className={styles.valueCards} tabIndex={0} aria-labelledby="values-title">
              {valueIcons.map((icon, i) => (
                <div key={i}>
                  <dt>
                    <span className={styles.valueIcon}>
                      <SiteIcon icon={icon} size={28} />
                    </span>
                    {t(`values.${i}.title`)}
                  </dt>
                  <dd>{t(`values.${i}.description`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section id="ambition-2035" className={styles.ambition} aria-labelledby="ambition-title">
          <div className={styles.ambitionScene} aria-hidden="true">
            <Image
              src={heroImages['solar-horizon'].src}
              alt=""
              fill
              sizes="100vw"
              className={styles.ambitionMobileBackground}
            />
          </div>
          <Image
            src="/images/institute/ambition-king-mohammed-vi.webp"
            alt=""
            width={1535}
            height={1024}
            unoptimized
            className={styles.ambitionPortrait}
          />
          <div className={`container ${styles.ambitionContent}`}>
            <div className={styles.ambitionText}>
              <SectionEyebrow id="ambition-title" tone="white">
                {t('ambitionLabel')}
              </SectionEyebrow>
              <blockquote className={styles.ambitionQuote}>
                <p>
                  <span className={styles.quoteMark} aria-hidden="true">
                    «{' '}
                  </span>
                  {t('ambition.statement')}
                  <span className={styles.quoteMark} aria-hidden="true">
                    {' '}
                    »
                  </span>
                </p>
              </blockquote>
            </div>
          </div>
        </section>
        <section id="institute-history" className={styles.history} aria-labelledby="history-title">
          <div className="container">
            <div id="key-figures" className={styles.historyHeading}>
              {label(t('historyLabel'), 'white')}
              <Heading as="h2" size="section" id="history-title">
                {t('historyTitle')}
              </Heading>
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
                  <Heading as="h3" size="card">
                    {t(`timeline.${i}.title`)}
                  </Heading>
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
                <Heading as="h2" size="section" id="report-title">
                  {t('reportTitle')}
                </Heading>
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
