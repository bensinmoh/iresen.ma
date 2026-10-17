import {
  canonicalInstitutionNames as canonicalNames,
  institutionalAffiliations,
} from './institutions'
import { getPayload } from 'payload'
import config from '../payload.config'
import type { Project } from '../payload-types'
import type { Locale } from '@/i18n/locales'
import type { ProjectRecord } from './projects-model'
import coordinators from '../data/project-coordinators.json' with { type: 'json' }
import { projectIllustrationDescription } from './project-illustrations'

// Arabic display names retain the original public Latin identity as a search alias.
// Other working translations are never exposed as fallback content.
const coordinatorLatinAliases = new Map<string, Set<string>>()
for (const [source, name] of Object.entries(coordinators)) {
  const aliases = coordinatorLatinAliases.get(name.ar) ?? new Set<string>()
  aliases.add(source).add(`${name.givenName} ${name.familyName}`)
  coordinatorLatinAliases.set(name.ar, aliases)
}

/** Public releases cannot expose review locales, even with a stray local opt-in. */
export function projectsLocalReview() {
  return (
    process.env.PROJECTS_LOCAL_REVIEW === 'true' &&
    process.env.PUBLIC_RELEASE !== 'true' &&
    (process.env.NODE_ENV !== 'production' || process.env.CMS_LOCAL_REVIEW === 'true')
  )
}

export function projectReadActor() {
  return projectsLocalReview()
    ? {
        id: 0,
        role: 'publisher' as const,
        collection: 'users' as const,
        email: 'local-review@example.invalid',
      }
    : undefined
}

export function projectRecord(record: Project, locale: Locale): ProjectRecord {
  const copy = (value: string | null | undefined) => ({
    fr: '',
    en: '',
    ar: '',
    [locale]: value ? canonicalNames(value) : '',
  })
  const paragraphs = (value: string | null | undefined) => ({
    fr: [],
    en: [],
    ar: [],
    [locale]: value
      ? canonicalNames(value)
          .split(/\n\s*\n/)
          .filter(Boolean)
      : [],
  })
  return {
    institutionSearchText: institutionalAffiliations(
      [record.location, record.hostingPlatform, record.coordinatorAffiliation, record.consortium]
        .filter(Boolean)
        .join(' '),
      locale,
    ).searchText,
    id: record.reference,
    acronym: record.acronym,
    title: copy(record.title),
    description: copy(record.description),
    summary: copy(record.summary),
    domain: record.domain ?? 'other',
    status: record.projectStatus ?? null,
    programme: record.programme ?? '',
    year: record.launchYear ?? null,
    durationMonths: record.durationMonths ?? null,
    budgetMAD: record.budgetMAD ?? null,
    image: record.imagePath ?? null,
    imageIllustration: record.imagePath
      ? projectIllustrationDescription(record.reference, locale) || record.title || undefined
      : undefined,
    theme: copy(record.theme),
    startText: copy(record.startText),
    location: copy(record.location),
    sourceUrl: record.sourceUrl ?? '',
    noteAvailable: false,
    selectionCallReference: record.selectionCallReference,
    details: {
      presentation: paragraphs(record.description),
      hostingPlatform: copy(record.hostingPlatform),
      coordinator: {
        name: copy(record.coordinatorName),
        searchAliases:
          locale === 'ar'
            ? [...(coordinatorLatinAliases.get(record.coordinatorName ?? '') ?? [])]
            : [],
        email: record.coordinatorEmail ?? null,
        phone: null,
        portrait: record.portraitPath ?? null,
        affiliation: copy(record.coordinatorAffiliation),
      },
      consortium: paragraphs(record.consortium),
      consortiumLogos: [],
      objectives: paragraphs(record.objectives),
    },
  }
}

export async function findProjects(locale: Locale, reference?: string) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'projects',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    user: projectReadActor(),
    depth: 0,
    limit: reference ? 1 : 1000,
    sort: 'reference',
    where: {
      and: [
        { title: { exists: true } },
        { visibility: { equals: 'public' } },
        { _status: { equals: 'published' } },
        ...(reference ? [{ reference: { equals: reference } }] : []),
        { description: { exists: true } },
        ...(projectsLocalReview() ? [{ publicationStatus: { in: ['published', 'review'] } }] : []),
      ],
    },
    select: {
      reference: true,
      acronym: true,
      title: true,
      description: true,
      summary: true,
      domain: true,
      projectStatus: true,
      programme: true,
      launchYear: true,
      durationMonths: true,
      budgetMAD: true,
      imagePath: true,
      theme: true,
      startText: true,
      location: true,
      sourceUrl: true,
      selectionCallReference: true,
      hostingPlatform: true,
      coordinatorName: true,
      coordinatorEmail: true,
      portraitPath: true,
      coordinatorAffiliation: true,
      consortium: true,
      objectives: true,
    },
  })
  return result.docs
    .filter((record) => record.title?.trim() && record.description?.trim())
    .map((record) => ({
      ...projectRecord(record as Project, locale),
      noteAvailable: true,
    }))
}
