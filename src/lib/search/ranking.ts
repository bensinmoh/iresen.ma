import { normalizeSearchText, searchWordMatch, type PreparedSearchQuery } from './normalization'
import type { SearchDocument, SearchItem } from './types'

function tokenScore(words: string[], token: string, exact: number, prefix: number): number {
  if (words.includes(token)) return exact
  if (words.some((word) => word.startsWith(token))) return prefix
  return words.some((word) => searchWordMatch(word, token) === 'variant') ? prefix * 0.75 : 0
}

function excerpt(document: SearchDocument, tokens: string[]): string {
  const summary = document.summary.trim()
  const sentences = [summary, ...(document.body.match(/[^.!?。؟]+[.!?。؟]?/gu) ?? [])]
  const best = sentences
    .map((sentence, index) => ({
      sentence: sentence.trim(),
      index,
      matches: tokens.filter((token) =>
        normalizeSearchText(sentence)
          .split(' ')
          .some((word) => searchWordMatch(word, token)),
      ).length,
    }))
    .sort((left, right) => right.matches - left.matches || left.index - right.index)[0]
  const sentence = best?.sentence || summary
  const characters = [...sentence]
  if (characters.length <= 200) return sentence
  // Center a long paragraph around its first keyword, preserving original display text.
  const matchedWord = [...sentence.matchAll(/[\p{L}\p{N}][\p{L}\p{N}\p{M}\u0640]*/gu)].find(
    (word) => tokens.some((token) => searchWordMatch(normalizeSearchText(word[0]), token)),
  )
  // Original offsets matter when Arabic marks or compatibility forms change folded length.
  const firstMatch = matchedWord ? [...sentence.slice(0, matchedWord.index)].length : 0
  const start = Math.max(0, firstMatch - 60)
  const clipped = characters
    .slice(start, start + 200)
    .join('')
    .trim()
  return `${start > 0 ? '…' : ''}${clipped}${start + 200 < characters.length ? '…' : ''}`
}

/** AND across query words, with exact words and title matches ahead of body-only matches. */
export function rankSearchDocuments(
  documents: SearchDocument[],
  query: PreparedSearchQuery,
): SearchItem[] {
  if (!query.valid) return []
  const ranked = documents.flatMap((document) => {
    const title = normalizeSearchText(document.title)
    const summary = normalizeSearchText(document.summary)
    const keywords = normalizeSearchText(document.keywords ?? '')
    const body = normalizeSearchText(document.body)
    const titleWords = title.split(' ')
    const summaryWords = summary.split(' ')
    const keywordWords = keywords.split(' ')
    const bodyWords = body.split(' ')
    let score = title === query.normalized ? 1000 : 0
    if (title.startsWith(query.normalized)) score += 300
    else if (` ${title} `.includes(` ${query.normalized} `)) score += 200
    if (` ${summary} `.includes(` ${query.normalized} `)) score += 100
    if (` ${body} `.includes(` ${query.normalized} `)) score += 30

    for (const token of query.tokens) {
      const wordScore =
        tokenScore(titleWords, token, 90, 65) +
        tokenScore(summaryWords, token, 25, 20) +
        tokenScore(keywordWords, token, 15, 10) +
        tokenScore(bodyWords, token, 8, 5)
      if (!wordScore) return []
      score += wordScore
    }

    const { id, pageId, type, locale, url, publishedAt } = document
    const item: SearchItem = {
      id,
      pageId,
      type,
      locale,
      url,
      title: document.title,
      excerpt: excerpt(document, query.tokens),
      ...(publishedAt ? { publishedAt } : {}),
    }
    return [{ score, item }]
  })
  const collator = new Intl.Collator(documents[0]?.locale ?? 'fr')
  return ranked
    .sort(
      (left, right) =>
        right.score - left.score ||
        collator.compare(left.item.title, right.item.title) ||
        left.item.id.localeCompare(right.item.id),
    )
    .map(({ item }) => item)
}
