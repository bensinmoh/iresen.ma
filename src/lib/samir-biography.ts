import biography from '@/data/samir-biography.json' with { type: 'json' }
import english from '@/data/samir-biography.en.json' with { type: 'json' }
import arabic from '@/data/samir-biography.ar.json' with { type: 'json' }

export const samirPhotoId = 'portrait-dg-iresen-samir-rachidi'
export const samirPortraitDownload =
  '/images/media-library/portrait-dg-iresen-samir-rachidi-official.jpg'
export const samirCutout = '/images/media-library/samir-rachidi-cutout-v2.webp'
export const samirBiographies = { fr: biography, en: english, ar: arabic }
export const samirBiographyTexts = Object.fromEntries(
  Object.entries(samirBiographies).map(([locale, item]) => [
    locale,
    [item.name, ...item.roles, ...item.paragraphs].join('\n\n'),
  ]),
) as Record<keyof typeof samirBiographies, string>
