import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
  )
const files = walk('public')
const source = walk('src')
  .filter((f) => /\.(tsx?|css|json)$/.test(f))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n')
const hashes = new Map()
for (const file of files) {
  const hash = createHash('sha256').update(readFileSync(file)).digest('hex')
  const group = hashes.get(hash) || []
  group.push({
    file,
    bytes: statSync(file).size,
    referencedLiterally: source.includes('/' + file.replace(/^public\//, '')),
  })
  hashes.set(hash, group)
}
const css = walk('src').filter((f) => f.endsWith('.css') && !f.includes('cms-preview'))
const literals = {}
const usage = {}
for (const file of css) {
  const text = readFileSync(file, 'utf8')
  for (const match of text.matchAll(/#[\da-f]{6,8}\b/gi)) {
    const hex = match[0].toLowerCase()
    ;(literals[hex] ??= []).push(file)
  }
  for (const match of text.matchAll(
    /var\(--color-(navy|blue|science-blue|transition-green|energy-cyan|innovation-lime)\)/g,
  ))
    usage[match[1]] = (usage[match[1]] || 0) + 1
}
const report = {
  date: new Date().toISOString(),
  publicBytes: files.reduce((sum, f) => sum + statSync(f).size, 0),
  duplicateGroups: [...hashes.values()].filter((x) => x.length > 1),
  colorLiterals: literals,
  brandTokenDeclarations: usage,
  method:
    'Byte-identical hashes and literal references; dynamic references require manual review. CSS counts describe source usage, not rendered surface ratios.',
}
const output = process.argv[2] || '.local/handoff-review/assets-before.json'
mkdirSync(path.dirname(output), { recursive: true })
writeFileSync(output, JSON.stringify(report, null, 2) + '\n')
console.log(
  JSON.stringify(
    {
      publicBytes: report.publicBytes,
      duplicateGroups: report.duplicateGroups,
      brandTokenDeclarations: usage,
    },
    null,
    2,
  ),
)
