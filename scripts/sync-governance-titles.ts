import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Pool } from 'pg'
import type { Entry } from '../src/lib/cms-preview/model'

// Owner-requested leadership corrections; preserve all publication states and unrelated edits.
const host = new URL(process.env.DATABASE_URL!).hostname
if (!['localhost', '127.0.0.1', '[::1]'].includes(host))
  throw new Error('Governance-title synchronization is restricted to the local database.')
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
  const replacements = [
    ['Directrice Stratégie, Gouvernance & Organisation', 'Stratégie, Gouvernance & Organisation'],
    ['Chef du Département IT & Systèmes d’Information', 'IT & Systèmes d’Information'],
    [
      'Directeur du Développement des Plateformes et des Projets Structurants',
      'Directeur du Développement des Plateformes Technologiques & Industrielles',
    ],
    [
      'directeur du développement des plateformes et des projets structurants',
      'directeur du développement des plateformes technologiques et industrielles',
    ],
    ['Director of Strategy, Governance & Organisation', 'Strategy, Governance & Organisation'],
    ['Head of IT & Information Systems Department', 'IT & Information Systems'],
    [
      'Director of Platform Development and Structuring Projects',
      'Director of Technological & Industrial Platforms Development',
    ],
    [
      'Director of Platforms Development and Strategic Projects',
      'Director of Technological & Industrial Platforms Development',
    ],
    ['مديرة الاستراتيجية والحكامة والتنظيم', 'الاستراتيجية والحكامة والتنظيم'],
    ['رئيس قسم تكنولوجيا المعلومات ونظم المعلومات', 'تكنولوجيا المعلومات ونظم المعلومات'],
    ['مدير تطوير المنصات والمشاريع المهيكلة', 'مدير تطوير المنصات التكنولوجية والصناعية'],
  ] as const
  const result = await db.query<Row>(
    `SELECT * FROM cms_authoring_entries WHERE
      (module='organigram' AND reference IN ('imane','jamaleddine','ayoub'))
      OR shared->>'catalogNamespace' IN ('Governance','PageSections')
      OR (module='pages' AND shared->>'pageId'='governance') FOR UPDATE`,
  )
  const at = new Date().toISOString()
  const updates: Row[] = []
  for (const existing of result.rows) {
    let text = JSON.stringify(existing)
    for (const [before, after] of replacements) text = text.replaceAll(before, after)
    const row = JSON.parse(text) as Row
    if (!equal(row, existing)) updates.push(row)
  }
  console.log(
    JSON.stringify({
      apply,
      update: updates.length,
    }),
  )
  if (apply && updates.length) {
    const backup = path.resolve('.local/governance-title-sync', at.replaceAll(':', '-'))
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
            'Governance titles — owner request 2 November 2026',
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
       VALUES('content','governance-titles-2026-11-02','Owner-corrected governance titles',$1,'admin',$2::jsonb)`,
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
    console.log('Local governance titles reconciled; previous records backed up and revisioned.')
  }
} finally {
  if (!committed) await db.query('ROLLBACK')
  db.release()
  await pool.end()
}
