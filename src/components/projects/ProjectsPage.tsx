import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import {
  demoProjects,
  filterProjects,
  projectDomains,
  projectStatuses,
  type ProjectFilters,
} from '@/lib/projects'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { ProjectFilters as FilterForm } from './ProjectFilters'
import styles from './ProjectsPage.module.css'

export async function ProjectsPage({
  locale,
  parameters,
}: {
  locale: Locale
  parameters: Record<string, string | string[] | undefined>
}) {
  const t = await getTranslations({ locale, namespace: 'Projects' })
  const value = (key: string) =>
    typeof parameters[key] === 'string' ? parameters[key].slice(0, 200) : ''
  const programmes = [...new Set(demoProjects.map((p) => p.programme))]
  const years = [...new Set(demoProjects.map((p) => String(p.year)))].sort().reverse()
  const filters: ProjectFilters = {
    query: value('q'),
    domain: projectDomains.includes(value('domain') as (typeof projectDomains)[number])
      ? value('domain')
      : '',
    year: years.includes(value('year')) ? value('year') : '',
    status: projectStatuses.includes(value('status') as (typeof projectStatuses)[number])
      ? value('status')
      : '',
    programme: programmes.includes(value('programme')) ? value('programme') : '',
  }
  const results = filterProjects(filters, locale)
  const pages = Math.ceil(results.length / 6)
  const requested = /^[1-9]\d*$/.test(value('page')) ? Number(value('page')) : 1
  const page = Math.min(requested, Math.max(1, pages))
  const href = (number: number) => {
    const query = new URLSearchParams()
    for (const [key, val] of Object.entries(filters))
      if (val) query.set(key === 'query' ? 'q' : key, val)
    if (number > 1) query.set('page', String(number))
    return `${pageHref('projects', locale)}${query.size ? `?${query}` : ''}#project-catalogue`
  }
  const fields = [
    { key: 'domain', values: projectDomains, label: (v: string) => t(`domains.${v}`) },
    { key: 'year', values: years, label: (v: string) => v },
    { key: 'status', values: projectStatuses, label: (v: string) => t(`statuses.${v}`) },
    { key: 'programme', values: programmes, label: (v: string) => v },
  ] as const
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
  return (
    <div className={styles.page} data-projects-page>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src="/images/projects/hero.webp"
          alt=""
          fill
          unoptimized
          loading="eager"
          fetchPriority="high"
          className={styles.heroPhoto}
        />
        <div className={`container ${styles.heroContent}`}>
          <p className={styles.eyebrow}>{t('eyebrow')}</p>
          <h1 id="hero-title">
            {t('titleStart')} <span>{t('titleAccent')}</span>
          </h1>
          <p className={styles.description}>{t('description')}</p>
        </div>
      </section>
      <div id="page-sections">
        <section id="find-project" className={styles.filters} aria-label={t('query')}>
          <div className="container">
            <FilterForm action={`${pageHref('projects', locale)}#project-catalogue`}>
              <div className={styles.fields}>
                <div className={styles.query}>
                  <label htmlFor="project-query">{t('query')}</label>
                  <div className={styles.searchField}>
                    <input
                      type="search"
                      id="project-query"
                      name="q"
                      defaultValue={filters.query}
                      placeholder={t('placeholder')}
                      maxLength={200}
                    />
                    <button type="submit" aria-label={t('query')}>
                      <NavigationIcon name="search" />
                    </button>
                  </div>
                </div>
                {fields.map((field) => (
                  <label key={field.key}>
                    {t(field.key)}
                    <span className={styles.select}>
                      <select name={field.key} defaultValue={filters[field.key]}>
                        <option value="">{t('all')}</option>
                        {field.values.map((v) => (
                          <option key={v} value={v}>
                            {field.label(v)}
                          </option>
                        ))}
                      </select>
                      <NavigationIcon name="chevron" />
                    </span>
                  </label>
                ))}
              </div>
            </FilterForm>
            <div className={styles.resultBar}>
              <p role="status">{t('count', { count: results.length })}</p>
              <a href={`${pageHref('projects', locale)}#find-project`}>{t('reset')}</a>
            </div>
          </div>
        </section>
        <section id="project-catalogue" className={styles.catalogue} aria-label={t('catalogue')}>
          <div className="container">
            <aside id="understanding-results" className={styles.notice}>
              {t('demo')}
            </aside>
            <div id="featured-results" className={styles.grid}>
              {results.slice((page - 1) * 6, page * 6).map((project) => (
                <article
                  key={project.id}
                  id={`project-${project.id}`}
                  className={styles.card}
                  aria-labelledby={`title-${project.id}`}
                >
                  <div className={styles.cardHeader}>
                    <p>{t(`domains.${project.domain}`)}</p>
                    <span className={styles[project.status]}>
                      {t(`statuses.${project.status}`)}
                    </span>
                  </div>
                  <Image
                    src={`/images/projects/${project.image}.webp`}
                    alt={t(`photos.${project.image}`)}
                    width={900}
                    height={430}
                    unoptimized
                    className={styles.cardPhoto}
                  />
                  <h2 id={`title-${project.id}`}>
                    <bdi>{project.acronym}</bdi>
                  </h2>
                  <p className={styles.projectTitle}>{project.title[locale]}</p>
                  <p className={styles.summary}>{project.description[locale]}</p>
                  <dl className={styles.metadata}>
                    {[
                      [t('acronym'), project.acronym],
                      [t('duration'), t('months', { count: project.durationMonths })],
                      [t('budget'), `${number.format(project.budgetMAD / 1000000)} MMAD`],
                      [t('launch'), String(project.year)],
                      [t('programme'), project.programme],
                    ].map(([label, detail]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>
                          <bdi>{detail}</bdi>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className={styles.fictional}>{t('fictional')}</p>
                </article>
              ))}
            </div>
            {!results.length && (
              <div className={styles.empty}>
                <h2>{t('empty')}</h2>
                <p>{t('emptyHelp')}</p>
                <a
                  className="button button-primary"
                  href={`${pageHref('projects', locale)}#find-project`}
                >
                  {t('reset')}
                </a>
              </div>
            )}
            {pages > 1 && (
              <nav aria-label={t('pagination')} className={styles.pagination}>
                {page > 1 ? (
                  <a href={href(page - 1)} aria-label={t('previous')}>
                    <span className={styles.previous}>
                      <NavigationIcon name="chevron" />
                    </span>
                  </a>
                ) : (
                  <span aria-disabled="true">
                    <span className={styles.previous}>
                      <NavigationIcon name="chevron" />
                    </span>
                  </span>
                )}
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <a
                    key={n}
                    href={href(n)}
                    aria-label={t('page', { number: n })}
                    aria-current={n === page ? 'page' : undefined}
                  >
                    {n}
                  </a>
                ))}
                {page < pages ? (
                  <a href={href(page + 1)} aria-label={t('next')}>
                    <span className={styles.next}>
                      <NavigationIcon name="chevron" />
                    </span>
                  </a>
                ) : (
                  <span aria-disabled="true">
                    <span className={styles.next}>
                      <NavigationIcon name="chevron" />
                    </span>
                  </span>
                )}
              </nav>
            )}
            <div id="related-capabilities" />
          </div>
        </section>
      </div>
    </div>
  )
}
