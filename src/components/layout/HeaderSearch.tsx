'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { SEARCH_MAX_QUERY_LENGTH, SEARCH_MIN_QUERY_LENGTH } from '@/lib/search/normalization'
import { NavigationIcon } from './NavigationIcon'

export function HeaderSearch({ locale }: { locale: Locale }) {
  const t = useTranslations('Search')
  const [expanded, setExpanded] = useState(false)
  const slotRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const revealOnClick = useRef(false)

  const updateAvailableWidth = useCallback(() => {
    const slot = slotRef.current
    if (!slot || !formRef.current) return
    const bounds = slot.getBoundingClientRect()
    const left = slot.closest('.header-container')?.getBoundingClientRect().left ?? 0
    const available = Math.max(bounds.width, Math.floor(bounds.right - left))
    formRef.current.style.setProperty('--header-search-available-width', `${available}px`)
  }, [])

  function revealSearch() {
    updateAvailableWidth()
    setExpanded(true)
  }

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return
    const observer = new ResizeObserver(updateAvailableWidth)
    observer.observe(slot)
    const container = slot.closest('.header-container')
    if (container) observer.observe(container)
    window.addEventListener('resize', updateAvailableWidth)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateAvailableWidth)
    }
  }, [updateAvailableWidth])

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !formRef.current?.contains(event.target)) {
        if (document.activeElement === inputRef.current) inputRef.current?.blur()
        setExpanded(false)
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  return (
    <div className="header-search-slot" ref={slotRef}>
      <form
        ref={formRef}
        className="header-search"
        data-expanded={expanded}
        role="search"
        aria-label={t('headerLabel')}
        action={pageHref('search', locale)}
        method="get"
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') revealSearch()
        }}
        onPointerLeave={(event) => {
          if (
            event.pointerType === 'mouse' &&
            !event.currentTarget.contains(document.activeElement)
          ) {
            setExpanded(false)
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && expanded) {
            event.preventDefault()
            event.stopPropagation()
            buttonRef.current?.focus()
            setExpanded(false)
          }
        }}
      >
        <label className="visually-hidden" htmlFor="header-search-input">
          {t('inputLabel')}
        </label>
        <input
          ref={inputRef}
          id="header-search-input"
          className="header-search-input"
          type="search"
          name="q"
          dir="auto"
          placeholder={t('placeholder')}
          minLength={SEARCH_MIN_QUERY_LENGTH}
          maxLength={SEARCH_MAX_QUERY_LENGTH}
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
          enterKeyHint="search"
          autoComplete="off"
          onFocus={revealSearch}
        />
        <button
          ref={buttonRef}
          className="header-search-toggle"
          type="submit"
          aria-label={t('submit')}
          aria-expanded={expanded}
          aria-controls="header-search-input"
          onPointerDown={() => {
            // Focus can open the form before click fires. Preserve the initial tap intent.
            revealOnClick.current = !expanded
          }}
          onFocus={revealSearch}
          onClick={(event) => {
            const shouldReveal = revealOnClick.current || !inputRef.current?.value.trim()
            revealOnClick.current = false
            if (shouldReveal) {
              event.preventDefault()
              // Commit the revealed field before focusing; keep touch keyboard activation
              // in the same user gesture rather than a deferred effect.
              flushSync(revealSearch)
              inputRef.current?.focus()
            }
          }}
        >
          <NavigationIcon name="search" />
        </button>
      </form>
    </div>
  )
}
