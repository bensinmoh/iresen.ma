import type { Locale } from '@/i18n/locales'

export const homeNewsSectionId = 'news-events'

/** Presentation fields come from Posts API; editorial selection stays separate. */
export type LinkedInNewsPost = {
  id: string
  commentary: string
  sourceLocale: Locale | null
  publishedAt: string | null
  /** Owner-supplied month for initial cards; never a fabricated API timestamp. */
  publicationMonth?: string
  reshared: boolean
}

export function linkedInPostHref(id: string): string {
  if (!/^urn:li:(activity|share|ugcPost):\d+$/.test(id))
    throw new Error('Invalid LinkedIn post URN')
  return `https://www.linkedin.com/feed/update/${id}/`
}

/** Owner-selected sources, manually verified on 2026-10-09, not an API response.
 * Only original opening paragraphs are retained. Exact dates are unavailable.
 * The uncommented reshare must not borrow its parent's text or date.
 */
export const homeNewsPosts: readonly LinkedInNewsPost[] = [
  {
    id: 'urn:li:activity:7514335153415131136',
    publicationMonth: '2026-10',
    commentary: 'A week of shared learning and valuable connections in Sweden.',
    sourceLocale: 'en',
    publishedAt: null,
    reshared: false,
  },
  {
    id: 'urn:li:activity:7514300639057797120',
    publicationMonth: '2026-09',
    commentary: '',
    sourceLocale: null,
    publishedAt: null,
    reshared: true,
  },
  {
    id: 'urn:li:activity:7514298051914588161',
    publicationMonth: '2026-10',
    commentary:
      'Highlights from IRESEN’s participation in the 16th Dii Desert Energy Leadership Summit, held in Istanbul, Türkiye, under the theme “Clean Energy: Bridging Continents, Connecting Markets”.',
    sourceLocale: 'en',
    publishedAt: null,
    reshared: false,
  },
  {
    id: 'urn:li:activity:7510672994734727168',
    publicationMonth: '2026-09',
    commentary:
      'Highlights from IRESEN’s participation in Oman Climate Week 2026, held from 14 to 16 September in Muscat, as part of a broader mission focused on strengthening cooperation around climate action, green hydrogen and the energy transition.',
    sourceLocale: 'en',
    publishedAt: null,
    reshared: false,
  },
  {
    id: 'urn:li:activity:7508575272049229824',
    publicationMonth: '2026-09',
    commentary:
      'We are pleased to mark this new milestone in the cooperation between IRESEN and Majan Council for Foresight, Strategic Affairs and Energy.',
    sourceLocale: 'en',
    publishedAt: null,
    reshared: true,
  },
]

export type LinkedInApiPost = {
  id: string
  author: string
  commentary?: string
  publishedAt?: number
  visibility: string
  lifecycleState: string
  distribution?: { feedDistribution?: string }
  adContext?: unknown
  reshareContext?: { parent: string }
}

/** Future server-side importer boundary. Activity IDs are not Posts API IDs.
 * Language is editorial metadata: the API does not provide approved translations.
 * No engagement ranking or automatic publication is implied by this adapter.
 */
export function projectLinkedInPost(
  post: LinkedInApiPost,
  selection: { author: string; selectedIds: readonly string[]; sourceLocale: Locale | null },
): LinkedInNewsPost | null {
  if (
    !/^urn:li:(share|ugcPost):\d+$/.test(post.id) ||
    !/^urn:li:organization:\d+$/.test(selection.author) ||
    post.author !== selection.author ||
    !selection.selectedIds.includes(post.id) ||
    post.visibility !== 'PUBLIC' ||
    post.lifecycleState !== 'PUBLISHED' ||
    post.distribution?.feedDistribution !== 'MAIN_FEED' ||
    post.adContext != null
  )
    return null
  const timestamp = post.publishedAt
  const date = typeof timestamp === 'number' ? new Date(timestamp) : null
  return {
    id: post.id,
    commentary: (post.commentary ?? '')
      .normalize('NFKC')
      .split(/\n\s*\n/)[0]
      .trim(),
    sourceLocale: selection.sourceLocale,
    publishedAt: date && Number.isFinite(date.getTime()) ? date.toISOString() : null,
    reshared: Boolean(post.reshareContext),
  }
}
