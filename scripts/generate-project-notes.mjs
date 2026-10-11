import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync(path.join(root, '.cache/playwright')))
  process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(root, '.cache/playwright')
const { chromium } = await import('@playwright/test')
const records = JSON.parse(await readFile(path.join(root, 'src/data/projects-demo.json'), 'utf8'))
const copy = Object.fromEntries(
  await Promise.all(
    ['fr', 'en', 'ar'].map(async (locale) => [
      locale,
      JSON.parse(await readFile(path.join(root, `src/messages/${locale}.json`), 'utf8')).Projects,
    ]),
  ),
)
const output = path.join(root, 'src/data/project-notes')
await mkdir(output, { recursive: true })
const latin = (
  await readFile(
    path.join(root, 'src/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-variable.woff2'),
  )
).toString('base64')
const arabic = (
  await readFile(path.join(root, 'src/fonts/alexandria/alexandria-arabic-variable.woff2'))
).toString('base64')
const logo = (await readFile(path.join(root, 'public/brand/logo-primary.svg'))).toString('base64')
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  )
const manifest = {
  sourceSHA256: createHash('sha256').update(JSON.stringify(records)).digest('hex'),
  files: {},
}
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  for (const project of records)
    for (const locale of ['fr', 'en', 'ar']) {
      const t = copy[locale],
        details = project.details,
        contact = details.coordinator
      const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
      const metadata = [
        [t.acronym, project.acronym],
        [t.launch, project.year],
        [t.duration, t.months.replace('{count}', String(project.durationMonths))],
        [t.budget, `${number.format(project.budgetMAD / 1000000)} MMAD`],
        [t.hostingPlatform, details.hostingPlatform[locale]],
        [t.coordinator, `${contact.name[locale]} — ${contact.email}`],
      ]
      await page.setContent(`<!doctype html><html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><title>${escape(t.noteTitle)} - ${escape(project.acronym)}</title><style>
      @font-face{font-family:Jakarta;src:url(data:font/woff2;base64,${latin});font-weight:100 900}
      @font-face{font-family:Alexandria;src:url(data:font/woff2;base64,${arabic});font-weight:100 900}
      @page{size:A4;margin:16mm}
      *{box-sizing:border-box}body{margin:0;color:#153658;font:13px/1.65 ${locale === 'ar' ? 'Alexandria,Jakarta' : 'Jakarta,Alexandria'},sans-serif}
      header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dce4eb;padding-bottom:14px;margin-bottom:20px}header img{width:95px;height:auto}header p{font-size:11px;color:#476180}
      .theme{color:#296BB4;font-size:11px;margin:0 0 6px}h1{font-size:21px;line-height:1.3;margin:0 0 6px;font-weight:700}h2{font-size:16px;line-height:1.5;margin:0 0 12px}p{margin:0 0 10px}.status{display:inline-block;color:#153658;background:#edf3f7;padding:4px 8px;margin:4px 0 12px}
      dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 24px;margin:18px 0;padding:16px 0;border-top:1px solid #dce4eb;border-bottom:1px solid #dce4eb}dt{font-size:10px;color:#476180;margin-bottom:4px}dd{margin:0;font-weight:600;overflow-wrap:anywhere}
      section{margin-bottom:16px;break-inside:avoid}section h2{margin-bottom:8px}.partners{display:flex;flex-wrap:wrap;gap:6px;list-style:none;padding:0}.partners li{background:#f2f5f8;padding:4px 8px;border-radius:6px 0 6px 0}.objectives{padding-inline-start:18px;margin:0}.objectives li{margin-bottom:7px}footer{border-top:1px solid #dce4eb;padding-top:12px;margin-top:18px;color:#476180;font-size:10px;display:flex;justify-content:space-between;gap:12px}bdi{unicode-bidi:isolate}
    </style></head><body>
      <header><img src="data:image/svg+xml;base64,${logo}" alt="IRESEN"><p>${escape(t.noteTitle)} / <bdi>${escape(project.acronym)}</bdi></p></header>
      <p class="theme">${escape(t.domains[project.domain])}</p><h1><bdi>${escape(project.acronym)}</bdi></h1><h2>${escape(project.title[locale])}</h2><span class="status">${escape(t.statuses[project.status])}</span>
      ${details.presentation[locale].map((p) => `<p>${escape(p)}</p>`).join('')}
      <dl>${metadata.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd><bdi>${escape(value)}</bdi></dd></div>`).join('')}</dl>
      <section><h2>${escape(t.consortium)}</h2><ul class="partners">${details.consortium[locale].map((p) => `<li>${escape(p)}</li>`).join('')}</ul></section>
      <section><h2>${escape(t.objectives)}</h2><ul class="objectives">${details.objectives[locale].map((p) => `<li>${escape(p)}</li>`).join('')}</ul></section>
      <footer><span>${escape(t.programme)}: <bdi>${escape(project.programme.replace(/^DEMO-/, ''))}</bdi></span><span><bdi>${escape(contact.email)}</bdi></span></footer>
    </body></html>`)
      await page.evaluate(() => document.fonts.ready)
      const filename = `${project.id}-${locale}.pdf`
      const bytes = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        tagged: true,
      })
      await writeFile(path.join(output, filename), bytes)
      manifest.files[`${project.id}:${locale}`] = {
        filename,
        sha256: createHash('sha256').update(bytes).digest('hex'),
        bytes: bytes.length,
      }
    }
  await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  console.log(`Generated ${Object.keys(manifest.files).length} localized project notes.`)
} finally {
  await browser.close()
}
