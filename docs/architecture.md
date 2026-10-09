# Architecture

This is one modular, trilingual application. Next.js App Router serves the public website and Payload's administrative/API routes. Payload owns persistence through PostgreSQL; there is no second ORM or independent CMS service.

Collections start empty. The application renders eligible published CMS pages/news and searches their public locale content alongside the canonical navigation corpus. Institutional copy, full homepage composition and further integrations remain subsequent work. It must never manufacture records to make a template look complete.

## Boundaries

| Area                                 | Responsibility                                                     |
| ------------------------------------ | ------------------------------------------------------------------ |
| `src/app/`                           | Public locale routes, CMS routes and server endpoints              |
| `src/components/`                    | Accessible shared UI and public shell                              |
| `src/styles/`                        | Semantic brand tokens, global typography and RTL rules             |
| `src/i18n/`, `src/messages/`         | Stable page identifiers, localized routes and UI catalogs          |
| `src/cms/`                           | Collections, authorization, publication workflow and migrations    |
| `src/lib/content/`                   | Explicit public projections and published-locale queries           |
| `src/lib/search/`                    | Live public corpus, normalization, ranking and replaceable adapter |
| `src/lib/email/`                     | Replaceable email service contract                                 |
| `src/lib/integrations/`, `src/jobs/` | Optional integrations and future durable work                      |
| `docs/`                              | Architecture, decisions, operations and tracked work               |

Public queries must apply access rules and locale eligibility, including when using Payload's Local API. Local API operations bypass authorization by default unless explicitly configured otherwise. Never return entire CMS documents directly to public clients.

## Rendering and discovery

Use server components for content and client components for actual interaction. Locale URLs are explicit (`/fr`, `/en`, `/ar`); `/` redirects to French. Stable page IDs connect translated routes. Arabic sets `lang="ar"` and `dir="rtl"`.

Drafts, admin, previews and personal records must stay outside public caches, sitemaps and search. Development and unapproved previews stay non-indexable. Robots directives are an indexing policy; remote preview access still needs authentication.

Canonical page scaffolds use the shared `PageSections` renderer and centralized
section IDs/order, with localized headings and draft content briefs. Published
page/home bodies render alongside those scaffolds, and published news renders
within the all-news section. See [the section guide](page-sections.md).

The dedicated search route server-renders a native GET form and paginated results;
it replaces its hero and placeholder scaffold, stays `noindex` and is excluded from the XML sitemap.
The header alone enhances expansion, focus and dismissal. URL state uses `q` and
`page`; changing locale keeps `q` and resets the result page.

The search adapter loads eligible PostgreSQL content through anonymous Payload
Local API reads with `overrideAccess: false`, `draft: false`,
`fallbackLocale: false`, `depth: 0` and selected public fields. It merges complete
CMS translations into 16 canonical principal-page documents and reads all eligible
news in 100-record database batches. Existing localized section headings contribute
topic keywords; placeholder descriptions contribute no search text.
Utilities/legal routes, unpublished/private
content, future news and missing translations are excluded. Ranking happens in
server memory with normalized words and weighted title/exact/prefix matches;
original text supplies excerpts. Publication and withdrawal take effect on the
next request, without a stored index or background rebuild.

This deliberately small implementation is not native PostgreSQL full-text,
stemming, trigram or typo-tolerant search. Total request work grows with the
eligible corpus despite bounded individual reads. [ADR 0005](adr/0005-live-published-content-search.md)
records the brief's deferred indexing requirements and the migration trigger;
[the search guide](search.md) records behavior and publication limits.

Published page bodies and selected news articles use the same access-controlled
locale boundary. News search links use `?article=id#news-id` on the canonical news
route and remain readable beyond the latest-12 listing. Rich-text internal links
are resolved against eligible public records; unsafe external links become text.
Depth-zero rendering omits embedded uploads/relationships. Home content is read
at request time, retaining empty/unavailable states when appropriate.

## Portable infrastructure

PostgreSQL is the only required development service and also supplies live search content. Media uses local development storage until an approved S3-compatible production provider is configured. Email, search and LinkedIn remain isolated behind adapters; unavailable services must have honest unavailable states. Search adds no dependency, schema migration or database index.

A portable Node.js server/container is the deployment target. Hosting region, storage, mail, identity/MFA, job scheduling, distributed rate limiting and production observability need separate decisions before launch. See [deployment](deployment.md), [security and privacy](security-and-privacy.md), and [ADR 0001](adr/0001-modular-trilingual-application.md).
