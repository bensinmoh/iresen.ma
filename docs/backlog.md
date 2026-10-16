# Siteweb backlog

## Narrative implementation — 2026-10-14

The owner commissioned [the complete narrative alignment](institutional-narrative-2026.md)
on a dedicated review branch. It includes the evidence presentation relevant to
C02 and source/definition notes relevant to B03. Missing measured outcomes, figure
cutoffs and counting rules remain explicit in the evidence register. Other backend,
real-data, photography and integration items below are not silently commissioned.
The owner reserves the merge GO; no automatic merge or production release.

Updated 15 October 2026 from the owner's content, design, features and backend list.
This planning backlog records future work; it does not commission implementation,
publication, provider configuration or deployment. Existing deliveries remain
indexed in [README](../README.md), [PRODUCT](../PRODUCT.md) and individual scope guides.

## Priorities and status

Priorities are proposed sequencing, subject to the owner's selection:

- **P1:** content accuracy, essential visitor actions and the backend foundations they need.
- **P2:** visual consistency and complete editorial management.
- **P3:** optional expressive refinement after content, accessibility and performance checks.

Items remain open unless an explicit completion is recorded below. **Content needed** requires verified material; **Decision needed**
requires a defined workflow or policy; **Planned** is ready for scoping, not a claim
that implementation has started. Existing foundations are identified to avoid
recreating delivered features. Owners, estimates and deadlines remain unassigned.

## Content

| ID  | Priority | Item                                                     | Acceptance criteria                                                                                                                                                                         | Status and dependencies                                                         |
| --- | -------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| C01 | P1       | Update the R&D Roadmap                                   | Apply verified themes, axes and benefits; reconcile homepage themes and search. Preserve the seven-theme/28-axis baseline until a sourced update replaces it.                               | Content needed. [Roadmap](roadmap.md).                                          |
| C02 | P2       | Review homepage success stories and update if necessary  | Review the eight achievements against current evidence; replace outdated material while preserving supported claims and image provenance.                                                   | Content needed. [Achievements](home-achievements.md).                           |
| C03 | P1       | Update Scientific Committee members                      | Confirm names, affiliations, roles, portraits, biographies and professional links; reconcile scientific council terminology. Use Arabic-script names and Latin discovery aliases in Arabic. | Content needed. [Governance](governance.md).                                    |
| C04 | P1       | Update calls and complete a dedicated page for each call | Populate verified calls with the fields below; expose their lifecycle and valid terms/submission destinations. Extend existing pages for missing fields/status needs.                       | Content needed; B09 and D04. [Existing workflow](calls-for-projects.md).        |
| C05 | P1       | Update the projects list                                 | Use verified records with the fields below and their originating calls where applicable; retain the forthcoming-update state until eligible records are commissioned.                       | 60 source records imported locally; EN/AR review pending. [Scope](projects.md). |
| C06 | P1       | Update laboratories list and map                         | Verify the 14 records, affiliations, contacts and ten city groups; synchronize map/list/filters. Geography stays physically consistent in Arabic.                                           | Content needed; B07. [Network](laboratories-experts-network.md).                |
| C07 | P2       | Update Experts Network                                   | Define audience, eligibility, information and visitor journey; use verified, authorized profiles/contact details.                                                                           | Content and workflow needed; B12 determines model needs.                        |
| C08 | P1       | Upload the activity report and correct its link          | Supply the approved public PDF and replace both Institute cover/action `#` targets. Record reporting period, rights, localized metadata and search; verify download/withdrawal.             | Approved PDF needed; B11. [Report boundary](institute-page.md).                 |
| C09 | P1       | Update Values                                            | Apply confirmed values consistently to Institute content, related copy and localized search.                                                                                                | Content needed. [Institute](institute-page.md).                                 |
| C10 | P2       | Update Media Library                                     | Review photos, videos, reports, captions, rights and availability; replace stale assets and withdraw obsolete search results.                                                               | Content needed; D08 and B11. [Media library](media-library.md).                 |

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

| ID  | Priority | Item                                              | Acceptance criteria                                                                                                                                                                       | Status and dependencies                                                                                                                                                                           |
| --- | -------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D01 | P2       | Review design against Figma styles                | Audit typography, colors, surfaces, dividers, arrows and spacing against live evidence; resolve differences using approved identity and actual content.                                   | **Done — owner-confirmed 2026-10-15.**                                                                                                                                                            |
| D02 | P2       | Homogenize equivalent HTML elements               | Inventory repeated headings, links, buttons, cards, fields, figures and notices; align semantics, shared components, states and spacing.                                                  | **Done — owner-confirmed 2026-10-15.**                                                                                                                                                            |
| D03 | P2       | Redesign Governance                               | Improve hierarchy and responsive reading of board/council/team; preserve legacy anchors, confirmed roles, original marks and biography/profile interactions.                              | **Done — owner-approved 2026-10-15; final CI and merge authorized.** [Scope](governance.md#iterative-redesign--2026-10-15).                                                                       |
| D04 | P1       | Design Open Calls                                 | Make current calls, deadlines and detail actions easy to scan, with honest empty states and a distinct archive; preserve terms eligibility and submission deadlines.                      | **Done — calls interface delivered 2026-10-15.** 21 historical editions, filters, detail pages and honest open-call empty state; content review and B09 remain. [Scope](calls-catalogue-2026.md). |
| D05 | P2       | Redesign Platforms                                | Improve chapters, imagery and capability presentation using actual maturity/availability; preserve legacy anchors and GreenH2A in-development wording.                                    | **Done — owner-confirmed 2026-10-15.** [Platforms](research-platforms.md).                                                                                                                        |
| D06 | P2       | Adapt Figma mobile styles                         | Compare references with actual pages; adapt hierarchy, spacing, controls and media to real content. Verify mobile/tablet, long text, 200% text and Arabic RTL.                            | **Done — mobile rules applied 2026-10-15.** 48 scoped browser journeys passed before integration; final current-head CI remains required. [Evidence](mobile-figma-review.md).                     |
| D07 | P3       | Use the apex leaf as a design element             | Explore restrained backgrounds, cropping shapes or bullets using original vector geometry; select useful applications with readable contrast and coherent identity.                       | Planned; D01.                                                                                                                                                                                     |
| D08 | P1       | Review all photos and replace them with real ones | Audit each image role; obtain approved authentic photography, record rights/credits and update provenance/search. Preserve originals and distinguish photos from technical illustrations. | Authentic assets needed; C10/B11.                                                                                                                                                                 |
| F01 | P1       | Make the contact form functional                  | Agree recipients/delivery; add validated server submission, abuse controls and accessible feedback. Success reflects the agreed delivery/receipt condition; test failure/retry.           | Decision needed: provider, recipients, retention and workflow. Currently opens an email draft.                                                                                                    |
| F02 | P1       | Make unsolicited career applications functional   | Agree fields, recipients, receipt, retention and attachment policy; implement private processing and accurate feedback. Applicant data stays out of public APIs, media and search.        | Decision needed: provider/intake workflow. No uploads or online receipt currently delivered.                                                                                                      |
| F03 | P1       | Connect newsletter subscriptions to HubSpot       | Map subscription type, fields and consent; handle invalid, duplicate, failed and successful requests. Verify unsubscribe/preferences and protect server-side credentials.                 | Decision needed: HubSpot access/configuration and subscription policy.                                                                                                                            |
| F04 | P2       | Review links using `target="_blank"`              | Define which external links/documents open a new tab; apply safe `rel` attributes and accessible indications consistently. Preserve appropriate internal navigation/anchors.              | Partly delivered: all identified LinkedIn accesses use safe new-tab links. Remaining external-link/document policy needs a decision.                                                              |

## Backend

The isolated `/cms-preview` journeys are design references, not connected
administration. Extend existing Payload collections and publication/access gates
where useful. Publications and patents have retained structured corpora, which
do not establish complete editorial management interfaces.

| ID  | Priority | Item                                                    | Acceptance criteria                                                                                                                                                                                         | Status and dependencies                                                                          |
| --- | -------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| B00 | P1       | Establish authenticated private administration          | Define roles/private topology; implement authentication/MFA, server permissions, draft/review/publish/withdraw journeys and operating ownership. Keep administration closed on the public release instance. | Decision needed; foundation for connected modules. [Preview boundary](cms-interface-preview.md). |
| B01 | P2       | Dashboard analytics and traffic                         | Agree provider/metrics; show traffic trends, date ranges, sources and freshness; verify collection/consent and distinguish traffic from editorial totals.                                                   | Decision needed: provider and reporting requirements.                                            |
| B02 | P1       | News management with LinkedIn and AI                    | Import permitted LinkedIn content through authorized access, deduplicate and retain provenance. AI proposes categories for review; CRUD, show/hide and highlights remain editorial decisions.               | B00, LinkedIn access and taxonomy; curated news exists.                                          |
| B03 | P2       | Figures management                                      | Inventory every displayed figure. Fixed figures expose editing, source, unit and as-of date; calculated figures show formula, tables, filters and refresh date. Verify all placements.                      | B00 and verified definitions.                                                                    |
| B04 | P2       | Patents management                                      | Provide controlled editing/import, review and withdrawal for the 59 retained records; preserve sourced wording, missing values and public/search lifecycle.                                                 | B00. [Patents](valorisation-patents.md).                                                         |
| B05 | P2       | Publications management                                 | Provide controlled editing/import/review for the 1,199 retained records; preserve bibliographic wording, sourced years, T4 2026, ranking provenance and citation dates. Keep excluded sources out.          | B00. [Publications](publications.md).                                                            |
| B06 | P1       | Projects management                                     | Create verified model and CRUD/review using C05 fields, call relationships, platform/consortium references and public/search withdrawal.                                                                    | Payload model/import/public/search lifecycle delivered locally; B00 and editorial review remain. |
| B07 | P2       | Laboratories management                                 | Manage identities, city/map coordinates, topics, affiliations and authorized contacts; one source drives map, list, filtering and search.                                                                   | B00; reuse verified C06 records.                                                                 |
| B08 | P2       | Career opportunities management                         | Complete management of existing opportunities, including deadlines, open/closed state and locale approval. Withdrawal removes public/search eligibility; applicant intake stays separate.                   | B00; no fictional offers. [Careers](careers.md).                                                 |
| B09 | P1       | Calls for projects management                           | Complete management of existing Calls; add C04 gaps, SDGs, lifecycle controls, terms/submission links and detail/search synchronization.                                                                    | B00 and verified calls.                                                                          |
| B10 | P2       | Events management                                       | Manage dates/time zones, venue/format, status, imagery and registration links; distinguish confirmed facts from pending/preparation entries and curate featured events.                                     | B00. [Events](news-events.md).                                                                   |
| B11 | P1       | Media library management                                | Extend Media upload, localized captions/search text, rights, variants and replacement/withdrawal; separate private/public files and revoke withdrawn bytes/previews/search.                                 | B00, approved storage and assets.                                                                |
| B12 | P2       | Manage remaining website databases                      | Inventory datasets, collections/globals and remaining editorial needs, including roadmap, values, governance, platforms and experts; scope reusable relationships and CRUD without duplicating collections. | Planned inventory; connected management requires B00.                                            |
| B13 | P1       | Glossary, synonyms, vocabulary, dictionary and acronyms | Manage reviewed FR/EN/AR terminology/expansions with history, preview/rebuild and relevance checks. Preserve exact-before-linguistic/typo/related ordering; exclude private/withdrawn vocabulary.           | B00 and terminology review; R04. [Search](search.md).                                            |
| B14 | P2       | GUI log                                                 | Define administrative activity/audit log, UI errors or both; provide selected restricted views, filters, redaction and retention. Editorial audit identifies who changed what and when.                     | Decision needed: log scope; B00.                                                                 |

## AI design video recommendations

| ID  | Priority | Item                                                                           | Acceptance criteria                                                                                                                                                                                                                                                     | Status and dependencies                                             |
| --- | -------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| V01 | P2       | Review the supplied AI website-design video and apply relevant recommendations | Review video/transcript, record useful recommendations with timestamps, map them to D01–D08/performance and implement selected changes with before/after evidence. Existing identity, authentic media, native CSS, dependencies and accessibility remain authoritative. | Planned review; implementation follows selection of affected items. |

Source: [owner-supplied AI website-design video](https://www.youtube.com/watch?v=pHstb0JGGhE).
The video is a reference to review, not a validated recommendation list. No
video-specific recommendation is marked adopted in this planning update.

## Delivery sequence

1. Gather verified content, authentic photographs, the approved report and workflow decisions.
2. Audit shared Figma/HTML/mobile consistency and scope private administration.
3. Deliver priority content and calls/projects/media workflows; integrate contact, careers and HubSpot when decisions/access are supplied.
4. Complete remaining editorial modules, redesigns, glossary and analytics.
5. Apply useful apex-leaf/video refinements and complete final content/search/release checks.

Independent content/design preparation can proceed before integrations.

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
records operating responsibilities.

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
authorization. Backlog statuses reflect the coordinated implementation batch; final current-head CI must pass before merge.
