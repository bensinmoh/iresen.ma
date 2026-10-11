import { notFound } from 'next/navigation'
import { pageIds, pageHref } from '@/lib/site'
import { pageSections } from '@/lib/page-sections'
import messages from '@/messages/fr.json'
import { CmsPreview } from '@/components/cms-preview/CmsPreview'

export const dynamic = 'force-dynamic'

export default function Page() {
  // This unauthenticated local design tool is absent in production unless explicitly enabled.
  if (process.env.NODE_ENV === 'production' && process.env.CMS_INTERFACE_PREVIEW_ENABLED !== 'true')
    notFound()
  const sectionNames = messages.PageSections as Record<string, Record<string, { title?: string }>>
  const registry = pageIds.map((id) => ({
    id,
    title: messages.Pages[id],
    href: pageHref(id, 'fr'),
    sections: pageSections[id].map((section) => ({
      id: section.id,
      title: sectionNames[id]?.[section.id]?.title ?? section.id,
    })),
  }))
  return <CmsPreview registry={registry} />
}
