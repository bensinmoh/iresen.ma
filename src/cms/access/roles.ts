import type { Access, FieldAccess } from 'payload'

export const roles = ['admin', 'editor'] as const
export type EditorialRole = (typeof roles)[number]

type Actor = { id?: unknown; role?: unknown; collection?: string } | null | undefined

export function isStaff(user: Actor): boolean {
  // Compatibility for the existing server-only, explicitly gated project review reader.
  // This is not an assignable account role and cannot publish.
  const projectReviewReader =
    user?.id === 0 &&
    user?.collection === 'users' &&
    user?.role === 'publisher' &&
    process.env.PROJECTS_LOCAL_REVIEW === 'true' &&
    process.env.PUBLIC_RELEASE !== 'true' &&
    (process.env.NODE_ENV !== 'production' || process.env.CMS_LOCAL_REVIEW === 'true')
  return Boolean(user && (roles.includes(user.role as EditorialRole) || projectReviewReader))
}

export function isAdministrator(user: Actor): boolean {
  return user?.role === 'admin'
}

export function canPublish(user: Actor): boolean {
  return user?.role === 'admin'
}

export const staffOnly: Access = ({ req }) => isStaff(req.user)
export const administratorsOnly: Access = ({ req }) => isAdministrator(req.user)
export const publishersOnly: Access = ({ req }) => canPublish(req.user)
export const staffField: FieldAccess = ({ req }) => isStaff(req.user)
export const publisherField: FieldAccess = ({ req }) => canPublish(req.user)
