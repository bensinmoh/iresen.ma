// Shared Node/server and indexing CLI query; never included in client bundles.
import { getPayload } from 'payload'
import config from '@/payload.config'
/** Same public gates and reference deduplication as the calls catalogue. */
export async function totalPublicCalls(archiveReferences: string[]) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'calls',
    locale: 'fr',
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 0,
    pagination: false,
    select: { reference: true },
  })
  return new Set([...archiveReferences, ...result.docs.map((call) => call.reference)]).size
}
