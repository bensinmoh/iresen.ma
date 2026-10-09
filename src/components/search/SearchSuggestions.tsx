'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/locales'
import { searchTypes, type SearchItem } from '@/lib/search/types'
import { NavigationIcon } from '@/components/layout/NavigationIcon'

type SuggestionsResponse = {
  query: string
  locale: Locale
  items: SearchItem[]
  status: 'available' | 'unavailable'
}

function isPublicSuggestion(item: unknown, locale: Locale): item is SearchItem {
  if (!item || typeof item !== 'object') return false
  const result = item as Partial<SearchItem>
  return (
    typeof result.id === 'string' &&
    typeof result.title === 'string' &&
    typeof result.excerpt === 'string' &&
    typeof result.url === 'string' &&
    result.url.startsWith('/') &&
    !/^\/[\\/]/.test(result.url) &&
    result.locale === locale &&
    searchTypes.some((type) => type === result.type)
  )
}

export function focusFirstSearchSuggestion(container: HTMLElement | null) {
  const link = container?.querySelector<HTMLAnchorElement>('[data-search-suggestion]')
  link?.focus()
  return Boolean(link)
}

/** A small, cancellable preview; submitting the form always opens the full results. */
export function SearchSuggestions({
  locale,
  query,
  active,
  onDismiss,
}: {
  locale: Locale
  query: string
  active: boolean
  onDismiss: () => void
}) {
  const t = useTranslations('Search')
  const panelRef = useRef<HTMLDivElement>(null)
  const [response, setResponse] = useState<SuggestionsResponse | null>(null)
  const normalizedQuery = query.trim().slice(0, 200)
  const eligible = active && normalizedQuery.length >= 2

  useEffect(() => {
    if (!eligible) return
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const parameters = new URLSearchParams({ locale, q: normalizedQuery })
        const result = await fetch(`/api/search?${parameters}`, {
          signal: controller.signal,
          cache: 'no-store',
          credentials: 'same-origin',
        })
        if (!result.ok) throw new Error('Search suggestions unavailable')
        const data: unknown = await result.json()
        if (controller.signal.aborted) return
        const payload = data as { status?: unknown; items?: unknown }
        if (payload?.status !== 'available' || !Array.isArray(payload.items)) {
          throw new Error('Search suggestions unavailable')
        }
        setResponse({
          query: normalizedQuery,
          locale,
          status: 'available',
          items: payload.items.filter((item) => isPublicSuggestion(item, locale)).slice(0, 4),
        })
      } catch {
        if (controller.signal.aborted) return
        setResponse({ query: normalizedQuery, locale, status: 'unavailable', items: [] })
      }
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [eligible, locale, normalizedQuery])

  useEffect(() => {
    if (!eligible) return
    const handlePointerDown = (event: PointerEvent) => {
      const slot = panelRef.current?.closest('.header-search-slot')
      if (event.target instanceof Node && slot && !slot.contains(event.target)) onDismiss()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [eligible, onDismiss])

  if (!eligible) return null
  const current =
    response?.query === normalizedQuery && response.locale === locale ? response : null
  if (current?.status === 'unavailable') return null
  const items = current?.items ?? []

  return (
    <div
      ref={panelRef}
      id="header-search-suggestions"
      className="header-search-suggestions"
      onKeyDown={(event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
        const links = Array.from(
          event.currentTarget.querySelectorAll<HTMLAnchorElement>('[data-search-suggestion]'),
        )
        const index = links.indexOf(event.target as HTMLAnchorElement)
        if (index < 0) return
        event.preventDefault()
        if (event.key === 'ArrowUp' && index === 0) {
          event.currentTarget
            .closest('.header-search-slot')
            ?.querySelector<HTMLInputElement>('input[name="q"]')
            ?.focus()
          return
        }
        links[Math.min(links.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1))]?.focus()
      }}
    >
      <p id="header-search-suggestions-label" className="header-search-suggestions-label">
        {t('suggestions')}
      </p>
      <p className={current ? 'search-sr-only' : 'header-search-suggestions-status'} role="status">
        {!current ? t('searching') : items.length === 0 ? t('noSuggestions') : t('suggestions')}
      </p>
      {current && items.length === 0 && (
        <p className="header-search-suggestions-status" aria-hidden="true">
          {t('noSuggestions')}
        </p>
      )}
      {items.length > 0 && (
        <ul aria-labelledby="header-search-suggestions-label">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={item.url} data-search-suggestion onClick={onDismiss}>
                <span className="header-search-suggestion-content">
                  <span className="header-search-suggestion-type">{t(`types.${item.type}`)}</span>
                  <span className="header-search-suggestion-title" dir="auto">
                    {item.title}
                  </span>
                  {item.excerpt && (
                    <span className="header-search-suggestion-excerpt" dir="auto">
                      {item.excerpt}
                    </span>
                  )}
                </span>
                <NavigationIcon name="arrow" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
