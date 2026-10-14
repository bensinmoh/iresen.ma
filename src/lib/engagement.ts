import { pageHref, type PageId } from './site'
import type { Locale } from '@/i18n/locales'

export type EngagementPageId = 'workWithUs' | 'transfer'
type Destination = { pageId: PageId; anchor?: string }
type EngagementSection = {
  id: string
  kind:
    | 'pathways'
    | 'audiences'
    | 'arrangements'
    | 'process'
    | 'references'
    | 'contact'
    | 'results'
    | 'disclosures'
    | 'partnerships'
  destinations?: readonly Destination[]
  references?: readonly string[]
}

export const engagementSections: Record<EngagementPageId, readonly EngagementSection[]> = {
  workWithUs: [
    {
      id: 'choose-pathway',
      kind: 'pathways',
      destinations: [
        { pageId: 'network', anchor: 'intervention-modes' },
        { pageId: 'programmes' },
        { pageId: 'network', anchor: 'skills-training' },
        { pageId: 'transfer' },
      ],
    },
    { id: 'collaboration-references', kind: 'partnerships' },
    {
      id: 'organisation-contributions',
      kind: 'audiences',
      destinations: [
        { pageId: 'network', anchor: 'intervention-modes' },
        { pageId: 'programmes' },
        { pageId: 'platforms' },
        { pageId: 'contact', anchor: 'send-request' },
        { pageId: 'workWithUs', anchor: 'collaboration-references' },
        { pageId: 'opportunities' },
      ],
    },
    { id: 'collaboration-arrangements', kind: 'arrangements' },
    { id: 'need-to-project', kind: 'process' },
    { id: 'prepare-discussion', kind: 'contact' },
  ],
  transfer: [
    { id: 'results-to-transfer', kind: 'results' },
    { id: 'research-to-use', kind: 'process' },
    { id: 'intellectual-property', kind: 'disclosures' },
    { id: 'transfer-pathways', kind: 'pathways' },
    { id: 'adoption-initiatives', kind: 'references' },
    { id: 'build-transfer', kind: 'contact' },
  ],
}

export type EngagementSectionCopy = {
  label: string
  items: { title: string; description: string; question?: string }[]
  note?: string
  checklist: string[]
}

export function engagementContactHref(locale: Locale) {
  const [path, anchor] = pageHref('contact', locale, 'send-request').split('#')
  return `${path}?subject=partnerships#${anchor}`
}

export function engagementSearchText(value: unknown): string[] {
  if (typeof value === 'string') return value.trim() ? [value] : []
  if (Array.isArray(value)) return value.flatMap(engagementSearchText)
  if (value && typeof value === 'object') return Object.values(value).flatMap(engagementSearchText)
  return []
}

/** One generated illustrative photograph per commissioned audience, in editorial order. */
export const collaborationAudiences = [
  'public-actors',
  'research-teams',
  'industrial-companies',
  'territorial-actors',
  'international-partners',
  'talents-public',
] as const
