import { Pool } from 'pg'

let pool: Pool | undefined

/** A small independent pool keeps search behind a replaceable service boundary. */
export function searchDatabase(): Pool {
  if (!process.env.DATABASE_URL) throw new Error('Search database is not configured.')
  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
    connectionTimeoutMillis: 3_000,
    statement_timeout: 5_000,
    idleTimeoutMillis: 1_000,
    allowExitOnIdle: true,
  })
  return pool
}
