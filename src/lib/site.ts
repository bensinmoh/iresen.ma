import type { Locale } from '@/i18n/locales'
import { pageSections } from '@/lib/page-sections'
import { homeNewsPosts } from '@/lib/home-news'
import { legacyMissionAnchors } from '@/lib/home-missions'

type PageDefinition = {
  path: string
  pathnames: Record<Locale, string>
  anchors?: readonly string[]
}

// Stable identifiers connect navigation, translated URLs and future CMS records.
// The French URLs preserve the approved information architecture.
export const pages = {
  home: { path: '/', pathnames: { fr: '/', en: '/', ar: '/' } },
  institute: {
    path: '/institute',
    pathnames: { fr: '/institut', en: '/institute', ar: '/المعهد' },
    anchors: ['about', 'mission', 'key-figures'],
  },
  governance: {
    path: '/institute/governance',
    pathnames: {
      fr: '/institut/gouvernance',
      en: '/institute/governance',
      ar: '/المعهد/الحكامة',
    },
  },
  priorities: {
    path: '/research-innovation/priorities',
    pathnames: {
      fr: '/recherche-innovation/priorites',
      en: '/research-innovation/priorities',
      ar: '/البحث-والابتكار/الأولويات',
    },
  },
  programmes: {
    path: '/research-innovation/programmes',
    pathnames: {
      fr: '/recherche-innovation/programmes',
      en: '/research-innovation/programmes',
      ar: '/البحث-والابتكار/البرامج',
    },
  },
  projects: {
    path: '/research-innovation/projects',
    pathnames: {
      fr: '/recherche-innovation/projets',
      en: '/research-innovation/projects',
      ar: '/البحث-والابتكار/المشاريع',
    },
  },
  platforms: {
    path: '/expertise-experimentation/platforms',
    pathnames: {
      fr: '/expertise-experimentation/plateformes',
      en: '/expertise-experimentation/platforms',
      ar: '/الخبرة-والتجريب/المنصات',
    },
  },
  network: {
    path: '/expertise-experimentation/network',
    pathnames: {
      fr: '/expertise-experimentation/reseau',
      en: '/expertise-experimentation/network',
      ar: '/الخبرة-والتجريب/الشبكة',
    },
  },
  transfer: {
    path: '/valorisation-transfer',
    pathnames: {
      fr: '/valorisation-transfert',
      en: '/valorisation-transfer',
      ar: '/التثمين-ونقل-التكنولوجيا',
    },
  },
  workWithUs: {
    path: '/work-with-us',
    pathnames: { fr: '/travailler-avec-nous', en: '/work-with-us', ar: '/التعاون-معنا' },
  },
  news: {
    path: '/resources/news',
    pathnames: { fr: '/ressources/actualites', en: '/resources/news', ar: '/الموارد/الأخبار' },
  },
  events: {
    path: '/resources/events',
    pathnames: { fr: '/ressources/evenements', en: '/resources/events', ar: '/الموارد/الفعاليات' },
  },
  publications: {
    path: '/resources/publications-reports',
    pathnames: {
      fr: '/ressources/publications-rapports',
      en: '/resources/publications-reports',
      ar: '/الموارد/المنشورات-والتقارير',
    },
  },
  media: {
    path: '/resources/media',
    pathnames: {
      fr: '/ressources/mediatheque',
      en: '/resources/media',
      ar: '/الموارد/المكتبة-الإعلامية',
    },
  },
  opportunities: {
    path: '/resources/opportunities-careers',
    pathnames: {
      fr: '/ressources/opportunites-carrieres',
      en: '/resources/opportunities-careers',
      ar: '/الموارد/الفرص-والمسارات-المهنية',
    },
  },
  search: { path: '/search', pathnames: { fr: '/recherche', en: '/search', ar: '/البحث' } },
  contact: { path: '/contact', pathnames: { fr: '/contact', en: '/contact', ar: '/اتصل-بنا' } },
  legal: {
    path: '/legal',
    pathnames: { fr: '/mentions-legales', en: '/legal', ar: '/المعلومات-القانونية' },
  },
  privacy: {
    path: '/privacy',
    pathnames: { fr: '/confidentialite', en: '/privacy', ar: '/الخصوصية' },
  },
  cookies: {
    path: '/cookie-preferences',
    pathnames: { fr: '/preferences-cookies', en: '/cookie-preferences', ar: '/تفضيلات-الكوكيز' },
  },
  accessibility: {
    path: '/accessibility',
    pathnames: { fr: '/accessibilite', en: '/accessibility', ar: '/إمكانية-الوصول' },
  },
  sitemap: {
    path: '/sitemap',
    pathnames: { fr: '/plan-du-site', en: '/sitemap', ar: '/خريطة-الموقع' },
  },
} as const satisfies Record<string, PageDefinition>

export type PageId = keyof typeof pages
export type InternalPathname = (typeof pages)[PageId]['path']
export const pageIds = Object.keys(pages) as PageId[]
export const pathnames = Object.fromEntries(
  pageIds.map((id) => [pages[id].path, pages[id].pathnames]),
) as Record<InternalPathname, Record<Locale, string>>

export const navigationGroups = [
  { id: 'institute', pages: ['institute', 'governance'] },
  { id: 'research', pages: ['priorities', 'programmes', 'projects'] },
  { id: 'expertise', pages: ['platforms', 'network'] },
  { id: 'resources', pages: ['news', 'events', 'publications', 'media', 'opportunities'] },
] as const satisfies ReadonlyArray<{ id: string; pages: readonly PageId[] }>

export const footerPageIds = ['legal', 'privacy', 'cookies', 'accessibility', 'sitemap'] as const

export const footerNavigationGroups = [
  { id: 'institute', pages: ['home', 'institute', 'governance', 'opportunities'] },
  { id: 'science', pages: ['priorities', 'programmes', 'projects', 'platforms', 'network'] },
  { id: 'resources', pages: ['publications', 'media', 'news', 'events'] },
  { id: 'collaboration', pages: ['workWithUs', 'contact', 'transfer'] },
] as const satisfies ReadonlyArray<{ id: string; pages: readonly PageId[] }>

export function pageHref(pageId: PageId, locale: Locale, anchor?: string): string {
  const path = pages[pageId].pathnames[locale]
  const href = `/${locale}${path === '/' ? '' : path}`
  return anchor && isSupportedAnchor(pageId, anchor) ? `${href}#${anchor.replace(/^#/, '')}` : href
}

export function pageIdFromPathname(pathname: string): PageId | undefined {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
  return pageIds.find((id) => pages[id].path === normalized)
}

export function isSupportedAnchor(pageId: PageId, anchor: string): boolean {
  const normalized = anchor.replace(/^#/, '')
  const definition: PageDefinition = pages[pageId]
  return (
    normalized === 'main-content' ||
    normalized === 'page-sections' ||
    (pageId === 'home' && legacyMissionAnchors.some((id) => id === normalized)) ||
    (pageId === 'home' &&
      homeNewsPosts.some((post) => normalized === `news-${post.id.split(':').at(-1)}`)) ||
    definition.anchors?.includes(normalized) === true ||
    pageSections[pageId].some(
      (section) =>
        section.id === normalized || section.children?.some((child) => child.id === normalized),
    )
  )
}

export function getSiteUrl(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
}

export function isIndexingEnabled(): boolean {
  return process.env.SITE_INDEXING_ENABLED === 'true'
}
