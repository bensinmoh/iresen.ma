import type { Locale } from '@/i18n/locales'

const sectionIds = [
  'develop-test-transfer',
  'research-priorities',
  'results',
  'platforms-expertise',
  'collaboration',
  'news-events',
] as const

const copy: Record<Locale, { label: string; sections: readonly string[] }> = {
  fr: {
    label: 'Les sections de l’accueil',
    sections: [
      'Notre mission',
      'Recherche',
      'Réalisations',
      'Plateformes',
      'Collaborer',
      'Actualités',
    ],
  },
  en: {
    label: 'Homepage sections',
    sections: ['Our mission', 'Research', 'Results', 'Platforms', 'Collaborate', 'News'],
  },
  ar: {
    label: 'أقسام الصفحة الرئيسية',
    sections: ['مهمتنا', 'البحث', 'الإنجازات', 'المنصات', 'التعاون', 'المستجدات'],
  },
}

export const homeNavigation = Object.fromEntries(
  Object.entries(copy).map(([locale, { label, sections }]) => [
    locale,
    { label, items: sectionIds.map((id, index) => ({ id, label: sections[index] })) },
  ]),
) as Record<Locale, { label: string; items: { id: string; label: string }[] }>
