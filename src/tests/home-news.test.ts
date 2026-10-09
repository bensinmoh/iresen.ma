import { describe, expect, it } from 'vitest'
import { linkedInPostHref, projectLinkedInPost, type LinkedInApiPost } from '@/lib/home-news'
import { staticSearchDocuments } from '@/lib/search/catalog'

const post: LinkedInApiPost = {
  id: 'urn:li:share:123',
  author: 'urn:li:organization:42',
  commentary: 'Original opening paragraph.\n\nMore text.',
  publishedAt: Date.UTC(2026, 9, 9),
  visibility: 'PUBLIC',
  lifecycleState: 'PUBLISHED',
  distribution: { feedDistribution: 'MAIN_FEED' },
}
const selection = { author: post.author, selectedIds: [post.id], sourceLocale: 'en' as const }

describe('LinkedIn homepage boundary', () => {
  it('projects original text, official timestamp and canonical post ID', () => {
    expect(projectLinkedInPost(post, selection)).toEqual({
      id: post.id,
      commentary: 'Original opening paragraph.',
      sourceLocale: 'en',
      publishedAt: '2026-10-09T00:00:00.000Z',
      reshared: false,
    })
    expect(linkedInPostHref(post.id)).toBe('https://www.linkedin.com/feed/update/urn:li:share:123/')
    expect(() => linkedInPostHref('javascript:alert(1)')).toThrow()
  })
  it.each([
    { author: 'urn:li:organization:999' },
    { visibility: 'CONNECTIONS' },
    { lifecycleState: 'DRAFT' },
    { distribution: { feedDistribution: 'NONE' } },
    { distribution: undefined },
    { adContext: {} },
    { id: 'urn:li:activity:123' },
  ])('excludes ineligible posts: %j', (change) => {
    expect(projectLinkedInPost({ ...post, ...change }, selection)).toBeNull()
  })
  it('requires editorial selection and does not invent reshare text or dates', () => {
    expect(projectLinkedInPost(post, { ...selection, selectedIds: [] })).toBeNull()
    expect(
      projectLinkedInPost(
        {
          ...post,
          commentary: undefined,
          publishedAt: NaN,
          reshareContext: { parent: 'urn:li:share:99' },
        },
        selection,
      ),
    ).toMatchObject({ commentary: '', publishedAt: null, reshared: true })
  })
  it('registers localized editorial headings and reachable card anchors', () => {
    const documents = staticSearchDocuments()
    for (const locale of ['fr', 'en', 'ar']) {
      expect(documents.find(({ id }) => id === `section:home:news-events:${locale}`)?.url).toBe(
        `/${locale}#news-events`,
      )
    }
    const posts = documents.filter(({ id }) => id.startsWith('section:home:linkedin:'))
    expect(posts).toHaveLength(15)
    for (const locale of ['fr', 'en', 'ar']) {
      const localized = posts.filter((post) => post.locale === locale)
      expect(localized).toHaveLength(5)
      expect(localized.every(({ url }) => url.startsWith(`/${locale}#news-`))).toBe(true)
    }
  })
})
