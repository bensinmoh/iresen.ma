import type { PageId } from '@/lib/site'

// Stable shortcuts distinguish the research core from its complementary dimensions.
export const homeMissionSectionId = 'develop-test-transfer'
export const homeCooperationAnchor = 'mission-cooperation'
export const legacyMissionAnchors = ['mission-develop', 'mission-test', 'mission-transfer'] as const

export const homeMissions = [
  {
    id: 'research',
    anchor: 'mission-research',
    pageId: 'institute',
    destinationAnchor: 'institute-research',
    imageId: 'develop',
  },
  {
    id: 'studies',
    anchor: 'mission-studies',
    pageId: 'network',
    destinationAnchor: 'intervention-modes',
    imageId: 'transfer',
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
