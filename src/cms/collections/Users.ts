import { APIError, type CollectionConfig, type FieldAccess } from 'payload'

import { administratorsOnly, isAdministrator, isStaff, roles } from '../access/roles'

const protectRole: FieldAccess = ({ req }) =>
  isAdministrator(req.user) || req.context.bootstrapInitialAdministrator === true

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: {
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600000,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  access: {
    admin: ({ req }) => isStaff(req.user),
    create: administratorsOnly,
    read: ({ req }) =>
      isAdministrator(req.user) || (isStaff(req.user) ? { id: { equals: req.user!.id } } : false),
    update: ({ req }) =>
      isAdministrator(req.user) || (isStaff(req.user) ? { id: { equals: req.user!.id } } : false),
    delete: administratorsOnly,
    unlock: administratorsOnly,
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        if (operation === 'create' && !isAdministrator(req.user)) {
          // Payload's first-user endpoint can bypass collection create access.
          // This server-side hook closes that path and permits only the local bootstrap script.
          if (req.context.bootstrapInitialAdministrator !== true || data.role !== 'admin') {
            throw new APIError(
              'Account creation requires an administrator. Use the local script for the first account.',
              403,
            )
          }
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            overrideAccess: true,
            req,
          })
          if (totalDocs !== 0)
            throw new APIError('The first administrator has already been created.', 403)
        }
        if (
          operation === 'update' &&
          !isAdministrator(req.user) &&
          data.role !== undefined &&
          data.role !== originalDoc.role
        ) {
          throw new APIError('Only an administrator can change account roles.', 403)
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [...roles],
      access: { create: protectRole, update: protectRole },
    },
  ],
}
