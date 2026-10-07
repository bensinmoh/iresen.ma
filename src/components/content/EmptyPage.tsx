import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { footerPageIds, navigationGroups, pageHref, type PageId } from '@/lib/site'
import { PageShell } from '@/components/layout/PageShell'

export async function EmptyPage({ pageId, locale }: { pageId: PageId; locale: Locale }) {
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })
  const states = await getTranslations({ locale, namespace: 'States' })
  const navigation = await getTranslations({ locale, namespace: 'Navigation' })
  const institute = await getTranslations({ locale, namespace: 'Institute' })
  const sections = [
    { id: 'about', title: institute('about') },
    { id: 'mission', title: institute('mission') },
    { id: 'key-figures', title: institute('keyFigures') },
  ]
  let emptyMessage = states('empty')
  if (pageId === 'search') emptyMessage = states('searchUnavailable')
  if (pageId === 'contact') emptyMessage = states('contactUnavailable')
  if (pageId === 'cookies') emptyMessage = states('noTracking')

  return (
    <PageShell title={pageTitle(pageId)} locale={locale}>
      {pageId === 'institute' ? (
        <>
          <nav aria-label={navigation('sections')} className="section-navigation">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="empty-section">
              <h2>{section.title}</h2>
              <p>{states('empty')}</p>
            </section>
          ))}
        </>
      ) : pageId === 'sitemap' ? (
        <div className="sitemap-grid">
          <ul>
            {(['home', 'transfer', 'workWithUs', 'search', 'contact'] as const).map((id) => (
              <li key={id}>
                <a href={pageHref(id, locale)}>{pageTitle(id)}</a>
              </li>
            ))}
          </ul>
          {navigationGroups.map((group) => (
            <section key={group.id}>
              <h2>{navigation(group.id)}</h2>
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
            <h2>{navigation('usefulLinks')}</h2>
            <ul>
              {footerPageIds.map((id) => (
                <li key={id}>
                  <a href={pageHref(id, locale)}>{pageTitle(id)}</a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      )}
    </PageShell>
  )
}
