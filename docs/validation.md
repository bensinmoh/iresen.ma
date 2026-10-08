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

## Hero layout and typography refinements — 2026-10-08

The owner refinements use a shared 120rem container, aligned fluid gutters,
−3% Latin hero H1 tracking, bold-only current-language links, centered header
menu contents and licensed self-hosted Plus Jakarta Sans for French/English.
The shared rule explicitly sets `max-inline-size` so Tailwind's layered
`.container` breakpoint maximum cannot silently narrow hero/section/footer content.

Final local checks passed `pnpm lint`, `pnpm typecheck`, `pnpm format:check`,
8 unit tests, 4 CMS integration tests, the production build and all 35 Chromium
browser tests. The final incremental build compiled without warnings. The browser
suite checks all 22 approved heroes in FR/EN/AR, landing geometry, section anchors,
viewport resizing, enlarged text, navigation/locale behavior, keyboard dismissal,
no-JavaScript access and existing axe checks.

An additional 30 production-rendered cases passed: FR/EN/AR at
320/390/768/1024/1120/1440/1920/2560px, plus 200% root text at 320/1440px with
open menu and language controls. Header, hero-body, narrative band, sections and
footer container bounds align within 1px, with no horizontal overflow or header/
title overlap. Default side offsets are 45px at 1440px and 60px at 1920px.
Menu labels and chevrons center within their controls; selected header/footer
languages use weight 700 with transparent backgrounds and no persistent underline.
Latin H1 tracking matches −3%; Arabic retains natural tracking and Tahoma/Arial.

Chromium's rendered-font inspection confirms Plus Jakarta Sans for FR/EN hero
titles, Découvrir, visible menu controls and newsletter buttons at each normal
width. The font request succeeds with HTTP 200 from the local application origin.
The variable WOFF2 decodes successfully, supports weights 200–800 and covers every
character in the current French/English catalogs. Source integrity, hashes and
the preserved OFL notice are recorded in [the font guide](fonts.md).

Inspected final full-page captures:

- [French, 1440px](screenshots/hero-refinement-fr-1440.png)
- [French, 1920px](screenshots/hero-refinement-fr-1920.png)
- [Arabic, 390px](screenshots/hero-refinement-ar-390.png)

These checks cover local Chromium rendering and the documented interactions.
Cross-browser/screen-reader review and the reviewed Arabic companion remain
separate work. Current PR CI and merge status are recorded by GitHub.

## Homepage figures and shared figure typography — 2026-10-08

The homepage band now shows the owner's five supplied values: 69, +60, +1000,
+1100 and +18, paired with corrected French labels and drafted English/Arabic
translations. The user message supplies the content; the attached Figma
screenshots supply the typography reference. Other pages retain their pathways,
and institute retains its 2011 founding figure.

Final local checks passed `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, 8 unit tests,
`pnpm build` and all 35 production Chromium browser tests. The build compiled
without warnings. Existing homepage axe checks pass in all three locales; hero
checks now verify the five values and the replacement of homepage pathway items.
CMS integration checks were not repeated for this UI/content change.

An additional 24 production-rendered cases passed: FR/EN/AR at
320/390/768/1120/1440/1920px, plus 200% root text at 320/1440px. Checks confirmed
no horizontal overflow or header/title overlap, all five values, unbroken signed
numbers, labels below their values, weight 600 values, weight 500 labels and
18px labels at default text size. Values reach 60px at 1440/1920px and use zero
tracking; Chromium serializes this as `normal`. Enlarged text adapts the column
count and grows the hero without clipping content. Narrow homepages may therefore
extend beyond one viewport.

Chromium's rendered-font inspection confirms the self-hosted Plus Jakarta Sans
for figure numerals in French, English and Arabic.

Inspected final full-page captures:

- [French, 1440px](screenshots/home-figures-fr-1440.png)
- [Arabic, 390px](screenshots/home-figures-ar-390.png)

The French view presents five aligned figures in one row; Arabic mobile presents
two columns followed by a full-width final item, in natural RTL reading order.
An independent source and screenshot review found no material issues with
semantic pairing, numeral isolation, typography or wrapping. These results cover
local Chromium rendering; broader browser and screen-reader review remain
separate work. The figure changes remain local and have not been pushed.

## Hovered-menu reference adaptation — 2026-10-08

These results describe the earlier uniform-panel revision. The later design-element
clarification and content-based formats below supersede its layout assumptions.

The desktop menu adapts the owner's attached screenshot into three equal white
columns with full-height dividers and a connected white active tab. Introduction
copy sits above a supporting figure; destinations form a single vertical list;
the plain related-destination column centers its content vertically. Existing
routes, localized draft copy and supplied figures remain the content sources.
See [the navigation decisions](navigation.md#hovered-menu-reference-adaptation--2026-10-08).

Local lint, strict types, 8 unit tests, the production build and all 35 Chromium
browser tests passed. The existing hover-dismissal test also verifies that the
pointer can move from the tab into both destination columns while the panel stays
open. Keyboard focus/dismissal, touch-compatible disclosures, no-JavaScript
access, compact navigation, localized destinations and existing axe checks pass.
CMS integration tests were not repeated for this presentation change.

An additional 48 production-rendered cases passed: all four groups in FR/EN/AR
at 1120/1440/1920px, plus 200% root text at 1440px. These check equal columns,
full-height separators, connected white tabs, the viewport scroll bound,
visible navy figures, intact signed numerals and no horizontal overflow. Each
destination title and description remains reachable through panel scrolling;
Escape restores trigger focus. At enlarged text size a complete link target can
be taller than the visible panel, while its individual text blocks remain
readable through scrolling.

Final mouse-hover captures, after the color transition settles:

- [French, 1920px](screenshots/hover-menu-fr-1920.png)
- [French, 1440px](screenshots/hover-menu-fr-1440.png)
- [Arabic, 1440px](screenshots/hover-menu-ar-1440.png)
- [English resources, 1120px](screenshots/hover-menu-resources-en-1120.png)

Rendered review confirms the reference composition, shared gutters, white-panel
contrast, natural RTL order and mirrored diagonal title arrows. Earlier menu
captures document their original revision. Independent source/screenshot review
found no material menu regressions. The existing English header label
“Experimentation” still wraps within the word at 1120px; this panel change does
not alter that header behavior. This verification covers local
Chromium rendering, not broad browser/screen-reader conformance or exact Figma
measurement. Changes are saved locally and have not been pushed.

## Reference fidelity review — 2026-10-08

This review used the earlier interpretation of the screenshots as composition
targets. The owner's later clarification below makes them design-element references.

Recorded the owner's direction in AGENTS.md, DESIGN.md, the design workflow and
shared specification: attached Figma screenshots define the visual target;
Taste/Impeccable support refinements within that direction. Read the repository
overrides and relevant preservation guidance; Impeccable's context loader ran
successfully for SiteHeader using the ignored local cache.

A bounded independent review of the retained menu/figure captures found no
unnecessary compositional or surface departure requiring a new UI edit. Existing
adaptations retain the approved palette, owner-supplied figures, current routes,
readable contrast, responsive content and Arabic behavior. No application source
changed and application/database/browser checks were not repeated. This review
does not establish pixel-exact Figma measurement. Documentation changes remain
local and have not been pushed.

Targeted Markdown formatting, added local links/heading anchors and
`git diff --check` passed.

## Content-based menu formats — 2026-10-08

The latest owner clarification treats screenshots as references for typography,
colors, white tabs/panels, dividers, arrows and spacing. Actual content determines
the layout. Institute and research use featured panels; expertise and resources
use compact introduction/link panels. Only research includes the existing
69-project figure. The universal minimum height and bottom-pushed statistics
were removed; optional content is omitted structurally. Existing routes, catalog
drafts and all homepage figures remain in place.

Local lint, strict types, 8 unit tests, the production build and all 35 Chromium
browser tests passed. The browser checks cover both featured and compact menus,
all destinations, hover continuity, keyboard dismissal/focus, no-JavaScript
navigation, compact headers, locale behavior and existing axe checks. CMS
integration checks were not repeated for this presentation change.

An additional 48 production-rendered cases passed: all four groups in FR/EN/AR
at 1120/1440/1920px, plus 200% root text at 1440px. Checks cover natural height,
the configured formats/optional content, connected white tabs, viewport containment,
row-major visual order matching destination DOM order, RTL mirroring, individually
reachable link text through scrolling and Escape focus restoration. Normal French
panels at 1440px measure approximately 279px (institute), 429px (research), 225px
(expertise) and 404px (resources); their height follows the actual content.

Independent layout/source assessment identified the uniform minimum height and
forced supporting content as the relevant structural problems. Impeccable's
scoped layout detector returned zero findings before and after the changes;
manual inspection confirmed the new formats resolve those problems while
retaining shared spacing tokens, logical properties and the native focus targets.

Final mouse-hover captures:

- [French institute](screenshots/menu-format-institute-fr-1440.png)
- [French research](screenshots/menu-format-research-fr-1440.png)
- [French expertise](screenshots/menu-format-expertise-fr-1440.png)
- [French resources](screenshots/menu-format-resources-fr-1440.png)
- [Arabic expertise](screenshots/menu-format-expertise-ar-1440.png)
- [English resources, 1120px](screenshots/menu-format-resources-en-1120.png)

Inspected all six captures; independent review found no material issues with
content grouping, alignment, typography, optional roles or Arabic presentation.
Repository formatting, added screenshot links and `git diff --check` also passed.

These checks cover local Chromium rendering and the documented behaviors;
broader browser/screen-reader conformance remains separate work. Earlier captures
and test records retain their original scope. Changes remain local and have not
been pushed.

## Institutional reference documents — 2026-10-08

The three owner-supplied DOCX files were read as source data and preserved under
`docs/references/strategy/`. Original upload/copy byte comparisons, recorded
sizes and SHA-256 values, and DOCX ZIP integrity were verified. See [the source
index and analysis](references/strategy/README.md).

The analysis distinguishes narrative direction, communications-support guidance,
unvalidated page/section recommendations and future editorial/CMS requirements.
An independent read-only review checked source fidelity, dates/version uncertainty,
approval boundaries and the chosen structure. No document instruction or claim
of a “validated menu” supersedes the owner's explicit clarification.

[ADR 0004](adr/0004-canonical-working-site-structure.md) chooses the existing
22 stable page IDs as the working baseline. Directly loading the central route
definition verified 22 distinct paths in each locale (66 localized URLs), valid
header/footer page references and the derived routing map. The canonical Markdown
table was compared with all 22 French code paths. Routing, header, footer and
language controls consume the shared definition; no application routes changed.

Modified/new Markdown local links and heading anchors, Prettier 3.9.9 formatting
(respecting the repository's `instruction.md` exclusion) and `git diff --check`
were checked. Formatting used a temporary isolated tool; application dependencies
and lockfiles were not changed. The application/database/browser suite was not
rerun locally for this documentation/reference-only increment. Any PR for this
increment must pass its current CI workflow before merge.

This review covers DOCX text, tables and visible headers/footers, not Word visual
pagination, independent institutional fact verification, formal content approval,
approved translations or production publication.
