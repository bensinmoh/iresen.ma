'use client'
import Image from 'next/image'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { useState, useRef, useEffect, useSyncExternalStore, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { contactEmailHref } from '@/lib/contact'
import { careerAnchor, careerDownloadHref, type CareerOffer } from '@/lib/careers'
import styles from './CareersPage.module.css'
import { CareersIcon } from './CareersIcon'

const subscribe = () => () => {}
export function CareersApplications({
  locale,
  offers,
  unavailable,
}: {
  locale: Locale
  offers: CareerOffer[]
  unavailable: boolean
}) {
  const t = useTranslations('Careers')
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
  const [selected, setSelected] = useState('')
  const [kind, setKind] = useState('employment')
  const [filename, setFilename] = useState('')
  const [fileError, setFileError] = useState('')
  const [draft, setDraft] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    const revealOffer = () => {
      const element = document.getElementById(window.location.hash.slice(1))
      if (element instanceof HTMLDetailsElement && element.closest('#open-opportunities'))
        element.open = true
    }
    revealOffer()
    window.addEventListener('hashchange', revealOffer)
    return () => window.removeEventListener('hashchange', revealOffer)
  }, [])
  function chooseOffer(reference: string, type = 'employment') {
    setSelected(reference)
    setKind(type)
    setDraft('')
    document
      .getElementById('questions-unsolicited-applications')
      ?.scrollIntoView({ behavior: 'auto' })
    formRef.current
      ?.querySelector<HTMLInputElement>('input[name="firstName"]')
      ?.focus({ preventScroll: true })
  }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const read = (key: string) => String(data.get(key) ?? '').trim()
    for (const key of ['firstName', 'lastName', 'message']) {
      const input = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement
      input.setCustomValidity(read(key) ? '' : t('form.required'))
    }
    if (!form.reportValidity() || fileError) return
    const offer = offers.find((offer) => offer.reference === selected)
    const title = offer?.title ?? t('form.spontaneous')
    const body = [
      t(`form.${kind}`),
      title,
      ...['firstName', 'lastName', 'email', 'phone']
        .filter((key) => read(key))
        .map((key) => `${t(`form.${key}`)}: ${read(key)}`),
      '',
      read('message'),
      '',
      filename ? `${t('form.cv')}: ${filename}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    setDraft(contactEmailHref(t('form.subject', { offer: title }), body))
  }
  const paragraphs = t.raw('internship.paragraphs') as string[]
  return (
    <>
      <section
        id="open-opportunities"
        className={`container ${styles.offers}`}
        aria-labelledby="offers-title"
      >
        <span id="find-opportunity" />
        <header>
          <p className={styles.eyebrow}>{t('offers.eyebrow')}</p>
          <h2 id="offers-title">{t('offers.title')}</h2>
        </header>
        {unavailable ? (
          <p role="status" className={styles.empty}>
            {t('offers.unavailable')}
          </p>
        ) : offers.length ? (
          <div className={styles.offerList}>
            {offers.map((offer) => (
              <details
                key={offer.reference}
                id={careerAnchor(offer.reference)}
                className={styles.offer}
              >
                <summary>
                  <span className={styles.department}>
                    {t('offers.reference', { reference: offer.reference.toUpperCase() })}
                  </span>
                  <span className={styles.offerHeading}>
                    <span>
                      <strong>{offer.title}</strong>{' '}
                      <bdi className={styles.badge}>{offer.contract}</bdi>
                    </span>
                    <span className={styles.location}>{offer.location}</span>
                  </span>
                  <span className={styles.toggle} aria-hidden="true" />
                </summary>
                <div className={styles.offerDetail}>
                  <h3>{offer.title}</h3>
                  <p className={styles.summary}>{offer.summary}</p>
                  <dl className={styles.facts}>
                    {(['contract', 'location', 'experience', 'availability'] as const).map(
                      (key) => (
                        <div key={key}>
                          <dt>{t(`offers.${key}`)}</dt>
                          <dd>{offer[key]}</dd>
                        </div>
                      ),
                    )}
                  </dl>
                  <div className={styles.requirements}>
                    {(['missions', 'profile'] as const).map((key) => (
                      <section key={key}>
                        <h4>{t(`offers.${key}`)}</h4>
                        <ul>
                          {offer[key]
                            .split('\n')
                            .filter(Boolean)
                            .map((line) => (
                              <li key={line}>
                                <NavigationIcon name="arrow" />
                                {line}
                              </li>
                            ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                  <div className={styles.offerActions}>
                    <button
                      className="button button-primary"
                      type="button"
                      onClick={() => chooseOffer(offer.reference)}
                    >
                      {t('offers.apply')} <NavigationIcon name="arrow" />
                    </button>
                    <a
                      className={`button ${styles.download}`}
                      href={careerDownloadHref(offer.reference, locale)}
                      download
                    >
                      {t('offers.download')}{' '}
                      <span className={styles.downArrow}>
                        <NavigationIcon name="arrow" />
                      </span>
                    </a>
                  </div>
                </div>
              </details>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span aria-hidden="true" className={styles.emptyIcon}>
              <NavigationIcon name="arrow" />
            </span>
            <h3>{t('offers.emptyTitle')}</h3>
            <p>{t('offers.emptyDescription')}</p>
            <a href="#questions-unsolicited-applications" className="button button-primary">
              {t('offers.emptyAction')} <NavigationIcon name="arrow" />
            </a>
          </div>
        )}
        <span id="archives-results" />
      </section>
      <section id="apply-respond" className={styles.internship} aria-labelledby="internship-title">
        <Image
          src="/images/careers/internship.webp"
          alt={t('photos.internship')}
          fill
          unoptimized
          className={styles.internshipPhoto}
        />
        <div className={`container ${styles.internshipGrid}`}>
          <div className={styles.internshipCard}>
            <p className={styles.eyebrow}>{t('internship.eyebrow')}</p>
            <h2 id="internship-title">{t('internship.title')}</h2>
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <button
              className="button button-primary"
              type="button"
              onClick={() => chooseOffer('', 'internship')}
              disabled={!ready}
            >
              {t('internship.action')} <NavigationIcon name="chevron" />
            </button>
          </div>
          <aside className={styles.internshipAside}>
            <div className={styles.duration}>
              <span className={styles.featureIcon}>
                <CareersIcon name="internship" />
              </span>
              <div>
                <strong>{t('internship.duration')}</strong>
                <p>{t('internship.durationDescription')}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <section
        id="questions-unsolicited-applications"
        className={`container ${styles.application}`}
        aria-labelledby="application-title"
      >
        <header>
          <p className={styles.eyebrow}>{t('form.eyebrow')}</p>
          <h2 id="application-title">{t('form.title')}</h2>
        </header>
        <form
          ref={formRef}
          onSubmit={prepare}
          onInput={(event) => {
            setDraft('')
            const target = event.target
            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
              target.setCustomValidity('')
          }}
          className={styles.form}
        >
          <div className={styles.formGrid}>
            {(['firstName', 'lastName', 'email', 'phone'] as const).map((key) => (
              <div className={styles.field} key={key}>
                <label htmlFor={`career-${key}`}>{t(`form.${key}`)}</label>
                <input
                  id={`career-${key}`}
                  name={key}
                  type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                  autoComplete={
                    {
                      firstName: 'given-name',
                      lastName: 'family-name',
                      email: 'email',
                      phone: 'tel',
                    }[key]
                  }
                  required={key !== 'phone'}
                  maxLength={key === 'phone' ? 50 : 200}
                  placeholder={t(`form.${key}Placeholder`)}
                  dir={key === 'email' || key === 'phone' ? 'ltr' : undefined}
                  disabled={!ready}
                />
              </div>
            ))}
          </div>
          <fieldset className={styles.radios}>
            <legend className="sr-only">{t('form.kind')}</legend>
            {['employment', 'internship'].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="kind"
                  value={value}
                  checked={kind === value}
                  onChange={() => setKind(value)}
                  disabled={!ready}
                />
                {t(`form.${value}`)}
              </label>
            ))}
          </fieldset>
          <div className={styles.field}>
            <label htmlFor="career-offer">{t('form.offer')}</label>
            <div className={styles.selectWrap}>
              <select
                id="career-offer"
                name="offer"
                value={selected}
                onChange={(event) => {
                  setSelected(event.target.value)
                  setDraft('')
                }}
                disabled={!ready}
              >
                <option value="">{t('form.spontaneous')}</option>
                {offers.map((offer) => (
                  <option key={offer.reference} value={offer.reference}>
                    {offer.title}
                  </option>
                ))}
              </select>
              <NavigationIcon name="chevron" />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="career-message">{t('form.message')}</label>
            <textarea
              id="career-message"
              name="message"
              rows={6}
              required
              maxLength={4000}
              placeholder={t('form.messagePlaceholder')}
              disabled={!ready}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="career-cv">{t('form.cv')}</label>
            <div className={styles.upload}>
              <CareersIcon name="upload" />
              <div>
                <strong>{filename || t('form.upload')}</strong>
                <span id="cv-hint">{t('form.maxSize')}</span>
              </div>
              <input
                id="career-cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                aria-describedby={`cv-hint${fileError ? ' cv-error' : ''}`}
                aria-invalid={Boolean(fileError)}
                disabled={!ready}
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  const valid =
                    !file || (file.size <= 5_000_000 && /\.(pdf|docx?)$/i.test(file.name))
                  setFileError(valid ? '' : t('form.fileError'))
                  setFilename(valid ? (file?.name ?? '') : '')
                  if (!valid) event.target.value = ''
                }}
              />
            </div>
            {fileError && (
              <p id="cv-error" role="alert" className={styles.error}>
                {fileError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`button button-primary ${styles.submit}`}
            disabled={!ready}
          >
            {t('form.action')} <NavigationIcon name="arrow" />
          </button>
          <div role="status" aria-live="polite">
            {draft && (
              <>
                <p>{t('form.prepared')}</p>
                <a className="button button-primary" href={draft}>
                  {t('form.openEmail')}
                </a>
              </>
            )}
          </div>
          <p className={styles.disclosure}>
            {t.rich('form.notice', {
              privacy: (chunks) => <a href={pageHref('privacy', locale)}>{chunks}</a>,
            })}
          </p>
        </form>
      </section>
    </>
  )
}
