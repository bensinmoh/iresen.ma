import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { defaultLocale, isLocale, localeDirection } from '@/i18n/locales'
import { getSiteUrl, isIndexingEnabled } from '@/lib/site'
import '@/styles/globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata')
  return {
    metadataBase: getSiteUrl(),
    title: { default: t('title'), template: '%s | IRESEN' },
    description: t('description'),
    icons: { icon: { url: '/brand/favicon.svg', type: 'image/svg+xml' } },
    robots: { index: isIndexingEnabled(), follow: isIndexingEnabled() },
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const requestedLocale = await getLocale()
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale
  const messages = await getMessages({ locale })

  return (
    <html lang={locale} dir={localeDirection(locale)}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Casablanca">
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
