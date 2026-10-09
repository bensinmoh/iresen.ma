import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { isLocale } from '@/i18n/locales'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  // Locale links retain search parameters in the first HTML response, including
  // without JavaScript. Public CMS content already renders at request time.
  await connection()
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = await getTranslations({ locale, namespace: 'Navigation' })

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('skip')}
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
