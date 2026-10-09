/** Original text is retained for display. Arabic has no built-in PostgreSQL stemmer. */
export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/ـ/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

export function searchTokens(query: string): string[] {
  return [...new Set(normalizeSearchText(query).split(' ').filter(Boolean))].slice(0, 12)
}

export function hasControlCharacters(text: string): boolean {
  return Array.from(text).some(
    (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
  )
}

function normalizedPositions(text: string) {
  let normalized = ''
  const positions: { start: number; end: number }[] = []
  let offset = 0
  for (const character of text) {
    const start = offset
    offset += character.length
    // Decompose per codepoint to map accent-insensitive matches onto original text.
    const value = normalizeSearchText(character)
    if (value) {
      normalized += value
      for (let i = 0; i < value.length; i++) positions.push({ start, end: offset })
    } else if (/\p{M}|ـ/u.test(character)) {
      if (positions.length) positions[positions.length - 1].end = offset
    } else if (normalized && !normalized.endsWith(' ')) {
      normalized += ' '
      positions.push({ start, end: offset })
    }
  }
  return { normalized, positions }
}

/** Text segments, never HTML. Safe to render directly in React with <mark>. */
export function highlightSearchText(
  text: string,
  query: string,
): { text: string; match: boolean }[] {
  const { normalized, positions } = normalizedPositions(text)
  const spans: { start: number; end: number }[] = []
  for (const token of searchTokens(query)) {
    let offset = 0
    while (offset < normalized.length) {
      const start = normalized.indexOf(token, offset)
      if (start < 0) break
      const first = positions[start]
      const last = positions[start + token.length - 1]
      if (first && last) spans.push({ start: first.start, end: last.end })
      offset = start + token.length
    }
  }
  spans.sort((a, b) => a.start - b.start)
  const merged: typeof spans = []
  for (const span of spans) {
    const previous = merged.at(-1)
    if (previous && previous.end >= span.start) previous.end = Math.max(previous.end, span.end)
    else merged.push({ ...span })
  }
  const output: { text: string; match: boolean }[] = []
  let offset = 0
  for (const span of merged) {
    if (span.start > offset) output.push({ text: text.slice(offset, span.start), match: false })
    output.push({ text: text.slice(span.start, span.end), match: true })
    offset = span.end
  }
  if (offset < text.length) output.push({ text: text.slice(offset), match: false })
  return output.length ? output : [{ text, match: false }]
}

export function searchExcerpt(text: string, query: string, length = 240): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= length) return clean
  const { normalized, positions } = normalizedPositions(clean)
  const matches = searchTokens(query)
    .map((token) => normalized.indexOf(token))
    .filter((index) => index >= 0)
  const match = matches.length ? (positions[Math.min(...matches)]?.start ?? 0) : 0
  let start = Math.max(0, match - 75)
  if (start) {
    const boundary = clean.lastIndexOf(' ', start)
    if (boundary >= Math.max(0, start - 30)) start = boundary + 1
  }
  let end = Math.min(clean.length, start + length)
  if (end < clean.length) {
    const boundary = clean.lastIndexOf(' ', end)
    if (boundary > start) end = boundary
  }
  return `${start ? '…' : ''}${clean.slice(start, end)}${end < clean.length ? '…' : ''}`
}

/** Index only text nodes; never serialized CMS data, internal notes or link URLs. */
export function richTextPlainText(value: unknown): string {
  const parts: string[] = []
  let visited = 0
  let remaining = 100_000
  function visit(node: unknown, depth: number) {
    if (
      !node ||
      typeof node !== 'object' ||
      depth > 50 ||
      visited >= 20_000 ||
      remaining <= 0 ||
      parts.length > 10_000
    )
      return
    visited++
    const record = node as { type?: unknown; text?: unknown; children?: unknown; root?: unknown }
    if (record.type === 'upload') return
    if (typeof record.text === 'string') {
      const text = record.text.slice(0, remaining)
      remaining -= text.length
      parts.push(text)
    }
    if (record.root) visit(record.root, depth + 1)
    if (Array.isArray(record.children))
      for (const child of record.children) {
        if (visited >= 20_000 || remaining <= 0) break
        visit(child, depth + 1)
      }
  }
  visit(value, 0)
  return parts.join(' ').slice(0, 100_000)
}

export function richTextSections(
  value: unknown,
): { anchor: string; title: string; body: string }[] {
  const root = (value as { root?: { children?: unknown[] } } | null)?.root
  const sections: { anchor: string; title: string; body: string }[] = []
  if (!Array.isArray(root?.children)) return sections
  let remaining = 100_000
  for (const [index, child] of root.children.entries()) {
    if (index >= 2000 || sections.length >= 200 || remaining <= 0) break
    const node = child as { type?: string }
    if (node?.type === 'heading') {
      const title = richTextPlainText(child).slice(0, Math.min(remaining, 1000))
      remaining -= title.length
      if (title) sections.push({ anchor: `content-section-${index}`, title, body: '' })
    } else if (sections.length) {
      const section = sections[sections.length - 1]
      const text = richTextPlainText(child).slice(0, remaining)
      remaining -= text.length
      section.body = `${section.body} ${text}`.trim().slice(0, 100_000)
    }
  }
  return sections
}
