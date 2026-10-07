export const contentLocales = ['fr', 'en', 'ar'] as const
export type ContentLocale = (typeof contentLocales)[number]
export type PublicationState = 'draft' | 'review' | 'published'

export function isContentLocale(value: unknown): value is ContentLocale {
  return contentLocales.includes(value as ContentLocale)
}

export function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/** The initial structured body must contain real text, not an empty editor root. */
export function hasRichText(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const node = value as { text?: unknown; children?: unknown; root?: unknown }
  if (hasText(node.text)) return true
  if (node.root && hasRichText(node.root)) return true
  return Array.isArray(node.children) && node.children.some(hasRichText)
}

export function missingPublicationFields(
  data: Record<string, unknown>,
  kind: 'pages' | 'news' | 'media',
): string[] {
  const required = kind === 'media' ? ['title', 'alt', 'rights'] : ['title', 'slug', 'summary']
  const missing = required.filter((field) => !hasText(data[field]))
  if (kind !== 'media' && !hasRichText(data.body)) missing.push('body')
  if (kind === 'pages' && !hasText(data.pageId)) missing.push('pageId')
  if (kind === 'news' && !hasText(data.publishedAt)) missing.push('publishedAt')
  return missing
}
