import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { footerPageIds, pageHref } from '@/lib/site'
import { LocaleSelector } from './LocaleSelector'
import { SiteLogo } from '@/components/brand/SiteLogo'

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Navigation' })
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-identity">
          <a href={pageHref('home', locale)} className="site-identity" aria-label="IRESEN">
            <SiteLogo variant="dark" />
          </a>
          <LocaleSelector fullNames />
        </div>
        <nav aria-label={t('footer')} className="footer-links">
          <h2>{t('quickLinks')}</h2>
          <ul>
            {(['institute', 'programmes', 'workWithUs', 'contact'] as const).map((id) => (
              <li key={id}>
                <a href={pageHref(id, locale)}>{pageTitle(id)}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-links">
          <h2>{t('usefulLinks')}</h2>
          <ul>
            {footerPageIds.map((id) => (
              <li key={id}>
                <a href={pageHref(id, locale)}>{pageTitle(id)}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
