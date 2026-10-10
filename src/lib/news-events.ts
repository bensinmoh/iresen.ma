import { homeNewsPosts } from './home-news'
import { footerSocialLinks } from './footer'

export const featuredPostId = '7514300639057797120'
export const selectedNews = [
  homeNewsPosts.find((post) => post.id.endsWith(featuredPostId))!,
  ...homeNewsPosts.filter((post) => !post.id.endsWith(featuredPostId)),
]
export const newsImages: Record<string, { src: string; altKey: string }> = {
  '7514300639057797120': { src: '/images/news/podcast.webp', altKey: 'podcast' },
  '7514335153415131136': { src: '/images/news/sweden.webp', altKey: 'sweden' },
  '7514298051914588161': { src: '/images/news/istanbul.webp', altKey: 'istanbul' },
  '7508575272049229824': { src: '/images/news/majan.webp', altKey: 'majan' },
  '7510672994734727168': { src: '/images/news/oman.webp', altKey: 'oman' },
}
export const newsEvents = [
  {
    id: 'oman',
    role: 'participation',
    past: true,
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7510672994734727168/',
  },
  { id: 'cop31', role: 'organisation', past: false, href: null },
  { id: 'irsecx', role: 'organisation', past: false, href: 'https://irsecx.ma/' },
] as const
export const newsSocialLinks = [
  { id: 'facebook', name: 'Facebook', href: 'https://www.facebook.com/IRESEN/' },
  { id: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/iresen_officiel/' },
  footerSocialLinks[0],
  footerSocialLinks[1],
  footerSocialLinks[2],
] as const
