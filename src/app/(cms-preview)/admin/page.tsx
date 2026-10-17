import { notFound } from 'next/navigation'
import { cmsInterfaceEnabled } from '@/lib/security/policy'
import { pageIds, pageHref } from '@/lib/site'
import { pageSections } from '@/lib/page-sections'
import messages from '@/messages/fr.json'
import { ConnectedCms } from '@/components/cms-preview/ConnectedCms'
import { workspaceEnabled } from '@/lib/cms-workspace/auth'

export const dynamic = 'force-dynamic'

export default function Page() {
  if (!cmsInterfaceEnabled() || !workspaceEnabled()) notFound()
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
  return <ConnectedCms registry={registry} />
}
