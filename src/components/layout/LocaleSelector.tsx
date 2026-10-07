'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useSyncExternalStore } from 'react'
import { locales } from '@/i18n/locales'
import { usePathname } from '@/i18n/navigation'
import { isSupportedAnchor, pageHref, pageIdFromPathname } from '@/lib/site'

const languageNames = { fr: 'Français', en: 'English', ar: 'العربية' } as const
const languageLabels = { fr: 'FR', en: 'EN', ar: 'ع' } as const

function subscribeToHash(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function LocaleSelector({ fullNames = false }: { fullNames?: boolean }) {
  const locale = useLocale()
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const pageId = pageIdFromPathname(pathname)
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => '',
  )
  const anchor = pageId && isSupportedAnchor(pageId, hash) ? hash : undefined

  return (
    <nav aria-label={t('language')} className="locale-selector">
      {locales.map((targetLocale) => (
        <a
          key={targetLocale}
          href={pageId ? pageHref(pageId, targetLocale, anchor) : `/${targetLocale}`}
          hrefLang={targetLocale}
          lang={targetLocale}
          dir={targetLocale === 'ar' ? 'rtl' : 'ltr'}
          aria-label={languageNames[targetLocale]}
          aria-current={targetLocale === locale ? 'true' : undefined}
        >
          {fullNames ? languageNames[targetLocale] : languageLabels[targetLocale]}
        </a>
      ))}
    </nav>
  )
}
