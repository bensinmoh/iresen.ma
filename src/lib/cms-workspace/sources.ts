import 'server-only'
import type { PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'
import { createEntry, languages, modules, type Entry, type Language } from '@/lib/cms-preview/model'
import { WorkspaceError } from './auth'
type Doc = Record<string, unknown>
export const sourceCollections = [
  'news',
  'projects',
  'calls',
  'opportunities',
  'pages',
  'media',
] as const
const moduleId = (collection: string) => (collection === 'opportunities' ? 'careers' : collection)
const collectionId = (module: string) =>
  module === 'careers' ? 'opportunities' : sourceCollections.find((value) => value === module)
const keys: Record<string, Record<string, string>> = {
  news: { sourceAttribution: 'sourceAttribution', theme: '' },
  projects: { imageId: '', documentId: '', callId: '', start: '', end: '', theme: '' },
  calls: {
    start: 'openingAt',
    end: 'deadlineAt',
    eligibility: 'recipients',
    funders: 'fundingPartners',
    application: 'submissionUrl',
    conditions: 'conditionsDocument',
  },
  opportunities: {
    vacancyStatus: 'state',
    place: 'location',
    criteria: 'profile',
    type: '',
    documentId: '',
    end: '',
    experienceMin: '',
    positions: '',
    skills: '',
    recruiter: '',
    applicationUrl: '',
  },
  media: {
    resourceKind: '',
    fileName: 'filename',
    sizeBytes: 'filesize',
    mimeType: 'mimeType',
    visibility: 'visibility',
    usage: '',
  },
}
function plain(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (!value || typeof value !== 'object') return ''
  const node = value as Doc
  if (typeof node.text === 'string') return node.text
  if (node.root) return plain(node.root)
  return Array.isArray(node.children)
    ? node.children.map(plain).join(node.type === 'root' ? '\n' : '')
    : ''
}
function localized(doc: Doc, key: string, locale: Language): unknown {
  const value = doc[key]
  return value && typeof value === 'object' && !Array.isArray(value) && locale in value
    ? (value as Doc)[locale]
    : value
}
function richText(text: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: null,
      children: text.split(/\n/).map((line) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: null,
        children: [
          {
            type: 'text',
            text: line,
            format: 0,
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      })),
    },
  }
}
export function sourceEntry(collection: (typeof sourceCollections)[number], doc: Doc): Entry {
  const id = Number(doc.id)
  const entry = createEntry(
    moduleId(collection),
    `${collection}-${id}`,
    String(doc.updatedAt || new Date().toISOString()),
  )
  entry.reference = String(doc.reference || `${collection}-${id}`)
  entry.source = { collection, id, revision: String(doc.updatedAt || '') }
  for (const field of modules.find((definition) => definition.id === entry.module)?.fields ?? []) {
    if (field.readOnly) continue
    const key = keys[collection]?.[field.key] ?? field.key
    if (!key) continue
    if (field.localized)
      for (const locale of languages)
        entry.variants[locale].fields[field.key] = plain(localized(doc, key, locale))
    else {
      const value = localized(doc, key, 'fr')
      entry.shared[field.key] =
        field.type === 'date'
          ? plain(value).slice(0, 10)
          : field.type === 'relation' && value
            ? `${field.relationTo === 'media' ? 'media' : field.relationTo}-${typeof value === 'object' ? (value as Doc).id : value}`
            : plain(value)
    }
  }
  entry.shared.visibility = String(doc.visibility || 'private')
  if (collection === 'media' && doc.url) {
    const fileURL = new URL(plain(doc.url), 'http://cms.local')
    entry.shared.assetPath = `${fileURL.pathname}${fileURL.search}`
  }
  if (collection === 'projects') entry.shared.sourceImagePath = plain(doc.imagePath)
  if (collection === 'opportunities')
    entry.shared.type = doc.contract === 'internship' ? 'internship' : 'job'
  for (const locale of languages) {
    const variant = entry.variants[locale]
    variant.title = plain(localized(doc, 'title', locale))
    variant.body = plain(
      localized(
        doc,
        collection === 'projects' || collection === 'calls'
          ? 'description'
          : collection === 'opportunities'
            ? 'summary'
            : collection === 'media'
              ? 'caption'
              : 'body',
        locale,
      ),
    )
    const status = localized(doc, 'publicationStatus', locale)
    variant.status = status === 'published' ? 'published' : status === 'review' ? 'review' : 'draft'
    const seo = localized(doc, 'seo', locale) as Doc | undefined
    variant.seoTitle = plain(seo?.title)
    variant.seoDescription = plain(seo?.description)
    if (variant.status === 'published') entry.publicVariants[locale] = structuredClone(variant)
  }
  return entry
}
export async function readSourceEntries(req: PayloadRequest): Promise<Entry[]> {
  const entries: Entry[] = []
  for (const collection of sourceCollections) {
    const result = await req.payload.find({
      collection,
      locale: 'all',
      fallbackLocale: false,
      draft: true,
      depth: 0,
      pagination: false,
      limit: 5000,
      overrideAccess: false,
      user: req.user,
      req,
    })
    for (const doc of result.docs) entries.push(sourceEntry(collection, doc as unknown as Doc))
  }
  return entries
}
export async function syncSource(
  entry: Entry,
  before: Entry | undefined,
  locale: Language,
  req: PayloadRequest,
): Promise<Entry> {
  if (before?.shared._sourceDataset && !before.source) return entry
  const collection = entry.source?.collection ?? collectionId(entry.module)
  // Fixed sections and newly introduced modules have their own authoring records, not duplicate Pages records.
  if (
    !collection ||
    (collection === 'pages' && !entry.source) ||
    (collection === 'media' && !entry.source)
  )
    return entry
  const required =
    collection === 'projects'
      ? ['acronym']
      : collection === 'calls'
        ? ['launchYear']
        : collection === 'opportunities'
          ? ['contract']
          : []
  const missing = required.filter(
    (key) => !entry.shared[key] && !entry.variants[locale].fields[key],
  )
  if (missing.length) {
    if (entry.variants[locale].status === 'published')
      throw new WorkspaceError(`Compléter les champs de la collection : ${missing.join(', ')}.`)
    return entry
  }
  let original: Doc | undefined
  if (entry.source) {
    original = (await req.payload.findByID({
      collection,
      id: entry.source.id,
      locale,
      fallbackLocale: false,
      draft: true,
      depth: 0,
      overrideAccess: false,
      user: req.user,
      req,
    })) as unknown as Doc
    if (String(original.updatedAt) !== entry.source.revision)
      throw new WorkspaceError(
        'La source a changé dans un autre outil. Rechargez avant de poursuivre.',
        409,
      )
  }
  const variant = entry.variants[locale]
  const previous = before?.variants[locale]
  const data: Doc = {}
  const changed = (key: string, value: unknown) => {
    if (!original || JSON.stringify(original[key]) !== JSON.stringify(value)) data[key] = value
  }
  if (!original || variant.title !== previous?.title) changed('title', variant.title)
  if (!original || variant.body !== previous?.body)
    changed(
      collection === 'projects' || collection === 'calls'
        ? 'description'
        : collection === 'opportunities'
          ? 'summary'
          : collection === 'media'
            ? 'caption'
            : 'body',
      ['news', 'pages'].includes(collection) ? richText(variant.body) : variant.body,
    )
  for (const field of modules.find((definition) => definition.id === entry.module)?.fields ?? []) {
    if (field.readOnly) continue
    const key = keys[collection]?.[field.key] ?? field.key
    if (
      !key ||
      field.key === 'reference' ||
      ['seo', 'publicationStatus', 'visibility'].includes(key)
    )
      continue
    const value = field.localized ? variant.fields[field.key] : entry.shared[field.key]
    const old = field.localized ? previous?.fields[field.key] : before?.shared[field.key]
    if (original && value === old) continue
    if (field.type === 'relation') {
      if (!value) changed(key, null)
      else {
        const media = value.match(/^media-(\d+)$/)
        if (!media)
          throw new WorkspaceError(`${field.label} : sélectionner un média téléversé dans la base.`)
        changed(key, Number(media[1]))
      }
    } else
      changed(
        key,
        field.type === 'number'
          ? value
            ? Number(value)
            : null
          : field.type === 'date'
            ? value
              ? `${value}T12:00:00.000Z`
              : null
            : value || null,
      )
  }
  if (!original && ['projects', 'calls', 'opportunities'].includes(collection))
    data.reference = entry.reference
  if (collection === 'calls' && !original)
    data.budgetCurrency = entry.shared.budgetCurrency || 'MAD'
  if (!original && collection === 'news') data.type = entry.shared.type || 'news'
  if (collection === 'opportunities') {
    if (!original) data.contract = entry.shared.contract || variant.fields.contract
    if (!original) data.state = entry.shared.vacancyStatus || 'closed'
  }
  if (['news', 'pages'].includes(collection)) {
    if (
      !original ||
      variant.seoTitle !== previous?.seoTitle ||
      variant.seoDescription !== previous?.seoDescription
    )
      data.seo = { title: variant.seoTitle, description: variant.seoDescription }
    if (!original && collection === 'news')
      data.slug = variant.fields.slug || entry.reference.toLowerCase()
    if (!original || variant.fields.summary !== previous?.fields.summary)
      data.summary = variant.fields.summary || variant.body.slice(0, 300)
  }
  // Editors never send a publication marker. All public/locale completeness checks remain in the source collection.
  data.publicationStatus = variant.status
  data.internalNotes = entry.comment
  if (req.user?.role === 'admin')
    data.visibility = entry.shared.visibility === 'public' ? 'public' : 'private'
  const withdraw = Boolean(
    before?.publicVariants[locale] && !entry.publicVariants[locale] && req.user?.role === 'admin',
  )
  const publish = variant.status === 'published' && entry.shared.visibility === 'public'
  data._status = publish || withdraw ? 'published' : 'draft'
  if (req.user?.role !== 'admin' && data.publicationStatus === 'published')
    data.publicationStatus = 'draft'
  const result = entry.source
    ? await req.payload.update({
        collection,
        id: entry.source.id,
        data: data as RequiredDataFromCollectionSlug<typeof collection>,
        draft: !(publish || withdraw),
        locale,
        fallbackLocale: false,
        overrideAccess: false,
        user: req.user,
        req,
      })
    : await req.payload.create({
        collection,
        data: data as RequiredDataFromCollectionSlug<typeof collection>,
        draft: !(publish || withdraw),
        locale,
        fallbackLocale: false,
        overrideAccess: false,
        user: req.user,
        req,
      })
  return { ...entry, source: { collection, id: result.id, revision: result.updatedAt } }
}
