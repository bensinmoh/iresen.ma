# IRESEN product and content truth

Current baseline: 2026-10-12. This describes the implemented site and outstanding
boundaries. Dated scope guides/changelog retain evidence; Git history retains
superseded decisions. Latest owner instructions prevail over reference documents.

## Purpose, audience and narrative

The institutional website explains IRESEN's contribution, research priorities,
experimental capabilities and ways to collaborate, and makes institutional resources
findable. Audiences include research teams, universities, businesses, public actors,
partners and prospective colleagues. French, English and Arabic are complete working
interfaces; final institutional/editorial and translation approval remains separate.

The October 2026 PDF makes **Research & Innovation the core activity**, with
**Develop, Test and Valorise** as three missions. **Studies & Expertise**, **Skills
& Capacities** and **Cooperation & Outreach** are complementary dimensions, also
able to address direct needs. Shared capabilities combine according to the need;
there is no compulsory sequence. The French mission is exact source wording;
EN/AR remain working adaptations. See [scope and evidence](docs/institutional-narrative-2026.md).
Funding and infrastructure are instruments; filings and project counts do not
establish adoption or measured impact. Preserve facts, dates and missing values.

The owner commissions this alignment on `feat/institutional-narrative-2026` and
requires a review URL and an explicit GO before merge. Automatic merge is paused
for this branch. Final source verification/editorial approval stays separate.

## Implemented public journeys

The only routing authority is `src/lib/site.ts`: 24 stable IDs, localized paths,
supported anchors and shared helpers. Six footer utilities include Useful links.
News/event aliases, news listing and published call/news details reuse this map.
Existing anchors remain compatible; route changes follow ADR0004 and update all
locale paths, links, metadata, sitemap/search and documentation together.

- **Homepage:** missions, achievements, research, compact innovation transition,
  platforms/capabilities, collaboration and news; hero figures remain. Six main
  section-navigation entries, original supplied assets and scoped working copy.
- **Institute:** integrated R&I core, complementary dimensions, ecosystem, shared
  capabilities, values, three 2035 orientations and eight
  2011–2026 milestones. Arabic timeline reads right-to-left; arrows advance exactly
  one milestone with fixed eight-item count. The supplied activity-report cover
  and Consult action retain `#` until the approved public PDF is supplied.
- **Governance:** owner-supplied board/council/organisation and portraits; biography
  dialogs, sourced professional profile links and Arabic personal-name transcriptions.
  Do not invent a public profile or career for unmatched people.
- **Priorities:** seven themes/28 complete axes and benefits, native disclosures and
  illustrative technical artwork. Withdrawn common paragraph/navigation stay absent.
- **Programmes:** approach, outcomes, lifecycle, sourced historical schemes and
  eligible CMS calls/details. Balanced responsive approach and centered lifecycle
  copy outside the steps. Keep the sourced 69-project agency figure independent
  from the withdrawn fictional catalogue.
- **Collaborative projects:** restored source-backed catalogue with 60 local Payload
  records, native filters/pagination/detail dialogs and original source references.
  EN/AR working translations are locally reviewable and remain outside public
  publication/search until locale approval. Missing facts stay empty; scientific
  production counters are excluded. The former 24 fictional records, 72 PDFs and
  fabricated partner marks remain withdrawn; old note downloads return 404.
- **Platforms:** five supplied platform destinations/photos/logos, actual maturity,
  capabilities and contacts. GreenH2A retains in-development/3D wording.
- **Laboratory network:** 14 supplied records, local topic/query filtering and
  approximate interactive Morocco map. GEP city stays unspecified; only the
  supplied Settat scientific contact is named. No invented Alumni/people/testimonials.
- **Collaboration and valorisation:** commissioned audience/transfer journeys, legacy
  anchors and honest contact boundaries. Patent catalogue retains 59 filings;
  summaries and EN/AR copy remain working editorial texts, without adoption claims.
- **News/events:** sourced selected news, combined page and child listing, social links
  and three featured events. COP31 is owner-confirmed; side events/pending slots keep
  preparation wording and no fabricated dates or signup links. No live LinkedIn sync.
- **Publications/reports:** 1,199 retained publications, T4 2026, six frequent themes,
  immediate cross-counted facets, original titles/authors/years and DOI links.
  SJR2025, provisional/editorial flags and dated citations remain distinct. Excluded
  workbooks/184 records/four 2027 withdrawals stay excluded. Reports reuse approved media.
- **Media/careers/contact:** approved galleries/video/report journeys; careers lists only
  published/open/locale-approved complete offers and otherwise stays visibly empty.
  No career fixtures. Contact/application actions compose local emails, with no online
  intake, applicant uploads, stored form data, receipt or delivery guarantee.
- **Utilities:** current legal/privacy/cookie/accessibility notices, human-readable
  sitemap and four owner-selected external mapping tools. No tool embed/tracker;
  each stable tool anchor has localized public discovery.

Detailed current boundaries and provenance are linked from README and
[the route map](docs/route-map.md). Documents/screenshots supply recommendations
and visual references, not independent approvals or requests for new features.

## Publication, privacy and security

Public CMS reads enforce access, publication state and approved complete locale,
with translation fallback disabled. Search rechecks current public eligibility;
exact matches lead linguistic/typo/related results, and corrections stay explicit.
Public additions require stable localized references. Private files, drafts,
editorial notes and unapproved translations never become searchable by registration.
AI illustrative images retain provenance/exclusion rules. Final multilingual
terminology/glossary/search sanity review remains open until content is final.

Google Maps is the only optional embedded service and requires prior external-service
consent; refusal/withdrawal removes it. Consent lasts 180 days and supports preferences,
keyboard, RTL and no-JS reading. Provider-added cookies/services require IT/legal review.
The newsletter does not register subscribers; CMS email delivery is unconfigured.

Public production administration is closed by default. `PUBLIC_RELEASE=true` forbids
admin/local-review opt-ins. `/cms-preview` is a separate isolated browser-only design
review with synthetic state, no Payload/database/integrations or careers examples.
Private authenticated administration/MFA/SSO is a later phase.

Per-request script nonce CSP, public-only API/file projections and a shared 60/minute
search quota are implemented. The quota stores HMAC keys/counts/expiry, without raw
addresses or typed queries; proxy trust requires a protected origin/overwrite contract.
The notices describe this technical counter. Security, privacy or compliance are
not guaranteed by these engineering controls or local tests.

## Delivery and remaining decisions

Portable Node standalone and non-root Linux runtime/operations images are prepared.
Hosting/domain providers and Cloudflare remain externally managed. Deployment, DNS,
visibility and indexing changes need explicit release authorization; none is delivered.
IT must confirm capacity/regions/storage, secrets, private identity, edge rules,
worker ownership, redacted monitoring, backup/restore and incident response.

Final editorial/translation/legal review, the real report PDF, current project-status/partner verification,
Alliances, PhaseIII drafting and separately commissioned integrations remain open.
Do not silently activate online intake, newsletter, analytics, OAuth or new CMS models.
See [IT handover](docs/it-handover.fr.md), [deployment](docs/deployment.md),
[current preparation](docs/public-release-preparation.md) and [backlog](docs/backlog.md).

Useful links consolidation (2026-10-15): the owner selects the Media library’s
`press-resources` section as the sole useful-tools catalogue. It reuses the four
former dedicated-page resources and adds the exact EVPLAN, PV Mapping and SolarTwin
URLs supplied by the owner. `usefulLinks` is a permanent compatibility route alias;
its footer shortcut points to the media section. See `docs/useful-links.md`.

## Calls archive increment — 2026-10-15

The owner commissions 21 closed historical programme/edition entries, the
Programmes devices preview, a child catalogue and sourced preparatory detail
pages. Working content awaits final copy/translation review. Native filters and
future status states are supported; no applications, alerts, results or downloads
are invented. See [scope](docs/calls-catalogue-2026.md).

Project editorial follow-ups (2026-10-15): homogeneous AI-assisted descriptions, shorter card previews, compact scientific-objective bullets and guarded local PDF actions. The source notice is withdrawn from UI/search. Current PDF files remain unchanged pending the updated list; withdrawn fictional PDFs remain absent.

Institute editorial update — 2026-10-16: the owner-selected Éditorial variant
replaces repeated mission chapters with one R&I core, three complementary native
disclosures and three activity tabs. Exact mission, canonical anchors and existing
hero/values/ambition/history/report survive. New FR/EN/AR interface copy retains
editorial review status. [Scope and verification](docs/institute-editorial.md).
