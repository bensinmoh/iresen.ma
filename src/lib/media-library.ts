import photos from '@/data/media-photos.json' with { type: 'json' }
import reports from '@/data/media-reports.json' with { type: 'json' }

export { photos as mediaPhotos, reports as mediaReports }
export type MediaPhoto = (typeof photos)[number]
