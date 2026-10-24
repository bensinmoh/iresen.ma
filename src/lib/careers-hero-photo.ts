import type { Locale } from '@/i18n/locales'
export const careersHeroPhoto = {
  src: '/images/careers/headquarters-reception-173.webp',
  descriptions: {
    fr: 'Accueil et hall intérieur du siège d’IRESEN.',
    en: 'Reception and entrance hall inside IRESEN headquarters.',
    ar: 'فضاء الاستقبال والبهو الداخلي لمقر IRESEN.',
  } satisfies Record<Locale, string>,
} as const
