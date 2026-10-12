import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { GET } from '@/app/(frontend)/api/projects/[id]/note/route'
import { staticSearchDocuments } from '@/lib/search/catalog'
import { contentLocales } from '@/lib/content/publication'

describe('withdrawn demonstration projects', () => {
  it('removes the dataset and generated attachments and closes old download URLs', () => {
    expect(existsSync('src/data/projects-demo.json')).toBe(false)
    expect(existsSync('src/data/project-notes/manifest.json')).toBe(false)
    expect(GET().status).toBe(404)
    expect(GET().headers.get('cache-control')).toContain('no-store')
  })
  it('indexes the empty catalogue in every locale without fictional resources', () => {
    const docs = staticSearchDocuments()
    for (const locale of contentLocales) {
      expect(docs.find((d) => d.id === `page:projects:${locale}`)?.body).toBeTruthy()
      expect(
        docs.filter((d) => d.id.startsWith('asset:projects-') && d.locale === locale),
      ).toHaveLength(1)
    }
    expect(
      docs.some((d) =>
        /SOL-THERM|demo-001|project-note:|project-consortium-logo:/.test(d.id + d.body),
      ),
    ).toBe(false)
  })
})
