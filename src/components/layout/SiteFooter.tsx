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
            <p>
              {footer.rich('description', { brand: (chunks) => <bdi dir="ltr">{chunks}</bdi> })}
            </p>
          </div>
          <nav aria-label={navigation('footer')} className="footer-navigation">
            {footerNavigationGroups.map((group) => (
              <div className="footer-links" key={group.id}>
                <h2>{navigation(group.id)}</h2>
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

        <section className="footer-engagement" aria-labelledby="footer-engagement-title">
          <div>
            <h2 id="footer-engagement-title">
              <a href={pageHref('workWithUs', locale)}>{pageTitle('workWithUs')}</a>
            </h2>
            <p>
              {footer.rich('collaborationDescription', {
                brand: (chunks) => <bdi dir="ltr">{chunks}</bdi>,
              })}
            </p>
          </div>
          <div className="footer-engagement-actions">
            <a className="button footer-contact-button" href={pageHref('contact', locale)}>
              {pageTitle('contact')}
              <FooterArrow />
            </a>
            <a className="footer-news-link" href={pageHref('news', locale)}>
              {pageTitle('news')}
              <FooterArrow />
            </a>
            <a className="footer-news-link" href={pageHref('transfer', locale)}>
              {pageTitle('transfer')}
              <FooterArrow />
            </a>
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
