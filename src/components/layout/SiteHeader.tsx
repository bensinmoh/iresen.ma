'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { isLocale, defaultLocale } from '@/i18n/locales'
import { usePathname } from '@/i18n/navigation'
import { navigationGroups, pageHref, pageIdFromPathname, type PageId } from '@/lib/site'
import { LocaleSelector } from './LocaleSelector'
import { SiteLogo } from '@/components/brand/SiteLogo'

export function SiteHeader() {
  const currentLocale = useLocale()
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale
  const t = useTranslations('Navigation')
  const pageTitle = useTranslations('Pages')
  const pathname = usePathname()
  const currentPageId = pageIdFromPathname(pathname)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (
        menuRef.current?.open &&
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        menuRef.current.open = false
      }
    }

    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Escape' || !(event.target instanceof HTMLElement)) return
    const details = event.target.closest<HTMLDetailsElement>('details[open]')
    if (details) {
      event.preventDefault()
      event.stopPropagation()
      details.open = false
      details.querySelector<HTMLElement>(':scope > summary')?.focus()
    }
  }

  function pageLink(pageId: PageId, className?: string) {
    return (
      <a
        href={pageHref(pageId, locale)}
        aria-current={currentPageId === pageId ? 'page' : undefined}
        className={className}
      >
        {pageTitle(pageId)}
      </a>
    )
  }

  function navigationGroup(group: (typeof navigationGroups)[number]) {
    return (
      <details className="navigation-group" key={group.id}>
        <summary>{t(group.id)}</summary>
        <ul>
          {group.pages.map((pageId) => (
            <li key={pageId}>{pageLink(pageId)}</li>
          ))}
        </ul>
      </details>
    )
  }

  return (
    <header
      className="site-header"
      ref={headerRef}
      onKeyDown={closeOnEscape}
      onBlur={(event) => {
        if (
          event.relatedTarget instanceof Node &&
          !event.currentTarget.contains(event.relatedTarget) &&
          menuRef.current
        ) {
          menuRef.current.open = false
        }
      }}
    >
      <div className="container header-row">
        <a href={pageHref('home', locale)} className="site-identity" aria-label="IRESEN">
          <SiteLogo eager />
        </a>
        <div className="header-actions">
          <div className="header-tools">
            {pageLink('search', 'utility-link')}
            {pageLink('contact', 'button button-outline')}
          </div>
          <LocaleSelector />
          <details className="site-menu" ref={menuRef}>
            <summary className="menu-toggle">
              <span>{t('menu')}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" />
              </svg>
            </summary>
            <nav
              aria-label={t('label')}
              className="menu-panel"
              onClick={(event) => {
                if (
                  event.target instanceof Element &&
                  event.target.closest('a') &&
                  menuRef.current
                ) {
                  menuRef.current.open = false
                }
              }}
            >
              <div className="container menu-content">
                <div className="menu-direct-link">{pageLink('home')}</div>
                <div className="menu-groups">
                  {navigationGroups.slice(0, 3).map(navigationGroup)}
                  <div className="menu-direct-link">{pageLink('transfer')}</div>
                  <div className="menu-direct-link">{pageLink('workWithUs')}</div>
                  {navigationGroups.slice(3).map(navigationGroup)}
                </div>
                <div className="menu-utilities">
                  {pageLink('search')}
                  {pageLink('contact')}
                </div>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
