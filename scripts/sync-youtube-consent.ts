import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Pool } from 'pg'
import type { Entry } from '../src/lib/cms-preview/model'

// Reconcile only the two external-service consent labels, preserving publication gates.
const host = new URL(process.env.DATABASE_URL!).hostname
if (!['localhost', '127.0.0.1', '[::1]'].includes(host))
  throw new Error('Consent synchronization is restricted to the local database.')
const apply = process.argv.includes('--apply')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = await pool.connect()
const locales = ['fr', 'en', 'ar'] as const
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
    "SELECT * FROM cms_authoring_entries WHERE reference='catalog-CookieConsent' FOR UPDATE",
  )
  const at = new Date().toISOString()
  const updates: Row[] = []
  const copy = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => [
        locale,
        JSON.parse(await readFile(`src/messages/${locale}.json`, 'utf8')).CookieConsent,
      ]),
    ),
  )
  for (const existing of result.rows) {
    const row = structuredClone(existing)
    const baseline = JSON.parse(row.shared.sourceRecord)
    for (const locale of locales) {
      for (const key of ['external', 'externalDescription'])
        baseline[locale][key] = copy[locale][key]
      for (const value of [row.variants[locale], row.public_variants[locale]]) {
        if (!value?.fields.structuredContent) continue
        const content = JSON.parse(value.fields.structuredContent)
        for (const key of ['external', 'externalDescription']) content[key] = copy[locale][key]
        value.fields.structuredContent = JSON.stringify(content, null, 2)
      }
    }
    row.shared.sourceRecord = JSON.stringify(baseline, null, 2)
    if (!equal(row, existing)) updates.push(row)
  }
  console.log(
    JSON.stringify({
      apply,
      update: updates.length,
    }),
  )
  if (apply && updates.length) {
    const backup = path.resolve('.local/youtube-library-sync', at.replaceAll(':', '-'))
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
            'YouTube consent copy — owner request 23 October 2026',
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
    await db.query(
      `INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail)
       VALUES('content','youtube-library-2026-10-23','YouTube external-service consent copy',$1,'admin',$2::jsonb)`,
      [
        actor.id,
        JSON.stringify({
          updated: updates.length,
          backup,
        }),
      ],
    )
    await db.query(
      "UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'",
    )
    await db.query('COMMIT')
    committed = true
    console.log('Local consent copy reconciled; previous records backed up and revisioned.')
  }
} finally {
  if (!committed) await db.query('ROLLBACK')
  db.release()
  await pool.end()
}
