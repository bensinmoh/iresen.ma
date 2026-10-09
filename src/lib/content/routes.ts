import type { Locale } from '@/i18n/locales'
import { pageHref, pages } from '@/lib/site'

export function isPublicSlug(value: unknown): value is string {
  return typeof value === 'string' && /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(value)
}

export function newsHref(slug: string, locale: Locale): string {
  return `${pageHref('news', locale)}/${encodeURIComponent(slug)}`
}

/** Accept only the one implemented article family, in canonical or localized form. */
export function newsSlugFromPath(pathname: string, locale: Locale): string | null {
  for (const base of [pages.news.path, pages.news.pathnames[locale]]) {
    if (!pathname.startsWith(`${base}/`)) continue
    const slug = pathname.slice(base.length + 1)
    if (isPublicSlug(slug)) return slug
  }
  return null
}
