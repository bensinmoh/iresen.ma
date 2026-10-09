'use client'

import { useLocale, useTranslations } from 'next-intl'
import { defaultLocale, isLocale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const requestedLocale = useLocale()
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale
  const t = useTranslations('States')

  return (
    <div className="container page-shell">
      <div className="page-heading">
        <h1>{t('errorTitle')}</h1>
      </div>
      <div className="page-content">
        <p>{t('errorDescription')}</p>
        <div className="state-actions">
          <button type="button" className="button button-primary" onClick={reset}>
            {t('retry')}
          </button>
          <a href={pageHref('home', locale)}>{t('backHome')}</a>
        </div>
      </div>
    </div>
  )
}
