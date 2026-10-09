import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { contactLocation } from '@/lib/contact'

export async function ContactLocation({ locale }: { locale: Locale }) {
  const [t, footer] = await Promise.all([
    getTranslations({ locale, namespace: 'Contact.location' }),
    getTranslations({ locale, namespace: 'Footer' }),
  ])

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
        <iframe
          src={contactLocation.embedHref}
          title={t('mapTitle')}
          loading="lazy"
          referrerPolicy="no-referrer"
          allowFullScreen
        />
      </div>
    </section>
  )
}
