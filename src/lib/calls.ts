import type { Locale } from '@/i18n/locales'
import { pageHref, pages } from '@/lib/site'

export function isCallReference(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}
export function callHref(reference: string, locale: Locale) {
  return `${pageHref('programmes', locale)}/${encodeURIComponent(reference)}`
}
export function callReferenceFromPath(path: string, locale: Locale): string | null {
  try {
    path = decodeURI(path)
  } catch {
    return null
  }
  for (const base of [pages.programmes.path, pages.programmes.pathnames[locale]]) {
    if (!path.startsWith(`${base}/`)) continue
    const reference = path.slice(base.length + 1)
    if (isCallReference(reference)) return reference
  }
  return null
}
export function isSubmissionUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password
  } catch {
    return false
  }
}
export function callState(
  call: { cancelled?: boolean | null; openingAt: string; deadlineAt: string },
  now = Date.now(),
): 'upcoming' | 'open' | 'closed' | 'cancelled' {
  if (call.cancelled) return 'cancelled'
  if (now < Date.parse(call.openingAt)) return 'upcoming'
  return now < Date.parse(call.deadlineAt) ? 'open' : 'closed'
}
export function callDateErrors(data: Record<string, unknown>): string[] {
  const dates = ['openingAt', 'deadlineAt', 'evaluationStartsAt', 'evaluationEndsAt', 'resultsAt']
    .filter((key) => data[key])
    .map((key) => ({ key, time: Date.parse(String(data[key])) }))
  if (dates.some(({ time }) => !Number.isFinite(time))) return ['Invalid calendar date.']
  return dates.some((date, i) => i > 0 && date.time < dates[i - 1]!.time)
    ? ['Calendar dates must follow opening, submission, evaluation and results order.']
    : []
}

export const callLocalizedFields = [
  'title',
  'description',
  'recipients',
  'themes',
  'fundingPartners',
  'submissionUrl',
] as const
