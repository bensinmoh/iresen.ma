'use client'

import { useRef, useState, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import type { Locale } from '@/i18n/locales'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { PublicationFilters } from './PublicationFilters'
import styles from './PublicationsPage.module.css'

type Notice = {
  id: string
  title: string
  authors: string | null
  doiUrl: string | null
  year: number
  topics: string[]
  topicLabel: string
}
type Copy = Record<
  | 'filters'
  | 'domain'
  | 'year'
  | 'reset'
  | 'empty'
  | 'read'
  | 'noDoi'
  | 'noAuthors'
  | 'more'
  | 'count'
  | 'noScript',
  string
>
const subscribeToHydration = () => () => {}

export function PublicationCatalogue({
  locale,
  base,
  query,
  initialTopics,
  initialYears,
  initialLimit,
  initialSelection,
  records,
  topics,
  years,
  copy,
}: {
  locale: Locale
  base: string
  query: string
  initialTopics: string[]
  initialYears: string[]
  initialLimit: number
  initialSelection: string
  records: Notice[]
  topics: { id: string; label: string; count: number }[]
  years: { year: number; count: number }[]
  copy: Copy
}) {
  const [selectedTopics, setTopics] = useState(initialTopics)
  const [selectedYears, setYears] = useState(initialYears)
  const [resultFilters, setResultFilters] = useState({ topics: initialTopics, years: initialYears })
  const [limit, setLimit] = useState(initialLimit)
  const [selection, setSelection] = useState(initialSelection)
  const ready = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  )
  const desired = useRef({ topics: initialTopics, years: initialYears, limit: initialLimit })
  const transition = useRef<ViewTransition | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const selected = records.find((p) => p.id === selection)
  const results = records.filter(
    (p) =>
      (!resultFilters.topics.length || p.topics.some((id) => resultFilters.topics.includes(id))) &&
      (!resultFilters.years.length || resultFilters.years.includes(String(p.year))),
  )
  const visible = selected ? [selected] : results.slice(0, limit)
  // Each facet counts the current query plus the other group. OR options remain
  // available within their own group, rather than turning every unchecked item to zero.
  const topicCount = (id: string) =>
    records.filter(
      (p) =>
        p.topics.includes(id) && (!selectedYears.length || selectedYears.includes(String(p.year))),
    ).length
  const yearCount = (year: number) =>
    records.filter(
      (p) =>
        p.year === year &&
        (!selectedTopics.length || p.topics.some((id) => selectedTopics.includes(id))),
    ).length

  const url = (nextTopics: string[], nextYears: string[], nextLimit = 6) => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    nextTopics.forEach((id) => params.append('topic', id))
    nextYears.forEach((year) => params.append('year', year))
    if (nextLimit > 6) params.set('limit', String(nextLimit))
    return `${base}${params.size ? `?${params}` : ''}#publication-catalogue`
  }
  const update = (nextTopics: string[], nextYears: string[], nextLimit = 6) => {
    desired.current = { topics: nextTopics, years: nextYears, limit: nextLimit }
    // Native controlled checkboxes must acknowledge the click immediately;
    // result geometry changes inside the snapshot callback on the next frame.
    setTopics(nextTopics)
    setYears(nextYears)
    const change = () => {
      const next = desired.current
      flushSync(() => {
        setResultFilters({ topics: next.topics, years: next.years })
        setLimit(next.limit)
        setSelection('')
      })
      window.history.replaceState(
        window.history.state,
        '',
        url(next.topics, next.years, next.limit),
      )
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    transition.current?.skipTransition()
    if (document.startViewTransition && !reduced) {
      transition.current = document.startViewTransition(change)
    } else {
      change()
      if (!reduced)
        resultsRef.current?.animate(
          [
            { opacity: 0.6, transform: 'translateY(6px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 180, easing: 'ease-out' },
        )
    }
  }
  const toggle = (values: string[], id: string) =>
    values.includes(id) ? values.filter((value) => value !== id) : [...values, id]
  return (
    <div className={styles.catalogue}>
      <PublicationFilters label={copy.filters}>
        <div className={styles.filters}>
          <fieldset disabled={!ready}>
            <legend>{copy.domain}</legend>
            {topics.map(({ id, label }) => (
              <label key={id}>
                <input
                  type="checkbox"
                  name="topic"
                  value={id}
                  checked={selectedTopics.includes(id)}
                  onChange={() => update(toggle(desired.current.topics, id), desired.current.years)}
                />
                <span>{label}</span>
                <small>{topicCount(id).toLocaleString(locale)}</small>
              </label>
            ))}
          </fieldset>
          <fieldset disabled={!ready}>
            <legend>{copy.year}</legend>
            {years.map(({ year }) => (
              <label key={year}>
                <input
                  type="checkbox"
                  name="year"
                  value={year}
                  checked={selectedYears.includes(String(year))}
                  onChange={() =>
                    update(desired.current.topics, toggle(desired.current.years, String(year)))
                  }
                />
                <span>{year.toLocaleString(locale, { useGrouping: false })}</span>
                <small>{yearCount(year).toLocaleString(locale)}</small>
              </label>
            ))}
          </fieldset>
          <a
            className={styles.reset}
            href={url([], [])}
            onClick={(event) => {
              event.preventDefault()
              update([], [])
            }}
          >
            {copy.reset}
          </a>
          <noscript>
            <p>{copy.noScript}</p>
            <div className={styles.fallbackLinks}>
              {topics.map(({ id, label }) => (
                <a key={id} href={url([id], selectedYears)}>
                  {label}
                </a>
              ))}
              {years.map(({ year }) => (
                <a key={year} href={url(selectedTopics, [String(year)])}>
                  {year}
                </a>
              ))}
            </div>
          </noscript>
        </div>
      </PublicationFilters>
      <div className={styles.results} ref={resultsRef}>
        <p role="status" aria-live="polite">
          {copy.count.replace('{count}', (selected ? 1 : results.length).toLocaleString(locale))}
        </p>
        {!visible.length && <p className={styles.empty}>{copy.empty}</p>}
        {visible.map((p) => (
          <article
            id={`publication-${p.id}`}
            key={p.id}
            className={styles.article}
            style={{ viewTransitionName: `publication-${p.id}` }}
          >
            <p className={styles.topic}>{p.topicLabel}</p>
            <div>
              <h3>
                {p.doiUrl ? (
                  <a href={p.doiUrl} target="_blank" rel="noopener noreferrer">
                    <bdi>{p.title}</bdi>
                  </a>
                ) : (
                  <bdi>{p.title}</bdi>
                )}
              </h3>
              <div className={styles.meta}>
                <time dateTime={String(p.year)}>
                  {p.year.toLocaleString(locale, { useGrouping: false })}
                </time>
                <span>
                  <bdi>{p.authors || copy.noAuthors}</bdi>
                </span>
              </div>
              {p.doiUrl ? (
                <a
                  className={styles.read}
                  href={p.doiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {copy.read}
                  <NavigationIcon name="arrow" />
                </a>
              ) : (
                <p className={styles.missing}>{copy.noDoi}</p>
              )}
            </div>
          </article>
        ))}
        {!selected && results.length > limit && (
          <div className={styles.more}>
            <a
              className="button button-primary"
              href={url(selectedTopics, selectedYears, limit + 6)}
              onClick={(event) => {
                event.preventDefault()
                update(selectedTopics, selectedYears, limit + 6)
              }}
            >
              {copy.more}
              <NavigationIcon name="arrow" />
            </a>
          </div>
        )}
        {selected && (
          <a
            href={url([], [])}
            onClick={(event) => {
              event.preventDefault()
              update([], [])
            }}
          >
            {copy.reset}
          </a>
        )}
      </div>
    </div>
  )
}
