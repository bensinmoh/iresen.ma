import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Client } from 'pg'
import metadata from '../src/data/retained-media-review-metadata.json' with { type: 'json' }
import { createEntry, validateEntry, type Entry } from '../src/lib/cms-preview/model'

// Owner request, 2026-10-27: resolve the remaining 31 media reviews.
// Source attribution and commissioned-use restrictions are not open licences.
const host = new URL(process.env.DATABASE_URL!).hostname
if (!['localhost', '127.0.0.1', '[::1]'].includes(host)) throw Error('Local database only.')
const apply = process.argv.includes('--apply')
const db = new Client({ connectionString: process.env.DATABASE_URL })
const locales = ['fr', 'en', 'ar'] as const
type Row = {
  id: string
  module: string
  shared: Entry['shared']
  variants: Entry['variants']
  public_variants: Entry['publicVariants']
  source_collection: string | null
}
await db.connect()
try {
  await db.query('BEGIN')
  const meta = await db.query("SELECT * FROM cms_workspace_meta WHERE scope='content' FOR UPDATE")
  const actor = (await db.query("SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1"))
    .rows[0]
  if (!actor) throw Error('Existing administrator required.')
  const result = await db.query<Row>(
    `SELECT e.* FROM cms_authoring_entries e WHERE e.id=ANY($1::text[])
     AND NOT EXISTS(SELECT 1 FROM cms_deleted_entries d WHERE d.entry_id=e.id)
     ORDER BY e.id FOR UPDATE`,
    [Object.keys(metadata)],
  )
  if (result.rows.length !== Object.keys(metadata).length) throw Error('Media corpus changed.')
  const updates: Row[] = []
  for (const row of result.rows) {
    const source = metadata[row.id as keyof typeof metadata]
    if (
      row.module !== 'media' ||
      row.source_collection ||
      row.shared.assetPath !== source.assetPath
    )
      throw Error(`Changed media source: ${row.id}`)
    for (const reference of source.evidence) await readFile(reference)
    if ('sha256' in source) {
      const bytes = await readFile(path.join('public', source.assetPath))
      if (createHash('sha256').update(bytes).digest('hex') !== source.sha256)
        throw Error(`Changed image bytes: ${row.id}`)
    }
    const next = structuredClone(row)
    next.shared.credit ||= source.credit
    next.shared.rights ||= source.rights
    // Snapshot strings must use the same JSONB key order returned on later reads.
    next.shared = (
      await db.query('SELECT $1::jsonb AS value', [JSON.stringify(next.shared)])
    ).rows[0].value
    for (const locale of locales) {
      const variant = next.variants[locale]
      if (!['review', 'published'].includes(variant.status))
        throw Error(`Preserve draft: ${row.id}`)
      const errors = validateEntry(
        {
          ...createEntry(next.module, next.id, new Date().toISOString()),
          ...next,
          publicVariants: next.public_variants,
        },
        locale,
        true,
      )
      if (errors.length) throw Error(`${row.id}/${locale}: ${errors.join('; ')}`)
      variant.status = 'published'
      next.public_variants[locale] = {
        ...structuredClone(variant),
        fields: { ...variant.fields, _publishedShared: JSON.stringify(next.shared) },
      }
    }
    if (JSON.stringify(next) !== JSON.stringify(row)) updates.push(next)
  }
  console.log(JSON.stringify({ matched: result.rows.length, updates: updates.length, apply }))
  if (apply && updates.length) {
    const directory = '.local/cms-review-resolution-20261027'
    await mkdir(directory, { recursive: true, mode: 0o700 })
    await writeFile(
      `${directory}/before-${Date.now()}.json`,
      JSON.stringify({ meta: meta.rows, rows: result.rows }),
      { mode: 0o600, flag: 'wx' },
    )
    for (const row of updates) {
      const before = result.rows.find((r) => r.id === row.id)!
      for (const locale of locales)
        await db.query(
          `INSERT INTO cms_authoring_revisions(entry_id,language,variant,shared,note,actor_id)
           VALUES($1,$2,$3::jsonb,$4::jsonb,$5,$6)`,
          [
            row.id,
            locale,
            JSON.stringify(before.variants[locale]),
            JSON.stringify(before.shared),
            'Résolution sourcée des revues média demandée par le propriétaire le 27 octobre 2026',
            actor.id,
          ],
        )
      await db.query(
        `UPDATE cms_authoring_entries SET shared=$2::jsonb,variants=$3::jsonb,public_variants=$4::jsonb,updated_at=now() WHERE id=$1`,
        [
          row.id,
          JSON.stringify(row.shared),
          JSON.stringify(row.variants),
          JSON.stringify(row.public_variants),
        ],
      )
      await db.query(
        `INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail)
         VALUES('content',$1,'Résolution sourcée des revues média',$2,'admin',$3::jsonb)`,
        [
          row.id,
          actor.id,
          JSON.stringify({
            ownerRequest: '2026-10-27',
            evidence: metadata[row.id as keyof typeof metadata].evidence,
            visibilityPreserved: row.shared.visibility,
            openLicenceGranted: false,
          }),
        ],
      )
    }
    await db.query(
      "UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'",
    )
    await db.query('COMMIT')
  } else await db.query('ROLLBACK')
  const counts = await db.query(`SELECT count(*)::int AS pending FROM cms_authoring_entries e
    WHERE NOT EXISTS(SELECT 1 FROM cms_deleted_entries d WHERE d.entry_id=e.id)
    AND EXISTS(SELECT 1 FROM jsonb_each(e.variants) v WHERE v.value->>'status'='review')`)
  console.log(JSON.stringify(counts.rows[0]))
} catch (error) {
  await db.query('ROLLBACK')
  throw error
} finally {
  await db.end()
}
