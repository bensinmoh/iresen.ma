'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react'
import { isLocale, defaultLocale } from '@/i18n/locales'
import { usePathname } from '@/i18n/navigation'
import { navigationGroups, pageHref, pageIdFromPathname, type PageId } from '@/lib/site'
import { navigationPanels, type NavigationGroup } from '@/lib/navigation'
import { homeFigures } from '@/lib/figures'
import { LocaleSelector } from './LocaleSelector'
import { HeaderSearch } from './HeaderSearch'
import { SiteLogo } from '@/components/brand/SiteLogo'
import { NavigationIcon } from './NavigationIcon'

export function SiteHeader() {
  const currentLocale = useLocale()
  const locale = isLocale(currentLocale) ? currentLocale : defaultLocale
  const t = useTranslations('Navigation')
  const pageTitle = useTranslations('Pages')
  const copy = useTranslations('Header')
  const figureCopy = useTranslations('Hero')
  const pathname = usePathname()
  const currentPageId = pageIdFromPathname(pathname)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDetailsElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHoverTimer = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = null
  }, [])

  const closeDisclosures = useCallback(() => {
    clearHoverTimer()
    headerRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((details) => {
      details.open = false
    })
  }, [clearHoverTimer])

  useEffect(() => {
    let lastHeaderFocus: Element | null = null

    function closeOutside(event: Event) {
      if (event.type === 'focusin' && event.target instanceof Element) {
        lastHeaderFocus = headerRef.current?.contains(event.target) ? event.target : null
      }
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        lastHeaderFocus = null
        closeDisclosures()
      }
    }

    const desktop = window.matchMedia('(min-width: 70rem)')
    function closeHoverOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      clearHoverTimer()
      const openGroup = headerRef.current?.querySelector<HTMLDetailsElement>(
        '.desktop-navigation-group[open]',
      )
      if (openGroup) {
        openGroup.open = false
        event.preventDefault()
      }
    }

    function changeLayout() {
      // Hiding a focused disclosure resets activeElement before matchMedia fires.
      const active =
        document.activeElement === document.body ? lastHeaderFocus : document.activeElement
      const desktopHasFocus =
        active instanceof Element && active.closest('.desktop-navigation') !== null
      const compactHasFocus = active instanceof Node && menuRef.current?.contains(active)
      const searchHasFocus =
        active instanceof Element && active.closest('.header-search-disclosure') !== null
      const groupId =
        active instanceof Element
          ? active.closest('[data-navigation-group]')?.getAttribute('data-navigation-group')
          : null
      closeDisclosures()

      if (searchHasFocus) {
        headerRef.current?.querySelector<HTMLElement>('.header-search')?.focus()
      } else if (!desktop.matches && desktopHasFocus) {
        menuRef.current?.querySelector<HTMLElement>(':scope > summary')?.focus()
      } else if (desktop.matches && compactHasFocus) {
        const target = groupId
          ? `.desktop-navigation-group[data-navigation-group="${groupId}"] > summary`
          : '.desktop-navigation .navigation-trigger'
        headerRef.current?.querySelector<HTMLElement>(target)?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    document.addEventListener('keydown', closeHoverOnEscape)
    desktop.addEventListener('change', changeLayout)
    return () => {
      clearHoverTimer()
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('focusin', closeOutside)
      document.removeEventListener('keydown', closeHoverOnEscape)
      desktop.removeEventListener('change', changeLayout)
    }
  }, [clearHoverTimer, closeDisclosures])

  function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Escape' || !(event.target instanceof HTMLElement)) return
    const details = event.target.closest<HTMLDetailsElement>('details[open]')
    if (details) {
      clearHoverTimer()
      event.preventDefault()
      event.stopPropagation()
      details.open = false
      details.querySelector<HTMLElement>(':scope > summary')?.focus()
    }
  }

  function pageLink(pageId: PageId, className?: string, label = pageTitle(pageId)) {
    return (
      <a
        href={pageHref(pageId, locale)}
        aria-current={currentPageId === pageId ? 'page' : undefined}
        className={className}
      >
        {label}
      </a>
    )
  }

  function navigationGroup(group: NavigationGroup) {
    return (
      <details className="navigation-group" data-navigation-group={group.id} key={group.id}>
        <summary>
          <span>{t(group.id)}</span>
        </summary>
        <ul>
          {group.pages.map((pageId) => (
            <li key={pageId}>{pageLink(pageId)}</li>
          ))}
        </ul>
      </details>
    )
  }

  function desktopGroup(group: NavigationGroup) {
    const panel = navigationPanels[group.id]
    const featureId = 'feature' in panel ? panel.feature : undefined
    const figureId = 'figureId' in panel ? panel.figureId : undefined
    const figure = figureId ? homeFigures.find(({ id }) => id === figureId) : undefined
    const isCurrent = group.pages.some((id) => id === currentPageId)

    return (
      <li key={group.id}>
        <details
          className="desktop-navigation-group"
          data-navigation-group={group.id}
          name="desktop-navigation"
          onBlur={(event) => {
            if (
              event.relatedTarget instanceof Node &&
              !event.currentTarget.contains(event.relatedTarget)
            ) {
              clearHoverTimer()
              event.currentTarget.open = false
            }
          }}
        >
          <summary
            className={`navigation-trigger${isCurrent ? ' navigation-current' : ''}`}
            onPointerEnter={(event) => {
              clearHoverTimer()
              if (
                event.pointerType !== 'mouse' ||
                !window.matchMedia('(hover: hover) and (pointer: fine)').matches
              )
                return
              // Keyboard focus owns its open panel; pointer exploration must not hide it.
              if (
                headerRef.current
                  ?.querySelector(
                    '.desktop-navigation-group[open], .header-search-disclosure[open]',
                  )
                  ?.contains(document.activeElement)
              )
                return
              const details = event.currentTarget.parentElement as HTMLDetailsElement
              hoverTimer.current = setTimeout(() => {
                details.open = true
              }, 140)
            }}
            onPointerLeave={clearHoverTimer}
            onClick={clearHoverTimer}
            onKeyDown={(event) => {
              clearHoverTimer()
              if (event.key !== 'ArrowDown') return
              event.preventDefault()
              const details = event.currentTarget.parentElement as HTMLDetailsElement
              details.open = true
              details.querySelector<HTMLAnchorElement>('.mega-menu-links a')?.focus()
            }}
          >
            <span>{t(group.id)}</span>
            <NavigationIcon name="chevron" />
          </summary>
          <div className="mega-menu">
            <div className={`header-container mega-menu-grid mega-menu-grid--${panel.layout}`}>
              <div className="mega-menu-intro">
                <div className="mega-menu-intro-copy">
                  <h2>{copy(`groups.${group.id}.title`)}</h2>
                  <p>{copy(`groups.${group.id}.description`)}</p>
                </div>
                {figure && (
                  <p className="key-figure mega-menu-figure">
                    <strong className="key-figure-value">
                      <bdi dir="ltr">{figure.value}</bdi>
                    </strong>
                    <span className="key-figure-label">{figureCopy(`figures.${figure.id}`)}</span>
                  </p>
                )}
              </div>
              <ul className="mega-menu-links">
                {group.pages.map((id) => (
                  <li key={id}>
                    <a
                      href={pageHref(id, locale)}
                      aria-current={currentPageId === id ? 'page' : undefined}
                    >
                      <span className="mega-menu-link-title">
                        {pageTitle(id)}
                        <NavigationIcon name="arrow" />
                      </span>
                      <span className="mega-menu-link-description">{copy(`pages.${id}`)}</span>
                    </a>
                  </li>
                ))}
              </ul>
              {featureId && (
                <a className="mega-menu-feature" href={pageHref(featureId, locale)}>
                  <span className="navigation-eyebrow">{copy('discover')}</span>
                  <span className="mega-menu-feature-title">{pageTitle(featureId)}</span>
                  <span className="mega-menu-feature-description">
                    {copy(`features.${featureId}`)}
                  </span>
                  <span className="mega-menu-feature-action">
                    {copy('explore')}
                    <NavigationIcon name="arrow" />
                  </span>
                </a>
              )}
            </div>
          </div>
        </details>
      </li>
    )
  }

  const inverse = currentPageId !== undefined && currentPageId !== 'contact'

  return (
    <header
      className={`site-header${inverse ? ' site-header-inverse site-header-overlay' : ''}`}
      ref={headerRef}
      onKeyDown={closeOnEscape}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest('a')) closeDisclosures()
      }}
      onPointerLeave={(event) => {
        clearHoverTimer()
        if (event.pointerType === 'mouse') {
          headerRef.current
            ?.querySelectorAll<HTMLDetailsElement>('.desktop-navigation-group[open]')
            .forEach((details) => {
              if (!details.contains(document.activeElement)) details.open = false
            })
        }
      }}
    >
      <div className="header-container header-frame">
        <div className="header-row">
          <a href={pageHref('home', locale)} className="site-identity" aria-label="IRESEN">
            <SiteLogo variant={inverse ? 'dark' : 'color'} eager />
          </a>
          <nav className="desktop-navigation" aria-label={t('label')}>
            <ul className="desktop-navigation-list">
              <li>{pageLink('home', 'navigation-trigger')}</li>
              {navigationGroups.slice(0, 3).map(desktopGroup)}
              <li>{pageLink('transfer', 'navigation-trigger')}</li>
              <li>{pageLink('workWithUs', 'navigation-trigger')}</li>
              {navigationGroups.slice(3).map(desktopGroup)}
            </ul>
          </nav>
          <div className="header-actions">
            <LocaleSelector />
            <div className="header-tools">
              <HeaderSearch
                action={pageHref('search', locale)}
                label={pageTitle('search')}
                placeholder={copy('searchPlaceholder')}
                restoreQuery={currentPageId === 'search'}
                onReveal={(hover) => {
                  clearHoverTimer()
                  const openGroup = headerRef.current?.querySelector<HTMLDetailsElement>(
                    '.desktop-navigation-group[open]',
                  )
                  const active = document.activeElement
                  if (
                    hover &&
                    active instanceof Element &&
                    (openGroup?.contains(active) ||
                      active.closest('.locale-selector, .desktop-navigation'))
                  )
                    return false
                  openGroup?.removeAttribute('open')
                  if (menuRef.current) menuRef.current.open = false
                  return true
                }}
              />
              {pageLink('contact', 'button button-primary header-contact', copy('contact'))}
            </div>
            <details className="site-menu" ref={menuRef}>
              <summary className="menu-toggle">
                <span>{t('menu')}</span>
                <svg
                  className="menu-icon"
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                >
                  <path
                    className="menu-icon-bars"
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    className="menu-icon-close"
                    d="m6 6 12 12M6 18 18 6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              </summary>
              <nav aria-label={t('label')} className="menu-panel">
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
      </div>
    </header>
  )
}
