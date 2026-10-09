import { getTranslations } from 'next-intl/server'
import { connection } from 'next/server'
import type { Locale } from '@/i18n/locales'
import { PageShell } from '@/components/layout/PageShell'
import { PageSections } from '@/components/content/PageSections'
import { PublishedContent } from '@/components/content/PublishedContent'
import { findPublishedPage } from '@/lib/content/queries'

export async function HomePage({ locale }: { locale: Locale }) {
  const pageTitle = await getTranslations({ locale, namespace: 'Pages' })
  const states = await getTranslations({ locale, namespace: 'States' })
  let content: Awaited<ReturnType<typeof findPublishedPage>> = null
  let contentUnavailable = false
  // Read the current published revision rather than a deployment-time content snapshot.
  await connection()
  try {
    content = await findPublishedPage('home', locale)
  } catch {
    console.error('Published homepage content could not be loaded.')
    contentUnavailable = true
  }

  return (
    <PageShell title={pageTitle('home')} locale={locale} pageId="home" home>
      {content ? (
        <PublishedContent
          title={content.title !== pageTitle('home') ? content.title : undefined}
          summary={content.summary}
          body={content.body}
          locale={locale}
        />
      ) : contentUnavailable ? (
        <div className="empty-state" role="status">
          <p>{states('contentUnavailable')}</p>
        </div>
      ) : null}
      <PageSections pageId="home" locale={locale} />
    </PageShell>
  )
}
