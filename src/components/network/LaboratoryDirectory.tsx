'use client'

import { Heading } from '@/components/ui/Heading'

import { Sun } from '@phosphor-icons/react/dist/ssr/Sun'
import { BatteryCharging } from '@phosphor-icons/react/dist/ssr/BatteryCharging'
import { Circuitry } from '@phosphor-icons/react/dist/ssr/Circuitry'
import { Atom } from '@phosphor-icons/react/dist/ssr/Atom'
import { ChargingStation } from '@phosphor-icons/react/dist/ssr/ChargingStation'
import { Leaf } from '@phosphor-icons/react/dist/ssr/Leaf'
import { X } from '@phosphor-icons/react/dist/ssr/X'
import { SiteIcon } from '@/components/ui/SiteIcon'

import { useState, useRef, useEffect, useLayoutEffect, type FormEvent, type ReactNode } from 'react'
import {
  laboratoryTopics,
  normalizeLaboratoryQuery,
  type LaboratoryTopic,
  laboratoryLocations,
  type LaboratoryLocation,
} from '@/lib/network'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import styles from './NetworkPage.module.css'

export type LaboratoryCard = {
  id: string
  anchor: string
  topic: LaboratoryTopic
  location: LaboratoryLocation
  title: string
  institution: string
  city: string
  discovery: string
  contact?: { name: string; email: string }
}
type DirectoryLabels = {
  map: string
  list: string
  close: string
  label: string
  placeholder: string
  search: string
  all: string
  reset: string
  empty: string
  results: string
  city: string
  theme: string
  contact: string
  topics: Record<LaboratoryTopic, string>
}

const topicIcons = {
  solar: Sun,
  storage: BatteryCharging,
  grid: Circuitry,
  materials: Atom,
  mobility: ChargingStation,
  bioenergy: Leaf,
}

export function LaboratoryDirectory({
  records,
  labels,
  introduction,
}: {
  records: LaboratoryCard[]
  introduction: ReactNode
  labels: DirectoryLabels
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState<LaboratoryTopic | ''>('')
  const terms = normalizeLaboratoryQuery(query).split(' ').filter(Boolean)
  const visible = records.filter(
    (record) =>
      (!topic || record.topic === topic) &&
      terms.every((term) =>
        normalizeLaboratoryQuery(
          [
            record.title,
            record.institution,
            record.city,
            record.discovery,
            labels.topics[record.topic],
            record.contact?.name ?? '',
          ].join(' '),
        ).includes(term),
      ),
  )
  const active = visible.find((record) => record.id === selected)
  const activeLocation = active?.location
  const locations = Object.entries(laboratoryLocations)
    .map(([id, point]) => ({
      id,
      point,
      labs: visible.filter((record) => record.location === id),
    }))
    .filter(({ labs }) => labs.length)
  useEffect(() => {
    function revealLinkedLaboratory() {
      const record = records.find(({ anchor }) => `#${anchor}` === window.location.hash)
      if (!record) return
      setDraft('')
      setQuery('')
      setTopic('')
      setSelected(record.id)
      requestAnimationFrame(() => document.getElementById(record.anchor)?.scrollIntoView())
    }
    revealLinkedLaboratory()
    window.addEventListener('hashchange', revealLinkedLaboratory)
    return () => window.removeEventListener('hashchange', revealLinkedLaboratory)
  }, [records])

  useLayoutEffect(() => {
    const map = mapRef.current
    if (!map || !activeLocation) return
    const location = activeLocation
    function positionBubble() {
      if (!map) return
      const pin = map.querySelector<HTMLButtonElement>(`[data-map-pin="${location}"]`)
      if (!pin) return
      const frame = map.getBoundingClientRect()
      const point = pin.getBoundingClientRect()
      const diameter = Math.min(336, frame.width - 16, frame.height - 16)
      const radius = diameter / 2
      const pinX = point.left + point.width / 2 - frame.left
      const pinY = point.top + point.height / 2 - frame.top
      const mobile = window.matchMedia('(max-width: 39.999rem)').matches
      const x = mobile
        ? frame.width / 2
        : Math.max(radius + 8, Math.min(frame.width - radius - 8, pinX))
      const y = mobile
        ? frame.height / 2
        : Math.max(radius + 8, Math.min(frame.height - radius - 8, pinY))
      for (const [name, value] of Object.entries({
        'bubble-size': diameter,
        'bubble-x': x,
        'bubble-y': y,
        'bubble-dx': pinX - x,
        'bubble-dy': pinY - y,
      }))
        map.style.setProperty(`--${name}`, `${value}px`)
      map.style.setProperty('--bubble-start-scale', String(point.width / diameter))
    }
    positionBubble()
    const observer = new ResizeObserver(positionBubble)
    observer.observe(map)
    return () => observer.disconnect()
  }, [activeLocation])

  function select(record: LaboratoryCard, button: HTMLButtonElement) {
    trigger.current = button
    setSelected(record.id)
    requestAnimationFrame(() =>
      mapRef.current
        ?.querySelector<HTMLButtonElement>('[data-map-close]')
        ?.focus({ preventScroll: true }),
    )
  }
  function close() {
    setSelected(null)
    trigger.current?.focus({ preventScroll: true })
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSelected(null)
    setQuery(draft)
  }
  function reset() {
    setSelected(null)
    setDraft('')
    setQuery('')
    setTopic('')
  }
  return (
    <div className={styles.directory}>
      <div className={styles.directoryTop}>
        {introduction}
        <div className={styles.directoryControls}>
          <form className={styles.search} role="search" onSubmit={submit}>
            <label htmlFor="laboratory-query">{labels.label}</label>
            <div>
              <input
                data-ui-field
                id="laboratory-query"
                type="search"
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value)
                  if (!event.target.value) setQuery('')
                }}
                placeholder={labels.placeholder}
              />
              <button type="submit" className="button button-primary">
                <NavigationIcon name="search" />
                {labels.search}
              </button>
            </div>
          </form>
          <div className={styles.filterToolbar}>
            <div
              className={styles.filters}
              role="group"
              aria-label={labels.theme}
              data-ui-rail="filters"
              tabIndex={0}
            >
              <button
                type="button"
                aria-pressed={!topic}
                onClick={() => {
                  setSelected(null)
                  setTopic('')
                }}
              >
                {labels.all}
              </button>
              {laboratoryTopics.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={topic === id}
                  onClick={() => {
                    setSelected(null)
                    setTopic(id)
                  }}
                >
                  {labels.topics[id]}
                </button>
              ))}
            </div>
            <button
              className={styles.resetFilters}
              type="button"
              onClick={reset}
              disabled={!query && !topic}
            >
              {labels.reset}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.resultBar}>
        <p role="status" aria-live="polite" aria-atomic="true">
          {labels.results.replace('{count}', String(visible.length))}
        </p>
      </div>
      <div
        className={styles.explorer}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && active) {
            event.preventDefault()
            close()
          }
        }}
      >
        <div
          className={styles.laboratories}
          role="region"
          aria-label={labels.list}
          tabIndex={0}
          data-laboratory-list
        >
          {records.map((record) => (
            <article
              key={record.id}
              id={record.anchor}
              hidden={!visible.includes(record)}
              data-laboratory-card
            >
              <button
                className={styles.labSelect}
                type="button"
                aria-pressed={active?.id === record.id}
                onClick={(event) => select(record, event.currentTarget)}
              >
                <SiteIcon icon={topicIcons[record.topic]} />
                <span>
                  <strong>{record.title}</strong>
                  <span>
                    {record.institution} · {record.city}
                  </span>
                </span>
              </button>
              <details className={styles.listDetails}>
                <summary>
                  {labels.theme} · {labels.topics[record.topic]}
                </summary>
                <LaboratoryDetails record={record} labels={labels} />
              </details>
            </article>
          ))}
        </div>
        <div className={styles.mapColumn}>
          <div
            ref={mapRef}
            className={styles.map}
            role="group"
            aria-label={labels.map}
            onClick={(event) => {
              if (active && !(event.target as Element).closest('button, [data-map-details]'))
                close()
            }}
            data-laboratory-map
          >
            <div className={styles.mapCanvas}>
              <div className={styles.mapShape} aria-hidden="true" />
              {locations.map(({ id, point, labs }) => (
                <button
                  key={id}
                  type="button"
                  className={styles.mapPin}
                  data-map-pin={id}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  aria-label={`${labs[0].city} · ${labels.results.replace('{count}', String(labs.length))}`}
                  aria-pressed={active?.location === id}
                  onClick={(event) => select(labs[0], event.currentTarget)}
                >
                  <ValorisationIcon name="flask" />
                  {labs.length > 1 && <span className={styles.pinCount}>{labs.length}</span>}
                </button>
              ))}
            </div>
            {active && (
              <section
                key={active.location}
                className={styles.mapDetails}
                aria-labelledby="map-laboratory-title"
                data-map-details
              >
                <button
                  type="button"
                  className={styles.closeDetails}
                  data-map-close
                  aria-label={labels.close}
                  onClick={close}
                >
                  <SiteIcon icon={X} />
                </button>
                <div className={styles.bubbleContent} tabIndex={0}>
                  <span
                    className={styles.bubbleTopic}
                    role="img"
                    aria-label={labels.topics[active.topic]}
                  >
                    <SiteIcon icon={topicIcons[active.topic]} />
                  </span>
                  <Heading as="h3" size="card" id="map-laboratory-title">
                    {active.title}
                  </Heading>
                  <p className={styles.affiliation}>{active.institution}</p>
                  <p className={styles.city}>{active.city}</p>
                </div>
                {visible.filter((record) => record.location === active.location).length > 1 && (
                  <div className={styles.cityLabs}>
                    {visible
                      .filter((record) => record.location === active.location)
                      .map((record, index) => (
                        <button
                          key={record.id}
                          type="button"
                          aria-label={record.title}
                          title={record.title}
                          aria-pressed={record.id === active.id}
                          onClick={() => setSelected(record.id)}
                        >
                          {index + 1}
                        </button>
                      ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
      {visible.length === 0 && (
        <div className={styles.empty}>
          <p>{labels.empty}</p>
          <button type="button" className="button button-secondary" onClick={reset}>
            {labels.reset}
          </button>
        </div>
      )}
    </div>
  )
}

function LaboratoryDetails({
  record,
  labels,
}: {
  record: LaboratoryCard
  labels: DirectoryLabels
}) {
  return (
    <>
      <p className={styles.affiliation}>{record.institution}</p>
      <p className={styles.city}>{record.city}</p>
      {record.contact && (
        <address className={styles.contact}>
          <span>{labels.contact}</span>
          <bdi>{record.contact.name}</bdi>
          <a href={`mailto:${record.contact.email}`}>
            <bdi dir="ltr">{record.contact.email}</bdi>
          </a>
        </address>
      )}
    </>
  )
}
