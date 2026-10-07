import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'

export async function PageShell({
  title,
  locale,
  children,
  home = false,
}: {
  title: string
  locale: Locale
  children: ReactNode
  home?: boolean
}) {
  const t = await getTranslations({ locale, namespace: 'Pages' })

  return (
    <div className="container page-shell">
      {!home && (
        <div className="breadcrumb">
          <a href={pageHref('home', locale)}>{t('home')}</a>
        </div>
      )}
      <div className="page-heading">
        <h1>{title}</h1>
      </div>
      <div className="page-content">{children}</div>
    </div>
  )
}
