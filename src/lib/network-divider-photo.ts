import type { Locale } from '@/i18n/locales'

export const networkDividerPhoto = {
  src: '/images/network/researcher-equipment-cutout-174.webp',
  width: 1536,
  height: 1024,
  descriptions: {
    fr: 'Une chercheuse en blouse blanche au premier plan, entourée d’instruments de laboratoire. Détourage du fond de la photographie fournie.',
    en: 'A researcher in a white laboratory coat in the foreground, surrounded by scientific instruments. Background removed from the supplied photograph.',
    ar: 'باحثة ترتدي معطفاً أبيض في المقدمة، تحيط بها أجهزة المختبر. أزيلت خلفية الصورة الأصلية المقدمة.',
  } satisfies Record<Locale, string>,
} as const
