import { CallsListingPage } from '@/components/programmes/CallsListingPage'
import { ArchiveCallPage } from '@/components/programmes/ArchiveCallPage'
import { findArchiveCall, archiveProfile } from '@/lib/call-archives'
import { callCopy } from '@/lib/call-copy'
import { headers } from 'next/headers'
import { consumeSearchRequest } from '@/lib/security/search-limit'
import { NetworkPage } from '@/components/network/NetworkPage'
import { PlatformsPage } from '@/components/platforms/PlatformsPage'
import { ProgrammesPage } from '@/components/programmes/ProgrammesPage'
import { CallPage } from '@/components/programmes/CallPage'
import {
  callHref,
  callReferenceFromPath,
  callsListingReference,
  callsListingHref,
} from '@/lib/calls'
import { findPublishedCall } from '@/lib/content/call-queries'
import { GovernancePage } from '@/components/governance/GovernancePage'
import { InstitutePage } from '@/components/institute/InstitutePage'
import { PublicationsPage } from '@/components/publications/PublicationsPage'
import { ProjectsPage } from '@/components/projects/ProjectsPage'
import { RoadmapPage } from '@/components/roadmap/RoadmapPage'
import { MediaLibraryPage } from '@/components/media/MediaLibraryPage'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { isLocale } from '@/i18n/locales'
import { pageIdFromPathname, isNewsListingPath, newsListingHref, pageHref } from '@/lib/site'
import { NewsEventsPage } from '@/components/news/NewsEventsPage'
import { UtilityPage } from '@/components/content/UtilityPage'
import { EmptyPage } from '@/components/content/EmptyPage'
import { NotFoundPage } from '@/components/content/NotFoundPage'
import { ContactPage } from '@/components/contact/ContactPage'
import { CareersPage } from '@/components/careers/CareersPage'
import { TransferPage } from '@/components/transfer/TransferPage'
import { findPatent } from '@/lib/patents'
import { EngagementPage } from '@/components/engagement/EngagementPage'
import { isContactTopic } from '@/lib/contact'
import { createPageMetadata } from '../../page-metadata'
import { newsHref, newsSlugFromPath } from '@/lib/content/routes'
import { findPublishedNewsBySlug } from '@/lib/content/queries'
import { NewsArticle } from '@/components/content/NewsArticle'
import { getSiteUrl, isIndexingEnabled, pages } from '@/lib/site'
import { searchAdapter, validateSearchInput, type SearchInput } from '@/lib/search/adapter'
import { SearchPage } from '@/components/search/SearchPage'

type ContentPageProps = {
  params: Promise<{ locale: string; path: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { locale, path } = await params
  const pageId =
    pageIdFromPathname(`/${path.join('/')}`) ??
    (isLocale(locale) &&
    [pages.programmes.pathnames[locale], encodeURI(pages.programmes.pathnames[locale])].includes(
      `/${path.join('/')}`,
    )
      ? 'programmes'
      : undefined)
  if (!isLocale(locale)) notFound()
  const callReference = callReferenceFromPath(`/${path.join('/')}`, locale)
  if (callReference === callsListingReference)
    return {
      title: callCopy[locale].title,
      description: callCopy[locale].description,
      alternates: {
        canonical: new URL(callsListingHref(locale), getSiteUrl()).toString(),
        languages: Object.fromEntries(
          ['fr', 'en', 'ar'].map((language) => [
            language,
            new URL(callsListingHref(language as 'fr' | 'en' | 'ar'), getSiteUrl()).toString(),
          ]),
        ),
      },
      robots: { index: isIndexingEnabled(), follow: isIndexingEnabled() },
    }
  const archive = callReference ? findArchiveCall(callReference) : undefined
  if (archive)
    return {
      title: archive.title,
      description: archiveProfile(archive).summary[locale],
      alternates: {
        canonical: new URL(callHref(archive.reference, locale), getSiteUrl()).toString(),
        languages: Object.fromEntries(
          ['fr', 'en', 'ar'].map((language) => [
            language,
            new URL(
              callHref(archive.reference, language as 'fr' | 'en' | 'ar'),
              getSiteUrl(),
            ).toString(),
          ]),
        ),
      },
      robots: { index: isIndexingEnabled(), follow: isIndexingEnabled() },
    }
  if (callReference) {
    const call = await findPublishedCall(callReference, locale)
    if (!call) return { robots: { index: false, follow: false } }
    return {
      title: call.title,
      description: call.description.slice(0, 250),
      alternates: { canonical: new URL(callHref(callReference, locale), getSiteUrl()).toString() },
      robots: { index: isIndexingEnabled(), follow: isIndexingEnabled() },
    }
  }
  if (isNewsListingPath(`/${path.join('/')}`, locale)) {
    const t = await getTranslations({ locale, namespace: 'NewsEvents' })
    return {
      title: t('allNews'),
      alternates: {
        canonical: new URL(newsListingHref(locale), getSiteUrl()).toString(),
        languages: Object.fromEntries(
          ['fr', 'en', 'ar'].map((language) => [
            language,
            new URL(newsListingHref(language as 'fr' | 'en' | 'ar'), getSiteUrl()).toString(),
          ]),
        ),
      },
      robots: { index: isIndexingEnabled(), follow: isIndexingEnabled() },
    }
  }
  if (!pageId) {
    const slug = newsSlugFromPath(`/${path.join('/')}`, locale)
    const article = slug ? await findPublishedNewsBySlug(slug, locale) : null
    if (article)
      return {
        title: article.seo?.title || article.title,
        description: article.seo?.description || article.summary,
        alternates: { canonical: new URL(newsHref(slug!, locale), getSiteUrl()).toString() },
        robots: { index: isIndexingEnabled(), follow: isIndexingEnabled() },
      }
    const t = await getTranslations({ locale, namespace: 'States' })
    return { title: t('notFoundTitle'), robots: { index: false, follow: false } }
  }
  return createPageMetadata(pageId, locale)
}

export default async function ContentPage({ params, searchParams }: ContentPageProps) {
  const { locale, path } = await params
  const pageId =
    pageIdFromPathname(`/${path.join('/')}`) ??
    (isLocale(locale) &&
    [pages.programmes.pathnames[locale], encodeURI(pages.programmes.pathnames[locale])].includes(
      `/${path.join('/')}`,
    )
      ? 'programmes'
      : undefined)
  if (!isLocale(locale)) notFound()
  const callReference = callReferenceFromPath(`/${path.join('/')}`, locale)
  if (callReference === callsListingReference) return <CallsListingPage locale={locale} />
  const archive = callReference ? findArchiveCall(callReference) : undefined
  if (archive) return <ArchiveCallPage call={archive} locale={locale} />
  if (callReference) {
    const call = await findPublishedCall(callReference, locale)
    if (!call) notFound()
    return <CallPage call={call} locale={locale} />
  }
  if (isNewsListingPath(`/${path.join('/')}`, locale)) {
    const parameters = await searchParams
    const currentPage =
      typeof parameters.page === 'string' && /^[1-9]\d*$/.test(parameters.page)
        ? Number(parameters.page)
        : 1
    return <NewsEventsPage locale={locale} listing page={Math.min(currentPage, 1000)} />
  }
  if (pageId === 'usefulLinks') permanentRedirect(encodeURI(pageHref('usefulLinks', locale)))
  if (pageId === 'events') permanentRedirect(pageHref('events', locale))
  if (pageId === 'news') return <NewsEventsPage locale={locale} />
  if (pageId === 'search') {
    const parameters = await searchParams
    const query = typeof parameters.q === 'string' ? parameters.q : ''
    const input: SearchInput = {
      query,
      locale,
      type: (parameters.type ?? 'all') as SearchInput['type'],
      sort: (parameters.sort ?? 'relevance') as SearchInput['sort'],
      page: parameters.page === undefined ? 1 : Number(parameters.page),
    }
    const valid =
      !['q', 'type', 'sort', 'page'].some((key) => Array.isArray(parameters[key])) &&
      validateSearchInput(input)
    if (!valid) return <SearchPage locale={locale} query={query.slice(0, 200)} error="invalid" />
    let limitError: 'rateLimited' | 'unavailable' | undefined
    if (query.trim()) {
      try {
        const limit = await consumeSearchRequest(await headers())
        if (!limit.allowed) limitError = 'rateLimited'
      } catch {
        limitError = 'unavailable'
      }
    }
    if (limitError) return <SearchPage locale={locale} query={query} error={limitError} />
    const result = query.trim() ? await searchAdapter.search(input) : undefined
    return (
      <SearchPage
        locale={locale}
        query={query}
        type={input.type}
        sort={input.sort}
        result={result}
      />
    )
  }
  if (!pageId) {
    const slug = newsSlugFromPath(`/${path.join('/')}`, locale)
    if (slug) {
      const article = await findPublishedNewsBySlug(slug, locale)
      if (!article) notFound()
      return <NewsArticle content={article} locale={locale} />
    }
  }
  // The proxy sets HTTP 404 for unknown paths. Render their localized content
  // directly so the HTML remains readable without a streamed error replacement.
  if (!pageId) return <NotFoundPage locale={locale} />
  if (pageId === 'contact') {
    const { subject, patent } = await searchParams
    const topic = typeof subject === 'string' && isContactTopic(subject) ? subject : undefined
    return <ContactPage locale={locale} initialTopic={topic} initialPatent={findPatent(patent)} />
  }
  if (pageId === 'publications')
    return <PublicationsPage locale={locale} parameters={await searchParams} />
  if (pageId === 'projects') return <ProjectsPage locale={locale} parameters={await searchParams} />
  if (pageId === 'governance') return <GovernancePage locale={locale} />
  if (pageId === 'network') return <NetworkPage locale={locale} />
  if (pageId === 'platforms') return <PlatformsPage locale={locale} />
  if (pageId === 'programmes') return <ProgrammesPage locale={locale} />
  if (pageId === 'institute') return <InstitutePage locale={locale} />
  if (pageId === 'priorities') return <RoadmapPage locale={locale} />
  if (pageId === 'media') return <MediaLibraryPage locale={locale} />
  if (pageId === 'opportunities') return <CareersPage locale={locale} />
  if (pageId === 'transfer') return <TransferPage locale={locale} />
  if (pageId === 'workWithUs') return <EngagementPage pageId={pageId} locale={locale} />
  if (
    pageId === 'legal' ||
    pageId === 'privacy' ||
    pageId === 'cookies' ||
    pageId === 'accessibility' ||
    pageId === 'sitemap'
  )
    return <UtilityPage pageId={pageId} locale={locale} />
  return <EmptyPage pageId={pageId} locale={locale} />
}
