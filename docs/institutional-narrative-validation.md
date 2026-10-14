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

## Owner-reported positioning overlap follow-up

After the first PR push, the owner supplied a scrolling overlap on Institute.
The title’s sticky containing block included the full-width ecosystem diagram.
The scoped CSS correction removes that sticky behaviour and adds a regression
for the three locales at four widths. Rebuild the isolated production artifact
and rerun the affected Institute suite; the other six suites’ evidence remains
valid. A new PR head must pass full CI; the earlier head cannot authorize merge.

The compact model now places introduction and semicircle side by side on desktop,
stacking at 64rem with mirrored Arabic columns. The new isolated production build
and all eight Institute browser tests pass, including the four-width overlap
regression in every locale. Production captures were inspected in French and Arabic.

## Initial CI feedback and corrections

CI run 38650714185 on `cdca114` passed formatting, lint, explicit TypeScript,
170 unit tests, integration, generated artifacts, dependency audit and production
build. Its browser suite reported 308 passes, 9 failures and 4 intentional skips;
those failures are addressed in the next revision:

- Six hero assertions still expected the old `+60` patent KPI. They now check the
  owner-confirmed 59 filed patents, distinct from the 30 granted catalog records.
- Two enlarged-text tests tried loading every FontFace, including metric fallback
  faces backed by unavailable Linux local fonts. Use natural font readiness and
  the retained measured-layout stability check instead.
- The French broad topic “Partenariats” has 19 matching sections. The contact form
  remains discoverable on page two. Its browser journey now follows real result
  pagination, preserving the query, result eligibility and relevance ordering.

Local production follow-up: all 31 hero/home-section tests pass; all three contact
search journeys and all eight Institute tests pass. No runtime search change or
fixture mutation was needed. Full exact-head CI remains the merge gate.
