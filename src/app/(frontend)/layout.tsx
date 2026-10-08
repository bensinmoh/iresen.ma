import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import { defaultLocale, isLocale, localeDirection } from '@/i18n/locales'
import { getSiteUrl, isIndexingEnabled } from '@/lib/site'
import '@/styles/globals.css'

const plusJakartaSans = localFont({
  src: '../../fonts/plus-jakarta-sans/plus-jakarta-sans-latin-variable.woff2',
  variable: '--font-plus-jakarta-sans',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
})

const alexandria = localFont({
  src: '../../fonts/alexandria/alexandria-arabic-variable.woff2',
  variable: '--font-alexandria',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  adjustFontFallback: false,
  // Preserve the source subset's range so its nominal Latin glyphs stay unused.
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0897-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC,U+102E0-102FB,U+10E60-10E7E,U+10EC2-10EC4,U+10EFC-10EFF,U+1EE00-1EE03,U+1EE05-1EE1F,U+1EE21-1EE22,U+1EE24,U+1EE27,U+1EE29-1EE32,U+1EE34-1EE37,U+1EE39,U+1EE3B,U+1EE42,U+1EE47,U+1EE49,U+1EE4B,U+1EE4D-1EE4F,U+1EE51-1EE52,U+1EE54,U+1EE57,U+1EE59,U+1EE5B,U+1EE5D,U+1EE5F,U+1EE61-1EE62,U+1EE64,U+1EE67-1EE6A,U+1EE6C-1EE72,U+1EE74-1EE77,U+1EE79-1EE7C,U+1EE7E,U+1EE80-1EE89,U+1EE8B-1EE9B,U+1EEA1-1EEA3,U+1EEA5-1EEA9,U+1EEAB-1EEBB,U+1EEF0-1EEF1',
    },
  ],
})

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
    <html
      lang={locale}
      dir={localeDirection(locale)}
      className={`${plusJakartaSans.variable} ${alexandria.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Casablanca">
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
