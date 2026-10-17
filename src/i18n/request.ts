import { connection } from 'next/server'
import { siteMessages } from '@/lib/cms-workspace/site-content'
import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, isLocale } from './locales'

export default getRequestConfig(async ({ locale: explicitLocale, requestLocale }) => {
  const requestedLocale = explicitLocale ?? (await requestLocale)
  const locale = requestedLocale && isLocale(requestedLocale) ? requestedLocale : defaultLocale

  if (process.env.SITE_CONTENT_DATABASE_ENABLED === 'true') await connection()
  return {
    locale,
    messages: await siteMessages(locale, (await import(`../messages/${locale}.json`)).default),
    timeZone: 'Africa/Casablanca',
  }
})
