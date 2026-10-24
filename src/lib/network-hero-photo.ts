import type { Locale } from '@/i18n/locales'

export const networkHeroPhoto = {
  src: '/images/heroes/network-pilot-128.webp',
  width: 1920,
  height: 1280,
  mobile: { src: '/images/heroes/network-pilot-128-mobile.webp', width: 720, height: 1080 },
  descriptions: {
    fr: 'Une chercheuse règle une installation pilote en laboratoire.',
    en: 'A researcher adjusting a pilot installation in a laboratory.',
    ar: 'باحثة تضبط تجهيزات منشأة تجريبية داخل المختبر.',
  } satisfies Record<Locale, string>,
} as const
