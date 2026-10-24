export const homePlatformsSectionId = 'platforms-expertise'

export const homePlatforms = [
  { id: 'gep', width: 1400, height: 1050, logoWidth: 2659, logoHeight: 1358 },
  { id: 'gsbp', width: 1400, height: 1050, logoWidth: 1636, logoHeight: 647 },
  { id: 'gep-mci', width: 1280, height: 960, logoWidth: 199, logoHeight: 99 },
  { id: 'greenh2a', width: 1920, height: 980, logoWidth: 531, logoHeight: 235 },
] as const

export function platformPhotoPath(id: string) {
  if (id === 'greenh2a') return '/images/platforms/greenh2a-gapp-079.webp'
  return id === 'gep-mci' ? '/images/platforms/gep-mci-campus.webp' : `/images/platforms/${id}.webp`
}
