import { expect, it } from 'vitest'
import {
  publications,
  filterPublications,
  titleTopics,
  frequentPublicationTopics,
  publicationDate,
} from '@/lib/publications'

it('searches complete bibliographic data and composes topic/year filters', () => {
  const paper = publications.find((p) => p.doiUrl && p.authors)!
  expect(filterPublications(paper.doiUrl!)).toContainEqual(paper)
  expect(filterPublications(paper.authors!.split(';').at(-1)!.trim())).toContainEqual(paper)
  expect(filterPublications('nonexistent-publication-xyz')).toEqual([])
  const filtered = filterPublications('', ['solar'], ['2026'])
  expect(filtered.length).toBeGreaterThan(0)
  expect(filtered.every((p) => p.year === 2026 && titleTopics(p.title).includes('solar'))).toBe(
    true,
  )
  expect(publicationDate(paper, 'fr')).toBe(String(paper.year))
})
it('ranks six title-derived topics by actual matching record counts', () => {
  expect(frequentPublicationTopics).toHaveLength(6)
  for (const topic of frequentPublicationTopics) {
    expect(topic.count).toBe(
      publications.filter((p) => titleTopics(p.title).includes(topic.id)).length,
    )
  }
  expect(frequentPublicationTopics.map((t) => t.count)).toEqual(
    frequentPublicationTopics.map((t) => t.count).sort((a, b) => b - a),
  )
})
