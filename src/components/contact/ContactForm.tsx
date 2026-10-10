'use client'

import { useState, useSyncExternalStore, type FormEvent } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Patent } from '@/lib/patents'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { footerContact } from '@/lib/footer'
import { contactEmailHref, contactTopics, isContactTopic, type ContactTopic } from '@/lib/contact'

const subscribeToHydration = () => () => {}

export function ContactForm({
  locale,
  initialTopic,
  initialPatent,
}: {
  locale: Locale
  initialTopic?: ContactTopic
  initialPatent?: Patent
}) {
  const t = useTranslations('Contact.form')
  const transfer = useTranslations('Transfer')
  const ready = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  )
  const [subject, setSubject] = useState(initialTopic ?? '')
  const [draft, setDraft] = useState<string>()

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const read = (name: string) => String(data.get(name) ?? '').trim()
    // Native required controls validate before this handler runs. Whitespace
    // alone is not a useful name/message; keep that feedback on the control.
    for (const name of ['fullName', 'message']) {
      const control = event.currentTarget.elements.namedItem(name) as
        HTMLInputElement | HTMLTextAreaElement
      control.setCustomValidity(read(name) ? '' : t('requiredHint'))
    }
    if (!event.currentTarget.reportValidity()) return
    const topic = read('subject')
    if (!isContactTopic(topic)) return
    const body = ['fullName', 'organisation', 'email', 'phone']
      .filter((name) => read(name))
      .map((name) => `${t(`${name}.label`)}: ${read(name)}`)
      .concat('', `${t('message.label')}:`, read('message'))
      .join('\n')
    setDraft(contactEmailHref(t('mailSubject', { subject: t(`topics.${topic}`) }), body))
  }

  return (
    <section
      id="send-request"
      className="contact-form-section"
      aria-labelledby="contact-form-heading"
    >
      <div className="container">
        <div className="contact-form-heading">
          <p className="contact-eyebrow">
            <Image
              src="/brand/apex-leaf.svg"
              alt=""
              aria-hidden="true"
              width={1773}
              height={2870}
              unoptimized
            />
            <span>{t('eyebrow')}</span>
          </p>
          <h2 id="contact-form-heading">{t('title')}</h2>
          <p>{t('description')}</p>
        </div>
        <form
          className="contact-form"
          onSubmit={prepareEmail}
          onInput={(event) => {
            setDraft(undefined)
            const target = event.target
            if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
              target.setCustomValidity('')
          }}
        >
          <p className="contact-required-hint">{t('requiredHint')}</p>
          <div className="contact-form-grid">
            {(['fullName', 'organisation', 'email', 'phone'] as const).map((name) => (
              <div className="contact-field" key={name}>
                <label htmlFor={`contact-${name}`}>
                  {t(`${name}.label`)}
                  {(name === 'organisation' || name === 'phone') && (
                    <span className="contact-optional"> · {t('optional')}</span>
                  )}
                </label>
                <input
                  id={`contact-${name}`}
                  name={name}
                  type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                  autoComplete={
                    name === 'fullName'
                      ? 'name'
                      : name === 'organisation'
                        ? 'organization'
                        : name === 'phone'
                          ? 'tel'
                          : 'email'
                  }
                  dir={name === 'email' || name === 'phone' ? 'ltr' : undefined}
                  placeholder={t(`${name}.placeholder`)}
                  required={name === 'fullName' || name === 'email'}
                  maxLength={name === 'phone' ? 50 : 200}
                  disabled={!ready}
                />
              </div>
            ))}
          </div>
          <div className="contact-field">
            <label htmlFor="contact-subject">{t('subject.label')}</label>
            <select
              id="contact-subject"
              name="subject"
              required
              disabled={!ready}
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value)
                setDraft(undefined)
              }}
            >
              <option value="" disabled>
                {t('subject.placeholder')}
              </option>
              {contactTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {t(`topics.${topic}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="contact-field">
            <label htmlFor="contact-message">{t('message.label')}</label>
            <textarea
              id="contact-message"
              name="message"
              defaultValue={
                initialPatent
                  ? transfer('contactMessage', {
                      reference: initialPatent.reference,
                      title: initialPatent.title[locale],
                    })
                  : undefined
              }
              placeholder={t('message.placeholder')}
              required
              disabled={!ready}
              maxLength={4000}
              rows={6}
            />
          </div>
          <button className="button button-primary contact-submit" type="submit" disabled={!ready}>
            {t('action')}
          </button>
          <div className="contact-draft" role="status" aria-live="polite">
            {draft && (
              <>
                <p>{t('prepared')}</p>
                <a className="button button-primary" href={draft}>
                  {t('openEmail')}
                </a>
              </>
            )}
          </div>
          <p className="contact-form-disclosure" id="information-use">
            {t('disclosure')} <a href={pageHref('privacy', locale)}>{t('privacyLink')}</a>
          </p>
          <p className="contact-form-fallback" id="request-follow-up">
            {t('fallback')}{' '}
            <a href={`mailto:${footerContact.email}`}>
              <bdi dir="ltr">{footerContact.email}</bdi>
            </a>
          </p>
        </form>
      </div>
    </section>
  )
}
