import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const directory = process.env.NEXT_BUILD_DIRECTORY || '.next'
const build = path.resolve(directory, 'standalone')
let server = path.join(build, 'server.js')
if (!existsSync(server)) throw new Error('Production build is missing. Run pnpm build first.')

// Next's standalone output deliberately omits public/static assets. Include them before startup.
mkdirSync(path.join(build, directory), { recursive: true })
cpSync(path.resolve('public'), path.join(build, 'public'), { recursive: true })
cpSync(path.resolve(directory, 'static'), path.join(build, directory, 'static'), {
  recursive: true,
})
process.env.HOSTNAME = process.env.APP_HOSTNAME ?? '0.0.0.0'
// Custom distDir outputs can contain Next's CommonJS launcher inside an ESM package.
if (readFileSync(server, 'utf8').startsWith("const path = require('path')")) {
  const commonJS = path.join(build, 'server.cjs')
  cpSync(server, commonJS)
  server = commonJS
}
await import(pathToFileURL(server).href)
