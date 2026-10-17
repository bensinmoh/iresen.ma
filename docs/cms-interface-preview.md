# CMS interface review — 2026-10-11

## Unique news highlight — owner follow-up, 16 October 2026

Actualités exposes a shared read-only boolean `highlight` and an administrator
star action in lists and saved editors. The owner’s later correction removes the
À la une column: the single selected article is identified by a filled amber star,
while alternative choices remain outlined. Editors can also see the selected star.
Development inspection confirmed zero À la une table columns and one selected
star rendered with the actual SVG fill weight. Scoped ESLint/format/whitespace pass;
its browser assertion remains queued under the shared-checkout hold. Confirming
replaces the previous selection atomically, without editing text or resetting
locale validation. Generic content writes cannot forge this field. The
`cms_news_single_highlight` partial unique PostgreSQL index prevents two news
records having `highlight=true`, including concurrent callers. Source refresh
preserves the selection. The selected article must be replaced before deletion.

Migration `20261017_001000_news_highlight` was applied locally and selects the
owner-specified “Samir RACHIDI évoque le rôle des compétences locales dans le
développement industriel.” (reference `7514300639057797120`). A read-only SQL check
confirmed exactly one selected record and the unique index. Public news reads the
common database selection, with published/public locale gates; older selected
native articles are fetched explicitly if outside the first page. Existing routes,
search references and article content are unchanged.

Development verification: one active star/five alternative choices; replacement
confirmation opened/cancelled; current public featured article checked in FR/EN/AR.
Scoped ESLint/TypeScript/format/whitespace pass. Added unit/browser regressions are
queued with full suites/build/CI under the coordination hold. No deployment.

## Entry actions and recoverable trash — owner follow-up, 2026-10-16

The later [delete-impact policy](cms-delete-policy.md) requires an authenticated
impact preview before confirmation. The popup lists incoming/outgoing references,
languages and retained files/history. Dependencies or application dossiers block
deletion; saved-entry/revision fingerprints are rechecked and audited server-side.

Entry lists expose a visible Actions column with compact pastel SVG icon buttons,
and saved-entry editors expose direct
“Remettre en brouillon”, “Remettre en revue” and administrator “Supprimer” actions.
Editor actions use full-width pastel buttons with the save button’s signature
corners, centered icon/label and matching typography. Draft, review and deletion
retain their amber, green and red colors; list actions remain compact icon buttons.
Recruitment offer rows include a matching folder icon on a dark orange background
beside the other actions. Its accessible label and tooltip identify the dossier
view; activating it still opens applications filtered to that offer.
Page-content section and detailed-text lists omit action buttons; their title rows
still open the editor, where the workflow controls remain available.
Editorial-indicator and recruitment-offer lists use the same compact controls;
calculated indicators and account management retain their dedicated boundaries.
Actions target the saved record, respect unsaved-edit protection and confirm the
selected language or all-language deletion scope. Review-to-draft requires a reason.
Editors retain their normal draft/submission rights; administrators can reopen an
approved record for review. Reopening retains the validated snapshot separately.

The authenticated same-origin actions endpoint checks role, revision and current
state in a transaction. Deletion checks inbound CMS relationships and attached
applications, snapshots the record into `cms_deleted_entries`, withdraws native
sources to private, removes validated snapshots and audits the operation. The row,
files and history remain recoverable. Source refresh/import explicitly skips these
tombstones, preventing automatic resurrection on reload. Public corpus projections
exclude their validated snapshots without falling back to an empty-corpus fixture.
Structural route/page templates are preserved. Dynamic search is rebuilt after
deletion/restoration. The administrator-only Corbeille restores a record as a private
draft requiring fresh validation; there is no permanent-purge action.

Migration `20261016_235000_cms_trash` was applied locally without deleting records.
UI verification opened/cancelled delete and review confirmations and inspected the
empty trash; existing content was not mutated for these checks. Targeted server
and browser regressions are included for the coordinated verification round.

Action-column refinement: blue open, amber draft, green review and rose delete
controls share the brand diagonal corners. The owner’s size correction reduces
compact list squares to 26px (15px SVGs, 4px gaps), matching the language badges;
labeled editor controls retain their 44px size. Compact controls show
their label on hover/keyboard focus and expose accessible names; editors retain
full visible labels. Offer actions sit in their Actions cell. Development desktop
and 390px mobile checks verified focus help and the delete/cancel dialog, with no
content mutation; mobile document width remained 390px. Scoped ESLint, TypeScript,
Prettier and whitespace checks pass. The updated browser regression remains
queued with full suites, build and CI under the shared-checkout hold.

## External analytics choice — owner follow-up, 2026-10-16

Google Analytics replaces Matomo and the AI-classification preparation cards.
LinkedIn remains the other external service. The dashboard names Google Analytics
and derives its two-service count from the same service registry. Google Analytics
is explicitly unconnected: no property credentials were supplied and no tracker,
consent change, report request or external integration was activated by this UI edit.

## Private account portraits — owner follow-up, 2026-10-16

Five owner-supplied portrait assignments now appear in the account header. Four
studio photos received identity-preserving blue-background edits; the fifth portrait
was reconstructed from the clearest supplied reference photos. Built-in imagegen
produced the images with a common navy/signature-blue background; generated masters,
the exact prompts and private assignment manifests remain under ignored
`.local/account-avatars/`. Originals remain unchanged. A 512px WebP derivative per
account is stored in `cms_account_avatars`, with display name, SHA-256 and explicit
AI/source provenance. No portraits, source images or email assignments are committed
as public assets or indexed by search.

`/admin/api/avatar` serves only the authenticated account's own bytes with private,
no-store/noindex responses. Session metadata supplies its display name and avatar
URL. The header uses an unoptimized image so no shared image-optimizer cache receives
private portraits; initials remain the failure fallback. Native roles/passwords are
unchanged. One existing account's email spelling was corrected through Payload on
the owner's explicit reply; its ID, role, salt and password hash were verified equal.

Migration `20261016_230000_cms_account_avatars` adds the private table. The local-only
`scripts/import-account-avatars.ts --manifest <private-file> --apply` importer checks
existing identities/roles, bounds/normalizes images, backs up previous avatar rows
and records an audit. It never creates users or changes permissions/credentials.
No new account, public download or deployment is involved.

## Account header — owner follow-up, 2026-10-16

The authenticated session banner and disabled role selector have been removed.
The header shows the stored account name and actual role to the left of a circular
avatar, using initials until a private portrait is configured. Clicking it reveals logout; Escape restores avatar focus and an
outside click or focus leaving the disclosure closes it. Logout keeps the existing
server session endpoint and unsaved-change confirmation. No role switch, account
data change or credential change is introduced by the header itself. The control is
44 × 44 CSS pixels, and profile/menu containment was checked at 1280, 820, 390 and
320 pixels. Browser disclosure/logout regressions are included for the final CI run.

## Existing-content approval — owner follow-up, 2026-10-16

The owner explicitly requests validation/publication of the existing site content,
completion of missing languages and removal of the unused draft. This supersedes
the earlier pending-review status for this local CMS baseline. All **1,847** records
now have validated FR/EN/AR variants (**5,541** variants), with **0** review records,
**0** missing language titles and **0** drafts. The two sourced career offers now
have complete English/Arabic translations, preserving their French requirements,
deadline and application destinations. Native project/opportunity locale approvals
are synchronized through Payload access/publication hooks.

The Institute technical audit draft was identical to its validated content and
was restored from that snapshot; no content record was deleted. The empty draft
dashboard card is hidden and reappears when a new draft exists; the three-stage
editorial workflow remains available for future work. Every visibility value was
preserved: **52 private / 1,795 public** records. Approval does not make private
patent filings, private projects or private files publicly accessible. No deployment
or external release was performed.

`scripts/approve-existing-cms-content.ts` defaults to a read-only audit, requires
the explicit `--apply-existing-content-approval` flag for this owner-requested local
operation, saves a private rollback snapshot, locks the content revision, uses one
transaction and records previous variants and actor-attributed approvals. It refuses
unexpected missing translations or additional draft changes. Already-approved input
is a no-op. Search was rebuilt: **5,652** eligible localized references and no queued
jobs; native public sources include 70 projects and 2 offers in each locale.
Private backup stays under ignored `.local/cms-finalization/baseline-approval-*`.

## Complete site corpus in the common database — 2026-10-16

The latest owner request commissions a complete CMS pass against the current
site, using the common database and no fictional runtime content. This section
supersedes the earlier mirror-only/public-reader boundary and browser-demo mode.
Administration now requires the database workspace; disabling it closes `/admin`
instead of displaying fixtures. `initialWorkspace()` is empty. Legacy browser
review storage is no longer loaded; disconnected content saves fail closed. Demonstration
records survive only inside isolated test fixtures and never seed PostgreSQL.

The authenticated transactional import now retains **1,766** source records,
coexisting with **81** native source records: **1,847** total. Read-only SQL confirms
zero duplicate module/reference keys, zero demonstration IDs and zero empty French
titles. Four administrators and one editor remain unchanged; applications remain
empty because no actual applicants have been received. The real communication /
digital and patent-engineering offers are preserved. “Test de batteries” is an
actual laboratory name, not a fixture; no real record was deleted by a text match.
A private local database backup preceded the audit.

| Rubrique                                               | Fiches en base |
| ------------------------------------------------------ | -------------: |
| Publications                                           |          1,199 |
| Patents (30 source-confirmed granted)                  |             59 |
| Projects (including retained private / review records) |             71 |
| Historical calls                                       |             21 |
| Media: 189 retained references + 8 native records      |            197 |
| Careers: actual offers                                 |              2 |
| Laboratories / platforms                               |         14 / 4 |
| Organigram: poles, departments, people                 |             17 |
| Board / scientific council                             |         16 / 8 |
| News / events                                          |          6 / 5 |
| Page content: 162 sections + 36 complete catalogues    |            198 |
| FAQ / coordinates                                      |          6 / 1 |
| Themes / search-related vocabulary groups              |        10 / 12 |
| Supplied editorial figure (young researchers)          |              1 |

Media imports include 20 library photos, 10 external reports and the other unique
intentionally registered public asset URLs. File bytes are not copied or replaced.
All local static paths resolve. No private workbook, original report PDF, candidate
file, withdrawn fictional project or excluded publication is imported. Source-only
missing information stays empty; call/news period precision remains intact.

The full catalogues retain nested text and arrays: missions, roadmap axes,
chronology, biographies, navigation, utility pages and interface copy. They are
reachable under **Contenu des pages → Textes détaillés du site**; the existing
section chooser now opens the imported section rather than a new empty duplicate.
Structured JSON fields show the actual content; the server accepts text edits only
within the existing keys, types and array structure. Typed resource forms remain
separate. Source records and namespace identity remain immutable. Existing
unchanged imported visibility is reconciled once to the already delivered French
publication state (v3); this does not publish new material or approve EN/AR.

`SITE_CONTENT_DATABASE_ENABLED=true` selects common-database readers for the
retained localized catalogues, named text records, bibliographic catalogue, granted
patent catalogue, archive calls and library photos/reports. The flag is enabled
only in this ignored local environment and defaults false in `.env.example`.
Native project, opportunity and video readers keep their existing access and
locale gates. The current templates/routes remain fixed; importing content does
not commission new public routes or an automatic public release. Existing delivered
EN/AR catalogue baselines remain working copy; newly approved snapshots are
separate, with no translation fallback for native CMS records.

Public readers select source metadata and validated snapshots only, excluding
notes, revisions, account and applicant tables. Shared resource metadata is read
from the validated snapshot, so editing an author/year/link does not leak its
pending draft. Published snapshots remain distinct from working revisions. Search
uses the same common-database projections, retaining stable IDs and destinations;
its catalogue cache observes the committed content revision and the existing
transactional index/vocabulary pipeline handles changes.

### Verification ledger for the complete pass

- Static source inventory: 1,766 unique IDs, schema-valid payloads, no missing titles,
  invalid business values or dangling/cyclic imported relationships. The canonical
  client payload is roughly 7.83 MB before native records/history; writes continue
  to send only changed records, not the whole catalogue.
- Actual PostgreSQL inventory: 1,847 records, module counts above, zero duplicates
  and zero runtime demonstration IDs. Repeated loading preserves existing edits.
- Read-only DB/public-source parity: 1,199 publications, 30 granted patents, 20
  library photos, 10 reports, 21 archived calls and **4,818** search references;
  **zero differences** from the retained current public projection. No explicit index rebuild
  or content republication was run for this equal baseline.
- Development browser: every content module and the user-management entry opened;
  actual counts and records, complete Institute JSON, FR/EN/AR catalogue rendering,
  source images and database connection view inspected. A live FR search resolved
  the real shell-and-tube publication to its canonical catalogue anchor; the public
  calls listing displayed the 21 retained editions. This is development
  verification, not a production browser-suite result.
- An actual Institute-catalogue internal audit note was saved, reloaded and submitted
  for review. Automatic approval review rejected the optional validation/republication
  action as unauthorized publication. No workaround was used. The revision was
  returned to draft with a real technical note; SQL confirms the previous published
  snapshot is retained and its body/structured text exactly match the working copy.
  Do not describe the publication step as verified in this pass.
- Scoped ESLint, TypeScript, formatting and whitespace checks use the available
  Node 24.21.0, not the requested 24.22.0. Regression sources cover empty runtime
  state, structured-content shape, public/draft separation, original media ordering,
  delivered language baselines and the authenticated shell. Browser fixtures are
  intercepted in their isolated contexts and never write test applicants/content
  into the shared local database.
- Unit/integration/E2E/axe suites, production build, CI and Git finalization remain
  held by the shared-checkout protocol; Editorial alone coordinates final checks.
  No deployment, external visibility/DNS/provider change or third-party message occurred.

## Historical retained-corpus connection — 2026-10-16

The owner's report that most modules were empty commissions the missing data
adapters and ingestion, superseding the earlier exclusion of static corpora from
the connected workspace. The authenticated CMS now imports the retained source
records into PostgreSQL, using deterministic module/reference identities and a
single transaction, without overwriting existing saved revisions on later login.
A new private pg_dump backup succeeded before this import.

Actual database inventory after import:

| Module                                        | Records |
| --------------------------------------------- | ------: |
| Publications                                  |   1,199 |
| Patents                                       |      59 |
| Calls (historical editions)                   |      21 |
| Laboratories                                  |      14 |
| Organigram (3 poles, 7 departments, 7 people) |      17 |
| Board seats                                   |      16 |
| Scientific council                            |       8 |
| News                                          |       6 |
| Events                                        |       5 |
| Platforms                                     |       4 |
| Existing contact FAQ                          |       6 |
| Topics                                        |      10 |
| Headquarters coordinates                      |       1 |
| Canonical page-section content                |     162 |

The 1,528 added records coexist with the existing native media, careers and project
records (1,609 total at this verification). Read-only SQL inspection confirmed the
module counts and zero duplicate module/reference keys. No accounts, applicants,
fictional offers/projects, excluded publications, private workbooks or scientific
production counters are seeded. Empty editorial figures/glossary collections remain
usable for later supplied content, not filled with fabricated entries.

`retained-content.ts` maps only repository-retained public projections and locale
catalogues. Bibliographic titles/authors, dated citation/quartile evidence, patent
filing/grant distinctions, call source notes, biographies, institutional marks and
original asset paths remain available. Each imported record carries immutable
source identity/version and a read-only JSON source snapshot alongside its editable
business fields. Missing abstracts, exact dates, affiliations, expertise, mandates
and personal details stay absent. Month-only news and historical call periods are
shown without invented days. Working EN/AR text remains in review; non-granted
patents acquire no approved public snapshot. Imported authoring visibility starts
private; import itself never grants a new public release or translation approval.

All these modules use persistent `cms_authoring_entries` shared/locale JSONB data,
with the existing server permission, reference, revision, audit and concurrency
checks. The six existing Payload adapters continue to serve native records. Retained
file-backed entries are edited in their authoring records; they do not become new
Payload news/call records merely on saving. Their existing static public page/search
projections remain unchanged in this increment. This is persistent CMS management,
not a claim that changing a retained authoring snapshot already replaces every
static public component. Future public adapters must respect canonical destinations,
locale/publication gates and search indexing before enabling that behavior.

A development refresh issue was also reproduced: re-evaluating the browser store
module could reset it to design examples while React retained the authenticated
shell. Content and recruitment runtime references now survive module refresh in
the current browser window only, preserving connection/revision/listeners and
in-flight saves. Private data never enters server globals or browser localStorage
through this mechanism. Authenticated content saves also fail closed if their database
connection state is missing, rather than saving a browser copy. Actual
counts/connection rows stayed correct after a live
store-module refresh. Reload still authenticates and reloads PostgreSQL normally.
Regression source covers retaining the connection/revision and authenticated private
document URLs across module reload, with no fallback localStorage write.

The sidebar now shows actual per-module counts; each module heading identifies
PostgreSQL storage, and Integrations exposes database connection/count rows separately
from unconnected external services. Original image paths render source thumbnails.
Bibliographic forms expose missing abstracts as optional, all supplied evidence
fields, and the original source JSON. Read-only source metadata is enforced on the
server. Client saves send changed records, avoiding repeated upload of the full
1,199-record corpus; canonical snapshots still come back from PostgreSQL. Dashboard
review tasks are capped at eight displayed items with total counters retained.

Verification ledger for this increment:

- Static inventory: 1,528 stable unique IDs, complete titles, schema-valid payload,
  no invalid business values or dangling/cyclic imported relations; initial payload
  approximately 4.17 MB. This is source/data inspection, not execution of a test suite.
- Actual local backup and authenticated transactional ingestion succeeded. Repeated
  reloads preserved counts and saved revisions. SQL counts matched the above inventory.
- Browser: publication list/columns, actual account/role, database counts, and a real
  publication save/reload/review/approval were verified. Only a temporary internal
  verification note changed; it was restored and the original FR editorial state
  reinstated. Bibliographic values and the existing public site were unchanged.
- Scoped ESLint, TypeScript, changed-file formatting and whitespace checked on the
  available host runtime. Regression source added for retained corpus identities,
  exact source values, evidence, missing dates/abstracts, locale gates and relations.
- Unit/integration/browser suites, production build and current-head CI remain queued
  under the shared-checkout hold. No push, merge, deployment, public publication,
  external synchronization or third-party message performed.

## Canonical CMS address — 2026-10-16

The owner's route correction makes **`/admin`** the custom CMS entry and
`/admin/api/*` its authenticated content/recruitment/session/media/document API.
The former `/cms-preview` prefix redirects with HTTP 308, retaining suffix/query
and write methods. Both prefixes remain closed in public release; production local
review still requires both existing review flags. The standalone Payload catch-all
now requires a nested segment, so it no longer owns the root `/admin` page; native
account management/login remain at `/admin/collections/users` and `/admin/login`,
with their previous `administrationEnabled` gate. Public routes are unchanged.
Cookie paths are `/`, so existing sessions survive the move. Client fetches and
private CV URLs use the canonical prefix. Internal component/module folder names
are implementation identifiers, not additional routes.

Development checks: `/admin` HTTP 200, old entry HTTP 308 with query preserved,
new anonymous session endpoint HTTP 401. Existing-session browser navigation and
native account-management destination inspected. Scoped formatting/lint/TypeScript
and whitespace checked; production/full suites remain queued under the shared hold.
Browser test URLs and gate/redirect regression sources updated for final batch checks.

## Current database connection — 2026-10-16

The owner's subsequent request **“Raccorde avec la base de données”** supersedes
all frontend-only/memory-only limitations below when `CMS_WORKSPACE_ENABLED=true`.
The previous sections remain a historical record of the disconnected review mode.
No deployment, public release, external applicant intake or message sending is included.

The existing local PostgreSQL database is connected through authenticated server
routes under `/admin/api`. Open `/admin` and sign in with an existing
Payload administrator/editor account. No account, password or fictional applicant
is created. The local flag is enabled in ignored `.env.local`; `.env.example`
defaults to disabled. Public release still returns 404, and production local review
still requires both existing review opt-ins. Cookie sessions are HTTP-only and
same-site; writes check Origin. Login attempts are rate limited in PostgreSQL.

Migration `20261016_200000_cms_workspace` was applied successfully after a private
local pg_dump backup under ignored `.local/backups` (mode 0600). Read-only inspection
confirmed the new tables and one existing administrator. Legacy assignable publisher
roles are withdrawn; SQL and account options allow only admin/editor. The existing
explicitly gated project-review reader with synthetic ID 0 retains its internal
read compatibility and cannot publish. No other project writer's code was changed.

All module records persist in `cms_authoring_entries` (identity/module/reference,
JSONB shared fields and FR/EN/AR variants, visibility, source pointer). Revisions and
server-derived authenticated actor IDs are stored separately in
`cms_authoring_revisions` / `cms_private_audit`. The schema view exposes this actual
storage. Native news/projects/calls/opportunities/pages/media are loaded on login
and their edited fields pass through Payload access, validation, publication and
indexing hooks within the same transaction. Source revision conflicts require a
reload; replaced authoring snapshots remain in history. New incomplete drafts can
remain in the authoring table until their native required fields are supplied.
Fixed page sections and newly introduced modules (FAQ, organigram, councils, etc.)
are persisted authoring records; their public page projections are not implemented
by this increment. Static publication/patent/laboratory/governance corpora are not
silently imported or replaced. Approval in these modules records editorial state
in the database, and does not claim publication on a static public page.

The connected role comes exclusively from the authenticated account. Server
operations recheck draft/review/approved transitions, reasons, relations and
administrator-only approval/withdrawal. Meta rows lock each content/recruitment
transaction; revision comparison rejects stale browser writes instead of silently
overwriting another user's work. Browser examples/localStorage are never imported.
Native collections retain existing language/publication/media gates.

Recruitment uses separate private candidate/application/document/interview/evaluation
tables with foreign keys, normalized unique email, one application per offer/profile,
and server-controlled transitions/audit. Manual reception, stages, spontaneous
applications, shortlist, notes, evaluations and interviews now survive reloads.
CV/DOC/DOCX bytes are stored in PostgreSQL BYTEA (5 MB limit), separate from public
media. Server signature checks and DOCX package checks supplement the browser
validation; this is not malware scanning. Every document read/download requires a
staff session; responses are private/no-store with MIME, filename and PDF byte-range
handling. Media uploads use the existing protected Payload storage and begin private.
All photo/thumbnail, project image, portrait, logo and illustration relation fields
now provide a direct device-file upload instead of a media-library selector. JPEG,
PNG and WebP files are limited to 10,000,000 bytes; image-field requests additionally
reject non-image file signatures on the server. Uploading creates a private draft
media record, shows its authenticated preview and adds its ID to the current form;
saving the parent draft retains the association. Choosing a replacement keeps the
previous file intact. Removing an association does not delete the media file.
Document relations remain separate. Existing source images and original SVG assets
are preserved. Upload completion merges into the latest form state so other edits
made during the request are retained, including when the user switches records.
The organisation interface now consistently labels its units “Direction”, including
the hierarchy, creation button, type choice, parent selector and recruitment label.
Existing `department` keys and record IDs remain stable to preserve database links.
The indicator registry additionally exposes “Projets collaboratifs soutenus” from
complete French public validated project snapshots and “Brevets accordés du
portefeuille PI” from the explicit source-backed grant flag. Private project
records and unvalidated-only projects are excluded from the first; ungranted and
unknown patent flags are excluded from the second. Read-only local database
inspection on 16 October 2026 found 70 eligible projects and 30 grants out of 59
filings. These are dynamic calculated indicators, not new editorial records.
The registry also counts calls-for-projects records from the common database,
across all editions and editorial states; this is distinct from currently open calls.
The custom administration portal uses `/brand/apex-leaf-lime.svg` as its SVG favicon,
reusing the exact original apex-leaf path in Innovation Lime (`#A9C47F`). The
received blue source SVG and public-site favicon remain unchanged. This decorative
interface asset is not an independent searchable content resource.
No Tally callback, website form receipt, automated candidate ranking, email/calendar
integration or retention-duration policy is introduced. Definitive record/document
deletion is unavailable rather than inferred from a missing client snapshot.

Connection verification ledger:

- Backup and additive local migration succeeded; table names/account role counts
  verified against the actual local PostgreSQL database without exposing credentials
  or applicant records.
- Scoped ESLint and TypeScript checked on available Node 24.21.0; pinned 24.22.0 is
  unavailable on this host. Changed-file formatting and whitespace also checked.
- Development browser displays the existing-account login form. An anonymous
  content API request returns 401 with private/no-store/noindex/nosniff headers.
- Authenticated UI saves, concurrent writes and private CV download have not been
  exercised with the owner's credentials. No password was inspected/reset.
- Server file-boundary regression cases added; execution of unit/integration/E2E,
  production build and current-head CI remain queued under the shared-checkout hold.
  Do not treat static checks or migration success as authenticated journey evidence.
- No push, merge, deployment, DNS/visibility change or external message performed.

## Local login correction — 2026-10-16

Owner-reported login failure was reproduced as HTTP 403 before password checking:
Next's internal request URL used `localhost`, while the browser used `127.0.0.1`.
Write-origin checks now compare Origin to the actual Host authority and scheme,
reject missing/foreign origins and ignore untrusted forwarding headers. Payload's
CSRF allowlist also includes explicit localhost/IPv4/IPv6 loopback aliases on the
configured port in development only; production origins remain unchanged.

Verified with the existing administrator: login HTTP 200, session cookie recognized,
content/recruitment loading HTTP 200, unchanged authenticated content save HTTP 200,
foreign origin HTTP 403, and diagnostic-session logout HTTP 200. The browser reached
the authenticated dashboard and displayed the actual database entries. No content
was edited/published by this diagnosis; first authenticated load initialized the
native-source authoring mirrors. The browser verification session remains open for
review; only the separate command-line diagnostic session was closed. No password
change was needed for this correction. Owner-requested password/account creation in
preceding turns was applied separately; secrets are not recorded in this document.

Scoped ESLint, TypeScript, formatting and whitespace checked. Regression cases for
origin/Host matching, ports, schemes, malformed authority, ignored proxy headers and
development-only aliases added but not executed under the shared-checkout hold.
Full suites, production build and CI remain queued with the coordinator.

The owner commissioned the **frontend only**, then selected all modules with locally
usable journeys. This request overrides database, authentication, integration and
migration implementation proposed in [the specification](cms-backend-specification.fr.md).
Document imperatives remain reference recommendations. No deployment is commissioned.

## Entry point and isolation

Open `/admin` on the existing development server. A separate root layout
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
  laboratoires, plateformes, organigramme, conseil d’administration, conseil scientifique,
  pages, figures, coordonnées, thématiques, glossaire and users/rights.
- Common title/reference search, status/language filters, title/recent sorting,
  eight-row pagination, selection, administrator-only local withdrawal and safe CSV export.
- Per-module fields, shared metadata, FR/EN/AR text and SEO/search descriptions,
  draft save, submission, combined local approval/publication, reasoned rejection and revision restoration.
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
- Simulated role switch for administrator/editor, with administrator-only approval
  and rejection, and editor content locked while in review. No real accounts,
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
persistence, unsaved work, role restrictions, mobile navigation, idempotent import and
scoped axe checks. Normal CI tests enforce the disabled-production boundary.

## Owner revision — 16 October 2026

This increment supersedes the five-role/five-status interface described above.
The preview remains browser-only. No Payload configuration, migration, account,
public content, database connection, tracking or production gate is changed.

### Two roles and three stages

Only **Administrateur** and **Éditeur** can be selected or assigned in this preview.
Both can write drafts and submit a complete locale. An editor cannot change a
revision under review. The administrator either approves it directly into the
combined **Validé / publié** stage, or declines it with a mandatory internal reason
and returns it to **Brouillon**. There is no separate validated stage or archive.
The visible sequence is **Brouillon → En revue → Validé / publié**. Review decisions
are per language. Editing a previously approved locale creates a new draft while
retaining its separate local approved snapshot. Shared edits invalidate all locale
approvals. Bulk withdrawal is administrator-only and returns the selected locale
to draft, removing its local approved snapshot. This does not withdraw real content.

Old browser sessions are read without discarding saved text: previous `validated`
values become `review`, archived working values become draft, and historical actor
roles are mapped to the two retained roles. Newly localized business fields move
from shared metadata to the French variant; EN/AR are never inferred. Old keys
remain in the stored entry where no explicit mapping exists and can be recovered
from the full session JSON export. A browser conflict still blocks writes.

### Business forms, lists and visible data contracts

`src/lib/cms-preview/contracts.ts` defines all 19 modules. The same descriptors
render business inputs, business list columns, import mappings and schema tables.
News lists show photo/thumbnail references, publication date, type and source link.
Project forms expose acronym, photo, short description, consortium, location,
programme, selection call, dates/year/duration, sourced budget, domain/status,
hosting platform, coordinator, objectives, document and provenance link. Other
modules have their own fields rather than these news/project columns.

Text, long text, URL, email, date, bounded number, controlled select and single/
multiple relations have distinct controls and validation. The field layer also
supports boolean/JSON contracts. Media and programme relations resolve only against
local review entries. Empty relations explain which module to populate first;
dangling references cannot be saved. Required business fields are enforced before
submission; incomplete drafts can still be saved. Dates, allowed values, numbers,
URLs and reference uniqueness are checked locally. Title/body/SEO and localized
business fields are independent FR/EN/AR values, including RTL input direction.

**Structure des données** exposes every collection, its proposed storage target,
column keys, types, required rules, translations and relationships. Each module
also has an expandable schema; each editor has a **Structure & types** tab and
an inspectable connection object. `connection.ts` converts form strings into
numbers, booleans, relation arrays, nullable missing values and locale objects.
Revision JSON exports use this contract; session JSON remains a full local backup.
CSV lists and import mapping include module business fields. Imports reject invalid
field values or missing relation targets without partially applying the batch,
exclude entries under review and preserve approved local snapshots. Revision
history now also captures shared metadata for future restoration; older revisions
without a shared snapshot keep the current metadata.

These are explicit **connection contracts**, not a claim that every proposed
collection already exists in PostgreSQL. Existing News/Projects and other Payload
collections have different keys, rich-text structures, relation shapes and publication
rules. Their adapters and policy migration must be implemented and checked in the
later database phase. Fixed public pages retain their canonical page/section
registry; binding individual component projections is still server-adapter work.
No layout builder, new public route or runtime page copy import is introduced.

### Analytics first

The dashboard opens with analytics, ahead of editorial queues. A dedicated
**Analytics** page exposes 7/30/90-day audience periods, language/module filters,
and six report surfaces: audience trend, popular pages, acquisition, devices/
languages, internal search and actions/downloads. Audience metrics show unavailable
values and a disconnected state; no fabricated traffic, charts or collection.

Editorial stage distribution, title/body completeness by language and a per-module
quality table are calculated from local preview entries, explicitly across all
local dates. The period filter applies to future audience reports, not these local
inventory totals. The editorial summary can be exported as CSV. Frontend role
filtering excludes the users module from an editor's inventory.

### Check ledger for this revision

- Final scoped ESLint and `tsc --noEmit`: passed on the available host runtime.
- Changed-file Prettier and Git whitespace checks: passed. Impeccable detector: no findings on the inspected CMS UI targets.
- Development-browser review: news business columns; editor submission and locking;
  administrator rejection with reason, resubmission and combined local approval;
  dashboard at desktop and narrow widths; project Arabic inputs and schema review.
  Rendered desktop review at 1280px and project form at 390px; the mobile page
  width equalled its 390px viewport, with native menu access and RTL fields.
- Unit/browser test sources updated for the new contracts and workflow. Execution,
  final isolated production build, production responsive/axe checks and current-head
  CI remain pending under the shared-checkout hold. Do not reuse the 11 October
  production checks as evidence for this revision.
- Host shell provides Node 24.19.0, below the requested 24.22.0; no pinned-runtime
  verification or full CI result is claimed by the local static checks.
- No commit, push or merge while held; `institut-editorial` owns batch finalization.

## Owner governance navigation correction — 16 October 2026

The owner withdraws standalone **Organismes** and **Programmes** from the preview.
**Appels à projets** is the retained calls entry point; projects now reference a
local call through `callId`, with no dependency on a programme catalogue. Organiser,
funder and institution labels remain fields on their owning records, without a
separate organisation registry.

**Personnes** becomes **Organigramme**. A single local collection distinguishes
poles, departments and people. The module provides explicit creation actions,
a hierarchical reading view, parent unit, display order and unit leader relations.
Person-only fields include confirmed function, first/last names, portrait, complete
biography (localized body), short biography, expertise, affiliation, professional
contact details, profile and appointment date. Unit forms omit person fields.
Parent relations accept only units; leader relations accept only people. Self
references, hierarchy cycles and incompatible type changes for referenced records
are rejected. All fields/types/conditions are visible in the schema inspector.

Two separate modules are added: **Conseil d’administration** (institutional seats,
logos, representatives, roles, mandate dates, order and source) and **Conseil
scientifique** (members, affiliations, roles, expertise, portraits, biographies,
professional profiles, mandates and source). Both retain the same three-stage,
two-role local editorial workflow. No real council or staff records are seeded.

Previously saved people move to the organigram as people without changing IDs or
texts. Withdrawn organisation/programme records stay only in the full-session
backup, outside navigation, search results, analytics and imports. They are not
invented as council seats or calls. Known old institution references resolve to
their saved labels during migration. Old people/programmes URL fragments lead to
the organigram/calls respectively. Public pages, real schemas and database access
remain unchanged.

Follow-up verification: scoped ESLint, TypeScript, formatting and whitespace checks;
development-browser review of navigation and pole/person creation/rattachement,
plus distinct council forms. Updated unit/E2E cases are queued for the coordinated
batch; no test suite, production build, CI or Git completion while held.

## FAQ and recruitment workspace — 16 October 2026

The owner commissions a FAQ module and a complete recruitment interface, still
inside the disconnected CMS preview. This supersedes the earlier no-applicant-UI
boundary for this local surface only. The public careers page, its real offers,
original PDFs, Tally links, mail-draft internship/spontaneous journeys, database
collections and production/public-release gates are unchanged. No external form
or inbox is polled; no application is actually received from the website.

### FAQ

The twentieth content module manages localized question/answer (title/body),
category, intended placement, display order, search keywords and source. It uses
the existing two-role, three-stage editorial workflow. Its forms, list columns,
CSV mapping and connection-object/schema inspection use the same field contracts.
No real FAQ answers are invented or published. Public page/search projections and
binding to the intended placements belong to the later connection increment.

### Recruitment operations

Carrières now contains **Offres**, **Candidatures**, **Stages**, **Spontanées**,
**Shortlist**, **Entretiens** and **Structure des données**. Offers retain their
normal locale editorial review. Separate open/closed state, department, vacancy
count, experience, dates, contract/location, missions, criteria, qualifications,
skills, recruiter, document and optional external application destination prepare
offer management without importing real offers into the preview.

A local reception form creates a candidate profile and an application. Existing
profiles can be reused for multiple dossiers, with unique email/profile identity.
Offer responses require a real local offer reference. Stage requests distinguish
PFE, observation, practical, hybrid, volunteering and Other, with institution,
study level, duration and availability. Spontaneous applications use a separate
view. Candidate profiles contain name, contact details, professional formation,
experience, discipline, skills, languages and optional portfolio. Profiles and
applications remain outside public-content entries and global CMS search.

The recruitment lifecycle is distinct from editorial publication: **Reçue → À
étudier → Shortlist → Entretien → Retenue / Non retenue**, with withdrawal and
administrator-only reopening available. Each transition is manually chosen,
requires a professional reason and records actor/time/history. Editors can assess,
shortlist and prepare interviews; only administrators can retain/reject/withdraw
or reopen a final dossier. Direct status edits are rejected by the domain model.
Batch decisions validate the whole selection before applying it.

Lists support query, offer, recruitment stage, skills, minimum experience, handler
profile and reception-date filters, name/reception sorting, pagination, selection
and safe filtered CSV export. Shortlist includes prescreened and interviewing
candidates, with formation, experience, skills and availability columns for human
comparison. There is no automatic CV analysis, ranking or selection.

Each dossier exposes profile, documents, human criterion/rating/justification,
interview scheduling/outcomes, internal notes and chronology. Interviews use
Africa/Casablanca wall-clock input, stored as ISO instants; they can be edited,
completed or cancelled. Scheduling does not silently change the recruitment stage.
No email, invitation, calendar event, call or meeting link is sent/created.
Evaluations and interview changes also appear in dossier history.

### Private local documents and persistence

CV, motivation letter and professional dossier attachments accept PDF/DOC/DOCX
up to 5,000,000 bytes. Local signature/extension checks reject obvious mismatches;
this is not server validation or malware scanning. PDF consultation uses an inline
browser viewer and a local download; Word consultation uses a local download with
no external conversion. Candidate documents are shared across that candidate's
applications, outside public media. Download/view URLs are temporary browser Blob
URLs and never public asset paths.

**Candidate text, recruitment state and document bytes are memory-only** in this
preview, surviving module/role navigation but not a full browser reload. They are
not written to localStorage, CMS/database, public search or the general session
backup. A separate explicit recruitment JSON export preserves text/metadata,
without document bytes; filtered CSV exports are also explicit. Offers/FAQ still
use the existing browser review persistence. The interface states these limits
before local entry and protects unsaved forms/notes/interview drafts on navigation.
No candidate fixtures, real applicants or fictional offers are seeded.

`recruitment.ts` defines validated candidate/application/document/interview/
evaluation/event contracts and pure operations; `recruitment-store.ts` owns the
isolated in-memory state and local file handles. The recruitment schema tab shows
columns, types, foreign keys and the future private storage boundary. The future
server must implement authenticated permissions, concurrency, secure intake and
private file storage/access, file analysis, audit identities, retention and any
approved external-form/email/calendar integrations. No retention duration,
processing authorization or legal-compliance claim is invented here.

### Verification ledger

- Scoped ESLint, TypeScript, changed-file Prettier and whitespace checks: final
  results checked for this increment on the available host runtime (Node 24.19.0).
- Development-browser journeys: internship reception and motivated shortlist;
  spontaneous reception; local Morocco-time interview; manual evaluation;
  editor final-decision restrictions; FAQ submission and Arabic input direction.
  Desktop and 390px mobile inspected; mobile document width matched its viewport.
- The native browser automation file chooser failed while attaching a synthetic
  PDF. Inline CV rendering and download are implemented but their rendered/file
  journey remains unverified in this pass; do not claim that interaction passed.
- New domain/unit and browser cases cover identities, stages/roles, atomic batches,
  offer references, stages/spontaneous requests, evaluations/interviews/history,
  CV signature/size checks, FAQ, memory-only reload and absence of content API calls.
  Their execution and production build/browser/axe/CI remain queued under the
  shared-checkout hold. Earlier production evidence does not cover this increment.
- No deployment, public content change, real receipt, migration, credentials,
  third-party message, push or merge is performed by this workstream.

## Sidebar counters — owner follow-up, 16 October 2026

Module totals are upright muted numbers in the font’s lightest weight (200), without a white surface. A separate
white badge appears only for a nonzero count of items with at least one locale
in review or incomplete editorial text (required title/body). Each item counts
once even when several languages need attention. The existing complete corpus
shows totals and no attention badges. Counts use the accessible saved workspace,
without changing records. Development rendering verified the zero-attention state;
scoped ESLint, format and whitespace checks pass. Full suites remain on hold.

Source-link display correction: the list’s source URL column renders valid HTTP(S)
addresses as a compact “Lien” hyperlink with the unchanged destination in a new
tab. The full URL remains available on hover and in the editor. Missing/unsupported
values retain their existing text rendering. No stored content is modified.

Publication-list DOI URLs use “Accéder à la publication” hyperlinks with the
unchanged destination and the same HTTP(S)/new-tab treatment as source links.
Missing DOI values remain absent; no bibliographic record is edited.

List-density correction: remove technical record references beneath content and
offer titles. Stored identities and editor metadata remain intact; indicator
provenance text is retained. No database content changes.

## Collaborators and ISO editorial indicators — 16 October 2026

The register now contains two additional real editorial records in the common
database: `collaborators` (+120) and `certification` (ISO 9001:2015), alongside
young researchers. Values/labels mirror the existing public site under the owner's
retained-corpus approval; no new institutional claim or measured total is inferred.
All three existing locales are retained. Future edits follow the normal review
workflow, with the published shared snapshot kept distinct from the draft.

The value field is required text, supporting prefixes and alphanumeric standards
instead of losing them in a numeric input. The collaborator value drives the home
collaboration band and careers environment; the ISO value drives the home hero,
collaboration band and careers environment. A later standard/version is therefore
editable in the CMS. Private/withdrawn or unapproved locale snapshots do not replace
validated public values. The existing stable home/search references use these same
approved projections; local search was rebuilt successfully.

Verification: the populated register has three real records; the ISO value opens
as an editable text field. Current public +120/ISO 9001:2015 checked on FR/EN/AR
homepages. Scoped ESLint/TypeScript/Prettier/whitespace pass. New projection tests
cover draft isolation, later version approval and private/locale withdrawal; their
execution and full suites/build/CI remain held by coordination. No deployment.

Editorial-indicator row correction: compact action buttons sit at the trailing
edge beside the title/value, with the text allowed to wrap on narrow screens.
The duplicate standalone opening arrow is removed; the title and open action work
as before. No data or workflow change.

## Numeric-source audit — 16 October 2026

See the [numeric indicator audit](numeric-indicators-audit.md). The Publications
band now uses canonical variables instead of literal 69/18. Home/header values,
young-researcher editorial text, public catalogue totals and search summaries use
the current validated sources. Management totals remain distinct from public
counts; approved aggregate filings remain distinct from public grants.

### Organigram navigation refinement — 16 October 2026

The hierarchy uses compact unit/person rows, distinct pole surfaces and explicit
kind labels. Each branch has a keyboard-accessible disclosure; expand/collapse-all
controls preserve navigation without modifying records. Name/function search is
accent-insensitive and retains ancestors of matching entries, opening their path
while searching. Counts are computed from the loaded records. Title and pencil
buttons open the existing editor; the three creation actions retain the existing
draft flow. There are no new database writes, hierarchy assumptions or drag-and-drop
reassignments. Long titles wrap on mobile and the existing management table remains
available below the overview.

The module-level “Voir les champs et types” disclosure is placed after the page’s
content/list/pagination, immediately before the footer, on every module page.
It keeps a 20px gap above the panel so it does not touch the preceding content.
The editor’s dedicated Structure & types tab remains available.

In the Actualités list, the highlighted article sorts first before pagination;
remaining articles retain the selected recent/title order. Search, language and
status filters still apply, so an excluded article is not forced into results.

### Media management by resource type — 17 October 2026

The Médiathèque opens on gallery photos and offers five distinct views with live
record counts: Photos, Vidéos, Rapports & stratégies, Liens utiles and Autres
ressources du site. Gallery photos are identified by their curated gallery source
or explicit usage, rather than every image MIME type. Site illustrations and hero
assets remain in the other-resources view; native video records populate Vidéos.
Changing the view resets search/status/page/selection. Each view keeps its own
appropriate list columns and the existing workflow/deletion controls.

The shared JSONB `resourceKind` field persists the selected type for new resources;
legacy records are classified from their existing source, usage and MIME metadata.
Creation/upload inherits the current view; the file picker accepts images, MP4 or
PDF as appropriate. File uploads retain the existing private-first workflow and
10MB limit. Useful-link forms contain title, description and address, with no file
picker or mandatory image/file metadata. Native refresh preserves the workspace’s
resource classification.

The seven existing useful links are imported once as individual media records,
with stable IDs and their exact existing FR/EN/AR copy and publication state.
No new external destinations or translations are invented. Their approved locale
snapshots drive the public library and the same stable search references; draft,
private, unsafe-URL and deleted links are excluded without translation fallback.
Search keeps the existing tool-name/acronym aliases. Future new links follow the
normal draft/review/validation workflow.

Verification: actual local counts 20 gallery photos, 8 videos, 10 reports, 7 links,
159 other resources. Scoped lint/TypeScript/format checks and development browser
checks cover the five views, link form, public links and responsive layout.
Regression tests cover classification, link validation and locale/snapshot gates;
their execution and full CI remain subject to shared-checkout coordination.
The local search rebuild completed successfully; PostgreSQL confirms seven useful
links indexed in each of FR, EN and AR (21 localized references).

List search fields use one shared surface and border around the icon and input;
the native search input has no inner frame. Keyboard focus outlines the whole
control through `:focus-within`, preserving a clear focus indicator.
