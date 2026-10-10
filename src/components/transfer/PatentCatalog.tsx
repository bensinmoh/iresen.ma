'use client'

import { useState, useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/locales'
import {
  patents,
  patentThemes,
  filterPatents,
  patentAnchor,
  patentContactHref,
} from '@/lib/patents'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './TransferPage.module.css'

const subscribeHash = (notify: () => void) => {
  window.addEventListener('hashchange', notify)
  return () => window.removeEventListener('hashchange', notify)
}
const currentHash = () => window.location.hash
const serverHash = () => 'server'

export function PatentCatalog({ locale }: { locale: Locale }) {
  const t = useTranslations('Transfer')
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState('')
  const [year, setYear] = useState('')
  const [depositor, setDepositor] = useState('')
  // All records remain in server HTML for anchor discovery and no-JavaScript reading.
  const [limit, setLimit] = useState<number | null>(12)
  const hash = useSyncExternalStore(subscribeHash, currentHash, serverHash)
  const results = filterPatents(query, theme, year, depositor, locale)
  const years = [
    ...new Set(patents.flatMap((p) => (p.filingYear === null ? [] : [p.filingYear]))),
  ].sort((a, b) => b - a)
  const depositors = [...new Set(patents.flatMap((p) => p.depositor?.split(' ; ') ?? []))].sort(
    (a, b) => a.localeCompare(b, 'fr'),
  )
  const change = (setter: (value: string) => void, value: string) => {
    setter(value)
    setLimit(12)
  }
  const reset = () => {
    setQuery('')
    setTheme('')
    setYear('')
    setDepositor('')
    setLimit(12)
  }
  return (
    <div>
      <noscript>
        <p className={styles.note}>{t('catalog.noJavaScript')}</p>
      </noscript>
      <div className={styles.filters} role="search" aria-label={t('catalog.search')}>
        <label className={styles.searchField}>
          <span>{t('catalog.search')}</span>
          <input
            type="search"
            disabled={hash === 'server'}
            value={query}
            placeholder={t('catalog.placeholder')}
            onChange={(e) => change(setQuery, e.target.value)}
          />
        </label>
        <label>
          <span id="patent-theme-label">{t('catalog.theme')}</span>
          <span className={styles.selectWrap}>
            <select
              disabled={hash === 'server'}
              aria-labelledby="patent-theme-label"
              value={theme}
              onChange={(e) => change(setTheme, e.target.value)}
            >
              <option value="">{t('catalog.all')}</option>
              {patentThemes.map((id) => (
                <option key={id} value={id}>
                  {t(`themes.${id}`)}
                </option>
              ))}
            </select>
            <NavigationIcon name="chevron" />
          </span>
        </label>
        <label>
          <span id="patent-year-label">{t('catalog.year')}</span>
          <span className={styles.selectWrap}>
            <select
              disabled={hash === 'server'}
              aria-labelledby="patent-year-label"
              value={year}
              onChange={(e) => change(setYear, e.target.value)}
            >
              <option value="">{t('catalog.all')}</option>
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
              <option value="unknown">{t('catalog.unknown')}</option>
            </select>
            <NavigationIcon name="chevron" />
          </span>
        </label>
        <label>
          <span id="patent-depositor-label">{t('catalog.depositor')}</span>
          <span className={styles.selectWrap}>
            <select
              disabled={hash === 'server'}
              aria-labelledby="patent-depositor-label"
              value={depositor}
              onChange={(e) => change(setDepositor, e.target.value)}
            >
              <option value="">{t('catalog.all')}</option>
              {depositors.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <NavigationIcon name="chevron" />
          </span>
        </label>
      </div>
      <div className={styles.catalogBar}>
        <p role="status">{t('catalog.count', { count: results.length, total: patents.length })}</p>
        <button type="button" disabled={hash === 'server'} onClick={reset}>
          {t('catalog.reset')}
        </button>
      </div>
      <p className={styles.meta}>{t('catalog.original')}</p>
      <div className={styles.patentGrid}>
        {results.map((patent, index) => (
          <article
            key={patent.reference}
            id={patentAnchor(patent.reference)}
            className={styles.patent}
            hidden={
              hash !== 'server' &&
              limit !== null &&
              index >= limit &&
              hash !== `#${patentAnchor(patent.reference)}`
            }
          >
            <div className={styles.patentMeta}>
              <span>
                {t('catalog.reference')} <bdi>{patent.reference}</bdi>
              </span>
              <span>
                {t('catalog.year')} : <bdi>{patent.filingYear ?? t('catalog.unknown')}</bdi>
              </span>
            </div>
            <div className={styles.tags}>
              {patent.themes.map((id) => (
                <span key={id}>{t(`themes.${id}`)}</span>
              ))}
            </div>
            <h3 lang="fr" dir="ltr">
              {patent.title}
            </h3>
            <p>{patent.description[locale]}</p>
            <p className={styles.applicant}>
              <span>{t('catalog.depositor')}</span>
              <bdi>{patent.depositor}</bdi>
            </p>
            <div className={styles.patentActions}>
              <a href={patent.registerUrl} className={styles.link}>
                {t('catalog.view')}
                <NavigationIcon name="arrow" />
              </a>
              <a href={patentContactHref(locale, patent.reference)} className={styles.link}>
                {t('catalog.discuss')}
                <NavigationIcon name="arrow" />
              </a>
            </div>
          </article>
        ))}
      </div>
      {!results.length && <p className={styles.empty}>{t('catalog.empty')}</p>}
      {hash !== 'server' && limit !== null && results.length > limit && (
        <div className={styles.more}>
          <button
            type="button"
            className="button button-primary"
            onClick={() => setLimit(limit + 12)}
          >
            {t('catalog.showMore')}
          </button>
          <button type="button" onClick={() => setLimit(null)}>
            {t('catalog.showAll')}
          </button>
        </div>
      )}
      <p className={styles.note}>
        {t('catalog.note')} <span>{t('catalog.updated')}</span>
      </p>
    </div>
  )
}
