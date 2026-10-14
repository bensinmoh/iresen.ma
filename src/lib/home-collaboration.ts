import type { PageId } from '@/lib/site'
import type { ContactTopic } from '@/lib/contact'

// Owner supplied on 2026-10-09; distinct from young researchers supported.
export const collaborationCount = '+120'
export const collaborationPaths = [
  { id: 'research', pageId: 'programmes' },
  { id: 'solution', pageId: 'opportunities' },
  { id: 'industry', pageId: 'contact', topic: 'platforms' },
  { id: 'decision', pageId: 'contact', topic: 'agency' },
  { id: 'territories', pageId: 'contact', topic: 'partnerships' },
  { id: 'international', pageId: 'workWithUs' },
] as const satisfies readonly { id: string; pageId: PageId; topic?: ContactTopic }[]
