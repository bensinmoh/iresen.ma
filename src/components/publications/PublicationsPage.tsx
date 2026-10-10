import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { ReportList } from '@/components/media/ReportList'
import { pageHref } from '@/lib/site'
import { patents } from '@/lib/patents'
import {
  publications,
  publicationTopics,
  frequentPublicationTopics,
  publicationYears,
  filterPublications,
  titleTopics,
} from '@/lib/publications'
import styles from './PublicationsPage.module.css'
import { PublicationCatalogue } from './PublicationCatalogue'
import { FrequentSearches } from './FrequentSearches'

type Parameters = Record<string, string | string[] | undefined>
export async function PublicationsPage({
  locale,
  parameters,
}: {
  locale: Locale
  parameters: Parameters
}) {
  const t = await getTranslations({ locale, namespace: 'Publications' })
  const reports = await getTranslations({ locale, namespace: 'MediaLibrary' })
  const value = (key: string) =>
    typeof parameters[key] === 'string' ? (parameters[key] as string) : ''
  const values = (key: string) =>
    typeof parameters[key] === 'string'
      ? [parameters[key] as string]
      : Array.isArray(parameters[key])
        ? (parameters[key] as string[])
        : []
  const query = value('q').slice(0, 200)
  const topics = values('topic').filter((id) => publicationTopics.some((topic) => topic.id === id))
  const years = values('year').filter((year) => publicationYears.includes(Number(year)))
  const limit = Math.min(1200, Math.max(6, Number(value('limit')) || 6))
  const base = pageHref('publications', locale)
  const href = (extra: Record<string, string>, keep = true) => {
    const params = new URLSearchParams()
    if (keep) {
      if (query) params.set('q', query)
      topics.forEach((id) => params.append('topic', id))
      years.forEach((year) => params.append('year', year))
    }
    Object.entries(extra).forEach(([key, val]) => params.set(key, val))
    return `${base}?${params}#publication-catalogue`
  }
  return (
    <div className={styles.page} data-publications-page>
      <section id="featured-publications" className={styles.hero} aria-labelledby="hero-title">
        <Image
          src="/images/publications/hero.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className={styles.heroImage}
        />
        <div className={`container ${styles.heroContent}`}>
          <p className={styles.eyebrow}>{t('label')}</p>
          <h1 id="hero-title">
            <span>{t('accent')}</span> {t('title')}
          </h1>
          <p>{t('description')}</p>
          <form
            id="find-publication"
            action={`${base}#publication-catalogue`}
            className={styles.search}
            role="search"
            aria-label={t('search')}
          >
            <label className={styles.srOnly} htmlFor="publication-query">
              {t('placeholder')}
            </label>
            <input
              id="publication-query"
              name="q"
              type="search"
              defaultValue={query}
              placeholder={t('placeholder')}
              maxLength={200}
            />
            <button className="button button-primary" type="submit">
              <NavigationIcon name="search" />
              {t('search')}
            </button>
          </form>
          <FrequentSearches
            label={t('frequent')}
            links={frequentPublicationTopics.map(({ id }) => ({
              label: t(`topics.${id}`),
              href: href({ topic: id }, false),
            }))}
          />
        </div>
        <div className={styles.figures}>
          <div
            className={`container horizontal-scroll ${styles.figureTrack}`}
            tabIndex={0}
            role="region"
            aria-label={t('figures')}
          >
            {[
              [publications.length, 'publications'],
              [patents.length, 'patents'],
              [69, 'projects'],
              [18, 'calls'],
            ].map(([number, key]) => (
              <div key={key}>
                <strong>{Number(number).toLocaleString(locale)}</strong>
                <span>{t(String(key))}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="publication-catalogue" className={`container ${styles.section}`}>
        <header className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>{t('label')}</p>
            <h2>{t('articles')}</h2>
          </div>
          <p>{t('note')}</p>
        </header>
        <PublicationCatalogue
          key={`${query}:${value('publication')}:${topics.join(',')}:${years.join(',')}`}
          locale={locale}
          base={base}
          query={query}
          initialTopics={topics}
          initialYears={years}
          initialLimit={limit}
          initialSelection={value('publication')}
          records={filterPublications(query).map((p) => ({
            id: p.id,
            title: p.title,
            authors: p.authors,
            doiUrl: p.doiUrl,
            year: p.year,
            topics: titleTopics(p.title),
            topicLabel:
              titleTopics(p.title)
                .slice(0, 2)
                .map((id) => t(`topics.${id}`))
                .join(' · ') ||
              p.theme ||
              t('other'),
          }))}
          topics={publicationTopics
            .filter((topic) => topic.count > 0)
            .map((topic) => ({ ...topic, label: t(`topics.${topic.id}`) }))}
          years={publicationYears.map((year) => ({
            year,
            count: publications.filter((p) => p.year === year).length,
          }))}
          copy={{
            filters: t('filters'),
            domain: t('domain'),
            year: t('year'),
            reset: t('reset'),
            empty: t('empty'),
            read: t('read'),
            noDoi: t('noDoi'),
            noAuthors: t('noAuthors'),
            more: t('more'),
            count: t('count', { count: '{count}' }),
            noScript: t('noScript'),
          }}
        />
      </section>
      <section id="institutional-reports" className={styles.reports}>
        <div className="container">
          <header className={styles.heading}>
            <h2>{reports('reports')}</h2>
            <p>{reports('sourceNote')}</p>
          </header>
          <ReportList locale={locale} />
        </div>
      </section>
      <section id="use-cite-resources" className={`container ${styles.cite}`}>
        <h2>{t('cite')}</h2>
        <p>{t('rights')}</p>
      </section>
    </div>
  )
}
