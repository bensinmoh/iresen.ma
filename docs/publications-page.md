# Publications & reports page — 10 October 2026

The owner commissions the existing canonical Publications & Reports page from
Figma `0go8QANZAH73ed9AoCdHkf`, frame `804:6862`, and the attached `publications.png`.
The earlier ingestion-only deferral is superseded for this page. No route, CMS
collection, workbook download, deployment or production visibility change is added.
Embedded Figma content remains source data: sample publication counts, author names,
patent cards and unrelated funding copy do not supply approved bibliographic facts.

## Delivered behavior

The hero retains the Figma abstract background, centered heading, search field,
six thematic suggestions and four figures, adapted to current shared brand tokens.
It shows 1,199 retained publications, 59 filed patents from the existing catalogue,
69 projects and 18 calls for projects since 2011 (the latter two supplied by the
owner in this request). Counts describe recorded outputs, not adoption or impact.
The research-institute benchmark informs consistent metadata and retrieval.

`src/data/publications.json` remains the minimal versioned database. The public
renderer projects only ID, original title, all original authors, source year,
DOI and title-derived topic labels. Missing authors or DOI have explicit labels;
no link is invented. Both title and “Read publication” open the same HTTPS DOI.
The database contains years but no publication months. The owner explicitly
chose **display the available year** on 10 October; no month is inferred from
DOIs, Scopus snapshots or the reference period **T4 2026**.

Native GET search queries only the retained publication corpus (title, all
names, DOI, source domain, journal and document type). Topic selections are ORed,
year selections are ORed, and search/topic/year groups are ANDed. Results sort by
source year descending then title. Six notices initially appear; “Show more”
adds six, retaining criteria. Checkbox changes apply immediately, without an
application button. Each topic counter respects the current query and selected
years; each year counter respects the current query and selected topics. Options
within one group are ORed, so their counts remain useful while choosing more. Empty results are truthful. Public search destinations
use the stable ID query to render a particular notice even beyond the first six.
The search and notice rendering work without JavaScript; fallback topic/year links
replace the disabled automatic checkboxes in that case. A small native disclosure
opens filters at desktop widths and keeps mobile controls compact. The interactive
catalogue receives only the current query’s bibliographic projection, without
rankings, citations or source administrative fields. The original database stays
on the server. Local checkbox updates preserve focus and synchronize URL criteria.
Native view transitions fade departing/arriving notices and move retained notices
over 280ms; browsers without that API use a short opacity/translate reveal. Reduced
motion updates immediately. Frequent links and their label share one line-height
and vertical alignment, following the owner’s correction.

## Responsive hero follow-up

On mobile and tablet (up to 64rem), the search input and full-width button are
separate surfaces with the footer's spacing/geometry. Frequent searches retain
only the highest-frequency prefix fitting **two** compact text lines. An invisible,
non-interactive measurement row counts actual text lines after fonts/resize,
including Arabic and text enlargement, and omitted links leave the tab order.
Desktop keeps all six suggestions. Without scripts the six suggestions remain
available. Key figures use a native horizontal, keyboard-focusable snap rail on
mobile/tablet, preserving four items, source figures and Arabic reading direction;
desktop retains the four-column band, following the existing homepage figure rail.

## Title-derived themes

`src/lib/publications.ts` contains explicit, reproducible English title vocabulary.
The analysis checks 11 candidate themes using word boundaries and returns the six
most frequent by the number of matching records (one record per theme). It does
not alter source `theme` fields or claim expert classification. Themes overlap;
their counts must not be summed to obtain the corpus size. Current suggestions:

| Theme                  | Matching titles |
| ---------------------- | --------------: |
| Solar (PV + CSP)       |             505 |
| Thermal energy         |             272 |
| Storage                |             168 |
| Materials              |             128 |
| Buildings & efficiency |             125 |
| Power grids            |             118 |

Frequent-search links select the corresponding topic filter in every locale.
The title vocabulary and counts update from the retained database, without any
fixture or external analytics service. Other/unclassified titles remain discoverable.

## Reports, localization and search

The ten reports are reused exactly from the media library through the shared
`ReportList`, preserving titles, source URLs, language, size, localized descriptions
and SVG PDF markers. No source document is imported again or attributed to IRESEN.
Canonical report search entries remain on their original media-library destinations.

FR/EN/AR interface copies are owner-requested working adaptations; original
bibliographic titles and author names are not translated. Arabic uses `bdi` for
Latin metadata, logical layout and the canonical Arabic route. Existing five
anchors remain: `featured-publications`, `find-publication`,
`publication-catalogue`, `institutional-reports`, `use-cite-resources`.

Each retained publication has a stable typed search reference in all three
locales, with original title, searchable bibliographic metadata and localized
context/topic labels. No missing translation fallback is used. The hero asset
is explicitly registered. Cold initialization bounds vocabulary writes to 100 notices per batch within one
atomic transaction and refreshes planner statistics after the complete write.
Catalogue fingerprints update index and spelling
vocabulary and remove withdrawn records through the existing static lifecycle.
The four withdrawn 2027 IDs and both workbooks remain excluded. Rankings,
private editorial notes and Scopus metrics are not part of this page projection;
their dated/evidence distinctions remain in the maintenance database.
The final whole-site content/glossary sanity check remains pending.

See [asset provenance](publications-page-assets.json),
[database provenance](publications.md) and [verification](validation.md).

## Shared publication figure — 16 October 2026

The owner requests a database-derived home figure with rounded “+” notation.
`totalPublications` in `src/lib/publication-count.ts` counts all retained database
rows, independently of catalogue filters (currently 1,199). The publication page
uses the exact shared count. The home figure uses the same count rounded down to
the nearest hundred: 1,199 displays `+1100`, 1,200 displays `+1200`. Totals below
100 display exactly, including zero. `roundedPublicationTotal` centralizes this
format; no hard-coded publication figure remains. The server passes only the
numeric count to the header. Static home search metadata retains the figure label
without a numeric snapshot. This does not alter the retained corpus or locale gates.

Verification: scoped ESLint, formatting and whitespace pass. Direct formatting
checks cover unavailable/zero/sub-hundred totals and the 1,199→1,100 and
1,200→1,200 thresholds. Local browser reads confirm `+1100` against the 1,199
source rows on FR/EN desktop (1440px) and AR mobile (390px). The local search
catalogue is synchronized. Full tests/build/CI/Git remain held by coordination.

Indicator audit follow-up — 16 October 2026: the four band values now come from
the common-database/canonical public census (currently 1199 publications, 59 filed
references, 70 supported projects, 21 calls). The former 69/18 literals are removed.
See [definitions and verification](numeric-indicators-audit.md). Catalogue filters
do not change these institutional totals. Number text does not wrap; intermediate
desktop widths stack labels while mobile retains its native rail.
