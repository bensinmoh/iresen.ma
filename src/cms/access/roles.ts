import type { Access, FieldAccess } from 'payload'

export const roles = ['admin', 'editor', 'publisher'] as const
export type EditorialRole = (typeof roles)[number]

type Actor = { role?: unknown; collection?: string } | null | undefined

export function isStaff(user: Actor): boolean {
  return Boolean(user && roles.includes(user.role as EditorialRole))
}

export function isAdministrator(user: Actor): boolean {
  return user?.role === 'admin'
}

export function canPublish(user: Actor): boolean {
  return user?.role === 'admin' || user?.role === 'publisher'
}

export const staffOnly: Access = ({ req }) => isStaff(req.user)
export const administratorsOnly: Access = ({ req }) => isAdministrator(req.user)
export const publishersOnly: Access = ({ req }) => canPublish(req.user)
export const staffField: FieldAccess = ({ req }) => isStaff(req.user)
export const publisherField: FieldAccess = ({ req }) => canPublish(req.user)
