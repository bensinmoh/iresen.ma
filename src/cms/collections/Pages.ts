import type { CollectionConfig } from 'payload'

import { constrainContentOperation, publishedContentOnly } from '../access/public-content'
import { administratorsOnly, staffOnly } from '../access/roles'
import { publicationGuard } from '../hooks/publication'
import { textContentFields } from './fields'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['pageId', 'title', 'publicationStatus', 'updatedAt'],
  },
  access: {
    create: staffOnly,
    read: publishedContentOnly,
    update: staffOnly,
    delete: administratorsOnly,
    readVersions: staffOnly,
  },
  versions: { drafts: true, maxPerDoc: 30 },
  hooks: {
    beforeOperation: [constrainContentOperation],
    beforeChange: [publicationGuard('pages')],
  },
  fields: [
    {
      name: 'pageId',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Stable internal page identifier, independent of translated URLs.' },
    },
    ...textContentFields,
  ],
}
