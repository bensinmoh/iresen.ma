import type { Locale } from '@/i18n/locales'
import { pageHref, pages, isNewsListingPath } from '@/lib/site'

export function isPublicSlug(value: unknown): value is string {
  return typeof value === 'string' && /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(value)
}

export function isNewsSlug(value: unknown, locale: Locale): value is string {
  return (
    isPublicSlug(value) &&
    !isNewsListingPath(`${pages.news.path}/${value}`, locale) &&
    !isNewsListingPath(`${pages.news.pathnames[locale]}/${value}`, locale)
  )
}

export function newsHref(slug: string, locale: Locale): string {
  return `${pageHref('news', locale)}/${encodeURIComponent(slug)}`
}

/** Accept only the one implemented article family, in canonical or localized form. */
export function newsSlugFromPath(pathname: string, locale: Locale): string | null {
  if (isNewsListingPath(pathname, locale)) return null
  for (const base of [pages.news.path, pages.news.pathnames[locale]]) {
    if (!pathname.startsWith(`${base}/`)) continue
    const slug = pathname.slice(base.length + 1)
    if (isNewsSlug(slug, locale)) return slug
  }
  return null
}
