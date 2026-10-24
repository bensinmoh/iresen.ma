import type { Locale } from '@/i18n/locales'

// Real ingested photograph; source and derivative hashes: docs/network-photo-assets.json.
export const networkTrainingPhoto = {
  src: '/images/heroes/network-laboratory-training.webp',
  width: 1600,
  height: 873,
  descriptions: {
    fr: 'Démonstration d’un équipement de laboratoire à un groupe de participantes en formation.',
    en: 'A laboratory equipment demonstration for a group of training participants.',
    ar: 'عرض توضيحي لمعدات المختبر أمام مجموعة من المشاركات في التدريب.',
  } satisfies Record<Locale, string>,
} as const
