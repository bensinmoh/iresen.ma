import { navigationGroups, type PageId } from './site'
import type { homeFigures } from './figures'

export type NavigationGroup = (typeof navigationGroups)[number]

type NavigationPanel =
  | { layout: 'links' }
  | {
      layout: 'featured'
      feature: PageId
      figureId?: (typeof homeFigures)[number]['id']
    }

// Each group uses the format its destinations need, with optional supporting content.
export const navigationPanels = {
  institute: { layout: 'featured', feature: 'workWithUs' },
  research: {
    layout: 'featured',
    feature: 'opportunities',
    figureId: 'collaborativeProjects',
  },
  expertise: { layout: 'links' },
  resources: { layout: 'links' },
} as const satisfies Record<NavigationGroup['id'], NavigationPanel>
