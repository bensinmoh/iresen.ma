import { APIError, type CollectionConfig } from 'payload'
import { constrainContentOperation, publishedContentOnly } from '../access/public-content'
import { administratorsOnly, canPublish, isStaff, staffField, staffOnly } from '../access/roles'
import { publicationFields } from './fields'
import { hasText } from '@/lib/content/publication'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Projet', plural: 'Projets' },
  admin: {
    useAsTitle: 'acronym',
    defaultColumns: ['acronym', 'title', 'programme', 'publicationStatus'],
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
    beforeChange: [
      ({ data, originalDoc, req }) => {
        if (!isStaff(req.user)) throw new APIError('Authentication is required.', 403)
        if (originalDoc?.reference && data.reference && originalDoc.reference !== data.reference)
          throw new APIError('The stable project reference cannot be changed.', 400)
        const current = { ...originalDoc, ...data }
        if (
          !canPublish(req.user) &&
          (data._status === 'published' || data.publicationStatus === 'published')
        )
          throw new APIError('Only an administrator can publish.', 403)
        if (
          current._status === 'published' &&
          current.visibility === 'public' &&
          current.publicationStatus === 'published' &&
          (!hasText(current.title) || !hasText(current.description) || !hasText(current.acronym))
        )
          throw new APIError('Complete the title, description and acronym before publication.', 400)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      validate: (value: unknown) =>
        (typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) ||
        'Use a stable lowercase reference.',
    },
    { name: 'acronym', type: 'text', required: true },
    ...[
      'title',
      'description',
      'summary',
      'theme',
      'startText',
      'location',
      'hostingPlatform',
      'coordinatorName',
      'coordinatorAffiliation',
      'objectives',
      'consortium',
    ].map((name) => ({ name, type: 'textarea' as const, localized: true })),
    { name: 'programme', type: 'text' },
    { name: 'selectionCallReference', type: 'text' },
    { name: 'launchYear', type: 'number', min: 1900, max: 2100 },
    {
      name: 'domain',
      type: 'select',
      options: [
        'thermal',
        'grids',
        'efficiency',
        'photovoltaic',
        'wind',
        'hydrogen',
        'storage',
        'biomass',
        'materials',
        'water',
        'other',
      ],
    },
    { name: 'projectStatus', type: 'select', options: ['active', 'completed', 'planned'] },
    { name: 'durationMonths', type: 'number', min: 0 },
    { name: 'budgetMAD', type: 'number', min: 0 },
    { name: 'coordinatorEmail', type: 'email' },
    { name: 'coordinatorPhone', type: 'text' },
    ...['imagePath', 'portraitPath'].map((name) => ({
      name,
      type: 'text' as const,
      validate: (value: unknown) =>
        !value ||
        (typeof value === 'string' &&
          /^\/api\/projects\/[a-z0-9-]+\/asset\/[a-z0-9-]+$/.test(value)) ||
        'Use the access-controlled project asset URL.',
    })),
    {
      name: 'consortiumLogos',
      type: 'json',
      admin: { description: 'Verified partner names and controlled local asset URLs only.' },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      validate: (value: unknown) =>
        !value ||
        (typeof value === 'string' &&
          /^https:\/\/iresen\.org\/projects\/[a-z0-9-]+\/$/.test(value)) ||
        'Use the original IRESEN project URL.',
    },
    { name: 'sourceHash', type: 'text', access: { read: staffField } },
    { name: 'retrievedAt', type: 'date', access: { read: staffField } },
    {
      name: 'translationReview',
      type: 'select',
      localized: true,
      defaultValue: 'pending',
      options: ['source', 'pending', 'approved'],
      access: { read: staffField },
    },
    ...publicationFields,
  ],
}
