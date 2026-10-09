import type { Locale } from '@/i18n/locales'
import type { News } from '@/payload-types'
import { getTranslations } from 'next-intl/server'
import { PageShell } from '@/components/layout/PageShell'
import { pageHref } from '@/lib/site'
import { PublishedBody } from './PublishedBody'

export async function NewsArticle({
  content,
  locale,
}: {
  content: Pick<News, 'title' | 'summary' | 'body' | 'publishedAt'>
  locale: Locale
}) {
  const t = await getTranslations({ locale, namespace: 'Pages' })
  return (
    <PageShell title={content.title ?? ''} locale={locale}>
      <article className="published-content">
        <a href={pageHref('news', locale)}>{t('news')}</a>
        {content.publishedAt && (
          <p className="published-date">
            <time dateTime={content.publishedAt}>
              {new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
                new Date(content.publishedAt),
              )}
            </time>
          </p>
        )}
        <p className="published-summary">{content.summary}</p>
        <PublishedBody body={content.body} />
      </article>
    </PageShell>
  )
}
