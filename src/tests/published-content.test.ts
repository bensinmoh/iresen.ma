import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PublishedRichText } from '@/components/content/PublishedContent'
import { findPublishedNewsArticle } from '@/lib/content/queries'
import type { Page } from '@/payload-types'

const cms = vi.hoisted(() => ({ find: vi.fn(), getPayload: vi.fn() }))
vi.mock('payload', () => ({ getPayload: cms.getPayload }))
vi.mock('../payload.config', () => ({ default: {} }))

function text(value: string) {
  return { type: 'text', version: 1, text: value, format: 0, detail: 0, mode: 'normal', style: '' }
}

function body(children: NonNullable<Page['body']>['root']['children']): NonNullable<Page['body']> {
  return {
    root: { type: 'root', version: 1, direction: null, format: '', indent: 0, children },
  }
}

function link(fields: Record<string, unknown>, label: string) {
  return {
    type: 'link',
    version: 3,
    children: [text(label)],
    direction: null,
    format: '',
    indent: 0,
    fields: { linkType: 'custom', newTab: false, ...fields },
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  cms.getPayload.mockResolvedValue({ find: cms.find })
  cms.find.mockResolvedValue({ docs: [] })
})

describe('published rich-text destinations', () => {
  it('renders text safely and keeps one page-level heading', async () => {
    const html = renderToStaticMarkup(
      await PublishedRichText({
        locale: 'en',
        body: body([
          { type: 'heading', version: 1, tag: 'h1', children: [text('Published heading')] },
          { type: 'paragraph', version: 1, children: [text('<script>unsafe()</script>')] },
          link({ url: 'javascript:alert(1)' }, 'Unsafe link'),
          link({ url: 'https://example.com/resource', newTab: true }, 'Public resource'),
        ]),
      }),
    )
    expect(html).toContain('<h2>Published heading</h2>')
    expect(html).not.toContain('<h1>')
    expect(html).toContain('&lt;script&gt;unsafe()&lt;/script&gt;')
    expect(html).not.toContain('javascript:')
    expect(html).toContain('Unsafe link')
    expect(html).toContain('href="https://example.com/resource"')
    expect(html).toContain('rel="noopener noreferrer"')
    expect(cms.getPayload).not.toHaveBeenCalled()
  })

  it('resolves internal links only from access-controlled locale records', async () => {
    cms.find.mockImplementation(async ({ collection }: { collection: string }) => ({
      docs: collection === 'pages' ? [{ id: 8, pageId: 'platforms' }] : [{ id: 9 }],
    }))
    const html = renderToStaticMarkup(
      await PublishedRichText({
        locale: 'ar',
        body: body([
          link({ linkType: 'internal', doc: { relationTo: 'pages', value: 8 } }, 'Platforms'),
          link({ linkType: 'internal', doc: { relationTo: 'pages', value: 99 } }, 'Private page'),
          link({ linkType: 'internal', doc: { relationTo: 'news', value: 9 } }, 'News article'),
          link({ linkType: 'internal', doc: { relationTo: 'users', value: 1 } }, 'Account'),
        ]),
      }),
    )
    expect(html).toContain('/ar/الخبرة-والتجريب/المنصات')
    expect(html).toContain('?article=9#news-9')
    expect(html).toContain('Private page')
    expect(html).toContain('Account')
    expect(html.match(/<a /g)).toHaveLength(2)
    expect(cms.find).toHaveBeenCalledTimes(2)
    for (const [query] of cms.find.mock.calls) {
      expect(query).toMatchObject({
        locale: 'ar',
        fallbackLocale: false,
        overrideAccess: false,
        draft: false,
        depth: 0,
      })
    }
    expect(cms.find.mock.calls[1][0].where.and[1].publishedAt.less_than_equal).toBeTruthy()
  })

  it('does not expose embedded private upload or relationship objects', async () => {
    const html = renderToStaticMarkup(
      await PublishedRichText({
        locale: 'fr',
        body: body([
          { type: 'paragraph', version: 1, children: [text('Approved text')] },
          {
            type: 'upload',
            version: 1,
            value: { url: '/private/source.pdf', mimeType: 'application/pdf', filename: 'Secret' },
          },
          { type: 'relationship', version: 1, value: { title: 'Private relationship' } },
        ]),
      }),
    )
    expect(html).toContain('Approved text')
    expect(html).not.toContain('private')
    expect(html).not.toContain('Secret')
  })
})

describe('focused news article queries', () => {
  it('rejects malformed and unsafe IDs before contacting the CMS', async () => {
    for (const id of ['0', '-1', '1.5', '1 OR 1=1', '9007199254740993', '']) {
      expect(await findPublishedNewsArticle(id, 'fr')).toBeNull()
    }
    expect(cms.getPayload).not.toHaveBeenCalled()
  })

  it('enforces access and date eligibility and selects only public article fields', async () => {
    expect(await findPublishedNewsArticle('42', 'en')).toBeNull()
    expect(cms.find).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'news',
        locale: 'en',
        fallbackLocale: false,
        overrideAccess: false,
        draft: false,
        depth: 0,
        where: {
          and: [{ id: { equals: 42 } }, { publishedAt: { less_than_equal: expect.any(String) } }],
        },
        select: { id: true, title: true, summary: true, body: true, publishedAt: true },
      }),
    )
  })
})
