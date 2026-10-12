'use client'

import { useTranslations } from 'next-intl'
import { openPreferences, useConsent } from './consent-store'

export function ConsentMap({ src, title }: { src: string; title: string }) {
  const t = useTranslations('CookieConsent')
  const { consent } = useConsent()
  return consent?.external ? (
    <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer" allowFullScreen />
  ) : (
    <div className="cookie-map-placeholder">
      <p>{t('mapBlocked')}</p>
      <button type="button" className="button button-outline" onClick={openPreferences}>
        {t('manage')}
      </button>
    </div>
  )
}
