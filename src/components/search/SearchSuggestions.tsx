'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/locales'
import { searchTypes, type SearchItem } from '@/lib/search/types'
import { hasControlCharacters, highlightSearchText } from '@/lib/search/text'
import { pageHref } from '@/lib/site'
import { NavigationIcon } from '@/components/layout/NavigationIcon'

type SuggestionsResponse = {
  query: string
  locale: Locale
  items: SearchItem[]
  status: 'available' | 'unavailable'
  suggestedQuery?: string
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
    searchTypes.some((type) => type === result.type) &&
    (result.matchedQuery === undefined ||
      (typeof result.matchedQuery === 'string' && result.matchedQuery.length <= 200)) &&
    (result.matchKind === undefined ||
      ['exact', 'linguistic', 'typo', 'related'].some((kind) => kind === result.matchKind))
  )
}

export function focusFirstSearchSuggestion(container: HTMLElement | null) {
  const link = container?.querySelector<HTMLAnchorElement>('[data-search-suggestion]')
  link?.focus()
  return Boolean(link)
}

function highlight(text: string, query: string) {
  return highlightSearchText(text, query).map((part, index) =>
    part.match ? <mark key={index}>{part.text}</mark> : part.text,
  )
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
  const searchParams = useSearchParams()
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
        const payload = data as { status?: unknown; items?: unknown; suggestedQuery?: unknown }
        if (payload?.status !== 'available' || !Array.isArray(payload.items)) {
          throw new Error('Search suggestions unavailable')
        }
        setResponse({
          query: normalizedQuery,
          locale,
          status: 'available',
          items: payload.items.filter((item) => isPublicSuggestion(item, locale)).slice(0, 4),
          ...(typeof payload.suggestedQuery === 'string' &&
          payload.suggestedQuery.trim().length > 0 &&
          payload.suggestedQuery.length <= 200 &&
          !hasControlCharacters(payload.suggestedQuery)
            ? { suggestedQuery: payload.suggestedQuery.trim() }
            : {}),
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
      const slot = panelRef.current?.closest('.header-search-disclosure')
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
  const suggestedQuery =
    current?.suggestedQuery !== normalizedQuery ? current?.suggestedQuery : undefined
  const correctionParams = new URLSearchParams({ q: suggestedQuery ?? '' })
  const type = searchParams.get('type')
  if (searchTypes.some((value) => value === type)) correctionParams.set('type', type!)
  if (searchParams.get('sort') === 'newest') correctionParams.set('sort', 'newest')

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
            .closest('.header-search-disclosure')
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
        {!current
          ? t('searching')
          : suggestedQuery
            ? `${t('suggestionPrompt')} ${suggestedQuery}`
            : items.length === 0
              ? t('noSuggestions')
              : t('suggestions')}
      </p>
      {suggestedQuery && (
        <div className="header-search-correction">
          <span>{t('suggestionPrompt')}</span>
          <Link
            href={`${pageHref('search', locale)}?${correctionParams}`}
            aria-label={t('useSuggestion', { query: suggestedQuery })}
            data-search-suggestion
            data-search-correction
            onClick={onDismiss}
          >
            <bdi dir="auto">{suggestedQuery}</bdi>
            <NavigationIcon name="arrow" />
          </Link>
        </div>
      )}
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
                  <span className="header-search-suggestion-meta">
                    <span className="header-search-suggestion-type">{t(`types.${item.type}`)}</span>
                    {(item.matchKind === 'typo' || item.matchKind === 'related') && (
                      <span className="search-match-badge" data-search-match-kind={item.matchKind}>
                        {t(item.matchKind === 'typo' ? 'matchTypo' : 'matchRelated')}
                      </span>
                    )}
                  </span>
                  <span className="header-search-suggestion-title" dir="auto">
                    {highlight(item.title, item.matchedQuery || normalizedQuery)}
                  </span>
                  {item.excerpt && (
                    <span className="header-search-suggestion-excerpt" dir="auto">
                      {highlight(item.excerpt, item.matchedQuery || normalizedQuery)}
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
