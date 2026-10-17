import 'server-only'
import { createHash } from 'node:crypto'
import { sql } from '@payloadcms/db-postgres'
import type { PayloadRequest } from 'payload'
import { languages, modules, statusLabels, type Entry } from '@/lib/cms-preview/model'
import { deletionReferences, type DeleteImpact } from '@/lib/cms-preview/delete-impact'
import { type AuthenticatedWorkspace, WorkspaceError } from './auth'
import { contentSnapshot } from './content'
import { transactionDb, workspaceTransaction } from './transaction'

export async function analyzeDeletion(
  req: PayloadRequest,
  entry: Entry,
  entries: Entry[],
  revision: number,
): Promise<DeleteImpact> {
  const { inbound, outgoing } = deletionReferences(entry, entries)
  // Native uploads may have been changed outside the authoring workspace.
  if (entry.source?.collection === 'media') {
    for (const { collection, field, label } of [
      { collection: 'news' as const, field: 'heroImage', label: 'Photo / miniature' },
      {
        collection: 'calls' as const,
        field: 'conditionsDocument',
        label: 'Conditions / termes de référence',
      },
    ])
      for (const locale of languages)
        for (const draft of [true, false]) {
          let page = 1
          let more = true
          while (more) {
            const result = await req.payload.find({
              collection,
              locale,
              fallbackLocale: false,
              overrideAccess: false,
              user: req.user,
              req,
              draft,
              where: { [field]: { equals: entry.source.id } },
              depth: 0,
              limit: 100,
              page,
            })
            for (const doc of result.docs) {
              const id = `${collection}-${doc.id}`
              const existing = inbound.find((ref) => ref.id === id)
              if (existing) {
                if (!existing.fields.includes(label)) existing.fields.push(label)
              } else
                inbound.push({
                  id,
                  title: String(doc.title || id),
                  module: modules.find((module) => module.id === collection)?.label || collection,
                  fields: [label],
                })
            }
            more = result.hasNextPage
            page++
          }
        }
  }
  const applications = await transactionDb(req).execute(
    sql`SELECT count(*)::integer AS count FROM cms_applications WHERE offer_entry_id=${entry.id}`,
  )
  const count = Number(applications.rows[0]?.count ?? 0)
  const blockers: string[] = []
  if (entry.module === 'news' && entry.shared.highlight === 'true')
    blockers.push(
      'Cet article est à la une. Choisir un autre article à la une avant de le supprimer.',
    )
  if (inbound.length)
    blockers.push(
      `Retirer les liens des ${inbound.length} fiche(s) qui utilisent ce contenu avant de le supprimer.`,
    )
  if (count)
    blockers.push(
      `Cette offre possède ${count} candidature(s). Clôturer l’offre pour conserver les dossiers ; sa suppression est bloquée.`,
    )
  if (entry.module === 'users') blockers.push('Les comptes se gèrent dans Utilisateurs et droits.')
  const impact = {
    id: entry.id,
    title: entry.variants.fr.title || entry.reference,
    module: modules.find((module) => module.id === entry.module)?.label || entry.module,
    revision,
    languages: languages.map((language) => ({
      language,
      status: statusLabels[entry.variants[language].status],
      published: Boolean(entry.publicVariants[language]) && entry.shared.visibility === 'public',
    })),
    inbound: inbound.sort((a, b) => a.id.localeCompare(b.id)),
    outgoing: outgoing.sort((a, b) => a.id.localeCompare(b.id)),
    applications: count,
    effects: [
      'Retrait des listes actives, des publications dynamiques et de la recherche publique, dans les trois langues.',
      ...(entry.source
        ? ['Sa source CMS sera conservée, rendue privée et remise en brouillon.']
        : []),
      'Les fichiers, l’historique et les fiches liées seront conservés : aucune suppression en cascade.',
      'Les pages et sections structurelles du site ainsi que les fichiers statiques existants ne sont pas supprimés.',
      'La restauration sera possible en brouillon privé, avec une nouvelle validation avant publication.',
    ],
    blockers,
  }
  return {
    ...impact,
    token: createHash('sha256').update(JSON.stringify({ impact, entry })).digest('hex'),
  }
}
export async function deletionImpact(auth: AuthenticatedWorkspace, id: string, revision: number) {
  if (auth.actor.role !== 'admin')
    throw new WorkspaceError('Suppression réservée à l’administrateur.', 403)
  return workspaceTransaction(auth, 'content', revision, async (req, current) => {
    const workspace = await contentSnapshot(req)
    const entry = workspace.entries.find((entry) => entry.id === id)
    if (!entry) throw new WorkspaceError('Fiche introuvable. Recharger la liste.', 404)
    return analyzeDeletion(req, entry, workspace.entries, current)
  })
}
