import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { isLocale } from '@/i18n/locales'
import { pageIdFromPathname } from '@/lib/site'
import { EmptyPage } from '@/components/content/EmptyPage'
import { NotFoundPage } from '@/components/content/NotFoundPage'
import { createPageMetadata } from '../../page-metadata'

type ContentPageProps = { params: Promise<{ locale: string; path: string[] }> }

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

export default async function ContentPage({ params }: ContentPageProps) {
  const { locale, path } = await params
  const pageId = pageIdFromPathname(`/${path.join('/')}`)
  if (!isLocale(locale)) notFound()
  // The proxy sets HTTP 404 for unknown paths. Render their localized content
  // directly so the HTML remains readable without a streamed error replacement.
  if (!pageId) return <NotFoundPage locale={locale} />
  return <EmptyPage pageId={pageId} locale={locale} />
}
