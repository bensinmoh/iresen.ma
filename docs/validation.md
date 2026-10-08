# Foundation validation

Verified locally in the cloud workspace on 2026-10-07. Readiness checks for install, setup, migrations, generated CMS files, formatting, lint, types, unit/integration/browser tests and the standalone build passed again on 2026-10-08. The blank trilingual structure is ready for homepage implementation; no completed institutional homepage or dataset is claimed.

| Check                                                        | Result and evidence                                                                                                                                                                                        |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                             | Passed with the committed dependency lockfile                                                                                                                                                              |
| `pnpm setup:local`                                           | Passed; private environment configuration remains ignored by Git and existing configuration is preserved                                                                                                   |
| `pnpm setup:local --db-port`, `pnpm db:up`                   | Alternate local port verified on 2026-10-08: 28 disposable configuration cases, a separate Compose database, authenticated readiness and repeat migrations; original port-5432 service retained            |
| `pnpm db:wait`, `pnpm cms:migrate`                           | Authenticated PostgreSQL connection and migrations passed; repeat migration was idempotent                                                                                                                 |
| `pnpm cms:types`, `pnpm cms:importmap`                       | Passed; generated CMS types and import map have no committed-file drift                                                                                                                                    |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check`           | Passed                                                                                                                                                                                                     |
| `pnpm test`                                                  | 8 passed: complete UI catalogs, equivalent routes/anchors, unambiguous paths and CMS publication/access predicates                                                                                         |
| `pnpm test:integration`                                      | 4 passed against a disposable database: controlled bootstrap, account-role protection, draft/editor publication boundaries, private media metadata and French/Arabic publication eligibility               |
| `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:e2e` | 11 passed against the production server: all configured locale routes, RTL, equivalent-page switching, keyboard/Escape navigation, mobile Arabic reflow, anonymous CMS restrictions, 404s and non-indexing |
| `pnpm build`                                                 | Standalone production build passed                                                                                                                                                                         |
| Supplied brand assets                                        | Seven current SVG copies match their original bytes and recorded hashes; logo rendering checked in the browser. PDFs remain private.                                                                       |

Browser accessibility checks reported no axe violations on the empty shell in all three languages. Relevant test sources are [unit/access tests](../src/tests/cms-access.test.ts), [locale tests](../src/tests/i18n.test.ts), [database integration tests](../src/tests/cms.integration.test.ts) and [browser journeys](../tests/e2e/foundation.spec.ts).

## Limits

GitHub Actions passed the complete workflow in [PR #3 run 37703962430](https://github.com/bensinmoh/iresen.ma/actions/runs/37703962430) after browser installation was aligned with the project's test cache. Each new `main` revision is checked by its own remote CI run. Cloud verification does not establish the Mac checkout's readiness, and no production deployment or live-domain behavior is claimed.

Automated accessibility and the tested keyboard/mobile interactions do not establish full WCAG conformance. Complete manual screen-reader, broader browser, long-content and final visual reviews with the implemented homepage. Representative performance budgets and field metrics have not been measured on final content.

Search, contact delivery and CMS email are honest unavailable adapters. Production storage, identity/MFA, jobs, legal/privacy assessment, recovery and approved content/translations remain follow-up work. Missing design exports/fonts/imagery do not block this foundation. See the [backlog](backlog.md).

## Design workflow and UI refinement

Verified locally on 2026-10-08: lint, strict types, formatting, production build,
8 unit tests, 4 local CMS integration tests and all 18 existing browser tests passed.
The browser suite covers FR/EN/AR accessibility scans, navigation, RTL containment,
equivalent locale routes/anchors, keyboard focus, no-JavaScript use and CMS access.
An additional 21 rendered cases cover open navigation at 320/390/768/1024/1440px
and 200% root text enlargement at 320/1440px in all three locales. Every case fits
the viewport; reduced motion was verified. Final production captures were reviewed
for French desktop, Arabic mobile and English tablet. Other browsers and manual
screen-reader review remain outside this pass.

The repository skills passed frontmatter/YAML/JSON, relative-link, task-routing,
shell syntax and integrity checks: 66 pinned upstream blobs and 9 local additions
match recorded hashes. See [refinement details and screenshots](footer.md#design-workflow-refinement)
and [source manifest](design-skills-sources.json). The final incremental build compiled
without warnings; the initial cold build reported the known next-intl cache warning.

The owner's automatic completion instruction is recorded in AGENTS.md and
CONTRIBUTING.md. Each requested increment updates affected documentation and
[CHANGELOG.md](../CHANGELOG.md) before committing. Local passing checks do not
substitute for the current PR's CI; the corresponding GitHub check runs and merge
history provide the remote completion record.

## Native Figma reference analysis — 2026-10-08

The owner-uploaded Git LFS source was retrieved from revision `37b0689` and
verified at 164,268,977 bytes with SHA-256
`2ebebb5c633ad30094527c9ed2a5bc218b790b1f9f18fc761e191c5925b2838a`.
The tracked pointer and original payload were preserved unchanged.

Offline recovery consumed all 26,102,711 message bytes using 653 embedded
schema definitions, with zero trailing bytes. All 20,689 node IDs are unique;
all parent references and 1,247 instance masters resolve. Thirty Infinity
size constraints and six NaN spacing values are represented as JSON null, with
exact IEEE bits and paths retained privately. These are source sentinels, not
missing fields or zeros.

All 223 raster payloads opened successfully, matched their filename SHA-1 hashes
and resolved all 859 raster references. Eight asset contact sheets and selected
source screenshots were visually inspected. The embedded MP4 matches
`public/videos/hero.mp4` in size and SHA-256. Desktop/mobile homepage section
geometry was cross-checked with labeled private geometry maps; those maps are
not native Figma screenshots.

The committed [measured design language](design-system.md#native-design-language-analysis--2026-10-08)
and [evidence JSON](references/figma/design-evidence.json) were checked against
the raw graph and reviewed for source accuracy. JSON syntax, node IDs, measured
properties, aggregate counts, local links/anchors, pinned reader hashes,
documentation formatting and `git diff --check` passed. Added files contain
selected design properties and aggregates; raw text, plugin metadata, user data
and extracted media remain ignored. Runtime files and dependencies are unchanged.

Coverage includes 14 desktop pages, 13 full mobile pages, the design-system
board, foundation variables, typography, spacing, corners, component anatomy,
media crops and serialized prototype behavior. It does not establish native
rendered fidelity, effective nested inheritance, prototype execution, dedicated
RTL/tablet layouts, font/media licensing, approved institutional copy or production
accessibility. The application/database suite was not rerun locally for this
reference-only increment; its pull request is subject to the current CI workflow.

## Footer reference rework — 2026-10-08

The current footer uses the analyzed native frame `1584:6681` and the
owner-reattached Footer.png, preserving the requested newsletter form in its
unavailable state. Lint, strict types, formatting, 8 unit tests, 4 local CMS
integration tests, the production build and all 19 browser tests passed.
The browser suite covers newsletter availability, FR/EN/AR navigation/axe,
keyboard controls, no-JavaScript destination rendering and localized 404 status,
including dotted paths. The locale-wide streamed loading boundary was removed
to prevent deferred destination content remaining hidden without JavaScript.

All 21 rendered responsive/text-enlargement cases fit, with open language options.
French 1920/1440px, Arabic 390px and English 768px captures were visually inspected;
logo geometry, reduced motion and keyboard dismissal were verified. The final
incremental build compiled without warnings. Broader browser and screen-reader
coverage remains outside this pass. See [review captures and reference
limits](footer.md#reference-rework-verification--2026-10-08). Current PR CI and merge
are recorded by GitHub rather than inferred from these local results.

## Navigation reference adaptation — 2026-10-08

The current navigation adapts the owner's two header/menu screenshots while
retaining the approved hierarchy and supplied brand assets. Final local checks:

| Check                                                                                          | Result                                                                                            |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Lint, strict types and repository formatting                                                   | Passed                                                                                            |
| Unit and local CMS integration checks                                                          | 8 unit / 4 integration passed                                                                     |
| Production build                                                                               | Passed; final incremental build compiled without warnings                                         |
| Production Chromium browser suite                                                              | 28 passed, including 9 dedicated navigation tests                                                 |
| FR/EN/AR open-menu containment and text enlargement                                            | 21 combinations passed: 320/390/768/1024/1440px, plus 200% text at 320/1440px                     |
| Mouse, keyboard, hover Escape, outside dismissal, current states and breakpoint focus transfer | Passed; outside focus is preserved                                                                |
| Touch navigation                                                                               | Passed in a touch-enabled Chromium context from compact menu to governance                        |
| No-JavaScript navigation and equivalent locale destinations                                    | Passed in browser suite                                                                           |
| Reduced motion                                                                                 | Control transitions reduced to 0.01ms                                                             |
| Final screenshot review                                                                        | Inspected FR 1440/1920px, AR 320/390/1440px, EN 1440px, white interior header and resources panel |

The small-screen correction keeps language/search/menu on one row at normal
text size at 320px. The hover Escape and resize regressions were corrected and
verified in the final production build. Review artifacts are retained at
`docs/screenshots/navigation-fr-desktop.png`,
`docs/screenshots/navigation-fr-wide.png` and
`docs/screenshots/navigation-ar-mobile.png`.

Broader browser and manual screen-reader review remain outside this local
Chromium/axe pass; automated scans do not establish full WCAG conformance.
See [source limits and implementation choices](navigation.md). Current PR CI and
merge status are recorded by GitHub, separately from these local results.

## Introductory page heroes — 2026-10-08

Passed `pnpm lint`, `pnpm typecheck`, `pnpm test` (8 tests),
`pnpm test:integration` (4 tests), `pnpm build` and
`PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:e2e --workers=4`
(all 35 tests). The build reports the existing next-intl webpack cache warnings.
The seven additional browser checks cover every approved hero route in each
locale, background loading, initial 900px landing geometry, section anchors,
viewport resize, 200% text and no-JavaScript Arabic access. Existing navigation,
footer and automated accessibility checks remain passing.

Additional geometry checks passed for all 66 localized routes at 390 × 844,
with the complete landing visible and no header/title overlap or horizontal
overflow. Transfer, publications and opportunities also passed focused axe checks.

Rendered review inspected all five layouts at 1440 × 900, Arabic home/network at
390 × 844 and English home at 768 × 1024. These fit their measured viewport
without horizontal overflow. The existing browser suite also checks open menus,
RTL and enlarged text over the documented responsive widths. See
[hero screenshots and detailed limits](heroes.md#review-screenshots).

Checks do not establish cross-browser/screen-reader conformance or native Figma
pixel fidelity. Hero copy/translations are editorial drafts; extracted imagery
needs final individual rights/credit review before production publication. No
deployment was performed.
