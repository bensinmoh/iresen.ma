# Collaborative projects

## Latest image refresh — 16 October 2026

All 70 project images are now replaced following the owner's corrected request:
64 new compositions from scratch and six recreations based on their original
images (TahalaGrid, HYBRID-BATH, Frigo Solaire, CSP Ait Baha, CHAMS, AquaSolar).
The previous images remain privately backed up. PDFs, portraits, publication gates
and canonical asset URLs are preserved. See [current assets and checks](project-image-refresh-20261016.md).

## Latest workbook update — 16 October 2026

The owner supplied the updated technical workbook and explicitly confirmed all
70 projects and M.S.F's withdrawal. This supersedes the historical 60-project
roster and PDF-preservation deferral below. The local database/catalogue now has
70 public French projects, 140 EN/AR working adaptations in review and 210 current,
hash-verified PDFs. M.S.F remains private with its history/files preserved. Local
search is rebuilt; source/review footer notices are replaced by canonical website
links, and emails have the requested contact label. AutoConsoPV is closed. All 70
projects now have images; 11 new conceptual illustrations retain internal provenance
without a generated-image label in the interface. Filters stay on one horizontally
scrollable row. The shared `totalProjects()` value drives home, menu, programmes
and careers figures from the current public roster, superseding the historical
fixed 69 below. Shared-checkout full checks
and Git remain held; no deployment. See [reconciliation, workflow and evidence](projects-workbook-1026.md).

## Sourced catalogue — 2026-10-15

The owner commissions extraction of the projects listed at
<https://iresen.org/agence-de-moyens/>, population of the local project database,
English/Arabic translation and restoration of the previously developed catalogue.
This supersedes the forthcoming-update state. Scientific-production counters are
explicitly excluded from the scraper output, schema, import and presentation.

The extraction retains **60 unique project references** and their individual
`https://iresen.org/projects/{reference}/` sources. French titles and source classifications are preserved. Original prose remains
in the private source archive; AI-assisted descriptions and objectives are edited
for consistent length without adding unsupported claims. Listing filter classes supply
the historical programme labels; they do not prove a relationship to a particular
CMS Calls record. Source information is historical, not verification of current
status, commercial adoption or achieved objectives. The independent sourced
69-project programme figure is unchanged.

## Model and missing information

The historical `ProjectRecord` and catalogue interaction model were recovered from
Git before the demonstration withdrawal. A new real Payload `projects` collection
persists that model with localized text and the existing editorial permissions,
versions, publication status and locale gates. It is registered in Payload/types
and an additive PostgreSQL migration. This is an actual CMS-backed collection,
not restoration of the withdrawn fictional JSON database.

Retained fields: stable reference/acronym, title, description, short summary, objectives, source
theme, listing-derived programme, start date text/year, source-labelled location,
coordinator name/email/phone, project image and available portrait, provenance URL,
source hash and collection timestamp. Status, budget, duration, hosting platform,
coordinator affiliation, selection-call reference and verified consortium remain
null where unsupported. A source location is not silently promoted into a hosting
platform or coordinator affiliation. Dates retain their supplied precision; numeric
`01/02/2014` is preserved rather than reinterpreted across locales.

All 60 source consortium blocks contain unusable placeholder image URLs; no partner
identity is inferred. Sixty source project images and 57 available portraits are
retained privately with hashes; unavailable eSCOOBOX, WiMeCOM and FAPPB portraits
remain absent. WebP derivatives resize to at most 1200px/320px without enlargement.

## Import and translation workflow

Use Node 24.19.0/pnpm 11.19.0 and Python 3 standard library. No new dependency,
account or credential is installed. Commands operate against the configured local
PostgreSQL instance and preserve existing unrelated collections and records:

```sh
python3 scripts/scrape-projects.py
python3 scripts/translate-projects.py
python3 scripts/review-project-translations.py
python3 scripts/download-project-assets.py
pnpm cms:migrate
SEARCH_WORKER_DISABLED=true node scripts/run.mjs tsx scripts/import-projects.ts
pnpm search:rebuild
```

The translator uses Google's public translation service for public narrative
text, theme, location and start-date labels. Coordinator names, email addresses,
telephone numbers and portraits are not submitted. EN/AR receive a terminology
pass (including acronyms, institution labels, battery and optical terminology).
The 60 French descriptions are edited to 365–416 characters, with 100–138-character
previews and two to five concise objectives. `src/data/project-editorial-fr.json`
is the editorial source; matching EN/AR files contain reviewed adaptations. Arabic
narratives were rewritten after terminology issues in the initial translation.
Translations remain AI-assisted working text, not final institutional review.

The import validates all 60 records and both translations before writing. It uses
an existing local administrator through access-controlled Local API operations;
it never bootstraps accounts. Existing references are preserved on rerun; collisions
with another source fail. `--refresh-translations` explicitly refreshes only matching
source hashes and locales still marked pending/review, preserving approved locales
and shared facts. `--refresh-editorial` explicitly updates the French editorial
fields and pending translations for matching source hashes. Neither option approves
or publishes translations.

Raw HTML, contact-bearing JSON, translations, original images, download/derivative
manifests and served image bytes live under ignored `.local/projects/`, not Git or
`public/`. Preserve/backup this directory together with the database. Runtime assets
use `PROJECTS_ASSET_DIRECTORY` (absolute external mount in a standalone installation);
`scripts/run.mjs` pins its local default to the repository's `.local/projects/assets`.
Standalone tracing excludes `.local` and `.cache`, as well as existing private
references/environment files, preventing private source copies and previous review
builds from entering the application artifact.

Restart old application/search workers after applying the additive migration and
before rebuilding discovery: a still-running older worker does not know the new
collection. Reconcile/rebuild after the import and confirm all 60 project results.

## Publication and local review

The requested French source migration has `publicationStatus=published`, public
visibility and a published revision in the **local database**. All 60 English and
60 Arabic translations have `publicationStatus=review` and `translationReview=pending`.
They remain excluded from public reads, media and search until a publisher approves
that language. No translation fallback is used.

`PROJECTS_LOCAL_REVIEW=true` enables an explicit local review of these translations,
with a visible working-translation notice. Production-mode review additionally
requires the existing `CMS_LOCAL_REVIEW=true` isolation opt-in. `PUBLIC_RELEASE=true`
always defeats project-review access. Review queries use selected visitor fields;
editorial notes/source hashes/review metadata are never sent to the page. This does
not open production administration or modify `/cms-preview`'s isolated state.

## Page, media and search

The restored page keeps the existing original hero, central FR/EN/AR routes and all
five anchors: `featured-results`, `find-project`, `project-catalogue`,
`understanding-results`, `related-capabilities`. It restores query/theme/year/programme
filters, six-record pagination, native details dialog, Escape/focus restoration,
reduced-motion behavior and server-rendered detail reading without JavaScript.
Unknown statuses are neither badges nor available filters. Card descriptions are
short summaries, visually limited to three lines; complete text remains in details.
Scientific objectives use native bullets without inter-item margins. Missing
metadata is omitted. The owner removed the historical-source explanatory notice
from the interface and its localized search metadata on 15 October.
Contact actions compose local email drafts, without online intake.

No old demonstration record, portrait placeholder, partner mark or fabricated PDF
is restored. Withdrawn demonstration note URLs still return 404/no-store.
“Consulter la fiche” now points to a guarded PDF on this site, rather than the
former website. There are 180 locally generated project PDFs (FR/EN/AR); the owner
requests leaving these files as they currently are and defers their revision until
the updated project list is added. The latest notice removal affects the interface
and search metadata only; PDF bytes are unchanged.

Project images/portraits are served only through
`/api/projects/{reference}/asset/{image|portrait}?locale={locale}` with the same
current publication/locale gate and `private, no-store`. Invalid references/kinds,
missing files, withdrawn projects and unapproved public locales return 404. Browser
requests stay on the current site; the source hosts are not embedded.

Visitor PDFs now use on-demand generation from a single localized HTML template.
The guarded `/api/projects/{reference}/note?locale={locale}` route checks the live
project/locale before and after rendering. A bounded temporary memory cache keys
actual HTML, including text, image bytes, logo, fonts and template. Missing static
files or old `project_notes` registrations no longer hide the PDF action. Legacy
exports and backup copies have been deleted at the owner’s subsequent request.
See [implementation, runtime requirements and verification](project-pdf-on-demand.md).

The live `search_public_sources` view, insert/update/delete triggers, worker and
rebuild include approved projects, their media and current PDF documents. Stable project results point to
`?project={reference}#project-details`; media results use their guarded endpoints.
Revisions include public text and media changes. Public eligibility is rechecked
against the live view, including spelling vocabulary, before stale results can be
shown. Private notes, contact coordinates, hashes and unapproved translations are
excluded. French source title/acronym/topic/goal metadata supports exact-first search.

## Verification ledger

See the dated entry in [validation](validation.md). No deployment, DNS, repository
visibility change or final editorial approval is included. The historical 24-record
fictional catalogue and 72 notes remain withdrawn in Git history.

## Coordinator names — owner correction, 2026-10-15

All 60 records use `Prénom NOM` in FR/EN, including uppercase surname particles
and compound surnames; first names retain initial capitals and ordinary lowercase.
The source's `Sebari Imane` is reordered to `Imane SEBARI`. The 55 distinct source
spellings map to 51 display names in `src/data/project-coordinators.json`; missing
future names fail explicitly instead of being guessed by splitting tokens. Arabic
names use editorial Arabic-script transcriptions, separate from Latin display names.
Original source names remain in the private source archive.

Apply this bounded correction with:

```sh
SEARCH_WORKER_DISABLED=true node scripts/run.mjs tsx scripts/import-projects.ts --refresh-coordinators
```

Only localized coordinator names change; publication/review fields are preserved.
The owner keeps current PDFs until the updated list: this name-only command
explicitly carries forward an already-current, hash-verified note revision without
rewriting its file. It never revalidates a previously stale/missing/corrupt PDF.
Thus existing PDFs retain their previous name typography/transcriptions for now.
Normal content edits still invalidate note revisions. New imports and explicit
editorial/translation refreshes reuse the same name mapping. Synchronize the
project search jobs after applying the correction.

## Catalogue free-text search — owner correction, 2026-10-15

Free text matches every populated visitor-facing project field: acronym/reference,
title, description/summary, programme/selection reference, theme/domain, status,
dates/year, location/platform, duration/budget, coordinator name/affiliation/email,
consortium/partner names and scientific objectives. The interface supplies localized
domain/status/duration labels.
Private editorial/provenance hashes and file bytes are outside the search text.
Matching remains case/accent insensitive, with all query words required across the
combined text, and intersects existing theme/year/programme/status filters.

Arabic coordinator search accepts both the Arabic display name and the original
public Latin identity aliases from the curated name mapping. Other working locale
content is never used as translation fallback. `rachidi` now finds MELHY in FR/EN/AR;
`رشيدي` also finds it in Arabic. The source-review browser scenario includes this
regression; execution of automated checks remains pending the shared freeze.

## Coordinator contact and portraits — owner correction, 2026-10-15

Coordinator blocks now show a clickable email instead of a telephone number.
Telephone values remain in the private source/CMS record, but are omitted from the
visitor query projection and catalogue filtering. Missing emails remain absent.
Existing contact buttons continue to compose local email drafts.

Portraits use a circular CSS crop at 4.25rem (68px at the standard root), increased
from 3.5rem/56px, with cover fitting and a slightly raised crop center. Originals
and guarded asset URLs are unchanged; no new image derivative/search result is
needed. Long emails wrap within their text column, including Arabic mobile RTL.
Existing PDFs remain unchanged as previously requested.

## Partner section deferred — owner correction, 2026-10-15

The owner cancels the requested partner/logo section until a later update. Its
in-progress UI, localized labels and logo projection are removed; no partner
record, logo asset or attribution was imported. The previously empty consortium
fields remain empty. Verification of the cached source found 289 consortium images
across 60 fiches, with numeric-only alt labels and invalid numeric host URLs;
these do not identify partner organisations. Existing coordinator/email/portrait,
filter and PDF behavior remains unchanged.

## Call-to-catalogue navigation — 2026-10-16

Every archive and published CMS call offers a localized “View projects” action
at the bottom of its details (below “Sources consulted” on archive pages).
It opens the canonical projects route with `programme` preselected and the
`find-project` anchor. Archive editions use the historical listing labels where
available; other editions retain their own title, and CMS calls use their acronym.
This is programme discovery, not a verified selection-call attribution: project
records, `selectionCallReference`, dates and publication gates are unchanged.
A programme with no eligible projects remains selected and shows the empty state;
it must never silently fall back to the entire catalogue. Reset restores all
eligible projects. Existing canonical call/project search registrations already
cover these destinations; no new public resource or search result is created.

Verification: 174 unit tests, scoped ESLint/format checks and an isolated production
build (including TypeScript) pass. Three production browser journeys cover FR/EN/AR,
programme navigation, selection after reload and empty programmes; mobile FR/AR
captures are inspected. Browser checks use installed Chrome; the default bundled
Playwright browser is unavailable locally. Full current-head CI remains the merge gate.

## Identity consistency — 16 October 2026

Project display uses the shared sourced university/establishment identities and
curated personal names. The existing query field recognises establishment aliases
and parent university names, including FSTS/UH1, FSTT/UAE, EMI/UM5, ENSAK/UIT,
ENSAM Meknès/UMI and ESTF/USMBA. No additional university/establishment filters are
introduced, following the owner's correction. ENSAM Rabat duplication, MAScIR's
city suffix, Semlalia's city suffix and Tahala's former regional wording are
normalised for display. CNEREE and CNESTEN use full names followed by their
acronyms after a dash; Green Energy Park omits the Benguerir suffix. Original evidence and PDF bytes remain unchanged. See
[the reference, source editions and check ledger](references/university-registry/README.md).

## On-demand PDF follow-up — 16 October 2026

The owner approves replacing the routine 210-file set with one shared layout and
FR/EN/AR messages, generated on click from current project data and images.
This supersedes earlier requests to preserve PDF presentation. Original exports were initially preserved privately, then deleted at the owner’s
explicit follow-up below. No language approval or production deployment
is inferred. The owner explicitly leaves final tests/build/CI to another chat;
this workstream stops after scoped development verification and readiness reporting.

Owner follow-up: delete the old generated PDFs and associated ZIP, including
backup/obsolete-build copies. The new on-demand generator and three verification
samples remain. See the deletion ledger in [the PDF handoff](project-pdf-on-demand.md).

## Visitor-facing descriptions — owner correction, 23 October 2026

The owner withdraws internal missing-description/tracker notices from public copy.
Eight workbook additions now have concise FR/EN/AR narratives and previews:
SOLTANAIR, EV Plan, Lenium SolarWater, E-PAVE, STDSCWG, DAKH2A, GreenH2Hub and
GREAT-H2. Descriptions explain the supported project subject and collaboration;
compact objectives are supplied only where the research aims are evidenced.
The fallback generator now produces metadata-based copy without an internal
missing-source sentence, preventing the same notice on future imports.

Primary-source research and per-project boundaries are recorded in
[the source ledger](project-public-copy-sources.json). DAKH2A now explains direct
air capture of CO₂ and a planned Moroccan demonstrator. SOLTANAIR stays grounded
in the approved energy-storage theme and consortium; GreenH2Hub uses the confirmed
hydrogen programme and collaboration. E-PAVE stays at the evidenced road/energy
transition level. Detailed technology or results are not inferred from project
acronyms, generic technology pages or unverified secondary claims. Website copy
is paraphrased; original documents and private source materials are unchanged.

`scripts/update-project-public-copy.ts --apply` updates only the eight projects'
description, summary and objective fields through Payload, with a private backup,
normal version history, an initial guard against replacing separately edited
narratives, a transaction and assertions preserving all publication/translation
gates. It is repeatable without further writes. Future workbook imports reuse the
same entries in `project-workbook-editorial.json`. No project, result, publication
approval, partnership record, original PDF or media asset is created by this edit.
Current on-demand PDF generation reads the updated project narrative normally.

The related public report introduction now describes the available energy/climate
reports and strategies instead of referring to an internal supplied folder. Source
catalogues, named page sections and public variants are reconciled with backup,
revisions and audit through `scripts/sync-public-resource-copy.ts --apply`.

Verification ledger: 24 localized project records matched the new editorial copy;
no active project description retained the internal tracker notice. Existing
publication/translation gates were asserted unchanged by the updater. FR/EN/AR
DAKH2A development detail views were checked at 390/1440px, including containment.
Scoped ESLint, formatting and whitespace checks pass. Local search rebuilt; full
production/browser suites and final-head CI remain under the shared checkout hold.

## Monetary display — owner correction, 23 October 2026

Public project funding and on-demand PDF metadata use the shared `formatMoney`:
Latin digits, U+00A0 thousands separators and U+00A0 before `MAD`, with `Math.floor`
and no decimals. For example, 1,278,600.50 is displayed as `1 278 600 MAD` in all
locales. Database numbers retain their original precision; no source funding
value is rounded or overwritten. Catalogue filtering also includes the displayed
form alongside the precise numeric value.

The existing SOLR’SHEMSY target price is displayed as `4 000 MAD` in FR/EN/AR.
`scripts/update-project-money-copy.ts --apply` changes only its objective typography,
with private backup, versions, transactional writes and publication-gate assertions.
Workbook reimport reuses the canonical objective to prevent restoring old `DH`
formatting from earlier local translation derivatives. Other narrative content,
scientific targets and source originals remain unchanged.

The rule covers current call budgets and archival funding prose too; original
EUR/USD currencies are retained. `MoneyText` and the PDF equivalent isolate complete
amounts inside Arabic sentences. Archive phrases in millions are expanded into
the same full-number format without altering their values or qualifications.

Verification ledger: targeted ESLint/format/whitespace; development FR/EN/AR
EV Plan amount equals `1 278 600 MAD` with all three separators U+00A0; FR/AR archival
and objective inline amounts verified, with 390px/200% root-text containment.
A real local EV Plan French PDF returned HTTP 200, its extracted amount was checked
and its first page visually inspected. No current CMS call had a free-text budget
note to reconcile. Unit cases for grouping, flooring, zero/negative/non-finite
values and inline isolation, plus an all-locale call regression using a fractional
budget, await the shared hold's formal test/production/CI phase.
