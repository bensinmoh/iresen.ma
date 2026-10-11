import { researchThemes } from '@/lib/home-research'

// Owner-supplied page manuscript, aligned with the consolidated theme taxonomy.
export const roadmapDomains = [...researchThemes] as const
export type RoadmapDomain = (typeof roadmapDomains)[number]

export const roadmapMedia = [...roadmapDomains] as const
export const roadmapHeroPath = '/images/roadmap/hero-board.webp'

export const roadmapDimensions: Record<RoadmapDomain, { width: number; height: number }> = {
  renewables: { width: 1536, height: 1024 },
  hydrogen: { width: 1672, height: 941 },
  industry: { width: 1536, height: 1024 },
  water: { width: 1536, height: 1024 },
  circular: { width: 1536, height: 1024 },
  buildings: { width: 1536, height: 1024 },
  mobility: { width: 1774, height: 887 },
}

export function roadmapMediaPath(id: (typeof roadmapMedia)[number]) {
  return `/images/roadmap/${id}.webp`
}

export function roadmapDrawingPath(id: RoadmapDomain) {
  return `/images/roadmap/${id}-drawing.webp`
}
