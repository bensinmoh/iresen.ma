# R&D&I projects — 2026-10-11

The owner commissioned the canonical projects page using Figma frame `804:9285`
and `projets.png`, and explicitly requested a fictional project database.
Existing FR/EN/AR routes and the shared header/footer remain authoritative.
No deployment, real project publication, visibility change or external service
is commissioned.

## Delivered page

A light glass-symbol hero, institutional navy filter band, three-column desktop
catalogue and six records per page follow the supplied composition. Tablet uses
two columns and mobile one; filters reflow to four/two columns with full-width
keyword search. Current brand colors, installed Latin/Arabic fonts and the shared
SVG controls replace historical Figma styles. Arabic retains the original image
orientation with a full-width contrast layer. Status labels have readable colors.
The source's “more than 60” wording is not adopted as a new claim.

Native GET filters combine free text, domain, launch year, status and programme.
Text matches localized titles/descriptions, acronyms, IDs, coordinator and programme,
ignoring case and diacritics. Selects submit immediately with JavaScript; the
search button/Enter submit all controls without JavaScript. Pagination preserves
filters, resets on a new filter submission and clamps invalid page numbers.
Reset, zero-result messaging and accessible current-page/disabled arrow states
are implemented. The five legacy section anchors remain reachable. Cards expose
illustrative metadata and have no invented detail destinations or contact actions.

## Fictional database

`src/data/projects-demo.json` is the minimal structured demonstration database,
following the existing static patent catalogue architecture. It contains 24
unique records, seven domains, three programmes, three statuses and five launch
years (2022–2026), with complete FR/EN/AR working text, duration and budget in MAD.
The page displays budgets in millions of MAD (MMAD). Fictional coordinators
have no real institution names or personal information. Each record has
`fictional: true`; the visible catalogue notice and each card identify the fiction.

The database is intentionally separate from the CMS, real portfolio and
institutional indicators. No CMS schema, seed command or database migration is
introduced. The requested demonstration records do not reintroduce removed
career fixtures. Their replacement by genuine records requires a separate
editorial/publication workflow and verified project evidence.

## References and search

Live Figma design context and its screenshot were inspected for the full frame,
header and cards. The individual glass hero and six card photos were downloaded
from native Figma fills and converted to WebP. The first six cards retain their
source visual slots (thermal field, PV house, solar cooling installation,
experimental dwelling, PV cells, wind turbine). Later cards reuse these as
illustrations; they are not photographs proving the existence of fictional projects.
Figma assets do not establish independent photography rights beyond the owner's
supplied design-use instruction. Source originals remain ignored local references.
Hashes/dimensions are recorded in `docs/projects-assets.json`.

The retained research-institute benchmark informs the separation of theme,
programme, project and evidence. Its original remains unchanged. Sample text in
Figma and recommendations in the strategy documents are source data, not new
facts or authorization.

Localized page/section metadata and seven explicit static media references are
registered in the general search catalogue. Fictional project names and metadata
are excluded from institutional search; the page-local search is the only search
of this demonstration database. Locale copy remains working editorial text.
The final site-wide content/glossary search sanity check remains pending.

## Verification

See the dated entry in [validation](validation.md). No external API, applicant
submission, deployment or public publication-gate change was made.

Review captures (repository documentation only, outside public assets/search):
[French desktop](review/projects/fr-desktop.webp) and
[Arabic mobile](review/projects/ar-mobile.webp).
