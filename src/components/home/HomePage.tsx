import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'

// The next homepage milestone starts here. Approved copy and assets will replace
// this honest empty state; no institutional claims or mock datasets are seeded.
export async function HomePage({ locale }: { locale: Locale }) {
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })
  const states = await getTranslations({ locale, namespace: 'States' })

  return (
    <PageShell title={pageTitle('home')} locale={locale} home>
      <div className="empty-state">
        <p>{states('empty')}</p>
      </div>
    </PageShell>
  )
}
