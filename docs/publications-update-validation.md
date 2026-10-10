# Publications cross-check validation — 10 October 2026

Scope: the owner-approved selection of 1,199 retained publications from the new
consolidated workbook, preserving **T4 2026** and staged/private runtime status.
The original workbooks, raw export and internal evidence are not committed.

The standard-library importer matches all 1,383 original IDs, validates the
623-row Scopus export with EID/DOI or normalized title agreement, and applies
the exact 1,199 retained source IDs. Added/withdrawn IDs, field changes and
source fingerprints are logged in [import metadata](publications-import.json).
Original-only reimport is rejected to prevent accidental regression.

The deterministic two-source `--check` passes. Independent bundled openpyxl
extraction verifies all 1,199 selected IDs, unchanged titles/years, author
strings after numeric ID removal, source themes, journal names, citation
counts/dates, historical quartiles/years/URLs and sourced 2025 quartiles/URLs.
The two unit checks cover the field allowlist, null versus zero, edition/source
separation, all 22 added IDs, all four withdrawn IDs, no 2027 values and exclusion
from public search. The full local unit suite passes 126 tests; lint and
typecheck and production build pass. The build emits the existing next-intl
extractor cache-dependency warning, without a compilation failure. Scoped
formatting, local Markdown links and whitespace are checked before commit.

No public
renderer, CMS schema, locale catalogue, API, search entry or visual behavior
is introduced by this data-only change; local database/browser suites are not
required for this scope. Full PR CI remains a merge requirement. Unrelated
ongoing news/media changes in the shared checkout are preserved separately.
