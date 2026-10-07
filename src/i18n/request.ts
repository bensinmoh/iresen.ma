import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, isLocale } from './locales'

export default getRequestConfig(async ({ locale: explicitLocale, requestLocale }) => {
  const requestedLocale = explicitLocale ?? (await requestLocale)
  const locale = requestedLocale && isLocale(requestedLocale) ? requestedLocale : defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Africa/Casablanca',
  }
})
