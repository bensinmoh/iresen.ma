import type { PageId } from '@/lib/site'
import type { ContactTopic } from '@/lib/contact'

// Owner supplied on 2026-10-09; distinct from young researchers supported.
export const collaborationCount = '+120'
export const collaborationPaths = [
  { id: 'research', pageId: 'opportunities' },
  { id: 'solution', pageId: 'contact', topic: 'partnerships' },
  { id: 'industry', pageId: 'contact', topic: 'platforms' },
  { id: 'decision', pageId: 'contact', topic: 'agency' },
] as const satisfies readonly { id: string; pageId: PageId; topic?: ContactTopic }[]
