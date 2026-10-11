import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { PageHero } from '@/components/hero/PageHero'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import styles from './ProgrammesPage.module.css'

type Item = { title: string; description: string; category?: string }
const historicalSources = [
  'https://www.uit.ac.ma/realisation-dun-chargeur-bidirectionnel-et-sans-contact-pour-les-vehicules-electriques-a-technologie/',
  'https://www.uca.ma/fr/news/iresen-lancement-de-lappel-a-projet-green-innoboost-20-dernier-delai-de-soumission-31-janvier-2021',
  'https://www.cdti.es/programas-bilaterales-marruecos',
] as const

export async function ProgrammesPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Programmes' })
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
            <header className={styles.splitHeading}>
              <div>
                <p className={styles.eyebrow}>
                  <span aria-hidden="true" />
                  {t('intro.eyebrow')}
                </p>
                <h2 id="programme-intro-title">{t('intro.title')}</h2>
                <figure className={styles.people}>
                  <Image
                    src="/images/programmes/collaborative-prototyping.webp"
                    alt={t('researchAlt')}
                    width={1200}
                    height={800}
                    sizes="(max-width: 63.999rem) 94vw, 46vw"
                  />
                  <figcaption>{t('illustrationNote')}</figcaption>
                </figure>
              </div>
              <div className={styles.prose}>
                {(t.raw('intro.paragraphs') as string[]).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </header>
            <div className={styles.cards}>
              {intro.map((item, i) => (
                <article key={item.title}>
                  <ValorisationIcon name={(['flask', 'rocket', 'arrows-exchange'] as const)[i]!} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
            <a className={styles.textLink} href={pageHref('priorities', locale)}>
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
              <p className={styles.eyebrow}>
                <span aria-hidden="true" />
                {t('impact.eyebrow')}
              </p>
              <h2 id="programme-impact-title">{t('impact.title')}</h2>
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
                    <h3>{item.title}</h3>
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
              <p className={styles.eyebrow}>
                <span aria-hidden="true" />
                {t('process.eyebrow')}
              </p>
              <h2 id="programme-process-title">{t('process.title')}</h2>
              <p>{t('process.description')}</p>
            </header>
            <ol className={styles.steps}>
              {process.map((item, i) => (
                <li key={item.title}>
                  <span className={styles.stepNumber} aria-hidden="true">
                    <bdi>0{i + 1}</bdi>
                  </span>
                  <h3>{item.title.split(' — ')[1]}</h3>
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
                <p className={styles.eyebrow}>
                  <span aria-hidden="true" />
                  {t('history.eyebrow')}
                </p>
                <h2 id="programme-history-title">{t('history.title')}</h2>
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
                  <h3>
                    <bdi>{item.title}</bdi>
                  </h3>
                  <p>{item.description}</p>
                  <details>
                    <summary>
                      {t('details')}
                      <NavigationIcon name="arrow" />
                    </summary>
                    <p>{t('processNote')}</p>
                    <a className={styles.textLink} href={historicalSources[i]}>
                      {t('sourceLink')}
                      <NavigationIcon name="arrow" />
                    </a>
                  </details>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="participate"
          className={styles.current}
          aria-labelledby="programme-current-title"
        >
          <div className={`container ${styles.empty}`}>
            <ValorisationIcon name="file-certificate" />
            <div>
              <p className={styles.eyebrow}>
                <span aria-hidden="true" />
                {t('current.eyebrow')}
              </p>
              <h2 id="programme-current-title">{t('current.title')}</h2>
              <p>{t('current.description')}</p>
              <div className={styles.actions}>
                <a className="button button-primary" href="#calls-for-projects">
                  {t('archivesAction')}
                  <NavigationIcon name="arrow" />
                </a>
                <a className={styles.textLink} href={contactHref}>
                  {t('programmeContact')}
                  <NavigationIcon name="arrow" />
                </a>
              </div>
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
              <h2 id="programme-final-title">{t('final.title')}</h2>
              <p>{t('final.description')}</p>
            </div>
            <div className={styles.actions}>
              <a className="button button-primary" href={contactHref}>
                {t('contact')}
                <NavigationIcon name="arrow" />
              </a>
              <a className={styles.textLink} href={pageHref('workWithUs', locale)}>
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
