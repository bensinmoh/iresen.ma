import Form from 'next/form'
import Link from 'next/link'
import { getFormatter, getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { searchTypes } from '@/lib/search/types'
import type { SearchResult, SearchType } from '@/lib/search/adapter'
import { highlightSearchText } from '@/lib/search/text'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { SearchSubmit } from './SearchSubmit'
import { SearchResultPreview } from './SearchResultPreview'
import { searchResultPreviews } from '@/lib/search/previews'

type SearchPageProps = {
  locale: Locale
  query: string
  result?: SearchResult
  type?: SearchType | 'all'
  sort?: 'relevance' | 'newest'
  error?: 'invalid'
}

const resultTypes = searchTypes

function highlight(text: string, query: string) {
  return highlightSearchText(text, query).map((part, index) =>
    part.match ? <mark key={index}>{part.text}</mark> : part.text,
  )
}

function pageNumbers(current: number, total: number) {
  return Array.from(
    new Set([1, total, current - 2, current - 1, current, current + 1, current + 2]),
  )
    .filter((page) => page >= 1 && page <= total)
    .sort((left, right) => left - right)
}

export async function SearchPage({
  locale,
  query,
  result,
  type = 'all',
  sort = 'relevance',
  error,
}: SearchPageProps) {
  const [t, pages, format] = await Promise.all([
    getTranslations({ locale, namespace: 'Search' }),
    getTranslations({ locale, namespace: 'Pages' }),
    getFormatter({ locale }),
  ])
  const searchHref = pageHref('search', locale)
  const activeQuery = (result?.status === 'available' ? result.query : query).slice(0, 200)
  const suggestedQuery = result?.status === 'available' ? result.suggestedQuery : undefined
  const previews = await searchResultPreviews(
    result?.status === 'available' ? result.items : [],
    locale,
  )

  function resultsHref(nextType = type, page = 1, nextQuery = activeQuery) {
    const params = new URLSearchParams({ q: nextQuery })
    if (nextType !== 'all') params.set('type', nextType)
    if (sort !== 'relevance') params.set('sort', sort)
    if (page > 1) params.set('page', String(page))
    return `${searchHref}?${params.toString()}`
  }

  return (
    <div className="container search-page">
      <div className="breadcrumb">
        <a href={pageHref('home', locale)}>{pages('home')}</a>
      </div>
      <div className="search-heading">
        <h1>{pages('search')}</h1>
        <p>{t('description')}</p>
      </div>
      <Form
        action={searchHref}
        role="search"
        aria-label={t('formLabel')}
        className="search-query-form"
      >
        <div className="search-query-field">
          <label className="search-sr-only" htmlFor="search-query">
            {t('inputLabel')}
          </label>
          <input
            key={activeQuery}
            id="search-query"
            name="q"
            type="search"
            defaultValue={activeQuery}
            maxLength={200}
            placeholder={t('placeholder')}
            enterKeyHint="search"
            dir="auto"
          />
        </div>
        <SearchSubmit />
      </Form>

      {error === 'invalid' ? (
        <section className="search-state" aria-labelledby="search-invalid-title" role="status">
          <h2 id="search-invalid-title">{t('invalidTitle')}</h2>
          <p>{t('invalidDescription')}</p>
        </section>
      ) : !activeQuery ? (
        <section className="search-state" aria-labelledby="search-start-title">
          <h2 id="search-start-title">{t('startTitle')}</h2>
          <p>{t('startDescription')}</p>
          <div className="search-state-actions">
            {(['institute', 'programmes', 'publications', 'media'] as const).map((id) => (
              <a href={pageHref(id, locale)} key={id}>
                {pages(id)}
              </a>
            ))}
          </div>
        </section>
      ) : result?.status === 'unavailable' || !result ? (
        <section className="search-state" aria-labelledby="search-error-title" role="status">
          <h2 id="search-error-title">{t('errorTitle')}</h2>
          <p>{t('errorDescription')}</p>
          <div className="search-state-actions">
            <a href={resultsHref()}>{t('retry')}</a>
          </div>
        </section>
      ) : (
        <>
          <div className="search-controls">
            <nav className="search-facets" aria-label={t('filterLabel')}>
              <ul>
                {(['all', ...resultTypes] as const).map((facet) => (
                  <li key={facet}>
                    <Link
                      href={resultsHref(facet)}
                      aria-current={type === facet ? 'true' : undefined}
                    >
                      <span>{t(`types.${facet}`)}</span>
                      <span className="search-facet-count">
                        {format.number(
                          facet === 'all'
                            ? Object.values(result.facets).reduce((sum, count) => sum + count, 0)
                            : result.facets[facet],
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Form action={searchHref} className="search-sort-form">
              <input type="hidden" name="q" value={activeQuery} />
              {type !== 'all' && <input type="hidden" name="type" value={type} />}
              <label htmlFor="search-sort">{t('sortLabel')}</label>
              <div className="search-sort-select">
                <select key={sort} id="search-sort" name="sort" defaultValue={sort}>
                  <option value="relevance">{t('relevance')}</option>
                  <option value="newest">{t('newest')}</option>
                </select>
                <NavigationIcon name="chevron" />
              </div>
              <button className="button button-outline" type="submit">
                {t('apply')}
              </button>
            </Form>
          </div>
          {suggestedQuery && suggestedQuery !== activeQuery && (
            <p className="search-correction">
              <span>{t('suggestionPrompt')}</span>
              <Link
                href={resultsHref(type, 1, suggestedQuery)}
                aria-label={t('useSuggestion', { query: suggestedQuery })}
                data-search-correction
              >
                <bdi dir="auto">{suggestedQuery}</bdi>
              </Link>
            </p>
          )}
          <p className="search-summary" role="status" aria-live="polite">
            {t('resultCount', { count: result.total })}
            {' · '}
            <bdi dir="auto">{activeQuery}</bdi>
          </p>
          {result.items.length === 0 ? (
            <section className="search-state" aria-labelledby="search-empty-title">
              <h2 id="search-empty-title">{t('emptyTitle')}</h2>
              <p>{t('emptyDescription')}</p>
              {type !== 'all' && (
                <div className="search-state-actions">
                  <Link href={resultsHref('all')}>{t('clearFilters')}</Link>
                </div>
              )}
            </section>
          ) : (
            <ol className="search-results" aria-label={t('resultsLabel')}>
              {result.items.map((item) => (
                <li key={item.id}>
                  <article
                    className={`search-result${previews[item.id] ? ' search-result-with-preview' : ''}`}
                  >
                    <div className="search-result-content">
                      <div className="search-result-meta">
                        <span className="search-result-type">{t(`types.${item.type}`)}</span>
                        {(item.matchKind === 'typo' || item.matchKind === 'related') && (
                          <span
                            className="search-match-badge"
                            data-search-match-kind={item.matchKind}
                          >
                            {t(item.matchKind === 'typo' ? 'matchTypo' : 'matchRelated')}
                          </span>
                        )}
                        {item.publishedAt && Number.isFinite(Date.parse(item.publishedAt)) && (
                          <time dateTime={item.publishedAt}>
                            {format.dateTime(new Date(item.publishedAt), { dateStyle: 'medium' })}
                          </time>
                        )}
                      </div>
                      <h2>
                        <a href={item.url}>
                          <span>{highlight(item.title, item.matchedQuery || activeQuery)}</span>
                          <NavigationIcon name="arrow" />
                        </a>
                      </h2>
                      {item.excerpt && (
                        <p>{highlight(item.excerpt, item.matchedQuery || activeQuery)}</p>
                      )}
                      <bdi className="search-result-url" dir="auto">
                        {item.url}
                      </bdi>
                    </div>
                    {previews[item.id] && (
                      <SearchResultPreview
                        preview={previews[item.id]}
                        title={item.title}
                        destination={item.url}
                      />
                    )}
                  </article>
                </li>
              ))}
            </ol>
          )}
          {result.totalPages > 1 && (
            <nav className="search-pagination" aria-label={t('paginationLabel')}>
              {result.page > 1 && (
                <Link href={resultsHref(type, result.page - 1)} rel="prev">
                  {t('previous')}
                </Link>
              )}
              {pageNumbers(result.page, result.totalPages).map((page, index, numbers) => (
                <span key={page} className="search-pagination-item">
                  {index > 0 && page - numbers[index - 1]! > 1 && (
                    <span className="search-pagination-gap" aria-hidden="true">
                      …
                    </span>
                  )}
                  <Link
                    href={resultsHref(type, page)}
                    aria-current={page === result.page ? 'page' : undefined}
                    aria-label={t('pageLabel', { page })}
                  >
                    {format.number(page)}
                  </Link>
                </span>
              ))}
              {result.page < result.totalPages && (
                <Link href={resultsHref(type, result.page + 1)} rel="next">
                  {t('next')}
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  )
}
