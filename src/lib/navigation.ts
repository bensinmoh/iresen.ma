import { navigationGroups, type PageId } from './site'
import type { homeFigures } from './figures'

export type NavigationGroup = (typeof navigationGroups)[number]

// Related destinations support the approved hierarchy without adding menu branches.
export const navigationFeatures = {
  institute: 'workWithUs',
  research: 'opportunities',
  expertise: 'workWithUs',
  resources: 'publications',
} as const satisfies Record<NavigationGroup['id'], PageId>

// Reuse the owner's homepage figures and the established founding year.
export const navigationFigureIds = {
  institute: 'founded',
  research: 'collaborativeProjects',
  expertise: 'universityLaboratories',
  resources: 'publications',
} as const satisfies Record<NavigationGroup['id'], (typeof homeFigures)[number]['id'] | 'founded'>
