'use client'
import { useState } from 'react'
import type { Locale } from '@/i18n/locales'
import { filterCallCards, type CallCardData } from '@/lib/call-archives'
import { callCopy } from '@/lib/call-copy'
import { CallCards } from './CallCards'
import styles from './CallsCatalogue.module.css'

export function CallsCatalogue({ calls, locale }: { calls: CallCardData[]; locale: Locale }) {
  const t = callCopy[locale]
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('')
  const [kind, setKind] = useState('')
  const [state, setState] = useState('')
  const filtered = filterCallCards(calls, { query, year, kind, state })
  const years = [...new Set(calls.map((call) => call.year))].sort((a, b) => b - a)
  return (
    <div>
      <h2 className="sr-only">{t.all}</h2>
      <div className={styles.filters} role="search" aria-label={t.search}>
        <label className={styles.query}>
          {t.search}
          <input
            data-ui-field
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
          />
        </label>
        <label>
          {t.year}
          <select data-ui-field value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">{t.any}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {new Intl.NumberFormat(locale, { useGrouping: false }).format(y)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.kind}
          <select data-ui-field value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">{t.any}</option>
            {Object.entries(t.kinds).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.status}
          <select data-ui-field value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">{t.any}</option>
            {Object.entries(t.states).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.results}>
        <p role="status" aria-live="polite">
          {new Intl.NumberFormat(locale).format(filtered.length)} {t.count}
        </p>
        {(query || year || kind || state) && (
          <button
            type="button"
            data-ui-link
            onClick={() => {
              setQuery('')
              setYear('')
              setKind('')
              setState('')
            }}
          >
            {t.reset}
          </button>
        )}
      </div>
      {filtered.length ? (
        <CallCards calls={filtered} locale={locale} />
      ) : (
        <p className={styles.empty}>{t.empty}</p>
      )}
    </div>
  )
}
