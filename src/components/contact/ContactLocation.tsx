import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { ConsentMap } from '@/components/privacy/ConsentMap'
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
          <SectionEyebrow>{t('eyebrow')}</SectionEyebrow>
          <h2 id="contact-location-heading">{t('title')}</h2>
          <p>{footer('address')}</p>
        </div>
        <a
          className="button button-outline"
          href={contactLocation.directionsHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('externalLink')} <NavigationIcon name="arrow-up-right" />
        </a>
      </div>
      <div className="contact-map">
        <ConsentMap src={contactLocation.embedHref} title={t('mapTitle')} />
      </div>
    </section>
  )
}
