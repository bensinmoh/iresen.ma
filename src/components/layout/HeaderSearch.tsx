'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from 'react'
import type { Locale } from '@/i18n/locales'
import {
  SearchSuggestions,
  focusFirstSearchSuggestion,
} from '@/components/search/SearchSuggestions'
import { NavigationIcon } from './NavigationIcon'

type HeaderSearchProps = {
  locale: Locale
  action: string
  label: string
  placeholder: string
  restoreQuery: boolean
  onReveal: (hover: boolean) => boolean
}

export function HeaderSearch({
  locale,
  action,
  label,
  placeholder,
  restoreQuery,
  onReveal,
}: HeaderSearchProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const inputId = useId()
  const searchParams = useSearchParams()
  const restoredQuery = restoreQuery ? (searchParams.get('q') ?? '').slice(0, 200) : undefined
  const [query, setQuery] = useState('')
  const [suggestionsActive, setSuggestionsActive] = useState(false)

  const measure = useCallback(() => {
    const details = detailsRef.current
    const container = details?.closest('.header-container')
    if (!details || !container) return
    const trigger = details.getBoundingClientRect()
    const bounds = container.getBoundingClientRect()
    const rtl = getComputedStyle(details).direction === 'rtl'
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const startSpace = rtl ? bounds.right - trigger.left : trigger.right - bounds.left
    const endSpace = rtl ? trigger.right - bounds.left : bounds.right - trigger.left
    const flip = startSpace < trigger.width + 8 * rem && endSpace > startSpace
    const space = flip ? endSpace : startSpace
    details.dataset.searchSide = flip ? 'end' : 'start'
    details.style.setProperty(
      '--header-search-field-width',
      `${Math.max(0, Math.min(22 * rem, space) - trigger.width + 1)}px`,
    )
  }, [])

  useEffect(() => {
    const details = detailsRef.current!
    details.dataset.searchReady = 'true'
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(details)
    const container = details.closest('.header-container')
    if (container) observer.observe(container)

    function closeOutside(event: Event) {
      if (event.target instanceof Node && !details.contains(event.target)) details.open = false
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented || !details.open) return
      const restoreFocus = details.contains(document.activeElement)
      details.open = false
      event.preventDefault()
      if (restoreFocus) details.querySelector<HTMLElement>('summary')?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      observer.disconnect()
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('focusin', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [measure])

  function activate(event: MouseEvent<HTMLElement>) {
    event.preventDefault()
    const details = detailsRef.current!
    if (!details.open) {
      if (!onReveal(false)) return
      measure()
      details.open = true
      inputRef.current?.focus()
    } else if (inputRef.current?.value.trim()) {
      formRef.current?.requestSubmit()
    } else {
      inputRef.current?.focus()
    }
  }

  return (
    <details
      className="header-search-disclosure"
      ref={detailsRef}
      onToggle={(event) => {
        if (event.currentTarget.open) measure()
        else setSuggestionsActive(false)
      }}
      onBlur={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          event.currentTarget.open = false
          setSuggestionsActive(false)
        }
      }}
      onKeyDown={(event) => {
        if (
          event.key === 'ArrowDown' &&
          event.target === inputRef.current &&
          focusFirstSearchSuggestion(detailsRef.current)
        )
          event.preventDefault()
      }}
      onPointerEnter={(event) => {
        if (
          event.pointerType === 'mouse' &&
          window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
          onReveal(true)
        ) {
          measure()
          event.currentTarget.open = true
        }
      }}
      onPointerLeave={(event) => {
        if (
          event.pointerType === 'mouse' &&
          !event.currentTarget.contains(document.activeElement)
        ) {
          event.currentTarget.open = false
        }
      }}
    >
      <summary className="header-search glass-surface" aria-label={label} onClick={activate}>
        <span className="glass-reflection" aria-hidden="true" />
        <NavigationIcon name="search" />
        <span className="header-search-title">{label}</span>
      </summary>
      <form
        className="header-search-form"
        action={action}
        method="get"
        role="search"
        aria-label={label}
        ref={formRef}
        onFocus={(event) => {
          if (event.target instanceof HTMLInputElement) {
            setQuery(event.target.value)
            setSuggestionsActive(true)
          }
        }}
        onSubmit={(event) => {
          const input = inputRef.current!
          input.value = input.value.trim()
          if (!input.value) {
            event.preventDefault()
            input.reportValidity()
          } else {
            setSuggestionsActive(false)
          }
        }}
      >
        <label className="header-search-label" htmlFor={inputId}>
          {label}
        </label>
        <input
          key={restoredQuery}
          id={inputId}
          ref={inputRef}
          type="search"
          name="q"
          defaultValue={restoredQuery}
          maxLength={200}
          enterKeyHint="search"
          dir="auto"
          onChange={(event) => {
            setQuery(event.target.value)
            setSuggestionsActive(true)
          }}
          placeholder={placeholder}
          autoComplete="off"
          required
        />
      </form>
      {suggestionsActive && query.trim().length >= 2 && (
        <SearchSuggestions
          key={`${locale}:${query.trim()}`}
          locale={locale}
          query={query}
          active={suggestionsActive}
          onDismiss={() => setSuggestionsActive(false)}
        />
      )}
    </details>
  )
}
