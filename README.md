# IRESEN website

Development foundation for IRESEN's French, English and Arabic institutional website. It provides a public locale shell, Payload CMS and PostgreSQL with introductory page heroes, honest empty content sections and a composed contact page. Read [instruction.md](instruction.md) for the development brief and [backlog](docs/backlog.md) for current scope and follow-up work.

The approved [shared glass refinement](docs/design-system.md#compact-menu-control--2026-10-09)
unifies existing header controls and the homepage certification surface, with a
fine outline and finite reflection. See [current verification](docs/validation.md#refined-glass-surfaces--2026-10-09).

Search results controls now share the requested diagonal action corners and a
deliberately inset dropdown chevron. See [the control rules](docs/design-system.md#search-results-control-corners--2026-10-09)
and [verification](docs/validation.md#search-results-control-corners--2026-10-09).

## Selected stack

| Tool                                                      | Pinned version                                                         |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| Node.js LTS                                               | 24.19.0                                                                |
| pnpm                                                      | 11.19.0                                                                |
| Next.js                                                   | 16.4.0                                                                 |
| React                                                     | 19.3.0                                                                 |
| TypeScript                                                | 6.0.3, strict mode                                                     |
| Payload / Next integration / PostgreSQL adapter / Lexical | 3.90.2                                                                 |
| next-intl                                                 | 4.14.9                                                                 |
| Tailwind CSS                                              | 4.3.3                                                                  |
| Development PostgreSQL                                    | 17.9 (`postgres:17.9-bookworm`, image digest pinned in `compose.yaml`) |

Next.js and Payload are selected as a compatible pair. `package.json`, runtime pins and the committed pnpm lockfile are authoritative. See [architecture](docs/architecture.md) and [ADR 0001](docs/adr/0001-modular-trilingual-application.md).

## Local setup

Use Node.js and pnpm versions above, plus Docker with Compose for the database. Alternatively provide a compatible PostgreSQL instance through `DATABASE_URL`.

```sh
pnpm install --frozen-lockfile
pnpm setup:local
pnpm db:up
pnpm db:wait
pnpm cms:migrate
pnpm search:rebuild
pnpm dev
```

`setup:local` creates ignored `.env.local` with random development secrets and preserves an existing file. Inspect `.env.example` for the variable contract. Never copy live credentials into committed files.

If another PostgreSQL service uses port 5432, choose a free local port before starting the database:

```sh
pnpm setup:local --db-port 5433
```

This updates `POSTGRES_PORT` and the port in `DATABASE_URL`, preserving existing credentials and other settings. Then continue with `pnpm db:up`, `pnpm db:wait`, `pnpm cms:migrate` and `pnpm dev`. Compose reads its host-port setting from `.env.local`; its container still uses port 5432. The port option requires a local PostgreSQL URL.

For the first CMS administrator, supply `CMS_BOOTSTRAP_EMAIL` and `CMS_BOOTSTRAP_PASSWORD` through your secure local environment, then run:

```sh
pnpm cms:bootstrap
```

There is no shared/default administrator credential. Bootstrap is a controlled server operation, not public self-registration. Keep bootstrap credentials out of shell history and remove them from the environment afterward.

Public app: <http://localhost:3000> (redirects to French). Other locale shells: `/en` and `/ar`; Arabic uses RTL. CMS: <http://localhost:3000/admin>. Collections start empty. A local test account or generated local secret is never a production credential.

## Commands

| Command                 | Purpose                                                              |
| ----------------------- | -------------------------------------------------------------------- |
| `pnpm dev`              | Development app and CMS                                              |
| `pnpm build`            | Production standalone build                                          |
| `pnpm start`            | Run the production application                                       |
| `pnpm lint`             | ESLint                                                               |
| `pnpm typecheck`        | Strict TypeScript                                                    |
| `pnpm test`             | Focused unit checks                                                  |
| `pnpm test:integration` | CMS/database authorization checks                                    |
| `pnpm test:e2e`         | Browser locale/navigation checks                                     |
| `pnpm setup:local`      | Create private local configuration                                   |
| `pnpm db:up`            | Start the configured Compose database                                |
| `pnpm db:wait`          | Wait for the configured PostgreSQL service                           |
| `pnpm cms:migrate`      | Apply reviewed CMS migrations                                        |
| `pnpm cms:bootstrap`    | Controlled first-administrator creation                              |
| `pnpm search:rebuild`   | Rebuild eligible public search content and register static resources |
| `pnpm search:work`      | Process one bounded durable indexing batch                           |

Search uses PostgreSQL with `pg_trgm`; the reviewed search migration installs the
extension. Install `poppler-utils` on the application/worker host for automatic
public PDF text extraction. Other files and scanned PDFs remain searchable by
approved metadata and localized `searchText`. The app starts a bounded background
index worker on CMS initialization or first search; production can also schedule
`pnpm search:work`. Set `SEARCH_WORKER_DISABLED=true` when a separate worker
owns processing. Use `pnpm search:rebuild` after migration, new static resources
or a full recovery. See [search behavior, operations and required content references](docs/search.md).

Run integration checks against a disposable migrated database with the development
or production server stopped. `pnpm test:integration` disables automatic search
polling across both test suites so their explicit indexing checks own job processing.

When updating an existing local checkout after a search schema change, stop the
development server and run `pnpm db:wait`, `pnpm cms:migrate`,
`pnpm search:rebuild`, then `pnpm dev`. Starting Docker and Next alone does not
apply migrations. A rebuild reporting zero public CMS records is normal when
the CMS is empty: “static catalog synchronized” includes the public pages,
sections and registered files. Spelling and related-topic search use the same
public index and need no external search account or model download.

Browser checks require Playwright's browser dependencies; CI installs them. This cloud machine already provides Chromium: use `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:e2e` after `pnpm build`. Elsewhere install the bundled browser with `node scripts/run.mjs playwright install chromium`, using the same cache as the tests. Integration checks require a disposable migrated database with no existing users; they create and remove their own accounts and content. Never point tests or development schema synchronization at production.

Local foundation checks passed: 8 unit, 4 integration and 11 browser tests, plus install, lint, types, formatting and the standalone build. See [validation evidence and limits](docs/validation.md).

## Environment

| Name                                                | Purpose                                                                          |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| `DATABASE_URL`                                      | Server-side PostgreSQL connection                                                |
| `CMS_UPLOAD_DIRECTORY`                              | Optional shared upload path; launcher defaults to absolute root `.local/uploads` |
| `POSTGRES_PORT`                                     | Local Compose host port; defaults to 5432 and must match `DATABASE_URL`          |
| `POSTGRES_USER`, `POSTGRES_DB`, `POSTGRES_PASSWORD` | Local Compose database initialization; password must match `DATABASE_URL`        |
| `PAYLOAD_SECRET`                                    | Strong server-side CMS secret; local helper generates one                        |
| `NEXT_PUBLIC_SITE_URL`                              | Development origin; initially `http://localhost:3000`                            |
| `SITE_INDEXING_ENABLED`                             | `false` for development/restricted previews                                      |
| `SEARCH_WORKER_DISABLED`                            | `true` when a separate index worker or integration suite owns processing         |
| `CMS_BOOTSTRAP_EMAIL`                               | First administrator identity; bootstrap only                                     |
| `CMS_BOOTSTRAP_PASSWORD`                            | Secret first-administrator password; bootstrap only                              |

Development services need no production email, storage, LinkedIn or DNS credentials. Public search is implemented; server-side contact acceptance/delivery and CMS email delivery remain unavailable until providers are implemented. The contact page prepares a local email draft for the visitor's own email application; it does not submit or store the message. Seven supplied SVGs are installed unchanged in `public/brand/`; PDF guidelines and other private originals were archived in ignored `private-references/` during prior work and are absent from this checkout. The owner selected **#296BB4** for the primary blue. The native Figma source can be retrieved through Git LFS; [reference handling](docs/references/README.md) explains payload verification and current availability. Its recorded design language and implementation rules live in [the design system](docs/design-system.md), with the current devlink analysis in [the live review](docs/figma-design-system-review.md). Public text and controls use licensed, self-hosted Plus Jakarta Sans for Latin and the owner's selected Alexandria for Arabic, with script-based selection across all three locales. CMS/admin typography has a separate layout. See [fonts and provenance](docs/fonts.md), [asset inventory](docs/asset-inventory.md) and [brand decision](docs/adr/0003-owner-selected-primary-blue.md). Approved page copy and standalone design exports remain follow-up inputs.

Project scripts load `.env.local` and keep caches within ignored paths. For a new install in a restricted cloud shell, set `XDG_CACHE_HOME="$PWD/.cache/native"` and `npm_config_cache="$PWD/.cache/npm"` before `pnpm install --frozen-lockfile`. The SWC compatibility pin and current lint configuration are explained in [ADR 0002](docs/adr/0002-verified-cloud-tooling.md).

## Repository map and next work

`src/app` contains public locale/CMS routes; `src/components` the UI shell; `src/i18n` and `src/messages` locale routing/catalogs; `src/cms` collections/access/migrations; `src/lib` content and integration boundaries. Technical guides are in [docs](docs/architecture.md). Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md) before contributing/reporting.

The three owner-supplied strategy DOCX originals and their [source index and analysis](docs/references/strategy/README.md) are in `docs/references/strategy/`. They cover the institutional narrative, communications supports and suggested website sections. The detailed structure is **recommendations, not a final validated structure**. The owner's 2026-10-09 request uses its section recommendations for empty placeholders within the existing 22-page structure, the single working route baseline in `src/lib/site.ts`; see [the canonical route map](docs/route-map.md) and [ADR 0004](docs/adr/0004-canonical-working-site-structure.md) for consistent links and coordinated future changes. Repository reference inclusion does not approve website copy, translations or new services.

The later [homepage restructuring brief](docs/homepage-restructure.md) records six
future body sections, placing achievements immediately after missions, retaining
figures in the hero and integrating Alliances into collaboration. Only Markdown
analysis is commissioned now; preserve the separately delivered missions and
section navigation, with five later modules still represented by placeholders.
Wait to apply the restructuring until the owner starts development of “Nos
réalisations emblématiques”, the section after missions. The brief records layout,
source copy, existing destinations and the remaining content/CMS dependencies.

The 22 approved routes remain. Nineteen pages use generated photo heroes; the homepage runs the owner's original `/videos/hero.mp4` after hydration when reduced motion is not requested. Contact now uses its own split introduction with the owner-supplied headquarters photo; search uses a compact functional results view. Homepage playback is muted, looping and inline, with no playback button as explicitly requested; its generated photo remains the loading/failure, no-JavaScript and reduced-motion fallback. Photographic heroes fill the scene, with four text-placement modes and readable overlays. The generated photo inventory includes executive-meeting, onboarding and handshake scenes; these do not document actual IRESEN facilities, people or events. The headquarters photo is installed on contact; real Green Energy Park and other page photography remain tracked separately. See [current contextual media and readiness](docs/contextual-hero-media.md), [the photo manifest](docs/hero-assets.json) and [contact provenance](docs/contact.md).

The homepage video decision is dated 2026-10-09. The unchanged 9.32 MiB original is an owner-requested performance-budget exception; end-of-file MP4 metadata needs byte-range delivery, and web-sized derivatives remain follow-up work. Continuous playback without a pause control does not establish WCAG 2.2.2 conformance. See [current media behavior and limits](docs/heroes.md#homepage-hero-video--2026-10-09) and [the validation log](docs/validation.md); the earlier [photo-replacement checks](docs/validation.md#generated-hero-placeholders--2026-10-09) describe that revision.

The 20 canonical pages other than contact/search retain introductory heroes followed by section placeholders in FR/EN/AR: headings and short draft notes describing the intended content. Contact replaces its scaffold with headquarters details, subject selection, platform links, a local email-draft form, a full-width location/map section, then native FAQ disclosures before the footer. Following the owner's explicit 2026-10-09 refinement, Google Maps is rendered directly in the server HTML with native lazy loading, without a reveal/remove control or lower explanatory strip. This replaces the earlier on-demand presentation. The separate directions link remains available. The supplied directions shortlink remains exact; the embed uses an address query, whose exact pin has not been verified. All contact section anchors remain available. See [contact behavior, sources and limits](docs/contact.md) and [the section guide](docs/page-sections.md). The sitemap retains its working 22-page directory. Full CMS workflows, server-side contact delivery, production media/email/identity and release assessment remain tracked work. Check evidence belongs in [validation](docs/validation.md). No production deployment, repository visibility change or open-source licensing decision is implied by this foundation. See [deployment](docs/deployment.md) and [security/privacy](docs/security-and-privacy.md).

Header, hero, following sections and footer share a 120rem container with fluid aligned gutters. Latin hero H1s use −3% letter spacing; selected languages use bold weight alone, and header menu labels/arrows center within their controls. Resting Menu/Search controls now use the owner's glass treatment over heroes; selected Menu becomes a white tab joined to a rounded dropdown with a 220ms downward reveal and direct reduced-motion display. See [header control rules](docs/design-system.md#compact-menu-control--2026-10-09), [current design rules](docs/design-system.md#hero-layout-and-typography-refinements--2026-10-08) and [the validation log](docs/validation.md) for each revision's check record.

The [mobile information hierarchy](docs/mobile-information-hierarchy.md) prioritizes essential orientation/action, supporting facts and optional proof through role/count ceilings and natural text growth. At `40rem` and below, the homepage omits its redundant scroll cue and stacks its two current links at full width. Its ISO badge is hidden below `70rem`, preserving desktop placement. All five figures stay in one row at every width, scrolling horizontally when needed with the scrollbar hidden. This follows the owner's general preference for hidden horizontal navigation scrollbars; native scrolling and visible focus remain. Other page heroes retain their behavior. The [homepage section navigation and three mission cards](docs/home-sections.md) are now implemented: the submenu follows the figures and sticks from `64rem`; full photographic mission cards use three desktop columns, stacked tablet rows and a native horizontal collection below `48rem`. The Figma/video treatment places white text and inline underlined destinations over shaded images, with a blue hover/focus tint and slight image zoom. Reduced motion keeps images still and applies the tint immediately. The mobile collection hides its scrollbar and shows a neighboring-card glimpse where space permits; keyboard/touch and no-JavaScript access retain all destinations, while enlarged text can use full-width cards. Current generated imagery covers storage, bioenergy, CSP, hydrogen, wind and smart grids; localized search references accompany the new sections and media. Earlier captures retain their original scope.

The owner's four 2026-10-09 mobile screenshots now guide the narrow header, homepage and footer composition: logo/hamburger row, white full-screen menu with canonical routes and bottom search/contact/legal/language access, a viewport-minimum image scene before the facts, and a single-column footer with separate newsletter rows. Original identity, content, RTL and the integrated search backend remain. See [the component adaptation](docs/design-system.md#mobile-reference-adaptation--2026-10-09) and [revision-specific validation](docs/validation.md#mobile-reference-adaptation--2026-10-09); screenshot examples do not approve new content.

Design work now uses [PRODUCT.md](PRODUCT.md) for product context, [DESIGN.md](DESIGN.md) for visual direction and [the repository design workflow](docs/design-workflow.md) for task-specific skills. The workflow is flexible guidance with constructive critique, shared tokens, FR/EN/AR responsiveness and rendered verification. Eight IRESEN skills and optional pinned Taste/Impeccable references live in `.agents/skills/`; they do not install personal/global skills or activate an engine or hook. See [source and license records](docs/design-skills-sources.json).

Completed requested increments are logged in [CHANGELOG.md](CHANGELOG.md). The owner has authorized automatic merge after passing local and current PR CI checks, followed by checkout synchronization and cleanup of completed task branches; see [CONTRIBUTING.md](CONTRIBUTING.md).

### Homepage research domains — 2026-10-09

The commissioned section below missions now provides seven thematic selectors,
four research axes per theme, changing generated illustrations and a native mobile
accordion in FR/EN/AR working copy. The supplied strategy is preserved as a
repository reference, not a public download or adopted roadmap. Themes and imagery
are registered in local search. See [the module guide](docs/research-domains.md).

## Homepage news — 2026-10-09

The [homepage news module](docs/home-news.md) displays five owner-selected
LinkedIn sources, month-level dates, responsive scrolling and animated arrows.
It prepares a Posts API field projection; live OAuth/API synchronization is still
future work. Cards use owner-requested short explanatory titles in FR/EN/AR; source
commentary stays separate. Three other body
placeholders and the full homepage reordering remain deferred.

## Homepage collaboration — 2026-10-09

The [collaboration section](docs/home-collaboration.md) now guides research/thesis,
solution development, industrial decarbonisation and technology decisions in
FR/EN/AR on a dark institutional ink ground. It recalls the owner-supplied +120
collaborators and existing ISO 9001:2015 claim, with canonical opportunities and
subject-prepared contact links. Two body placeholders and full reordering remain
deferred. See [verification](docs/validation.md#homepage-collaboration--2026-10-09).

## Homepage platforms and expertise — 2026-10-09

The owner commissioned the existing `platforms-expertise` module: outdoor GEP
photography behind a left introduction and four compact photographic platform
cards, with white text over dark gradients. A lower two-block band introduces
the laboratory network and complementary expertise. Original logos remain unchanged and display in light gray through CSS.
The section reuses the aligned grid, section-label/type roles and physical
signature corners; below 70rem the introduction stacks, below 40rem cards stack.
FR/EN/AR are working summaries; GreenH2A is explicitly in development and its
image is labelled as a 3D view. Existing platforms/network destinations remain.
Search covers the section, four card anchors and nine supplied media assets.
Achievements are the sole remaining body placeholder; full reordering remains
deferred. See [scope and sources](docs/home-platforms.md).
