import { homeAchievements } from '@/lib/home-achievements'
import { homePlatforms } from '@/lib/home-platforms'
import { researchThemes } from '@/lib/home-research'
import { homeMissions, homeCooperationAnchor } from '@/lib/home-missions'
import type { PageId } from '@/lib/site'

export type SectionDefinition = {
  id: string
  children?: readonly SectionDefinition[]
}

// Editorial scaffolds follow the received section proposal within the canonical
// 22-page route map. Page introductions are already provided by the heroes.
// Titles and short content briefs live in the locale catalogs, not this map.
export const pageSections: Record<PageId, readonly SectionDefinition[]> = {
  home: [
    {
      id: 'develop-test-transfer',
      children: [
        ...homeMissions.map(({ anchor }) => ({ id: anchor })),
        { id: homeCooperationAnchor },
      ],
    },
    { id: 'figures' },
    { id: 'results', children: homeAchievements.map(({ id }) => ({ id: `achievement-${id}` })) },
    { id: 'research-priorities', children: researchThemes.map((id) => ({ id: `research-${id}` })) },
    { id: 'innovation-value-chain' },
    {
      id: 'platforms-expertise',
      children: [
        ...homePlatforms.map(({ id }) => ({ id: `platform-${id}` })),
        { id: 'platform-network-laboratories' },
        { id: 'platform-network-expertise' },
      ],
    },
    { id: 'collaboration' },
    { id: 'news-events' },
  ],
  institute: [
    { id: 'about' },
    {
      id: 'mission',
      children: [{ id: 'capabilities' }, { id: 'ambition-2035' }],
    },
    { id: 'key-figures' },
    { id: 'more-resources' },
  ],
  governance: [
    { id: 'bodies-responsibilities' },
    { id: 'council-representatives' },
    { id: 'leadership-organisation' },
    { id: 'department-responsibilities' },
    { id: 'science-platforms' },
    { id: 'documents-contact' },
  ],
  priorities: [
    { id: 'needs-challenges' },
    { id: 'domains-directions' },
    { id: 'technology-roadmaps' },
    { id: 'priorities-projects' },
    { id: 'decision-resources' },
    { id: 'resources-collaboration' },
  ],
  programmes: [
    { id: 'programmes-collaborations' },
    { id: 'calls-for-projects' },
    { id: 'participate' },
    { id: 'project-lifecycle' },
    { id: 'research-results' },
    { id: 'practical-questions' },
  ],
  projects: [
    { id: 'featured-results' },
    { id: 'find-project' },
    { id: 'project-catalogue' },
    { id: 'understanding-results' },
    { id: 'related-capabilities' },
  ],
  platforms: [
    { id: 'choose-by-need' },
    { id: 'platform-network' },
    { id: 'capabilities-availability' },
    { id: 'testing-demonstration' },
    { id: 'access-platforms' },
    { id: 'projects-resources' },
  ],
  network: [
    { id: 'competence-domains' },
    { id: 'intervention-modes' },
    { id: 'scientific-network' },
    { id: 'skills-training' },
    { id: 'expertise-in-action' },
    { id: 'request-expertise' },
  ],
  transfer: [
    { id: 'results-to-transfer' },
    { id: 'research-to-use' },
    { id: 'intellectual-property' },
    { id: 'transfer-pathways' },
    { id: 'adoption-initiatives' },
    { id: 'build-transfer' },
  ],
  workWithUs: [
    { id: 'choose-pathway' },
    { id: 'organisation-contributions' },
    { id: 'collaboration-arrangements' },
    { id: 'need-to-project' },
    { id: 'collaboration-references' },
    { id: 'prepare-discussion' },
  ],
  news: [
    { id: 'featured-news' },
    { id: 'find-news' },
    { id: 'all-news' },
    { id: 'related-events-resources' },
    { id: 'follow-iresen' },
  ],
  events: [
    { id: 'upcoming-events' },
    { id: 'find-event' },
    { id: 'participate' },
    { id: 'past-events' },
    { id: 'propose-collaboration' },
  ],
  publications: [
    { id: 'featured-publications' },
    { id: 'find-publication' },
    { id: 'publication-catalogue' },
    { id: 'institutional-reports' },
    { id: 'use-cite-resources' },
  ],
  media: [
    { id: 'featured-media' },
    { id: 'find-media' },
    { id: 'collections-content' },
    { id: 'press-resources' },
    { id: 'credits-reuse' },
  ],
  opportunities: [
    { id: 'open-opportunities' },
    { id: 'find-opportunity' },
    { id: 'working-at-iresen' },
    { id: 'apply-respond' },
    { id: 'archives-results' },
    { id: 'questions-unsolicited-applications' },
  ],
  contact: [
    { id: 'route-request' },
    { id: 'send-request' },
    { id: 'information-use' },
    { id: 'locations' },
    { id: 'practical-questions' },
    { id: 'request-follow-up' },
  ],
  search: [
    { id: 'search-query' },
    { id: 'refine-results' },
    { id: 'results', children: [{ id: 'no-results' }] },
  ],
  legal: [
    { id: 'site-publisher' },
    { id: 'publication-hosting' },
    { id: 'rights-data-protection' },
    { id: 'contact-version' },
  ],
  privacy: [
    { id: 'controller-scope' },
    { id: 'data-uses' },
    { id: 'providers-transfers' },
    { id: 'rights-contact' },
    { id: 'security-updates' },
  ],
  cookies: [
    { id: 'cookie-use' },
    { id: 'cookies-services' },
    { id: 'manage-preferences' },
    { id: 'effects-contact' },
  ],
  accessibility: [
    { id: 'commitment-objective' },
    { id: 'evaluation-scope' },
    { id: 'limitations-alternatives' },
    { id: 'help-feedback' },
  ],
  sitemap: [
    { id: 'site-pages' },
    { id: 'catalogues-resources' },
    { id: 'search-useful-information' },
  ],
}
