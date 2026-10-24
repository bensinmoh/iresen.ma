import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { getPayload } from 'payload'
import sharp from 'sharp'
import { z } from 'zod'
import config from '../src/payload.config'
import { mediaDirectory } from '../src/cms/media-directory'
import { stopSearchWorker } from '../src/lib/search/indexer'
import { searchDatabase } from '../src/lib/search/database'

// Asset ingestion only. Nothing in this command publishes a photo or adds it
// to the public gallery, pages, translations or search catalogue.
const { values } = parseArgs({
  options: {
    source: { type: 'string' },
    apply: { type: 'boolean' },
    'refresh-changed': { type: 'boolean' },
  },
})
if (!values.source)
  throw new Error('Usage: ingest-photo-asset-library.ts --source <collection directory> [--apply]')
const host = new URL(process.env.DATABASE_URL!).hostname
if (!['localhost', '127.0.0.1', '[::1]'].includes(host))
  throw new Error('Photo-library ingestion is restricted to the local database.')
const root = path.resolve(values.source)
const privateRoot = path.resolve('.local/photo-asset-library')
const manifestPath = path.resolve('docs/photo-asset-library.json')
const sourceSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    filename: z.string().refine((value) => path.basename(value) === value && /\.jpg$/i.test(value)),
    category: z.string(),
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    source_width: z.number().positive(),
    source_height: z.number().positive(),
    output_width: z.number().positive(),
    output_height: z.number().positive(),
    scale_factor: z.number().positive(),
    output_sha256: z.string().regex(/^[a-f0-9]{64}$/),
    source_sha256: z.string().regex(/^[a-f0-9]{64}$/),
    original_filename: z.string(),
    review_notes: z.array(z.string()),
  }),
)
const sources = sourceSchema.parse(
  JSON.parse(await readFile(path.join(root, 'catalogue.json'), 'utf8')),
)
if (
  new Set(sources.map((item) => item.id)).size !== sources.length ||
  new Set(sources.map((item) => item.filename)).size !== sources.length
)
  throw new Error('Duplicate collection IDs or filenames.')
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex')
let totalBytes = 0
for (const source of sources) {
  const bytes = await readFile(path.join(root, 'Photos', source.filename))
  if (hash(bytes) !== source.output_sha256) throw new Error(`Source hash mismatch: ${source.id}`)
  const info = await sharp(bytes).metadata()
  if (
    info.format !== 'jpeg' ||
    info.width !== source.output_width ||
    info.height !== source.output_height
  )
    throw new Error(`Source format/dimension mismatch: ${source.id}`)
  totalBytes += bytes.length
}
console.log(
  JSON.stringify({ apply: Boolean(values.apply), verified: sources.length, jpgBytes: totalBytes }),
)
if (!values.apply) process.exit(0)

await mkdir(path.join(privateRoot, 'jpg'), { recursive: true, mode: 0o700 })
await mkdir(path.join(privateRoot, 'webp'), { recursive: true, mode: 0o700 })
type Asset = {
  id: string
  collectionId: number
  sourceFilename: string
  sourceSha256: string
  originalFilename: string
  originalSha256: string
  category: string
  title: string
  description: string
  keywords: string[]
  originalWidth: number
  originalHeight: number
  collectionWidth: number
  collectionHeight: number
  collectionScaleFactor: number
  qualityNotes: string[]
  upscaled: boolean
  lowResolutionOriginal: boolean
  jpg: { path: string; sha256: string; bytes: number }
  preview: {
    path: string
    cmsFilename: string
    cmsSha256: string
    cmsBytes: number
    sha256: string
    bytes: number
    width: number
    height: number
  }
  publication: 'private-draft'
  translations: 'not-imported'
}
type Checkpoint = {
  id: string
  mediaId: number
  cmsFilename: string
  sourceSha256: string
  cmsSha256?: string
  jpgPath?: string
  previousVersions?: {
    mediaId: number
    cmsFilename: string
    sourceSha256: string
    jpgPath: string
  }[]
}
const checkpointPath = path.join(privateRoot, 'cms-records.json')
const checkpoints: Checkpoint[] = await readFile(checkpointPath, 'utf8')
  .then(JSON.parse)
  .catch((error) => {
    if (error.code !== 'ENOENT') throw error
    return []
  })
const assets: Asset[] = []
// Explicit owner selections take precedence over later bulk-source refreshes.
const overrides: {
  assets: { id: string; originalPath: string; originalSha256: string; preferred: Asset }[]
} = await readFile(path.resolve('docs/photo-asset-overrides.json'), 'utf8')
  .then(JSON.parse)
  .catch((error) => {
    if (error.code !== 'ENOENT') throw error
    return { assets: [] }
  })
process.env.SEARCH_WORKER_DISABLED = 'true'
const payload = await getPayload({ config })
try {
  const users = await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 1,
    sort: 'id',
    overrideAccess: true,
  })
  const admin = users.docs[0]
  if (!admin) throw new Error('An existing administrator is required for asset ingestion.')
  const actor = { ...admin, collection: 'users' as const }
  let created = 0
  let reused = 0
  for (const source of sources.sort((a, b) => a.id - b.id)) {
    const id = `iresen-photo-${String(source.id).padStart(3, '0')}`
    const ownerOverride = overrides.assets.find((item) => item.id === id)
    if (ownerOverride) {
      assets.push(ownerOverride.preferred)
      reused++
      continue
    }
    const checkpoint = checkpoints.find((entry) => entry.id === id)
    const changedSource = Boolean(checkpoint && checkpoint.sourceSha256 !== source.output_sha256)
    if (changedSource && !values['refresh-changed'])
      throw new Error(
        `Source changed since ingestion; review ${id} and use --refresh-changed to preserve a new version.`,
      )
    const jpgPath = changedSource
      ? path.join(
          privateRoot,
          'jpg',
          'versions',
          id,
          source.output_sha256.slice(0, 12),
          source.filename,
        )
      : (checkpoint?.jpgPath ?? path.join(privateRoot, 'jpg', source.filename))
    await mkdir(path.dirname(jpgPath), { recursive: true, mode: 0o700 })
    const existingJpg = await readFile(jpgPath).catch((error) => {
      if (error.code !== 'ENOENT') throw error
      return null
    })
    if (existingJpg && hash(existingJpg) !== source.output_sha256)
      throw new Error(`Preserve modified private JPG: ${id}`)
    if (!existingJpg) await copyFile(path.join(root, 'Photos', source.filename), jpgPath)
    const cmsFilename = `${id}-${source.output_sha256.slice(0, 12)}.webp`
    const previewPath = path.join(privateRoot, 'webp', cmsFilename)
    let preview = await readFile(previewPath).catch((error) => {
      if (error.code !== 'ENOENT') throw error
      return null
    })
    if (!preview) {
      preview = await sharp(jpgPath)
        .rotate()
        .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84 })
        .toBuffer()
      await writeFile(previewPath, preview, { mode: 0o600, flag: 'wx' })
    }
    const info = await sharp(preview).metadata()
    const existing = await payload.find({
      collection: 'media',
      locale: 'fr',
      fallbackLocale: false,
      draft: true,
      overrideAccess: false,
      user: actor,
      where: { filename: { equals: cmsFilename } },
      limit: 2,
    })
    if (existing.docs.length > 1) throw new Error(`Duplicate CMS filename: ${cmsFilename}`)
    let doc = existing.docs[0]
    if (checkpoint && !changedSource && (!doc || doc.id !== checkpoint.mediaId))
      throw new Error(`Preserve changed or removed CMS record: ${id}`)
    if (doc) {
      if (
        !doc.internalNotes?.includes(`assetLibraryId=${id}\n`) ||
        !doc.internalNotes.includes(`sourceSha256=${source.output_sha256}\n`)
      )
        throw new Error(`Preserve unrelated CMS asset: ${cmsFilename}`)
      reused++
    } else {
      doc = await payload.create({
        collection: 'media',
        locale: 'fr',
        fallbackLocale: false,
        draft: true,
        overrideAccess: false,
        user: actor,
        file: { data: preview, name: cmsFilename, mimetype: 'image/webp', size: preview.length },
        data: {
          title: source.title,
          alt: source.title,
          caption: source.description,
          searchText: source.keywords.join(' '),
          visibility: 'private',
          publicationStatus: 'draft',
          _status: 'draft',
          editorialOwner: admin.id,
          internalNotes: `assetLibraryId=${id}\nsourceSha256=${source.output_sha256}\ncollection=IRESEN_Photos_4K_JPG\ncategory=${source.category}\noriginalJpg=${source.filename}\noriginalResolution=${source.source_width}x${source.source_height}\ncollectionScaleFactor=${source.scale_factor}\n${source.review_notes.join('\n')}\nIngestion only. Await owner placement instructions; do not publish or add to the gallery.`,
        },
      })
      created++
    }
    // Payload normalizes/re-encodes image uploads. Preserve and fingerprint its
    // delivered WebP separately from the prepared source preview.
    const uploaded = await readFile(path.join(mediaDirectory(), doc.filename!))
    const uploadedInfo = await sharp(uploaded).metadata()
    const cmsSha256 = hash(uploaded)
    if (
      uploadedInfo.format !== 'webp' ||
      uploadedInfo.width !== info.width ||
      uploadedInfo.height !== info.height
    )
      throw new Error(`Unexpected CMS preview format/dimensions: ${id}`)
    if (checkpoint?.cmsSha256 && !changedSource && checkpoint.cmsSha256 !== cmsSha256)
      throw new Error(`Preserve changed CMS preview bytes: ${id}`)
    if (!checkpoint) {
      checkpoints.push({
        id,
        mediaId: doc.id,
        cmsFilename: doc.filename!,
        sourceSha256: source.output_sha256,
        cmsSha256,
        jpgPath,
      })
      await writeFile(checkpointPath, JSON.stringify(checkpoints, null, 2) + '\n', { mode: 0o600 })
    } else if (changedSource) {
      checkpoint.previousVersions ??= []
      checkpoint.previousVersions.push({
        mediaId: checkpoint.mediaId,
        cmsFilename: checkpoint.cmsFilename,
        sourceSha256: checkpoint.sourceSha256,
        jpgPath: checkpoint.jpgPath ?? path.join(privateRoot, 'jpg', source.filename),
      })
      Object.assign(checkpoint, {
        mediaId: doc.id,
        cmsFilename: doc.filename!,
        sourceSha256: source.output_sha256,
        cmsSha256,
        jpgPath,
      })
      await writeFile(checkpointPath, JSON.stringify(checkpoints, null, 2) + '\n', { mode: 0o600 })
    } else if (!checkpoint.cmsSha256) {
      checkpoint.cmsSha256 = cmsSha256
      await writeFile(checkpointPath, JSON.stringify(checkpoints, null, 2) + '\n', { mode: 0o600 })
    }
    assets.push({
      id,
      collectionId: source.id,
      sourceFilename: source.filename,
      sourceSha256: source.output_sha256,
      originalFilename: source.original_filename,
      originalSha256: source.source_sha256,
      category: source.category,
      title: source.title,
      description: source.description,
      keywords: source.keywords,
      originalWidth: source.source_width,
      originalHeight: source.source_height,
      collectionWidth: source.output_width,
      collectionHeight: source.output_height,
      collectionScaleFactor: source.scale_factor,
      qualityNotes: source.review_notes,
      upscaled: source.scale_factor > 1,
      lowResolutionOriginal: Math.max(source.source_width, source.source_height) < 1000,
      jpg: {
        path: path.relative(process.cwd(), jpgPath),
        sha256: source.output_sha256,
        bytes: (await readFile(jpgPath)).length,
      },
      preview: {
        path: path.relative(process.cwd(), previewPath),
        cmsFilename: doc.filename!,
        cmsSha256,
        cmsBytes: uploaded.length,
        sha256: hash(preview),
        bytes: preview.length,
        width: info.width!,
        height: info.height!,
      },
      publication: 'private-draft',
      translations: 'not-imported',
    })
    if (assets.length % 20 === 0 || assets.length === sources.length)
      console.log(
        JSON.stringify({ processed: assets.length, total: sources.length, created, reused }),
      )
  }
  for (const override of overrides.assets) {
    const index = assets.findIndex((asset) => asset.id === override.id)
    if (index < 0 || override.preferred.id !== override.id)
      throw new Error('Invalid owner asset override.')
    if (
      hash(await readFile(override.originalPath)) !== override.originalSha256 ||
      hash(await readFile(override.preferred.jpg.path)) !== override.preferred.jpg.sha256 ||
      hash(await readFile(override.preferred.preview.path)) !== override.preferred.preview.sha256 ||
      hash(await readFile(path.join(mediaDirectory(), override.preferred.preview.cmsFilename))) !==
        override.preferred.preview.cmsSha256
    )
      throw new Error(`Owner-selected asset bytes changed: ${override.id}`)
    assets[index] = override.preferred
  }
  const manifest = {
    collection: 'IRESEN_Photos_4K_JPG',
    received: '2026-10-23',
    count: assets.length,
    authorization:
      'Owner requests all current collection photos as website assets for future placement. This does not commission public gallery expansion or page replacements.',
    storage:
      'Private local asset store and private draft CMS Media records; no new files under public/. Original JPG bytes preserved, WebP previews at maximum 2560px without enlargement; no generation or cropping. Payload normalizes uploaded WebP; its delivered checksum is recorded separately. Existing public selection unchanged.',
    sourceMetadata:
      'Collection-provided descriptive text and original-resolution evidence; not independent verification of institutional facts, dates or rights. Original EXIF/IPTC and absolute source paths are not copied into this manifest. No translations or public reuse license inferred.',
    collectionJpgBytes: totalBytes,
    jpgBytes: assets.reduce((total, asset) => total + asset.jpg.bytes, 0),
    ownerOverrides: overrides.assets.length ? 'docs/photo-asset-overrides.json' : undefined,
    retainedPreviousVersions: checkpoints.reduce(
      (total, record) => total + (record.previousVersions?.length ?? 0),
      0,
    ),
    assets,
  }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(
    JSON.stringify({
      complete: assets.length,
      created,
      reused,
      manifest: 'docs/photo-asset-library.json',
    }),
  )
} finally {
  stopSearchWorker()
  await payload.destroy()
  await searchDatabase().end()
}
process.exit(0)
