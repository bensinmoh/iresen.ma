import type { PageId } from '@/lib/site'

// The three reading stages are shared institutional wayfinding, not new services.
export const homeMissionSectionId = 'develop-test-transfer'

export const homeMissions = [
  { id: 'develop', anchor: 'mission-develop', pageId: 'programmes' },
  { id: 'test', anchor: 'mission-test', pageId: 'platforms' },
  { id: 'transfer', anchor: 'mission-transfer', pageId: 'transfer' },
] as const satisfies readonly { id: string; anchor: string; pageId: PageId }[]

export type HomeMissionId = (typeof homeMissions)[number]['id']
