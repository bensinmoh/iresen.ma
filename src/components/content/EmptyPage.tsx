import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { footerPageIds, navigationGroups, pageHref, type PageId } from '@/lib/site'
import { PageShell } from '@/components/layout/PageShell'
import { PageSections } from '@/components/content/PageSections'
import { PublishedPageContent } from './PublishedPageContent'
import { PublishedNewsList } from './PublishedNewsList'

export async function EmptyPage({ pageId, locale }: { pageId: PageId; locale: Locale }) {
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })
  const states = await getTranslations({ locale, namespace: 'States' })
  const navigation = await getTranslations({ locale, namespace: 'Navigation' })
  let emptyMessage: string | undefined
  if (pageId === 'contact') emptyMessage = states('contactUnavailable')
  if (pageId === 'cookies') emptyMessage = states('noTracking')

  const directory =
    pageId === 'sitemap' ? (
      <div className="sitemap-grid">
        <section>
          <h3>{navigation('label')}</h3>
          <ul>
            {(['home', 'transfer', 'workWithUs', 'search', 'contact'] as const).map((id) => (
              <li key={id}>
                <a href={pageHref(id, locale)}>{pageTitle(id)}</a>
              </li>
            ))}
          </ul>
        </section>
        {navigationGroups.map((group) => (
          <section key={group.id}>
            <h3>{navigation(group.id)}</h3>
            <ul>
              {group.pages.map((id) => (
                <li key={id}>
                  <a href={pageHref(id, locale)}>{pageTitle(id)}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section>
          <h3>{navigation('usefulLinks')}</h3>
          <ul>
            {footerPageIds.map((id) => (
              <li key={id}>
                <a href={pageHref(id, locale)}>{pageTitle(id)}</a>
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
            : pageId === 'news'
              ? { 'all-news': <PublishedNewsList locale={locale} /> }
              : undefined
        }
      />
    </PageShell>
  )
}
