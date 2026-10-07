import type { CollectionConfig } from 'payload'

import { constrainContentOperation, publishedContentOnly } from '../access/public-content'
import { administratorsOnly, staffOnly } from '../access/roles'
import { publicationGuard } from '../hooks/publication'
import { textContentFields } from './fields'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'publicationStatus', 'updatedAt'],
  },
  access: {
    create: staffOnly,
    read: publishedContentOnly,
    update: staffOnly,
    delete: administratorsOnly,
    readVersions: staffOnly,
  },
  versions: { drafts: true, maxPerDoc: 30 },
  hooks: { beforeOperation: [constrainContentOperation], beforeChange: [publicationGuard('news')] },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'news',
      options: ['news', 'press-release'],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { description: 'Editorial publication date; scheduling is not enabled.' },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'sourceAttribution', type: 'text', localized: true },
    ...textContentFields,
  ],
}
