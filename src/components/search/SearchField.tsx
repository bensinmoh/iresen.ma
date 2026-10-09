'use client'

import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { SearchSuggestions, focusFirstSearchSuggestion } from './SearchSuggestions'

export function SearchField({ locale }: { locale: Locale }) {
  const t = useTranslations('Search')
  const inputRef = useRef<HTMLInputElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)
  const [dismissed, setDismissed] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestionsActive, setSuggestionsActive] = useState(false)

  function fitReveal() {
    const slot = slotRef.current
    const container = slot?.closest('.header-container')
    if (!slot || !container) return
    const slotBox = slot.getBoundingClientRect()
    const containerBox = container.getBoundingClientRect()
    const rtl = document.documentElement.dir === 'rtl'
    const available = rtl ? containerBox.right - slotBox.left : slotBox.right - containerBox.left
    const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const preferred = rootSize * (window.matchMedia('(max-width: 35rem)').matches ? 20 : 18)
    const width = Math.min(preferred, containerBox.width)
    const offset = Math.max(0, width - available)
    slot.style.setProperty('--header-search-width', `${width}px`)
    slot.style.setProperty('--header-search-offset', `${offset}px`)
  }

  useEffect(() => {
    window.addEventListener('resize', fitReveal)
    return () => window.removeEventListener('resize', fitReveal)
  }, [])

  return (
    <div
      className="header-search-slot"
      ref={slotRef}
      data-dismissed={dismissed || undefined}
      onPointerEnter={fitReveal}
      onPointerLeave={() => setDismissed(false)}
    >
      <Form
        action={pageHref('search', locale)}
        role="search"
        aria-label={t('headerLabel')}
        className="header-search-form"
        onFocus={(event) => {
          fitReveal()
          setDismissed(false)
          if (event.target instanceof HTMLInputElement && event.target === inputRef.current)
            setSuggestionsActive(true)
        }}
        onBlur={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !slotRef.current?.contains(event.relatedTarget)
          ) {
            setSuggestionsActive(false)
            setDismissed(true)
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && event.target === inputRef.current) {
            if (focusFirstSearchSuggestion(slotRef.current)) event.preventDefault()
            return
          }
          if (event.key !== 'Escape') return
          event.preventDefault()
          event.stopPropagation()
          setDismissed(true)
          setSuggestionsActive(false)
          if (event.target instanceof HTMLElement) event.target.blur()
        }}
        onSubmit={(event) => {
          if (!inputRef.current?.value.trim()) {
            event.preventDefault()
            inputRef.current?.focus()
            return
          }
          setSuggestionsActive(false)
        }}
      >
        <label className="search-sr-only" htmlFor="header-search-query">
          {t('inputLabel')}
        </label>
        <input
          ref={inputRef}
          id="header-search-query"
          type="search"
          name="q"
          onChange={(event) => {
            setQuery(event.target.value)
            setSuggestionsActive(true)
          }}
          maxLength={200}
          placeholder={t('placeholder')}
          autoComplete="off"
          enterKeyHint="search"
          dir="auto"
        />
        <button type="submit" className="header-search" aria-label={t('submit')}>
          <NavigationIcon name="search" />
        </button>
        {suggestionsActive && query.trim().length >= 2 && (
          <SearchSuggestions
            key={`${locale}:${query.trim()}`}
            locale={locale}
            query={query}
            active={suggestionsActive}
            onDismiss={() => setSuggestionsActive(false)}
          />
        )}
      </Form>
    </div>
  )
}
