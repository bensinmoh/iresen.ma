import type { PageId } from './site'
import type { HeroPhotoId } from './hero-images'

type HeroDefinition = {
  photo: HeroPhotoId
  layout: 'start' | 'end' | 'center' | 'editorial'
  stage:
    'research' | 'expertiseSkills' | 'institute' | 'resources' | 'collaboration' | 'information'
  related: PageId
}

// Composition is independent from translated copy and the central route map.
// The asset manifest distinguishes fictional illustrations from sourced photographs.
export const heroes = {
  home: { photo: 'solar-aerial', layout: 'start', stage: 'institute', related: 'platforms' },
  institute: { photo: 'solar-sunset', layout: 'start', stage: 'institute', related: 'governance' },
  governance: { photo: 'governance', layout: 'start', stage: 'institute', related: 'institute' },
  priorities: {
    photo: 'wind-landscape',
    layout: 'center',
    stage: 'research',
    related: 'programmes',
  },
  programmes: { photo: 'research', layout: 'end', stage: 'research', related: 'projects' },
  projects: { photo: 'team', layout: 'start', stage: 'research', related: 'workWithUs' },
  platforms: { photo: 'solar-field', layout: 'start', stage: 'research', related: 'network' },
  network: { photo: 'workshop', layout: 'end', stage: 'expertiseSkills', related: 'platforms' },
  transfer: { photo: 'solar-expertise', layout: 'start', stage: 'research', related: 'workWithUs' },
  workWithUs: {
    photo: 'partnership-handshake',
    layout: 'start',
    stage: 'collaboration',
    related: 'contact',
  },
  news: { photo: 'solar-city', layout: 'start', stage: 'resources', related: 'events' },
  events: { photo: 'conference', layout: 'end', stage: 'resources', related: 'news' },
  publications: { photo: 'reading', layout: 'start', stage: 'resources', related: 'media' },
  media: { photo: 'solar-detail', layout: 'center', stage: 'resources', related: 'publications' },
  opportunities: {
    photo: 'careers-onboarding',
    layout: 'start',
    stage: 'collaboration',
    related: 'workWithUs',
  },
  search: { photo: 'solar-horizon', layout: 'center', stage: 'resources', related: 'sitemap' },
  contact: { photo: 'wind-detail', layout: 'start', stage: 'collaboration', related: 'workWithUs' },
  legal: { photo: 'solar-aerial', layout: 'editorial', stage: 'information', related: 'privacy' },
  privacy: { photo: 'solar-detail', layout: 'editorial', stage: 'information', related: 'cookies' },
  cookies: {
    photo: 'wind-landscape',
    layout: 'editorial',
    stage: 'information',
    related: 'privacy',
  },
  accessibility: {
    photo: 'solar-horizon',
    layout: 'editorial',
    stage: 'information',
    related: 'contact',
  },
  sitemap: { photo: 'solar-city', layout: 'editorial', stage: 'information', related: 'search' },
} as const satisfies Record<PageId, HeroDefinition>
