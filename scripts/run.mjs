import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
try {
  process.loadEnvFile(path.join(root, '.env.local'))
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

// Cloud runtimes may restrict the home directory. Native loaders need a private writable cache.
process.env.XDG_CACHE_HOME ??= path.join(root, '.cache/native')
process.env.npm_config_cache ??= path.join(root, '.cache/npm')
mkdirSync(process.env.XDG_CACHE_HOME, { recursive: true, mode: 0o700 })

const [command, ...args] = process.argv.slice(2)
const packages = {
  next: 'next',
  eslint: 'eslint',
  tsc: 'typescript',
  prettier: 'prettier',
  vitest: 'vitest',
  payload: 'payload',
  playwright: '@playwright/test',
  tsx: 'tsx',
}
let binary
if (command === 'node') {
  binary = args.shift()
} else {
  const packageName = packages[command]
  if (!packageName) throw new Error(`Unsupported development command: ${command}`)
  const manifestPath = path.join(root, 'node_modules', packageName, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const relativeBin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin[command]
  binary = path.resolve(path.dirname(manifestPath), relativeBin)
}
if (!binary) throw new Error('A script path is required.')
const child = spawn(process.execPath, [binary, ...args], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
})
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
child.on('error', (error) => {
  console.error(error.message)
  process.exitCode = 1
})
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exitCode = code ?? 1
})
