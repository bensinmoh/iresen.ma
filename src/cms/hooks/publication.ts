import { APIError, type CollectionBeforeChangeHook } from 'payload'

import { isContentLocale, missingPublicationFields } from '../../lib/content/publication'
import { isNewsSlug } from '../../lib/content/routes'
import { canPublish, isStaff } from '../access/roles'

export function publicationGuard(kind: 'pages' | 'news' | 'media'): CollectionBeforeChangeHook {
  return ({ data, originalDoc, req }) => {
    if (!isStaff(req.user)) throw new APIError('Authentication is required to edit content.', 403)
    if (!isContentLocale(req.locale))
      throw new APIError('Edit one supported content locale at a time.', 400)

    const current = { ...originalDoc, ...data } as Record<string, unknown>
    const explicitlyPublishing =
      data._status === 'published' || data.publicationStatus === 'published'

    if (!canPublish(req.user)) {
      if (explicitlyPublishing)
        throw new APIError('Only a publisher or administrator can publish content.', 403)
      data._status = 'draft'
      // Previously approved copy becomes a new draft; it never replaces the live revision.
      if (current.publicationStatus === 'published') data.publicationStatus = 'draft'
      return data
    }

    if (current.publicationStatus === 'published') {
      const missing = missingPublicationFields(current, kind)
      if (kind === 'news' && !isNewsSlug(current.slug, req.locale) && !missing.includes('slug'))
        missing.push('slug (invalid or reserved)')
      if (missing.length) {
        throw new APIError(
          `Complete the ${req.locale} translation before publication: ${missing.join(', ')}.`,
          400,
        )
      }
    }
    return data
  }
}
