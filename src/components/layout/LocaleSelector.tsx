'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, useSyncExternalStore } from 'react'
import { defaultLocale, isLocale, locales } from '@/i18n/locales'
import { usePathname } from '@/i18n/navigation'
import { isSupportedAnchor, pageHref, pageIdFromPathname } from '@/lib/site'

const languageNames = { fr: 'Français', en: 'English', ar: 'العربية' } as const
const languageLabels = { fr: 'FR', en: 'EN', ar: 'ع' } as const

function subscribeToHash(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function LocaleSelector({
  fullNames = false,
  variant = 'inline',
}: {
  fullNames?: boolean
  variant?: 'inline' | 'dropdown'
}) {
  const locale = useLocale()
  const currentLocale = isLocale(locale) ? locale : defaultLocale
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const pageId = pageIdFromPathname(pathname)
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => '',
  )
  const anchor = pageId && isSupportedAnchor(pageId, hash) ? hash : undefined
  const dropdownRef = useRef<HTMLDetailsElement>(null)
  const triggerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (variant !== 'dropdown') return

    function closeOutside(event: Event) {
      const dropdown = dropdownRef.current
      if (event.target instanceof Node && dropdown?.open && !dropdown.contains(event.target)) {
        dropdown.open = false
      }
    }

    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('focusin', closeOutside)
    }
  }, [variant])

  const links = locales.map((targetLocale) => (
    <a
      key={targetLocale}
      href={pageId ? pageHref(pageId, targetLocale, anchor) : `/${targetLocale}`}
      hrefLang={targetLocale}
      lang={targetLocale}
      dir={targetLocale === 'ar' ? 'rtl' : 'ltr'}
      aria-label={languageNames[targetLocale]}
      aria-current={targetLocale === locale ? 'true' : undefined}
    >
      {variant === 'dropdown' || fullNames
        ? languageNames[targetLocale]
        : languageLabels[targetLocale]}
    </a>
  ))

  if (variant === 'dropdown') {
    return (
      <nav aria-label={t('language')} className="locale-selector locale-selector-dropdown">
        <details
          ref={dropdownRef}
          className="locale-dropdown"
          onKeyDown={(event) => {
            if (event.key === 'Escape' && event.currentTarget.open) {
              event.preventDefault()
              event.stopPropagation()
              event.currentTarget.open = false
              triggerRef.current?.focus()
            }
          }}
        >
          <summary ref={triggerRef} className="locale-dropdown-trigger">
            <bdi lang={currentLocale} dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}>
              {languageNames[currentLocale]}
            </bdi>
            <svg
              aria-hidden="true"
              focusable="false"
              className="locale-dropdown-chevron"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="m4 6 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>
          <ul className="locale-dropdown-options">
            {links.map((link) => (
              <li key={link.key}>{link}</li>
            ))}
          </ul>
        </details>
      </nav>
    )
  }

  return (
    <nav aria-label={t('language')} className="locale-selector">
      {links}
    </nav>
  )
}
