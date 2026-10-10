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
    { id: 'organisation-contributions', kind: 'audiences' },
    { id: 'collaboration-arrangements', kind: 'arrangements' },
    { id: 'need-to-project', kind: 'process' },
    { id: 'collaboration-references', kind: 'references', references: ['cartography', 'worldptx'] },
    { id: 'prepare-discussion', kind: 'contact' },
  ],
  transfer: [
    { id: 'results-to-transfer', kind: 'results' },
    { id: 'research-to-use', kind: 'process' },
    {
      id: 'transfer-pathways',
      kind: 'pathways',
      destinations: [
        { pageId: 'publications' },
        { pageId: 'workWithUs' },
        { pageId: 'contact', anchor: 'send-request' },
        { pageId: 'workWithUs' },
      ],
    },
    { id: 'intellectual-property', kind: 'disclosures' },
    { id: 'adoption-initiatives', kind: 'references', references: ['ismart', 'aquasolar'] },
    { id: 'build-transfer', kind: 'contact' },
  ],
}

export type EngagementSectionCopy = {
  label: string
  items: { title: string; description: string }[]
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
