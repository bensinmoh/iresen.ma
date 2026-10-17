import 'server-only'
import { sql } from '@payloadcms/db-postgres'
import type { PayloadRequest } from 'payload'
import {
  createEntry,
  languages,
  modules,
  saveEntry,
  type Entry,
  type Workspace,
} from '@/lib/cms-preview/model'
import { workspaceSchema } from '@/lib/cms-preview/schema'
import { relationErrors } from '@/lib/cms-preview/connection'
import type { AuthenticatedWorkspace } from './auth'
import { WorkspaceError } from './auth'
import { sameContentShape } from './site-content'
import { retainedContentEntries, retainedContentVersion } from './retained-content'
import { readSourceEntries, syncSource } from './sources'
import { transactionDb, workspaceTransaction } from './transaction'
const iso = (value: unknown) => (value instanceof Date ? value.toISOString() : String(value))
const editable = (entry: Entry) =>
  JSON.stringify({
    module: entry.module,
    reference: entry.reference,
    shared: entry.shared,
    variants: entry.variants,
    comment: entry.comment,
    publicVariants: entry.publicVariants,
  })
export async function contentSnapshot(req: PayloadRequest): Promise<Workspace> {
  const db = transactionDb(req)
  const entries = await db.execute(
    sql`SELECT e.* FROM cms_authoring_entries e WHERE NOT EXISTS (SELECT 1 FROM cms_deleted_entries d WHERE d.entry_id=e.id) ORDER BY e.id`,
  )
  const revisions = await db.execute(
    sql`SELECT * FROM (SELECT *,row_number() OVER(PARTITION BY entry_id ORDER BY created_at DESC,id DESC) AS ordinal FROM cms_authoring_revisions) r WHERE ordinal<=30 ORDER BY created_at DESC,id DESC`,
  )
  const audits = await db.execute(
    sql`SELECT * FROM cms_private_audit WHERE scope='content' ORDER BY id DESC LIMIT 200`,
  )
  return workspaceSchema.parse({
    version: 1,
    entries: entries.rows.map((row) => ({
      id: row.id,
      module: row.module,
      reference: row.reference,
      shared: row.shared,
      variants: row.variants,
      comment: row.comment,
      updatedAt: iso(row.updated_at),
      publicVariants: row.public_variants,
      history: revisions.rows
        .filter((revision) => revision.entry_id === row.id)
        .map((revision) => ({
          id: String(revision.id),
          at: iso(revision.created_at),
          language: revision.language,
          variant: revision.variant,
          shared: revision.shared,
          note: revision.note,
        })),
      ...(row.source_collection
        ? {
            source: {
              collection: row.source_collection,
              id: Number(row.source_id),
              revision: row.source_revision,
            },
          }
        : {}),
    })),
    logs: audits.rows.map((row) => ({
      id: String(row.id),
      at: iso(row.created_at),
      action: row.action,
      resource: row.resource_id,
      actor: row.actor_role,
      kind: 'audit',
    })),
  })
}
async function storeEntry(req: PayloadRequest, entry: Entry) {
  await transactionDb(req).execute(
    sql`INSERT INTO cms_authoring_entries(id,module,reference,shared,variants,comment,public_variants,updated_at,source_collection,source_id,source_revision) VALUES(${entry.id},${entry.module},${entry.reference},${JSON.stringify(entry.shared)}::jsonb,${JSON.stringify(entry.variants)}::jsonb,${entry.comment},${JSON.stringify(entry.publicVariants)}::jsonb,${entry.updatedAt},${entry.source?.collection ?? null},${entry.source?.id ? String(entry.source.id) : null},${entry.source?.revision ?? null}) ON CONFLICT(id) DO UPDATE SET reference=excluded.reference,shared=CASE WHEN cms_authoring_entries.module='news' THEN excluded.shared || jsonb_build_object('highlight',coalesce(cms_authoring_entries.shared->>'highlight','false')) ELSE excluded.shared END,variants=excluded.variants,comment=excluded.comment,public_variants=excluded.public_variants,updated_at=excluded.updated_at,source_collection=excluded.source_collection,source_id=excluded.source_id,source_revision=excluded.source_revision`,
  )
}
export async function loadContent(auth: AuthenticatedWorkspace) {
  return workspaceTransaction(auth, 'content', undefined, async (req, revision) => {
    const sources = await readSourceEntries(req)
    const current = await contentSnapshot(req)
    const deleted = await transactionDb(req).execute(
      sql`SELECT e.id,e.module,e.reference,e.source_collection,e.source_id FROM cms_authoring_entries e JOIN cms_deleted_entries d ON d.entry_id=e.id`,
    )
    const deletedIds = new Set(deleted.rows.map((row) => String(row.id)))
    const deletedKeys = new Set(deleted.rows.map((row) => `${row.module}:${row.reference}`))
    let changed = false
    for (const source of sources) {
      if (
        deletedIds.has(source.id) ||
        deletedKeys.has(`${source.module}:${source.reference}`) ||
        deleted.rows.some(
          (row) =>
            row.source_collection === source.source?.collection &&
            String(row.source_id) === String(source.source?.id),
        )
      )
        continue
      const existing = current.entries.find(
        (entry) =>
          (entry.source?.collection === source.source?.collection &&
            entry.source?.id === source.source?.id) ||
          (!entry.source && entry.module === source.module && entry.reference === source.reference),
      )
      if (existing?.source?.revision === source.source?.revision) continue
      if (existing) {
        // A reload resolves changes made in native administration. Keep the replaced
        // authoring snapshot in the private revision history before refreshing.
        for (const locale of languages)
          await transactionDb(req).execute(
            sql`INSERT INTO cms_authoring_revisions(entry_id,language,variant,shared,note,actor_id) VALUES(${existing.id},${locale},${JSON.stringify(existing.variants[locale])}::jsonb,${JSON.stringify(existing.shared)}::jsonb,'Actualisation depuis la collection source',${auth.actor.id})`,
          )
        source.id = existing.id
        source.shared = { ...existing.shared, ...source.shared }
        for (const locale of languages)
          source.variants[locale].fields = {
            ...existing.variants[locale].fields,
            ...source.variants[locale].fields,
          }
      }
      await storeEntry(req, source)
      changed = true
    }
    // Curated records are imported once by stable identity. Never replace an
    // editor's DB revision with its old file snapshot on the next login.
    const existingIds = new Set([...current.entries.map((entry) => entry.id), ...deletedIds])
    const existingKeys = new Set(
      current.entries.map((entry) => `${entry.module}:${entry.reference}`),
    )
    for (const source of sources) existingKeys.add(`${source.module}:${source.reference}`)
    for (const key of deletedKeys) existingKeys.add(key)
    let imported = 0
    for (const entry of retainedContentEntries(new Date().toISOString())) {
      if (existingIds.has(entry.id) || existingKeys.has(`${entry.module}:${entry.reference}`)) {
        const existing = current.entries.find((value) => value.id === entry.id)
        if (existing && existing.shared._sourceVersion !== retainedContentVersion) {
          // Reconcile only untouched imported baseline metadata. Preserve every editorial change.
          const sameShared = Object.entries(entry.shared).every(
            ([key, value]) =>
              ['_sourceVersion', 'visibility'].includes(key) || existing.shared[key] === value,
          )
          if (
            sameShared &&
            existing.variants.fr.title === entry.variants.fr.title &&
            existing.variants.fr.body === entry.variants.fr.body
          )
            existing.shared.visibility = entry.shared.visibility
          existing.shared._sourceVersion = retainedContentVersion
          await storeEntry(req, existing)
          changed = true
        }
        if (existing?.publicVariants.fr && !existing.publicVariants.fr.fields._publishedShared) {
          existing.publicVariants.fr.fields._publishedShared =
            entry.publicVariants.fr?.fields._publishedShared ?? '{}'
          await storeEntry(req, existing)
          changed = true
        }
        continue
      }
      await storeEntry(req, entry)
      existingKeys.add(`${entry.module}:${entry.reference}`)
      changed = true
      imported++
    }
    if (imported)
      await transactionDb(req).execute(
        sql`INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail) VALUES('content','retained-corpora','Import des corpus conservés du site',${auth.actor.id},${auth.actor.role},${JSON.stringify({ imported })}::jsonb)`,
      )
    if (changed) {
      await transactionDb(req).execute(
        sql`UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'`,
      )
      revision++
    }
    const workspace = await contentSnapshot(req)
    // User management is supplied by authenticated Payload administration, never a generic content item.
    if (auth.actor.role !== 'admin')
      workspace.entries = workspace.entries.filter((entry) => entry.module !== 'users')
    return { workspace, revision }
  })
}
export async function writeContent(auth: AuthenticatedWorkspace, input: unknown, expected: number) {
  const parsed = workspaceSchema.safeParse(input)
  if (!parsed.success) throw new WorkspaceError('Structure du contenu invalide.')
  return workspaceTransaction(auth, 'content', expected, async (req, revision) => {
    const current = await contentSnapshot(req)
    const changed = parsed.data.entries.filter((entry) => {
      const old = current.entries.find((item) => item.id === entry.id)
      return !old || editable(old) !== editable(entry)
    })
    if (changed.length > 500)
      throw new WorkspaceError('Enregistrer au maximum 500 fiches à la fois.')
    const at = new Date().toISOString()
    for (const incoming of changed) {
      const deleted = await transactionDb(req).execute(
        sql`SELECT entry_id FROM cms_deleted_entries WHERE entry_id=${incoming.id}`,
      )
      if (deleted.rows.length)
        throw new WorkspaceError(
          'Cette fiche est dans la corbeille. La restaurer avant de la modifier.',
          409,
        )
      const before = current.entries.find((entry) => entry.id === incoming.id)
      if (
        !modules.some((definition) => definition.id === incoming.module) ||
        incoming.module === 'users'
      )
        throw new WorkspaceError('Ce module ne permet pas cette opération.', 403)
      for (const key of [
        'highlight',
        '_sourceDataset',
        '_sourceKey',
        '_sourceVersion',
        'sourceRecord',
        'catalogNamespace',
      ])
        if (
          (incoming.shared[key] ?? (key === 'highlight' ? 'false' : '')) !==
          (before?.shared[key] ?? (key === 'highlight' ? 'false' : ''))
        )
          throw new WorkspaceError('Les données originales de provenance sont en lecture seule.')
      if (before?.shared.catalogNamespace) {
        const baseline = JSON.parse(before.shared.sourceRecord)
        for (const locale of languages) {
          try {
            if (
              !sameContentShape(
                baseline[locale],
                JSON.parse(incoming.variants[locale].fields.structuredContent),
              )
            )
              throw new Error()
          } catch {
            throw new WorkspaceError(
              'Conserver la structure JSON du site : mêmes clés, types et éléments. Modifier uniquement les textes.',
            )
          }
        }
      }
      if (
        (before?.source || before?.shared._sourceDataset) &&
        before.reference !== incoming.reference
      )
        throw new WorkspaceError('La référence d’une fiche source ne peut pas changer.')
      if (before && before.module !== incoming.module)
        throw new WorkspaceError('Le type de fiche ne peut pas changer.')
      if (
        auth.actor.role !== 'admin' &&
        incoming.shared.visibility !== before?.shared.visibility &&
        incoming.shared.visibility
      )
        throw new WorkspaceError('Seul un administrateur peut modifier la visibilité.', 403)
      let working = structuredClone(before ?? createEntry(incoming.module, incoming.id, at))
      working.reference = incoming.reference
      working.comment = incoming.comment
      const sharedChanged = JSON.stringify(working.shared) !== JSON.stringify(incoming.shared)
      if (
        sharedChanged &&
        auth.actor.role === 'editor' &&
        languages.some((locale) => working.variants[locale].status === 'review')
      )
        throw new WorkspaceError(
          'L’administrateur doit terminer la revue avant de modifier les champs partagés.',
          403,
        )
      const withdrawn = languages.filter(
        (locale) => before?.publicVariants[locale] && !incoming.publicVariants[locale],
      )
      if (
        withdrawn.some(
          (locale) => auth.actor.role !== 'admin' || incoming.variants[locale].status !== 'draft',
        )
      )
        throw new WorkspaceError(
          'Seul un administrateur peut retirer une publication en brouillon.',
          403,
        )
      const affected = languages.filter(
        (locale) =>
          JSON.stringify(working.variants[locale]) !== JSON.stringify(incoming.variants[locale]) ||
          withdrawn.includes(locale),
      )
      if (!affected.length) affected.push('fr')
      for (const locale of affected) {
        const original = structuredClone(working)
        working.shared = structuredClone(incoming.shared)
        const requested = incoming.variants[locale]
        working.variants[locale] = { ...requested, status: original.variants[locale].status }
        const contentChanged =
          JSON.stringify({ ...working.variants[locale], status: 'draft' }) !==
          JSON.stringify({ ...original.variants[locale], status: 'draft' })
        const target =
          contentChanged && requested.status === original.variants[locale].status
            ? 'draft'
            : requested.status
        const related = new Map(current.entries.map((entry) => [entry.id, entry]))
        for (const entry of parsed.data.entries) related.set(entry.id, entry)
        related.set(working.id, working)
        const errors = relationErrors(working, Array.from(related.values()))
        if (errors.length) throw new WorkspaceError(errors.join(' '))
        let updated: Workspace
        try {
          updated = saveEntry(
            {
              ...current,
              entries: [
                ...current.entries.filter((entry) => entry.id !== working.id),
                ...(before ? [original] : []),
              ],
            },
            working,
            locale,
            auth.actor.role,
            at,
            target,
          )
        } catch (error) {
          throw new WorkspaceError(
            error instanceof Error ? error.message : 'Transition éditoriale refusée.',
            403,
          )
        }
        working = updated.entries.find((entry) => entry.id === working.id)!
        if (withdrawn.includes(locale)) delete working.publicVariants[locale]
        // Only changed language/metadata are projected; the source API keeps all access and publication hooks.
        working = await syncSource(working, before ? original : undefined, locale, req)
        if (working.variants[locale].status === 'published' && working.publicVariants[locale])
          working.publicVariants[locale]!.fields._publishedShared = JSON.stringify(
            Object.fromEntries(
              Object.entries(working.shared).filter(
                ([key]) => !key.startsWith('_') && key !== 'sourceRecord',
              ),
            ),
          )
        await storeEntry(req, working)
        await transactionDb(req).execute(
          sql`INSERT INTO cms_authoring_revisions(entry_id,language,variant,shared,note,actor_id,created_at) VALUES(${working.id},${locale},${JSON.stringify(working.variants[locale])}::jsonb,${JSON.stringify(working.shared)}::jsonb,${working.comment},${auth.actor.id},${at})`,
        )
        await transactionDb(req).execute(
          sql`INSERT INTO cms_private_audit(scope,resource_id,action,actor_id,actor_role,detail) VALUES('content',${working.id},${`Enregistrement ${locale} · ${working.variants[locale].status}`},${auth.actor.id},${auth.actor.role},${JSON.stringify({ locale, status: working.variants[locale].status })}::jsonb)`,
        )
      }
      current.entries = [...current.entries.filter((entry) => entry.id !== working.id), working]
    }
    if (changed.length) {
      await transactionDb(req).execute(
        sql`UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'`,
      )
      revision++
    }
    return { workspace: await contentSnapshot(req), revision }
  })
}
