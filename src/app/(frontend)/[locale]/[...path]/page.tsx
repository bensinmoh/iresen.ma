import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { isLocale } from '@/i18n/locales'
import { pageIdFromPathname } from '@/lib/site'
import { EmptyPage } from '@/components/content/EmptyPage'
import { NotFoundPage } from '@/components/content/NotFoundPage'
import { ContactPage } from '@/components/contact/ContactPage'
import { TransferPage } from '@/components/transfer/TransferPage'
import { findPatent } from '@/lib/patents'
import { EngagementPage } from '@/components/engagement/EngagementPage'
import { isContactTopic } from '@/lib/contact'
import { createPageMetadata } from '../../page-metadata'
import { newsHref, newsSlugFromPath } from '@/lib/content/routes'
import { findPublishedNewsBySlug } from '@/lib/content/queries'
import { NewsArticle } from '@/components/content/NewsArticle'
import { getSiteUrl, isIndexingEnabled } from '@/lib/site'
import { searchAdapter, validateSearchInput, type SearchInput } from '@/lib/search/adapter'
import { SearchPage } from '@/components/search/SearchPage'

type ContentPageProps = {
  params: Promise<{ locale: string; path: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { locale, path } = await params
  const pageId = pageIdFromPathname(`/${path.join('/')}`)
  if (!isLocale(locale)) notFound()
  if (!pageId) {
    const slug = newsSlugFromPath(`/${path.join('/')}`, locale)
    const article = slug ? await findPublishedNewsBySlug(slug, locale) : null
    if (article)
      return {
        title: article.seo?.title || article.title,
        description: article.seo?.description || article.summary,
        alternates: { canonical: new URL(newsHref(slug!, locale), getSiteUrl()).toString() },
        robots: { index: isIndexingEnabled(), follow: isIndexingEnabled() },
      }
    const t = await getTranslations({ locale, namespace: 'States' })
    return { title: t('notFoundTitle'), robots: { index: false, follow: false } }
  }
  return createPageMetadata(pageId, locale)
}

export default async function ContentPage({ params, searchParams }: ContentPageProps) {
  const { locale, path } = await params
  const pageId = pageIdFromPathname(`/${path.join('/')}`)
  if (!isLocale(locale)) notFound()
  if (pageId === 'search') {
    const parameters = await searchParams
    const query = typeof parameters.q === 'string' ? parameters.q : ''
    const input: SearchInput = {
      query,
      locale,
      type: (parameters.type ?? 'all') as SearchInput['type'],
      sort: (parameters.sort ?? 'relevance') as SearchInput['sort'],
      page: parameters.page === undefined ? 1 : Number(parameters.page),
    }
    const valid =
      !['q', 'type', 'sort', 'page'].some((key) => Array.isArray(parameters[key])) &&
      validateSearchInput(input)
    if (!valid) return <SearchPage locale={locale} query={query.slice(0, 200)} error="invalid" />
    const result = query.trim() ? await searchAdapter.search(input) : undefined
    return (
      <SearchPage
        locale={locale}
        query={query}
        type={input.type}
        sort={input.sort}
        result={result}
      />
    )
  }
  if (!pageId) {
    const slug = newsSlugFromPath(`/${path.join('/')}`, locale)
    if (slug) {
      const article = await findPublishedNewsBySlug(slug, locale)
      if (!article) notFound()
      return <NewsArticle content={article} locale={locale} />
    }
  }
  // The proxy sets HTTP 404 for unknown paths. Render their localized content
  // directly so the HTML remains readable without a streamed error replacement.
  if (!pageId) return <NotFoundPage locale={locale} />
  if (pageId === 'contact') {
    const { subject, patent } = await searchParams
    const topic = typeof subject === 'string' && isContactTopic(subject) ? subject : undefined
    return <ContactPage locale={locale} initialTopic={topic} initialPatent={findPatent(patent)} />
  }
  if (pageId === 'transfer') return <TransferPage locale={locale} />
  if (pageId === 'workWithUs') return <EngagementPage pageId={pageId} locale={locale} />
  return <EmptyPage pageId={pageId} locale={locale} />
}
