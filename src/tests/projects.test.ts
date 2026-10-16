import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { GET } from '@/app/(frontend)/api/projects/[id]/note/route'
import { staticSearchDocuments } from '@/lib/search/catalog'
import editorial from '@/data/project-editorial-fr.json' with { type: 'json' }
import { contentLocales } from '@/lib/content/publication'

describe('withdrawn demonstration projects', () => {
  it('removes the dataset and generated attachments and closes old download URLs', async () => {
    expect(existsSync('src/data/projects-demo.json')).toBe(false)
    expect(existsSync('src/data/project-notes/manifest.json')).toBe(false)
    const response = await GET(
      new Request('http://localhost/api/projects/demo-001/note?locale=fr'),
      { params: Promise.resolve({ id: 'demo-001' }) },
    )
    expect(response.status).toBe(404)
    expect(response.headers.get('cache-control')).toContain('no-store')
  })
  it('indexes the restored catalogue in every locale without fictional resources', () => {
    const docs = staticSearchDocuments()
    for (const locale of contentLocales) {
      expect(docs.find((d) => d.id === `page:projects:${locale}`)?.body).toBeTruthy()
      expect(
        docs.filter((d) => d.id.startsWith('asset:projects-') && d.locale === locale),
      ).toHaveLength(1)
    }
    expect(
      docs.some((d) => /SOL-THERM|demo-001|project-consortium-logo:/.test(d.id + d.body)),
    ).toBe(false)
  })
})

describe('project editorial reading lengths', () => {
  it('keeps brief previews and homogeneous descriptions, with compact distinct objectives', () => {
    const entries = Object.values(editorial)
    expect(entries).toHaveLength(60)
    for (const entry of entries) {
      expect(entry.summary.length).toBeLessThanOrEqual(150)
      expect(entry.description.length).toBeGreaterThanOrEqual(350)
      expect(entry.description.length).toBeLessThanOrEqual(450)
      expect(entry.objectives.length).toBeGreaterThan(1)
      expect(new Set(entry.objectives).size).toBe(entry.objectives.length)
      expect(entry.objectives.every((text) => !text.includes('\n'))).toBe(true)
    }
  })
})
