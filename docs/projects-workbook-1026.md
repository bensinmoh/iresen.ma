# Collaborative projects: October 2026 workbook update

## Latest owner request — 16 October 2026

The owner supplied `PMO_Suivi Technique des Projets AaP_1026 - Site Web.xlsx`
and requested database/catalogue revision and a PDF for every project. This
supersedes the former 60-project list and the instruction to preserve old PDF
bytes until an updated list arrived. Workbook contents are evidence, not
instructions. No deployment or final translation approval is commissioned.

Source SHA-256:
`c895228d954f6cdeff8c48d95af26d6c914899987813b777d25c3a3b32e599f4`.
The original workbook remains outside Git and public assets, unchanged.

## Reconciliation and data decisions

The first worksheet contains **70 distinct projects**: 59 existing references
and 11 additions. Stable references are preserved through explicit aliases,
including SolarShamsy → `solrshemsy`, CSPAitBaha → `csp-ait-baha` and
Nanolubrifiants → `nano-lubrifiants`. M.S.F is absent from the updated list;
the prepared import makes it private, preserving its database/history and PDFs.

Additions: PINREMAT, SOLTANAIR, EV Plan, Lenium SolarWater (LSWater), RESTART,
E-PAVE, STDSCWG, DAKH2A, GreenH2Hub, GREAT-H2 and PRAGMA-E.

- Only commissioned project columns A–F and H–N are extracted. Gender,
  scientific-production counters and the second worksheet are excluded.
- The funding column is **funding awarded by IRESEN**, never total project cost.
  French-formatted amounts are parsed, including spaces and decimal commas.
  PRAGMA-E's absent amount remains null; it is not zero.
- Numeric semesters become six-month periods. MELHY's explicit 14-month value
  takes precedence over its approximate semester notation. FAPPB has 36 months
  plus the explicitly recorded 12-month extension, giving 48 months. Raw source
  wording remains in the private extraction and internal provenance.
- Excel dates retain their actual day/month/year. Six unknown dates remain null;
  a call year is never used as a project start year. AutoConsoPV's worksheet status
  is blank; the later owner correction below classifies it as closed. Existing status categories group achieved/closed projects and
  starting/upcoming projects; the exact source status remains in private notes.
- Source programmes, city, coordinating institution, coordinator and first
  source-listed email replace historical metadata. Empty source emails stay
  empty. Telephone numbers are not imported or shown. Co-coordinators remain
  together. Names use the curated Latin/Arabic mapping; honorifics are omitted.
- Consortium text now has supplied evidence and populates the existing detail
  field. No logos or new partner module are created. Official organisation names
  remain in their source language where no verified Arabic identity is available.
  Coordinating institutions are not inferred to be hosting platforms.
- Fuller historical narratives, objectives and existing images supplement the
  updated metadata for the 59 matched projects. Worksheet descriptions can be
  truncated and are not silently used to truncate those narratives.
- PINREMAT, RESTART and PRAGMA-E have source-derived editorial adaptations.
  The eight other additions have acronym titles and metadata-based summaries
  explicitly stating that a detailed description was not supplied. They have no
  invented objectives, expansions, images, results or dates.
- Existing programme-to-project links gain the newly represented 2021/2024,
  France–Morocco 2024 and LEAP programme labels. Case variants of the same 2019
  programme are normalized without merging distinct calls.

## Prepared workflow

Use the repository's pinned Node 24.22.0 and pnpm 11.28.2. Python extraction uses
only the standard library and never modifies the source workbook:

```sh
python3 scripts/extract-project-workbook.py /absolute/path/to/source.xlsx
SEARCH_WORKER_DISABLED=true node scripts/run.mjs tsx scripts/import-project-workbook.ts
SEARCH_WORKER_DISABLED=true node scripts/run.mjs tsx scripts/import-project-workbook.ts --apply
PROJECTS_LOCAL_REVIEW=true PLAYWRIGHT_EXECUTABLE_PATH=/absolute/path/to/chrome \
  SEARCH_WORKER_DISABLED=true node scripts/run.mjs tsx scripts/generate-project-notes.ts
pnpm search:rebuild
```

`scripts/project-workbook-data.ts` validates the complete 70-row preparation before
database access. The importer refuses non-loopback databases, requires an existing
administrator and checks reference collisions. A private current-record/note
snapshot precedes writes. `--apply` performs the catalogue update in one database
transaction. Without that flag it validates against current records and saves the
snapshot. The supplied workbook, contact-bearing extraction, snapshots and notes
stay under ignored `.local/projects/`; no credentials or private originals enter Git.

French records are prepared for the existing local source-migration publication
state. EN/AR remain `review`/`pending`; no translation fallback or public-release
review access is introduced. The existing CMS/search/media/PDF gates remain.
After applying, regenerate live notes and rebuild discovery. Stable project and
document destinations remain `?project={reference}#project-details` and
`/api/projects/{reference}/note?locale={locale}`. Withdrawal must remove M.S.F
from public results and return 404 for its guarded assets/notes.

An offline PDF mode supports concrete review before importing:

```sh
PLAYWRIGHT_EXECUTABLE_PATH=/absolute/path/to/chrome \
  node --env-file=.env.local --import tsx scripts/generate-project-notes.ts --workbook-preview
```

It generates 70 FR, 70 EN and 70 AR PDFs in
`.local/projects/workbook-1026/pdf/`, without querying or writing PostgreSQL,
registering notes, or replacing the site's current PDF files. The renderer uses
the existing fonts, original logo, Arabic shaping and accessible tagged PDFs.
It includes source-backed funding/duration/status, coordinating institution,
consortium and available objectives/email. It omits absent sections, repeated
acronym headings and phones. The owner's latest footer correction removes source,
objective-status and translation-review notices, along with legacy iresen.org
links, from every PDF. Two clickable links replace them: `www.iresen.ma` and the
localized canonical project URL built with `pageHref`, the stable reference and
`#project-details`. These PDF-only removals do not approve EN/AR translations or
alter their database/media/search gates.

The subsequent owner correction adds “Contactez le coordinateur sur :” beside
each available email, with equivalent EN/AR wording. The label and `mailto:`
link share a naturally wrapping row in the locale's reading direction. No label
or empty contact block is generated for missing addresses.

## Current delivery and check ledger

**Local database/catalogue update completed.** Following the initial automatic
review refusals, the owner explicitly confirmed “Je confirme les 70 et le retrait.”
The approved import then succeeded in one transaction: 59 matched projects updated,
11 created, M.S.F made private with its history retained. A private pre-import
snapshot and all 180 previous PDF files are preserved. No approval bypass was used.
The 210 PDFs were regenerated from actual CMS records, registered against their
current content revisions and packaged into the final private ZIP. Search was
rebuilt after note registration. No deployment is included.

The shared coordination batch is also held. Full unit/integration/browser suites,
production build, Git push, CI and merge remain deferred to its coordinator.
This is separate from approval of the local data update.

Preparation evidence: standard-library extraction reconciles all 70 distinct
references; offline preparation validates 70 complete display records in each
locale, 11 additions, eight missing descriptions, MELHY 14 months and FAPPB
48 months. Scoped ESLint, TypeScript `--noEmit`, changed-file formatting and
whitespace pass. Offline PDF structure and visual verification are recorded in
the task's private review manifest. The final package contains **210 one-page
PDFs**, with two verified canonical footer destinations per file (420 total)
and 192 labelled email actions (64 per language). Source/review notices and
legacy project-page URLs are absent. The six missing emails per language create
no contact label/block. Final AquaSolar FR and ECoMatAF AR renders confirm the
contact row and replacement footer; the long PROPRE.MA layout and English render
were also inspected. The private ZIP groups files by FR/EN/AR and includes a
SHA-256 manifest. The final ZIP now contains the actual CMS-generated files,
replacing the earlier offline review copies.

Post-import read checks confirm exactly 70 public references, M.S.F private,
140 pending/review translation records, 210 current note revisions and all 210
file hashes. Public-release reads return 70 French projects and no EN/AR projects
even when review flags are present. Direct guarded-route checks return 200 for
French PDFs, 404 for withdrawn M.S.F and unapproved locales, then 200 for EN/AR
only under the explicit isolated local-review configuration. PDF headers retain
`private, no-store`.

The live search view exposes only 70 French project sources. Its rebuilt index
has 70 projects, 70 documents and 115 retained image/portrait results; M.S.F and
EN/AR project entries are absent. Actual development-server search requests find
E-PAVE as a project and AquaSolar as a document, omit M.S.F's destination and
return no EN/AR project results for PINREMAT.

Development browser review on the existing local server covers FR E-PAVE at
390px, EN PINREMAT at 1440px and AR ECoMatAF at 390px. Each details dialog and PDF
action returns successfully; no horizontal page overflow is measured. Screenshots
were inspected, including Arabic RTL and long institutional/funding labels.
Live AquaSolar FR and ECoMatAF AR PDF renders confirm the latest footer/contact
changes. Evidence remains private under `.local/projects/workbook-1026/`.

Rollback was not deliberately exercised against the owner's populated database.
Full automated integration/production-browser coverage, the final production build
and current-head CI/Git completion still await the shared coordination freeze.

### AutoConsoPV status correction — 16 October 2026

The owner explicitly states that AutoConsoPV is also closed. Its shared CMS status
is now `completed` (the existing achieved/closed category) in every locale, without
altering publication or translation approvals. The empty workbook cell stays
unchanged in the private extraction; an explicit preparation override and private
provenance note preserve the owner's later correction on reimport.

The previous record and three PDF files are privately backed up. Only AutoConsoPV's
FR/EN/AR PDFs were regenerated, using the new `--project=autoconsopv` option; the
207 other PDF hashes remain unchanged. Search revisions are current. The final
210-file ZIP/manifest was refreshed and its links/contact labels rechecked; the
French PDF render confirms the closed status. Scoped formatting, ESLint and
whitespace checks pass. Full checks/Git remain held by shared coordination.

### Filters, missing images and shared total — 16 October 2026

The five catalogue search/filter controls remain in one row at every width. They
fit on desktop and use native horizontal scrolling at smaller widths, including
keyboard focus and Arabic direction, without horizontal page overflow. Local
browser checks cover FR 320/390/768/1024/1440px, EN 1440px, AR 390/1440px and
FR 768px at 200% root text size. Selecting the completed category and searching
AutoConsoPV returns its single corrected record.

Eleven projects lacked images. Built-in ImageGen produced description-based
conceptual illustrations for PINREMAT, SOLTANAIR, EV-PLAN, LSWATER, RESTART,
E-PAVE, STDSCWG, DAKH2A, GREENH2HUB, GREAT-H2 and PRAGMA-E. Missing scientific
information is not filled by the images. The originals and optimized 1200px WebP
assets remain private under `.local/projects/generated-images/` and
`.local/projects/assets/`; the eleven served files total 1,131,918 bytes.
[The asset audit](project-illustrations.json) records prompts, hashes, dimensions
and guarded URLs. `scripts/import-project-illustrations.ts` snapshots and attaches
only previously missing images through a local transaction.

The owner's follow-up removes the generated-illustration wording from cards,
details, alternative text and searchable descriptions. Descriptive localized
alternative text remains; generation provenance stays in the internal audit.
The catalogue has 70 public projects with images. Verification confirms all 117
legacy image/portrait derivatives and all 210 current PDFs remain byte-identical.
Search now includes 126 image/portrait results (11 new image references); only FR
is public. All eleven guarded FR image requests pass with `private, no-store`;
unapproved EN/AR and withdrawn M.S.F remain 404, with EN/AR accessible only in
explicit isolated local review. Final browser checks cover loaded card/detail
images and subject-only alternative text in FR 1440px, EN 768px and AR 390px.

`src/lib/project-count.ts` supplies the shared `totalProjects()` variable, currently
**70**, to the home hero, research menu, programme figure and careers environment.
It counts the canonical public, published French roster with complete display
fields, enforces access checks and reuses the result within a request. The total
is shared across interface locales without publishing review translations.
An unavailable database displays an em dash; an actual empty roster displays zero.
Static search metadata retains descriptive figure labels without a stale numeric
snapshot. The programme reference now identifies the current project catalogue.
Integration test coverage has been added for count growth and withdrawal; hero
browser expectations accept a database-derived number. These automated suites
await the shared freeze. Scoped ESLint, TypeScript `--noEmit`, formatting and
whitespace checks pass; no full tests/build/CI/Git completion or deployment occurred.

A fresh isolated development server confirms 70 in both the menu and page figure
on FR home/programmes/careers, EN home, and AR home/programmes. The six journeys
pass; menu, hero and programme captures were visually inspected. This fresh
server avoids a stale component-export error observed in the older shared dev
process. Restarting the usual development server resolves that cache error; all
six journeys then pass again on port 3000. The isolated server is stopped.
Production build verification remains deferred to the coordinator.

### Later whole-catalogue image replacement

The owner subsequently commissioned replacement of every project image, correcting
the six exceptions to mean source-based recreation rather than preservation.
[The current refresh](project-image-refresh-20261016.md) supersedes the image
preservation statements above: all 70 project images change, while the 210 PDFs,
portraits, source archives and publication gates remain preserved.
