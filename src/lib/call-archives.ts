import data from '@/data/call-archives.json'
import type { Locale } from '@/i18n/locales'
import { callHref, callState } from '@/lib/calls'
import type { PublicCall } from '@/lib/content/call-queries'

export type CallKind = 'development' | 'acceleration' | 'cooperation'
export type CallStatus = 'open' | 'upcoming' | 'closed' | 'cancelled'
export type CallCardData = {
  reference: string
  origin: 'archive' | 'cms'
  title: string
  summary: string
  year: number
  period: string
  kind: CallKind
  state: CallStatus
  themes: string[]
  shortThemes?: string[]
  href: string
}
export const archiveCalls = data.records
export function findArchiveCall(reference: string) {
  return archiveCalls.find((call) => call.reference === reference)
}
export function archiveProfile(call: (typeof archiveCalls)[number]) {
  return data.profiles[call.profile as keyof typeof data.profiles]
}
export function formatArchivePeriod(period: string, locale: Locale) {
  if (period.length === 4)
    return new Intl.NumberFormat(locale, { useGrouping: false }).format(Number(period))
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${period}-15T12:00:00Z`))
}
export function archiveCard(call: (typeof archiveCalls)[number], locale: Locale): CallCardData {
  const profile = archiveProfile(call)
  return {
    reference: call.reference,
    origin: 'archive',
    title: call.title,
    summary: profile.summary[locale],
    year: call.year,
    period: call.periodLabel?.[locale] || formatArchivePeriod(call.period, locale),
    kind: call.kind as CallKind,
    state: 'closed',
    themes: profile.themes[locale],
    shortThemes: profile.shortThemes[locale],
    href: callHref(call.reference, locale),
  }
}
export function callCards(locale: Locale, published: PublicCall[] = []): CallCardData[] {
  const references = new Set(archiveCalls.map((call) => call.reference))
  return [
    ...archiveCalls.map((call) => archiveCard(call, locale)),
    ...published
      .filter((call) => !references.has(call.reference))
      .map((call): CallCardData => ({
        reference: call.reference,
        origin: 'cms',
        title: call.title,
        summary: call.description,
        year: call.launchYear,
        period: new Intl.DateTimeFormat(locale, {
          dateStyle: 'long',
          timeZone: 'Africa/Casablanca',
        }).format(new Date(call.openingAt)),
        kind: 'development',
        state: callState(call),
        themes: call.themes.split('\n').filter(Boolean),
        href: callHref(call.reference, locale),
      })),
  ].sort(
    (a, b) =>
      b.year - a.year ||
      (findArchiveCall(b.reference)?.period || '').localeCompare(
        findArchiveCall(a.reference)?.period || '',
      ) ||
      b.reference.localeCompare(a.reference),
  )
}
export function filterCallCards(
  calls: CallCardData[],
  {
    query = '',
    year = '',
    kind = '',
    state = '',
  }: { query?: string; year?: string; kind?: string; state?: string },
) {
  const normalize = (value: string) =>
    value.normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase().replace(/[-–—]/g, ' ')
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean)
  return calls.filter(
    (call) =>
      (!year || String(call.year) === year) &&
      (!kind || call.kind === kind) &&
      (!state || call.state === state) &&
      terms.every((term) =>
        normalize([call.title, call.summary, ...call.themes].join(' ')).includes(term),
      ),
  )
}
