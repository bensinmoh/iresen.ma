import type { PageId } from '@/lib/site'

export const researchMissions = [
  { id: 'develop', legacyAnchor: 'mission-develop', pageId: 'programmes' },
  { id: 'test', legacyAnchor: 'mission-test', pageId: 'platforms' },
  { id: 'transfer', legacyAnchor: 'mission-transfer', pageId: 'transfer' },
] as const satisfies readonly { id: string; legacyAnchor: string; pageId: PageId }[]

export const complementaryDimensions = [
  { id: 'studies', pageId: 'network', anchor: 'intervention-modes' },
  { id: 'skills', pageId: 'network', anchor: 'skills-training' },
  { id: 'cooperation', pageId: 'workWithUs', anchor: 'collaboration-references' },
] as const satisfies readonly { id: string; pageId: PageId; anchor: string }[]

export const sharedCapabilities = [
  'expertise',
  'programmes',
  'platforms',
  'data',
  'people',
  'partnerships',
  'resources',
  'ip',
] as const

export const strategicOrientations = ['excellence', 'mastery', 'value'] as const
