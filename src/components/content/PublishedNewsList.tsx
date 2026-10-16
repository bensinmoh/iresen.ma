import { Heading } from '@/components/ui/Heading'
import type { Locale } from '@/i18n/locales'
import { findPublishedNews } from '@/lib/content/queries'
import { newsHref } from '@/lib/content/routes'

export async function PublishedNewsList({ locale }: { locale: Locale }) {
  const { docs } = await findPublishedNews(locale)
  if (!docs.length) return null
  return (
    <ul className="published-news-list">
      {docs.map(
        (article) =>
          article.slug && (
            <li key={article.id}>
              <Heading as="h3" size="compact">
                <a href={newsHref(article.slug, locale)}>{article.title}</a>
              </Heading>
              <p>{article.summary}</p>
            </li>
          ),
      )}
    </ul>
  )
}
