import 'server-only'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Call } from '@/payload-types'
import type { Locale } from '@/i18n/locales'
import { isCallReference } from '@/lib/calls'
import { hasControlCharacters } from '@/lib/search/text'

export type PublicCall = Call & {
  title: string
  acronym: string
  description: string
  recipients: string
  themes: string
  fundingPartners: string
  openingAt: string
  deadlineAt: string
  evaluationStartsAt: string
  resultsAt: string
  budgetAmount: number
  submissionUrl: string
}
const select = {
  id: true,
  reference: true,
  title: true,
  acronym: true,
  description: true,
  launchYear: true,
  openingAt: true,
  deadlineAt: true,
  evaluationStartsAt: true,
  evaluationEndsAt: true,
  resultsAt: true,
  calendarNote: true,
  budgetAmount: true,
  budgetCurrency: true,
  budgetNote: true,
  recipients: true,
  themes: true,
  fundingPartners: true,
  conditionsDocument: true,
  submissionUrl: true,
  cancelled: true,
  updatedAt: true,
} as const

export async function findPublishedCalls(locale: Locale) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'calls',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 0,
    pagination: false,
    sort: '-launchYear',
    select,
  })
  return result.docs as PublicCall[]
}
export async function findPublishedCall(reference: string, locale: Locale) {
  if (!isCallReference(reference)) return null
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'calls',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1,
    select,
    where: { reference: { equals: reference } },
  })
  return (result.docs[0] as PublicCall | undefined) ?? null
}
export async function findCallTerms(call: PublicCall, locale: Locale) {
  const id =
    typeof call.conditionsDocument === 'object'
      ? call.conditionsDocument?.id
      : call.conditionsDocument
  if (!id) return null
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'media',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1,
    where: { id: { equals: id } },
    select: { url: true, mimeType: true, title: true, filename: true },
  })
  const terms = result.docs[0]
  return terms?.mimeType === 'application/pdf' &&
    terms.filename &&
    !/[\\/]/.test(terms.filename) &&
    !hasControlCharacters(terms.filename)
    ? { ...terms, url: `/api/media/file/${encodeURIComponent(terms.filename)}?locale=${locale}` }
    : null
}
