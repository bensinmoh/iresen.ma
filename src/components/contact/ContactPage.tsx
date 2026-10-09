import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref, type PageId } from '@/lib/site'
import { footerContact } from '@/lib/footer'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactLocation } from '@/components/contact/ContactLocation'
import { contactLocation, type ContactTopic } from '@/lib/contact'

const departments = ['agency', 'partnerships', 'press', 'careers'] as const
const platforms = ['gep', 'gsbp', 'greenH2', 'africa'] as const
const faqRoutes = {
  calls: 'programmes',
  access: 'platforms',
  visits: 'contact',
  careers: 'opportunities',
  press: 'media',
  publications: 'publications',
} as const satisfies Record<string, PageId>

export async function ContactPage({
  locale,
  initialTopic,
}: {
  locale: Locale
  initialTopic?: ContactTopic
}) {
  const t = await getTranslations({ locale, namespace: 'Contact' })
  const footer = await getTranslations({ locale, namespace: 'Footer' })
  const topicHref = (topic: string) =>
    `${pageHref('contact', locale)}?subject=${topic}#send-request`

  return (
    <div className="contact-page">
      <section className="contact-intro" id="route-request" aria-labelledby="contact-heading">
        <div className="contact-intro-copy">
          <Image
            className="contact-intro-image"
            src="/images/contact/contact-background-79bad501a298.png"
            alt=""
            fill
            sizes="(min-width: 70rem) 85vw, (min-width: 40rem) 100vw, 225vw"
            quality={90}
            preload
          />
          <div className="contact-intro-text">
            <h1 id="contact-heading">
              {t('hero.title')} <span>{t('hero.accent')}</span>
            </h1>
            <p>{t('hero.description')}</p>
            <a href="#send-request" className="button button-primary">
              {t('hero.action')} <span aria-hidden="true">⌄</span>
            </a>
          </div>
        </div>
        <div className="contact-headquarters">
          <p className="contact-eyebrow">{t('headquarters.eyebrow')}</p>
          <h2>{t('headquarters.title')}</h2>
          <dl className="contact-details">
            <div>
              <dt>{t('headquarters.addressLabel')}</dt>
              <dd>
                <a href={contactLocation.directionsHref}>{footer('address')}</a>
              </dd>
            </div>
            <div>
              <dt>{t('headquarters.phoneLabel')}</dt>
              <dd>
                <a href={footerContact.phoneHref}>
                  <bdi dir="ltr">{footerContact.phone}</bdi>
                </a>
              </dd>
            </div>
            <div>
              <dt>{t('headquarters.emailLabel')}</dt>
              <dd>
                <a href={`mailto:${footerContact.email}`}>
                  <bdi dir="ltr">{footerContact.email}</bdi>
                </a>
              </dd>
            </div>
          </dl>
          <nav className="contact-departments" aria-label={t('departments.label')}>
            {departments.map((department) => (
              <div key={department}>
                <h3>{t(`departments.${department}.title`)}</h3>
                <p>{t(`departments.${department}.description`)}</p>
                <a href={topicHref(department)}>
                  {t('departments.action')} <span aria-hidden="true">↗</span>
                </a>
              </div>
            ))}
          </nav>
        </div>
      </section>
      <section
        className="contact-platforms container"
        id="page-sections"
        aria-labelledby="contact-platforms-heading"
      >
        <h2 id="contact-platforms-heading">{t('platforms.title')}</h2>
        <p>{t('platforms.description')}</p>
        <div className="contact-platform-grid">
          {platforms.map((platform) => (
            <article key={platform}>
              <h3>
                <bdi dir="ltr">{t(`platforms.${platform}.title`)}</bdi>
              </h3>
              <p>{t(`platforms.${platform}.description`)}</p>
              <a href={pageHref('platforms', locale)}>
                {t('platforms.action')} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>
      <ContactForm locale={locale} initialTopic={initialTopic} />
      <section
        className="container contact-faq"
        id="practical-questions"
        aria-labelledby="contact-faq-heading"
      >
        <div className="contact-faq-intro">
          <p className="contact-eyebrow">{t('faq.eyebrow')}</p>
          <h2 id="contact-faq-heading">{t('faq.title')}</h2>
          <p>{t('faq.description')}</p>
          <a href="#send-request" className="button button-primary">
            {t('faq.contact')} <span aria-hidden="true">⌃</span>
          </a>
        </div>
        <div className="contact-faq-list">
          {Object.entries(faqRoutes).map(([question, pageId]) => (
            <details key={question}>
              <summary>
                <span>{t(`faq.questions.${question}.question`)}</span>
                <span className="contact-faq-toggle" aria-hidden="true" />
              </summary>
              <div className="contact-faq-answer">
                <p>{t(`faq.questions.${question}.answer`)}</p>
                <a
                  href={
                    question === 'press'
                      ? topicHref('press')
                      : question === 'visits'
                        ? topicHref('platforms')
                        : pageHref(pageId, locale)
                  }
                >
                  {t(`faq.questions.${question}.action`)} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </details>
          ))}
        </div>
      </section>
      <ContactLocation />
    </div>
  )
}
