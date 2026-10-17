import type { Locale } from '@/i18n/locales'

/** Owner-requested conceptual artwork; never evidence of an actual prototype/site. */
const subjects: Record<string, Record<Locale, string>> = {
  pinremat: {
    fr: 'Profilé PVC et isolant issu de matériaux recyclés',
    en: 'PVC profile and insulation from recycled materials',
    ar: 'مقطع PVC وعازل من مواد معاد تدويرها',
  },
  soltanair: {
    fr: 'Concept de stockage d’énergie',
    en: 'Energy storage concept',
    ar: 'تصور لتخزين الطاقة',
  },
  'ev-plan': {
    fr: 'Mobilité électrique et recharge solaire',
    en: 'Electric mobility and solar charging',
    ar: 'التنقل الكهربائي والشحن بالطاقة الشمسية',
  },
  lswater: {
    fr: 'Énergie solaire et eau',
    en: 'Solar energy and water',
    ar: 'الطاقة الشمسية والماء',
  },
  restart: {
    fr: 'Recyclage de batteries et panneaux photovoltaïques, récupération des matériaux',
    en: 'Battery and photovoltaic panel recycling, material recovery',
    ar: 'إعادة تدوير البطاريات والألواح الكهروضوئية واسترجاع المواد',
  },
  'e-pave': {
    fr: 'Concept d’énergies renouvelables, solaire et éolien',
    en: 'Renewable energy concept, solar and wind',
    ar: 'تصور للطاقات المتجددة، الشمس والرياح',
  },
  stdscwg: {
    fr: 'Concept de dessalement alimenté par une énergie renouvelable',
    en: 'Renewable-powered desalination concept',
    ar: 'تصور لتحلية المياه باستخدام الطاقة المتجددة',
  },
  dakh2a: {
    fr: 'Concept de production et stockage d’hydrogène vert',
    en: 'Green hydrogen production and storage concept',
    ar: 'تصور لإنتاج الهيدروجين الأخضر وتخزينه',
  },
  greenh2hub: {
    fr: 'Concept de coopération en recherche sur l’hydrogène vert',
    en: 'Green hydrogen research cooperation concept',
    ar: 'تصور للتعاون البحثي في الهيدروجين الأخضر',
  },
  'great-h2': {
    fr: 'Concept de chaîne de valeur de l’hydrogène, production, stockage et transport',
    en: 'Hydrogen value-chain concept, production, storage and transport',
    ar: 'تصور لسلسلة قيمة الهيدروجين، الإنتاج والتخزين والنقل',
  },
  'pragma-e': {
    fr: 'Concept d’ammoniac vert, énergies renouvelables et engrais',
    en: 'Green ammonia, renewable energy and fertiliser concept',
    ar: 'تصور للأمونيا الخضراء والطاقات المتجددة والأسمدة',
  },
}

export function projectIllustrationDescription(
  reference: string,
  locale: Locale,
): string | undefined {
  const subject = subjects[reference]?.[locale]
  if (!subject) return undefined
  return `${subject}.`
}
