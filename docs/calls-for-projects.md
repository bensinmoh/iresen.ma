# Calls for projects — CMS and detail pages, 2026-10-11

The owner expands the Programmes R&D&I commission to a CMS database and a complete
public page for each call. This supersedes the earlier collection deferral in
[the programmes scope](programmes-rdi.md). No actual current call records were
supplied or seeded. The real database starts empty; temporary tests run separately.

## Editorial model

The **Appels à projets** (`calls`) collection has draft versions and the existing
staff/editor/publisher permissions. Publication requires complete current-language
information; public queries enforce `overrideAccess: false`, `draft: false` and
`fallbackLocale: false`. FR/EN/AR approval is separate. The interface adaptations
remain working editorial copy.

| Owner's requested information | CMS fields                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Title                         | Localized `title`                                                                                                   |
| Acronym                       | `acronym`                                                                                                           |
| Description                   | Localized `description`                                                                                             |
| Launch year                   | Integer `launchYear`                                                                                                |
| Submission deadline           | `deadlineAt`, date and time                                                                                         |
| Calendar                      | `openingAt`, `deadlineAt`, `evaluationStartsAt`, optional `evaluationEndsAt`, `resultsAt`; localized `calendarNote` |
| Budget envelope               | Numeric `budgetAmount`, `budgetCurrency` (MAD/EUR/USD), localized `budgetNote`                                      |
| Recipients / eligibility      | Localized `recipients`, one item per line                                                                           |
| Call themes                   | Localized `themes`, one item per line                                                                               |
| Funding partners              | Localized `fundingPartners`, one item per line                                                                      |
| Terms of reference download   | Localized `conditionsDocument`, relationship to an approved CMS PDF                                                 |
| Submission form               | Localized HTTPS `submissionUrl`                                                                                     |

The unique lowercase `reference` is the stable URL segment and cannot change after
creation. `cancelled` disables submission. Internal notes/editorial ownership use
the existing private fields and never enter public markup or search projections.

Dates store instants with a time zone. Public calendars display date and time in
**Africa/Casablanca**. The schedule must follow opening → deadline → evaluation →
results; the optional evaluation end must also fit this order. The deadline is
shared by the prominent figure and the submission milestone, preventing divergent
closing dates. An empty or incomplete record can be saved as a draft.

## Publishing and actions

1. Create a draft and supply the stable reference and call metadata.
2. Upload the actual terms PDF through Media, record rights/title/description and
   approve/publish it in each intended language.
3. Select the PDF and supply the actual HTTPS form URL for each call translation.
4. A publisher approves the translation and publishes the public revision.

Public publication rejects incomplete fields, unsafe form URLs, inconsistent
dates and missing/unapproved/non-PDF terms. The owner has not supplied records,
terms files or form destinations; none are invented. The terms and the call can
always be withdrawn through the normal workflow.

The programme overview reads published calls. Upcoming/open calls appear in the
current area; closed/cancelled calls appear under archives alongside the three
source-derived historical examples. Every card leads to its full detail page.
The source empty state appears when no upcoming/open record is eligible.

Each detail includes description, launch year, budget, exact deadline, the four
calendar stages, eligibility, themes, finance partners and both requested actions.
At request time, submission is shown only during `[openingAt, deadlineAt)` and
when the terms remain public. The destination form retains its own submission
validation and deadline enforcement. It links to the supplied external form; no local application portal,
uploads, online receipt or automatic project selection is introduced. Closed
calls keep their conditions download. Removing/withdrawing the PDF immediately
hides its download and blocks its guarded bytes; the call metadata can remain
available, with a truthful unavailable notice.

## Destinations, search and operations

### Relationship with selected R&D&I projects

The owner's clarification establishes a one-to-many relationship: a call selects
several R&D&I projects; each selected project records its originating call.
The 69-project figure represents those selected R&D&I projects, rather than a
second project category. It remains a supplied institutional total, not a count
of a public catalogue or the withdrawn demonstration database.

The fictional project catalogue and its model were withdrawn on 2026-10-12.
No verified project CMS collection exists yet. A future verified import should
reserve the originating stable `Calls.reference`, map it to a `calls` relationship
and derive the reverse selected-project list. Never infer attribution from a
programme name or duplicate a separately maintained list on the call.

`callHref` builds `/{locale}/{localized-programmes-path}/{reference}` from the
existing canonical programme ID. `callReferenceFromPath` registers this detail
family in the proxy and catch-all renderer; it accepts canonical/localized bases
and only one valid reference segment. The 22 main page IDs stay unchanged.
The header marks Programmes current and language links retain the same reference.
Unpublished/private/missing-locale/nonexistent calls return a localized 404.
Published calls enter the sitemap only when the existing indexing setting permits it.

The detail's stable anchors are `call-description`, `call-calendar`,
`call-eligibility` and `call-funders`. Its complete public metadata is projected
as one CMS **page** search result (`calls:{id}:{locale}`), with title, acronym,
description, dates, budget, eligibility, thematic and funding text. The existing
terms PDF has its own guarded Media document result and extraction workflow.
General programme metadata describes call discovery without an unconditional
no-open-call claim; CMS records provide the actual eligible information.

Migration `20261011_213811_calls` adds the collection/version/localized tables,
media relationships, source view and durable insert/update/delete search triggers.
Source fingerprints revoke stale results/vocabulary before queued processing.
Closed/cancelled calls retain archive discovery; withdrawal/deletion excludes
their current source. Rebuild includes Calls alongside existing CMS collections.
Apply with `pnpm cms:migrate`, then run `pnpm search:rebuild` as appropriate.

The generated schema snapshot and types are checked in; import-map generation
requires no new admin widgets. Integration suites run sequentially because they
share one durable indexing queue. Temporary call/PDF fixtures are limited to
disposable integration/browser databases, cleaned afterward, and never seed
the owner's database. No deployment or publication-gate override is authorized.

See [verification](validation.md#cms-calls-and-detail-pages--2026-10-11).
