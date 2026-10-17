import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import pg from 'pg'
import sharp from 'sharp'
import { z } from 'zod'

// Owner-supplied email/portrait associations stay in an ignored local manifest,
// never in committed source or public media. No account or role is created here.
const hostname = new URL(process.env.DATABASE_URL!).hostname
if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname))
  throw new Error('Account portrait import requires the local database.')
const manifestPath = process.argv[process.argv.indexOf('--manifest') + 1]
if (!process.argv.includes('--manifest') || !manifestPath)
  throw new Error('Supply --manifest with the owner-approved private JSON file.')
const manifest = z
  .array(
    z.object({
      email: z.email(),
      displayName: z.string().trim().min(1).max(120),
      image: z.string().min(1),
      sources: z.array(z.string().min(1)).min(1).max(6),
      reconstruction: z.boolean().default(false),
    }),
  )
  .min(1)
  .max(5)
  .parse(JSON.parse(await readFile(manifestPath, 'utf8')))
if (new Set(manifest.map((item) => item.email.toLowerCase())).size !== manifest.length)
  throw new Error('Duplicate account assignments in the manifest.')
const hash = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex')
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
try {
  await client.query('BEGIN')
  const prepared = []
  for (const item of manifest) {
    const result = await client.query<{ id: number; role: string }>(
      'SELECT id,role FROM users WHERE lower(email)=$1 FOR UPDATE',
      [item.email.toLowerCase()],
    )
    const user = result.rows[0]
    if (!user || !['admin', 'editor'].includes(user.role))
      throw new Error(
        `The account for ${item.displayName} must already exist with an allowed role.`,
      )
    const bytes = await sharp(await readFile(item.image), { limitInputPixels: 16_000_000 })
      .rotate()
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 90 })
      .toBuffer()
    if (bytes.length > 1_000_000) throw new Error('Portrait exceeds the database size bound.')
    const provenance = {
      ownerProvided: true,
      aiAssisted: true,
      generator: 'image_gen built-in',
      operation: item.reconstruction
        ? 'multi-reference professional portrait reconstruction'
        : 'identity-preserving studio background edit',
      palette: ['#12345A', '#296BB4'],
      generatedSha256: hash(await readFile(item.image)),
      sourceSha256: await Promise.all(
        item.sources.map(async (source) => hash(await readFile(source))),
      ),
    }
    prepared.push({
      userId: user.id,
      name: item.displayName,
      bytes,
      sha256: hash(bytes),
      provenance,
    })
  }
  console.log(
    `Prepared ${prepared.length} private account portraits; existing roles and credentials preserved.`,
  )
  if (!process.argv.includes('--apply')) {
    await client.query('ROLLBACK')
  } else {
    const directory = path.resolve('.local/account-avatars')
    await mkdir(directory, { recursive: true, mode: 0o700 })
    const previous = await client.query(
      'SELECT * FROM cms_account_avatars WHERE user_id=ANY($1::int[])',
      [prepared.map((item) => item.userId)],
    )
    await writeFile(
      path.join(directory, `before-${Date.now()}.json`),
      JSON.stringify(previous.rows),
      { mode: 0o600 },
    )
    for (const item of prepared) {
      await client.query(
        `INSERT INTO cms_account_avatars(user_id,display_name,content,mime,sha256,provenance)
        VALUES($1,$2,$3,'image/webp',$4,$5::jsonb) ON CONFLICT(user_id) DO UPDATE SET
        display_name=excluded.display_name,content=excluded.content,mime=excluded.mime,
        sha256=excluded.sha256,provenance=excluded.provenance,updated_at=now()`,
        [item.userId, item.name, item.bytes, item.sha256, JSON.stringify(item.provenance)],
      )
      await writeFile(path.join(directory, `account-${item.userId}.webp`), item.bytes, {
        mode: 0o600,
      })
      await client.query(
        `INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail)
        VALUES('account',$1,'Portrait de compte fourni par le propriétaire',$2,'admin',$3::jsonb)`,
        [
          String(item.userId),
          (await client.query("SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1"))
            .rows[0].id,
          JSON.stringify({ portraitSha256: item.sha256, aiAssisted: true }),
        ],
      )
    }
    await client.query('COMMIT')
    console.log(
      `Stored ${prepared.length} portraits in PostgreSQL; authenticated own-account access only.`,
    )
  }
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  await client.end()
}
