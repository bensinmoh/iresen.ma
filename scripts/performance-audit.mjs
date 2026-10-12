import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
const [phase, port] = process.argv.slice(2).filter((value) => value !== '--')
if (
  !phase ||
  !/^[a-z0-9-]+$/i.test(phase) ||
  !/^\d+$/.test(port ?? '') ||
  Number(port) < 1 ||
  Number(port) > 65535
)
  throw new Error('Usage: pnpm audit:performance <phase> <local-port>')
const chrome =
  process.env.CHROME_PATH ||
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined)
const dir = `.local/handoff-review/${phase}`
mkdirSync(dir, { recursive: true })
const routes = {
  home: '/fr',
  programmes: '/fr/recherche-innovation/programmes',
  projects: '/fr/recherche-innovation/projets',
  publications: '/fr/ressources/publications-rapports',
  search: '/fr/recherche?q=hydrogene',
  contact: '/fr/contact',
}
const out = {
  phase,
  date: new Date().toISOString(),
  profile: 'Lighthouse default mobile, cold cache; 3 sequential runs per route',
  routes: {},
}
for (const [key, route] of Object.entries(routes)) {
  if (process.env.PERFORMANCE_ROUTES && !process.env.PERFORMANCE_ROUTES.split(',').includes(key))
    continue
  let runs = []
  for (let i = 1; i <= 3; i++) {
    const file = `${dir}/${key}-${i}.json`
    const cached = existsSync(file) ? JSON.parse(readFileSync(file)) : null
    const result =
      cached && !cached.runtimeError
        ? { status: 0 }
        : spawnSync(
            'pnpm',
            [
              'dlx',
              'lighthouse@13.5.0',
              `http://127.0.0.1:${port}${route}`,
              ...(chrome ? [`--chrome-path=${chrome}`] : []),
              '--chrome-flags=--headless --no-sandbox',
              '--only-categories=performance',
              '--output=json',
              `--output-path=${file}`,
              '--quiet',
            ],
            { stdio: 'inherit' },
          )
    if (result.status !== 0) throw Error(`Audit failed: ${key}-${i}`)
    const r = JSON.parse(readFileSync(file))
    if (r.runtimeError) throw Error(JSON.stringify(r.runtimeError))
    const a = r.audits
    runs.push({
      score: r.categories.performance.score * 100,
      lcp: a['largest-contentful-paint'].numericValue,
      cls: a['cumulative-layout-shift'].numericValue,
      tbt: a['total-blocking-time'].numericValue,
      transfer: a['total-byte-weight'].numericValue,
      js: a['network-requests'].details.items
        .filter((x) => x.resourceType === 'Script')
        .reduce((sum, x) => sum + x.transferSize, 0),
    })
    console.log(phase, key, i, runs.at(-1))
  }
  out.routes[key] = {
    route,
    runs,
    median: Object.fromEntries(
      Object.keys(runs[0]).map((k) => [k, runs.map((x) => x[k]).sort((a, b) => a - b)[1]]),
    ),
  }
  writeFileSync(`${dir}/summary.json`, JSON.stringify(out, null, 2) + '\n')
}
