import { formatMoney, moneyParts } from './money'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { pageHref } from './site'
import type { Locale } from '../i18n/locales'
import type { ProjectRecord } from './projects-model'
import fr from '../messages/fr.json' with { type: 'json' }
import en from '../messages/en.json' with { type: 'json' }
import ar from '../messages/ar.json' with { type: 'json' }

// A single layout, three message catalogues; all content is escaped and embedded.
async function templateAssets() {
  const root = process.cwd()
  const latin = (
    await readFile(
      path.join(root, 'src/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-variable.woff2'),
    )
  ).toString('base64')
  const arabic = (
    await readFile(path.join(root, 'src/fonts/alexandria/alexandria-arabic-variable.woff2'))
  ).toString('base64')
  const logo = (await readFile(path.join(root, 'public/brand/logo-primary.svg'))).toString('base64')

  return { latin, arabic, logo }
}
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  )

const moneyText = (value: string) =>
  moneyParts(value)
    .map((part, index) => (index % 2 ? `<bdi dir="ltr">${escape(part)}</bdi>` : escape(part)))
    .join('')

export async function projectNoteHtml(project: ProjectRecord, locale: Locale, image?: Buffer) {
  const { latin, arabic, logo } = await templateAssets()
  const t = { fr, en, ar }[locale].Projects
  const metadata = [
    [t.programme, project.programme],
    [t.launch, project.startText[locale]],
    [t.location, project.location[locale]],
    [t.status, project.status ? t.statuses[project.status] : ''],
    [
      t.duration,
      project.durationMonths === null
        ? ''
        : t.months.replace('{count}', String(project.durationMonths)),
    ],
    [t.budget, project.budgetMAD === null ? '' : formatMoney(project.budgetMAD)],
    [t.coordinator, project.details.coordinator.name[locale]],
    [t.coordinatorAffiliation, project.details.coordinator.affiliation[locale]],
  ].filter(([, value]) => value)
  const contact = project.details.coordinator
  const contactLabel = {
    fr: 'Contactez le coordinateur sur :',
    en: 'Contact the coordinator at:',
    ar: 'تواصلوا مع منسق المشروع عبر:',
  }[locale]
  const projectPath = `${pageHref('projects', locale)}?${new URLSearchParams({ project: project.id })}#project-details`
  const projectUrl = `https://www.iresen.ma${projectPath}`
  const noteTitle = { fr: 'Fiche projet', en: 'Project brief', ar: 'بطاقة المشروع' }[locale]
  return `<!doctype html><html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><title>${escape(project.acronym)} | IRESEN</title><style>
  @font-face{font-family:Jakarta;src:url(data:font/woff2;base64,${latin});font-weight:100 900}
  @font-face{font-family:Alexandria;src:url(data:font/woff2;base64,${arabic});font-weight:100 900}
  @page{size:A4;margin:13mm 15mm}*{box-sizing:border-box}body{margin:0;color:#12345A;font:11.5px/1.55 ${locale === 'ar' ? 'Alexandria' : 'Jakarta'},sans-serif}
  header{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dce4eb;padding-bottom:12px;margin-bottom:16px}header img{width:110px;height:auto}header span{font-size:11px;color:#476180}
  .project-image{width:100%;height:115px;object-fit:cover;margin:0 0 16px;border-radius:2px}.theme{color:#296BB4;font-size:10px;font-weight:600;margin:0 0 8px}h1{font-size:29px;line-height:1.2;letter-spacing:-.02em;margin:0 0 10px}h2{font-size:17px;line-height:1.5;margin:0 0 18px;font-weight:600}.description{padding:14px;background:#f2f6fa;margin:0 0 14px}p{margin:0 0 10px}
  dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 24px;margin:0 0 14px;padding:0 0 14px;border-bottom:1px solid #dce4eb}dl>div{break-inside:avoid}dt{font-size:9px;color:#476180;margin-bottom:4px}dd{margin:0;font-size:11px;font-weight:600;overflow-wrap:anywhere}h3{font-size:13px;margin:0 0 8px;break-after:avoid}ul{margin:0;padding-inline-start:18px}li{margin:0;padding:0;line-height:1.65;break-inside:avoid}section{margin-bottom:12px}footer{margin-top:16px;padding-top:12px;border-top:1px solid #dce4eb;font-size:9px;color:#476180;overflow-wrap:anywhere;break-inside:avoid}.contact{display:flex;gap:14px;flex-wrap:wrap;margin-top:14px}a{color:#296BB4;text-decoration:none}bdi{unicode-bidi:isolate}
  </style></head><body><header><img src="data:image/svg+xml;base64,${logo}" alt="IRESEN"><span>${noteTitle}</span></header>
  <p class="theme">${escape(project.theme[locale])}</p><h1><bdi>${escape(project.acronym)}</bdi></h1>${project.title[locale] !== project.acronym ? `<h2>${escape(project.title[locale])}</h2>` : ''}
  ${image ? `<img class="project-image" src="data:image/webp;base64,${image.toString('base64')}" alt="${escape(project.imageIllustration || project.title[locale])}">` : ''}
  <p class="description">${moneyText(project.description[locale])}</p>
  <dl>${metadata.map(([label, value]) => `<div><dt>${escape(label!)}</dt><dd><bdi${label === t.budget ? ' dir="ltr"' : ''}>${escape(value!)}</bdi></dd></div>`).join('')}</dl>
  ${project.details.consortium[locale].length ? `<section><h3>${escape(t.consortium)}</h3>${project.details.consortium[locale].map((text) => `<p>${moneyText(text)}</p>`).join('')}</section>` : ''}
  ${project.details.objectives[locale].length ? `<section><h3>${escape(t.objectives)}</h3><ul>${project.details.objectives[locale].map((text) => `<li>${moneyText(text)}</li>`).join('')}</ul></section>` : ''}
  ${contact.email ? `<div class="contact"><span>${escape(contactLabel)}</span><a href="mailto:${escape(contact.email)}"><bdi>${escape(contact.email)}</bdi></a></div>` : ''}
  <footer dir="ltr"><p><a href="https://www.iresen.ma">www.iresen.ma</a></p><p><a href="${escape(projectUrl)}">${escape(`www.iresen.ma${projectPath}`)}</a></p></footer></body></html>`
}
