import type { Field } from 'payload'

import { publisherField, staffField } from '../access/roles'

export const publicationFields: Field[] = [
  {
    name: 'publicationStatus',
    type: 'select',
    localized: true,
    defaultValue: 'draft',
    required: true,
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Ready for review', value: 'review' },
      { label: 'Approved for publication', value: 'published' },
    ],
    admin: {
      position: 'sidebar',
      description:
        'Approval applies only to the selected language. A publisher then publishes the revision.',
    },
  },
  {
    name: 'visibility',
    type: 'select',
    defaultValue: 'private',
    required: true,
    options: ['private', 'public'],
    access: { create: publisherField, update: publisherField },
    admin: { position: 'sidebar' },
  },
  {
    name: 'editorialOwner',
    type: 'relationship',
    relationTo: 'users',
    access: { read: staffField },
    admin: { position: 'sidebar' },
  },
  {
    name: 'internalNotes',
    type: 'textarea',
    access: { read: staffField },
    admin: { description: 'Private editorial notes; excluded from public API responses.' },
  },
]

export const textContentFields: Field[] = [
  { name: 'title', type: 'text', localized: true },
  {
    name: 'slug',
    type: 'text',
    localized: true,
    index: true,
    admin: {
      description: 'Language-specific URL segment. Redirect management is a later milestone.',
    },
    validate: (value: unknown) =>
      value === undefined ||
      value === null ||
      value === '' ||
      (typeof value === 'string' && /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(value)) ||
      'Use letters and numbers separated by single hyphens.',
  },
  { name: 'summary', type: 'textarea', localized: true },
  { name: 'body', type: 'richText', localized: true },
  {
    name: 'seo',
    type: 'group',
    localized: true,
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
    ],
  },
  ...publicationFields,
]
