import { Heading } from '@/components/ui/Heading'
import { CookiePreferencesButton } from '@/components/privacy/CookieConsent'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { footerPageIds, navigationGroups, pageLinkHref, type PageId } from '@/lib/site'
import { PageShell } from '@/components/layout/PageShell'
import { PageSections } from '@/components/content/PageSections'
import { PublishedPageContent } from './PublishedPageContent'
import { PublishedNewsList } from './PublishedNewsList'

export async function EmptyPage({ pageId, locale }: { pageId: PageId; locale: Locale }) {
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })
  const states = await getTranslations({ locale, namespace: 'States' })
  const navigation = await getTranslations({ locale, namespace: 'Navigation' })
  const cookieText =
    pageId === 'cookies' ? await getTranslations({ locale, namespace: 'CookieConsent' }) : null
  let emptyMessage: string | undefined
  if (pageId === 'contact') emptyMessage = states('contactUnavailable')

  const directory =
    pageId === 'sitemap' ? (
      <div className="sitemap-grid">
        <section>
          <Heading as="h3" size="card">
            {navigation('label')}
          </Heading>
          <ul>
            {(['home', 'transfer', 'workWithUs', 'search', 'contact'] as const).map((id) => (
              <li key={id}>
                <a href={pageLinkHref(id, locale)}>{pageTitle(id)}</a>
              </li>
            ))}
          </ul>
        </section>
        {navigationGroups.map((group) => (
          <section key={group.id}>
            <Heading as="h3" size="card">
              {navigation(group.id)}
            </Heading>
            <ul>
              {group.pages.map((id) => (
                <li key={id}>
                  <a href={pageLinkHref(id, locale)}>{pageTitle(id)}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section>
          <Heading as="h3" size="card">
            {navigation('usefulLinks')}
          </Heading>
          <ul>
            {footerPageIds.map((id) => (
              <li key={id}>
                <a href={pageLinkHref(id, locale)}>{pageTitle(id)}</a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    ) : undefined

  return (
    <PageShell title={pageTitle(pageId)} locale={locale} pageId={pageId}>
      <PublishedPageContent pageId={pageId} locale={locale} />
      {emptyMessage && (
        <div className="empty-state page-service-notice">
          <p>{emptyMessage}</p>
        </div>
      )}
      <PageSections
        pageId={pageId}
        locale={locale}
        contentBySection={
          directory
            ? { 'site-pages': directory }
            : pageId === 'cookies'
              ? {
                  'manage-preferences': <CookiePreferencesButton />,
                  'cookies-services': (
                    <>
                      <p>{cookieText?.('necessaryDescription')}</p>
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google — {pageTitle('privacy')}
                      </a>
                    </>
                  ),
                }
              : pageId === 'news'
                ? { 'all-news': <PublishedNewsList locale={locale} /> }
                : undefined
        }
      />
    </PageShell>
  )
}
