import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { findPublishedNews, findPublishedNewsArticle } from '@/lib/content/queries'
import { pageHref } from '@/lib/site'
import { PublishedContent } from './PublishedContent'

export async function PublishedNews({ locale, articleId }: { locale: Locale; articleId?: string }) {
  const states = await getTranslations({ locale, namespace: 'States' })
  const result = await Promise.allSettled([
    findPublishedNews(locale),
    articleId ? findPublishedNewsArticle(articleId, locale) : Promise.resolve(null),
  ])
  const [listingResult, articleResult] = result
  const articles = listingResult.status === 'fulfilled' ? listingResult.value.docs : []
  const article = articleResult.status === 'fulfilled' ? articleResult.value : null
  const unavailable = result.some((entry) => entry.status === 'rejected')
  if (unavailable) console.error('Published news could not be loaded.')
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'Africa/Casablanca' }).format(
      new Date(date),
    )

  return (
    <>
      {unavailable && (
        <div className="empty-state" role="status">
          <p>{states('contentUnavailable')}</p>
        </div>
      )}
      {articleId && articleResult.status === 'fulfilled' && !article && (
        <div className="empty-state">
          <p>{states('articleUnavailable')}</p>
        </div>
      )}
      {article && (
        <article className="published-news-article" id={`news-${article.id}`}>
          <h2>{article.title}</h2>
          {article.publishedAt && (
            <time className="published-news-date" dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          )}
          <PublishedContent summary={article.summary} body={article.body} locale={locale} />
        </article>
      )}
      {articles.length > 0 ? (
        <ul className="published-news-list">
          {articles.map((item) => (
            <li className="published-news-item" key={item.id}>
              <h2>
                <a href={`${pageHref('news', locale)}?article=${item.id}#news-${item.id}`}>
                  {item.title}
                </a>
              </h2>
              {item.publishedAt && (
                <time className="published-news-date" dateTime={item.publishedAt}>
                  {formatDate(item.publishedAt)}
                </time>
              )}
              {item.summary && <p>{item.summary}</p>}
            </li>
          ))}
        </ul>
      ) : (
        !unavailable &&
        !article && (
          <div className="empty-state">
            <p>{states('empty')}</p>
          </div>
        )
      )}
    </>
  )
}
