// Source taxonomy: docs/references/strategy/proposition-consolidee-rd-dprdire.md.
// Owner requested FR/EN/AR working copy; this is not a strategy-adoption claim.
export const homeResearchSectionId = 'research-priorities'
export const researchThemes = [
  'renewables',
  'hydrogen',
  'industry',
  'water',
  'circular',
  'buildings',
  'mobility',
] as const
export type ResearchThemeId = (typeof researchThemes)[number]
export type ResearchCopy = {
  eyebrow: string
  title: string
  action: string
  axis: string
  axesLabel: string
  themes: Record<
    ResearchThemeId,
    {
      title: string
      description: string
      axes: string[]
      imageTitle: string
      imageDescription: string
    }
  >
}
export const researchImages: Record<
  ResearchThemeId,
  { src: string; width: number; height: number }
> = {
  renewables: { src: '/images/heroes/wind-landscape-f05d7711d8d0.webp', width: 1536, height: 1024 },
  hydrogen: { src: '/images/domains/hydrogen.webp', width: 1600, height: 596 },
  industry: { src: '/images/domains/industry.webp', width: 1600, height: 600 },
  water: { src: '/images/domains/water.webp', width: 1600, height: 600 },
  circular: { src: '/images/domains/circular.webp', width: 1600, height: 595 },
  buildings: { src: '/images/domains/buildings.webp', width: 1600, height: 596 },
  mobility: { src: '/images/domains/mobility.webp', width: 1600, height: 596 },
}
