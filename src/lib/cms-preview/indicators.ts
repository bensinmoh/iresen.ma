import type { Entry } from './model'
type IndicatorRecord = Pick<Entry, 'module' | 'shared' | 'publicVariants'>
export function validatedShared(entry: IndicatorRecord): Record<string, string> | null {
  const variant = entry.publicVariants.fr
  if (variant?.status !== 'published' || !variant.title.trim()) return null
  try {
    return variant.fields._publishedShared
      ? JSON.parse(variant.fields._publishedShared)
      : entry.shared
  } catch {
    return null
  }
}
export function publicModuleCount(entries: readonly IndicatorRecord[], module: string): number {
  return entries.filter(
    (entry) => entry.module === module && validatedShared(entry)?.visibility === 'public',
  ).length
}
export function supportedProjects(entries: readonly IndicatorRecord[]): number {
  return entries.filter(
    (entry) =>
      entry.module === 'projects' &&
      Boolean(entry.publicVariants.fr?.body.trim()) &&
      validatedShared(entry)?.visibility === 'public',
  ).length
}
/** Approved portfolio aggregate; individual withheld filings remain private. */
export function filedPatentReferences(entries: readonly IndicatorRecord[]): number {
  return entries.filter((entry) => entry.module === 'patents' && validatedShared(entry) !== null)
    .length
}
export function grantedPatents(entries: readonly IndicatorRecord[]): number {
  return entries.filter((entry) => {
    if (entry.module !== 'patents') return false
    const shared = validatedShared(entry)
    return shared?.visibility === 'public' && shared.granted === 'true'
  }).length
}
