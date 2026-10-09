import type { Access, Where } from 'payload'

import { isContentLocale } from '../../lib/content/publication'
import { isStaff } from './roles'
import { publishedContentOnly } from './public-content'

/**
 * Payload 3.90's static-file check calls db.findOne without its locale and can
 * fall back to version rows. Resolve anonymous bytes through canonical public
 * metadata first, then return a boolean so neither raw lookup is used.
 */
export const publishedMediaOnly: Access = async (args) => {
  if (!args.isReadingStaticFile) return publishedContentOnly(args)
  const { req, data } = args
  req.fallbackLocale = false
  if (isStaff(req.user)) return true
  if (!isContentLocale(req.locale) || typeof data?.filename !== 'string' || !data.filename)
    return false

  const filenames: Where[] = [{ filename: { equals: data.filename } }]
  const upload = req.payload.collections.media.config.upload
  if (upload && typeof upload === 'object' && Array.isArray(upload.imageSizes)) {
    for (const size of upload.imageSizes)
      filenames.push({ [`sizes.${size.name}.filename`]: { equals: data.filename } })
  }
  const result = await req.payload.find({
    collection: 'media',
    locale: req.locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1,
    req,
    select: { filename: true },
    where: { or: filenames },
  })
  return result.docs.length === 1
}
