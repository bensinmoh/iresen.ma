import pg from 'pg'

if (!process.env.DATABASE_URL)
  throw new Error('DATABASE_URL is required. Run pnpm setup:local first.')

const deadline = Date.now() + 60_000
let ready = false
while (Date.now() < deadline) {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 2000,
  })
  try {
    await client.connect()
    await client.query('SELECT 1')
    ready = true
    break
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  } finally {
    await client.end().catch(() => {})
  }
}
if (!ready)
  throw new Error(
    'PostgreSQL did not become ready. Check docker compose logs db and local configuration.',
  )
console.log('PostgreSQL accepts authenticated queries.')
