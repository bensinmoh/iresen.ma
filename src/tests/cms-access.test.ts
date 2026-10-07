import { describe, expect, it } from 'vitest'

import { canPublish, isAdministrator, isStaff } from '../cms/access/roles'
import { hasRichText, isContentLocale, missingPublicationFields } from '../lib/content/publication'

const body = {
  root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Approved text' }] }] },
}

describe('editorial role boundaries', () => {
  it('permits publication only for publishers and administrators', () => {
    expect(canPublish({ role: 'admin' })).toBe(true)
    expect(canPublish({ role: 'publisher' })).toBe(true)
    expect(canPublish({ role: 'editor' })).toBe(false)
    expect(canPublish(null)).toBe(false)
    expect(canPublish({ role: 'translator' })).toBe(false)
  })
  it('keeps account administration separate from publishing', () => {
    expect(isAdministrator({ role: 'publisher' })).toBe(false)
    expect(isStaff({ role: 'publisher' })).toBe(true)
    expect(isStaff({ role: 'unknown' })).toBe(false)
  })
})

describe('translation publication eligibility', () => {
  it('rejects unsupported and all-locale public requests', () => {
    expect(isContentLocale('fr')).toBe(true)
    expect(isContentLocale('ar')).toBe(true)
    expect(isContentLocale('all')).toBe(false)
    expect(isContentLocale('es')).toBe(false)
  })
  it('distinguishes a blank rich-text editor from actual content', () => {
    expect(hasRichText({ root: { children: [] } })).toBe(false)
    expect(hasRichText({ root: { children: [{ text: '   ' }] } })).toBe(false)
    expect(hasRichText(body)).toBe(true)
  })
  it('requires locale copy, stable page ID and media rights before publication', () => {
    expect(
      missingPublicationFields(
        { title: 'Title', slug: 'title', summary: 'Summary', body, pageId: 'home' },
        'pages',
      ),
    ).toEqual([])
    expect(missingPublicationFields({ pageId: 'home' }, 'pages')).toEqual([
      'title',
      'slug',
      'summary',
      'body',
    ])
    expect(missingPublicationFields({ title: 'Image', alt: 'Description' }, 'media')).toEqual([
      'rights',
    ])
    expect(
      missingPublicationFields({ title: 'Title', slug: 'title', summary: 'Summary', body }, 'news'),
    ).toEqual(['publishedAt'])
  })
})
