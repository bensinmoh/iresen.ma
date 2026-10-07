import { randomBytes } from 'node:crypto'
import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const destination = resolve('.env.local')
if (existsSync(destination)) {
  console.log('.env.local already exists; preserved without changes.')
} else {
  const databasePassword = randomBytes(24).toString('hex')
  const secret = randomBytes(48).toString('hex')
  writeFileSync(
    destination,
    [
      '# Private development configuration. Never commit this file.',
      'POSTGRES_USER=iresen',
      'POSTGRES_DB=iresen',
      `POSTGRES_PASSWORD=${databasePassword}`,
      `DATABASE_URL=postgresql://iresen:${databasePassword}@127.0.0.1:5432/iresen`,
      `PAYLOAD_SECRET=${secret}`,
      'NEXT_PUBLIC_SITE_URL=http://localhost:3000',
      'SITE_INDEXING_ENABLED=false',
      '',
    ].join('\n'),
    { mode: 0o600, flag: 'wx' },
  )
  console.log(
    'Created private .env.local with random development secrets. No CMS account was created.',
  )
}
