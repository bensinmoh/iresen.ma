import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Pool } from 'pg'
import photos from '../src/data/media-photos.json' with { type: 'json' }
import { retainedContentEntries } from '../src/lib/cms-workspace/retained-content'
import type { Entry } from '../src/lib/cms-preview/model'

// Explicit owner commission, 23 October 2026: curate the local photothèque and
// replace the GreenH2A visual. This command never touches a remote database.
const host = new URL(process.env.DATABASE_URL!).hostname
if (!['localhost', '127.0.0.1', '[::1]'].includes(host))
  throw new Error('Photo curation is restricted to the local database.')
const apply = process.argv.includes('--apply')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = await pool.connect()
const locales = ['fr', 'en', 'ar'] as const
const dataset = 'src/data/media-photos.json'
type Row = {
  id: string
  module: string
  reference: string
  shared: Entry['shared']
  variants: Entry['variants']
  public_variants: Entry['publicVariants']
}
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
let committed = false
try {
  await db.query('BEGIN')
  await db.query("SELECT revision FROM cms_workspace_meta WHERE scope='content' FOR UPDATE")
  const result = await db.query<Row>(
    `SELECT * FROM cms_authoring_entries WHERE shared->>'_sourceDataset'=$1
     OR reference IN ('catalog-HomePlatforms','catalog-Platforms') ORDER BY id FOR UPDATE`,
    [dataset],
  )
  const deleted = new Set(
    (await db.query<{ entry_id: string }>('SELECT entry_id FROM cms_deleted_entries')).rows.map(
      (row) => row.entry_id,
    ),
  )
  const at = new Date().toISOString()
  const sources = retainedContentEntries(at)
  const nextPhotos = sources.filter((entry) => entry.shared._sourceDataset === dataset)
  if (nextPhotos.length !== photos.length) throw new Error('Incomplete photo source projection.')
  const updates: Row[] = []
  const inserts: Entry[] = []
  const withheld: string[] = []
  for (const source of nextPhotos) {
    if (deleted.has(source.id)) throw new Error(`Preserve deleted record: ${source.reference}`)
    const existing = result.rows.find((row) => row.id === source.id)
    if (!existing) {
      inserts.push(source)
      continue
    }
    const row = structuredClone(existing)
    const original = JSON.parse(existing.shared.sourceRecord) as (typeof photos)[number]
    // Preserve private status and every editorial change to captions or fields.
    for (const key of ['assetPath', 'sourceImagePath'])
      if (row.shared[key] && row.shared[key] !== original.src)
        throw new Error(`Review edited asset path before synchronization: ${row.reference}`)
    row.shared = { ...row.shared, ...source.shared, visibility: row.shared.visibility }
    for (const locale of locales) {
      for (const value of [row.variants[locale], row.public_variants[locale]]) {
        if (!value) continue
        if (value.title === original.title[locale]) value.title = source.variants[locale].title
        if (value.body === original.title[locale]) value.body = source.variants[locale].body
        for (const key of ['alt', 'caption'])
          if (value.fields[key] === original.title[locale])
            value.fields[key] = source.variants[locale].fields[key]
        if (value.fields._publishedShared) {
          const shared = JSON.parse(value.fields._publishedShared)
          for (const key of [
            'fileName',
            'sourceImagePath',
            'assetPath',
            'mimeType',
            'category',
            'width',
            'height',
          ])
            shared[key] =
              typeof shared[key] === 'number' ? Number(source.shared[key]) : source.shared[key]
          value.fields._publishedShared = JSON.stringify(shared)
        }
      }
    }
    if (!equal(row, existing)) updates.push(row)
  }
  const references = new Set(nextPhotos.map((entry) => entry.reference))
  for (const existing of result.rows.filter((row) => row.shared._sourceDataset === dataset)) {
    if (references.has(existing.reference)) continue
    const row = structuredClone(existing)
    row.shared.visibility = 'private'
    for (const value of Object.values(row.public_variants)) {
      if (!value) continue
      const shared = JSON.parse(value.fields._publishedShared ?? '{}')
      shared.visibility = 'private'
      value.fields._publishedShared = JSON.stringify(shared)
    }
    if (!equal(row, existing)) updates.push(row)
    withheld.push(row.reference)
  }
  for (const existing of result.rows.filter((row) => row.shared.catalogNamespace)) {
    const source = sources.find((entry) => entry.id === existing.id)
    if (!source) throw new Error(`Missing namespace: ${existing.reference}`)
    const row = structuredClone(existing)
    const namespace = row.shared.catalogNamespace
    const next = JSON.parse(source.shared.sourceRecord)
    const patch = (value: Record<string, unknown>, locale: string) => {
      const paths =
        namespace === 'HomePlatforms'
          ? [
              ['platforms', 'greenh2a', 'imageDescription'],
              ['platforms', 'greenh2a', 'searchText'],
            ]
          : [['imageAlt', 'greenh2a']]
      for (const keys of paths) {
        let target = value
        let origin = next[locale] as Record<string, unknown>
        for (const key of keys.slice(0, -1)) {
          target = target[key] as Record<string, unknown>
          origin = origin[key] as Record<string, unknown>
        }
        target[keys.at(-1)!] = origin[keys.at(-1)!]
      }
    }
    const baseline = JSON.parse(row.shared.sourceRecord)
    for (const locale of locales) {
      patch(baseline[locale], locale)
      for (const value of [row.variants[locale], row.public_variants[locale]]) {
        if (!value?.fields.structuredContent) continue
        const content = JSON.parse(value.fields.structuredContent)
        patch(content, locale)
        value.fields.structuredContent = JSON.stringify(content, null, 2)
      }
    }
    row.shared.sourceRecord = JSON.stringify(baseline, null, 2)
    if (!equal(row, existing)) updates.push(row)
  }
  console.log(
    JSON.stringify({
      apply,
      selected: photos.length,
      update: updates.length,
      add: inserts.length,
      withdraw: withheld.length,
    }),
  )
  if (apply && (updates.length || inserts.length)) {
    const backup = path.resolve('.local/photo-library-curation', at.replaceAll(':', '-'))
    await mkdir(backup, { recursive: true, mode: 0o700 })
    await writeFile(path.join(backup, 'before.json'), JSON.stringify(result.rows, null, 2), {
      mode: 0o600,
    })
    const actor = (
      await db.query<{ id: number }>("SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1")
    ).rows[0]
    if (!actor) throw new Error('Existing local administrator required for audit attribution.')
    for (const row of updates) {
      const before = result.rows.find((old) => old.id === row.id)!
      for (const locale of locales)
        await db.query(
          `INSERT INTO cms_authoring_revisions(entry_id,language,variant,shared,note,actor_id)
           VALUES($1,$2,$3::jsonb,$4::jsonb,$5,$6)`,
          [
            row.id,
            locale,
            JSON.stringify(before.variants[locale]),
            JSON.stringify(before.shared),
            'Sélection photothèque et visuel GreenH2A — demande propriétaire du 23 octobre 2026',
            actor.id,
          ],
        )
      await db.query(
        `UPDATE cms_authoring_entries SET shared=$2::jsonb,variants=$3::jsonb,public_variants=$4::jsonb,updated_at=$5 WHERE id=$1`,
        [
          row.id,
          JSON.stringify(row.shared),
          JSON.stringify(row.variants),
          JSON.stringify(row.public_variants),
          at,
        ],
      )
    }
    for (const entry of inserts)
      await db.query(
        `INSERT INTO cms_authoring_entries(id,module,reference,shared,variants,comment,public_variants,updated_at)
         VALUES($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7::jsonb,$8)`,
        [
          entry.id,
          entry.module,
          entry.reference,
          JSON.stringify(entry.shared),
          JSON.stringify(entry.variants),
          entry.comment,
          JSON.stringify(entry.publicVariants),
          at,
        ],
      )
    await db.query(
      `INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail)
       VALUES('content','photo-library-2026-10-23','Sélection photographique demandée par le propriétaire',$1,'admin',$2::jsonb)`,
      [
        actor.id,
        JSON.stringify({
          selected: photos.length,
          updated: updates.length,
          inserted: inserts.length,
          withdrawn: withheld,
          backup,
        }),
      ],
    )
    await db.query(
      "UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'",
    )
    await db.query('COMMIT')
    committed = true
    console.log('Local photo selection reconciled; previous records backed up and revisioned.')
  }
} finally {
  if (!committed) await db.query('ROLLBACK')
  db.release()
  await pool.end()
}
