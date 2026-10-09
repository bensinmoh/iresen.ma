import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { isLocale } from '@/i18n/locales'
import { pageIdFromPathname } from '@/lib/site'
import { EmptyPage } from '@/components/content/EmptyPage'
import { NotFoundPage } from '@/components/content/NotFoundPage'
import { SearchPage } from '@/components/search/SearchPage'
import { createPageMetadata } from '../../page-metadata'

type ContentPageProps = {
  params: Promise<{ locale: string; path: string[] }>
  searchParams: Promise<{
    q?: string | string[]
    page?: string | string[]
    article?: string | string[]
  }>
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { locale, path } = await params
  const pageId = pageIdFromPathname(`/${path.join('/')}`)
  if (!isLocale(locale)) notFound()
  if (!pageId) {
    const t = await getTranslations({ locale, namespace: 'States' })
    return { title: t('notFoundTitle'), robots: { index: false, follow: false } }
  }
  return createPageMetadata(pageId, locale)
}

export default async function ContentPage({ params, searchParams }: ContentPageProps) {
  const { locale, path } = await params
  const pageId = pageIdFromPathname(`/${path.join('/')}`)
  if (!isLocale(locale)) notFound()
  // The proxy sets HTTP 404 for unknown paths. Render their localized content
  // directly so the HTML remains readable without a streamed error replacement.
  if (!pageId) return <NotFoundPage locale={locale} />
  const query = await searchParams
  if (pageId === 'search') {
    const page =
      typeof query.page === 'string' && /^\d{1,6}$/.test(query.page) ? Number(query.page) : 1
    return (
      <SearchPage locale={locale} query={typeof query.q === 'string' ? query.q : ''} page={page} />
    )
  }
  return (
    <EmptyPage
      pageId={pageId}
      locale={locale}
      articleId={typeof query.article === 'string' ? query.article : undefined}
    />
  )
}
