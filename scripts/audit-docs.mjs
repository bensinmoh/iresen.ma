import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '*.md'],
  { encoding: 'utf8' },
)
  .trim()
  .split('\n')
  .filter((x) => !x.startsWith('.agents/'))
const report = files.map((file) => {
  const text = readFileSync(file, 'utf8')
  const missing = []
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0].replace(/^<|>$/g, '')
    if (
      target &&
      !/^(https?:|mailto:|tel:|skill:|app:|codex:|#)/.test(target) &&
      !existsSync(path.resolve(path.dirname(file), target))
    )
      missing.push(target)
  }
  return {
    file,
    bytes: Buffer.byteLength(text),
    headings: text.split('\n').filter((x) => /^#{1,3} /.test(x)),
    missingLocalFiles: [...new Set(missing)],
    historicalSource: file.startsWith('docs/references/') || file.startsWith('docs/adr/'),
    staleCandidates: text
      .split('\n')
      .filter((x) =>
        /22 (?:pages|routes|stable)|24 (?:.*fiction|.*demonstr)|72 (?:localized|.*PDF)|unless explicitly enabled|distributed rate limiting.*need/i.test(
          x,
        ),
      ),
  }
})
const output = process.argv[2] || '.local/handoff-review/docs-before.json'
mkdirSync(path.dirname(output), { recursive: true })
writeFileSync(output, JSON.stringify(report, null, 2) + '\n')
console.log(
  JSON.stringify(
    {
      reviewed: files.length,
      missing: report.filter((x) => x.missingLocalFiles.length),
      stale: report
        .filter((x) => x.staleCandidates.length)
        .map((x) => ({ file: x.file, candidates: x.staleCandidates })),
    },
    null,
    2,
  ),
)
