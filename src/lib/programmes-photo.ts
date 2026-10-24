import type { Locale } from '@/i18n/locales'

// Owner-selected collection photograph: GEP · 073.
export const programmesPhoto = {
  src: '/images/programmes/gep-outdoor-pv-testing.webp',
  descriptions: {
    fr: 'Rangées de modules photovoltaïques en essais extérieurs au GEP.',
    en: 'Rows of photovoltaic modules undergoing outdoor testing at GEP.',
    ar: 'صفوف من الوحدات الكهروضوئية قيد الاختبارات الخارجية في GEP.',
  } satisfies Record<Locale, string>,
} as const
