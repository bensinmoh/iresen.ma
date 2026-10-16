# Collaborative projects

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

PDF metadata lives in the private `project_notes` table. A localized public-content
revision and SHA-256 check prevent serving a missing, corrupt or stale note. The
PDF action is absent when the current revision has no matching note. The guarded
`/api/projects/{reference}/note?locale={locale}` route shares project eligibility.
Files remain under ignored `.local/projects/notes`; standalone installations use
`PROJECTS_NOTES_DIRECTORY`. `scripts/generate-project-notes.ts` generates notes
explicitly from current local records; it is not run on visitor requests. No PDF
regeneration is commissioned for the latest corrections.

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
