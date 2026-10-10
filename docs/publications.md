# Publications database — 10 October 2026

The owner commissioned ingestion of the supplied workbook, then explicitly
selected **1,181** publications and **T4 2026** as the reference period. The
future publications section is not commissioned by this ingestion request.

## Database and selection

[src/data/publications.json](../src/data/publications.json) is the minimal,
versioned structured database, following the existing patent catalogue approach.
It is not a new PostgreSQL/CMS collection. Nothing imports it into a public page,
API, media download, search catalogue or spelling vocabulary at this stage.
No publication, deployment or visibility change is performed.

Source: `IRESEN_2026.xlsx`, sheet `Publications`, source version 10 October 2026.
SHA-256: `4298c85423a3199a15ab64efd2e975d32ce53e9cfdfb995d920c4924acab6529`.
The original stays outside the repository; no raw worksheet, source evidence,
dashboard, private note, affiliation, project/funding relationship, administrative
author identifier or source export is copied. Embedded workbook instructions and
validation claims are source data, not authority to publish or execute actions.

The import selects the 1,181 rows whose source dossier state is `Comptabilisée`:
361 source class A and 820 class B. The 155 rows to verify and 47 mere mentions
are excluded, not silently promoted. The source's retained classification is
not a new assertion of independent bibliographic or institutional validation.
All selected IDs and nonempty DOI URLs are unique. Similar titles are not merged:
different papers, corrections and editions can share titles.

## Fields and interpretation

Each record contains only a stable source ID and the requested bibliographic
fields, plus the dates/status needed to interpret its metrics:

| Field                 | Meaning                                                                |
| --------------------- | ---------------------------------------------------------------------- |
| `id`                  | Stable bibliographic identifier for future record/anchor mapping       |
| `doiUrl`              | HTTPS DOI link; null when missing; no unrelated URL substituted        |
| `year`                | Source bibliographic year, preserved independently of reference period |
| `title`               | Original publication title, without invented translations              |
| `authors`             | Source author names/order; numeric Scopus author IDs removed           |
| `theme`               | Source `Domaine`, preserved as supplied; null when absent              |
| `type`                | Source document type; not automatically promoted to journal article    |
| `quartile`            | Q1–Q4 when reported in `Quartile SJR 2025`; otherwise null             |
| `quartileStatus`      | `reported`, `not-applicable` or `unknown`                              |
| `quartileYear`        | Ranking edition for a reported quartile: 2025                          |
| `scopusCitations`     | Source Scopus count, preserving zero versus unknown/null               |
| `scopusCitationsAsOf` | Source metric snapshot date, 8 October 2026 when known                 |

**T4 2026** is the dataset's reference period, not each paper's publication year,
the quartile edition or a live citation date. The workbook's generic `Quartile`
column is empty; actual rankings come from its SJR 2025 column, the best journal
quartile across categories. SJR and Scopus citations remain distinct metrics.
No live Scopus query, ranking verification or synchronization is claimed.

The selected dataset contains 423 Q1, 38 Q2 and 21 Q3 records; 413 have no
applicable journal quartile and 286 have an unknown quartile. Eighteen DOI links,
175 themes and 141 Scopus counts are missing. No values are invented, and
unknown citations do not become zero. All selected records have a year and
author names. Four source years are 2027; they are preserved, with their IDs
listed in the import metadata for chronology review. No publication date is
inferred from a year or DOI. Source themes are broad bibliographic domains,
not editorial assignment to the homepage's seven themes.

## Maintenance and future section

Run `python3 scripts/import-publications.py /absolute/path/IRESEN_2026.xlsx`
to regenerate the dataset and [import metadata](publications-import.json).
The standard-library importer reads the named sheet, uses literal values only,
ignores formulas/embedded instructions, enforces the commissioned source and
selection counts, validates numeric values and DOIs, and rejects duplicate IDs
or normalized DOI links. It does not modify the workbook or a running database.
Use the same command with `--check` for a comparison without writes.
Changed corpus/selection counts require an explicit scope update. Reimporting
the same source is deterministic; it must not overwrite later editorial work
without review.

When the owner commissions the section, use only these 1,181 selected records,
label the reference **T4 2026**, retain original bibliographic titles/names and
show missing metrics honestly. Add approved localized labels and descriptions,
reachable stable anchors on the existing canonical publications page, guarded
search projections and discovery/withdrawal tests in that same increment.
Do not index this staged database merely because import is complete. If a CMS
collection is introduced then, add its migration, publication/locale access
gates and search lifecycle together. The [final content search sanity
check](search.md#final-content-search-sanity-check) remains pending.

See [verification](validation.md#publications-ingestion--2026-10-10).
