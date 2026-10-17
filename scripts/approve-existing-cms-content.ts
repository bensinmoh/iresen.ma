import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createLocalReq, getPayload } from 'payload'
import { sql, type PostgresAdapter } from '@payloadcms/db-postgres'
import config from '../src/payload.config'
import translations from '../src/data/career-offers-translations.json' with { type: 'json' }
import type { Entry } from '../src/lib/cms-preview/model'
import { searchDatabase } from '../src/lib/search/database'
import { rebuildSearchIndex } from '../src/lib/search/indexer'

// Explicit owner request, 16 October 2026: adopt the existing site corpus as the
// validated CMS baseline, complete the two offers, and discard the unused audit draft.
// This command never changes visibility, removes records/files or invents missing facts.
const hostname = new URL(process.env.DATABASE_URL!).hostname
if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname))
  throw new Error('Existing-content approval is restricted to the local database.')
const locales = ['fr', 'en', 'ar'] as const
type Row = {
  id: string
  module: string
  reference: string
  shared: Entry['shared']
  variants: Entry['variants']
  public_variants: Entry['publicVariants']
  source_collection: NonNullable<Entry['source']>['collection'] | null
  source_id: string | null
  source_revision: string | null
}
const payload = await getPayload({ config })
let transaction: number | string | null = null
try {
  const users = await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 1,
    sort: 'id',
    overrideAccess: true,
  })
  const user = users.docs[0]
  if (!user) throw new Error('An existing administrator is required.')
  const actor = { ...user, collection: 'users' as const }
  transaction = await payload.db.beginTransaction()
  if (transaction === null) throw new Error('A database transaction is required.')
  const req = await createLocalReq({ user: actor, locale: 'fr', fallbackLocale: false }, payload)
  req.transactionID = transaction
  const db = (payload.db as unknown as PostgresAdapter).sessions[String(transaction)].db
  const meta = await db.execute(
    sql`SELECT revision FROM cms_workspace_meta WHERE scope='content' FOR UPDATE`,
  )
  const result = await db.execute(sql`SELECT * FROM cms_authoring_entries ORDER BY id`)
  const rows = result.rows as unknown as Row[]
  if (!rows.length) throw new Error('No existing CMS corpus to approve.')
  const draft = rows.find((row) => row.id === 'retained-pages-catalog-Institute')
  if (draft?.variants.fr.status === 'draft') {
    const published = draft.public_variants.fr
    if (
      !published ||
      draft.variants.fr.title !== published.title ||
      draft.variants.fr.body !== published.body ||
      JSON.stringify(draft.variants.fr.fields.structuredContent) !==
        JSON.stringify(published.fields.structuredContent)
    )
      throw new Error('The Institute draft contains changes; preserve it for review.')
  }
  const missing = rows.filter((row) => locales.some((locale) => !row.variants[locale].title.trim()))
  if (
    missing.some((row) => row.module !== 'careers' || !Object.hasOwn(translations, row.reference))
  )
    throw new Error('Unexpected missing translations; audit before approval.')
  const unknownDrafts = rows.filter((row) => row.variants.fr.status === 'draft' && row !== draft)
  if (unknownDrafts.length) throw new Error('Other draft records must be reviewed before approval.')
  const needsApproval =
    rows.some((row) => locales.some((locale) => row.variants[locale].status !== 'published')) ||
    missing.length > 0
  console.log(
    JSON.stringify({
      entries: rows.length,
      missingTranslations: missing.map((row) => row.reference),
      unusedAuditDraft: draft?.variants.fr.status === 'draft',
      revision: meta.rows[0]?.revision,
      apply: process.argv.includes('--apply-existing-content-approval'),
    }),
  )
  if (!process.argv.includes('--apply-existing-content-approval') || !needsApproval) {
    await payload.db.rollbackTransaction(transaction)
    transaction = null
  } else {
    const at = new Date().toISOString()
    const backup = path.resolve(
      '.local/cms-finalization',
      `baseline-approval-${at.replaceAll(':', '-')}`,
    )
    await mkdir(backup, { recursive: true, mode: 0o700 })
    const native = []
    for (const collection of ['projects', 'opportunities'] as const) {
      const docs = await payload.find({
        collection,
        locale: 'all',
        fallbackLocale: false,
        draft: true,
        depth: 0,
        pagination: false,
        overrideAccess: false,
        user: actor,
        req,
      })
      native.push({ collection, docs: docs.docs })
    }
    await writeFile(
      path.join(backup, 'before.json'),
      JSON.stringify({ at, meta: meta.rows, rows, native }),
      { mode: 0o600 },
    )
    let approved = 0
    for (const row of rows) {
      const before = structuredClone(row)
      const offer = translations[row.reference as keyof typeof translations]
      if (row.module === 'careers' && offer) {
        for (const locale of ['en', 'ar'] as const) {
          const text = offer[locale]
          row.variants[locale] = {
            ...row.variants[locale],
            title: text.title,
            body: text.summary,
            fields: {
              ...row.variants[locale].fields,
              department: text.department,
              place: text.location,
              criteria: text.profile,
              missions: text.missions,
              experience: text.experience,
              availability: text.availability,
            },
          }
        }
      }
      if (row === draft && row.variants.fr.status === 'draft') {
        row.variants.fr = structuredClone(row.public_variants.fr!)
        delete row.variants.fr.fields._publishedShared
      }
      if (row.source_collection === 'projects' || row.source_collection === 'opportunities') {
        const collection = row.source_collection
        const current = await payload.findByID({
          collection,
          id: Number(row.source_id),
          locale: 'fr',
          fallbackLocale: false,
          draft: true,
          overrideAccess: false,
          user: actor,
          req,
        })
        if (current.updatedAt !== row.source_revision)
          throw new Error(`Reload changed source ${row.id} before approval.`)
        for (const locale of locales) {
          const text = offer && locale !== 'fr' ? offer[locale] : undefined
          const update = await payload.update({
            collection,
            id: Number(row.source_id),
            locale,
            fallbackLocale: false,
            draft: false,
            overrideAccess: false,
            user: actor,
            req,
            data: {
              ...(collection === 'projects' && locale !== 'fr'
                ? { translationReview: 'approved' as const }
                : {}),
              ...(collection === 'opportunities' && text ? text : {}),
              publicationStatus: 'published',
              _status: 'published',
            },
          })
          row.source_revision = update.updatedAt
        }
      }
      for (const locale of locales) {
        const variant = row.variants[locale]
        if (!variant.title.trim()) throw new Error(`Missing ${locale} title in ${row.id}`)
        if (
          JSON.stringify(before.variants[locale]) !== JSON.stringify(variant) ||
          variant.status !== 'published'
        ) {
          await db.execute(
            sql`INSERT INTO cms_authoring_revisions(entry_id,language,variant,shared,note,actor_id) VALUES(${row.id},${locale},${JSON.stringify(before.variants[locale])}::jsonb,${JSON.stringify(before.shared)}::jsonb,'Validation du corpus existant demandée par le propriétaire le 16 octobre 2026',${user.id})`,
          )
        }
        variant.status = 'published'
        row.public_variants[locale] = {
          ...structuredClone(variant),
          fields: { ...variant.fields, _publishedShared: JSON.stringify(row.shared) },
        }
      }
      await db.execute(
        sql`UPDATE cms_authoring_entries SET variants=${JSON.stringify(row.variants)}::jsonb,public_variants=${JSON.stringify(row.public_variants)}::jsonb,source_revision=${row.source_revision},updated_at=${at} WHERE id=${row.id}`,
      )
      await db.execute(
        sql`INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail) VALUES('content',${row.id},'Validation du corpus existant',${user.id},'admin',${JSON.stringify({ ownerRequest: '2026-10-16', locales, visibilityPreserved: row.shared.visibility, restoredUnusedDraft: row === draft && before.variants.fr.status === 'draft' })}::jsonb)`,
      )
      approved++
      if (approved % 250 === 0) console.log(`Prepared ${approved}/${rows.length}`)
    }
    await db.execute(
      sql`UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'`,
    )
    await payload.db.commitTransaction(transaction)
    transaction = null
    console.log(
      `Approved ${approved} existing records in FR/EN/AR; private visibility preserved. Backup: ${backup}`,
    )
    console.log(`Search rebuild jobs processed by this command: ${await rebuildSearchIndex()}`)
  }
} catch (error) {
  if (transaction !== null) await payload.db.rollbackTransaction(transaction)
  throw error
} finally {
  await payload.destroy()
  await searchDatabase().end()
}
process.exit(0)
