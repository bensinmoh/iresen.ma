'use client'

import { useState, type FormEvent } from 'react'
import { laboratoryTopics, normalizeLaboratoryQuery, type LaboratoryTopic } from '@/lib/network'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { ValorisationIcon } from '@/components/transfer/ValorisationIcon'
import styles from './NetworkPage.module.css'

export type LaboratoryCard = {
  id: string
  anchor: string
  topic: LaboratoryTopic
  title: string
  institution: string
  city: string
  discovery: string
  contact?: { name: string; email: string }
}
type DirectoryLabels = {
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

export function LaboratoryDirectory({
  records,
  labels,
}: {
  records: LaboratoryCard[]
  labels: DirectoryLabels
}) {
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
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setQuery(draft)
  }
  function reset() {
    setDraft('')
    setQuery('')
    setTopic('')
  }
  return (
    <div className={styles.directory}>
      <form className={styles.search} role="search" onSubmit={submit}>
        <label htmlFor="laboratory-query">{labels.label}</label>
        <div>
          <input
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
      <div className={styles.filters} role="group" aria-label={labels.theme}>
        <button type="button" aria-pressed={!topic} onClick={() => setTopic('')}>
          {labels.all}
        </button>
        {laboratoryTopics.map((id) => (
          <button key={id} type="button" aria-pressed={topic === id} onClick={() => setTopic(id)}>
            {labels.topics[id]}
          </button>
        ))}
      </div>
      <div className={styles.resultBar}>
        <p role="status" aria-live="polite" aria-atomic="true">
          {labels.results.replace('{count}', String(visible.length))}
        </p>
        {(query || topic) && (
          <button type="button" onClick={reset}>
            {labels.reset}
          </button>
        )}
      </div>
      <div className={styles.laboratories}>
        {records.map((record) => (
          <article
            key={record.id}
            id={record.anchor}
            hidden={!visible.includes(record)}
            data-laboratory-card
          >
            <span className={styles.labIcon}>
              <ValorisationIcon name="flask" />
            </span>
            <p className={styles.labTopic}>{labels.topics[record.topic]}</p>
            <h3>{record.title}</h3>
            <p className={styles.affiliation}>{record.institution}</p>
            {record.city && (
              <p className={styles.city}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
                <span className="sr-only">{labels.city}: </span>
                {record.city}
              </p>
            )}
            {record.contact && (
              <address className={styles.contact}>
                <span>{labels.contact}</span>
                <bdi>{record.contact.name}</bdi>
                <a href={`mailto:${record.contact.email}`}>
                  <bdi dir="ltr">{record.contact.email}</bdi>
                </a>
              </address>
            )}
          </article>
        ))}
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
