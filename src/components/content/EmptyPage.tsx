import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { footerPageIds, navigationGroups, pageHref, type PageId } from '@/lib/site'
import { PageShell } from '@/components/layout/PageShell'
import { PageSections } from '@/components/content/PageSections'
import { findPublishedPage } from '@/lib/content/queries'
import { PublishedContent } from './PublishedContent'
import { PublishedNews } from './PublishedNews'

export async function EmptyPage({
  pageId,
  locale,
  articleId,
}: {
  pageId: PageId
  locale: Locale
  articleId?: string
}) {
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })
  const states = await getTranslations({ locale, namespace: 'States' })
  const navigation = await getTranslations({ locale, namespace: 'Navigation' })
  let emptyMessage: string | undefined
  if (pageId === 'contact') emptyMessage = states('contactUnavailable')
  if (pageId === 'cookies') emptyMessage = states('noTracking')
  let content: Awaited<ReturnType<typeof findPublishedPage>> = null
  let contentUnavailable = false
  if (pageId !== 'sitemap' && pageId !== 'search') {
    try {
      content = await findPublishedPage(pageId, locale)
    } catch {
      console.error('Published page content could not be loaded.')
      contentUnavailable = true
    }
  }

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
      {emptyMessage && (
        <div className="empty-state page-service-notice">
          <p>{emptyMessage}</p>
        </div>
      )}
      {contentUnavailable && (
        <div className="empty-state" role="status">
          <p>{states('contentUnavailable')}</p>
        </div>
      )}
      {content && (
        <PublishedContent
          title={content.title !== pageTitle(pageId) ? content.title : undefined}
          summary={content.summary}
          body={content.body}
          locale={locale}
        />
      )}
      <PageSections
        // Published records supplement the editorial scaffold until section mapping exists.
        pageId={pageId}
        locale={locale}
        contentBySection={
          directory
            ? { 'site-pages': directory }
            : pageId === 'news'
              ? { 'all-news': <PublishedNews locale={locale} articleId={articleId} /> }
              : undefined
        }
      />
    </PageShell>
  )
}
