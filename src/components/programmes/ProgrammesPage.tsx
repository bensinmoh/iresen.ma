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
import { findPublishedCalls, type PublicCall } from '@/lib/content/call-queries'
import { callHref, callState } from '@/lib/calls'

type Item = { title: string; description: string; category?: string }
const historicalSources = [
  'https://www.uit.ac.ma/realisation-dun-chargeur-bidirectionnel-et-sans-contact-pour-les-vehicules-electriques-a-technologie/',
  'https://www.uca.ma/fr/news/iresen-lancement-de-lappel-a-projet-green-innoboost-20-dernier-delai-de-soumission-31-janvier-2021',
  'https://www.cdti.es/programas-bilaterales-marruecos',
] as const

export async function ProgrammesPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Programmes' })
  const callsCopy = await getTranslations({ locale, namespace: 'Calls' })
  const calls = await findPublishedCalls(locale)
  const activeCalls = calls.filter((call) => ['open', 'upcoming'].includes(callState(call)))
  const archivedCalls = calls.filter((call) => ['closed', 'cancelled'].includes(callState(call)))
  const callCard = (call: PublicCall) => (
    <article key={call.id} id={`call-${call.reference}`}>
      <p className={styles.archiveLabel}>{callsCopy(`states.${callState(call)}`)}</p>
      <p className={styles.category}>
        <bdi>{call.acronym}</bdi> · <bdi>{call.launchYear}</bdi>
      </p>
      <Heading as="h3" size="card">
        <a href={callHref(call.reference, locale)}>{call.title}</a>
      </Heading>
      <p>
        {call.description.slice(0, 240)}
        {call.description.length > 240 ? '…' : ''}
      </p>
      <p className={styles.note}>
        {callsCopy('deadline')} :{' '}
        <time dateTime={call.deadlineAt}>
          {new Intl.DateTimeFormat(locale, {
            dateStyle: 'long',
            timeZone: 'Africa/Casablanca',
          }).format(new Date(call.deadlineAt))}
        </time>
      </p>
      <a data-ui-link className={styles.textLink} href={callHref(call.reference, locale)}>
        {callsCopy('view')}
        <NavigationIcon name="arrow" />
      </a>
    </article>
  )
  const titleParts = t('title').split('. ')
  const contactHref = `${pageHref('contact', locale)}?subject=agency`
  const intro = t.raw('intro.items') as Item[]
  const impact = t.raw('impact.items') as Item[]
  const process = t.raw('process.items') as Item[]
  const history = t.raw('history.items') as Item[]
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
            <header>
              <SectionEyebrow>{t('impact.eyebrow')}</SectionEyebrow>
              <Heading as="h2" size="section" id="programme-impact-title">
                {t('impact.title')}
              </Heading>
              <p>{t('impact.description')}</p>
              <div className={styles.figure}>
                <Image
                  src="/images/achievements/aquasolar.webp"
                  alt={t('productAlt')}
                  width={1200}
                  height={800}
                  sizes="(max-width: 63.999rem) 94vw, 46vw"
                />
                <div className={styles.figureCaption}>
                  <strong>
                    <bdi>69</bdi>
                  </strong>
                  <div>
                    <p>{t('figureLabel')}</p>
                    <small>{t('reference')}</small>
                  </div>
                </div>
              </div>
              <a className="button button-primary" href={pageHref('projects', locale)}>
                {t('projects')}
                <NavigationIcon name="arrow" />
              </a>
            </header>
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
          className={styles.history}
          aria-labelledby="programme-history-title"
        >
          <div className="container">
            <header className={styles.splitHeading}>
              <div>
                <SectionEyebrow>{t('history.eyebrow')}</SectionEyebrow>
                <Heading as="h2" size="section" id="programme-history-title">
                  {t('history.title')}
                </Heading>
              </div>
              <div>
                <p>{t('history.description')}</p>
                <p className={styles.note}>{t('historicalNote')}</p>
              </div>
            </header>
            <div className={styles.archives}>
              {history.map((item, i) => (
                <article key={item.title} id={`historical-call-${i + 1}`}>
                  <p className={styles.archiveLabel}>{t('archiveLabel')}</p>
                  <p className={styles.category}>{item.category}</p>
                  <Heading as="h3" size="card">
                    <bdi>{item.title}</bdi>
                  </Heading>
                  <p>{item.description}</p>
                  <details>
                    <summary>
                      {t('details')}
                      <NavigationIcon name="arrow" />
                    </summary>
                    <p>{t('processNote')}</p>
                    <a data-ui-link className={styles.textLink} href={historicalSources[i]}>
                      {t('sourceLink')}
                      <NavigationIcon name="arrow" />
                    </a>
                  </details>
                </article>
              ))}
            </div>
            {archivedCalls.length > 0 && (
              <div>
                <Heading as="h3" size="card">
                  {callsCopy('archives')}
                </Heading>
                <div className={styles.archives}>{archivedCalls.map(callCard)}</div>
              </div>
            )}
          </div>
        </section>
        <section
          id="participate"
          className={styles.current}
          aria-labelledby="programme-current-title"
        >
          {activeCalls.length ? (
            <div className="container">
              <SectionEyebrow>{t('current.eyebrow')}</SectionEyebrow>
              <Heading as="h2" size="section" id="programme-current-title">
                {callsCopy('active')}
              </Heading>
              <div className={styles.archives}>{activeCalls.map(callCard)}</div>
            </div>
          ) : (
            <div className={`container ${styles.empty}`}>
              <ValorisationIcon name="file-certificate" />
              <div>
                <SectionEyebrow>{t('current.eyebrow')}</SectionEyebrow>
                <Heading as="h2" size="section" id="programme-current-title">
                  {t('current.title')}
                </Heading>
                <p>{t('current.description')}</p>
                <div className={styles.actions}>
                  <a className="button button-primary" href="#calls-for-projects">
                    {t('archivesAction')}
                    <NavigationIcon name="arrow" />
                  </a>
                  <a data-ui-link className={styles.textLink} href={contactHref}>
                    {t('programmeContact')}
                    <NavigationIcon name="arrow" />
                  </a>
                </div>
              </div>
            </div>
          )}
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
