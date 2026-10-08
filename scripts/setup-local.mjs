import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseEnv } from 'node:util'

const args = process.argv.slice(2)
let requestedPort
if (args.length > 0) {
  if (args.length !== 2 || args[0] !== '--db-port')
    throw new Error('Usage: pnpm setup:local [--db-port 1-65535]')
  const port = Number(args[1])
  if (!/^\d+$/.test(args[1]) || !Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('--db-port must be an integer from 1 to 65535.')
  requestedPort = String(port)
}

function setEnvValue(source, key, value) {
  const entry = new RegExp(
    `^([\\uFEFF \\t]*(?:export[ \\t]+)?${key}[ \\t]*=[ \\t]*)([^\\r\\n]*)$`,
    'gm',
  )
  const matches = [...source.matchAll(entry)]
  if (matches.length > 1)
    throw new Error(`Cannot safely update duplicate ${key} assignments in .env.local.`)
  if (matches.length === 0) {
    if (key === 'DATABASE_URL')
      throw new Error('Cannot safely update the DATABASE_URL assignment in .env.local.')
    const newline = source.includes('\r\n') ? '\r\n' : '\n'
    const separator = source.endsWith('\n') ? '' : newline
    return `${source}${separator}${key}=${value}${newline}`
  }
  return source.replace(entry, (_, prefix, raw) => {
    const quoted = raw.match(/^(['"])(.*?)\1([ \t]*(?:#.*)?)$/)
    if (quoted) return `${prefix}${quoted[1]}${value}${quoted[1]}${quoted[3]}`
    if (/^['"]/.test(raw))
      throw new Error(`Keep ${key} on one line before changing the database port.`)
    const [, , suffix] = raw.match(/^([^#]*?)([ \t]*(?:#.*)?)$/)
    return `${prefix}${value}${suffix}`
  })
}

function updateDatabasePort(source, port) {
  const { DATABASE_URL: databaseURL } = parseEnv(source)
  let database
  try {
    database = new URL(databaseURL)
  } catch {
    throw new Error('The existing DATABASE_URL must be a local PostgreSQL URL.')
  }
  if (
    !['postgres:', 'postgresql:'].includes(database.protocol) ||
    !['localhost', '127.0.0.1'].includes(database.hostname.toLowerCase()) ||
    /\s/.test(databaseURL)
  )
    throw new Error('Change the port only for a PostgreSQL URL using localhost or 127.0.0.1.')

  const updatedURL = databaseURL.replace(
    /^(postgres(?:ql)?:\/\/(?:[^/?#]*@)?[^:/?#]+)(?::\d*)?(?=[/?#]|$)/i,
    (_, authority) => `${authority}:${port}`,
  )
  return setEnvValue(setEnvValue(source, 'DATABASE_URL', updatedURL), 'POSTGRES_PORT', port)
}

const destination = resolve('.env.local')
if (existsSync(destination)) {
  if (requestedPort === undefined) {
    console.log('.env.local already exists; preserved without changes.')
  } else {
    const updated = updateDatabasePort(readFileSync(destination, 'utf8'), requestedPort)
    writeFileSync(destination, updated)
    console.log(`Updated local PostgreSQL port to ${requestedPort}; existing secrets preserved.`)
  }
} else {
  const databasePort = requestedPort ?? '5432'
  const databasePassword = randomBytes(24).toString('hex')
  const secret = randomBytes(48).toString('hex')
  writeFileSync(
    destination,
    [
      '# Private development configuration. Never commit this file.',
      'POSTGRES_USER=iresen',
      'POSTGRES_DB=iresen',
      `POSTGRES_PASSWORD=${databasePassword}`,
      `POSTGRES_PORT=${databasePort}`,
      `DATABASE_URL=postgresql://iresen:${databasePassword}@127.0.0.1:${databasePort}/iresen`,
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
