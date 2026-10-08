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
  pageId,
}: {
  title: string
  locale: Locale
  children: ReactNode
  home?: boolean
  pageId?: PageId
}) {
  const t = await getTranslations({ locale, namespace: 'Pages' })

  return (
    <>
      {pageId && <PageHero pageId={pageId} locale={locale} />}
      <div className="container page-shell" id={pageId ? 'page-sections' : undefined}>
        {!home && (
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
