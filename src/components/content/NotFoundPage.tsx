import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import { PageShell } from '@/components/layout/PageShell'

export async function NotFoundPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'States' })

  return (
    <PageShell title={t('notFoundTitle')} locale={locale}>
      <p>{t('notFoundDescription')}</p>
      <a className="button button-primary" href={pageHref('home', locale)}>
        {t('backHome')}
      </a>
    </PageShell>
  )
}
