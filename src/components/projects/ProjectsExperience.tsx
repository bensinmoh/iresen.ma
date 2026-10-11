'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import {
  filterProjectRecords,
  emptyProjectFilters,
  type ProjectRecord,
  projectDomains,
  projectStatuses,
  type ProjectFilters,
} from '@/lib/projects-model'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './ProjectsPage.module.css'
import { ProjectDetail } from './ProjectDetail'

const subscribeToHydration = () => () => {}

export function ProjectsExperience({
  locale,
  parameters,
  records,
}: {
  locale: Locale
  records: ProjectRecord[]
  parameters: Record<string, string | string[] | undefined>
}) {
  const t = useTranslations('Projects')
  const [current, setCurrent] = useState(parameters)
  const ready = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  )
  const gridRef = useRef<HTMLDivElement>(null)
  const catalogueRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLAnchorElement | null>(null)
  const [selection, setSelection] = useState(
    typeof parameters.project === 'string' ? parameters.project : '',
  )
  const [closing, setClosing] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animations = useRef<Animation[]>([])
  const selected = records.find((p) => p.id === selection)
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const value = (key: string) =>
    typeof current[key] === 'string' ? current[key].slice(0, 200) : ''
  const programmes = [...new Set(records.map((p) => p.programme))]
  const years = [...new Set(records.map((p) => String(p.year)))].sort().reverse()
  const filters: ProjectFilters = {
    query: value('q'),
    domain: projectDomains.includes(value('domain') as (typeof projectDomains)[number])
      ? value('domain')
      : '',
    year: years.includes(value('year')) ? value('year') : '',
    status: projectStatuses.includes(value('status') as (typeof projectStatuses)[number])
      ? value('status')
      : '',
    programme: programmes.includes(value('programme')) ? value('programme') : '',
  }
  const results = filterProjectRecords(records, filters, locale)
  const pages = Math.ceil(results.length / 6)
  const requested = /^[1-9]\d*$/.test(value('page')) ? Number(value('page')) : 1
  const page = Math.min(requested, Math.max(1, pages))
  const href = (number: number) => {
    const query = new URLSearchParams()
    for (const [key, val] of Object.entries(filters))
      if (val) query.set(key === 'query' ? 'q' : key, val)
    if (number > 1) query.set('page', String(number))
    return `${pageHref('projects', locale)}${query.size ? `?${query}` : ''}`
  }
  // Updates are local: native history preserves the query without scrolling to an anchor.
  const update = (next: Record<string, string | string[] | undefined>, history = true) => {
    const catalogue = catalogueRef.current
    const previousHeight = catalogue?.getBoundingClientRect().height ?? 0
    if (catalogue) catalogue.style.minHeight = `${previousHeight}px`
    animations.current.forEach((animation) => animation.cancel())
    flushSync(() => setCurrent(next))
    if (history) {
      const params = new URLSearchParams()
      for (const [key, val] of Object.entries(next))
        if (typeof val === 'string' && val) params.set(key, val)
      window.history.pushState(
        window.history.state,
        '',
        `${pageHref('projects', locale)}${params.size ? `?${params}` : ''}`,
      )
    }
    if (catalogue) {
      const box = catalogue.getBoundingClientRect()
      const padding = getComputedStyle(catalogue)
      const natural =
        (catalogue.firstElementChild?.getBoundingClientRect().height ?? 0) +
        parseFloat(padding.paddingTop) +
        parseFloat(padding.paddingBottom)
      // Keep the current viewport inside the catalogue, while releasing unused rows above the fold.
      const targetHeight = Math.max(natural, window.innerHeight - box.top)
      catalogue.style.minHeight = `${targetHeight}px`
      if (!reduced() && typeof catalogue.animate === 'function') {
        animations.current = [
          catalogue.animate(
            [{ minHeight: `${previousHeight}px` }, { minHeight: `${targetHeight}px` }],
            { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          ),
        ]
      }
    }
    if (!reduced() && typeof Element.prototype.animate === 'function') {
      animations.current.push(
        ...[...(gridRef.current?.children ?? [])].map((card, index) => {
          const timing = {
            duration: 300,
            delay: Math.min(index * 25, 100),
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }
          const photo = card.querySelector('img')
          if (photo)
            animations.current.push(photo.animate([{ opacity: 0.55 }, { opacity: 1 }], timing))
          return card.animate([{ translate: '0 10px' }, { translate: '0 0' }], timing)
        }),
      )
    }
  }
  const submit = (form: HTMLFormElement) =>
    update(Object.fromEntries(new FormData(form).entries()) as Record<string, string>)
  const reset = () => {
    for (const control of formRef.current?.elements ?? []) {
      if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement)
        control.value = ''
    }
    update(
      Object.fromEntries(
        Object.entries(emptyProjectFilters).map(([key]) => [key === 'query' ? 'q' : key, '']),
      ),
    )
  }
  useEffect(() => {
    const restore = () => {
      const next = Object.fromEntries(new URLSearchParams(window.location.search))
      update(next, false)
      for (const control of formRef.current?.elements ?? []) {
        if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement)
          control.value = next[control.name] ?? ''
      }
    }
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const settle = () => animations.current.forEach((animation) => animation.cancel())
    preference.addEventListener('change', settle)
    window.addEventListener('popstate', restore)
    return () => {
      window.removeEventListener('popstate', restore)
      preference.removeEventListener('change', settle)
      animations.current.forEach((animation) => animation.cancel())
    }
    // URL restoration uses the mounted page's locale and catalogue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])
  useEffect(() => {
    const dialog = dialogRef.current
    if (!selected || !ready || !dialog) return
    if (!dialog.open) dialog.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [selected, ready])
  const close = () => {
    if (closing) return
    const finish = () => {
      dialogRef.current?.close()
      setSelection('')
      setClosing(false)
      triggerRef.current?.focus({ preventScroll: true })
    }
    if (reduced()) finish()
    else {
      setClosing(true)
      closeTimer.current = setTimeout(finish, 220)
    }
  }
  const fields = [
    { key: 'domain', values: projectDomains, label: (v: string) => t(`domains.${v}`) },
    { key: 'year', values: years, label: (v: string) => v },
    { key: 'status', values: projectStatuses, label: (v: string) => t(`statuses.${v}`) },
    { key: 'programme', values: programmes, label: (v: string) => v.replace(/^DEMO-/, '') },
  ] as const
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
  return (
    <div className={styles.page} data-projects-page>
      <section className={styles.hero} aria-labelledby="hero-title">
        <Image
          src="/images/projects/hero.webp"
          alt=""
          fill
          unoptimized
          loading="eager"
          fetchPriority="high"
          className={styles.heroPhoto}
        />
        <div className={`container ${styles.heroContent}`}>
          <p className={styles.eyebrow}>{t('eyebrow')}</p>
          <h1 id="hero-title">
            {t('titleStart')} <span>{t('titleAccent')}</span>
          </h1>
          <p className={styles.description}>{t('description')}</p>
        </div>
      </section>
      <div id="page-sections">
        <section id="find-project" className={styles.filters} aria-label={t('query')}>
          <div className="container">
            <form
              ref={formRef}
              action={pageHref('projects', locale)}
              method="get"
              onSubmit={(event) => {
                event.preventDefault()
                submit(event.currentTarget)
              }}
              onChange={(event) => {
                if (event.target instanceof HTMLSelectElement) submit(event.currentTarget)
              }}
            >
              <div className={styles.fields}>
                <div className={styles.query}>
                  <label htmlFor="project-query">{t('query')}</label>
                  <div className={styles.searchField}>
                    <input
                      type="search"
                      id="project-query"
                      name="q"
                      defaultValue={filters.query}
                      placeholder={t('placeholder')}
                      maxLength={200}
                    />
                    <button type="submit" aria-label={t('query')}>
                      <NavigationIcon name="search" />
                    </button>
                  </div>
                </div>
                {fields.map((field) => (
                  <label key={field.key}>
                    {t(field.key)}
                    <span className={styles.select}>
                      <select name={field.key} defaultValue={filters[field.key]}>
                        <option value="">{t('all')}</option>
                        {field.values.map((v) => (
                          <option key={v} value={v}>
                            {field.label(v)}
                          </option>
                        ))}
                      </select>
                      <NavigationIcon name="chevron" />
                    </span>
                  </label>
                ))}
              </div>
            </form>
            <div className={styles.resultBar}>
              <p role="status">{t('count', { count: results.length })}</p>
              <a
                href={pageHref('projects', locale)}
                onClick={(event) => {
                  event.preventDefault()
                  reset()
                }}
              >
                {t('reset')}
              </a>
            </div>
          </div>
        </section>
        <section
          ref={catalogueRef}
          id="project-catalogue"
          className={styles.catalogue}
          aria-label={t('catalogue')}
        >
          <div className="container">
            <div id="understanding-results" />
            <div ref={gridRef} id="featured-results" className={styles.grid}>
              {results.slice((page - 1) * 6, page * 6).map((project) => (
                <article
                  key={project.id}
                  id={`project-${project.id}`}
                  className={styles.card}
                  aria-labelledby={`title-${project.id}`}
                >
                  <div className={styles.cardHeader}>
                    <p>{t(`domains.${project.domain}`)}</p>
                    <span className={styles[project.status]}>
                      {t(`statuses.${project.status}`)}
                    </span>
                  </div>
                  <div className={styles.cardVisual}>
                    <Image
                      src={`/images/projects/${project.image}.webp`}
                      alt={t(`photos.${project.image}`)}
                      width={900}
                      height={430}
                      unoptimized
                      className={styles.cardPhoto}
                    />
                  </div>
                  <h2 id={`title-${project.id}`}>
                    <a
                      className={styles.cardLink}
                      href={`${href(page)}${href(page).includes('?') ? '&' : '?'}project=${project.id}#project-details`}
                      aria-label={t('details', { name: project.acronym })}
                      onClick={(event) => {
                        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                        event.preventDefault()
                        triggerRef.current = event.currentTarget
                        setClosing(false)
                        setSelection(project.id)
                      }}
                    >
                      <bdi>{project.acronym}</bdi>
                    </a>
                  </h2>
                  <p className={styles.projectTitle}>{project.title[locale]}</p>
                  <p className={styles.summary}>{project.description[locale]}</p>
                  <dl className={styles.metadata}>
                    {[
                      [t('acronym'), project.acronym],
                      [t('duration'), t('months', { count: project.durationMonths })],
                      [t('budget'), `${number.format(project.budgetMAD / 1000000)} MMAD`],
                      [t('launch'), String(project.year)],
                      [t('programme'), project.programme.replace(/^DEMO-/, '')],
                    ].map(([label, detail]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>
                          <bdi>{detail}</bdi>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <span className={styles.cardAction} aria-hidden="true">
                    {t('viewDetails')} <NavigationIcon name="arrow" />
                  </span>
                </article>
              ))}
            </div>
            {!results.length && (
              <div className={styles.empty}>
                <h2>{t('empty')}</h2>
                <p>{t('emptyHelp')}</p>
                <a
                  className="button button-primary"
                  href={pageHref('projects', locale)}
                  onClick={(event) => {
                    event.preventDefault()
                    reset()
                  }}
                >
                  {t('reset')}
                </a>
              </div>
            )}
            {pages > 1 && (
              <nav aria-label={t('pagination')} className={styles.pagination}>
                {page > 1 ? (
                  <a
                    href={href(page - 1)}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                      event.preventDefault()
                      update({
                        ...Object.fromEntries(
                          new URLSearchParams(href(page - 1).split('?')[1] ?? ''),
                        ),
                      })
                    }}
                    aria-label={t('previous')}
                  >
                    <span className={styles.previous}>
                      <NavigationIcon name="chevron" />
                    </span>
                  </a>
                ) : (
                  <span aria-disabled="true">
                    <span className={styles.previous}>
                      <NavigationIcon name="chevron" />
                    </span>
                  </span>
                )}
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <a
                    key={n}
                    href={href(n)}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                      event.preventDefault()
                      update({
                        ...Object.fromEntries(new URLSearchParams(href(n).split('?')[1] ?? '')),
                      })
                    }}
                    aria-label={t('page', { number: n })}
                    aria-current={n === page ? 'page' : undefined}
                  >
                    {n}
                  </a>
                ))}
                {page < pages ? (
                  <a
                    href={href(page + 1)}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                      event.preventDefault()
                      update({
                        ...Object.fromEntries(
                          new URLSearchParams(href(page + 1).split('?')[1] ?? ''),
                        ),
                      })
                    }}
                    aria-label={t('next')}
                  >
                    <span className={styles.next}>
                      <NavigationIcon name="chevron" />
                    </span>
                  </a>
                ) : (
                  <span aria-disabled="true">
                    <span className={styles.next}>
                      <NavigationIcon name="chevron" />
                    </span>
                  </span>
                )}
              </nav>
            )}
            <div id="related-capabilities" />
          </div>
        </section>
      </div>
      {selected && !ready && (
        <section id="project-details" className={`container ${styles.fallbackDetails}`}>
          <h2>{selected.acronym}</h2>
          <ProjectDetail project={selected} locale={locale} />
          <a href={href(page)}>{t('close')}</a>
        </section>
      )}
      <dialog
        id="project-drawer"
        ref={dialogRef}
        className={styles.drawer}
        data-closing={closing || undefined}
        aria-labelledby="project-detail-title"
        onCancel={(event) => {
          event.preventDefault()
          close()
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const rect = event.currentTarget.getBoundingClientRect()
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
              close()
          }
        }}
      >
        {selected && (
          <div className={styles.drawerContent}>
            <div className={styles.drawerTop}>
              <h2 id="project-detail-title">
                <bdi>{selected.acronym}</bdi>
              </h2>
              <span className={`${styles.detailStatus} ${styles[selected.status]}`}>
                {t(`statuses.${selected.status}`)}
              </span>
              <button
                type="button"
                autoFocus
                onClick={close}
                aria-label={t('close')}
                className={styles.close}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <ProjectDetail project={selected} locale={locale} />
          </div>
        )}
      </dialog>
    </div>
  )
}
