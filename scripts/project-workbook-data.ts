import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'
import type { Project } from '../src/payload-types'
import names from '../src/data/project-coordinators.json' with { type: 'json' }
import editorial from '../src/data/project-editorial-fr.json' with { type: 'json' }
import additions from '../src/data/project-workbook-editorial.json' with { type: 'json' }
import {
  canonicalInstitutionNames,
  identifyInstitutions,
  institutionLabel,
} from '../src/lib/institutions'
import type { Locale } from '../src/i18n/locales'
import type { ProjectRecord } from '../src/lib/projects-model'
const root = path.resolve('.local/projects/workbook-1026')
const rowSchema = z.object({
  reference: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  row: z.number().int().min(2),
  acronym: z.string().min(1),
  programme: z.string().min(1),
  title: z.string().nullable(),
  partners: z.string().nullable(),
  theme: z.string().nullable(),
  coordinator: z.string().min(1),
  affiliation: z.string().nullable(),
  email: z.email().nullable(),
  location: z.string().nullable(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
  dateNote: z.string().nullable(),
  durationMonths: z.number().nonnegative().nullable(),
  durationSource: z.string().nullable(),
  status: z.enum(['En cours', 'en cours', 'Achevé', 'Clôturé', 'En cours de démarrage']).nullable(),
  fundingMAD: z.number().nonnegative().nullable(),
})
export const input = z
  .object({
    filename: z.string(),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    sheet: z.literal('Tableau suivi technique'),
    rows: z.array(rowSchema).length(70),
    absentReferences: z.array(z.string()),
  })
  .parse(JSON.parse(await readFile(path.join(root, 'extracted.json'), 'utf8')))
if (new Set(input.rows.map((r) => r.reference)).size !== input.rows.length)
  throw new Error('Duplicate project reference')
if (input.absentReferences.join() !== 'm-s-f')
  throw new Error('Unexpected withdrawals; review source mapping')
const historical: {
  reference: string
  coordinatorName: string
  sourceUrl: string
  title: string
}[] = JSON.parse(await readFile('.local/projects/source.json', 'utf8'))
export const historicalByRef = new Map(historical.map((r) => [r.reference, r]))
type Copy = { title: string; description: string; summary: string; objectives: string[] }
const translations: Record<string, Record<'en' | 'ar', Copy>> = JSON.parse(
  await readFile('.local/projects/translations.json', 'utf8'),
)
const themes: Record<string, [string, string, NonNullable<Project['domain']>]> = {
  'Solaire thermique': ['Solar thermal energy', 'الطاقة الشمسية الحرارية', 'thermal'],
  'Solaire photovoltaïque': ['Solar photovoltaics', 'الطاقة الشمسية الكهروضوئية', 'photovoltaic'],
  'Réseaux intelligents': ['Smart grids', 'الشبكات الذكية', 'grids'],
  'Efficacité énergétique': ['Energy efficiency', 'النجاعة الطاقية', 'efficiency'],
  "Stockage de l'énergie": ['Energy storage', 'تخزين الطاقة', 'storage'],
  'Habitat durable': ['Sustainable buildings', 'البناء المستدام', 'efficiency'],
  'Mobilité durable': ['Sustainable mobility', 'التنقل المستدام', 'other'],
  Biomasse: ['Biomass', 'الكتلة الحيوية', 'biomass'],
  'Nexus eau-énergie-agriculture': [
    'Water-energy-agriculture nexus',
    'الترابط بين الماء والطاقة والزراعة',
    'water',
  ],
  'Énergie éolienne': ['Wind energy', 'طاقة الرياح', 'wind'],
  'Industries et mines vertes': ['Green industry and mining', 'الصناعة والمناجم الخضراء', 'other'],
  'Energies renouvelables': ['Renewable energy', 'الطاقات المتجددة', 'other'],
  'Hydrogène vert': ['Green hydrogen', 'الهيدروجين الأخضر', 'hydrogen'],
  'Sustainable desalination system, potable water , seawater ,brackish groundwater, Green energy, embedded system':
    [
      'Sustainable desalination, drinking water, seawater, brackish groundwater, green energy and embedded systems',
      'التحلية المستدامة ومياه الشرب ومياه البحر والمياه الجوفية قليلة الملوحة والطاقة الخضراء والأنظمة المدمجة',
      'water',
    ],
  'Transition énergétique et du développement durable': [
    'Energy transition and sustainable development',
    'الانتقال الطاقي والتنمية المستدامة',
    'other',
  ],
  "Énergies Renouvelables, Production d'Hydrogène, Stockage, Transport et Value chaine": [
    'Renewable energy, hydrogen production, storage, transport and value chain',
    'الطاقات المتجددة وإنتاج الهيدروجين وتخزينه ونقله وسلسلة القيمة',
    'hydrogen',
  ],
}
const cities: Record<string, string> = {
  Agadir: 'أكادير',
  Benguérir: 'بن جرير',
  'Beni Mellal': 'بني ملال',
  Casablanca: 'الدار البيضاء',
  France: 'فرنسا',
  Fès: 'فاس',
  Ifrane: 'إفران',
  Kénitra: 'القنيطرة',
  Marrakech: 'مراكش',
  Meknès: 'مكناس',
  Mohammedia: 'المحمدية',
  Rabat: 'الرباط',
  Salé: 'سلا',
  Settat: 'سطات',
  Tanger: 'طنجة',
}
function sourceInstitutions(value: string) {
  // These source expansions duplicate the already curated institutional identity.
  let clean = value.replace(/\bCNEREE\s*\([^)]*\)/g, 'CNEREE')
  for (const identity of identifyInstitutions(value)) {
    const acronym = identity.acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (!acronym) continue
    clean = clean.replace(new RegExp(`(?<=\\p{L})\\s*\\(${acronym}\\)`, 'gu'), '')
  }
  return canonicalInstitutionNames(clean).replace(
    /Green Energy Park\s*[-–]\s*Green Energy Park/g,
    'Green Energy Park',
  )
}
function institution(value: string | null, locale: Locale) {
  if (!value) return null
  const canonical = sourceInstitutions(value)
  const matches = identifyInstitutions(value)
  // Use an Arabic identity only for an unambiguous whole-field institution.
  return locale === 'ar' && matches.length === 1 && !value.includes(',') && !value.includes('/')
    ? institutionLabel(matches[0]!, locale)
    : canonical
}
export const prepared = input.rows.map((row) => {
  const old = historicalByRef.get(row.reference)
  const person =
    names[row.coordinator as keyof typeof names] ||
    (old ? names[old.coordinatorName as keyof typeof names] : undefined)
  if (!person) throw new Error(`Missing name mapping: ${row.reference}`)
  const theme = row.theme ? themes[row.theme] : null
  if (row.theme && !theme) throw new Error(`Missing theme mapping: ${row.theme}`)
  const city = row.location && /ben\s?gu[eé]rir/i.test(row.location) ? 'Benguérir' : row.location
  if (city && !cities[city]) throw new Error(`Missing city translation: ${city}`)
  const locales = Object.fromEntries(
    (['fr', 'en', 'ar'] as const).map((locale) => {
      const existingCopy = old
        ? locale === 'fr'
          ? {
              ...editorial[row.reference as keyof typeof editorial],
              title: undefined,
            }
          : translations[row.reference]?.[locale]
        : null
      const added = additions[row.reference as keyof typeof additions]?.[locale]
      const metadataCopy = {
        title: row.acronym,
        description:
          locale === 'fr'
            ? `Projet ${row.acronym}${row.theme ? ` dans la thématique « ${row.theme} »` : ''}. Le descriptif détaillé n’est pas renseigné dans le suivi transmis.`
            : locale === 'en'
              ? `Project ${row.acronym}${theme ? ` in the field of ${theme[0]}` : ''}. No detailed description is provided in the supplied project tracker.`
              : `مشروع ${row.acronym}${theme ? ` في مجال ${theme[1]}` : ''}. لا تتضمن وثيقة التتبع المقدمة وصفاً تفصيلياً للمشروع.`,
        summary:
          locale === 'fr'
            ? `Projet ${row.acronym}${row.theme ? ` : ${row.theme}` : ''}.`
            : locale === 'en'
              ? `Project ${row.acronym}${theme ? `: ${theme[0]}` : ''}.`
              : `مشروع ${row.acronym}${theme ? `: ${theme[1]}` : ''}.`,
        objectives: [],
      }
      const copy = old ? existingCopy : added || metadataCopy
      if (!copy?.description || !copy.summary || !Array.isArray(copy.objectives))
        throw new Error(`Incomplete narrative: ${row.reference}/${locale}`)
      const startText = row.date
        ? new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(new Date(row.date + 'T12:00:00Z'))
        : null
      return [
        locale,
        {
          ...copy,
          theme: locale === 'fr' ? row.theme : theme?.[locale === 'en' ? 0 : 1] || null,
          location: locale === 'ar' && city ? cities[city] : city,
          startText,
          coordinatorName:
            locale === 'ar'
              ? person.ar
              : row.reference === 'phnamathex'
                ? 'Omar EL MOUNKACHI'
                : `${person.givenName} ${person.familyName}`,
          coordinatorAffiliation: institution(row.affiliation, locale),
          // Organisation names are preserved as supplied, without invented logos or translations.
          consortium: row.partners
            ? sourceInstitutions(row.partners).replace(/^•\s*/gm, '').replace(/\n+/g, '\n\n')
            : null,
          objectives: copy.objectives.join('\n\n') || null,
        },
      ]
    }),
  )
  const shared = {
    acronym: row.acronym,
    programme:
      row.programme.toLowerCase() === 'innoespa maroc 2021'
        ? 'InnoESPA Maroc 2021'
        : row.programme.toLowerCase() === 'innoespamaroc energy 2019'
          ? 'InnoESPAMAROC ENERGY 2019'
          : row.programme,
    launchYear: row.date ? Number(row.date.slice(0, 4)) : null,
    durationMonths:
      row.reference === 'fappb' && row.durationMonths === 36 && row.dateNote?.includes('12 mois')
        ? 48
        : row.durationMonths,
    budgetMAD: row.fundingMAD,
    projectStatus:
      // Owner correction, 16 October 2026, supersedes the workbook's empty status.
      row.reference === 'autoconsopv'
        ? ('completed' as const)
        : row.status === 'En cours de démarrage'
          ? ('planned' as const)
          : row.status === 'Achevé' || row.status === 'Clôturé'
            ? ('completed' as const)
            : row.status
              ? ('active' as const)
              : null,
    domain: row.theme ? themes[row.theme]![2] : ('other' as const),
    coordinatorEmail: row.email,
  }
  return { row, locales, shared }
})

/** Offline review data only: never queries, writes or serves the CMS/database. */
export function workbookPreview(locale: Locale): ProjectRecord[] {
  const localized = (value: string | null | undefined) => ({
    fr: '',
    en: '',
    ar: '',
    [locale]: value || '',
  })
  const paragraphs = (value: string | null | undefined) => ({
    fr: [],
    en: [],
    ar: [],
    [locale]: value?.split(/\n\s*\n/).filter(Boolean) || [],
  })
  return prepared.map(({ row, locales, shared }) => {
    const copy = locales[locale]
    return {
      id: row.reference,
      acronym: shared.acronym,
      title: localized(copy.title || historicalByRef.get(row.reference)?.title),
      description: localized(copy.description),
      summary: localized(copy.summary),
      domain: shared.domain,
      status: shared.projectStatus,
      programme: shared.programme,
      year: shared.launchYear,
      durationMonths: shared.durationMonths,
      budgetMAD: shared.budgetMAD,
      image: null,
      theme: localized(copy.theme),
      startText: localized(copy.startText),
      location: localized(copy.location),
      sourceUrl: historicalByRef.get(row.reference)?.sourceUrl || '',
      noteAvailable: false,
      details: {
        presentation: paragraphs(copy.description),
        hostingPlatform: localized(null),
        coordinator: {
          name: localized(copy.coordinatorName),
          email: row.email,
          phone: null,
          portrait: null,
          affiliation: localized(copy.coordinatorAffiliation),
        },
        consortium: paragraphs(copy.consortium),
        consortiumLogos: [],
        objectives: paragraphs(copy.objectives),
      },
    }
  })
}
