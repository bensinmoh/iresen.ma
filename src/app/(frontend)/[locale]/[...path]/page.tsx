import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { pageIdFromPathname } from '@/lib/site'
import { EmptyPage } from '@/components/content/EmptyPage'
import { createPageMetadata } from '../../page-metadata'

type ContentPageProps = { params: Promise<{ locale: string; path: string[] }> }

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { locale, path } = await params
  const pageId = pageIdFromPathname(`/${path.join('/')}`)
  if (!isLocale(locale) || !pageId) notFound()
  return createPageMetadata(pageId, locale)
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { locale, path } = await params
  const pageId = pageIdFromPathname(`/${path.join('/')}`)
  if (!isLocale(locale) || !pageId) notFound()
  return <EmptyPage pageId={pageId} locale={locale} />
}
