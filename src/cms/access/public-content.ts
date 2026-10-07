import type { Access, CollectionBeforeOperationHook, Where } from 'payload'

import { isContentLocale } from '../../lib/content/publication'
import { canPublish, isStaff } from './roles'

/** Localized query paths are evaluated by Payload against req.locale. */
export const publishedContentOnly: Access = ({ req }) => {
  req.fallbackLocale = false
  if (isStaff(req.user)) return true
  if (!isContentLocale(req.locale)) return false
  const query: Where = {
    and: [
      { _status: { equals: 'published' } },
      { visibility: { equals: 'public' } },
      { publicationStatus: { equals: 'published' } },
    ],
  }
  return query
}

/** Applies to REST and Local API, including caller-supplied fallback/draft flags. */
export const constrainContentOperation: CollectionBeforeOperationHook = ({
  args,
  operation,
  req,
}) => {
  req.fallbackLocale = false
  if ('fallbackLocale' in args) args.fallbackLocale = false

  if (
    !isStaff(req.user) &&
    (operation === 'read' || operation === 'count' || operation === 'readDistinct')
  ) {
    if ('draft' in args) args.draft = false
  }

  if (
    isStaff(req.user) &&
    !canPublish(req.user) &&
    (operation === 'create' || operation === 'update')
  ) {
    // Editors write revision drafts, preserving the current published document.
    if ('draft' in args) args.draft = true
    else Object.assign(args, { draft: true })
  }
  return args
}
