// Shared Node server / Payload CLI projection. The native pg dependency keeps this outside client bundles.
import { canonicalNames } from '@/lib/names'
import { siteContent } from './site-content'
import { publications, type Publication } from '@/lib/publications'
import { filedPatents, type Patent } from '@/lib/patents'
import { mediaPhotos, mediaReports } from '@/lib/media-library'

function publishedShared(row: Awaited<ReturnType<typeof siteContent>>[number]) {
  const value = row.public_variants.fr?.fields._publishedShared
  return value ? (JSON.parse(value) as Record<string, string>) : {}
}
export async function sitePublications(): Promise<Publication[]> {
  const rows = (await siteContent()).filter((row) => row.module === 'publications')
  if (!rows.length) return publications
  return rows
    .filter(
      (row) =>
        row.public_variants.fr?.status === 'published' &&
        publishedShared(row).visibility !== 'private',
    )
    .map((row) => {
      const original = JSON.parse(row.shared.sourceRecord) as Publication
      const shared = publishedShared(row)
      return {
        ...original,
        title: row.public_variants.fr!.title,
        authors: shared.authors ?? original.authors,
        doiUrl: shared.doi ?? original.doiUrl,
        year: shared.year ? Number(shared.year) : original.year,
        journal: shared.journal ?? original.journal,
        theme: shared.bibliographicTheme ?? original.theme,
        type: shared.publicationType ?? original.type,
      }
    })
}
export async function sitePatents(): Promise<Patent[]> {
  const rows = (await siteContent())
    .filter((row) => row.module === 'patents')
    .sort(
      (a, b) =>
        filedPatents.findIndex((p) => p.reference === a.reference) -
        filedPatents.findIndex((p) => p.reference === b.reference),
    )
  if (!rows.length) return filedPatents.filter((patent) => patent.granted)
  return rows
    .filter(
      (row) =>
        row.public_variants.fr?.status === 'published' &&
        publishedShared(row).visibility !== 'private',
    )
    .map((row) => {
      const original = JSON.parse(row.shared.sourceRecord) as Patent
      const shared = publishedShared(row)
      const title = { ...original.title }
      const description = { ...original.description }
      for (const locale of ['fr', 'en', 'ar'] as const) {
        if (!row.public_variants[locale]) continue
        title[locale] = row.public_variants[locale]!.title
        description[locale] = row.public_variants[locale]!.body
      }
      return {
        ...original,
        title,
        description,
        depositor:
          (shared.applicants ?? original.depositor)
            ? canonicalNames(shared.applicants ?? original.depositor!)
            : null,
        registerUrl: shared.registry ?? original.registerUrl,
        filingYear: shared.year ? Number(shared.year) : original.filingYear,
        granted: Object.hasOwn(shared, 'granted') ? shared.granted === 'true' : original.granted,
      }
    })
    .filter((patent) => patent.granted)
}
export async function siteMedia() {
  const rows = (await siteContent()).filter((row) => row.module === 'media')
  if (!rows.length) return { photos: mediaPhotos, reports: mediaReports }
  return {
    photos: rows
      .filter(
        (row) =>
          row.shared._sourceDataset === 'src/data/media-photos.json' &&
          row.public_variants.fr?.status === 'published' &&
          publishedShared(row).visibility !== 'private',
      )
      .sort(
        (a, b) =>
          mediaPhotos.findIndex((p) => `photo-${p.id}` === a.reference) -
          mediaPhotos.findIndex((p) => `photo-${p.id}` === b.reference),
      )
      .map((row) => {
        const original = JSON.parse(row.shared.sourceRecord) as (typeof mediaPhotos)[number]
        return {
          ...original,
          title: {
            ...original.title,
            ...Object.fromEntries(
              Object.entries(row.public_variants).map(([locale, value]) => [locale, value!.title]),
            ),
          },
        }
      }),
    reports: rows
      .filter(
        (row) =>
          row.shared._sourceDataset === 'src/data/media-reports.json' &&
          row.public_variants.fr?.status === 'published' &&
          publishedShared(row).visibility !== 'private',
      )
      .sort(
        (a, b) =>
          mediaReports.findIndex((p) => `report-${p.id}` === a.reference) -
          mediaReports.findIndex((p) => `report-${p.id}` === b.reference),
      )
      .map((row) => {
        const original = JSON.parse(row.shared.sourceRecord) as (typeof mediaReports)[number]
        const shared = publishedShared(row)
        return {
          ...original,
          title: row.public_variants.fr!.title,
          url: shared.sourceUrl ?? original.url,
          description: {
            ...original.description,
            ...Object.fromEntries(
              Object.entries(row.public_variants).map(([locale, value]) => [locale, value!.body]),
            ),
          },
        }
      }),
  }
}

export async function siteArchivedCalls() {
  const { archiveCalls, archiveProfile } = await import('@/lib/call-archives')
  const rows = (await siteContent()).filter((row) => row.module === 'calls')
  if (!rows.length) return archiveCalls
  return archiveCalls.flatMap((original) => {
    const row = rows.find((row) => row.reference === original.reference)
    if (!row) return [original]
    if (
      row.public_variants.fr?.status !== 'published' ||
      publishedShared(row).visibility === 'private'
    )
      return []
    const shared = publishedShared(row)
    const profile = structuredClone(archiveProfile(original))
    for (const locale of ['fr', 'en', 'ar'] as const) {
      const variant = row.public_variants[locale]
      if (!variant) continue
      profile.summary[locale] = variant.body
      profile.audience[locale] = variant.fields.eligibility ?? profile.audience[locale]
      if (variant.fields.archiveThemes)
        profile.themes[locale] = variant.fields.archiveThemes.split('\n').filter(Boolean)
    }
    return [
      {
        ...original,
        title: row.public_variants.fr.title,
        year: shared.launchYear ? Number(shared.launchYear) : original.year,
        period: shared.archivePeriod ?? original.period,
        resolvedProfile: profile,
      },
    ]
  })
}
