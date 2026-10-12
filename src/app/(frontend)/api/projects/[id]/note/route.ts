/** Withdrawn demonstration notes: keep old URLs closed without querying real datasets. */
export function GET() {
  return new Response(null, {
    status: 404,
    headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  })
}
