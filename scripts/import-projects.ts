import { readFile, mkdir, access, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '../src/payload.config'
import type { Project, User } from '../src/payload-types'
import { z } from 'zod'
import editorial from '../src/data/project-editorial-fr.json' with { type: 'json' }
import coordinators from '../src/data/project-coordinators.json' with { type: 'json' }
import { currentProjectNote, projectNoteState } from '../src/lib/project-notes'
import { searchDatabase } from '../src/lib/search/database'

const root = path.resolve('.local/projects')
const sourceSchema = z.object({
  reference: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  acronym: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  objectives: z.array(z.string()),
  theme: z.string().nullable(),
  location: z.string().nullable(),
  startText: z.string().nullable(),
  year: z.number().nullable(),
  coordinatorName: z.string().nullable(),
  email: z.email().nullable(),
  phone: z.string().nullable(),
  programme: z.string().nullable(),
  sourceUrl: z.url(),
  sourceHash: z.string().length(64),
  retrievedAt: z.string(),
})
const translationSchema = z.record(
  z.string(),
  z.object({
    en: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      summary: z.string().min(1),
      theme: z.string(),
      location: z.string(),
      startText: z.string(),
      objectives: z.array(z.string()),
    }),
    ar: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      summary: z.string().min(1),
      theme: z.string(),
      location: z.string(),
      startText: z.string(),
      objectives: z.array(z.string()),
    }),
  }),
)
const source = z
  .array(sourceSchema)
  .length(60)
  .parse(JSON.parse(await readFile(path.join(root, 'source.json'), 'utf8')))
const translations = translationSchema.parse(
  JSON.parse(await readFile(path.join(root, 'translations.json'), 'utf8')),
)
for (const record of source)
  for (const locale of ['en', 'ar'] as const) {
    const translated = translations[record.reference]?.[locale]
    if (
      !translated ||
      translated.objectives.length !==
        editorial[record.reference as keyof typeof editorial]?.objectives.length
    )
      throw new Error(`Incomplete translation: ${record.reference}/${locale}`)
  }
const coordinatorNames = (name: string | null) => {
  if (!name) return { fr: null, en: null, ar: null }
  const copy = coordinators[name as keyof typeof coordinators]
  if (!copy) throw new Error(`Missing coordinator editorial mapping: ${name}`)
  const latin = `${copy.givenName} ${copy.familyName}`
  return { fr: latin, en: latin, ar: copy.ar }
}
// Validate the whole mapping before the first database write.
for (const record of source) coordinatorNames(record.coordinatorName)

const domain = (theme: string | null): NonNullable<Project['domain']> => {
  const normalized = theme?.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '') ?? ''
  if (normalized.includes('thermique')) return 'thermal'
  if (normalized.includes('photovolt')) return 'photovoltaic'
  if (normalized.includes('reseaux')) return 'grids'
  if (normalized.includes('stockage')) return 'storage'
  if (normalized.includes('eolienne')) return 'wind'
  if (normalized.includes('biomasse')) return 'biomass'
  if (normalized.includes('nexus')) return 'water'
  if (normalized.includes('efficacite') || normalized.includes('habitat')) return 'efficiency'
  return 'other'
}

const assets = path.resolve(process.env.PROJECTS_ASSET_DIRECTORY || path.join(root, 'assets'))
const manifest: Record<string, unknown> = {}
async function derivative(reference: string, kind: 'image' | 'portrait') {
  const original = path.join(root, 'originals', reference, kind)
  try {
    await access(original)
  } catch {
    return null
  }
  const folder = path.join(assets, reference)
  await mkdir(folder, { recursive: true, mode: 0o700 })
  const bytes = await sharp(original)
    .rotate()
    .resize({ width: kind === 'image' ? 1200 : 320, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()
  await writeFile(path.join(folder, `${kind}.webp`), bytes, { mode: 0o600 })
  manifest[`${reference}/${kind}`] = {
    sha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
  }
  return `/api/projects/${reference}/asset/${kind}`
}

const payload = await getPayload({ config })
try {
  // Use an existing local administrator; never create accounts or credentials for imports.
  const users = await payload.find({
    collection: 'users',
    overrideAccess: true,
    limit: 1,
    where: { role: { equals: 'admin' } },
  })
  const user = users.docs[0]
  if (!user) throw new Error('An existing local administrator is required; no account was created.')
  const actor = { ...user, collection: 'users' as const } satisfies User & { collection: 'users' }
  let inserted = 0
  for (const record of source) {
    const names = coordinatorNames(record.coordinatorName)
    const edited = editorial[record.reference as keyof typeof editorial]
    if (!edited) throw new Error(`Missing editorial text: ${record.reference}`)
    const existing = await payload.find({
      collection: 'projects',
      where: { reference: { equals: record.reference } },
      limit: 1,
      overrideAccess: true,
      user: actor,
    })
    if (existing.docs.length) {
      if (existing.docs[0]?.sourceUrl !== record.sourceUrl)
        throw new Error(`Reference collision: ${record.reference}`)
      if (process.argv.includes('--refresh-coordinators')) {
        if (existing.docs[0]?.sourceHash !== record.sourceHash)
          throw new Error(`Source changed: ${record.reference}`)
        for (const locale of ['fr', 'en', 'ar'] as const) {
          const saved = await payload.findByID({
            collection: 'projects',
            id: existing.docs[0]!.id,
            locale,
            fallbackLocale: false,
            overrideAccess: false,
            user: actor,
          })
          if (saved.coordinatorName === names[locale]) continue
          const beforeNote = await projectNoteState(record.reference, locale)
          const preserveNote = await currentProjectNote(record.reference, locale)
          await payload.update({
            collection: 'projects',
            id: saved.id,
            locale,
            overrideAccess: false,
            user: actor,
            data: { coordinatorName: names[locale] },
          })
          // Owner-approved name-only correction: keep the existing, hash-verified PDF
          // bytes and link until the updated project list commissions PDF revision.
          // Previously stale/missing/corrupt notes are never revalidated here.
          if (preserveNote && beforeNote) {
            const afterNote = await projectNoteState(record.reference, locale)
            if (!afterNote) throw new Error(`Missing updated project: ${record.reference}`)
            await searchDatabase().query(
              `UPDATE project_notes SET content_revision=$1
               WHERE project_id=$2 AND locale=$3 AND content_revision=$4 AND sha256=$5`,
              [afterNote.revision, saved.id, locale, beforeNote.revision, beforeNote.sha256],
            )
          }
        }
        console.log(`Harmonized coordinator ${record.reference}; PDF bytes unchanged`)
        continue
      }
      if (
        process.argv.includes('--refresh-editorial') &&
        existing.docs[0]?.sourceHash === record.sourceHash
      ) {
        await payload.update({
          collection: 'projects',
          id: existing.docs[0]!.id,
          locale: 'fr',
          overrideAccess: false,
          user: actor,
          data: {
            ...edited,
            coordinatorName: names.fr,
            objectives: edited.objectives.join('\n\n'),
            publicationStatus: 'published',
            _status: 'published',
          },
        })
      }
      if (
        (process.argv.includes('--refresh-translations') ||
          process.argv.includes('--refresh-editorial')) &&
        existing.docs[0]?.sourceHash === record.sourceHash
      ) {
        for (const locale of ['en', 'ar'] as const) {
          const saved = await payload.findByID({
            collection: 'projects',
            id: existing.docs[0]!.id,
            locale,
            fallbackLocale: false,
            overrideAccess: false,
            user: actor,
          })
          if (saved.translationReview !== 'pending' || saved.publicationStatus !== 'review')
            continue
          const copy = translations[record.reference]![locale]
          await payload.update({
            collection: 'projects',
            id: saved.id,
            locale,
            overrideAccess: false,
            user: actor,
            data: {
              ...copy,
              coordinatorName: names[locale],
              objectives: copy.objectives.join('\n\n'),
              publicationStatus: 'review',
              translationReview: 'pending',
              _status: 'published',
            },
          })
        }
      }
      console.log(`Preserved existing ${record.reference}`)
      continue
    }
    if (process.argv.includes('--refresh-coordinators'))
      throw new Error(`Cannot correct absent project: ${record.reference}`)
    const imagePath = await derivative(record.reference, 'image')
    const portraitPath = await derivative(record.reference, 'portrait')
    const created = await payload.create({
      collection: 'projects',
      locale: 'fr',
      overrideAccess: false,
      user: actor,
      data: {
        reference: record.reference,
        acronym: record.acronym,
        title: record.title,
        description: edited.description,
        summary: edited.summary,
        theme: record.theme,
        location: record.location,
        startText: record.startText,
        launchYear: record.year,
        objectives: edited.objectives.join('\n\n'),
        coordinatorName: names.fr,
        coordinatorEmail: record.email,
        coordinatorPhone: record.phone,
        programme: record.programme,
        domain: domain(record.theme),
        projectStatus: null,
        durationMonths: null,
        budgetMAD: null,
        hostingPlatform: null,
        coordinatorAffiliation: null,
        selectionCallReference: null,
        consortium: null,
        consortiumLogos: null,
        imagePath,
        portraitPath,
        sourceUrl: record.sourceUrl,
        sourceHash: record.sourceHash,
        retrievedAt: record.retrievedAt,
        translationReview: 'source',
        publicationStatus: 'published',
        visibility: 'public',
        _status: 'published',
        internalNotes:
          'Owner-selected public source migration, 2026-10-15. Historical information; current project status unverified. Scientific-production counters deliberately excluded. Consortium source URLs are invalid placeholders. EN/AR are machine-assisted working translations pending editorial approval.',
      },
    })
    for (const locale of ['en', 'ar'] as const) {
      const copy = translations[record.reference]![locale]
      await payload.update({
        collection: 'projects',
        id: created.id,
        locale,
        overrideAccess: false,
        user: actor,
        data: {
          ...copy,
          objectives: copy.objectives.join('\n\n'),
          coordinatorName: names[locale],
          publicationStatus: 'review',
          translationReview: 'pending',
          _status: 'published',
        },
      })
    }
    inserted++
    console.log(`Imported ${record.reference}: FR source + EN/AR review`)
  }
  if (inserted > 0)
    await writeFile(path.join(root, 'derivatives.json'), JSON.stringify(manifest, null, 2) + '\n')
  console.log(
    `Inserted ${inserted}; existing records preserved. No deployment or translation approval.`,
  )
} finally {
  await payload.destroy()
  await searchDatabase().end()
}

// All writes and teardown have completed; close residual library timers in this one-shot CLI.
process.exit(0)
