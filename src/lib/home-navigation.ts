import type { Locale } from '@/i18n/locales'

const sectionIds = [
  'develop-test-transfer',
  'results',
  'research-priorities',
  'platforms-expertise',
  'collaboration',
  'news-events',
] as const

const copy: Record<Locale, { label: string; sections: readonly string[] }> = {
  fr: {
    label: 'Les sections de l’accueil',
    sections: [
      'Notre mission',
      'Réalisations',
      'Recherche',
      'Plateformes',
      'Collaborer',
      'Actualités',
    ],
  },
  en: {
    label: 'Homepage sections',
    sections: ['Our mission', 'Results', 'Research', 'Platforms', 'Collaborate', 'News'],
  },
  ar: {
    label: 'أقسام الصفحة الرئيسية',
    sections: ['مهمتنا', 'الإنجازات', 'البحث', 'المنصات', 'التعاون', 'المستجدات'],
  },
}

export const homeNavigation = Object.fromEntries(
  Object.entries(copy).map(([locale, { label, sections }]) => [
    locale,
    { label, items: sectionIds.map((id, index) => ({ id, label: sections[index] })) },
  ]),
) as Record<Locale, { label: string; items: { id: string; label: string }[] }>
