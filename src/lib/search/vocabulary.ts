import type { PoolClient } from 'pg'

import { recognizedConceptTerms } from './concepts'
import { searchDatabase } from './database'
import { publicSearchEligibility } from './eligibility'
import { normalizeSearchText } from './text'
import type { SearchLocale } from './types'

export type SpellingCandidate = {
  term: string
  surface: string
  frequency: number
  linguistic?: boolean
}
export const VOCABULARY_VERSION = 1
const MAX_CORRECTION_TOKENS = 4
const MAX_TERM_CANDIDATES = 64

/** Adjacent transpositions count as one edit; runtime and results have an explicit edit budget. */
export function editDistance(left: string, right: string, maxDistance = 2): number {
  const a = Array.from(left)
  const b = Array.from(right)
  if (Math.abs(a.length - b.length) > maxDistance || a.length > 48 || b.length > 48)
    return maxDistance + 1
  const rows = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1)
    }
  return Math.min(rows[a.length][b.length], maxDistance + 1)
}

function isAcronym(word: string): boolean {
  return (
    word.length <= 6 &&
    /\p{L}/u.test(word) &&
    word === word.toUpperCase() &&
    word !== word.toLowerCase()
  )
}

/** Never correct numbers, short words, deliberate prefixes, valid inflections or close ambiguities. */
export function selectSpellingCandidate(
  input: string,
  candidates: SpellingCandidate[],
): SpellingCandidate | undefined {
  const token = normalizeSearchText(input)
  if (token.length < 4 || token.length > 32 || !/^\p{L}+$/u.test(token) || isAcronym(input))
    return undefined
  if (
    candidates.some(
      (candidate) =>
        candidate.term === token || candidate.term.startsWith(token) || candidate.linguistic,
    )
  )
    return undefined
  const maxDistance = token.length < 7 ? 1 : 2
  const ranked = candidates
    .slice(0, MAX_TERM_CANDIDATES)
    .filter((candidate) => !isAcronym(candidate.surface))
    .map((candidate) => ({ candidate, distance: editDistance(token, candidate.term, maxDistance) }))
    .filter(
      ({ candidate, distance }) =>
        distance <= maxDistance && distance / Math.max(token.length, candidate.term.length) <= 0.25,
    )
    .sort(
      (a, b) =>
        a.distance - b.distance ||
        b.candidate.frequency - a.candidate.frequency ||
        a.candidate.term.localeCompare(b.candidate.term),
    )
  const best = ranked[0]
  if (
    !best ||
    ranked.some(
      (other) => other.candidate.term !== best.candidate.term && other.distance === best.distance,
    )
  )
    return undefined
  return best.candidate
}

/** Original surface words come solely from already-authorized, visible title/body projections. */
export function publicVocabularyTerms(
  title: string,
  body: string,
): { term: string; surface: string }[] {
  const terms = new Map<string, string>()
  let inspected = 0
  for (const match of `${title.slice(0, 1000)} ${body.slice(0, 100_000)}`.matchAll(
    /[\p{L}\p{N}\p{M}]+/gu,
  )) {
    if (++inspected > 10_000 || terms.size >= 1000) break
    const surface = match[0]
    const term = normalizeSearchText(surface)
    if (term.length >= 3 && term.length <= 48 && /^\p{L}+$/u.test(term) && !terms.has(term))
      terms.set(term, surface)
  }
  return [...terms].map(([term, surface]) => ({ term, surface }))
}

/** One bounded bulk transaction step per index batch; no corpus scans on search requests. */
export async function writePublicVocabulary(
  client: PoolClient,
  documents: { id: string; locale: SearchLocale; title: string; body: string }[],
): Promise<void> {
  const rows = documents.flatMap((document) =>
    publicVocabularyTerms(document.title, document.body).map((word) => ({
      document_id: document.id,
      locale: document.locale,
      ...word,
    })),
  )
  await client.query(
    `INSERT INTO search_vocabulary_terms (locale,term)
    SELECT DISTINCT locale,term FROM jsonb_to_recordset($1::jsonb) AS word(locale text,term text) ORDER BY locale,term ON CONFLICT DO NOTHING`,
    [JSON.stringify(rows)],
  )
  await client.query('DELETE FROM search_document_vocabulary WHERE document_id=ANY($1::text[])', [
    documents.map(({ id }) => id),
  ])
  await client.query(
    `INSERT INTO search_document_vocabulary (document_id,locale,term,surface)
    SELECT document_id,locale,term,surface FROM jsonb_to_recordset($1::jsonb) AS word(document_id text,locale text,term text,surface text) ON CONFLICT DO NOTHING`,
    [JSON.stringify(rows)],
  )
  await client.query('UPDATE search_documents SET vocabulary_version=$2 WHERE id=ANY($1::text[])', [
    documents.map(({ id }) => id),
    VOCABULARY_VERSION,
  ])
}

/** Batched, indexed candidates; surfaces/frequencies are selected after live access/fingerprint gates. */
export async function suggestSearchQuery(
  query: string,
  locale: SearchLocale,
  revision: string,
): Promise<string | undefined> {
  const words = [...query.matchAll(/[\p{L}\p{N}\p{M}]+/gu)].slice(0, 12)
  const recognized = new Set(recognizedConceptTerms(query, locale))
  const eligible = [
    ...new Set(
      words
        .filter((word) => {
          const token = normalizeSearchText(word[0])
          return (
            token.length >= 4 &&
            token.length <= 32 &&
            /^\p{L}+$/u.test(token) &&
            !isAcronym(word[0]) &&
            !recognized.has(token)
          )
        })
        .map((word) => normalizeSearchText(word[0])),
    ),
  ].slice(0, MAX_CORRECTION_TOKENS)
  if (!eligible.length) return undefined
  const result = await searchDatabase().query<{
    input: string
    term: string
    surface: string
    frequency: string
    linguistic: boolean
  }>(
    `
    WITH requested AS (
      SELECT input,EXISTS (
        SELECT 1 FROM search_documents known WHERE known.locale=$1
          AND (known.search_vector @@ to_tsquery('simple',input || ':*') OR
            known.search_vector @@ plainto_tsquery(CASE $1 WHEN 'fr' THEN 'french'::regconfig WHEN 'en' THEN 'english'::regconfig ELSE 'simple'::regconfig END,input))
          AND ${publicSearchEligibility('known', '$3')} LIMIT 1
      ) AS known FROM unnest($2::text[]) AS word(input)
    ), candidates AS (
      SELECT requested.input, candidate.term FROM requested CROSS JOIN LATERAL (
        SELECT term FROM search_vocabulary_terms WHERE NOT requested.known AND locale=$1 AND term % requested.input
          AND length(term) BETWEEN length(requested.input)-2 AND length(requested.input)+2
        ORDER BY similarity(term,requested.input) DESC, term ASC LIMIT ${MAX_TERM_CANDIDATES}
      ) candidate
    )
    SELECT c.input,c.term,min(v.surface) AS surface,count(DISTINCT v.document_id) AS frequency,
      to_tsvector(CASE $1 WHEN 'fr' THEN 'french'::regconfig WHEN 'en' THEN 'english'::regconfig ELSE 'simple'::regconfig END,c.term)
        @@ plainto_tsquery(CASE $1 WHEN 'fr' THEN 'french'::regconfig WHEN 'en' THEN 'english'::regconfig ELSE 'simple'::regconfig END,c.input) AS linguistic
    FROM candidates c JOIN search_document_vocabulary v ON v.locale=$1 AND v.term=c.term
      JOIN search_documents d ON d.id=v.document_id AND d.locale=$1
    WHERE ${publicSearchEligibility('d', '$3')}
    GROUP BY c.input,c.term`,
    [locale, eligible, revision],
  )
  const corrections = new Map<string, string>()
  for (const token of eligible) {
    const candidates = result.rows
      .filter((candidate) => candidate.input === token)
      .map((candidate) => ({ ...candidate, frequency: Number(candidate.frequency) }))
    const selected = selectSpellingCandidate(token, candidates)
    if (selected) corrections.set(token, selected.surface)
  }
  if (!corrections.size || corrections.size > 2) return undefined
  let output = ''
  let offset = 0
  for (const word of words) {
    const replacement = corrections.get(normalizeSearchText(word[0]))
    if (!replacement) continue
    const start = word.index
    output += query.slice(offset, start)
    const lowered = replacement.toLowerCase()
    output +=
      word[0] === word[0].toUpperCase()
        ? lowered.toUpperCase()
        : word[0][0] === word[0][0].toUpperCase()
          ? lowered[0].toUpperCase() + lowered.slice(1)
          : lowered
    offset = start + word[0].length
  }
  output += query.slice(offset)
  return output !== query && output.length <= 200 ? output : undefined
}
