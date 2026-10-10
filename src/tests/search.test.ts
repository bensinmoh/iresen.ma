import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { SEARCH_QUERY_LIMIT, validateSearchInput } from '@/lib/search/adapter'
import { catalogRevision, publicAssetReferences, staticSearchDocuments } from '@/lib/search/catalog'
import { extractPublicFileText } from '@/lib/search/indexer'
import {
  highlightSearchText,
  normalizeSearchText,
  richTextPlainText,
  richTextSections,
  searchExcerpt,
  searchTokens,
} from '@/lib/search/text'
import { searchTypes, type SearchInput } from '@/lib/search/types'
import { contentLocales } from '@/lib/content/publication'
import { heroImages } from '@/lib/hero-images'
import { homeMissions, legacyMissionAnchors, homeCooperationAnchor } from '@/lib/home-missions'
import { pageSections } from '@/lib/page-sections'
import { pageHref, pageIds } from '@/lib/site'
import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'

describe('multilingual search text', () => {
  it('accepts explicit resource types with complete localized labels, without reclassifying their overview pages', () => {
    for (const type of searchTypes) {
      expect(validateSearchInput({ query: 'IRESEN', locale: 'fr', type })).toBe(true)
      for (const messages of [fr, en, ar]) expect(messages.Search.types[type].trim()).not.toBe('')
    }
    const documents = staticSearchDocuments()
    for (const locale of contentLocales) {
      expect(documents.find((item) => item.id === `page:publications:${locale}`)?.type).toBe('page')
      expect(documents.find((item) => item.id === `page:projects:${locale}`)?.type).toBe('page')
      expect(
        documents.filter((item) => item.type === 'patent' && item.locale === locale),
      ).toHaveLength(59)
    }
  })
  it('normalizes French accents and ligatures, English case, and Arabic marks without losing letters', () => {
    expect(normalizeSearchText('Énergies, CŒUR et ÆTHER!')).toBe('energies coeur et aether')
    expect(normalizeSearchText('Research / IRESEN 2035')).toBe('research iresen 2035')
    expect(normalizeSearchText('أَبْحَاث إِنْجَاز آفاق ٱلطَّاقَة علـى')).toBe(
      'ابحاث انجاز افاق الطاقة علي',
    )
    expect(normalizeSearchText('IRESEN — الطَّاقَة')).toBe('iresen الطاقة')
  })

  it('deduplicates normalized tokens and bounds a query to twelve terms', () => {
    expect(searchTokens('ÉNERGIE énergie ENERGY energy')).toEqual(['energie', 'energy'])
    expect(
      searchTokens(Array.from({ length: 30 }, (_, index) => `term${index}`).join(' ')),
    ).toHaveLength(12)
    expect(searchTokens(' + : & ! ')).toEqual([])
  })

  it('highlights original accented, ligature and Arabic text using text segments', () => {
    const original = 'Énergies du cœur — أَبْحَاث IRESEN <script>alert(1)</script>'
    const segments = highlightSearchText(original, 'energie coeur ابحاث')
    expect(segments.map(({ text }) => text).join('')).toBe(original)
    expect(segments.filter(({ match }) => match).map(({ text }) => text)).toEqual([
      'Énergie',
      'cœur',
      'أَبْحَاث',
    ])
    expect(segments.at(-1)).toEqual({
      text: ' IRESEN <script>alert(1)</script>',
      match: false,
    })
    expect(highlightSearchText('e\u0301nergie', 'energie')).toEqual([
      { text: 'e\u0301nergie', match: true },
    ])
    expect(highlightSearchText('No match', 'other')).toEqual([{ text: 'No match', match: false }])
  })

  it('centers bounded readable excerpts near accent-insensitive matches', () => {
    const text = `${'Introduction text. '.repeat(25)}Énergie solaire remarquable. ${'Closing text. '.repeat(25)}`
    const excerpt = searchExcerpt(text, 'energie', 120)
    expect(excerpt).toContain('Énergie solaire remarquable.')
    expect(excerpt.startsWith('…')).toBe(true)
    expect(excerpt.endsWith('…')).toBe(true)
    expect(excerpt.length).toBeLessThanOrEqual(122)
    expect(searchExcerpt('  Reviewed\n public\t copy.  ', 'public')).toBe('Reviewed public copy.')
  })

  it('extracts public rich-text nodes and stable heading anchors, excluding serialized metadata', () => {
    const body = {
      internalNotes: 'Editorial secret',
      root: {
        children: [
          { type: 'paragraph', children: [{ text: 'Introduction' }] },
          { type: 'heading', children: [{ text: 'Solar research' }] },
          {
            type: 'paragraph',
            children: [{ text: 'Public section copy', url: 'https://private.invalid/token' }],
          },
          { type: 'heading', children: [{ text: 'Transfer' }] },
          { type: 'paragraph', children: [{ text: 'Practical applications' }] },
        ],
      },
    }
    expect(richTextPlainText(body)).toBe(
      'Introduction Solar research Public section copy Transfer Practical applications',
    )
    expect(richTextSections(body)).toEqual([
      { anchor: 'content-section-1', title: 'Solar research', body: 'Public section copy' },
      { anchor: 'content-section-3', title: 'Transfer', body: 'Practical applications' },
    ])
    expect(richTextPlainText(null)).toBe('')
    expect(richTextSections(null)).toEqual([])
  })

  it('suppresses upload relationships and bounds oversized or malformed rich-text projections', () => {
    const secret = 'Private related upload transcription'
    const upload = { type: 'upload', text: secret, children: [{ text: secret }] }
    const giantParagraph = { type: 'paragraph', children: [{ text: 'x'.repeat(200_001) }] }
    const body = {
      root: {
        children: [
          { type: 'heading', children: [{ text: 'Public section' }] },
          upload,
          giantParagraph,
        ],
      },
    }
    const plain = richTextPlainText(body)
    expect(plain).toContain('Public section')
    expect(plain).not.toContain(secret)
    expect(plain.length).toBeLessThanOrEqual(100_000)
    const sections = richTextSections(body)
    expect(sections).toHaveLength(1)
    expect(sections[0]?.body).not.toContain(secret)
    expect(
      sections.reduce((length, section) => length + section.title.length + section.body.length, 0),
    ).toBeLessThanOrEqual(100_000)
    expect(
      richTextSections({
        root: {
          children: Array.from({ length: 1000 }, () => ({
            type: 'heading',
            children: [{ text: 'Public heading' }],
          })),
        },
      }),
    ).toHaveLength(200)
    expect(richTextSections({ root: { children: { malformed: true } } })).toEqual([])
  })
})

describe('search request validation', () => {
  it('accepts public locales and safely bounded options, including punctuation as ordinary query text', () => {
    expect(validateSearchInput({ query: 'Énergie الطاقة IRESEN', locale: 'ar' })).toBe(true)
    expect(
      validateSearchInput({ query: '', locale: 'fr', page: 1, type: 'all', sort: 'newest' }),
    ).toBe(true)
    expect(validateSearchInput({ query: "' OR 1=1; DROP TABLE pages; --", locale: 'en' })).toBe(
      true,
    )
    expect(validateSearchInput({ query: 'x'.repeat(SEARCH_QUERY_LIMIT), locale: 'en' })).toBe(true)
  })

  it.each([
    { query: 'x'.repeat(SEARCH_QUERY_LIMIT + 1), locale: 'fr' },
    { query: 'query\u0000secret', locale: 'fr' },
    { query: 'query\nsecret', locale: 'fr' },
    { query: 'query\u007fsecret', locale: 'fr' },
    { query: 'query', locale: 'de' },
    { query: 'query', locale: 'en', type: 'users' },
    { query: 'query', locale: 'en', sort: 'score; DROP TABLE news' },
    { query: 'query', locale: 'en', page: 0 },
    { query: 'query', locale: 'en', page: 1001 },
    { query: 'query', locale: 'en', page: 1.5 },
    { query: 'query', locale: 'en', page: Number.NaN },
  ])('rejects an invalid search request: %j', (input) => {
    expect(validateSearchInput(input as SearchInput)).toBe(false)
  })

  it('rejects file traversal, remote URLs, control characters and unsupported extraction types', async () => {
    await expect(extractPublicFileText('../private.pdf', 'application/pdf')).resolves.toBe('')
    await expect(
      extractPublicFileText('https://private.invalid/file.pdf', 'application/pdf'),
    ).resolves.toBe('')
    await expect(extractPublicFileText('file\u0000.pdf', 'application/pdf')).resolves.toBe('')
    await expect(extractPublicFileText('video.mp4', 'video/mp4')).resolves.toBe('')
  })
})

describe('explicit public search catalog', () => {
  it.each(contentLocales)(
    '%s: discovers the three domains and shared enabler at rendered anchors',
    (locale) => {
      const copy = { fr, en, ar }[locale]
      const documents = staticSearchDocuments().filter((document) => document.locale === locale)
      for (const anchor of [
        ...homeMissions.map((mission) => mission.anchor),
        homeCooperationAnchor,
      ]) {
        const document = documents.find(({ id }) => id === `section:home:${anchor}:${locale}`)
        expect(document).toMatchObject({
          type: 'section',
          url: pageHref('home', locale, anchor),
          title: copy.PageSections.home[anchor as keyof typeof copy.PageSections.home].title,
        })
        expect(document?.body).toContain(
          copy.PageSections.home[anchor as keyof typeof copy.PageSections.home].description,
        )
      }
      for (const anchor of legacyMissionAnchors) {
        expect(documents.some(({ id }) => id === `section:home:${anchor}:${locale}`)).toBe(false)
        expect(pageHref('home', locale, anchor)).toBe(`${pageHref('home', locale)}#${anchor}`)
      }
      expect(
        documents.some(({ url }) => /narratif|narrative-alignment|private-references/.test(url)),
      ).toBe(false)
      for (const mission of homeMissions) {
        expect(pageHref(mission.pageId, locale, mission.destinationAnchor)).not.toContain(
          'undefined',
        )
      }
    },
  )
  it.each(contentLocales)(
    '%s: indexes current contact guidance and destinations without withdrawn editorial scaffolds',
    (locale) => {
      const catalog = { fr, en, ar }[locale]
      const contact = staticSearchDocuments()
        .filter(({ id }) => id.startsWith('page:contact:') || id.startsWith('section:contact:'))
        .filter((document) => document.locale === locale)
      const page = contact.find(({ type }) => type === 'page')
      expect(page).toMatchObject({
        title: `${catalog.Contact.hero.title} ${catalog.Contact.hero.accent}`,
        url: pageHref('contact', locale),
      })
      expect(page?.body).toContain(catalog.Contact.hero.description)
      expect(page?.body).toContain(catalog.Footer.address)
      const text = contact.map(({ title, body }) => `${title} ${body}`).join(' ')
      expect(text).not.toMatch(/À prévoir|Content to add|محتوى مرتقب/)
      expect(text).not.toContain(catalog.Hero.descriptions.contact)
      const form = contact.find(({ url }) => url.endsWith('#send-request'))
      for (const topic of Object.values(catalog.Contact.form.topics))
        expect(form?.body).toContain(topic)
      const platforms = contact.find(({ url }) => url.endsWith('#page-sections'))
      expect(platforms?.title).toBe(catalog.Contact.platforms.title)
      expect(platforms?.body).toContain('Green H2A')
      expect(platforms?.body).toContain(catalog.Contact.platforms.greenH2.description)
      const faq = contact.find(({ url }) => url.endsWith('#practical-questions'))
      for (const question of Object.values(catalog.Contact.faq.questions)) {
        expect(faq?.body).toContain(question.question)
        expect(faq?.body).toContain(question.answer)
      }
      const location = contact.find(({ url }) => url.endsWith('#locations'))
      expect(location?.title).toBe(catalog.Contact.location.title)
      expect(location?.body).toContain(catalog.Contact.location.mapTitle)
    },
  )

  it('registers every public page and nested section in its own locale with a canonical destination', () => {
    const documents = staticSearchDocuments()
    expect(new Set(documents.map(({ id }) => id)).size).toBe(documents.length)
    for (const locale of contentLocales) {
      for (const pageId of pageIds) {
        if (pageId === 'search') {
          expect(documents.some(({ id }) => id === `page:search:${locale}`)).toBe(false)
          continue
        }
        expect(documents.find(({ id }) => id === `page:${pageId}:${locale}`)).toMatchObject({
          locale,
          url: pageHref(pageId, locale),
          type: 'page',
        })
        for (const section of pageSections[pageId]) {
          for (const entry of [section, ...(section.children ?? [])]) {
            expect(
              documents.find(({ id }) => id === `section:${pageId}:${entry.id}:${locale}`),
            ).toMatchObject({ locale, type: 'section', url: pageHref(pageId, locale, entry.id) })
          }
        }
      }
    }
    expect(documents.every(({ title, body }) => title.trim() && body.trim())).toBe(true)
    expect(documents.some(({ url }) => url.includes('/docs/') || url.includes('.local'))).toBe(
      false,
    )
  })

  it('references all served meaningful public files and keeps responsive crops under their original result', () => {
    const references = new Set(publicAssetReferences.map(({ url }) => url))
    const derivatives = new Set<string>(Object.values(heroImages).map(({ mobile }) => mobile.src))
    const publicRoot = path.resolve(process.cwd(), 'public')
    const publicFiles = readdirSync(publicRoot, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
      .map((entry) => `/${path.relative(publicRoot, path.join(entry.parentPath, entry.name))}`)
    expect(new Set(publicAssetReferences.map(({ id }) => id)).size).toBe(
      publicAssetReferences.length,
    )
    for (const file of publicFiles)
      expect(references.has(file) || derivatives.has(file), file).toBe(true)
    for (const asset of publicAssetReferences) {
      expect(existsSync(path.join(publicRoot, asset.url))).toBe(true)
      expect(derivatives.has(asset.url)).toBe(false)
      for (const locale of contentLocales) {
        expect(asset.text[locale]?.title.trim()).toBeTruthy()
        expect(asset.text[locale]?.description.trim()).toBeTruthy()
      }
    }
    for (const image of Object.values(heroImages)) expect(references.has(image.src)).toBe(true)
    expect(
      publicAssetReferences.filter(({ url }) => url.startsWith('/images/contact/')),
    ).toMatchObject([
      {
        id: 'contact-venue',
        url: '/images/contact/contact-background-venue.jpg',
        type: 'media',
      },
    ])
    expect(references.has('/images/contact/contact-background-79bad501a298.png')).toBe(false)
    const formerContactImage = publicAssetReferences.find(({ id }) => id === 'hero-wind-detail')!
    for (const locale of contentLocales) {
      expect(formerContactImage.text[locale]?.title).not.toContain(
        { fr, en, ar }[locale].Pages.contact,
      )
      expect(formerContactImage.text[locale]?.description).not.toContain(
        { fr, en, ar }[locale].Hero.descriptions.contact,
      )
    }
  })

  it('changes the catalog fingerprint when approved searchable content changes', () => {
    const documents = staticSearchDocuments()
    expect(catalogRevision(documents)).toBe(catalogRevision([...documents]))
    expect(catalogRevision(documents)).not.toBe(
      catalogRevision(
        documents.map((entry, index) => (index ? entry : { ...entry, body: 'New copy' })),
      ),
    )
  })
})

it('indexes the detailed collaboration and transfer content in every language at reachable anchors', () => {
  const documents = staticSearchDocuments()
  for (const locale of contentLocales) {
    const catalog = { fr, en, ar }[locale]
    for (const pageId of ['workWithUs', 'transfer'] as const) {
      const page = documents.find(({ id }) => id === `page:${pageId}:${locale}`)!
      for (const section of pageSections[pageId]) {
        const copies = catalog.Engagement[pageId].sections as Record<
          string,
          { items: { description: string }[]; checklist: string[] }
        >
        const copy = copies[section.id]
        const item = documents.find(({ url }) => url === pageHref(pageId, locale, section.id))!
        expect(item.type).toBe('section')
        for (const text of [
          ...copy.items.map(({ description }) => description),
          ...copy.checklist,
        ]) {
          expect(item.body).toContain(text)
          expect(page.body).toContain(text)
        }
      }
    }
  }
})
