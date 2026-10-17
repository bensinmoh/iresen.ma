import { siteArchivedCalls } from '@/lib/cms-workspace/public-corpora'
import { Heading } from '@/components/ui/Heading'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { PageHero } from '@/components/hero/PageHero'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import styles from './ProgrammesPage.module.css'
import { findPublishedCalls } from '@/lib/content/call-queries'
import { callsListingHref } from '@/lib/calls'
import { callCards } from '@/lib/call-archives'
import { callCopy } from '@/lib/call-copy'
import { CallCards } from './CallCards'
import callsStyles from './CallsCatalogue.module.css'
import { totalProjects } from '@/lib/project-count'

type Item = { title: string; description: string; category?: string }
export async function ProgrammesPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Programmes' })
  const calls = await findPublishedCalls(locale)
  const projectTotal = await totalProjects()
  const cards = callCards(locale, calls, await siteArchivedCalls())
  const preview = [
    ...cards.filter((call) => call.state === 'open' || call.state === 'upcoming'),
    ...cards.filter((call) => call.state === 'closed' || call.state === 'cancelled'),
  ].slice(0, 4)
  const archiveCopy = callCopy[locale]
  const titleParts = t('title').split('. ')
  const contactHref = `${pageHref('contact', locale)}?subject=agency`
  const intro = t.raw('intro.items') as Item[]
  const impact = t.raw('impact.items') as Item[]
  const process = t.raw('process.items') as Item[]
  return (
    <div className={styles.page} data-programmes-page>
      <PageHero
        pageId="programmes"
        locale={locale}
        eyebrow={t('eyebrow')}
        title={
          <>
            {titleParts[0]}.{' '}
            <span className={styles.heroEmphasis}>{titleParts.slice(1).join('. ')}</span>
          </>
        }
        description={t('description')}
        primaryAction={{ label: t('discover'), href: '#participate' }}
        secondaryAction={{ label: t('understand'), href: '#programmes-collaborations' }}
      />
      <div id="page-sections">
        <section
          id="programmes-collaborations"
          className={styles.intro}
          aria-labelledby="programme-intro-title"
        >
          <div className="container">
            <header className={styles.approachHeading}>
              <SectionEyebrow>{t('intro.eyebrow')}</SectionEyebrow>
              <Heading as="h2" size="section" id="programme-intro-title">
                {t('intro.title')}
              </Heading>
            </header>
            <div className={styles.approachGrid}>
              <figure className={styles.people} data-motion-reveal>
                <div className={styles.approachPhoto}>
                  <Image
                    src="/images/programmes/collaborative-prototyping.webp"
                    alt={t('researchAlt')}
                    fill
                    sizes="(max-width: 63.999rem) 94vw, 46vw"
                  />
                </div>
                <figcaption>{t('illustrationNote')}</figcaption>
              </figure>
              <div className={styles.prose} data-motion-reveal>
                {(t.raw('intro.paragraphs') as string[]).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className={styles.cards}>
              {intro.map((item, i) => (
                <article key={item.title}>
                  <ValorisationIcon name={(['flask', 'rocket', 'arrows-exchange'] as const)[i]!} />
                  <Heading as="h3" size="card">
                    {item.title}
                  </Heading>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
            <a data-ui-link className={styles.textLink} href={pageHref('priorities', locale)}>
              {t('priorities')}
              <NavigationIcon name="arrow" />
            </a>
          </div>
        </section>
        <section
          id="research-results"
          className={styles.impact}
          aria-labelledby="programme-impact-title"
        >
          <div className={`container ${styles.impactInner}`}>
            <header className={styles.impactHeading}>
              <div>
                <SectionEyebrow>{t('impact.eyebrow')}</SectionEyebrow>
                <Heading as="h2" size="section" id="programme-impact-title">
                  {t('impact.title')}
                </Heading>
              </div>
              <p>{t('impact.description')}</p>
            </header>
            <div className={styles.figure}>
              <Image
                src="/images/achievements/aquasolar.webp"
                alt={t('productAlt')}
                width={1200}
                height={800}
                sizes="(max-width: 63.999rem) 94vw, 46vw"
              />
              <div className={styles.figureCaption}>
                <strong data-project-total={projectTotal ?? undefined}>
                  <bdi>{projectTotal ?? '—'}</bdi>
                </strong>
                <div>
                  <p>{t('figureLabel')}</p>
                  <small>{t('reference')}</small>
                </div>
              </div>
            </div>
            <div className={styles.outcomeColumn}>
              <div className={styles.outcomes}>
                {impact.map((item, i) => (
                  <article key={item.title}>
                    <ValorisationIcon
                      name={(['flask', 'building-factory-2', 'chart-line'] as const)[i]!}
                    />
                    <div>
                      <Heading as="h3" size="card">
                        {item.title}
                      </Heading>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              <a
                className={`button button-primary ${styles.impactAction}`}
                href={pageHref('projects', locale)}
              >
                {t('projects')}
                <NavigationIcon name="arrow" />
              </a>
            </div>
          </div>
        </section>
        <section
          id="project-lifecycle"
          className={styles.process}
          aria-labelledby="programme-process-title"
        >
          <div className="container">
            <header className={styles.centerHeading}>
              <SectionEyebrow tone="cyan" centered>
                {t('process.eyebrow')}
              </SectionEyebrow>
              <Heading as="h2" size="section" id="programme-process-title">
                {t('process.title')}
              </Heading>
              <p>{t('process.description')}</p>
            </header>
            <ol className={styles.steps}>
              {process.map((item, i) => (
                <li key={item.title}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    <bdi>0{i + 1}</bdi>
                  </span>
                  <Heading as="h3" size="card">
                    {item.title.split(' — ')[1]}
                  </Heading>
                  <p>{item.description}</p>
                </li>
              ))}
            </ol>
            <p className={styles.processNote}>{t('processNote')}</p>
          </div>
        </section>
        <section
          id="calls-for-projects"
          className={callsStyles.surface}
          aria-labelledby="programme-history-title"
        >
          <div className="container">
            <header className={callsStyles.heading}>
              <div>
                <SectionEyebrow>{t('history.eyebrow')}</SectionEyebrow>
                <h2 id="programme-history-title">{t('history.title')}</h2>
              </div>
              <div>
                <p>{t('history.description')}</p>
                <a className="button button-primary" href={callsListingHref(locale)}>
                  {archiveCopy.all}
                  <NavigationIcon name="arrow" />
                </a>
              </div>
            </header>
            <div id="participate">
              <CallCards calls={preview} locale={locale} />
            </div>
          </div>
        </section>
        <section
          id="practical-questions"
          className={styles.final}
          aria-labelledby="programme-final-title"
        >
          <div className={`container ${styles.finalInner}`}>
            <div>
              <Heading as="h2" size="section" id="programme-final-title">
                {t('final.title')}
              </Heading>
              <p>{t('final.description')}</p>
            </div>
            <div className={styles.actions}>
              <a className="button button-primary" href={contactHref}>
                {t('contact')}
                <NavigationIcon name="arrow" />
              </a>
              <a data-ui-link className={styles.textLink} href={pageHref('workWithUs', locale)}>
                {t('cooperate')}
                <NavigationIcon name="arrow" />
              </a>
            </div>
          </div>
        </section>
        <div className="container">
          <PublishedPageContent pageId="programmes" locale={locale} />
        </div>
      </div>
    </div>
  )
}
