import path from 'node:path'

import type { CollectionConfig } from 'payload'

import { constrainContentOperation } from '../access/public-content'
import { publishedMediaOnly } from '../access/public-media'
import { administratorsOnly, staffOnly } from '../access/roles'
import { publicationGuard } from '../hooks/publication'
import { publicationFields } from './fields'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'title' },
  access: {
    create: staffOnly,
    read: publishedMediaOnly,
    update: staffOnly,
    delete: administratorsOnly,
    readVersions: staffOnly,
  },
  versions: { drafts: true, maxPerDoc: 30 },
  upload: {
    staticDir: path.resolve(process.cwd(), '.local/uploads'),
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'application/pdf',
      'video/mp4',
      'video/webm',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    pasteURL: false,
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'private, no-store')
      headers.set('X-Content-Type-Options', 'nosniff')
      return headers
    },
  },
  hooks: {
    beforeOperation: [constrainContentOperation],
    beforeChange: [publicationGuard('media')],
    afterRead: [
      ({ doc, req }) => {
        // The guarded file endpoint needs the same locale as the approved metadata.
        if (doc.url && req.locale && req.locale !== 'all') {
          const separator = String(doc.url).includes('?') ? '&' : '?'
          if (!String(doc.url).includes('locale=')) {
            doc.url = `${String(doc.url)}${separator}locale=${encodeURIComponent(req.locale)}`
          }
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', localized: true },
    { name: 'alt', type: 'text', localized: true },
    { name: 'caption', type: 'textarea', localized: true },
    {
      name: 'searchText',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'Public searchable transcript or document text. Add reviewed text for audio, video, scans and files without automatic extraction. Never put private editorial notes here.',
      },
    },
    {
      name: 'rights',
      type: 'textarea',
      admin: { description: 'Record approved usage rights before making a file public.' },
    },
    { name: 'credit', type: 'text' },
    ...publicationFields,
  ],
}
