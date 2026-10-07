# Architecture

This is one modular, trilingual application. Next.js App Router serves the public website and Payload's administrative/API routes. Payload owns persistence through PostgreSQL; there is no second ORM or independent CMS service.

The initial foundation contains empty collections and translated navigation. Institutional copy, homepage composition and integrations are subsequent work. It must never manufacture records to make a template look complete.

## Boundaries

| Area                                 | Responsibility                                                  |
| ------------------------------------ | --------------------------------------------------------------- |
| `src/app/`                           | Public locale routes, CMS routes and server endpoints           |
| `src/components/`                    | Accessible shared UI and public shell                           |
| `src/styles/`                        | Semantic brand tokens, global typography and RTL rules          |
| `src/i18n/`, `src/messages/`         | Stable page identifiers, localized routes and UI catalogs       |
| `src/cms/`                           | Collections, authorization, publication workflow and migrations |
| `src/lib/content/`                   | Explicit public projections and published-locale queries        |
| `src/lib/search/`, `src/lib/email/`  | Replaceable service contracts                                   |
| `src/lib/integrations/`, `src/jobs/` | Optional integrations and future durable work                   |
| `docs/`                              | Architecture, decisions, operations and tracked work            |

Public queries must apply access rules and locale eligibility, including when using Payload's Local API. Local API operations bypass authorization by default unless explicitly configured otherwise. Never return entire CMS documents directly to public clients.

## Rendering and discovery

Use server components for content and client components for actual interaction. Locale URLs are explicit (`/fr`, `/en`, `/ar`); `/` redirects to French. Stable page IDs connect translated routes. Arabic sets `lang="ar"` and `dir="rtl"`.

Drafts, admin, previews and personal records must stay outside public caches, sitemaps and search. Development and unapproved previews stay non-indexable. Robots directives are an indexing policy; remote preview access still needs authentication.

## Portable infrastructure

PostgreSQL is the only required development service. Media uses local development storage until an approved S3-compatible production provider is configured. Email, search and LinkedIn remain isolated behind adapters; unavailable services must have honest unavailable states.

A portable Node.js server/container is the deployment target. Hosting region, storage, mail, identity/MFA, job scheduling, distributed rate limiting and production observability need separate decisions before launch. See [deployment](deployment.md), [security and privacy](security-and-privacy.md), and [ADR 0001](adr/0001-modular-trilingual-application.md).
