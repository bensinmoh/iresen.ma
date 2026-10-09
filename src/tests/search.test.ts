import { describe, expect, it } from 'vitest'

import { createSearchAdapter } from '@/lib/search/adapter'
import { buildSearchDocuments } from '@/lib/search/index'
import {
  normalizeSearchText,
  prepareSearchQuery,
  SEARCH_MAX_QUERY_LENGTH,
  SEARCH_MIN_QUERY_LENGTH,
} from '@/lib/search/normalization'
import { rankSearchDocuments } from '@/lib/search/ranking'
import type { SearchDocument } from '@/lib/search/types'
import { footerPageIds, pageHref, pageIds, type PageId } from '@/lib/site'

function richText(text: string) {
  return {
    root: {
      children: [{ type: 'paragraph', children: [{ type: 'text', text }] }],
    },
  }
}

function document(pageId: PageId, title: string, body = '', summary = ''): SearchDocument {
  return {
    id: pageId,
    pageId,
    type: 'page',
    title,
    url: pageHref(pageId, 'en'),
    summary,
    body,
    locale: 'en',
  }
}

describe('locale-aware search queries', () => {
  it('matches French accents and separates punctuation without changing display text', () => {
    const query = prepareSearchQuery('  Énergie, efficacité  ')

    expect(normalizeSearchText('ÉNERGIE / efficacité')).toBe('energie efficacite')
    expect(query).toMatchObject({
      query: 'Énergie, efficacité',
      normalized: 'energie efficacite',
      tokens: ['energie', 'efficacite'],
      valid: true,
    })
  })

  it('normalizes Arabic diacritics, elongation and common alef and ya forms', () => {
    expect(normalizeSearchText('إِنَّ الإِنْتَاجَ الطَّاقيّ عَلَى الأَرْضِ')).toBe(
      'ان الانتاج الطاقي علي الارض',
    )
    expect(normalizeSearchText('الطـاقة ﻻ')).toBe('الطاقة لا')
  })

  it('preserves acronyms and mixed-script keywords', () => {
    expect(prepareSearchQuery('IRESEN الطَّاقَة solaire')).toMatchObject({
      tokens: ['iresen', 'الطاقة', 'solaire'],
      valid: true,
    })
  })

  it('rejects empty, punctuation-only and short searches', () => {
    for (const query of ['', '   ', '…!?', 'é', 'أ']) {
      expect(prepareSearchQuery(query).valid).toBe(false)
    }
    expect(SEARCH_MIN_QUERY_LENGTH).toBe(2)
    expect(prepareSearchQuery('PV').valid).toBe(true)
  })

  it('bounds query length without silently dropping excess keywords', () => {
    expect(SEARCH_MAX_QUERY_LENGTH).toBe(120)
    expect(prepareSearchQuery('a'.repeat(SEARCH_MAX_QUERY_LENGTH)).valid).toBe(true)
    expect(prepareSearchQuery('a'.repeat(SEARCH_MAX_QUERY_LENGTH + 1)).valid).toBe(false)
  })
})

describe('public search documents', () => {
  it('uses canonical localized destinations and omits search and footer utilities', () => {
    for (const locale of ['fr', 'en', 'ar'] as const) {
      const documents = buildSearchDocuments(locale)
      const expectedIds = pageIds.filter(
        (id) => id !== 'search' && !footerPageIds.some((utility) => utility === id),
      )

      expect(documents.map(({ pageId }) => pageId).sort()).toEqual([...expectedIds].sort())
      expect(new Set(documents.map(({ pageId }) => pageId)).size).toBe(documents.length)
      for (const result of documents) {
        expect(result.url).toBe(pageHref(result.pageId, locale))
        expect(result.locale).toBe(locale)
      }
    }
  })

  it('searches approved page copy while retaining the canonical route', () => {
    const documents = buildSearchDocuments('fr', [
      {
        id: 101,
        pageId: 'platforms',
        title: 'Démonstrateurs solaires',
        summary: 'Les plateformes de recherche.',
        body: richText('La plateforme permet des essais sur les systèmes solaires.'),
      },
    ])

    expect(documents.find(({ pageId }) => pageId === 'platforms')).toMatchObject({
      title: 'Démonstrateurs solaires',
      summary: 'Les plateformes de recherche.',
      body: 'La plateforme permet des essais sur les systèmes solaires.',
      url: '/fr/expertise-experimentation/plateformes',
    })
    expect(rankSearchDocuments(documents, prepareSearchQuery('demonstrateurs'))[0]?.pageId).toBe(
      'platforms',
    )
  })

  it('ignores unknown routes and utility copy supplied by the CMS', () => {
    const fixtures = ['unknown', 'search', ...footerPageIds].map((pageId, id) => ({
      id,
      pageId,
      title: 'Excludedneedle',
      summary: 'Excludedneedle summary.',
      body: richText('Excludedneedle body.'),
    }))

    expect(
      rankSearchDocuments(
        buildSearchDocuments('en', fixtures),
        prepareSearchQuery('Excludedneedle'),
      ),
    ).toEqual([])
  })

  it('keeps incomplete localized records out of the index', () => {
    const documents = buildSearchDocuments('en', [
      {
        id: 1,
        pageId: 'platforms',
        title: 'Incompletecopy',
        summary: null,
        body: richText('Incompletecopy body.'),
      },
    ])

    expect(rankSearchDocuments(documents, prepareSearchQuery('Incompletecopy'))).toEqual([])
  })

  it('indexes complete published articles and excludes future, invalid or incomplete records', () => {
    const article = {
      id: 42,
      title: 'Articlezeta',
      summary: 'An approved article summary.',
      body: richText('Articlezeta describes the experiment.'),
      publishedAt: '2020-01-01T12:00:00Z',
    }
    const results = rankSearchDocuments(
      buildSearchDocuments(
        'en',
        [],
        [
          article,
          { ...article, id: 43, publishedAt: '2999-01-01T12:00:00Z' },
          { ...article, id: '../admin' },
          { ...article, id: 44, body: null },
        ],
      ),
      prepareSearchQuery('articlezeta'),
    )

    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      id: 'news:42',
      pageId: 'news',
      type: 'news',
      title: 'Articlezeta',
      locale: 'en',
      publishedAt: article.publishedAt,
    })
    expect(results[0]?.url.startsWith(`${pageHref('news', 'en')}?`)).toBe(true)
  })

  it('extracts readable text without indexing rich-text URLs or metadata', () => {
    const documents = buildSearchDocuments('en', [
      {
        id: 1,
        pageId: 'platforms',
        title: 'Research platforms',
        summary: 'Testing solar systems.',
        body: {
          root: {
            children: [
              {
                type: 'paragraph',
                children: [
                  { type: 'text', text: 'Solar ' },
                  {
                    type: 'link',
                    fields: { url: 'https://example.invalid/hiddenmetadata' },
                    children: [{ type: 'text', text: 'energy experiments.' }],
                  },
                ],
              },
              {
                type: 'upload',
                value: { alt: 'Uploadsecret', filename: 'Uploadsecret.pdf' },
                children: [{ type: 'text', text: 'Uploadsecret' }],
              },
              {
                type: 'custom-unrendered-block',
                children: [{ type: 'text', text: 'Unknownsecret' }],
              },
            ],
          },
        },
      },
    ])
    const results = rankSearchDocuments(documents, prepareSearchQuery('solar energy'))

    expect(results[0]).toMatchObject({ pageId: 'platforms' })
    expect(results[0]?.excerpt).toContain('energy experiments.')
    expect(results[0]?.excerpt).not.toContain('https://')
    expect(rankSearchDocuments(documents, prepareSearchQuery('hiddenmetadata'))).toEqual([])
    expect(rankSearchDocuments(documents, prepareSearchQuery('Uploadsecret'))).toEqual([])
    expect(rankSearchDocuments(documents, prepareSearchQuery('Unknownsecret'))).toEqual([])
  })
})

describe('search relevance and excerpts', () => {
  it('puts exact title matches before longer titles and body-only matches', () => {
    const documents = [
      document('platforms', 'Research platforms', 'Solar energy experiments.'),
      document('programmes', 'Solar energy programmes'),
      document('priorities', 'Solar energy'),
    ]

    expect(
      rankSearchDocuments(documents, prepareSearchQuery('solar energy')).map(
        ({ pageId }) => pageId,
      ),
    ).toEqual(['priorities', 'programmes', 'platforms'])
  })

  it('requires every keyword and matches prefixes at word boundaries', () => {
    const documents = [
      document('platforms', 'Solar efficiency'),
      document('programmes', 'Solar programmes'),
      document('priorities', 'Efficiency priorities'),
      document('projects', 'Parasol efficiency'),
    ]

    expect(
      rankSearchDocuments(documents, prepareSearchQuery('sol effic')).map(({ pageId }) => pageId),
    ).toEqual(['platforms'])
  })

  it('returns original accented text around a matching keyword deep in a long body', () => {
    const body = `${'Les essais sont réalisés dans ce laboratoire. '.repeat(20)}Une étude sur l’énergie solaire accompagne les essais.`
    const results = rankSearchDocuments(
      [document('platforms', 'Plateformes', body)],
      prepareSearchQuery('energie'),
    )

    expect(results[0]?.excerpt).toContain('énergie solaire')
    expect(results[0]?.excerpt.length).toBeLessThan(body.length)
  })

  it('matches Arabic and mixed-script copy while preserving its original title', () => {
    const results = rankSearchDocuments(
      [document('projects', 'IRESEN إِنْتَاج الطَّاقَة', 'دراسة حول إنتاج الطاقة على الأرض')],
      prepareSearchQuery('iresen انتاج الطاقة'),
    )

    expect(results[0]?.title).toBe('IRESEN إِنْتَاج الطَّاقَة')
  })

  it('finds Arabic nouns with definite articles and conservative attached forms', () => {
    const documents = buildSearchDocuments('ar')
    const results = rankSearchDocuments(documents, prepareSearchQuery('بحث'))
    expect(results.some(({ pageId }) => pageId === 'platforms')).toBe(true)
    expect(results.some(({ pageId }) => pageId === 'programmes')).toBe(true)
    expect(
      rankSearchDocuments(documents, prepareSearchQuery('منصات بحث')).some(
        ({ pageId }) => pageId === 'platforms',
      ),
    ).toBe(true)
    const literalAndAttached = [
      document('platforms', 'والبحث', 'تواصل الفرق وبالبحث وللبحث.'),
      document('projects', 'بحث'),
    ]
    expect(
      rankSearchDocuments(literalAndAttached, prepareSearchQuery('بحث')).map(
        ({ pageId }) => pageId,
      ),
    ).toEqual(['projects', 'platforms'])
    expect(rankSearchDocuments(literalAndAttached, prepareSearchQuery('للبحث'))).toHaveLength(2)
  })

  it('keeps a deep Arabic match in the excerpt when earlier text contains diacritics', () => {
    const body = `${'هٰذا نَصٌّ طَويلٌ '.repeat(80)}إِنْتَاج الطَّاقَة ${'في المنصة '.repeat(15)}`
    const results = rankSearchDocuments(
      [document('platforms', 'منصة البحث', body)],
      prepareSearchQuery('انتاج'),
    )

    expect(results[0]?.excerpt).toContain('إِنْتَاج')
    expect(results[0]?.excerpt.length).toBeLessThan(body.length)
  })
})

describe('search adapter paging and availability', () => {
  it('finds visible section headings including children without indexing editorial instructions', async () => {
    const adapter = createSearchAdapter({
      loadPublishedContent: async () => ({ pages: [], news: [] }),
    })
    for (const [locale, query] of [
      ['en', 'intellectual property'],
      ['fr', 'propriété intellectuelle'],
      ['ar', 'الملكية الفكرية'],
    ] as const) {
      const transfer = await adapter.search({ query, locale })
      expect(transfer.status).toBe('available')
      if (transfer.status !== 'available') return
      expect(transfer.items).toEqual([
        expect.objectContaining({
          type: 'page',
          pageId: 'transfer',
          url: pageHref('transfer', locale),
        }),
      ])
    }
    const nested = await adapter.search({ query: '2035', locale: 'en' })
    expect(nested).toMatchObject({
      status: 'available',
      total: 1,
      items: [expect.objectContaining({ pageId: 'institute' })],
    })
    for (const [locale, query] of [
      ['en', 'Content to add'],
      ['fr', 'À prévoir'],
      ['ar', 'محتوى مرتقب'],
    ] as const) {
      expect(await adapter.search({ query, locale })).toMatchObject({
        status: 'available',
        total: 0,
        items: [],
      })
    }
  })

  it('clamps requested pages and returns bounded result slices', async () => {
    const publishedPages = pageIds
      .filter((id) => id !== 'search' && !footerPageIds.some((utility) => utility === id))
      .map((pageId, id) => ({
        id,
        pageId,
        title: `Searchneedle ${pageId}`,
        summary: 'Public summary.',
        body: richText('Public body.'),
      }))
    const adapter = createSearchAdapter({
      loadPublishedContent: async () => ({ pages: publishedPages, news: [] }),
    })
    const firstPage = await adapter.search({ query: 'searchneedle', locale: 'en', page: -1 })
    const lastPage = await adapter.search({ query: 'searchneedle', locale: 'en', page: 999 })

    expect(firstPage.status).toBe('available')
    expect(lastPage.status).toBe('available')
    if (firstPage.status !== 'available' || lastPage.status !== 'available') return

    expect(firstPage.page).toBe(1)
    expect(firstPage.pageSize).toBe(8)
    expect(firstPage.total).toBe(publishedPages.length)
    expect(firstPage.items).toHaveLength(8)
    expect(lastPage.page).toBe(lastPage.totalPages)
    expect(lastPage.items).toHaveLength(publishedPages.length - 8)
    expect(firstPage.items.map(({ id }) => id)).not.toEqual(lastPage.items.map(({ id }) => id))
  })

  it('avoids content queries for invalid input', async () => {
    let loads = 0
    const adapter = createSearchAdapter({
      loadPublishedContent: async () => {
        loads += 1
        return { pages: [], news: [] }
      },
    })

    await adapter.search({ query: 'a', locale: 'en', page: 1 })
    await adapter.search({ query: 'a'.repeat(121), locale: 'en', page: 1 })
    expect(loads).toBe(0)
  })

  it('still searches canonical pages when the CMS is unavailable', async () => {
    const adapter = createSearchAdapter({
      loadPublishedContent: async () => {
        throw new Error('Fixture content service unavailable')
      },
    })
    const result = await adapter.search({ query: 'platform', locale: 'en', page: 1 })

    expect(result.status).toBe('available')
    if (result.status !== 'available') return
    expect(result.contentUnavailable).toBe(true)
    expect(result.items.some(({ pageId }) => pageId === 'platforms')).toBe(true)
  })
})
