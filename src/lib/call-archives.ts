import data from '@/data/call-archives.json' with { type: 'json' }
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
type ArchiveProfile = (typeof data.profiles)[keyof typeof data.profiles]
export type ArchiveCall = (typeof data.records)[number] & { resolvedProfile?: ArchiveProfile }
export const archiveCalls: ArchiveCall[] = data.records
export function findArchiveCall(reference: string, records = archiveCalls) {
  return records.find((call) => call.reference === reference)
}
export function archiveProfile(call: (typeof archiveCalls)[number]) {
  return call.resolvedProfile ?? data.profiles[call.profile as keyof typeof data.profiles]
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
export function callCards(
  locale: Locale,
  published: PublicCall[] = [],
  records = archiveCalls,
): CallCardData[] {
  const references = new Set(records.map((call) => call.reference))
  return [
    ...records.map((call) => archiveCard(call, locale)),
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
      (findArchiveCall(b.reference, records)?.period || '').localeCompare(
        findArchiveCall(a.reference, records)?.period || '',
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

/** Historical listing labels: navigation by programme, not verified selection attribution. */
export function archiveProjectProgramme(call: (typeof archiveCalls)[number]) {
  const labels: Record<string, string> = {
    'innotherm-2012': 'InnoThermI&II',
    'innotherm-2013': 'InnoTherm III',
    'innotherm-innobiomass-2014': 'InnoTherm/InnoBiomass 2014',
    'innopv-innowind-2013': 'InnoPV/InnoWind 2013',
    'innopv-innowind-2014': 'InnoPV/InnoWind 2014',
    'innomaghrenov-2015': 'InnoMaghrenov15',
    'innoprojets-2015': 'InnoProjets 2015',
    'green-innoproject-2018': 'InnoPROJECT 2018',
    'green-innoboost-2018': 'InnoBOOST 2018',
    'innoespamaroc-2018-2019': 'InnoESPAMAROC ENERGY 2019',
    'innoespamaroc-2020': 'InnoESPAMAROC ENERGY 2020',
    'innoespamaroc-2021': 'InnoESPA Maroc 2021',
    'innoespamaroc-2024': 'Inno ESPA MAROC ENERGY 2024',
    'leap-re-2021': 'LEAP-RE 2021',
    'inno-france-maroc-green-h2-2024': 'Inno France Maroc Tech transfert 2024',
    'leap-se-2025': 'LEAP SE 2025',
  }
  return labels[call.reference] ?? call.title
}
