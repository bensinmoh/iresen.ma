import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { getPayload } from 'payload'
import sharp from 'sharp'
import { z } from 'zod'
import config from '../src/payload.config'
import { searchDatabase } from '../src/lib/search/database'
import { projectIllustrationDescription } from '../src/lib/project-illustrations'

if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(process.env.DATABASE_URL!).hostname))
  throw new Error('Illustration import requires the local database.')
const directory = path.resolve('.local/projects/generated-images')
const input = z
  .array(
    z.object({
      reference: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      sourcePath: z.string(),
      prompt: z.string().min(1),
      generator: z.literal('built-in image_gen'),
      kind: z.literal('conceptual-illustration'),
    }),
  )
  .length(11)
  .parse(
    JSON.parse(await readFile('.local/projects/workbook-1026/generated-image-inputs.json', 'utf8')),
  )
if (new Set(input.map((i) => i.reference)).size !== 11)
  throw new Error('Duplicate illustration reference')
const payload = await getPayload({ config })
try {
  const users = await payload.find({
    collection: 'users',
    overrideAccess: true,
    where: { role: { equals: 'admin' } },
    limit: 1,
  })
  if (!users.docs[0]) throw new Error('Existing administrator required')
  const user = { ...users.docs[0], collection: 'users' as const }
  const records = await payload.find({
    collection: 'projects',
    locale: 'all',
    fallbackLocale: false,
    overrideAccess: false,
    user,
    where: { reference: { in: input.map((i) => i.reference) } },
    limit: 11,
    depth: 0,
  })
  if (
    records.docs.length !== 11 ||
    records.docs.some((r) => r.imagePath || r.visibility !== 'public')
  )
    throw new Error('Only existing public projects without images may be changed')
  const manifest = []
  await mkdir(directory, { recursive: true, mode: 0o700 })
  await writeFile(
    path.join(directory, 'before-import.json'),
    JSON.stringify(records.docs, null, 2) + '\n',
    { flag: 'wx', mode: 0o600 },
  )
  for (const item of input) {
    if (!projectIllustrationDescription(item.reference, 'fr'))
      throw new Error('Missing localized illustration metadata')
    const original = await readFile(item.sourcePath)
    const folder = path.join(directory, item.reference)
    await mkdir(folder, { recursive: true, mode: 0o700 })
    await writeFile(path.join(folder, 'source.png'), original, { flag: 'wx', mode: 0o600 })
    const bytes = await sharp(original)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
    const assets = path.resolve(
      process.env.PROJECTS_ASSET_DIRECTORY || '.local/projects/assets',
      item.reference,
    )
    await mkdir(assets, { recursive: true, mode: 0o700 })
    await writeFile(path.join(assets, 'image.webp'), bytes, { flag: 'wx', mode: 0o600 })
    const size = await sharp(bytes).metadata()
    manifest.push({
      reference: item.reference,
      kind: item.kind,
      generator: item.generator,
      prompt: item.prompt,
      sourceSHA256: createHash('sha256').update(original).digest('hex'),
      sha256: createHash('sha256').update(bytes).digest('hex'),
      bytes: bytes.length,
      width: size.width,
      height: size.height,
      url: `/api/projects/${item.reference}/asset/image`,
      descriptions: Object.fromEntries(
        ['fr', 'en', 'ar'].map((locale) => [
          locale,
          projectIllustrationDescription(item.reference, locale as 'fr' | 'en' | 'ar'),
        ]),
      ),
      generatedAt: new Date().toISOString(),
      originalFile: `.local/projects/generated-images/${item.reference}/source.png`,
      servedFile: `.local/projects/assets/${item.reference}/image.webp`,
    })
  }
  const transactionID = await payload.db.beginTransaction()
  if (transactionID == null) throw new Error('Transaction required')
  try {
    for (const item of manifest) {
      const record = records.docs.find((r) => r.reference === item.reference)!
      await payload.update({
        collection: 'projects',
        id: record.id,
        locale: 'fr',
        overrideAccess: false,
        user,
        req: { transactionID },
        data: {
          imagePath: item.url,
          internalNotes:
            (record.internalNotes || '') +
            `\nOwner-requested generated conceptual illustration, 2026-10-16. Source SHA-256 ${item.sourceSHA256}; served WebP ${item.sha256}. Not evidence of an actual prototype/facility.`,
          _status: 'published',
        },
      })
    }
    await payload.db.commitTransaction(transactionID)
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID)
    throw error
  }
  await writeFile(path.join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', {
    mode: 0o600,
  })
  await writeFile('docs/project-illustrations.json', JSON.stringify(manifest, null, 2) + '\n')
  console.log(
    `Attached ${manifest.length} illustrations; all prior images and locale approvals preserved. WebP bytes: ${manifest.reduce((n, i) => n + i.bytes, 0)}.`,
  )
} finally {
  await payload.destroy()
  await searchDatabase().end()
}
process.exit(0)
