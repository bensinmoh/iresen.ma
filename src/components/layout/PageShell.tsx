import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref, type PageId } from '@/lib/site'
import { PageHero } from '@/components/hero/PageHero'

export async function PageShell({
  title,
  locale,
  children,
  home = false,
  showBreadcrumb = true,
  pageId,
  sectionNavigation,
}: {
  title: string
  locale: Locale
  children: ReactNode
  home?: boolean
  showBreadcrumb?: boolean
  pageId?: PageId
  sectionNavigation?: ReactNode
}) {
  const t = await getTranslations({ locale, namespace: 'Pages' })

  return (
    <>
      {pageId && <PageHero pageId={pageId} locale={locale} />}
      {sectionNavigation}
      <div className="container page-shell" id={pageId ? 'page-sections' : undefined}>
        {!home && showBreadcrumb && (
          <div className="breadcrumb">
            <a href={pageHref('home', locale)}>{t('home')}</a>
          </div>
        )}
        {!pageId && (
          <div className="page-heading">
            <h1>{title}</h1>
          </div>
        )}
        <div className="page-content">{children}</div>
      </div>
    </>
  )
}
