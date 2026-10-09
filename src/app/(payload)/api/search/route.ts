import { searchAdapter, validateSearchInput } from '@/lib/search/adapter'
import type { SearchInput } from '@/lib/search/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' }

export async function GET(request: Request): Promise<Response> {
  const parameters = new URL(request.url).searchParams
  const input: SearchInput = {
    query: parameters.get('q') ?? '',
    locale: (parameters.get('locale') ?? 'fr') as SearchInput['locale'],
    type: (parameters.get('type') ?? 'all') as SearchInput['type'],
    sort: (parameters.get('sort') ?? 'relevance') as SearchInput['sort'],
    page: parameters.has('page') ? Number(parameters.get('page')) : 1,
  }
  if (!validateSearchInput(input))
    return Response.json({ error: 'Invalid search parameters.' }, { status: 400, headers })
  const result = await searchAdapter.search(input)
  return Response.json(result, { status: result.status === 'available' ? 200 : 503, headers })
}
