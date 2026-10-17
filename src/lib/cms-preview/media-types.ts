import type { Entry } from './model'

export const mediaTypes = [
  {
    id: 'photos',
    label: 'Photos',
    description: 'Photos visibles dans la galerie de la médiathèque.',
    columns: ['category', 'fileName', 'credit'],
  },
  {
    id: 'videos',
    label: 'Vidéos',
    description: 'Films et vidéos de la vidéothèque.',
    columns: ['fileName', 'mimeType', 'credit'],
  },
  {
    id: 'reports',
    label: 'Rapports & stratégies',
    description: 'Documents de référence et rapports à consulter.',
    columns: ['sourceUrl', 'fileName', 'credit'],
  },
  {
    id: 'links',
    label: 'Liens utiles',
    description: 'Outils et ressources externes proposés dans la médiathèque.',
    columns: ['sourceUrl'],
  },
  {
    id: 'resources',
    label: 'Autres ressources du site',
    description: 'Illustrations, portraits, logos et fichiers utilisés dans les autres pages.',
    columns: ['fileName', 'mimeType', 'usage'],
  },
] as const
export type MediaType = (typeof mediaTypes)[number]['id']
export function mediaType(entry: Pick<Entry, 'shared' | 'reference'>): MediaType {
  const shared = entry.shared
  if (mediaTypes.some((type) => type.id === shared.resourceKind))
    return shared.resourceKind as MediaType
  if (shared.usage === 'media/photos' || shared._sourceDataset === 'src/data/media-photos.json')
    return 'photos'
  if (shared.usage === 'media/reports' || shared._sourceDataset === 'src/data/media-reports.json')
    return 'reports'
  if (shared.category === 'site-assets') return 'resources'
  if (shared.mimeType?.startsWith('video/')) return 'videos'
  return 'resources'
}
export function mediaDefaults(kind: MediaType): Record<string, string> {
  return {
    resourceKind: kind,
    usage: {
      photos: 'media/photos',
      videos: 'media/videos',
      reports: 'media/reports',
      links: 'media/links',
      resources: 'site',
    }[kind],
    ...(kind === 'reports'
      ? { mimeType: 'application/pdf' }
      : kind === 'videos'
        ? { mimeType: 'video/mp4' }
        : {}),
  }
}
export function mediaMimes(kind: MediaType): string[] {
  if (kind === 'photos') return ['image/jpeg', 'image/png', 'image/webp']
  if (kind === 'videos') return ['video/mp4']
  if (kind === 'reports') return ['application/pdf']
  if (kind === 'links') return []
  return ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'video/mp4']
}
