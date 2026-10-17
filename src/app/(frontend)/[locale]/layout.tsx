import { cookies } from 'next/headers'
import { consentCookie, parseConsent } from '@/lib/cookie-consent'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { getTranslations } from 'next-intl/server'
import { isLocale } from '@/i18n/locales'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { CookieConsent } from '@/components/privacy/CookieConsent'
import { SiteMotion } from '@/components/layout/SiteMotion'
import { siteIndicatorTotals } from '@/lib/cms-workspace/indicator-totals'

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
  let initialConsent = null
  try {
    const raw = (await cookies()).get(consentCookie)?.value
    initialConsent = raw ? parseConsent(decodeURIComponent(raw)) : null
  } catch {
    /* Invalid or unavailable cookie storage never permits optional services. */
  }

  const totals = await siteIndicatorTotals(locale)
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('skip')}
      </a>
      <SiteHeader
        totalProjects={totals.projects}
        totalPublications={totals.publications}
        figureValues={totals}
      />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale} />
      <SiteMotion />
      <CookieConsent locale={locale} initialConsent={initialConsent} />
    </>
  )
}
