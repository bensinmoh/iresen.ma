import { homePlatforms } from './home-platforms'

// Manuscript sections; missing official destinations deliberately stay absent.
export const researchPlatforms = homePlatforms.map((platform, index) => ({
  ...platform,
  anchor: [
    'green-energy-park',
    'green-smart-building-park',
    'green-energy-park-maroc-cote-ivoire',
    'greenh2a',
  ][index]!,
  infrastructureCount: platform.id === 'gep-mci' ? 4 : 3,
  url: platform.id === 'gep' ? 'https://www.greenenergypark.ma/' : undefined,
}))

export const platformLegacyAnchors = [
  'choose-by-need',
  'platform-network',
  'capabilities-availability',
  'testing-demonstration',
  'access-platforms',
  'projects-resources',
] as const
