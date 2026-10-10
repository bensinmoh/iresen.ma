import photos from '@/data/media-photos.json'
import reports from '@/data/media-reports.json'

export { photos as mediaPhotos, reports as mediaReports }
export const mediaLinks = [
  {
    id: 'masen',
    name: 'MASEN',
    title: 'Moroccan Agency for Sustainable Energy',
    url: 'https://www.masen.ma/',
  },
  {
    id: 'anre',
    name: 'ANRE',
    title: 'Autorité Nationale de Régulation de l’Électricité',
    url: 'https://anre.ma/',
  },
  {
    id: 'amee',
    name: 'AMEE',
    title: 'Agence Marocaine pour l’Efficacité Énergétique',
    url: 'https://amee.ma/',
  },
  {
    id: 'onee',
    name: 'ONEE',
    title: 'Office National de l’Électricité et de l’Eau Potable — Branche Électricité',
    url: 'https://www.one.org.ma/',
  },
  {
    id: 'mtedd',
    name: 'MTEDD',
    title: 'Ministère de la Transition Énergétique et du Développement Durable',
    url: 'https://www.mtedd.gov.ma/',
  },
] as const

export type MediaPhoto = (typeof photos)[number]
