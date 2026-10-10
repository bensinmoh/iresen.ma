import biography from '@/data/samir-biography.json'

export const samirPhotoId = 'portrait-dg-iresen-samir-rachidi'
export const samirCutout = '/images/media-library/samir-rachidi-cutout-v2.webp'
export const samirBiography = biography
export const samirBiographyText = [
  biography.name,
  ...biography.roles,
  ...biography.paragraphs,
].join('\n\n')
