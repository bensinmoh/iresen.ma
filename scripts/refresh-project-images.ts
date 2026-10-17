import { readFile, writeFile, copyFile, rename } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { z } from 'zod'

// Owner-authorized local media replacement. URLs, CMS records and locale gates stay unchanged.
const root = path.resolve('.local/projects/image-refresh-20261016')
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex')
const references = new Set([
  'aquasolar',
  'chams',
  'csp-ait-baha',
  'frigo-solaire',
  'hybridbath',
  'tahalagrid',
])
const inventory = z
  .array(z.object({ reference: z.string(), sha256: z.string() }))
  .length(70)
  .parse(JSON.parse(await readFile(path.join(root, 'inventory.json'), 'utf8')))
const inputs = z
  .array(
    z.object({
      reference: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      mode: z.enum(['from-scratch', 'source-recreation']),
      prompt: z.string().min(1),
      generatedFile: z.string(),
    }),
  )
  .length(70)
  .parse(JSON.parse(await readFile(path.join(root, 'inputs.json'), 'utf8')))
if (
  new Set(inputs.map((i) => i.reference)).size !== 70 ||
  inputs.some(
    (i) =>
      !inventory.some((p) => p.reference === i.reference) ||
      (i.mode === 'source-recreation') !== references.has(i.reference),
  )
)
  throw Error('Expected 64 new compositions and six named source recreations.')
const derivativesPath = path.resolve('.local/projects/derivatives.json')
const derivativesBytes = await readFile(derivativesPath)
const derivatives = JSON.parse(derivativesBytes.toString())
const manifest = []
for (const item of inputs) {
  const folder = path.join(root, item.reference)
  const before = await readFile(path.join(folder, 'before.webp'))
  const live = await readFile(path.resolve('.local/projects/assets', item.reference, 'image.webp'))
  const expected = inventory.find((p) => p.reference === item.reference)!.sha256
  if (hash(before) !== expected || hash(live) !== expected)
    throw Error('Source changed since snapshot: ' + item.reference)
  const source = await readFile(path.join(folder, 'generated.png'))
  if (path.resolve(item.generatedFile) !== path.join(folder, 'generated.png'))
    throw Error('Unexpected generated path')
  const bytes = await sharp(source)
    .rotate()
    .resize(1200, 675, { fit: 'cover' })
    .webp({ quality: 82 })
    .toBuffer()
  const destination = `.local/projects/assets/${item.reference}/image.webp`
  const next = path.resolve(destination + '.refresh-next')
  await writeFile(path.join(folder, 'served.webp'), bytes)
  const entry = {
    reference: item.reference,
    generator: 'built-in image_gen',
    mode: item.mode,
    prompt: item.prompt,
    beforeSHA256: expected,
    inputSHA256: item.mode === 'source-recreation' ? expected : null,
    generatedSHA256: hash(source),
    sha256: hash(bytes),
    bytes: bytes.length,
    width: 1200,
    height: 675,
    originalFile: `.local/projects/image-refresh-20261016/${item.reference}/generated.png`,
    servedFile: destination,
    url: `/api/projects/${item.reference}/asset/image`,
  }
  manifest.push(entry)
  derivatives[`${item.reference}/image`] = { sha256: entry.sha256, bytes: entry.bytes }
  if (process.argv.includes('--apply')) await writeFile(next, bytes)
}
await writeFile(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
if (process.argv.includes('--apply')) {
  await writeFile(path.join(root, 'derivatives-before.json'), derivativesBytes, { flag: 'wx' })
  const swapped = []
  try {
    for (const entry of manifest) {
      await rename(path.resolve(entry.servedFile + '.refresh-next'), path.resolve(entry.servedFile))
      swapped.push(entry)
    }
    await writeFile(derivativesPath, JSON.stringify(derivatives, null, 2) + '\n')
    await writeFile(
      'docs/project-image-refresh-20261016.json',
      JSON.stringify(manifest, null, 2) + '\n',
    )
  } catch (error) {
    for (const entry of swapped)
      await copyFile(
        path.join(root, entry.reference, 'before.webp'),
        path.resolve(entry.servedFile),
      )
    await writeFile(derivativesPath, derivativesBytes)
    throw error
  }
}
console.log(
  `${process.argv.includes('--apply') ? 'Replaced' : 'Prepared'} ${manifest.length} images, ${manifest.reduce((n, i) => n + i.bytes, 0)} WebP bytes. Portraits, CMS records and PDFs untouched.`,
)
