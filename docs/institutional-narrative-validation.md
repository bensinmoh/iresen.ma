# Institutional narrative review — validation, 2026-10-14

The owner authorizes the global validation phase after the iterative review.
The existing `feat/institutional-narrative-2026` branch starts at `29cc603`.
All accumulated requested changes remain on that branch. **Merge still requires
an explicit owner GO.** No deployment, DNS or visibility change is authorized.

| Check                         | Current review evidence                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| Formatting and whitespace     | Full formatting check passed; final changed files rechecked before commit               |
| ESLint                        | Full lint passed; changed test/catalog inputs rechecked after corrections               |
| Unit tests                    | 25 files, 170 tests passed                                                              |
| Dependency audit              | `pnpm audit --prod`: no known vulnerabilities                                           |
| Production build / TypeScript | Passed in `.local/narrative-review-build`; no duplicate separate typecheck              |
| Production browser tests      | 56 passed, Chromium, FR/EN/AR, seven affected suites                                    |
| Search rebuild                | Completed locally; 8 eligible CMS records plus synchronized static catalog              |
| Documentation audit           | 86 documents reviewed; no missing links; historical keyword matches retained as history |
| Full integration/browser CI   | Required on the exact PR head; see PR checks before merge                               |

Production browser coverage includes Governance, Institute, Platforms, patents,
home innovation, home sections and cooperation/transfer. It covers responsive
widths down to 320px, 200% text, Arabic direction, native no-JavaScript reading,
keyboard/focus/biography dismissal, reduced motion, filter/contact journeys,
canonical anchors, search and the suites’ axe assertions. Production captures
of biographies and platforms were inspected. Safari, Firefox and screen-reader
certification were not performed.

The production review used a separate port 3100 and the same isolated build,
leaving the owner's development server on 3000 intact. Integration fixtures
were not run against the owner's populated database; full integration runs in
CI’s disposable PostgreSQL service. Local search rebuilding does not add fixtures.

Corrections discovered during validation:

- Register the six generated audience assets in the site-wide AI provenance
  inventory, retaining their search exclusion and the old served-asset references.
- Update the search count assertion to the owner-selected 30 granted patents.
- Update browser expectations for the removed body navigation, list-based chart,
  complete role labels, multi-paragraph bios and absent unsupported filter options.
- Await asynchronous dialog scroll-lock cleanup rather than racing React effects.
- Await measured stability of the enlarged document before testing its native
  anchor alignment; font loading/header measurements alone were insufficient.
  The strict target-alignment assertion remains unchanged.

No failing assertion was skipped and no production/public gate was weakened.
Temporary build/config/results remain local and outside the commit. Historical
notes saying tests were deferred describe the prior iteration phase; this ledger
records the later owner-authorized validation.
