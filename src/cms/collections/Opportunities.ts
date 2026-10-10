import { APIError, type CollectionConfig } from 'payload'
import { constrainContentOperation, publishedContentOnly } from '../access/public-content'
import { administratorsOnly, canPublish, isStaff, staffOnly } from '../access/roles'
import { publicationFields } from './fields'
import { hasText, isContentLocale } from '@/lib/content/publication'

export const Opportunities: CollectionConfig = {
  slug: 'opportunities',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'reference', 'state', 'isDemo', 'publicationStatus'],
  },
  access: {
    create: staffOnly,
    read: async (args) => {
      const access = await publishedContentOnly(args)
      if (isStaff(args.req.user)) return access
      if (!access) return false
      return {
        and: [
          typeof access === 'object' ? access : {},
          { isDemo: { equals: false } },
          { state: { equals: 'open' } },
        ],
      }
    },
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
        if (!isContentLocale(req.locale)) throw new APIError('Select a supported locale.', 400)
        const current = { ...originalDoc, ...data }
        if (!canPublish(req.user)) {
          if (data._status === 'published' || data.publicationStatus === 'published')
            throw new APIError('Only publishers can publish.', 403)
          data._status = 'draft'
          if (current.publicationStatus === 'published') data.publicationStatus = 'draft'
        }
        if (
          current.isDemo &&
          (current._status === 'published' ||
            current.publicationStatus === 'published' ||
            current.visibility === 'public')
        )
          throw new APIError('Design examples must remain private drafts.', 400)
        if (current.publicationStatus === 'published') {
          const required = [
            'title',
            'department',
            'location',
            'summary',
            'experience',
            'availability',
            'missions',
            'profile',
          ]
          if (required.some((key) => !hasText(current[key])))
            throw new APIError('Complete the current translation before publication.', 400)
        }
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
    {
      name: 'isDemo',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Private design example. Never publish. Remove only when the owner requests it.',
      },
    },
    {
      name: 'state',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: ['open', 'closed'],
    },
    {
      name: 'contract',
      type: 'select',
      required: true,
      options: ['CDI', 'CDD', 'internship', 'apprenticeship'],
    },
    ...['title', 'department', 'location', 'experience', 'availability'].map((name) => ({
      name,
      type: 'text' as const,
      localized: true,
    })),
    ...['summary', 'missions', 'profile'].map((name) => ({
      name,
      type: 'textarea' as const,
      localized: true,
      admin: { description: name === 'summary' ? 'Offer overview.' : 'One item per line.' },
    })),
    ...publicationFields,
  ],
}
