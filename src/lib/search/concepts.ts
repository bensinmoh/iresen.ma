import { normalizeSearchText } from './text'
import type { SearchLocale } from './types'

type TopicAliases = Readonly<Record<SearchLocale, readonly string[]>>

/**
 * Curated general topic vocabulary for the existing public website. These are
 * related search terms, not institutional claims or inferred translations of
 * individual CMS records. Technology topics remain separate from one another.
 */
const topicAliases: readonly TopicAliases[] = [
  {
    fr: [
      'plateforme',
      'plateformes',
      'infrastructure',
      'infrastructures',
      'laboratoire',
      'laboratoires',
      "installations d'essai",
      'installations expérimentales',
    ],
    en: [
      'platform',
      'platforms',
      'infrastructure',
      'infrastructures',
      'laboratory',
      'laboratories',
      'lab',
      'labs',
      'test facility',
      'test facilities',
      'testing facilities',
    ],
    ar: [
      'منصة',
      'المنصة',
      'منصات',
      'المنصات',
      'بنية تحتية',
      'البنية التحتية',
      'بنيات تحتية',
      'مختبر',
      'مختبرات',
      'المختبر',
      'المختبرات',
      'مرافق اختبار',
      'مرافق الاختبار',
    ],
  },
  {
    fr: [
      'solaire',
      'énergie solaire',
      'photovoltaïque',
      'photovoltaïques',
      'solaire photovoltaïque',
      'pv',
      'panneau solaire',
      'panneaux solaires',
      'panneau photovoltaïque',
      'panneaux photovoltaïques',
      'solaires',
    ],
    en: [
      'solar',
      'solar energy',
      'photovoltaic',
      'photovoltaics',
      'solar photovoltaics',
      'pv',
      'solar panel',
      'solar panels',
      'photovoltaic panel',
      'photovoltaic panels',
    ],
    ar: [
      'طاقة شمسية',
      'الطاقة الشمسية',
      'شمسي',
      'شمسية',
      'الشمسية',
      'كهروضوئية',
      'الكهروضوئية',
      'كهروضوئي',
      'pv',
      'لوح شمسي',
      'ألواح شمسية',
      'الألواح الشمسية',
      'لوحات كهروضوئية',
    ],
  },
  {
    fr: ['éolien', 'éolienne', 'éoliennes', 'énergie éolienne', 'énergies éoliennes'],
    en: ['wind energy', 'wind power', 'wind turbine', 'wind turbines'],
    ar: ['طاقة الرياح', 'الطاقة الريحية', 'توربين الرياح', 'توربينات الرياح'],
  },
  {
    fr: ['énergie renouvelable', 'énergies renouvelables', 'énergie propre', 'énergies propres'],
    en: ['renewable energy', 'renewable energies', 'renewables', 'clean energy'],
    ar: [
      'طاقة متجددة',
      'الطاقة المتجددة',
      'طاقات متجددة',
      'الطاقات المتجددة',
      'طاقة نظيفة',
      'الطاقة النظيفة',
    ],
  },
  {
    fr: ['hydrogène', 'hydrogène vert', 'hydrogène renouvelable'],
    en: ['hydrogen', 'green hydrogen', 'renewable hydrogen'],
    ar: ['هيدروجين', 'الهيدروجين', 'هيدروجين أخضر', 'الهيدروجين الأخضر'],
  },
  {
    fr: ['stockage', "stockage d'énergie", 'batterie', 'batteries', 'stockage électrochimique'],
    en: ['storage', 'energy storage', 'battery', 'batteries', 'electrochemical storage'],
    ar: ['تخزين', 'تخزين الطاقة', 'التخزين', 'بطارية', 'بطاريات', 'البطاريات', 'تخزين كهروكيميائي'],
  },
  {
    fr: [
      'expérimentation',
      'expérimentations',
      'essai',
      'essais',
      'test',
      'tests',
      'validation expérimentale',
    ],
    en: [
      'experimentation',
      'experiment',
      'experiments',
      'testing',
      'test',
      'tests',
      'experimental validation',
    ],
    ar: [
      'تجريب',
      'التجريب',
      'تجربة',
      'تجارب',
      'اختبار',
      'اختبارات',
      'الاختبارات',
      'التحقق التجريبي',
    ],
  },
  {
    fr: [
      'carrière',
      'carrières',
      'emploi',
      'emplois',
      'recrutement',
      "offre d'emploi",
      "offres d'emploi",
      "opportunités d'emploi",
    ],
    en: [
      'career',
      'careers',
      'job',
      'jobs',
      'employment',
      'recruitment',
      'employment opportunities',
      'job opportunity',
      'job opportunities',
      'career opportunities',
    ],
    ar: [
      'وظيفة',
      'وظائف',
      'توظيف',
      'التوظيف',
      'فرصة عمل',
      'فرص عمل',
      'فرص العمل',
      'مسار مهني',
      'مسارات مهنية',
    ],
  },
  {
    fr: [
      'opportunité',
      'opportunités',
      'appel à projets',
      'appels à projets',
      'appel à candidatures',
      'appels à candidatures',
    ],
    en: [
      'opportunity',
      'opportunities',
      'open call',
      'open calls',
      'call for projects',
      'calls for projects',
    ],
    ar: ['فرصة', 'فرص', 'الفرص', 'دعوة لتقديم مشاريع', 'دعوات لتقديم مشاريع', 'طلبات مشاريع'],
  },
  {
    fr: [
      'recherche',
      'recherche et développement',
      'r&d',
      'rdi',
      'recherche développement innovation',
      'recherche développement et innovation',
      'programme de recherche',
      'programmes de recherche',
      'recherche collaborative',
    ],
    en: [
      'research',
      'research and development',
      'r&d',
      'rdi',
      'research development and innovation',
      'research development innovation',
      'research programme',
      'research programmes',
      'research program',
      'research programs',
      'collaborative research',
    ],
    ar: [
      'بحث',
      'البحث',
      'أبحاث',
      'الأبحاث',
      'بحوث',
      'البحوث',
      'البحث والتطوير',
      'البحث والتطوير والابتكار',
      'برنامج بحث',
      'برامج البحث',
      'r&d',
      'rdi',
    ],
  },
  {
    fr: [
      'transfert',
      'transfert technologique',
      'transfert de technologie',
      'valorisation',
      'brevet',
      'brevets',
      'propriété intellectuelle',
    ],
    en: [
      'transfer',
      'technology transfer',
      'commercialisation',
      'commercialization',
      'patent',
      'patents',
      'intellectual property',
    ],
    ar: [
      'نقل التكنولوجيا',
      'نقل التقنية',
      'تثمين',
      'التثمين',
      'براءة اختراع',
      'براءات الاختراع',
      'ملكية فكرية',
      'الملكية الفكرية',
    ],
  },
  {
    fr: ['résultat', 'résultats', 'réalisation', 'réalisations', 'impact', 'impacts'],
    en: [
      'result',
      'results',
      'achievement',
      'achievements',
      'impact',
      'impacts',
      'outcome',
      'outcomes',
    ],
    ar: ['نتيجة', 'نتائج', 'النتائج', 'إنجاز', 'إنجازات', 'الإنجازات', 'أثر', 'الأثر'],
  },
]

const normalizedTopics = Object.fromEntries(
  (['fr', 'en', 'ar'] as const).map((locale) => [
    locale,
    topicAliases.map((topic) => [
      ...new Set(topic[locale].map(normalizeSearchText).filter(Boolean)),
    ]),
  ]),
) as Record<SearchLocale, string[][]>

function wholePhrasePosition(query: string, phrase: string): number {
  return ` ${query} `.indexOf(` ${phrase} `)
}

/** Preserve exact curated concept tokens during independent spelling correction. */
export function recognizedConceptTerms(query: string, locale: SearchLocale): string[] {
  const normalized = normalizeSearchText(query)
  if (!normalized || !normalizedTopics[locale]) return []
  const recognized = new Set<string>()
  for (const aliases of normalizedTopics[locale]) {
    for (const alias of aliases) {
      if (wholePhrasePosition(normalized, alias) >= 0)
        for (const token of alias.split(' ')) recognized.add(token)
    }
  }
  return [...new Set(normalized.split(' '))].filter((token) => recognized.has(token))
}

function replaceMatchedPhrases(
  query: string,
  replacements: { position: number; length: number; phrase: string }[],
): string {
  const parts: string[] = []
  let offset = 0
  for (const replacement of replacements.toSorted((a, b) => a.position - b.position)) {
    parts.push(query.slice(offset, replacement.position), replacement.phrase)
    offset = replacement.position + replacement.length
  }
  parts.push(query.slice(offset))
  return normalizeSearchText(parts.join(''))
}

/**
 * Returns at most eight curated related queries. Replace a whole matched phrase
 * while retaining every unmatched term: "solar battery" may become
 * "photovoltaic battery" or "photovoltaic storage", but never a standalone
 * "photovoltaic" query. At most four variants replace two non-overlapping topics;
 * the remaining positions retain single-topic replacements.
 * Callers can expand an independently corrected query; this helper never makes
 * fuzzy concept matches, expands IRESEN, or performs spelling correction.
 */
export function relatedSearchPhrases(query: string, locale: SearchLocale): string[] {
  const normalized = normalizeSearchText(query)
  if (!normalized || !normalizedTopics[locale]) return []

  const matches = normalizedTopics[locale]
    .flatMap((aliases) => {
      const matched = aliases
        .map((alias) => ({ alias, position: wholePhrasePosition(normalized, alias) }))
        .filter(({ position }) => position >= 0)
        .sort((a, b) => b.alias.length - a.alias.length || a.position - b.position)[0]
      if (!matched) return []
      return [{ ...matched, aliases }]
    })
    .sort((a, b) => a.position - b.position)

  const expansions = matches
    .filter(
      (match) =>
        !matches.some(
          (other) =>
            other.alias.length > match.alias.length &&
            other.position <= match.position &&
            other.position + other.alias.length >= match.position + match.alias.length,
        ),
    )
    .map((matched) => {
      const aliases = matched.aliases.filter((alias) => wholePhrasePosition(normalized, alias) < 0)
      const length = matched.alias.length
      const variants = aliases
        .map((phrase) =>
          replaceMatchedPhrases(normalized, [{ position: matched.position, length, phrase }]),
        )
        .filter((variant) => variant !== normalized)
      return { position: matched.position, length, aliases, variants }
    })
    .filter(({ variants }) => variants.length)

  const related = new Set<string>()
  const left = expansions[0]
  const right = left
    ? expansions.find(({ position }) => position >= left.position + left.length)
    : undefined
  if (left && right) {
    // Pair aliases in a bounded diagonal order, retaining original source offsets.
    for (
      let distance = 0;
      related.size < 4 && distance < left.aliases.length + right.aliases.length - 1;
      distance++
    ) {
      for (
        let leftIndex = Math.min(distance, left.aliases.length - 1);
        leftIndex >= 0;
        leftIndex--
      ) {
        const leftAlias = left.aliases[leftIndex]
        const rightAlias = right.aliases[distance - leftIndex]
        if (!leftAlias || !rightAlias) continue
        const between = normalized.slice(left.position + left.length, right.position)
        // Avoid generating phrases such as "solar energy energy storage".
        if (!between.trim() && leftAlias.split(' ').at(-1) === rightAlias.split(' ')[0]) continue
        const phrase = replaceMatchedPhrases(normalized, [
          { position: left.position, length: left.length, phrase: leftAlias },
          { position: right.position, length: right.length, phrase: rightAlias },
        ])
        if (phrase !== normalized) related.add(phrase)
        if (related.size === 4) break
      }
    }
  }

  // Interleave topics so a query mentioning two concepts keeps both represented.
  for (
    let index = 0;
    related.size < 8 && expansions.some(({ variants }) => index < variants.length);
    index++
  ) {
    for (const { variants } of expansions) {
      const phrase = variants[index]
      if (phrase) related.add(phrase)
      if (related.size === 8) break
    }
  }
  return [...related]
}
