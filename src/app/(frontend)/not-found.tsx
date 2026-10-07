import { getLocale, getTranslations } from 'next-intl/server'
import { defaultLocale, isLocale } from '@/i18n/locales'
import { NotFoundPage } from '@/components/content/NotFoundPage'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export default async function FrontendNotFound() {
  const requestedLocale = await getLocale()
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale
  const t = await getTranslations({ locale, namespace: 'Navigation' })

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t('skip')}
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <NotFoundPage locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
