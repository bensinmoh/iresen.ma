import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { User } from '../src/payload-types'
import { searchDatabase } from '../src/lib/search/database'
import { input, prepared, historicalByRef } from './project-workbook-data'

if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(process.env.DATABASE_URL!).hostname))
  throw new Error('Workbook import requires a local database.')
const root = path.resolve('.local/projects/workbook-1026')
const payload = await getPayload({ config })
const db = searchDatabase()
try {
  const users = await payload.find({
    collection: 'users',
    overrideAccess: true,
    limit: 1,
    where: { role: { equals: 'admin' } },
  })
  if (!users.docs[0]) throw new Error('An existing local administrator is required')
  const actor = { ...users.docs[0], collection: 'users' as const } satisfies User & {
    collection: 'users'
  }
  const saved = await payload.find({
    collection: 'projects',
    locale: 'all',
    fallbackLocale: false,
    overrideAccess: false,
    user: actor,
    limit: 1000,
    depth: 0,
  })
  const byRef = new Map(saved.docs.map((p) => [p.reference, p]))
  for (const { row } of prepared) {
    const record = byRef.get(row.reference)
    if (record && !historicalByRef.has(row.reference) && record.sourceHash !== input.sha256)
      throw new Error(`Unrelated record collision: ${row.reference}`)
    if (
      record &&
      historicalByRef.has(row.reference) &&
      record.sourceUrl !== historicalByRef.get(row.reference)!.sourceUrl
    )
      throw new Error(`Historical source collision: ${row.reference}`)
  }
  // A private, immutable snapshot precedes any write, including note metadata.
  await mkdir(root, { recursive: true, mode: 0o700 })
  const snapshot = {
    projects: saved.docs,
    notes: (await db.query('SELECT * FROM project_notes')).rows,
  }
  const backup = path.join(root, `before-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  await writeFile(backup, JSON.stringify(snapshot, null, 2) + '\n', { mode: 0o600, flag: 'wx' })
  if (!process.argv.includes('--apply')) {
    console.log(
      `Validated ${prepared.length} rows: ${prepared.filter((p) => !byRef.has(p.row.reference)).length} new; withdrawal m-s-f. Snapshot saved. Use --apply to import.`,
    )
  } else {
    const transactionID = await payload.db.beginTransaction()
    if (transactionID == null) throw new Error('A database transaction is required')
    try {
      for (const { row, locales, shared } of prepared) {
        let id = byRef.get(row.reference)?.id
        const common = {
          ...shared,
          coordinatorPhone: null,
          sourceHash: input.sha256,
          retrievedAt: new Date().toISOString(),
          internalNotes: `Owner-supplied workbook: ${input.filename}; SHA-256 ${input.sha256}; ${input.sheet}!A${row.row}:N${row.row}. Status source: ${row.status || 'empty'}. ${row.reference === 'autoconsopv' ? 'Owner correction, 2026-10-16: AutoConsoPV is closed, superseding the empty worksheet status.' : ''} Duration source: ${row.durationSource || 'empty'}. ${row.dateNote || ''} Scientific-production columns and gender excluded. budgetMAD stores IRESEN funding, not total project cost. Historical narratives/images retained where available. EN/AR working adaptations; missing descriptions use metadata only.`,
        }
        if (!common.programme) throw new Error(`Missing programme: ${row.reference}`)
        for (const locale of ['fr', 'en', 'ar'] as const) {
          const data = {
            ...(locale === 'fr' ? common : {}),
            ...locales[locale],
            ...(locale === 'fr'
              ? { publicationStatus: 'published' as const, translationReview: 'source' as const }
              : { publicationStatus: 'review' as const, translationReview: 'pending' as const }),
            _status: 'published' as const,
          }
          // Existing French titles come from the fuller historical fiche. Worksheet descriptions can be truncated.
          if (id)
            await payload.update({
              collection: 'projects',
              id,
              locale,
              overrideAccess: false,
              user: actor,
              req: { transactionID },
              data,
            })
          else {
            const created = await payload.create({
              collection: 'projects',
              locale,
              overrideAccess: false,
              user: actor,
              req: { transactionID },
              data: {
                ...data,
                acronym: row.acronym,
                reference: row.reference,
                visibility: 'public',
                imagePath: null,
                portraitPath: null,
              },
            })
            id = created.id
          }
        }
        console.log(`Updated ${row.reference}`)
      }
      for (const reference of input.absentReferences) {
        const record = byRef.get(reference)
        if (record)
          await payload.update({
            collection: 'projects',
            id: record.id,
            overrideAccess: false,
            user: actor,
            req: { transactionID },
            data: { visibility: 'private' },
          })
      }
      await payload.db.commitTransaction(transactionID)
      console.log(
        `Imported ${prepared.length} projects atomically; m-s-f retained privately. Regenerate PDFs and rebuild search.`,
      )
    } catch (error) {
      await payload.db.rollbackTransaction(transactionID)
      throw error
    }
  }
} finally {
  await payload.destroy()
  await db.end()
}
process.exit(0)
