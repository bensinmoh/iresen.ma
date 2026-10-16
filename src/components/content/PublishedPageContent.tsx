import { Heading } from '@/components/ui/Heading'
import type { Locale } from '@/i18n/locales'
import type { PageId } from '@/lib/site'
import { findPublishedPage } from '@/lib/content/queries'
import { PublishedBody } from './PublishedBody'

export async function PublishedPageContent({ pageId, locale }: { pageId: PageId; locale: Locale }) {
  const content = await findPublishedPage(pageId, locale)
  if (!content) return null
  return (
    <article className="published-content" id="published-content" aria-labelledby="published-title">
      <Heading as="h2" size="section" id="published-title">
        {content.title}
      </Heading>
      <p className="published-summary">{content.summary}</p>
      <PublishedBody body={content.body} />
    </article>
  )
}
