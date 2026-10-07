import { getLocale } from 'next-intl/server'
import { defaultLocale, isLocale } from '@/i18n/locales'
import { NotFoundPage } from '@/components/content/NotFoundPage'

export default async function LocaleNotFound() {
  const requestedLocale = await getLocale()
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale
  return <NotFoundPage locale={locale} />
}
