import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { chromium } from '@playwright/test'
import { findProjects } from '../src/lib/projects'
import { projectNotesDirectory, projectNoteState } from '../src/lib/project-notes'
import { searchDatabase } from '../src/lib/search/database'
import type { Locale } from '../src/i18n/locales'
import type { ProjectRecord } from '../src/lib/projects-model'
import fr from '../src/messages/fr.json' with { type: 'json' }
import en from '../src/messages/en.json' with { type: 'json' }
import ar from '../src/messages/ar.json' with { type: 'json' }

// Retain the existing PDF wording until the owner commissions the updated list.
// The interface notice was withdrawn independently; existing files are untouched.
const pdfSourceNotice: Record<Locale, string> = {
  fr: 'Les informations décrivent les projets à la date de leur fiche source ; les objectifs ne constituent pas des résultats acquis.',
  en: 'Information reflects the projects as documented in the source records; objectives are not achieved results.',
  ar: 'تعكس المعلومات ما ورد في البطاقات المصدرية للمشاريع؛ ولا تمثل الأهداف نتائج محققة.',
}

const root = process.cwd()
const output = projectNotesDirectory()
await mkdir(output, { recursive: true, mode: 0o700 })
const requested = process.argv.slice(2)
const locales: Locale[] = requested.length
  ? requested.filter((v): v is Locale => ['fr', 'en', 'ar'].includes(v))
  : ['fr', 'en', 'ar']
if (!locales.length) throw new Error('Choose fr, en or ar.')
const latin = (
  await readFile(
    path.join(root, 'src/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-variable.woff2'),
  )
).toString('base64')
const arabic = (
  await readFile(path.join(root, 'src/fonts/alexandria/alexandria-arabic-variable.woff2'))
).toString('base64')
const logo = (await readFile(path.join(root, 'public/brand/logo-primary.svg'))).toString('base64')
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  )

function html(project: ProjectRecord, locale: Locale) {
  const t = { fr, en, ar }[locale].Projects
  const metadata = [
    [t.programme, project.programme],
    [t.launch, project.startText[locale]],
    [t.location, project.location[locale]],
    [t.coordinator, project.details.coordinator.name[locale]],
  ].filter(([, value]) => value)
  const contact = project.details.coordinator
  const noteTitle = { fr: 'Fiche projet', en: 'Project brief', ar: 'بطاقة المشروع' }[locale]
  return `<!doctype html><html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><title>${escape(project.acronym)} | IRESEN</title><style>
  @font-face{font-family:Jakarta;src:url(data:font/woff2;base64,${latin});font-weight:100 900}
  @font-face{font-family:Alexandria;src:url(data:font/woff2;base64,${arabic});font-weight:100 900}
  @page{size:A4;margin:16mm 17mm}*{box-sizing:border-box}body{margin:0;color:#12345A;font:12px/1.65 ${locale === 'ar' ? 'Alexandria' : 'Jakarta'},sans-serif}
  header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dce4eb;padding-bottom:16px;margin-bottom:24px}header img{width:110px;height:auto}header span{font-size:11px;color:#476180}
  .theme{color:#296BB4;font-size:10px;font-weight:600;margin:0 0 8px}h1{font-size:29px;line-height:1.2;letter-spacing:-.02em;margin:0 0 10px}h2{font-size:17px;line-height:1.5;margin:0 0 18px;font-weight:600}.description{padding:16px;background:#f2f6fa;margin:0 0 18px}p{margin:0 0 10px}
  dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 24px;margin:0 0 22px;padding:0 0 18px;border-bottom:1px solid #dce4eb}dt{font-size:9px;color:#476180;margin-bottom:4px}dd{margin:0;font-size:11px;font-weight:600;overflow-wrap:anywhere}h3{font-size:13px;margin:0 0 8px}ul{margin:0;padding-inline-start:18px}li{margin:0;padding:0;line-height:1.65;break-inside:avoid}section{margin-bottom:20px}footer{margin-top:20px;padding-top:12px;border-top:1px solid #dce4eb;font-size:9px;color:#476180;overflow-wrap:anywhere}.contact{display:flex;gap:14px;flex-wrap:wrap;margin-top:14px}a{color:#296BB4;text-decoration:none}.review{color:#476180;font-size:10px;margin-top:8px}bdi{unicode-bidi:isolate}
  </style></head><body><header><img src="data:image/svg+xml;base64,${logo}" alt="IRESEN"><span>${noteTitle}</span></header>
  <p class="theme">${escape(project.theme[locale])}</p><h1><bdi>${escape(project.acronym)}</bdi></h1><h2>${escape(project.title[locale])}</h2>
  <p class="description">${escape(project.description[locale])}</p>
  <dl>${metadata.map(([label, value]) => `<div><dt>${escape(label!)}</dt><dd><bdi>${escape(value!)}</bdi></dd></div>`).join('')}</dl>
  <section><h3>${escape(t.objectives)}</h3><ul>${project.details.objectives[locale].map((text) => `<li>${escape(text)}</li>`).join('')}</ul></section>
  <div class="contact">${contact.email ? `<a href="mailto:${escape(contact.email)}"><bdi>${escape(contact.email)}</bdi></a>` : ''}${contact.phone ? `<span><bdi>${escape(contact.phone)}</bdi></span>` : ''}</div>
  <footer><p>${escape(pdfSourceNotice[locale])}</p><p><bdi>${escape(project.sourceUrl)}</bdi></p>${locale !== 'fr' ? `<p class="review">${escape(t.reviewNotice)}</p>` : ''}</footer></body></html>`
}

const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : {}),
})
try {
  const page = await browser.newPage()
  for (const locale of locales) {
    const projects = await findProjects(locale)
    if (!projects.length)
      throw new Error(
        `No readable projects for ${locale}; enable explicit local review for pending translations.`,
      )
    for (const entry of projects) {
      const before = await projectNoteState(entry.id, locale)
      const project = (await findProjects(locale, entry.id))[0]
      if (!before || !project) throw new Error('The project is no longer readable.')
      await page.setContent(html(project, locale), { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      const bytes = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        tagged: true,
      })
      const current = await projectNoteState(project.id, locale)
      if (current?.revision !== before.revision)
        throw new Error(`Project changed during generation: ${project.id}/${locale}`)
      const filename = `${project.id}-${locale}.pdf`
      const target = path.join(output, filename)
      await writeFile(target + '.tmp', bytes, { mode: 0o600 })
      await rename(target + '.tmp', target)
      await searchDatabase().query(
        `INSERT INTO project_notes(project_id,locale,content_revision,filename,sha256) VALUES($1,$2,$3,$4,$5)
        ON CONFLICT(project_id,locale) DO UPDATE SET content_revision=EXCLUDED.content_revision,filename=EXCLUDED.filename,sha256=EXCLUDED.sha256,generated_at=now()`,
        [
          current.project_id,
          locale,
          current.revision,
          filename,
          createHash('sha256').update(bytes).digest('hex'),
        ],
      )
      console.log(`Generated ${project.id}/${locale}`)
    }
  }
} finally {
  await browser.close()
  await searchDatabase().end()
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')
  await (await getPayload({ config })).destroy()
}

// All writes and teardown have completed; close residual library timers in this one-shot CLI.
process.exit(0)
