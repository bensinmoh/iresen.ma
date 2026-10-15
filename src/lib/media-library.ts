import photos from '@/data/media-photos.json'
import reports from '@/data/media-reports.json'

export { photos as mediaPhotos, reports as mediaReports }
export type MediaPhoto = (typeof photos)[number]
