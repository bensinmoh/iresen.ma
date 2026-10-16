import { Heading } from '@/components/ui/Heading'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { footerContact } from '@/lib/footer'
import { pageSections } from '@/lib/page-sections'
import {
  footerPageIds,
  navigationGroups,
  pageHref,
  pageLinkHref,
  newsListingHref,
} from '@/lib/site'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { CookiePreferencesButton } from '@/components/privacy/CookieConsent'

type UtilityPageId = (typeof footerPageIds)[number]
type NoticeSection = { title: string; description: string; details?: string[] }

function readableText(value: string, locale: Locale) {
  if (locale !== 'ar') return value
  return value
    .split(
      /(contact@iresen\.ma|iresen_consent|09-08|Google Maps|Google|IRESEN|CNDP|WCAG 2\.2|AA|PDF)/g,
    )
    .map((part, index) =>
      index % 2 ? (
        <bdi dir="ltr" key={index}>
          {part}
        </bdi>
      ) : (
        part
      ),
    )
}

export async function UtilityPage({ pageId, locale }: { pageId: UtilityPageId; locale: Locale }) {
  const [titles, navigation, text, copy, footer, news] = await Promise.all([
    getTranslations({ locale, namespace: 'Pages' }),
    getTranslations({ locale, namespace: 'Navigation' }),
    getTranslations({ locale, namespace: `PageSections.${pageId}` }),
    getTranslations({ locale, namespace: 'UtilityPages' }),
    getTranslations({ locale, namespace: 'Footer' }),
    getTranslations({ locale, namespace: 'NewsEvents' }),
  ])
  const contact = (
    <address className="utility-contact">
      <span>{footer('address')}</span>
      <a href={`mailto:${footerContact.email}`}>
        <bdi>{footerContact.email}</bdi>
      </a>
      <a href={footerContact.phoneHref}>
        <bdi dir="ltr">{footerContact.phone}</bdi>
      </a>
    </address>
  )
  const groups = [
    { id: 'label', pages: ['home', 'transfer', 'workWithUs', 'search', 'contact'] as const },
    ...navigationGroups,
    { id: 'usefulLinks', pages: footerPageIds },
  ]

  return (
    <div data-utility-page={pageId}>
      <header className="utility-hero">
        <div className="container">
          <h1>{titles(pageId)}</h1>
        </div>
      </header>
      <div className="container utility-body" id="page-sections">
        {pageId === 'sitemap' ? (
          <nav id="site-pages" className="utility-sitemap" aria-label={titles('sitemap')}>
            {groups.map((group) => (
              <section key={group.id} aria-labelledby={`sitemap-${group.id}`}>
                <Heading as="h2" size="compact" id={`sitemap-${group.id}`}>
                  {navigation(group.id)}
                </Heading>
                <ul>
                  {group.pages.map((id) => (
                    <li key={id}>
                      <a href={pageLinkHref(id, locale)}>
                        {titles(id)}
                        <NavigationIcon name="arrow" />
                      </a>
                    </li>
                  ))}

                  {group.id === 'resources' && (
                    <li>
                      <a href={newsListingHref(locale)}>
                        {news('allNews')}
                        <NavigationIcon name="arrow" />
                      </a>
                    </li>
                  )}
                </ul>
              </section>
            ))}
            <span id="catalogues-resources" hidden />
            <span id="search-useful-information" hidden />
          </nav>
        ) : (
          <div className="utility-notice">
            <p className="utility-updated">{copy('updated')}</p>
            {pageSections[pageId].map(({ id }) => {
              const section = text.raw(id) as NoticeSection
              return (
                <section key={id} id={id} aria-labelledby={`${id}-heading`}>
                  <Heading as="h2" size="compact" id={`${id}-heading`}>
                    {section.title}
                  </Heading>
                  <p>{readableText(section.description, locale)}</p>
                  {section.details?.map((paragraph) => (
                    <p key={paragraph}>{readableText(paragraph, locale)}</p>
                  ))}
                  {(id === 'site-publisher' || id === 'controller-scope') && contact}
                  {(id === 'rights-contact' ||
                    id === 'help-feedback' ||
                    id === 'contact-version' ||
                    id === 'effects-contact') && (
                    <a
                      className="utility-action"
                      href={`mailto:${footerContact.email}?subject=${encodeURIComponent(copy(id === 'help-feedback' ? 'accessibilitySubject' : id === 'rights-contact' ? 'rightsSubject' : 'siteSubject'))}`}
                    >
                      {copy(
                        id === 'help-feedback'
                          ? 'reportBarrier'
                          : id === 'rights-contact'
                            ? 'exerciseRights'
                            : 'contact',
                      )}{' '}
                      <NavigationIcon name="arrow" />
                    </a>
                  )}
                  {id === 'rights-contact' && (
                    <p>
                      <a
                        href="https://www.cndp.ma/personnes-concernees/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {copy('cndp')}
                      </a>
                    </p>
                  )}
                  {(id === 'rights-data-protection' ||
                    id === 'security-updates' ||
                    id === 'effects-contact') && (
                    <div className="utility-links">
                      <a href={pageHref('privacy', locale)}>{titles('privacy')}</a>
                      <a href={pageHref('cookies', locale)}>{titles('cookies')}</a>
                    </div>
                  )}
                  {id === 'manage-preferences' && <CookiePreferencesButton />}
                  {id === 'cookies-services' && (
                    <p>
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {copy('googlePrivacy')}
                      </a>
                    </p>
                  )}
                  {id === 'limitations-alternatives' && (
                    <div className="utility-links">
                      <a href={pageHref('sitemap', locale)}>{titles('sitemap')}</a>
                      <a href={pageHref('contact', locale)}>{titles('contact')}</a>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
