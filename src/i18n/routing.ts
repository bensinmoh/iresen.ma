import { defineRouting } from 'next-intl/routing'
import { defaultLocale, locales } from './locales'
import { pathnames, newsListingPath, newsListingPaths } from '@/lib/site'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
  localeCookie: false,
  pathnames: { ...pathnames, [newsListingPath]: newsListingPaths },
})
