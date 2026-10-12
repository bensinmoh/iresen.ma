# CMS interface review — 2026-10-11

The owner commissioned the **frontend only**, then selected all modules with locally
usable journeys. This request overrides database, authentication, integration and
migration implementation proposed in [the specification](cms-backend-specification.fr.md).
Document imperatives remain reference recommendations. No deployment is commissioned.

## Entry point and isolation

Open `/cms-preview` on the existing development server. A separate root layout
uses the existing licensed Jakarta/Alexandria fonts, original IRESEN logo, approved
blue/navy tokens and native CSS. It does not load the Payload admin or call content
APIs. The public release always returns 404. A local production-build review needs
both `CMS_INTERFACE_PREVIEW_ENABLED=true` and `CMS_LOCAL_REVIEW=true`, with
`PUBLIC_RELEASE` disabled. The route is dynamic so the gate is checked
at runtime. Headers prohibit indexing and caching; sitemap and public search have
no entry for this private review surface. This opt-in gate is not authentication.

The 2026-10-12 preparation closes `/admin` and non-public REST operations by
default in production. Local review still does not connect to those operations.
Schemas and existing publication rules remain separate.
No database migration, public media upload, LinkedIn request, analytics collection,
email, CMS mutation or search-index processing is introduced.

## Delivered review surface

- Institutional navy sidebar (owner follow-up) with the original white logo,
  collapsible desktop navigation, keyboard-operable mobile navigation and a French
  interface distinct from the FR/EN/AR content selector.
- Dashboard queues, missing-language and draft views linked to their local lists.
  Counts reflect the local review examples, not institutional totals.
- Actualités, événements, carrières, médias, publications, brevets, projets, appels,
  laboratoires, plateformes, organismes, personnes, pages, figures, coordonnées,
  thématiques, programmes, glossaire and users/rights.
- Common title/reference search, status/language filters, title/recent sorting,
  eight-row pagination, selection, local archive confirmation and safe CSV export.
- Per-module fields, shared metadata, FR/EN/AR text and SEO/search descriptions,
  draft save, submit, validate, local publication/archive and revision restoration.
  Shared edits return languages to draft; prior local published snapshots survive.
- Separate desktop/mobile reading previews. These are a review template, not a
  rendered preview of the actual public page or an authenticated preview service.
- Existing pages/sections selected from the canonical site registry. Their runtime
  copy is not imported. These provisional field contracts must be refined for each
  page model before connecting them to its real projection. No page builder,
  route/section creation or code/style editing is exposed.
- Media metadata, local raster preview, source/rights and usage fields; selected
  bytes are not stored or uploaded. Only metadata persists. The native file picker
  supports the declared review types under 10 MiB; server type verification,
  malware scanning, protected downloads and replacement remain phase-two work.
- Reference-only calculated figures (1,199 publications, 59 deposit references,
  14 labs), definitions/exclusions and a separate editorial-value form. No recalculation.
- Simulated role switch for admin/editor/publisher/translator/reader, with inaccessible
  publication actions and read-only fields for the reader. No real accounts,
  passwords, authentication, module/locale access matrix or MFA are created.
- CSV import rehearsal: module, file, column mapping, validation, preview and explicit
  confirmation. Up to 500 data lines / 1 MiB. Quoted commas/newlines work; repeated
  references within the file are rejected; repeat imports match module/reference.
  French variants become drafts, and no public snapshot is replaced. XLSX, complete
  business mapping, manifests, jobs, atomic server import and rollback are deferred.
- Local audit of saves/status changes/imports; technical journal, LinkedIn, Matomo,
  AI and indexing display their actual disconnected state and required dependencies.
- Session JSON export and confirmed reset of review examples. No successful server
  backup, restore, synchronization or analytics is implied.

The initial examples are explicitly labelled and live only in the browser model.
No fictional careers offers or copy of the 24 project demonstrations is seeded.
Publications, patents, lab and personal records are not copied into local storage.
User-created entries are review material, never institutional content or search data.

## Local persistence and limits

The versioned key `iresen.cms-interface.v1` stores only review text and metadata in
this browser's localStorage. A blocked/full storage reports memory-only retention;
export the session or current revision before closing. Reload preserves successful
local saves. Another tab's write raises a visible conflict and blocks further saves
in the stale tab; its own editor remains intact and can export its revision.
Unsaved navigation requires a choice and page unload invokes the browser warning.

This is an interface validation increment. Roles, transitions, logs and published
snapshots are local simulations, with no security or actual publication authority.
Do not enter credentials or private applicant/personal information. Interface-wide
EN/AR translations, full rich-text editing, server concurrency, scheduled publication,
analytics reports, working uploads and real integrations require the subsequent
connection increment and their appropriate approval/tests.

## Validation

See [validation log](validation.md#cms-interface-preview--2026-10-11) for actual
checks. Focused unit tests verify simulated permission boundaries, language review,
published-snapshot preservation, shared-edit invalidation, empty careers, unsafe
URL/date rejection, CSV parsing and spreadsheet-formula neutralization. Production
browser tests exercise local saves, review/publication, Arabic fields, preview,
persistence, unsaved work, reader mode, mobile navigation, idempotent import and
scoped axe checks. Normal CI tests enforce the disabled-production boundary.
