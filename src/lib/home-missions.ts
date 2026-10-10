import type { PageId } from '@/lib/site'

// The legacy section URL remains stable; domains replace the former stage cards.
export const homeMissionSectionId = 'develop-test-transfer'
export const homeCooperationAnchor = 'mission-cooperation'
export const legacyMissionAnchors = ['mission-develop', 'mission-test', 'mission-transfer'] as const

export const homeMissions = [
  {
    id: 'studies',
    anchor: 'mission-studies',
    pageId: 'network',
    destinationAnchor: 'intervention-modes',
    imageId: 'transfer',
  },
  {
    id: 'research',
    anchor: 'mission-research',
    pageId: 'programmes',
    destinationAnchor: undefined,
    imageId: 'develop',
  },
  {
    id: 'skills',
    anchor: 'mission-skills',
    pageId: 'network',
    destinationAnchor: 'skills-training',
    imageId: 'test',
  },
] as const satisfies readonly {
  id: string
  anchor: string
  pageId: PageId
  destinationAnchor?: string
  imageId: string
}[]

export type HomeMissionId = (typeof homeMissions)[number]['id']
