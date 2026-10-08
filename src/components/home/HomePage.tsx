import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'

// Introducing hero only; the sections await approved editorial content.
export async function HomePage({ locale }: { locale: Locale }) {
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })
  const states = await getTranslations({ locale, namespace: 'States' })

  return (
    <PageShell title={pageTitle('home')} locale={locale} pageId="home" home>
      <div className="empty-state">
        <p>{states('empty')}</p>
      </div>
    </PageShell>
  )
}
