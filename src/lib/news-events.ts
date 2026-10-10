import { homeNewsPosts } from './home-news'
import { footerSocialLinks } from './footer'

export const featuredPostId = '7514300639057797120'
export const selectedNews = [
  homeNewsPosts.find((post) => post.id.endsWith(featuredPostId))!,
  ...homeNewsPosts.filter((post) => !post.id.endsWith(featuredPostId)),
  {
    id: 'urn:li:activity:7504120625519583232',
    publicationMonth: '2026-09',
  },
]
export const newsImages: Record<string, { src: string; altKey: string }> = {
  '7504120625519583232': { src: '/images/news/montpellier.webp', altKey: 'montpellier' },
  '7514300639057797120': { src: '/images/news/podcast.webp', altKey: 'podcast' },
  '7514335153415131136': { src: '/images/news/sweden.webp', altKey: 'sweden' },
  '7514298051914588161': { src: '/images/news/istanbul.webp', altKey: 'istanbul' },
  '7508575272049229824': { src: '/images/news/majan.webp', altKey: 'majan' },
  '7510672994734727168': { src: '/images/news/oman.webp', altKey: 'oman' },
}
export const eventImages = {
  oman: { src: '/images/news/oman.webp', altKey: 'oman' },
  cop31: { src: '/images/news/cop31.webp', altKey: 'cop31' },
  irsecx: { src: '/images/news/irsecx.webp', altKey: 'irsecx' },
  dii: { src: '/images/news/istanbul.webp', altKey: 'istanbul' },
  worldptx: { src: '/images/news/worldptx.webp', altKey: 'worldptx' },
} as const
export const newsEvents = [
  {
    id: 'oman',
    role: 'participation',
    past: true,
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7510672994734727168/',
  },
  { id: 'cop31', role: 'organisation', past: false, href: null },
  { id: 'irsecx', role: 'organisation', past: false, href: 'https://irsecx.ma/' },
  { id: 'dii', role: 'participation', past: true, href: 'https://diisummit.org/' },
  {
    id: 'worldptx',
    role: 'organisation',
    past: false,
    href: 'https://mailchi.mp/iresen/world-power-to-x-summit-to-return-in-2027-with-a-biennial-format-aligned-with-moroccos-power-to-x-industrial-scale-up',
  },
] as const
export const newsSocialLinks = [
  { id: 'facebook', name: 'Facebook', href: 'https://www.facebook.com/IRESEN/' },
  { id: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/iresen_officiel/' },
  footerSocialLinks[0],
  footerSocialLinks[1],
  footerSocialLinks[2],
] as const
