import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { searchAdapter } from '@/lib/search/adapter'
import {
  SEARCH_MAX_QUERY_LENGTH,
  SEARCH_MIN_QUERY_LENGTH,
  prepareSearchQuery,
} from '@/lib/search/normalization'
import { NavigationIcon } from '@/components/layout/NavigationIcon'

export async function SearchPage({
  locale,
  query,
  page,
}: {
  locale: Locale
  query: string
  page: number
}) {
  const t = await getTranslations({ locale, namespace: 'Search' })
  const titles = await getTranslations({ locale, namespace: 'Pages' })
  const searchHref = pageHref('search', locale)
  const trimmedQuery = query.trim()
  // Validation also runs inside the adapter, before any CMS work.
  const valid = prepareSearchQuery(trimmedQuery).valid
  const result = valid ? await searchAdapter.search({ query: trimmedQuery, locale, page }) : null
  const suggestions = ['platforms', 'programmes', 'publications', 'workWithUs'] as const

  function resultsHref(targetPage: number) {
    const params = new URLSearchParams({ q: trimmedQuery })
    if (targetPage > 1) params.set('page', String(targetPage))
    return `${searchHref}?${params}`
  }

  return (
    <div className="container search-page" id="page-sections">
      <div className="breadcrumb">
        <a href={pageHref('home', locale)}>{titles('home')}</a>
        <span aria-hidden="true"> / </span>
        <span>{titles('search')}</span>
      </div>
      <div className="search-heading">
        <p className="navigation-eyebrow">IRESEN</p>
        <h1>{titles('search')}</h1>
        <p>{t('description')}</p>
      </div>
      <form
        id="search-query"
        role="search"
        aria-label={t('resultsLabel')}
        action={searchHref}
        method="get"
        className="page-search-form"
      >
        <label htmlFor="page-search-input">{t('inputLabel')}</label>
        <div className="page-search-controls">
          <input
            id="page-search-input"
            name="q"
            type="search"
            dir="auto"
            placeholder={t('placeholder')}
            defaultValue={trimmedQuery.slice(0, SEARCH_MAX_QUERY_LENGTH)}
            minLength={SEARCH_MIN_QUERY_LENGTH}
            maxLength={SEARCH_MAX_QUERY_LENGTH}
            enterKeyHint="search"
            aria-describedby={
              trimmedQuery && !valid ? 'search-hint search-validation' : 'search-hint'
            }
            aria-invalid={trimmedQuery && !valid ? true : undefined}
            autoComplete="off"
            required
          />
          <button type="submit" className="button button-primary">
            <NavigationIcon name="search" />
            <span>{t('submit')}</span>
          </button>
        </div>
        <p id="search-hint" className="search-hint">
          {t('hint')}
        </p>
      </form>

      {trimmedQuery && (
        <a className="search-clear" href={searchHref}>
          {t('clear')}
        </a>
      )}
      <div id="results">
        {!trimmedQuery ? (
          <section className="search-empty">
            <h2>{t('startTitle')}</h2>
            <p>{t('startDescription')}</p>
            <ul className="search-suggestions">
              {suggestions.map((id) => (
                <li key={id}>
                  <a href={pageHref(id, locale)}>
                    {titles(id)}
                    <NavigationIcon name="arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : !valid ? (
          <p className="search-notice" role="status" id="search-validation">
            {t('invalidQuery', { min: SEARCH_MIN_QUERY_LENGTH, max: SEARCH_MAX_QUERY_LENGTH })}
          </p>
        ) : result?.status === 'unavailable' ? (
          <p className="search-notice" role="status">
            {t('unavailable')}
          </p>
        ) : result?.status === 'available' ? (
          <section aria-labelledby="search-results-heading" className="search-results">
            <div className="search-results-header">
              <h2 id="search-results-heading">
                {t('resultsFor')} <bdi>“{trimmedQuery}”</bdi>
              </h2>
              <p className="search-count">{t('resultCount', { count: result.total })}</p>
            </div>
            {result.contentUnavailable && (
              <p className="search-notice" role="status">
                {t('contentUnavailable')}
              </p>
            )}
            {result.items.length ? (
              <ol className="search-result-list" start={(result.page - 1) * result.pageSize + 1}>
                {result.items.map((item) => (
                  <li key={item.id} className="search-result">
                    <div className="search-result-meta">
                      <span>{t(`types.${item.type}`)}</span>
                      {item.publishedAt && (
                        <time dateTime={item.publishedAt}>
                          {new Intl.DateTimeFormat(locale, {
                            dateStyle: 'medium',
                            timeZone: 'Africa/Casablanca',
                          }).format(new Date(item.publishedAt))}
                        </time>
                      )}
                    </div>
                    <h3>
                      <a className="search-result-title" href={item.url}>
                        {item.title}
                        <NavigationIcon name="arrow" />
                      </a>
                    </h3>
                    <p className="search-result-excerpt">{item.excerpt}</p>
                    <p className="search-result-path">
                      <bdi>{item.url.split('?')[0]}</bdi>
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="search-empty" id="no-results">
                <h3>{t('noResultsTitle')}</h3>
                <p>{t('noResultsDescription')}</p>
              </div>
            )}
            {result.totalPages > 1 && (
              <nav className="search-pagination" aria-label={t('pagination')}>
                {result.page > 1 && (
                  <a href={resultsHref(result.page - 1)} rel="prev">
                    {t('previous')}
                  </a>
                )}
                <span>{t('pageOf', { page: result.page, total: result.totalPages })}</span>
                {result.page < result.totalPages && (
                  <a href={resultsHref(result.page + 1)} rel="next">
                    {t('next')}
                  </a>
                )}
              </nav>
            )}
          </section>
        ) : null}
      </div>
      <div className="search-help" id="refine-results">
        <p>{t('browseHelp')}</p>
        <a href={pageHref('sitemap', locale)}>{titles('sitemap')}</a>
        <a href={pageHref('contact', locale)}>{titles('contact')}</a>
      </div>
    </div>
  )
}
