export const SEARCH_MIN_QUERY_LENGTH = 2
export const SEARCH_MAX_QUERY_LENGTH = 120
export const SEARCH_PAGE_SIZE = 8

export type PreparedSearchQuery = {
  query: string
  normalized: string
  tokens: string[]
  valid: boolean
}

/** Search-only folding. The original public text is always used for display. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/\p{M}/gu, '')
    .replace(/\u0640/gu, '')
    .replace(/[ىی]/gu, 'ي')
    .replace(/ک/gu, 'ك')
    .replace(/œ/gu, 'oe')
    .replace(/æ/gu, 'ae')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

export function prepareSearchQuery(rawQuery: string): PreparedSearchQuery {
  const query = typeof rawQuery === 'string' ? rawQuery.trim().replace(/\s+/gu, ' ') : ''
  if (query.length > SEARCH_MAX_QUERY_LENGTH * 2 || [...query].length > SEARCH_MAX_QUERY_LENGTH) {
    return { query, normalized: '', tokens: [], valid: false }
  }
  const normalized = normalizeSearchText(query)
  const tokens = [...new Set(normalized.split(' ').filter(Boolean))]
  return {
    query,
    normalized,
    tokens,
    valid: [...normalized.replace(/ /gu, '')].length >= SEARCH_MIN_QUERY_LENGTH,
  }
}

/** Conservative Arabic definite-article forms, including attached conjunctions/prepositions. */
function arabicWordVariants(word: string): string[] {
  if (!/^\p{Script=Arabic}+$/u.test(word)) return []
  const forms = new Set<string>()
  function addDefiniteForm(form: string) {
    const article = form.match(/^ال(.{3,})$/u)
    if (article) forms.add(article[1]!)
    const attachedArticle = form.match(/^[وفبك]ال(.{3,})$/u)
    if (attachedArticle) {
      forms.add(`ال${attachedArticle[1]}`)
      forms.add(attachedArticle[1]!)
    }
    const contractedArticle = form.match(/^لل(.{3,})$/u)
    if (contractedArticle) {
      forms.add(`ال${contractedArticle[1]}`)
      forms.add(contractedArticle[1]!)
    }
  }
  addDefiniteForm(word)
  // A conjunction can precede a preposition and the definite article: وبالبحث، وللبحث.
  if (/^[وف](?:[بك]ال|لل).{3,}$/u.test(word)) {
    forms.add(word.slice(1))
    addDefiniteForm(word.slice(1))
  }
  return [...forms]
}

/** Literal matches take precedence. Arabic variants are intentionally lower-weight matches. */
export function searchWordMatch(
  word: string,
  token: string,
): 'exact' | 'prefix' | 'variant' | null {
  if (word === token) return 'exact'
  if (word.startsWith(token)) return 'prefix'
  const words = [word, ...arabicWordVariants(word)]
  const tokens = [token, ...arabicWordVariants(token)]
  return words.some((form) => tokens.some((query) => form.startsWith(query))) ? 'variant' : null
}
