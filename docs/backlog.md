# Siteweb backlog

Updated **17 October 2026**, after [PR #123](https://github.com/bensinmoh/iresen.ma/pull/123)
was merged. Its exact head passed [full CI](https://github.com/bensinmoh/iresen.ma/actions/runs/38986662518):
273 unit tests, 32 integration tests, 354 public browser journeys and 12 opt-in CMS
journeys. Local checks and their limits are recorded in the
[finalization ledger](verification-2026-10-17-finalization.md). The checkout was
synchronized and the completed task branch removed. No deployment took place.

This backlog distinguishes delivered foundations from remaining implementation,
verified content and external-service decisions. It does not commission new work,
publication, provider configuration or deployment. Existing deliveries remain
indexed in [README](../README.md), [PRODUCT](../PRODUCT.md) and individual scope guides.
The [14 October narrative commission](institutional-narrative-2026.md) retains its
own branch-specific review conditions; it is not an outstanding merge gate for
already merged PR #123. Missing measured outcomes and figure cutoffs still need
verified evidence.

## Delivered in the latest batch

- Authenticated PostgreSQL administration at `/admin`, with administrator/editor
  permissions, locale workflows, revisions, private uploads and account portraits.
- List/editor actions, delete-impact confirmation, recoverable trash, one news
  highlight displayed first, organigram GUI and the requested interface refinements.
- Media management split into photos, videos, reports/strategies, useful links and
  other resources; existing useful links share approved public/search projections.
- Private recruitment management, including manual intake, CVs, stages, evaluations
  and interviews. Public online applications and notifications remain separate work.
- Source-backed project catalogue with 70 eligible public projects (71 management
  records), current-data PDFs on demand and an audit linking displayed indicators
  to their variables. Collaborators and the ISO version are editable indicators.
- Dedicated Resources patent page, using the existing shared catalogue.

## Priorities and status

Priorities are proposed sequencing, subject to the owner's selection:

- **P1:** content accuracy, essential visitor actions and the backend foundations they need.
- **P2:** visual consistency and complete editorial management.
- **P3:** optional expressive refinement after content, accessibility and performance checks.

Items remain open unless an explicit completion is recorded below. **Delivered** closes the stated implementation; **Partly delivered** identifies the remaining scope. **Content needed** requires verified material; **Decision needed**
requires a defined workflow or policy; **Planned** is ready for scoping, not a claim
that implementation has started. Existing foundations are identified to avoid
recreating delivered features. Owners, estimates and deadlines remain unassigned.

## Content

| ID  | Priority | Item                                                     | Acceptance criteria                                                                                                                                                                         | Status and dependencies                                                                                                                                                                            |
| --- | -------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C01 | P1       | Update the R&D Roadmap                                   | Apply verified themes, axes and benefits; reconcile homepage themes and search. Preserve the seven-theme/28-axis baseline until a sourced update replaces it.                               | Content needed. [Roadmap](roadmap.md).                                                                                                                                                             |
| C02 | P2       | Review homepage success stories and update if necessary  | Review the eight achievements against current evidence; replace outdated material while preserving supported claims and image provenance.                                                   | Content needed. [Achievements](home-achievements.md).                                                                                                                                              |
| C03 | P1       | Update Scientific Committee members                      | Confirm names, affiliations, roles, portraits, biographies and professional links; reconcile scientific council terminology. Use Arabic-script names and Latin discovery aliases in Arabic. | Content needed. [Governance](governance.md).                                                                                                                                                       |
| C04 | P1       | Update calls and complete a dedicated page for each call | Populate verified calls with the fields below; expose their lifecycle and valid terms/submission destinations. Extend existing pages for missing fields/status needs.                       | Content needed; B09 and D04. [Existing workflow](calls-for-projects.md).                                                                                                                           |
| C05 | P1       | Update the projects list                                 | Use verified records with the fields below and their originating calls where applicable; preserve publication gates and leave unsupported fields empty.                                     | **Partly delivered:** 70 eligible public projects, common-database management and current-data PDFs. Missing source fields and substantive FR/EN/AR editorial review remain. [Scope](projects.md). |
| C06 | P1       | Update laboratories list and map                         | Verify the 14 records, affiliations, contacts and ten city groups; synchronize map/list/filters. Geography stays physically consistent in Arabic.                                           | Content needed; B07. [Network](laboratories-experts-network.md).                                                                                                                                   |
| C07 | P2       | Update Experts Network                                   | Define audience, eligibility, information and visitor journey; use verified, authorized profiles/contact details.                                                                           | **Preparation delivered:** contracts analysed; no expert import or public directory. Populated, authorized profiles and implementation remain; B12. [Analysis](experts-network.md).                |
| C08 | P1       | Upload the activity report and correct its link          | Supply the approved public PDF and replace both Institute cover/action `#` targets. Record reporting period, rights, localized metadata and search; verify download/withdrawal.             | Approved PDF needed; B11. [Report boundary](institute-page.md).                                                                                                                                    |
| C09 | P1       | Update Values                                            | Apply confirmed values consistently to Institute content, related copy and localized search.                                                                                                | Content needed. [Institute](institute-page.md).                                                                                                                                                    |
| C10 | P2       | Update Media Library                                     | Review photos, videos, reports, captions, rights and availability; replace stale assets and withdraw obsolete search results.                                                               | Management views delivered; asset/content/rights review remains, including D08. [Media library](media-library.md).                                                                                 |

### Required information for each call

- Title, acronym and description.
- Launch year and timeline: call opening, submission deadline, evaluation and announcement of selected projects.
- Budget, currency and target audience/eligibility.
- Topics covered and relevant Sustainable Development Goals (SDGs).
- Funding partners.
- Terms of reference and submission form or link.
- Status, including in preparation, ongoing/open and closed, with cancellation/archive rules agreed explicitly.

The [Calls collection](calls-for-projects.md) already supports most fields and a
localized detail route under Programmes. Check schema/rendering gaps, particularly
SDGs and preparation status. Distinguish lifecycle from publication/translation
approval; preparation is not automatically public and closure is not withdrawal.
Use a stable reference across locales and Africa/Casablanca dates/times.

### Required information for each project

- Title, acronym and description.
- Launch year, implementation period and progress status.
- Total budget and IRESEN funding, with currency and measurement basis.
- Host platform, where applicable.
- Coordinator: name, affiliation and email, with authorization for public contact details.
- Consortium members and their approved original logos.
- Topics aligned with the R&D Roadmap where appropriate, and relevant SDGs.
- Project objectives.

Record the originating call where supported by evidence and preserve the
[one-call-to-many-projects relationship](calls-for-projects.md#relationship-with-selected-rdi-projects).
Never restore withdrawn fictional records, PDF notes or sample contacts. Missing
values remain explicit rather than inferred.

## Features and design

| ID  | Priority | Item                                              | Acceptance criteria                                                                                                                                                                       | Status and dependencies                                                                                                                                                                                |
| --- | -------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D01 | P2       | Review design against Figma styles                | Audit typography, colors, surfaces, dividers, arrows and spacing against live evidence; resolve differences using approved identity and actual content.                                   | **Done — owner-confirmed 2026-10-15.**                                                                                                                                                                 |
| D02 | P2       | Homogenize equivalent HTML elements               | Inventory repeated headings, links, buttons, cards, fields, figures and notices; align semantics, shared components, states and spacing.                                                  | **Done — owner-confirmed 2026-10-15.**                                                                                                                                                                 |
| D03 | P2       | Redesign Governance                               | Improve hierarchy and responsive reading of board/council/team; preserve legacy anchors, confirmed roles, original marks and biography/profile interactions.                              | **Done — owner-approved 2026-10-15; integrated delivery validated.** [Scope](governance.md#iterative-redesign--2026-10-15).                                                                            |
| D04 | P1       | Design Open Calls                                 | Make current calls, deadlines and detail actions easy to scan, with honest empty states and a distinct archive; preserve terms eligibility and submission deadlines.                      | **Done — calls interface delivered 2026-10-15.** 21 historical editions, filters, detail pages and honest open-call empty state; content review and B09 remain. [Scope](calls-catalogue-2026.md).      |
| D05 | P2       | Redesign Platforms                                | Improve chapters, imagery and capability presentation using actual maturity/availability; preserve legacy anchors and GreenH2A in-development wording.                                    | **Done — owner-confirmed 2026-10-15.** [Platforms](research-platforms.md).                                                                                                                             |
| D06 | P2       | Adapt Figma mobile styles                         | Compare references with actual pages; adapt hierarchy, spacing, controls and media to real content. Verify mobile/tablet, long text, 200% text and Arabic RTL.                            | **Done — mobile rules applied 2026-10-15.** 48 scoped browser journeys passed before integration; the latest batch passed full CI before merge (see ledger above). [Evidence](mobile-figma-review.md). |
| D07 | P3       | Use the apex leaf as a design element             | Explore restrained backgrounds, cropping shapes or bullets using original vector geometry; select useful applications with readable contrast and coherent identity.                       | Admin lime SVG favicon delivered. Broader public decorative use remains planned; D01.                                                                                                                  |
| D08 | P1       | Review all photos and replace them with real ones | Audit each image role; obtain approved authentic photography, record rights/credits and update provenance/search. Preserve originals and distinguish photos from technical illustrations. | Authentic assets needed; C10/B11.                                                                                                                                                                      |
| F01 | P1       | Make the contact form functional                  | Agree recipients/delivery; add validated server submission, abuse controls and accessible feedback. Success reflects the agreed delivery/receipt condition; test failure/retry.           | Decision needed: provider, recipients, retention and workflow. Currently opens an email draft.                                                                                                         |
| F02 | P1       | Make unsolicited career applications functional   | Agree fields, recipients, receipt, retention and attachment policy; implement private processing and accurate feedback. Applicant data stays out of public APIs, media and search.        | **Partly delivered:** private manual intake and CV uploads in CMS. Public submission, receipt/notifications, provider and retention policy remain.                                                     |
| F03 | P1       | Connect newsletter subscriptions to HubSpot       | Map subscription type, fields and consent; handle invalid, duplicate, failed and successful requests. Verify unsubscribe/preferences and protect server-side credentials.                 | Decision needed: HubSpot access/configuration and subscription policy.                                                                                                                                 |
| F04 | P2       | Review links using `target="_blank"`              | Define which external links/documents open a new tab; apply safe `rel` attributes and accessible indications consistently. Preserve appropriate internal navigation/anchors.              | Partly delivered: LinkedIn, CMS source and DOI links use explicit safe links. Remaining external-link/document policy needs a decision.                                                                |

## Backend

The [authenticated CMS](cms-interface-preview.md) now uses PostgreSQL at `/admin`;
`/cms-preview` redirects there. Administrator/editor are the two roles. Native
adapters and common authoring records retain separate validated locale snapshots.
A saved CMS record does not imply that every public static template already reads
it. The remaining boundaries below must be checked per module; importing and bulk
maintenance are separate from delivered single-record editing.

| ID  | Priority | Item                                                    | Acceptance criteria                                                                                                                                                                                         | Status and dependencies                                                                                                                                                                                                                                                                                                                        |
| --- | -------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B00 | P1       | Establish authenticated private administration          | Define roles/private topology; implement authentication/MFA, server permissions, draft/review/publish/withdraw journeys and operating ownership. Keep administration closed on the public release instance. | **Partly delivered:** authentication, two-role permissions, revisions, locale workflow and recoverable deletion. Institutional identity/MFA, recovery and production operating configuration remain; R01–R03.                                                                                                                                  |
| B01 | P2       | Dashboard analytics and traffic                         | Agree provider/metrics; show traffic trends, date ranges, sources and freshness; verify collection/consent and distinguish traffic from editorial totals.                                                   | Google Analytics selected; preparation UI delivered, service unconnected. Property/access, consent, reporting metrics and live dashboard connection remain.                                                                                                                                                                                    |
| B02 | P1       | News management and LinkedIn                            | Manage curated news, review/withdrawal and one highlight; synchronize permitted LinkedIn content through authorized access with deduplication/provenance. AI classification is withdrawn.                   | **Partly delivered:** CRUD, review, withdrawal and unique highlight, displayed first. Authorized LinkedIn synchronization remains unconnected. AI classification was removed at owner request; no AI integration is pending under this item.                                                                                                   |
| B03 | P2       | Figures management                                      | Inventory every displayed figure. Fixed figures expose editing, source, unit and as-of date; calculated figures show formula, tables, filters and refresh date. Verify all placements.                      | **Delivered:** editable editorial figures and shared calculated projections audited. Future measurements/cutoffs require verified sources. [Audit](numeric-indicators-audit.md).                                                                                                                                                               |
| B04 | P2       | Patents management                                      | Provide controlled editing/import, review and withdrawal for the 59 retained records; preserve sourced wording, missing values and public/search lifecycle.                                                 | Single-record CMS workflow and public snapshot/withdrawal projections delivered for the retained portfolio. Controlled bulk import/update remains to scope; preserve private filings. [Patents](valorisation-patents.md).                                                                                                                      |
| B05 | P2       | Publications management                                 | Provide controlled editing/import/review for the 1,199 retained records; preserve bibliographic wording, sourced years, T4 2026, ranking provenance and citation dates. Keep excluded sources out.          | Single-record CMS workflow and public snapshot/withdrawal projections delivered for 1,199 records. Reusable controlled bulk import/update remains to scope. [Publications](publications.md).                                                                                                                                                   |
| B06 | P1       | Projects management                                     | Create verified model and CRUD/review using C05 fields, call relationships, platform/consortium references and public/search withdrawal.                                                                    | **Partly delivered:** model, source import, CRUD/review, public/search lifecycle and current-data PDFs. C05 missing verified fields/relations and final editorial review remain.                                                                                                                                                               |
| B07 | P2       | Laboratories management                                 | Manage identities, city/map coordinates, topics, affiliations and authorized contacts; one source drives map, list, filtering and search.                                                                   | **Delivered foundation:** common-database management and public withdrawal coherence. Source accuracy, contacts and geography review remain under C06.                                                                                                                                                                                         |
| B08 | P2       | Career opportunities management                         | Complete management of existing opportunities, including deadlines, open/closed state and locale approval. Withdrawal removes public/search eligibility; applicant intake stays separate.                   | **Delivered:** offer workflow and private recruitment management. No fictional offers. Public applicant intake/notifications remain F02. [Careers](careers.md).                                                                                                                                                                                |
| B09 | P1       | Calls for projects management                           | Complete management of existing Calls; add C04 gaps, SDGs, lifecycle controls, terms/submission links and detail/search synchronization.                                                                    | **Partly delivered:** native/common-database management and 21-edition public catalogue. Verify C04 field/status gaps and provide missing source content.                                                                                                                                                                                      |
| B10 | P2       | Events management                                       | Manage dates/time zones, venue/format, status, imagery and registration links; distinguish confirmed facts from pending/preparation entries and curate featured events.                                     | **Delivered foundation:** management and locale/public/search workflow. Confirm actual dates, registrations and pending event content; no invented programme.                                                                                                                                                                                  |
| B11 | P1       | Media library management                                | Extend Media upload, localized captions/search text, rights, variants and replacement/withdrawal; separate private/public files and revoke withdrawn bytes/previews/search.                                 | **Partly delivered:** five management views, private-first upload/replace, protected access and deletion workflow. Approved assets/rights remain C10/D08; production storage/backup policy remains R01/R02.                                                                                                                                    |
| B12 | P2       | Manage remaining website databases                      | Inventory datasets, collections/globals and remaining editorial needs, including roadmap, values, governance, platforms and experts; scope reusable relationships and CRUD without duplicating collections. | Common authoring records/editors and a limited CSV rehearsal delivered; server-side business imports/XLSX remain to connect. Public projections are incomplete for static page/organisation content. Inventory and connect each approved template. Expert-network analysis only: no expert data/import/directory. Preserve the two-role model. |
| B13 | P1       | Glossary, synonyms, vocabulary, dictionary and acronyms | Manage reviewed FR/EN/AR terminology/expansions with history, preview/rebuild and relevance checks. Preserve exact-before-linguistic/typo/related ordering; exclude private/withdrawn vocabulary.           | Terminology editing foundation exists; public search vocabulary/glossary integration, rebuild workflow and linguistic review remain. R04; Arabic recall issue below. [Search](search.md).                                                                                                                                                      |
| B14 | P2       | GUI log                                                 | Define administrative activity/audit log, UI errors or both; provide selected restricted views, filters, redaction and retention. Editorial audit identifies who changed what and when.                     | Server audit history and its searchable 200-entry GUI are delivered. Technical supervision is unconnected; retention/redaction policy, monitoring and safe job retry remain.                                                                                                                                                                   |

## AI design video recommendations

| ID  | Priority | Item                                                                           | Acceptance criteria                                                                                                                                                                                                                                                     | Status and dependencies                                             |
| --- | -------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| V01 | P2       | Review the supplied AI website-design video and apply relevant recommendations | Review video/transcript, record useful recommendations with timestamps, map them to D01–D08/performance and implement selected changes with before/after evidence. Existing identity, authentic media, native CSS, dependencies and accessibility remain authoritative. | Planned review; implementation follows selection of affected items. |

Source: [owner-supplied AI website-design video](https://www.youtube.com/watch?v=pHstb0JGGhE).
The video is a reference to review, not a validated recommendation list. No
video-specific recommendation is marked adopted in this planning update.

## Delivery sequence

1. Gather missing verified content, authentic photographs and the approved activity report (C01–C10, D08).
2. Finish approved public projections for static CMS modules, expert-network implementation and controlled imports; complete terminology/search integration (B04–B06, B09, B12–B14).
3. Supply service access and policies, then connect contact delivery, public applications, HubSpot, LinkedIn and Google Analytics (F01–F03, B01/B02).
4. Complete identity/MFA, operational/legal configuration, final content/search review and staging performance checks (B00, R01–R05).
5. Obtain explicit release authorization (R06). Optional apex-leaf/video refinements remain D07/V01.

Content preparation can proceed independently of service integrations. Already
merged design/CMS work does not need to be commissioned or tested again merely
because its earlier backlog status was stale.

## Newly observed verification blocker — 17 October 2026

The documentation-only backlog PR #124 encountered a failure in
[CI run 378](https://github.com/bensinmoh/iresen.ma/actions/runs/39019313018).
Formatting, lint, types, 273 unit tests, 32 integration tests and build pass;
353 public browser journeys pass, but the hero idle-scroll invitation timing test
fails at `tests/e2e/heroes.spec.ts:389`, including its retry. The cue is already
revealed after advancing the test clock by 4,900 ms. The isolated CMS step is
skipped after that failure. This does not invalidate the recorded successful
PR #123 run, nor establish whether the new failure is test-clock synchronization
or application behavior. Investigate and verify the timer deterministically,
then obtain successful current-head CI before merging PR #124. Do not weaken or
skip the check. No runtime fix is included in this backlog reconciliation.

## Before production

Retained release tasks remain open alongside the new backlog:

| ID  | Item                                      | Completion condition                                                                                                                                                                                                               |
| --- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R01 | Confirm hosting/providers                 | Confirm Node/container/PostgreSQL support, provider regions, private persistent storage and operating responsibilities.                                                                                                            |
| R02 | Complete operational configuration        | Verify worker ownership, HTTPS origin/Cloudflare cache, WAF/limits, trusted IP forwarding, backups, restoration and redacted monitoring.                                                                                           |
| R03 | Complete legal/editorial review           | Confirm controller/hosting/publication contacts, privacy/terms, provider cookies, retention and applicable CNDP/transfer requirements; approve final content and FR/EN/AR translations.                                            |
| R04 | Complete multilingual search sanity check | Reconstruct glossary, terminology, acronyms and related terms from final content; rebuild public index/spelling vocabulary and verify representative FR/EN/AR queries.                                                             |
| R05 | Verify release-candidate performance      | Measure representative pages and changed media/interactions in staging; address remaining LCP issues with comparable before/after measurements. [Measurement limits](public-release-preparation.md#performance-method-and-limits). |
| R06 | Approve actual release                    | Confirm checked artifact, staging acceptance and explicit production/DNS/indexing authorization.                                                                                                                                   |

Alliances and remaining institutional/editorial material remain deferred, pending
verified sources and an individual commission. [IT handover](it-handover.fr.md)
records operating responsibilities; refresh its historical baseline against the current stack, CMS and final verification ledger before operational handover (R02).

## Structure proposal decisions before pageCMS changes

Retain the 23 stable IDs in `src/lib/site.ts`, localized paths, legacy anchors and
existing call/news detail families. [Strategy proposals](references/strategy/README.md)
require selection before implementation; this backlog does not adopt alternative
routes/sections. Follow the [route-change ADR](adr/0004-canonical-working-site-structure.md)
if a selected item changes structure.

## Definition of done for implementation items

- Verify institutional facts, rights and locale approval; preserve originals and exclude private sources, applicant data and editorial notes.
- Register changed public pages, sections, documents and media through the [search workflow](search.md#adding-public-content), with stable destinations and useful FR/EN/AR metadata; verify discovery/withdrawal.
- Check responsive layouts, Arabic RTL, keyboard/focus, contrast, enlarged text, reduced motion and honest empty/loading/error/success states as applicable.
- Verify authorization, publication gates and input validation for backend/integrations; record provider prerequisites and failure behavior.
- Run appropriate [checks](verification-workflow.md), update documentation and merge only after current-head CI and review requirements pass.

Publication, deployment, DNS, visibility and provider changes retain separate
authorization. PR #123 is merged with successful current-head CI; future changes require their own relevant checks and current-head CI before merge.

## Owner-commissioned increment — 2026-10-16

The dedicated Resources patent page is delivered and included in the validated,
merged batch, using the shared Transfer catalogue. No separate data source or CMS
workflow is commissioned. See [scope](valorisation-patents.md).

Search follow-up — 2026-10-16: investigate Arabic hamza normalization consistency
between generated search vectors and normalized queries. After ministry-name
updates, “الأداء العمومي” does not find the governance documents although both
raw/normalized body contain the new phrase; “العمومي” and “الطاقة والمعادن” find
them. Keep publication/locale gates intact and add a focused regression when
fixing the tokenizer. This observation does not authorize unrelated corpus edits.
