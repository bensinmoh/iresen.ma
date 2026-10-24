# IRESEN website

## Narrative review branch — 2026-10-14

The [October institutional narrative](docs/institutional-narrative-2026.md) is
implemented for review: R&I core, three missions, three complementary dimensions,
six audiences, evidence disclosures and FR/EN/AR discovery. The owner requires
an explicit GO before merge. [Working glossary](docs/narrative-glossary.md).

Trilingual institutional website (French, English, Arabic/RTL), built with Next.js,
React and Payload CMS. This repository prepares a public release; it does not deploy
it. Hosting, domain/DNS, Cloudflare and release approval remain with IRESEN and its
providers. [French IT handover](docs/it-handover.fr.md) · [Deployment](docs/deployment.md).

## Current scope

The route authority is `src/lib/site.ts`: 24 stable pages, including search and
six footer utilities. News/event aliases and published call/news detail routes
reuse this authority. Public modules include the institute, governance, research
priorities/programmes, platforms, laboratory network, collaboration, valorisation,
news/events, publications/reports, media, careers, contact and useful links.

The [collaborative-project catalogue](docs/projects.md) now uses a real Payload
collection: 60 owner-selected source projects imported locally, with English/Arabic
working translations in review. Filters, pagination and detailed reading are restored;
missing facts remain empty and scientific-production counters are excluded. All 24
fictional records and 72 old PDF notes stay withdrawn; old note URLs return 404.
Careers still has no fictional offers. The publications corpus retains 1,199 records (T4 2026); the patent
catalogue retains 59 records. Neither corpus is deleted by project withdrawal.

Public CMS reads enforce publication and locale approval with no translation
fallback. Interface translations and editorial drafts still require final review.
Contact/applications compose local email drafts; no server intake or delivery is
implemented. Google Maps loads only after optional-service consent. LinkedIn
content is curated, without OAuth/synchronization. CMS email is unconfigured.

Production administration is closed by default. `/admin` opens the custom CMS;
`CMS_WORKSPACE_ENABLED=true` connects it to the local database with an existing
administrator/editor session. Retained publications, patents, calls, laboratories,
organisation/councils, news/events, FAQ and page-section records are imported into
the authenticated PostgreSQL authoring store on first load. Full page catalogues,
registered site assets and existing search vocabulary are included. There is no
runtime demonstration mode: the workspace must be enabled.
`SITE_CONTENT_DATABASE_ENABLED=true` reads the retained site catalogues/resources
from this common database; public readers and search use validated snapshots, with
existing delivered translation baselines and native publication gates preserved.
See the [complete CMS inventory and verification](docs/cms-interface-preview.md).
`/cms-preview` redirects to `/admin` in local review. In public release, `CMS_WORKSPACE_ENABLED=true` enables the authenticated `/admin` workspace; `/cms-preview` and native Payload administration remain closed. Production local review outside public release requires both explicit review flags. Native account
management remains under `/admin/collections/users` with its existing admin gate.

## Pinned environment

| Component                   | Version |
| --------------------------- | ------- |
| Node.js                     | 24.22.1 |
| pnpm                        | 11.28.6 |
| Next.js                     | 16.4.2  |
| React / React DOM           | 19.3.1  |
| Payload / official adapters | 3.92.0  |
| PostgreSQL configured/CI    | 17.11   |

Use the committed lockfile and `pnpm-workspace.yaml`, including security overrides.
Do not independently upgrade Next and Payload. Read the installed Next guides
before implementing framework changes.

Current developer tools: TypeScript 6.0.3, ESLint 10.13.0 with typescript-eslint
8.72.0, Prettier 3.9.10, Vitest 5.0.5 and Playwright 1.64.1. The
[October stack review](docs/stack-maintenance-2026-10-24.md) records compatibility,
upstream sources and validation. Docker and CI use the same Node/pnpm pins.

## Local setup

Install the pinned Node/pnpm versions with your version manager first. With nvm,
`nvm install && nvm use` reads `.nvmrc`.

```sh
pnpm install --frozen-lockfile
pnpm setup:local
pnpm db:up
pnpm db:wait
pnpm cms:migrate
pnpm search:rebuild
pnpm dev
```

Open `http://localhost:3000/fr`. Docker runs the local PostgreSQL service only.
`.env.example` documents placeholders; `.env.local` stays private. Bootstrap an
administrator only with explicitly supplied temporary credentials using
`pnpm cms:bootstrap`. Existing databases, uploads and credentials must be preserved.

## Configuration boundaries

- `DATABASE_URL`, `PAYLOAD_SECRET`: required server secrets; never public variables.
- `NEXT_PUBLIC_SITE_URL`: canonical public origin; set the approved HTTPS domain
  before the release build because public variables are embedded at build time.
- `SITE_INDEXING_ENABLED=false`: retain until editorial/legal and release approval.
- `PUBLIC_RELEASE=true`: mandatory on the public instance; native Payload administration
  remains closed. `CMS_WORKSPACE_ENABLED=true` enables the authenticated custom `/admin` CMS. Keep `CMS_ADMIN_ENABLED=false`, `CMS_LOCAL_REVIEW=false` and
  `CMS_INTERFACE_PREVIEW_ENABLED=false` there.
- `TRUSTED_PROXY_CLIENT_IP_HEADER`: `cf-connecting-ip` or `x-real-ip`, only behind a
  proxy that strips untrusted values and overwrites this header. Unconfigured
  clients share a conservative 60-search/minute quota.
- `CMS_UPLOAD_DIRECTORY`: absolute persistent path shared by web and search worker.
  Local filesystem storage is a development default; production storage requires
  an approved persistent provider and withdrawal-safe access.
- `SEARCH_WORKER_DISABLED`: false for the bounded in-process worker; true only when
  an operational separate worker/scheduler owns index processing.

## Commands and checks

Concurrent editing chats must follow [chat orchestration](docs/chat-orchestration.md).
Check `node scripts/coordinate-work.mjs status` before edits. Local tests/builds
remain paused until every writer reports ready and the coordinator freezes the batch.

```sh
pnpm lint
pnpm test
pnpm test:integration
pnpm build
pnpm test:e2e
pnpm format:check
pnpm audit --prod
pnpm audit:assets
pnpm audit:docs
pnpm audit:performance -- before 3101
```

`pnpm typecheck` provides early feedback; a successful production build also checks
TypeScript. Integration tests must use a disposable test database, never the owner's
populated database. Playwright uses a production build and local PostgreSQL.
Performance audits use pinned Lighthouse 13.5.0/installed Chrome, with three mobile
runs per representative route; raw output goes to ignored `.local/handoff-review`.
See [verification](docs/verification-workflow.md) for evidence reuse and final-head CI.

Local CMS preview uses `CMS_INTERFACE_PREVIEW_ENABLED=true`; production-build
local review additionally requires `CMS_LOCAL_REVIEW=true` and **no public release**.
This is a design review mode, not authenticated administration.

## Repository and delivery

- `src/app`: localized routes, public endpoints and separately guarded CMS routes.
- `src/components`, `src/styles`: shared identity, progressive native motion and RTL.
- `src/lib`, `src/data`: routing, domain logic, approved corpora and search projections.
- `src/cms`: collections, publication/access controls and explicit migrations.
- `scripts`, `tests`, `.github`: local tooling, verification and current-head CI.
- `docs`: specifications, provenance, dated evidence and IT guides; not public assets.
- `public`: approved served files only. Private sources, uploads and backups stay out.

`pnpm build` creates a portable standalone server. The Dockerfile separates build,
operations (migrations/reindexing) and non-root web runtime. Never publish the checkout
as a web directory. See [deployment](docs/deployment.md) for build secrets, persistent
storage, Cloudflare cache/security rules, backups and rollback.

## Sources of truth

Latest owner decisions and verified content take precedence. Read `AGENTS.md`,
`instruction.md`, `PRODUCT.md`, `DESIGN.md` and the current design-system coherence
rules. Supplied sources and historical ADRs are evidence, not independent approval.
Original SVG geometry and approved brand values remain authoritative. All public
additions need localized search references. The final multilingual search sanity
check remains required once final website content is approved.

[Architecture](docs/architecture.md) · [Design system](docs/design-system.md) ·
[Security/privacy](docs/security-and-privacy.md) · [Current preparation report](docs/public-release-preparation.md) ·
[Shared public elements and verification](docs/shared-elements.md) ·
[Siteweb backlog](docs/backlog.md)

Mobile Figma refinement (2026-10-15): [reviewed source nodes, responsive rules and verification](docs/mobile-figma-review.md).

## Calls catalogue — 2026-10-15

The Programmes devices section now links to a full 21-entry historical calls
catalogue and individual reference pages, with FR/EN/AR filters and source notes.
All supplied calls are closed; exact final content remains pending. See
[scope, sources and verification](docs/calls-catalogue-2026.md).

## Sourced projects — 2026-10-15

The local import, review flags, guarded external asset storage and repeatable commands
are documented in [projects](docs/projects.md). Preserve `.local/projects` with the
database; it contains source/contact records and is excluded from Git and standalone
tracing. `PROJECTS_LOCAL_REVIEW=true` exposes working EN/AR only for local review;
production mode also requires `CMS_LOCAL_REVIEW=true`, and `PUBLIC_RELEASE=true`
always disables it. Public search contains only approved locales.

Project follow-ups use homogeneous AI-assisted descriptions, short previews and compact objective bullets. Project actions generate guarded PDFs on demand from one FR/EN/AR template and current data/images, using a bounded temporary memory cache. Old static project PDF exports have been deleted; see [runtime and verification](docs/project-pdf-on-demand.md). See [project scope](docs/projects.md).
