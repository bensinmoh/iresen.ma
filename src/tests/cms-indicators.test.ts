import { describe, expect, it } from 'vitest'
import { createEntry } from '@/lib/cms-preview/model'
import { grantedPatents, supportedProjects } from '@/lib/cms-preview/indicators'

describe('CMS indicator definitions', () => {
  it('counts public validated projects while preserving the snapshot during draft edits', () => {
    const project = createEntry('projects', 'project', '2026-10-16')
    project.shared.visibility = 'private'
    project.publicVariants.fr = {
      ...project.variants.fr,
      title: 'Projet sourcé',
      body: 'Description sourcée',
      status: 'published',
      fields: { _publishedShared: JSON.stringify({ visibility: 'public' }) },
    }
    expect(supportedProjects([project])).toBe(1)
    project.publicVariants.fr.fields._publishedShared = JSON.stringify({ visibility: 'private' })
    expect(supportedProjects([project])).toBe(0)
    project.publicVariants.fr.fields._publishedShared = '{invalid'
    expect(supportedProjects([project])).toBe(0)
    delete project.publicVariants.fr
    project.shared.visibility = 'public'
    expect(supportedProjects([project])).toBe(0)
  })
  it('counts confirmed grants separately from filings, missing flags and other modules', () => {
    const entries = ['true', 'false', ''].map((granted, index) => {
      const entry = createEntry('patents', String(index), '2026-10-16')
      entry.shared.granted = granted
      entry.shared.visibility = 'public'
      entry.publicVariants.fr = {
        ...entry.variants.fr,
        title: 'Brevet sourcé',
        status: 'published',
        fields: { _publishedShared: JSON.stringify(entry.shared) },
      }
      return entry
    })
    const unrelated = createEntry('projects', 'other', '2026-10-16')
    unrelated.shared.granted = 'true'
    expect(grantedPatents([...entries, unrelated])).toBe(1)
  })
})
