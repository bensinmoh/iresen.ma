import { cache } from 'react'
import { getPayload } from 'payload'
import config from '../payload.config'

/** One canonical public roster across locales; request-local reuse, no stale global total. */
export const totalProjects = cache(async (): Promise<number | null> => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.count({
      collection: 'projects',
      locale: 'fr',
      overrideAccess: false,
      where: {
        and: [
          { visibility: { equals: 'public' } },
          { _status: { equals: 'published' } },
          { publicationStatus: { equals: 'published' } },
          { title: { exists: true, not_equals: '' } },
          { description: { exists: true, not_equals: '' } },
        ],
      },
    })
    return result.totalDocs
  } catch {
    return null
  }
})
