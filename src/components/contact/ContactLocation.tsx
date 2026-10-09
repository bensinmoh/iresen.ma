'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { contactLocation } from '@/lib/contact'
import { FooterIcon } from '@/components/layout/FooterIcon'

export function ContactLocation() {
  const t = useTranslations('Contact.location')
  const footer = useTranslations('Footer')
  const [loaded, setLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const loadButtonRef = useRef<HTMLButtonElement>(null)
  const interacted = useRef(false)

  useEffect(() => {
    if (!interacted.current) return
    if (loaded) iframeRef.current?.focus()
    else loadButtonRef.current?.focus()
  }, [loaded])

  return (
    <section className="contact-location" id="locations" aria-labelledby="contact-location-heading">
      <div className="container contact-location-heading">
        <div>
          <p className="contact-eyebrow">{t('eyebrow')}</p>
          <h2 id="contact-location-heading">{t('title')}</h2>
          <p>{footer('address')}</p>
        </div>
        <a
          className="button button-outline"
          href={contactLocation.directionsHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('externalLink')} <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="contact-map">
        {loaded ? (
          <iframe
            ref={iframeRef}
            src={contactLocation.embedHref}
            title={t('mapTitle')}
            referrerPolicy="no-referrer"
            allowFullScreen
          />
        ) : (
          <div className="contact-map-placeholder">
            <FooterIcon name="location" />
            <h3>{t('title')}</h3>
            <p>{t('description')}</p>
            <button
              ref={loadButtonRef}
              className="button button-primary"
              type="button"
              onClick={() => {
                interacted.current = true
                setLoaded(true)
              }}
            >
              {t('loadMap')}
            </button>
          </div>
        )}
      </div>
      <div className="container contact-map-note">
        <p>{t('privacyNotice')}</p>
        {loaded && (
          <button type="button" className="contact-text-button" onClick={() => setLoaded(false)}>
            {t('removeMap')}
          </button>
        )}
      </div>
    </section>
  )
}
