import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'
import { PageSections } from '@/components/content/PageSections'
import { PublishedPageContent } from '@/components/content/PublishedPageContent'

export async function HomePage({ locale }: { locale: Locale }) {
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })

  return (
    <PageShell title={pageTitle('home')} locale={locale} pageId="home" home>
      <PublishedPageContent pageId="home" locale={locale} />
      <PageSections pageId="home" locale={locale} />
    </PageShell>
  )
}
