import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locales'
import { HomePage } from '@/components/home/HomePage'
import { createPageMetadata } from '../page-metadata'

type HomePageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return createPageMetadata('home', locale)
}

export default async function LocaleHomePage({ params }: HomePageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <HomePage locale={locale} />
}
