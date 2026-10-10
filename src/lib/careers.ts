import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'

export type CareerOffer = {
  id: number
  reference: string
  title: string
  department: string
  contract: string
  location: string
  summary: string
  experience: string
  availability: string
  missions: string
  profile: string
  isDemo: boolean
}

export function careerAnchor(reference: string) {
  return `offer-${reference}`
}
export function careerDownloadHref(reference: string, locale: Locale) {
  return `/api/careers/${encodeURIComponent(reference)}?locale=${locale}`
}
export function careerHref(reference: string, locale: Locale) {
  return pageHref('opportunities', locale, careerAnchor(reference))
}
export function careerText(offer: CareerOffer) {
  return [
    offer.title,
    offer.department,
    offer.contract,
    offer.location,
    offer.summary,
    offer.experience,
    offer.availability,
    offer.missions,
    offer.profile,
  ].join('\n\n')
}
