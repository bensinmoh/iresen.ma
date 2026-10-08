import { navigationGroups, type PageId } from './site'

export type NavigationGroup = (typeof navigationGroups)[number]

// Related destinations support the approved hierarchy without adding menu branches.
export const navigationFeatures = {
  institute: 'workWithUs',
  research: 'opportunities',
  expertise: 'workWithUs',
  resources: 'publications',
} as const satisfies Record<NavigationGroup['id'], PageId>
