import type { Locale } from '@/i18n/locales'
export const careersEnvironmentPhoto = {
  src: '/images/careers/office-portrait-170.webp',
  descriptions: {
    fr: 'Une collaboratrice travaille sur un ordinateur portable à son bureau.',
    en: 'A team member working on a laptop at her desk.',
    ar: 'إحدى عضوات الفريق تعمل على حاسوب محمول في مكتبها.',
  } satisfies Record<Locale, string>,
} as const
