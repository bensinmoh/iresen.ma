import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { isLocale } from '@/i18n/locales'
import { demoProjects } from '@/lib/projects'
import { projectNoteManifest, projectNotesMatchSource } from '@/lib/project-notes'

export const runtime = 'nodejs'
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const locale = new URL(request.url).searchParams.get('locale')
  const project = demoProjects.find((record) => record.id === id)
  if (!locale || !isLocale(locale) || !project) return new Response(null, { status: 404 })
  if (!projectNotesMatchSource) return new Response(null, { status: 503 })
  const key = `${project.id}:${locale}` as keyof typeof projectNoteManifest.files
  const file = projectNoteManifest.files[key]
  if (!file) return new Response(null, { status: 404 })
  try {
    const bytes = await readFile(path.join(process.cwd(), 'src/data/project-notes', file.filename))
    return new Response(bytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${project.acronym}-${locale}.pdf"`,
        'Content-Length': String(bytes.length),
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')
      return new Response(null, { status: 404 })
    throw error
  }
}
