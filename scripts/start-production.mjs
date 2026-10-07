import { cpSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const build = path.resolve('.next/standalone')
const server = path.join(build, 'server.js')
if (!existsSync(server)) throw new Error('Production build is missing. Run pnpm build first.')

// Next's standalone output deliberately omits public/static assets. Include them before startup.
mkdirSync(path.join(build, '.next'), { recursive: true })
cpSync(path.resolve('public'), path.join(build, 'public'), { recursive: true })
cpSync(path.resolve('.next/static'), path.join(build, '.next/static'), { recursive: true })
process.env.HOSTNAME = process.env.APP_HOSTNAME ?? '0.0.0.0'
await import(pathToFileURL(server).href)
