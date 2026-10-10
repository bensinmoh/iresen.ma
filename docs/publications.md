# Publications database — 10 October 2026

The owner commissioned ingestion of the supplied workbook, then explicitly
selected **1,181** publications and **T4 2026** as the reference period. The
future publications section is not commissioned by this ingestion request.

The later owner-approved cross-check adopts the updated **1,199**-record
selection: 22 additions and withdrawal of the four 2027 records. **T4 2026**
remains the reference period. The initial ingestion below is historical.

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

The initial selected dataset contained 423 Q1, 38 Q2 and 21 Q3 records; 413 had no
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

The initial future-section selection was limited to 1,181 records; the later
owner-approved 1,199-record update below supersedes that limit. When the section is commissioned,
label the reference **T4 2026**, retain original bibliographic titles/names and
show missing metrics honestly. Add approved localized labels and descriptions,
reachable stable anchors on the existing canonical publications page, guarded
search projections and discovery/withdrawal tests in that same increment.
Do not index this staged database merely because import is complete. If a CMS
collection is introduced then, add its migration, publication/locale access
gates and search lifecycle together. The [final content search sanity
check](search.md#final-content-search-sanity-check) remains pending.

See [verification](validation.md#publications-ingestion--2026-10-10).

## Consolidated update — 10 October 2026

The owner supplied `IRESEN_GEP_Recensement_Publications_Dashboard.xlsx` and
explicitly approved cleaning the selection and adopting the new retained
records. SHA-256:
`e339ce9a4af1d0c8eee9d3adfd253f6e3ee654eedb27dbb0317bc40ff79bf312`.
This original also remains outside the repository and public search.
Its internal approvals, directions and institutional attribution claims are
source material; none is imported as a new public fact or executable instruction.

All 1,383 source IDs match the initial corpus. The updated database selects the
1,199 literal `Retenue rapport 2011–2026 = 1` rows, as subsequently chosen by
the owner. It adds 22 previously excluded references and withdraws the four
2027 records, without changing any stable ID or conflating papers with similar
titles. The 184 other rows remain excluded. Fourteen retained rows are marked
editorially incomplete in the supplied consolidation: their IDs are kept only
in the maintenance metadata for final review, without importing private notes.
The retained selection and editorial completeness are distinct source fields.

The consolidated master supplies no changes to existing titles, years or DOIs.
The original workbook still supplies author names, source themes and document
types where these are not present in the new master. No name or theme is invented.
The journal/support title is now stored as optional `journal`.

The 623-row Scopus export is matched by stable master ID plus its declared EID
and canonical DOI. Six export rows lack a DOI and additionally require normalized
title agreement. Among the selected records, **619** citation snapshots are
refreshed to **10 October 2026**, including **15** increased counts. The export's
counts agree with the consolidated CSV-count column. Other citation counts retain
their actual earlier date of 8 October 2026. Zero and null remain distinct.
Author names agree with the original after numeric Scopus IDs are removed;
confirmed export document types do not change existing type values. Five
substantive Scopus title variants retain the original master title and are
identified for editorial review; their DOI/EID agreements establish the metric
match, not permission to replace a bibliographic title.

Rankings now retain their edition and evidence separately:

| Fields                                                      | Meaning                                                                                      |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `quartile`, `quartileYear`                                  | Best journal SJR quartile for the **2025** edition, not the publication year                 |
| `quartileEvidence`, `quartileSourceUrl`                     | Source-reported URL-backed ranking, inherited provisional ranking, unknown or not applicable |
| `historicalQuartile`, `historicalQuartileYear`              | Sourced ranking in the paper's publication year, only through 2025                           |
| `historicalQuartileEvidence`, `historicalQuartileSourceUrl` | Supplied primary SCImago or secondary historical evidence and its URL                        |

The update supplies **439** URL-backed 2025 rankings and **395** historical
rankings (16 supplied primary-source records and 379 supplied secondary-source
records). Sixty-two 2025 rankings remain inherited/provisional, explicitly
distinguished from the 439 newly sourced records. Fifteen existing papers acquire
a previously missing 2025 quartile; one newly selected paper also acquires one.
Historical values are never copied from SJR 2025. The 95 journal records from
2026 have no historical 2026 edition supplied and retain an unavailable status.
No external verification, live Scopus/SJR request or independent ranking audit
is claimed by this file-to-database reconciliation.

Current 2025 values: 436 Q1, 44 Q2, 21 Q3, 426 not applicable and 272 unknown.
Historical values: 335 Q1, 45 Q2, 14 Q3, 1 Q4, 426 not applicable, 283 unknown
and 95 with no 2026 edition available in the source. Current missing fields:
29 DOI links, 13 author strings, 187 themes and 161 Scopus counts. Their increase
reflects the newly admitted incomplete references, not erasure of existing data.

Regenerate or compare the updated database with **both** sources:

```sh
python3 scripts/import-publications.py /absolute/path/IRESEN_2026.xlsx \
  --supplement /absolute/path/IRESEN_GEP_Recensement_Publications_Dashboard.xlsx \
  --check
```

Omit `--check` to write the reviewed projection. Both source fingerprints and
selection changes are recorded in [import metadata](publications-import.json).
The importer rejects duplicate/mismatched identities, conflicting DOIs/EIDs,
inconsistent citation counts, unsupported ranking evidence and altered corpus
counts before writing. After a consolidated update, an original-only invocation
is rejected to prevent reverting the database to 1,181 records.

Future section work uses **these 1,199 records**, the **T4 2026** label and
honest metric/edition/evidence labels. The database remains staged, without a
public renderer, CMS collection, download or search entry. The original workbook,
raw Scopus export, abstracts, author IDs, funding/affiliation data, institutional
attribution and editorial notes remain excluded. No search rebuild is needed
for this update. Localized destinations, metadata and withdrawal handling are
required when the section is commissioned. See [update verification](publications-update-validation.md).
