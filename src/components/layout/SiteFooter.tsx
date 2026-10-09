import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { footerNavigationGroups, footerPageIds, pageHref } from '@/lib/site'
import { footerContact, footerSocialLinks } from '@/lib/footer'
import { LocaleSelector } from './LocaleSelector'
import { FooterIcon } from './FooterIcon'
import { SiteLogo } from '@/components/brand/SiteLogo'

function FooterArrow() {
  return (
    <svg
      className="footer-arrow"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 12h16m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export async function SiteFooter({ locale }: { locale: Locale }) {
  const [navigation, pageTitle, footer] = await Promise.all([
    getTranslations({ locale, namespace: 'Navigation' }),
    getTranslations({ locale, namespace: 'Pages' }),
    getTranslations({ locale, namespace: 'Footer' }),
  ])
  const year = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    timeZone: 'Africa/Casablanca',
  }).format(new Date())

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-identity">
            <a href={pageHref('home', locale)} className="site-identity" aria-label="IRESEN">
              <SiteLogo variant="dark" />
            </a>
            <p className="footer-tagline">
              <strong>{footer('tagline')}</strong>
            </p>
            <p>{footer('description')}</p>
          </div>
          <nav aria-label={navigation('footer')} className="footer-navigation">
            {footerNavigationGroups.map((group) => (
              <div className="footer-links" key={group.id}>
                <h2>{footer(`navigation.${group.id}`)}</h2>
                <ul>
                  {group.pages.map((id) => (
                    <li key={id}>
                      <a href={pageHref(id, locale)}>{pageTitle(id)}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer-contact-row">
          <address className="footer-contact-details">
            <div className="footer-contact-item">
              <FooterIcon name="location" />
              <div>
                <p className="footer-contact-label">{footer('addressLabel')}</p>
                <p className="footer-contact-value">{footer('address')}</p>
              </div>
            </div>
            <div className="footer-contact-item">
              <FooterIcon name="phone" />
              <div>
                <p className="footer-contact-label">{footer('phoneLabel')}</p>
                <a className="footer-contact-value" href={footerContact.phoneHref}>
                  <bdi dir="ltr">{footerContact.phone}</bdi>
                </a>
              </div>
            </div>
            <div className="footer-contact-item">
              <FooterIcon name="email" />
              <div>
                <p className="footer-contact-label">{footer('emailLabel')}</p>
                <a className="footer-contact-value" href={`mailto:${footerContact.email}`}>
                  <bdi dir="ltr">{footerContact.email}</bdi>
                </a>
              </div>
            </div>
          </address>
          <nav className="footer-social" aria-label={footer('socialLabel')}>
            <ul>
              {footerSocialLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} aria-label={footer('socialLink', { network: link.name })}>
                    {link.id === 'researchgate' ? (
                      <span className="footer-researchgate-mark" aria-hidden="true" dir="ltr">
                        R<sup>G</sup>
                      </span>
                    ) : (
                      <FooterIcon name={link.id} />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <section className="footer-newsletter" aria-labelledby="footer-newsletter-title">
          <div className="footer-newsletter-copy">
            <h2 id="footer-newsletter-title">{footer('newsletterTitle')}</h2>
            <p>{footer('newsletterDescription')}</p>
          </div>
          <div className="footer-newsletter-signup">
            <div className="footer-newsletter-field">
              <FooterIcon name="email" />
              <label className="sr-only" htmlFor="footer-newsletter-email">
                {footer('newsletterEmail')}
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                autoComplete="email"
                placeholder={footer('newsletterEmail')}
              />
              <details className="footer-newsletter-attempt">
                <summary
                  className="footer-newsletter-button"
                  role="button"
                  aria-controls="footer-newsletter-status"
                >
                  <span>{footer('newsletterSubscribe')}</span>
                  <FooterArrow />
                </summary>
                <p id="footer-newsletter-status" className="footer-newsletter-status" role="status">
                  {footer('newsletterUnavailable')}
                </p>
              </details>
            </div>
            <label className="footer-newsletter-consent">
              <input type="checkbox" />
              <span>
                {footer.rich('newsletterConsent', {
                  brand: (chunks) => <bdi dir="ltr">{chunks}</bdi>,
                })}
              </span>
            </label>
            <p className="footer-newsletter-privacy">
              <a href={pageHref('privacy', locale)}>{pageTitle('privacy')}</a>
            </p>
          </div>
        </section>

        <nav className="footer-utilities" aria-label={navigation('usefulLinks')}>
          <ul>
            {footerPageIds.map((id) => (
              <li key={id}>
                <a href={pageHref(id, locale)}>{pageTitle(id)}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-bottom">
          <p className="footer-copyright">
            {footer.rich('copyright', { year, brand: (chunks) => <bdi dir="ltr">{chunks}</bdi> })}
          </p>
          <LocaleSelector variant="dropdown" />
        </div>
      </div>
    </footer>
  )
}
