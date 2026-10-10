# Foundation validation

## Homepage section labels — 2026-10-09

The owner's two attached crops identify inconsistent mission/domains labels.
The mission label now matches domains: 14px/400 uppercase text, a 12px-high
proportional Apex Leaf and a 12px gap at the default root size. Source text,
translations, section anchors and larger headings remain unchanged.

`pnpm lint`, `pnpm typecheck`, `pnpm test` (99 tests) and `pnpm build` passed.
An isolated production server on port 3001 and installed Chrome verified both
labels in FR/EN/AR at 390px and 1440px. Computed font size, weight, case, gap,
line height and both icon dimensions match between labels in all six views.
Captures were inspected for Latin capitalization, original leaf proportions,
blue/white treatment and Arabic RTL. Each view also passed page containment at
200% root text size. This CSS-only correction changes no interaction, schema or
publication state; no new implementation-mirroring test was added.

Search audit: the existing `home` page, `develop-test-transfer` section and
`apex-leaf` static-media references retain their stable destinations, types and
localized titles/descriptions. CSS casing preserves source text and introduces
no public content or media; no index rebuild or search vocabulary change is
required. The final-content search sanity check remains pending until the whole
site's content is supplied. No deployment, visibility or DNS changes were made.

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

## Homepage mission wording — 2026-10-09

The owner supplied exact French, English and Arabic statements, then explicitly
deferred design. The existing mission paragraph now contains that copy; no new
container, typography, cards or section ordering is delivered.

Verification:

- Formatting, lint, strict types, 97 unit tests and the production build passed.
- All 22 existing homepage/font browser cases passed against the final production
  build, covering direct anchors, responsive cards, keyboard/touch, no-JavaScript,
  enlarged text and reduced motion in FR/EN/AR.
- Paragraph containment was checked in all three locales at 320, 390, 768 and
  1440px, normally and with 200% root text. Desktop French and mobile Arabic
  renderings were inspected; the existing visual styles remain.
- The local public index was rebuilt. `expertises` (FR), `capabilities` (EN) and
  `حشد` (AR) returned the mission section at its stable canonical anchor.
- Browser resize checks initially measured mixed old/new viewport geometry.
  Instrumentation confirmed old 45px gutters and 30px gaps for one frame before
  the correct 20px/24px mobile layout. The existing suite now waits two layout
  frames after resizing; assertions and product behavior remain unchanged.

No publication, deployment, CMS schema changes or new media are included.
Statement design and the later homepage restructuring remain deferred.

## Limits

GitHub Actions passed the complete workflow in [PR #3 run 37703962430](https://github.com/bensinmoh/iresen.ma/actions/runs/37703962430) after browser installation was aligned with the project's test cache. Each new `main` revision is checked by its own remote CI run. Cloud verification does not establish the Mac checkout's readiness, and no production deployment or live-domain behavior is claimed.

Automated accessibility and the tested keyboard/mobile interactions do not establish full WCAG conformance. Complete manual screen-reader, broader browser, long-content and final visual reviews with the implemented homepage. Representative performance budgets and field metrics have not been measured on final content.

Search, contact delivery and CMS email are honest unavailable adapters. Production storage, identity/MFA, jobs, legal/privacy assessment, recovery and approved content/translations remain follow-up work. Missing design exports/fonts/imagery do not block this foundation. See the [backlog](backlog.md).

## Refined glass surfaces — 2026-10-09

The owner approved the isolated preview after review of the privately supplied
13.15-second recording. Shared glass tokens now apply to existing Menu/Search
controls and the homepage certification aside: 18px blur/115% saturation,
12–6% white gradient, 14% white outline, inset highlight and navy fallback.
Reference video/frames and the separate preview remain outside the repository.

Passed formatting, lint, strict types, all 97 unit cases and the production build.
All 41 existing navigation/header-search/hero browser cases passed in installed
Chrome against the production build on port 3100. The owner's port-3000 server
remained running. No schema/database behavior changed; local integration checks
were not rerun. Current PR CI runs the complete suite before merge.

Rendered FR/EN/AR at 390, 768, 1024 and 1440px and checked the normal white
French contact header. Controls and the certification aside retain stable bounds;
there is no page-width overflow. The clipped reflection is pointer-transparent,
has one iteration, is inactive after 1100ms and is absent under reduced motion.
Keyboard focus starts the pass on resting controls; open controls hide it. Search
keeps its immediate white hover reveal. The certification aside remains outside
the tab order. Mobile hides the header reflection and retains its direct control.
Open menus preserve the white tab, sharp selected bottom-right and exact tab/panel
vertical join at 768/1024px, including Arabic's unclipped bridge. Escape restores
trigger focus; the Arabic native compact menu also works without JavaScript.
Existing suites additionally cover touch, accessible names, axe scans, enlarged
text, responsive heroes and native search submission.

Six background samples from the reviewed French header/certification captures
give white-text contrast from 5.59:1 to 12.47:1. These are individual rendered
samples, not a guarantee for every moving-video frame or browser.

Reviewed captures:

- [Resting French header with keyboard focus](screenshots/refined-glass-header-fr-1024.webp)
- [French open menu](screenshots/refined-glass-open-fr-1024.webp)
- [Arabic open menu](screenshots/refined-glass-open-ar-1024.webp)
- [French glass certification detail](screenshots/refined-glass-certification-fr-1440.webp)
- [Arabic glass certification detail](screenshots/refined-glass-certification-ar-1440.webp)
- [French hero with reflection](screenshots/refined-glass-hero-fr-1440.webp)

Public labels, approved imagery, URLs, anchors and searchable bodies are unchanged,
so current localized search projections remain sufficient. There is no new public
resource to register. Unsupported-blur fallback was source-reviewed; this pass
does not claim older-browser, Safari, physical-device, manual screen-reader,
all-video-frame contrast or field-performance coverage. No deployment was performed.

## Glass header controls and joined menu — 2026-10-09

Passed lint, strict types, all 97 unit tests and the final production build.
All 26 existing navigation/header-search browser cases passed on the final build
using installed Chrome through Playwright against port 3100. The owner's
port-3000 development server remained running. No build warnings were reported.

Rendered FR/EN/AR at 390, 768, 1024 and 1440px, plus the normal white contact
header. Verified the resting glass tint/blur, immediate white/navy selection,
sharp selected-tab bottom-right, physical 20px dropdown corners and exact vertical
join: at 768/1024px the dropdown starts at y=64px, equal to the tab's bottom edge.
Arabic's bridge closes the shared top-left curve. Panel content fits without
horizontal scrolling. The animation replays on reopening and is absent with
reduced motion. French and Arabic native menus also open, close and reopen without
JavaScript with the 220ms drop animation. Existing tests cover keyboard focus,
Escape, touch, native search, RTL, mobile focus containment and 200% text reflow.

The selected surface switches immediately, avoiding a navy-on-translucent interval
before the white tab is established. Four sampled background points on the French
768px capture give white-text contrast from 11.47:1 to 13.17:1; these samples do
not establish all-video-frame or all-browser contrast/performance coverage.
The unsupported-blur navy fallback was source-reviewed, not executed in an older
browser. No Safari, physical-device or manual screen-reader assessment was performed.

Reviewed captures:

- [Resting glass controls](screenshots/glass-header-fr-1024.webp)
- [French selected tab and rounded dropdown](screenshots/glass-menu-open-fr-1024.webp)
- [Arabic joined tab/dropdown](screenshots/glass-menu-open-ar-1024.webp)

Public text, routes, anchors and search references remain unchanged. No CMS/schema
logic changed; local integration tests were not rerun. PR CI runs the complete
integration/browser suites. No deployment was performed. The earlier compact-menu
capture and checks below describe the previous white resting treatment.

The initial full PR CI run passed 150 browser cases and failed the French
`direct home section and mission links` case: after a desktop-to-mobile resize
and same-document hash navigation, the `mission-transfer` heading can land above
the viewport. Reproduction on this increment passed 8/9 FR/EN/AR repetitions;
comparison on unchanged main (`ebd91d9`) failed 6/10 French repetitions. This is
an existing intermittent anchor issue, not a regression from the header controls.
Its assertions and homepage runtime remain unchanged in this increment; see
[the follow-up backlog](backlog.md). One unchanged CI retry passed application
checks but remained in Chromium installation for more than ten minutes when these
notes were recorded. Only the current PR revision's successful complete CI may
authorize merge; earlier partial results and baseline comparison do not replace it.

## Compact menu control — 2026-10-09

Passed lint, strict types, all 97 unit tests and the production build. The build
reported the previously documented next-intl webpack cache-analysis warnings.
All 26 existing navigation and header-search browser cases passed against a
separate production server on port 3100 using installed Chrome via Playwright;
the owner's port-3000 development server remained running.

Rendered FR/EN/AR at 320, 390, 768, 1024 and 1440px. The compact trigger at
768/1024px has a measured 48px height, white surface, navy text and physical
10px/0/10px/0 corners in every locale. Reviewed inverse/white headers, closed
and open menus, hover, keyboard opening, Escape and restored focus. Existing
browser coverage also passed touch, no-JavaScript, reduced-motion, desktop
navigation, mobile focus containment and 200% text reflow in all locales.

Reviewed captures: [French compact header](screenshots/menu-control-fr-1024.webp)
and [Arabic mobile header](screenshots/menu-control-ar-390.webp).
No public content, route, asset destination or search metadata changed; existing
public page/section references remain. No CMS/database logic changed, so local
integration tests were not rerun; PR CI runs the complete suite. This Chrome
review does not establish Safari, physical-device or screen-reader coverage.
No deployment was performed.

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

## Homepage restructuring documentation — 2026-10-09

Compared the supplied `Pasted text.txt` with the current homepage renderer,
shared section map, canonical page definitions, product/design guidance and
earlier P01 recommendations. Recorded its 5,752-byte size and SHA-256 in
[the new brief](homepage-restructure.md). The six-section target, supplied mission
and collaboration wording, composition counts, named candidates and event fallback
remain planning evidence, not implemented modules or independently verified claims.

Passed focused checks for all eleven changed/new Markdown files: pinned Prettier
3.9.9 formatting, Git whitespace, added/new local links and document anchors,
exact supplied mission wording and candidate names, six planned sections,
referenced current page/section IDs and unchanged strategy-source SHA-256 hashes.
Integrated the separate mission increment from `main` and reconciled documentary
conflicts: the current mission cards, five later body placeholders, real hero
`figures` anchor and section navigation remain unchanged by this increment.
No YAML frontmatter or routing definition is introduced. Application,
database, browser and Figma checks are not rerun locally because their inputs
are unchanged. Rendered behavior, content approval and future event automation
are outside this increment. Current PR CI and merge evidence belong to the PR.

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

## Centered hero scroll cue — 2026-10-08

Replaced the visible continuation text/arrow with a centered native scroll-wheel
link above the hero band. The existing translated accessible name remains; the
graphic is decorative. Reducing the lower reserve from 80–128px to 72px brings
the homepage CTA 18px closer to the figures at the checked 1440 × 900px desktop
size, with 16px between the actions and the 44px link target.

Lint, strict types, all 8 unit tests, the production build, formatting and all
36 Chromium browser tests passed. The added browser check covers FR/EN/AR,
desktop/mobile centering, target size, action/band separation, keyboard focus
and activation, and reduced motion. The no-JavaScript Arabic check now activates
the scroll cue. CMS integration checks were not repeated for this presentation
change.

An additional 144 production-rendered cases passed: all five hero compositions
plus the institute hero in FR/EN/AR at 320/390/768/1120/1440/1920px, and 200%
root text at 320/1440px after the existing resize observer settles. Checks cover
centering, target size, copy/header clearance, band separation, the shared bottom
reserve and absence of horizontal overflow.

Animation-frame inspection confirmed downward wheel motion and fading with
stable outline geometry. Three 1.6-second cycles finish within 4.8 seconds, then
restore the visible static wheel. Reduced-motion mode produces no animations.
Impeccable's scoped layout detector returned zero findings; independent source
review found no material motion, semantics or layout issues.

Final captures:

- [French desktop](screenshots/hero-scroll-fr-1440.png)
- [Arabic mobile, reduced motion](screenshots/hero-scroll-ar-390.png)

Both captures were inspected for placement, contrast, spacing and RTL. Checks
cover local Chromium; broader browser and screen-reader conformance remains
separate work. Changes remain local and have not been pushed.

## Public fonts and Alexandria — 2026-10-08

The owner requested Plus Jakarta Sans throughout the public site and identified
Alexandria as the Arabic family. The initial production audit confirmed that
French/English text already rendered Jakarta, while the document root retained
a system stack and the Arabic body override also forced system fonts for Latin
words. The new shared stack uses the Unicode-restricted Alexandria face for
Arabic and Jakarta for Latin in every locale. Document defaults, Tailwind sans
utilities, native controls and the decorative ResearchGate text mark now share
that policy. CMS/admin retains its separate layout.

Alexandria's pinned archive SHA-512, binary/license SHA-256 values, byte identity,
source metadata, normal variable weight axis and original OFL notice were
verified independently. The 31,348-byte Arabic subset covers every Arabic-script
character in the current catalog; together with Jakarta it covers all 74 unique
Arabic catalog characters. The loader preserves the upstream Unicode range.
See [font provenance and loading](fonts.md).

Lint, strict types, all 8 unit tests, the production build, formatting and all
39 Chromium browser tests passed. Three new regression tests inspect actual
rendered font names through Chrome's font API, covering hero copy/actions,
figures, header and compact controls, every desktop menu, footer text and
newsletter controls in FR/EN/AR. They also check Arabic language labels on Latin
pages and Latin names/numerals on Arabic pages. CMS integration checks were not
repeated for this typography change.

An independent production audit passed 104 actual-font samples, including Arabic
without JavaScript and the used 400/500/600/700 weights. Arabic glyphs rendered in
custom Alexandria; Latin glyphs and figures rendered in custom Plus Jakarta Sans.
Both local WOFF2 requests returned HTTP 200 with no failed or third-party font
requests. No system-font fallback appeared in the sampled rendered text.

Additional rendering checks passed 144 hero cases across all five compositions
plus institute in FR/EN/AR at 320/390/768/1120/1440/1920px and 200% root text at
320/1440px. After font loading and resize-observer updates, text/cue/header
clearance, band separation, centering and horizontal containment remained sound.
All 66 localized routes were checked for visible headings and containment, plus
36 desktop menu cases across all groups/locales at 1120/1440/1920px.
Impeccable's scoped type/layout detector returned zero findings.

Final captures:

- [Arabic desktop hero](screenshots/fonts-alexandria-ar-1440.png)
- [Arabic mobile hero](screenshots/fonts-alexandria-ar-390.png)
- [Arabic hovered research menu](screenshots/fonts-alexandria-menu-ar-1440.png)

All three were inspected; independent review confirmed shaping, diacritics,
hierarchy, CTA/figure spacing, mixed-script numerals and RTL arrows. Documentation
formatting, local links and diff whitespace were checked. This records local
Chromium coverage; broader browser/screen-reader verification remains separate.
Changes remain local and have not been pushed.

## Homepage certification badge — 2026-10-08

Added the owner's explicitly requested ISO 9001:2015 certification badge to the
homepage hero. Its French claim comes from the supplied screenshots; English and
Arabic are draft equivalents. This records supplied content, without independent
verification of certification status or the first-in-Africa claim. Other
historical screenshot copy, routes and statistics were not imported.

The badge uses a translucent neutral tint with actual 16px backdrop blur and a
darker fallback tint for browsers without that filter. The existing physical
20px top-left/bottom-right rounding remains unchanged in RTL; top-right and
bottom-left corners are sharp. The desktop grid bottom-aligns the badge beside
the copy; smaller screens place it between the description and actions, preserving
the action area's 72px clearance above the figures. Text stays native and the
standard is LTR isolated. No new client dependency or image asset was added.

Lint, strict types, all 8 unit tests, the production build and all 39 Chromium
browser tests passed. Existing all-page hero checks now verify the certification
is visible on home and absent on other pages, while retaining the five requested
figures and section navigation. CMS integration checks were not repeated for this
presentation change.

An additional 27 homepage cases passed: FR/EN/AR at
320/390/768/1024/1120/1440/1920px plus 200% root text at 320/1440px. Checks covered
badge/text containment, desktop alignment, compact wrapping, physical corners,
LTR standard isolation, real blur/translucency, title/header clearance, cue
separation and unchanged action-to-band spacing. The Arabic badge also remained
visible without JavaScript.

Independent source analysis calculated a minimum 4.70:1 white-text contrast over
the brightest possible homepage photo after its existing shade, and 10.34:1 for
the fallback tint even over unshaded white. Text-free production backdrop samples
at 1440px measured minimum contrast of 8.94:1 in FR/EN and 8.81:1 in AR across the
interior text area. These sampled values cover the current image and layout;
the supported filter rendered in local Chromium. Unsupported-browser rendering
was not independently exercised. Impeccable's scoped type/layout detector
returned zero findings.

Final captures:

- [French desktop](screenshots/hero-certification-fr-1440.png)
- [Arabic mobile](screenshots/hero-certification-ar-390.png)
- [English narrow layout](screenshots/hero-certification-en-320.png)

All three captures were inspected, with independent review confirming wrapping,
alignment, corners, mixed-script text and action/cue clearance. Documentation
formatting, local links and diff whitespace were checked. Changes remain local
and have not been pushed.

## Header search and contact controls — 2026-10-08

Lint, strict types, formatting, all 8 unit tests, the production build and all
39 Chromium browser tests passed. This styling change did not repeat CMS
integration checks. The existing browser suite verifies rendered Jakarta and
Alexandria fonts, navigation, keyboard use, RTL and automated accessibility.

An additional 54 rendered cases passed: FR/EN/AR on photo and white headers at
320/390/768/1024/1120/1440/1920px, plus 200% root text at 320/1440px. Checks covered
square search dimensions, centered icon, physical signature corners, contact
height/padding, colors, containment and compact visibility. Native Enter
navigation and visible focus for both controls, and the search hover tint,
were checked in each locale. The white header was exercised on a localized 404.

Calculated contrast is 3.69:1 for the gray outline against white, 12.62:1 for
the navy search icon and 5.45:1 for white contact text on primary blue. Scoped
Impeccable type/layout analysis returned zero findings. These checks do not
establish broader browser coverage or manual screen-reader conformance.

Final captures were inspected by two reviewers:

- [French photo header](screenshots/header-controls-fr-hero-1440.png)
- [French white header](screenshots/header-controls-fr-light-1440.png)
- [Arabic desktop](screenshots/header-controls-ar-hero-1440.png)
- [Arabic mobile](screenshots/header-controls-ar-hero-390.png)

An early white-header capture was replaced after rendering settled; the final
contact label is visible and CDP confirms its actual custom Plus Jakarta Sans
glyphs. Documentation formatting, local links and diff whitespace were checked.
Changes remain local and have not been pushed.

## Header control proportions and contact label — 2026-10-08

Lint, strict types, formatting, all 8 unit tests, the production build and all
12 existing navigation/font Chromium tests passed. No new tests were added for
this small visual/copy change; the wider local browser and CMS integration suites
were not repeated. GitHub CI runs the full existing workflow before merge.

An additional 54 rendered cases passed: FR/EN/AR on photo and white headers at
320/390/768/1024/1120/1440/1920px, plus 200% root text at 320/1440px. Checks covered
the new physical 10px top-left/bottom-right header corners (20px when text is
enlarged), square search dimensions, icon centering, colors, containment,
contact size/padding/weight and complete localized labels. Other components keep
their existing signature radius. White-header checks use a localized 404.

Enter navigation and visible focus passed for both controls in each locale.
The contact page's current-page state, page title and compact-menu label remain
correct. The French header reads « Contactez-nous »; English and Arabic retain
their wording. Existing font tests verify actual Jakarta/Alexandria glyph rendering.

Reviewed captures:

- [French button detail at device scale 2](screenshots/header-buttons-refined-fr-detail.png)
- [French white header](screenshots/header-buttons-refined-fr-white-1440.png)
- [Arabic photo header](screenshots/header-buttons-refined-ar-hero-1440.png)
- [Arabic mobile header](screenshots/header-buttons-refined-ar-hero-390.png)

Documentation formatting, local links and diff whitespace were checked. Earlier
20px header captures retain their historical scope. These checks do not establish
other-browser or manual screen-reader coverage; the tighter radius is a proportional
adaptation toward the supplied reference, not an exact screenshot measurement.

## Footer type and newsletter refinement — 2026-10-08

Lint, strict types, formatting, all 8 unit tests, the production build and all
39 Chromium browser tests passed. Existing newsletter coverage now verifies
initially hidden feedback, editable email/consent, visible checked state,
keyboard opening/closing, focus, malformed-email attempts, privacy access and
no navigation or data submission. The no-JavaScript footer test exercises an
actual subscription attempt in FR/EN/AR. CMS integration checks were not repeated
for this presentation and native interaction change.

An additional 27 footer cases (54 collapsed/expanded views) passed: FR/EN/AR
at 320/390/768/1024/1120/1440/1920px and 200% root text at 320/1440px. Checks covered
containment, feedback visibility, control sizes, checked state, type weights,
Latin/Arabic tracking and physical corners. The wide field measures 600 × 80px
with a 60px Subscribe control. The French footer has a natural height of about
884px at 1920px; the source's 798px height is not imposed on current content.

Existing font tests confirm actual custom Jakarta/Alexandria glyph rendering in
all three locales, including footer links, copy, email and Subscribe. Calculated
contrast is 7.47:1 for muted footer text, 6.45:1 for contact values, 6.47:1 for the
email placeholder, 10.93:1 for entered email and 5.45:1 for Subscribe text.
Scoped Impeccable type/layout analysis returned zero findings. These checks do not
establish full accessibility conformance, manual screen-reader results or other
browser coverage; the older-browser stacked layout was source-reviewed.

Final captures:

- [French desktop](screenshots/footer-refined-fr-1920.png)
- [French at 1440px](screenshots/footer-refined-fr-1440.png)
- [Feedback after an attempt](screenshots/footer-refined-fr-1920-feedback.png)
- [Arabic desktop](screenshots/footer-refined-ar-1440.png)
- [Arabic mobile](screenshots/footer-refined-ar-390.png)
- [English tablet](screenshots/footer-refined-en-768.png)

Two reviewers inspected the typography, spacing, controls and RTL layouts.
Default captures use neutral focus. Chromium's tall element capture also painted
the unfocused skip link from above the viewport; its negative viewport bounds
were verified, and it was excluded from the two affected captures with temporary
screenshot styling. The application's skip-link behavior was unchanged.
Documentation formatting, local links and diff
whitespace were checked. Changes remain local and have not been pushed.

## Footer identity copy — 2026-10-08

The French tagline and paragraph were compared literally with the owner's
request. Only the below-logo text, its local emphasis/gap and the complete
FR/EN/AR catalogs changed at runtime. English and Arabic equivalents remain drafts.

Lint, strict types, formatting, all 8 unit tests, the production build and all
11 existing footer/font browser tests passed. The latter confirm actual custom
font rendering, footer destinations, newsletter attempts, RTL and no-JavaScript
use. No new tests were added for this copy change; the wider browser and CMS
integration suites were not repeated.

An additional 12 identity-block cases passed: FR/EN/AR at 320/390/1440px, plus
200% root text at 320px. Checks covered exact catalog text, two paragraphs,
white 700-weight emphasis and text/viewport containment. The local type/layout
detector returned zero findings. These checks do not establish other-browser or
manual screen-reader coverage.

The [French desktop identity](screenshots/footer-identity-fr-1440.png) and
[Arabic mobile identity](screenshots/footer-identity-ar-390.png) captures were
inspected. As in the preceding capture pass, temporary screenshot styling excluded
the offscreen skip link without changing application behavior. Documentation
formatting, local links and diff whitespace were checked. Changes remain local
and have not been pushed.

## Apex Leaf browser icon — 2026-10-08

Lint, strict types and the production build passed. Chromium verified one active
SVG icon link with `sizes="any"` on the French, English and Arabic home pages.
The selected URL returned HTTP 200 with the SVG content type and the original
Apex Leaf's SHA-256. All seven supplied brand SVG hashes remain unchanged.

At proportional square viewports of 16/32/64px, the tightly framed leaf occupies
the full icon height. Its nontransparent raster bounds are respectively
10 × 16, 20 × 32 and 40 × 64px, compared with 6 × 10, 12 × 18 and 24 × 36px
for the retained padded favicon. The vector geometry is about 77% larger in
each dimension; antialiasing rounds the occupied pixel bounds at small sizes.
Proportions remain intact, with transparent space beside the tall leaf when
fitted into a square browser slot.

The [16/32/64px comparison](screenshots/favicon-apex-comparison.png) was inspected.
This is a targeted metadata/asset check; unit, broader browser and CMS integration
suites were not repeated, and other browsers or an operating-system tab strip
were not manually reviewed. Documentation formatting, local links and diff
whitespace were checked. Changes remain local and have not been pushed.

## Completed design batch before push — 2026-10-08

The final built application passed all 8 unit tests and all 39 Chromium browser
tests after the footer copy and favicon changes. These include actual custom-font
rendering, all localized route heroes, responsive/enlarged-text layouts, keyboard
and no-JavaScript menus, newsletter attempts, automated homepage accessibility,
locale switching and anonymous CMS restrictions. Earlier lint, strict types,
production build and focused visual/asset checks apply to the same runtime source.

The branch incorporates the newer live-Figma guidance from `main`, retaining
both its source evidence and the owner's latest implemented choices. Current
font guidance names installed Alexandria and Jakarta; source-era observations
remain historical. Documentation formatting, local links, pinned skill/brand
hashes and diff whitespace were checked after reconciliation. GitHub CI and merge
results are recorded by the batch's pull request; production deployment remains
a separate action.

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

## Live design-system guidance — 2026-10-08

Read the owner's Figma page `2211:6298` through live metadata, design context and
Plugin API inspection. Native screenshots were reviewed for typography, spacing
and colors; node properties established selected grid, corner, component and
control-state measurements. The original color-book attachment's SHA-256 matches
the existing source record. See [the scoped evidence and limits](figma-design-system-review.md).

Documentation checks passed: affected-file Prettier 3.9.9 formatting (retaining
the `instruction.md` exclusion), relative Markdown links and anchors, the two
updated skills' YAML frontmatter/routing, all 66 pinned vendor hashes and nine
local-addition hashes, plus `git diff --check`. Updated wrapper hashes are recorded
in `design-skills-sources.json`; vendored sources were unchanged.

No runtime source, dependencies, lockfiles, assets or Figma nodes were changed.
The application/database/browser suite was not rerun locally for this guidance
increment; current PR CI remains required before merge. This review does not
establish native full-page fidelity, prototype execution or new translated
website rendering. Prior implementation checks remain separately dated above.

## Site coherence review — 2026-10-09

The public-site pass used the current shared rules and the live design-system
evidence, retaining approved content, colors, fonts, assets and routes. See
[the findings and implemented choices](site-coherence-review.md).

Local checks passed: lint, strict types, production build, all 8 unit tests and
all 42 Chromium browser tests against the final rebuilt application. Three new
regression tests cover actual menu/newsletter content containment at 320px with
200% text and wide-header keyboard order. Existing tests also cover rendered
custom fonts, all localized heroes, responsive/RTL behavior, keyboard and
no-JavaScript navigation, newsletter availability, locale switching, automated
accessibility and anonymous CMS restrictions. The local CMS integration suite was
not repeated for these public JSX/CSS changes; the PR workflow runs it separately.

The before/after route audit covers 22 page IDs in FR/EN/AR at 1440 × 1000 and
390 × 844, or 132 renders per revision. All returned 200 with one H1, valid visible
fragment targets, aligned shared containers and no horizontal overflow or thrown
page errors. Both full 22-page French desktop and Arabic mobile overview sheets
were inspected, alongside detailed views of all five hero modes, content families
and the selective Apex placements. The final current-Contact decoration correction
was followed by focused FR/EN/AR rest, hover and keyboard-focus checks and a fresh
complete 42-test browser pass; ordinary current navigation links retain their
underline.

The shared shell passed 24 cases: FR/EN/AR at 320, 390, 768, 1024, 1440 and
1920px, plus 200% text at 320/1440px. Open menu panels/summaries and Subscribe
labels/arrows fit their controls, with unchanged header geometry and readable
focus. Six genuine localized 404 desktop/mobile cases returned 404 without
overflow. Six translated error visual specimens verified spacing and containment
with actual public CSS/fonts; they do not exercise a runtime fault or reset.

All seven original SVG SHA-256 values remain unchanged. The scoped Impeccable
type/layout detector returned zero findings; browser measurements exposed the
overflow defects that it missed. Formatting, local documentation links/anchors
and diff whitespace were checked. Remote CI and merge results belong to this
revision's PR.

Selected reviewed captures:

- [French homepage hero](screenshots/coherence-home-fr-1440.png)
- [Arabic mobile hero](screenshots/coherence-home-ar-390.png)
- [Selective Mission marker in Arabic](screenshots/coherence-institute-ar-390.png)
- [French sitemap groups](screenshots/coherence-sitemap-fr-1440.png)
- [Compact menu at 200% text](screenshots/coherence-menu-fr-320-200.png)
- [Newsletter at 200% text](screenshots/coherence-newsletter-fr-320-200.png)
- [Actual French mobile 404](screenshots/coherence-404-fr-390.png)
- [Arabic error visual specimen](screenshots/coherence-error-specimen-ar-390.png)

Coverage is Chromium and the existing sparse public foundation. It does not
establish cross-browser or screen-reader conformance, populated editorial/CMS
page-body quality, native Figma pixel fidelity, institutional content approval
or production deployment.

## Page section placeholders — 2026-10-09

The requested scaffold covers all 22 canonical page IDs with 116 localized
headings and short content briefs, including the Institute's nested Mission
topics and the search absence-of-results topic. The existing heroes introduce
the pages; the received section recommendations supply the remaining order.
See [the section source map](page-sections.md).

Passed locally with Node 24.19.0, pnpm 11.19.0, migrated disposable PostgreSQL
17.9 and the production standalone application:

- `pnpm lint`, `pnpm typecheck`, `pnpm format:check` and `git diff --check`.
- `pnpm test`: 8 tests passed, including complete FR/EN/AR catalog parity.
- `pnpm build`: passed; webpack repeated the existing next-intl dynamic-import
  cache-analysis warning without a build failure.
- `CI=1 PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:e2e`: all 44 tests
  passed, covering public routes, locale fragments, no-JavaScript navigation,
  responsive/RTL shell behavior, fonts, truthful service states, automated
  accessibility and anonymous CMS restrictions.
- Direct section-map checks verified all 116 titles/briefs and supported section
  and child fragments in all three locales. The source-table review verified
  the principal-page heading sequences and the utility adaptation. Changed
  Markdown local-file links resolve.

The independent section audit checked all 66 localized pages: French at 1440px,
English at 768px and Arabic at 390px. All returned 200 with one H1, matching
ordered headings and briefs, unique element IDs, valid fragment targets and no
viewport overflow. All 22 sitemap destinations remained present in each locale.
Fifty-one section scroll targets and six actual language-switch transitions
verified the new and nested anchors.

Home, Institute and sitemap were checked in FR/EN/AR at 320, 390, 768, 1024 and
1440px, with normal and 200% root text: 90 layout conditions in addition to the
66 route views. Initial enlarged-text review exposed long sitemap H3s and a
preexisting compact-header overflow at tablet width. Long-heading wrapping and
shrinkable/wrapping compact actions resolved all 13 affected conditions; the
final targeted audit and the complete combined-site browser suite passed without
console or page errors. Source checks and the production build were repeated
after incorporating the concurrent hero-imagery update.

Reviewed section-area captures:

- [French homepage at 1440px](screenshots/page-sections-home-fr-1440.png).
- [Arabic Institute at 390px](screenshots/page-sections-institute-ar-390.png).
- [English sitemap at 768px](screenshots/page-sections-sitemap-en-768.png).

These checks cover Chromium, the requested placeholders and their shared shell.
They do not establish final editorial or translation approval, populated CMS
module quality, cross-browser/screen-reader conformance or production release.

The local CMS integration suite was not repeated for these public rendering,
catalog and anchor changes; the PR workflow runs it separately. The CMS schema
and collections are unchanged. Remote checks and merge status belong to the PR.

## Generated hero placeholders — 2026-10-09

Replaced the 17 previous backgrounds across all 22 page introductions with the
owner-requested generated photographic placeholders. The shared layouts, copy,
figures, fonts, routes and original SVGs are unchanged. The
[current manifest](hero-assets.json) records native dimensions, generation
provenance, source/output SHA-256 values and exact crop rectangles; the
[former Figma manifest](hero-assets-figma-2026-10-08.json) is retained as history.

Local checks passed: formatting, lint, strict types, 8 unit tests, 4 CMS integration
tests, the standalone production build and all 44 Chromium browser tests. Two new
[image-delivery regressions](../tests/e2e/hero-images.spec.ts) inspect actual response
pixels and requests in fresh DPR-2 contexts for FR home/priorities and AR
priorities, checking native-height mobile delivery, desktop quality 90 and one
selected image request. Existing tests retain all 66 localized hero routes,
fonts, responsive/RTL, enlarged text, navigation, no-JavaScript behavior and
accessibility coverage.

The production delivery audit made 95 observations: 69 matching baseline cases,
16 breakpoint cases, four enlarged-text cases and six English cases. Coverage
includes every French page at 1920 × 1080 and 390 × 844/DPR 2, all five layouts
at 1440 × 1000/DPR 1 and 2, representative 390px/DPR 1 and Arabic views,
640/641px and 1119/1120px transitions, and 320 × 568 with 200% text. No navigation,
image, source-selection or horizontal-overflow failures occurred. Every navigation
requested exactly one hero; direct mobile responses matched their portrait file
hashes, and wide optimized responses used quality 90 without exceeding native
dimensions. All 34 WebP hashes, dimensions, filename hashes and byte counts match
the manifest. Former image URLs are no longer referenced by runtime code.

The 17 landscape files total 4,429,414 bytes, and the 17 mobile crops total
2,001,688 bytes. A page requests one selected variant. Actual mobile image bodies
range from 57,330 to 216,272 bytes, all below the approximately 250KB hero budget.
The former width-only image sizing visibly undersampled tall mobile cover areas;
native-height portrait delivery now preserves the available detail. Representative
FR measurements at 390 × 844/DPR 2 are:

| Page       | Former delivered height | New delivered height | Former pixels per CSS pixel | New pixels per CSS pixel |
| ---------- | ----------------------: | -------------------: | --------------------------: | -----------------------: |
| Home       |                   399px |                941px |                       0.559 |                    1.318 |
| Priorities |                   251px |               1024px |                       0.327 |                    1.333 |
| Platforms  |                   373px |               1024px |                       0.486 |                    1.333 |
| Media      |                   312px |               1024px |                       0.406 |                    1.333 |

These measurements use decoded response pixels and the full CSS image required
by `object-fit: cover`, rather than density-adjusted browser `naturalWidth`.
They do not imply a physical resolution increase for every replacement: the
former network portrait delivered 1242px vertically versus the new 1024px. Native
sources are HD, 1536 × 1024 or 1672 × 941; no artificial enlargement or native 4K
is claimed. At 1920px the measured effective density is 0.800–1.036 pixels per CSS
pixel, below full DPR-2 fidelity. Very tall enlarged-text scenes also exceed native
image height; they retain all available pixels while growing naturally for content.

Sixty individual renderings were captured. Both complete 22-page French overview
sheets and representative detailed FR/AR/EN views were reviewed for sharpness,
composition, headroom, readable overlays and containment. Seven review
captures are retained as quality-90 WebP at CSS resolution, encoded from the
original DPR-2 Chromium screenshots:

- [French home](screenshots/generated-hero-home-fr-desktop.webp)
- [Arabic mobile home](screenshots/generated-hero-home-ar-mobile.webp)
- [French split governance](screenshots/generated-hero-governance-fr-desktop.webp)
- [Arabic split governance](screenshots/generated-hero-governance-ar-desktop.webp)
- [French end-aligned programmes](screenshots/generated-hero-programmes-fr-desktop.webp)
- [French centered mobile priorities](screenshots/generated-hero-priorities-fr-mobile.webp)
- [English editorial mobile legal](screenshots/generated-hero-legal-en-mobile.webp)

The initial sandbox-restricted build attempts produced empty output from Next's
detached TypeScript configuration subprocess. The same production build command
passed with authorized environment network access; no compiler check or application
configuration was bypassed. The successful build reported the existing next-intl
webpack dependency-cache warning. Delivery figures are local lab observations,
not field LCP/INP/CLS or cross-browser certification. These fictional placeholders
do not establish real IRESEN subjects, institutional content approval or deployment.
Remote CI and merge results belong to the corresponding PR.

## Desktop submenu destination states — 2026-10-09

Desktop destination rows now follow the owner's latest screenshot: a full sharp
navy rectangle, white title, pale description and light blue diagonal arrow.
The same colors apply to keyboard-visible focus with the existing external
outline. The change is scoped to `.mega-menu-links` from the `70rem` breakpoint;
panel geometry, resting current-route state, copy, routes and RTL transforms
retain their existing behavior. Screenshot sample labels are reference content.

Local formatting, lint, strict types, 8 unit tests and the standalone production
build passed. All 11 existing navigation browser tests passed in Chromium,
covering FR/EN/AR destinations and accessibility scans, keyboard focus and Escape,
pointer continuity and dismissal, breakpoint focus transfer, no-JavaScript
disclosures and responsive containment through 200% text.

A production-render audit recorded 40 observations at 1440 × 900 and 390 × 844:
12 resting desktop rows (one per group/locale), all 12 French destinations and
the first destination in each English/Arabic group on hover, keyboard-visible
focus in each locale, a French current-route row at rest/on hover, and three
compact-menu containment checks. All 24 active observations used the same colors
and zero corner radii. First-row dimensions stayed identical between rest and
hover in all groups/locales. Current-route semantics, the resting pale surface,
mirrored Arabic arrows and the 3px/4px-offset focus outline were retained;
no horizontal overflow occurred.

Measured settled contrast on navy `#12345A` was 12.62:1 for white titles,
7.47:1 for `#B9C9DA` descriptions and 3.97:1 for `#4698CA` arrow graphics.
The blue focus outline contrasted 5.45:1 against the surrounding white panel.
Retained renders were inspected for block extent, spacing, readable text,
focus visibility and RTL alignment:

- [French hover](screenshots/submenu-hover-fr-1440.png)
- [French keyboard focus](screenshots/submenu-focus-fr-1440.png)
- [Arabic hover](screenshots/submenu-hover-ar-1440.png)

Coverage is local Chromium, not cross-browser or screen-reader certification.
Earlier validation and captures retain their revision-specific scope. Current
remote CI and merge results belong to the corresponding PR.

## Homepage hero video — 2026-10-09

The homepage now plays the original `/videos/hero.mp4` after hydration when
motion is permitted: muted, looping and inline, without controls as requested.
The generated photo remains the loading, reduced-motion, no-JavaScript and
failed-media fallback. Its copy, certification, figures and layout, and all
21 other photographic heroes retain their existing behavior.

Formatting, lint, strict types, 8 unit tests and the standalone production build
passed. All 44 existing browser cases passed in the full local run, covering
localized routes, fonts, image delivery, responsive/RTL layout, enlarged text,
navigation, no-JavaScript behavior and automated accessibility scans. The final
11 [homepage-video cases](../tests/e2e/home-video.spec.ts) passed in a focused run:
real playback advancement in FR/EN/AR at 1440px and 390px, muted/inline/looping
playback without native controls, initial reduced motion without video requests,
live preference changes, failed media, secondary-page isolation and Arabic
no-JavaScript navigation. The initial draft live-preference assertion relied on
`currentSrc` clearing; Chromium retains that last URL even after unloading.
The final check verifies source-attribute removal, `readyState`/`networkState`
zero, paused media and reset time, then actual playback after motion is restored.

Seven sequential production-render cases were audited: normal-motion French at
1440 × 900, 1920 × 1080 and 390 × 844, English at 1440 × 900, Arabic at
390 × 844, and reduced-motion French desktop/Arabic mobile. Native decoded video
dimensions were 4096 × 1974. In all five playback cases, media time advanced
0.464–0.495 seconds during 500ms observations. A seek to 17.802 seconds wrapped
back to zero and continued unpaused, proving an actual loop. Both reduced-motion
cases requested no video and retained the photo. No horizontal overflow, control
buttons, page errors or media-cover geometry mismatch occurred. Reviewed captures
are retained at CSS resolution as quality-90 WebP without resizing:

- [French video hero](screenshots/home-video-fr-desktop.webp)
- [Arabic mobile video hero](screenshots/home-video-ar-mobile.webp)
- [French reduced-motion photo](screenshots/home-video-reduced-fr-desktop.webp)

The original file remains byte-identical: 9,774,051 bytes, SHA-256
`548d570107419bc56ba1622ee8ec4eae365ed52a2e3faee248330fc4fa6be2eb`.
A `Range: bytes=0-31` request returned 206, `video/mp4`, `Accept-Ranges: bytes`
and `Content-Range: bytes 0-31/9774051`; the 32 returned bytes matched the source.
First-playing events occurred 366–527ms after local navigation. These loopback
Chromium observations do not establish field performance or Safari/iOS behavior.
Declared lengths on partial responses are not a measured total transfer.
The 9.32 MiB original exceeds ordinary page/image budgets; its end-of-file MP4
metadata makes web-sized fast-start derivatives a remaining performance improvement.
The requested absence of pause controls does not establish WCAG 2.2.2 conformance.
Current full CI and merge results belong to the corresponding PR.

The latest section-placeholder work was subsequently integrated from `main`,
preserving both increments. Formatting, lint, strict types, 8 unit tests,
production build and all 55 browser cases passed again on the combined source.
The media observations and retained hero captures above describe the video
revision before that section integration. Current remote CI and merge results
are recorded by the PR.

## Mobile information hierarchy — 2026-10-09

The homepage at `40rem` and below omits the secondary ISO badge and redundant
scroll cue, gives its two existing navigation actions full-width stacked targets,
and retains all five facts in a native horizontal definition-list strip. The
[shared hierarchy](mobile-information-hierarchy.md) sets priorities and a
role/count ceiling without truncating meaningful content or imposing fixed
heights. Future mission cards remain editorial work; no new card content is
presented.

Local lint, strict types, 8 unit tests, 4 integration tests and the standalone
production build passed. All 62 browser cases passed in the full local run,
including seven new mobile cases. The mobile boundary sweeps cover FR/EN/AR at
320, 390, 640, 641 and 1440px: hidden secondary home elements and stacked actions
through 640px, the retained wider badge/cue/grid above it, all five values, named
scroll semantics, unclipped labels and no horizontal document overflow.
Keyboard users enter the strip from the last action and reveal each complete
figure with native directional arrows, including Arabic without JavaScript.
The enlarged-text cases reveal all five figures at 320px/200%. Existing cases
also cover every canonical route, native section navigation, fonts, footer,
menus, image delivery, automated accessibility checks and unchanged video
playback/reduced-motion/failure behavior.

Four retained production renders were inspected for hierarchy, aligned gutters,
full-width actions, readable wrapping, signature corners and RTL. At 390 × 844,
FR and AR both retain an 844px landing with 350px action groups and a contained
390px scroll strip. The English 320px/200% landing grows to about 2533px instead
of clipping content; its actions fit the available 240px width. Desktop at
1440 × 900 retains the ISO badge and five-column grid. Captures are quality-90
WebP at CSS resolution without resizing:

- [French mobile video](screenshots/mobile-hierarchy-fr-390.webp)
- [Arabic mobile reduced-motion fallback](screenshots/mobile-hierarchy-ar-390.webp)
- [English 320px with enlarged text](screenshots/mobile-hierarchy-en-320-enlarged.webp)
- [French desktop reduced-motion fallback](screenshots/mobile-hierarchy-fr-desktop.webp)

These checks use local Chromium. Native scrollbar visibility follows browser/OS
settings; its styling does not suppress it. No manual screen-reader or Safari/iOS
certification is asserted. Prior screenshots and validation retain their original
revision scope; current remote CI and merge results belong to the PR.

A supplementary production-render audit passed 21 locale/width/text-size states,
revealing 105 complete fact pairs and checking 210 value/label text blocks.
At 320px/200%, 72px values and 36px labels fit their 240px tracks. Native touch
gestures reached the last fact in French and Arabic without moving the document
horizontally; central Arabic swipes revealed each fact in order. Three scoped
hero axe scans found zero violations, with media color contrast marked incomplete
by the automated scan and representative renders reviewed manually.

## Contextual hero media — 2026-10-09

Three generated fictional scenes now match their pages: an executive meeting for
Governance, young-adult onboarding for Opportunities & Careers and a two-person
handshake for Work with us. Their 1536 × 1024 landscape sources and 683 × 1024
native-height portrait crops were inspected; original PNGs remain outside public/
and Git. The [current inventory](hero-assets.json) records every hash, dimension,
byte count and crop, while the [initial generated inventory](hero-assets-generated-2026-10-09.json)
remains historical. All 17 active photos are still generated. Real Green Energy
Park and IRESEN office imports remain blocked by external source access, as
recorded in [media readiness](contextual-hero-media.md#documentary-photos-pending).

Every photo now covers the whole hero scene. Five former split pages use start
alignment, with no image inset or opaque navy half. Utility editorial pages use
a neutral 66% overlay; directional overlays retain visible photography and
strengthen the middle stop to 65% for readable text on the new bright office
scenes. Header, facts, native actions, mobile hierarchy and homepage video remain.

Lint, strict types, formatting and the standalone production build passed on the
updated source. All 62 browser cases passed again, including the mobile hierarchy,
all canonical routes, fonts, navigation, footer, no-JavaScript behavior and video
states. The two image-delivery cases now exercise the three new scenes as well as
the previous representative home/priorities cases in fresh DPR-2 contexts. They
check one photo request, full viewport width, native-height mobile delivery and
quality-90 desktop cover without artificial enlargement.

Six retained production captures were inspected at 1440 × 900 French desktop and
390 × 844 Arabic mobile, covering the three new scenes, text hierarchy, readable
wrapping, full-frame media, RTL and portrait cropping. They are quality-90 WebP
at CSS resolution without resizing:

- [Governance, French desktop](screenshots/contextual-governance-fr-desktop.webp)
- [Governance, Arabic mobile](screenshots/contextual-governance-ar-mobile.webp)
- [Careers, French desktop](screenshots/contextual-opportunities-fr-desktop.webp)
- [Careers, Arabic mobile](screenshots/contextual-opportunities-ar-mobile.webp)
- [Partnership, French desktop](screenshots/contextual-workWithUs-fr-desktop.webp)
- [Partnership, Arabic mobile](screenshots/contextual-workWithUs-ar-mobile.webp)

The onboarding and handshake portrait crops retain their interactions; the
narrow governance crop foregrounds the central executive and discussion, with
an outer participant partly outside the frame. This is illustrative imagery,
not evidence of actual people or premises. Coverage is local Chromium; wider
browser, screen-reader and field-performance certification is not asserted.
Remote CI/push remain pending the requested documentary-media inputs.

A supplementary 26-render audit across FR/EN/AR and desktop/mobile passed full
viewport media coverage, text/action containment, selected scene/crop URLs and
44px minimum targets. Conservative rendered contrast minima were 5.813:1 for
H1, 6.279:1 for introductions and 6.195:1 for eyebrow/related-link text; solid
primary buttons measured 5.445:1. Decorative SVGs were excluded from text probes.
The review identified a desktop handshake focal refinement: top alignment lowers
faces below the navigation while retaining centered mobile framing.
After that refinement, the build, lint, formatting and both image-delivery cases
passed again. Three affected FR/EN/AR desktop renders confirmed clear faces,
visible hands, full-width coverage and containment; their text contrast remained
at least 7.919:1 for H1, 7.995:1 for introductions and 9.044:1 for related links.
The retained partnership desktop capture reflects this final positioning.

## Centered homepage figures — 2026-10-09

The five homepage values and descriptions now center within their individual
grid/scroll tracks. Locale-authored newlines give every label two lines at
ordinary sizes; `white-space: pre-line` applies only to the homepage labels.
The shared research-menu label still collapses that whitespace normally and
retains its original alignment. Narrow/enlarged labels can add lines without
fixed heights or clipping; all facts and native scrolling remain.

Lint, formatting, production compilation/types, 8 unit tests and all 15 existing
hero browser cases passed. A scoped production audit checked FR/EN/AR at 1440,
1920, 390 and 320px, plus 320px with 200% text: 15 states and 75 complete fact
pairs. All 60 normal-size labels occupied exactly two lines, with equal card
height within each state. Actual value/label text centering error stayed below
0.016px; every enlarged label and value remained contained when revealed, with
no document overflow or page error. The normal homepage video still autoplays
without controls. Checks use local Chromium; broader browser/accessibility
certification is not asserted.

Five quality-90 WebP strip captures preserve their CSS-resolution dimensions:

- [French desktop](screenshots/home-figures-centered-fr-desktop.webp)
- [English desktop](screenshots/home-figures-centered-en-desktop.webp)
- [Arabic desktop](screenshots/home-figures-centered-ar-desktop.webp)
- [French mobile](screenshots/home-figures-centered-fr-mobile.webp)
- [French mobile with enlarged text](screenshots/home-figures-centered-fr-mobile-enlarged.webp)

This increment is saved locally; push remains held while the earlier requested
documentary-photo imports await network configuration.

## Header language hover — 2026-10-09

Header language links now share search's `--radius-action` instead of the
all-corner small radius. Lint, formatting, production compilation/types and the
three existing localized desktop-navigation browser cases passed.

A scoped production audit inspected FR/EN/AR at 1440 and 390px: all 18 language
links retain physical corner radii `[10px, 0, 10px, 0]` at rest, hover and actual
Tab focus, matching search in RTL too. Targets remain 44 × 44px; focused links
show the 3px cyan outline with 4px offset. The current language remains weight
700 with a transparent resting background, and hover keeps the quiet surface.
No document overflow or page errors occurred. Checks use local Chromium, without
a broader browser or accessibility certification claim.

These quality-90 CSS-resolution crops were visually inspected:

- [French header hover](screenshots/language-hover-fr.webp)
- [Arabic header hover](screenshots/language-hover-ar.webp)

The increment is saved locally with push still held for the earlier pending
documentary-photo inputs.

## Repeatable header search reveal — 2026-10-09

The reported second-opening jump was reproduced in a native production-build
search disclosure with application scripts blocked: its three openings yielded
`running`, `finished`, `finished` animation states. Inspecting the hidden form's
styles can flush the retained animation and mask this browser regression; the
regression case leaves the closed subtree untouched between rendered frames.

The search-scoped `::details-content` override and explicit hiding of closed
non-summary children reset the CSS reveal. The same regression now yields
`running` on all three openings. FR/EN/AR hover cases also confirm three fresh
animation starts/ends, an intermediate field width, an empty query and unchanged
outside keyboard focus.

Passed locally against the corrected production build:

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (97 cases),
  `pnpm test:integration` (21 cases), `pnpm build` and formatting/whitespace checks.
- `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:e2e
tests/e2e/header-search.spec.ts tests/e2e/navigation.spec.ts --workers=2`:
  26 cases, including repeated reveals, Arabic RTL, keyboard/touch submission,
  native no-JavaScript submission, reduced motion, focus restoration,
  responsive containment and open-header axe checks.

These local checks do not establish cross-browser or screen-reader conformance.
Current PR CI and merge results remain recorded by GitHub.

Rendered Chromium review covered institute in French at 1920px and Arabic at
1440px, with three empty hover cycles, open/closed fields and live suggestions.
The outside identity retains focus; a closed input cannot take focus and Tab
reaches Contact. Escape removes suggestions. Arabic at 390px retains a contained
full-width field and input focus inside the mobile menu; Escape restores the
search trigger. French reduced motion at 1440px reveals the final measured width
immediately (0.01ms duration). The captured states were inspected without a
new layout or focus defect; the normal 220ms reveal remains on wider headers.

## Expandable header search — 2026-10-09

The header magnifier now reveals a labelled search input with a localized
placeholder. Fine-pointer hover opens without taking focus; keyboard/touch
activation focuses the input. Enter or the filled-query icon submits native GET
`q` to the existing localized search route. Escape restores inside focus to the
summary; pointer departure, outside interaction, focus ownership and breakpoint
changes retain usable dismissal. The enhanced search page restores its query.
The search engine remains unavailable; this change adds no index, results or backend.

Production build/types, lint, formatting and 8 unit tests passed. All 72 browser
cases passed before the final narrow no-JavaScript Arabic corner reset. After
that CSS correction, production compilation/types and lint passed again, as did
all 10 focused search cases. The new coverage checks FR/EN/AR hover and keyboard
submission, encoded queries, stable neighboring controls, focused language/menu
protection, RTL resize/breakpoint behavior, narrow touch dismissal/submission,
reduced motion and native no-JavaScript GET behavior. A scoped open-header axe
scan reported zero violations.

A focused production Chromium review inspected 11 states: FR/EN/AR at 1440 and
390px, FR/AR at 1920px and at 320px with 200% text, plus Arabic 390px without
JavaScript. Ten enhanced states retain unchanged header geometry and show actual
intermediate width/opacity frames during the 220ms reveal. The desktop combined
field/trigger measures 352px. At 320px with enlarged text, reversed expansion
fits the full 240px container without moving other controls. White fields retain
the physical rounded top-left/bottom-right and sharp opposite corners in RTL too.
The final targeted Arabic no-JavaScript recheck confirms the standalone summary
corners and the separate 350px field within 20px gutters.

All reviewed states have contained fields, visible input focus, readable text
height and no document overflow or page errors. Navy/white contrast is 12.616:1,
placeholder/white 5.932:1 and blue input focus/white 5.445:1. Narrow enlarged
placeholders remain native single-line text and can show only part of the hint;
the programmatic label remains complete. These quality-90 CSS-resolution crops
were visually inspected:

- [French desktop](screenshots/header-search-expanded-fr-desktop.webp)
- [Arabic desktop](screenshots/header-search-expanded-ar-desktop.webp)
- [French mobile with enlarged text](screenshots/header-search-expanded-fr-mobile-enlarged.webp)

Coverage uses local Chromium and emulated touch; Safari, physical-device and
screen-reader certification is not asserted. The ten unaffected enhanced visual
states precede the final fallback-only corner correction; the affected native
Arabic state was reviewed again after it. Remote CI/push remain held for the
earlier pending documentary-photo inputs.

## Public website search — 2026-10-09

Public search is now connected to PostgreSQL full-text/trigram ranking for
FR/EN/AR pages, rendered section anchors, approved CMS content and registered
documents/media. The animated native header disclosure keeps the latest
navigation/focus behavior and adds cancellable public suggestions. Results use
safe excerpts/highlights, content-type facets, date ordering and URL pagination.
`AGENTS.md`, `instruction.md` and `CONTRIBUTING.md` require search references for
future public additions; [the search guide](search.md) defines their metadata,
publication lifecycle and working destinations.

Formatting, lint, strict types, 44 unit tests, 12 database integration tests and
the final production standalone build passed. The reviewed migrations and
integration suite also passed against a newly created disposable database before
the final runtime storage changes. Integration coverage includes actual uploaded
PDF text extraction, normalized/typo queries, private and missing-locale
exclusion, immediate stale/withdrawn/deleted suppression, and duplicate-slug
withdrawal/restoration. Fixtures and the disposable database were removed.

The combined Chromium run passed 92 of 93 browser cases. Its remaining file
destination test revealed that the standalone server and CLI worker used
different upload directories. After sharing the absolute `CMS_UPLOAD_DIRECTORY`,
the rebuilt production server passed that focused case: published article and
section destinations render, approved file bytes return 200 with `no-store`,
missing-locale/private files are denied, withdrawal hides results immediately,
and CMS file URLs are rejected by the Next image optimizer. Restricting that
optimizer to static hero paths prevents its independent cache from bypassing
withdrawal checks. All 44 unit and 12 integration tests passed again afterward.

The other 92 cases cover the latest hero/header refinements and search hover,
keyboard/touch, suggestion arrow navigation, Escape/focus ownership, native
no-JavaScript GET, RTL, history/filters/pagination, semantic highlights,
invalid-input/noindex responses and accessibility scans. Browser/visual checks
use local Chromium and emulated touch; physical-device, Safari and screen-reader
certification is not asserted.

Six final screenshots were recaptured and visually inspected after integrating
the native header disclosure. French 1440px uses a 352px combined field/icon and
suggestion panel; Arabic 390px uses 216px without moving adjacent controls. At
320px with 200% text, FR/AR fields fit the 240px container and document width
remains 320px. Result rows, metadata and filters remain readable and contained.

- [French results, desktop](screenshots/search-fr-1440.png)
- [Arabic results, mobile](screenshots/search-ar-390.png)
- [French header with suggestions](screenshots/header-search-fr-1440.png)
- [Arabic header with suggestions](screenshots/header-search-ar-390.png)
- [French enlarged narrow layout](screenshots/search-fr-320-200.png)
- [Arabic enlarged narrow layout](screenshots/search-ar-320-200.png)

PDF extraction needs Poppler; scanned PDFs and audio/video/non-extractable
documents need approved searchable text/transcripts. This increment does not
provide OCR or speech recognition. Production storage, rate limiting and worker
operations retain their release requirements. PR CI and merge outcomes are
recorded by the current pull request; no website deployment is performed here.

## Search relevance and final-content reminder — 2026-10-09

Relevance now uses ordered exact, linguistic/prefix, spelling and related-topic
tiers. Corrections preserve the original query, while excerpts and highlights
show the words that actually matched. Related vocabulary is explicitly curated
in FR/EN/AR; it does not provide free-form model-based semantic understanding.

Local verification used Node 24.19.0, pnpm 11.19.0, PostgreSQL 17 and a production
Next build. The new vocabulary migration and public rebuild succeeded. Generated
Payload types/import map stayed unchanged. Formatting, ESLint, TypeScript,
92 unit tests, 21 database integration tests and the production build passed.
The existing 93 browser cases passed in the complete run; all 10 new relevance
cases passed in the focused rerun after fixing test locators and separating axe's
JavaScript audit from the native no-JavaScript journey. The initial PR CI passed
the complete 103-case suite against a freshly migrated PostgreSQL service.
After the final correction-link focus refinement, the rebuilt production server
also passed all 20 header/relevance browser cases. Three focused header scans
using the actual final CSS reported no axe violations or horizontal overflow;
keyboard arrows and Escape restored focus correctly.

The feature was subsequently integrated with the approved mobile menu revision.
The combined production build, formatting/lint/types, 92 unit tests and all
108 local browser cases passed. Relevance coverage now includes accepting a
header correction inside the full-screen mobile menu, closing that menu,
restoring interactive main content and focusing the results field. Resizing a
focused mobile correction to the wider header closes the navigation menu while
preserving the open search and keyboard focus, so navigation cannot cover the
suggestions. Mobile search
and suggestions expand in normal flow at `40rem` and below. Arabic result/menu
captures were refreshed against this integrated build; current PR CI repeats the
complete 108-case suite.

Integration coverage includes title/body priority despite repeated later-tier
content, literal PV priority, adjacent-letter and multiword corrections, valid
concept protection, unchanged-static vocabulary upgrade, all required query
terms beyond 12 words, and immediate exclusion of private, draft, unapproved,
stale, deleted and missing-language vocabulary. Browser coverage includes native
correction links, preserved filters/sort with reset pagination, keyboard header
suggestions, matching highlights and Arabic RTL at 320px/200% text.

Manual production API checks returned HTTP 200 for “Résultats”, “Plateformes”,
“Insrastructure”, “PV” and “الألواح الشمسية”. “Plateformes” starts with exact
platform results; “Insrastructure” proposes “Infrastructure” without changing
the input. PV discovers the existing public generated solar-media descriptions;
it does not invent institutional photovoltaic records.

French desktop and Arabic mobile captures were visually inspected. Corrections
and badges remain readable; enlarged 320px EN/AR layouts retain a 320px document
width. JavaScript-enabled axe scans reported no violations in the search region;
the no-JavaScript Arabic correction journey also passed. Local Chromium and
emulated viewports do not establish physical-device, Safari or screen-reader
certification.

- [French correction and related results, desktop](screenshots/search-relevance-fr-1440.png)
- [Arabic correction and close result, mobile](screenshots/search-relevance-ar-390.png)
- [Focused header correction, desktop](screenshots/search-relevance-header-fr-1440.png)
- [Focused correction in the Arabic mobile menu](screenshots/search-relevance-menu-ar-390.png)

The owner's reminder is recorded in `AGENTS.md`, `instruction.md`, the search
guide and release backlog: once all content is ready, review/reconstruct the
approved multilingual glossary/terminology, acronym and related-term dictionary,
then rebuild and verify the public search index/vocabulary during the final sanity
check. That future content milestone remains pending. No deployment is performed.

## Mobile reference adaptation — 2026-10-09

The owner's four mobile screenshots establish composition. Their sample text,
links, contact details, social networks, historical colors and device chrome
remain reference data. The revision adapts the existing homepage, navigation and
footer at `40rem` and below with current brand/content/routes and the integrated
public search implementation. See [the shared rules](design-system.md#mobile-reference-adaptation--2026-10-09).

Using Node 24.19.0, pnpm 11.19.0, a migrated disposable local PostgreSQL database
and production Chromium, lint, strict types, formatting, 44 unit tests, 12 CMS/search
integration tests and the standalone production build passed. All 96 browser
cases passed across navigation, search, footer, fonts, heroes/media, public route
access and existing CMS/search destinations. After the final viewport-measurement
correction, the app was rebuilt and all 27 navigation/hero cases passed again,
including unchanged underlying hero size while the full-screen menu is open.

The new regressions verify the complete collapsed-menu Tab sequence, expanded
child destinations, visible Close control, focus wrapping, nested Escape and
background inert/restoration. Mobile search covers touch and keyboard access,
full-width suggestions, destination navigation and native GET without JavaScript.
Existing FR/EN/AR checks cover 320/390/768/1024/1440px, 200% text, RTL, menu/form
containment, equivalent locale access and scoped axe scans. Automated scans do
not establish full accessibility conformance.

Rendered review inspected FR390 homepage/menu/footer, AR390 menu/footer,
FR320/640 menus, FR/AR320 menus at 200% text, and FR1440 homepage/footer.
The reviewed states have no document overflow, page errors or logo/Close overlap;
Close uses navy on white. Footer email and Subscribe occupy separate full-width
rows on mobile, with consent, privacy, utilities, language and copyright retained.
An oversized element screenshot exposed an offscreen fixed skip-link layer;
ordinary viewport captures confirm that it is absent from the actual footer paint.
Final footer evidence therefore uses separate top/newsletter viewport captures.

Selected reviewed screenshots:

- [French mobile homepage](screenshots/mobile-reference-fr-390-hero.png)
- [French full-screen menu](screenshots/mobile-reference-fr-390-menu.png)
- [French footer newsletter and bottom](screenshots/mobile-reference-fr-390-footer-newsletter.png)
- [Arabic mobile footer](screenshots/mobile-reference-ar-390-footer.png)
- [Arabic menu with enlarged text](screenshots/mobile-reference-ar-320-menu-text200.png)
- [French desktop footer](screenshots/mobile-reference-fr-1440-footer.png)

Coverage uses local Chromium and emulated touch, without claiming a pixel-exact
match, physical-device/Safari coverage or screen-reader certification. Remote CI
and merge results are recorded by the corresponding pull request and commit history.

## Mobile menu entrance — 2026-10-09

The owner's follow-up specifies arrival from the right. At `40rem` and below,
the existing full-screen menu now enters from the physical right edge over 320ms
using only a CSS transform. The direction is the same in Arabic. Reduced motion
opens directly, and the native disclosure remains functional without JavaScript.

Lint, strict types, formatting, all 44 unit cases, the production build and all
12 navigation browser cases passed. The existing containment assertion now waits
for the header's animation to finish before measuring settled control bounds.
Its coverage retains FR/EN/AR navigation, focus, narrow/wide layouts and 200% text.

Manual production Chromium sampling at 390px verified FR/AR normal motion from
header x=390px to x=0, repeat opening restarting the entrance, and reduced-motion
opening at x=0 throughout. Native no-JavaScript opening and repeat opening also
complete from the physical right in both locales. Document width stays at 390px
and scrollX stays at zero throughout the sampled entrance. Immediate Tab remains
inside the sheet; Escape returns focus to its summary and restores background
interaction/scrolling. English settled controls remain within the viewport.

Two reviewed captures pause the entrance at 80ms:

- [French intermediate entrance](screenshots/mobile-menu-slide-fr-390-intermediate.png)
- [Arabic intermediate entrance](screenshots/mobile-menu-slide-ar-390-intermediate.png)

Coverage uses local Chromium; physical-device, Safari and screen-reader validation
is not asserted. CI and merge results remain recorded by the corresponding pull request.

## Contact reference page and location — 2026-10-09

The owner selected the general composition of Figma contact frame `804:7374`
and requested a full-width IRESEN location section. The dedicated contact page
uses the exact original decorative image, current shared colors/fonts/header/footer,
verified contact values and short platform descriptions. Sample inboxes, hours
and a response deadline are not adopted. Source and implementation decisions
are recorded in [the contact guide](contact.md).

After integrating the current main branch's search and mobile refinements:

- Formatting, lint, strict types, all 97 unit cases and the production build passed.
- All 21 CMS/search integration cases passed against the local PostgreSQL database.
- Repeated integration runs exposed a race between the parallel CMS suite's
  automatic search worker and the search suite's manual job processing. The
  integration command now disables automatic polling for both suites, matching
  CI; manual indexing and permission checks still run. All 21 cases passed with
  this isolation and the production server stopped.
- All 127 Chromium browser cases passed, including 16 contact cases and three
  contact-search cases. Standard hero coverage excludes the dedicated contact
  and search pages, which retain their own behavior coverage.
- Contact FR/EN/AR passed at 320, 390, 768, 1024 and 1440px, with 100% and 200%
  text and expanded FAQs. Narrow grid/flex wrapping was corrected before the
  final pass. The old supported anchors remain visible; map width equals the viewport.
- Native FAQ keyboard interaction, visible focus, scoped axe scans, subject
  routing, required/email/whitespace validation, multilingual email draft encoding,
  edit invalidation, direct no-JavaScript links and absence of form POST/storage passed.
- Map tests confirm no Google requests before activation, a titled iframe after
  keyboard activation, focus transfer/restoration, removal and non-persisted state.
  Those responses were intercepted locally; they do not verify Google's live map
  or the exact pin behind the supplied shortlink.
- Current contact topics, platform/FAQ/location anchors and the original background
  media are discoverable in FR/EN/AR. Retired contact scaffold notes are excluded.
  `pnpm search:rebuild` synchronized the static catalog with zero public CMS records.

Reviewed production captures show the French desktop and narrow composition,
English tablet layout and Arabic RTL. The image's non-empty original, source hash,
callsite, right-aligned cover geometry and successful optimized delivery were checked;
current shared logo assets remain proportional and loaded in the captures.

- [French desktop](screenshots/contact-fr-1440.webp)
- [French narrow layout](screenshots/contact-fr-320.webp)
- [English tablet](screenshots/contact-en-768.webp)
- [Arabic mobile](screenshots/contact-ar-390.webp)

The form prepares a draft for the visitor's email application; delivery is not
claimed or tested. The embed queries the established Rabat address and keeps the
owner's exact directions link; its pin remains unverified. This evidence does not
establish physical-device/Safari coverage, screen-reader certification, production
publication or deployment. PR CI and merge results remain recorded in GitHub.

## Tablet homepage layout — 2026-10-09

The owner's tablet screenshot and follow-up request define this correction:
the homepage ISO badge is omitted below `70rem`, retaining its compact desktop
placement; all five figures stay in one row, scrolling horizontally when needed.
The shared `.horizontal-scroll` utility hides the scroll track while retaining
native scrolling and visible focus. Current design guidance records this as the
general convention for horizontal navigation.

Local lint, strict types, formatting, all 92 unit and 21 integration cases, and
the production build passed. The selected hero/navigation suite passed all 27
cases across its first run and targeted rerun. The first four-worker run alongside
manual QA timed out in six cases; the final two-worker rerun passed all six.
The expanded ten-width case has a 120-second budget and requests start alignment
when inspecting individual figures, matching their scroll-snap alignment.
Coverage spans FR/EN/AR at 320, 390, 640, 641, 768, 1024, 1119, 1120, 1280 and
1440px, including native keyboard access, no-JavaScript behavior, viewport
changes, enlarged text and existing navigation checks.

Manual production Chromium QA passed 18 FR/EN/AR scenarios: ordinary layouts at
768×1024, 1024×1366, 1440×900 and 390×844, plus 200% root text at 320 and 768px.
All five facts remain reachable with the locale-appropriate arrow key, horizontal
wheel and emulated touch gestures. The page has no horizontal overflow, labels
wrap without truncation and focus remains visible. Tablet/mobile ISO is hidden;
desktop retains the existing card aligned with the bottom of the actions.
Settled-frame rechecks confirmed the English 768px and Arabic 320px enlarged-text
measurements. Captures use the reduced-motion photo fallback, preserving the
existing video policy.

Reviewed screenshots retained for this correction:

- [French tablet, 1024px](screenshots/tablet-correction-fr-1024-2026-10-09.png)
- [Arabic tablet, 768px](screenshots/tablet-correction-ar-768-2026-10-09.png)
- [French desktop, 1440px](screenshots/tablet-correction-fr-1440-2026-10-09.png)

Physical-device, Safari and screen-reader validation is not asserted. Current
PR CI and merge results remain recorded by the pull request and commit history.

## Contact headquarters photograph — 2026-10-09

The owner supplied the headquarters photograph in commit `92f01c3`. It replaces
the contact introduction's cyan curves. The original JPEG bytes are preserved;
responsive optimized copies use quality 75. A navy gradient follows the text
block and fades into a reserved 10rem area, retaining readable white/cyan text
while revealing the entrance below. The same physical crop applies in Arabic.
The retired curve file is removed from public delivery and search.

This photo verification predates integration of the later direct-map refinement.
Its map cases exercised the previous on-demand presentation.

Formatting, lint, strict types, all 97 unit cases, all 21 integration cases and
the production build passed. All 19 existing contact/contact-search Chromium
cases passed, retaining form, FAQ, map, no-JavaScript and localized media discovery
coverage. The public index rebuild synchronized the static catalog and three
eligible public CMS records.

Manual production Chromium checks covered French at 320, 390, 1024, 1120 and
1440px, English at 768px and Arabic at 390px, each at normal and 200% text.
All 14 states had no horizontal overflow; the text remained inside the shaded
area, including the 1120px split-layout boundary. The lower entrance remained
visible in reviewed desktop, narrow, tablet and Arabic captures.

At device pixel ratio 1, successful initial image responses were WebP copies
between 94,062 and 178,082 bytes (750, 828 or 1080px wide), rather than a request
for the 11,425,755-byte original JPEG. The retired curve URL returned 404.
These are local delivery measurements, not production loading-time results.

- [French desktop](screenshots/contact-photo-fr-1440.webp)
- [French narrow layout](screenshots/contact-photo-fr-320.webp)
- [French mobile](screenshots/contact-photo-fr-390.webp)
- [English tablet](screenshots/contact-photo-en-768.webp)
- [French tablet](screenshots/contact-photo-fr-1024.webp)
- [French split-layout boundary](screenshots/contact-photo-fr-1120.webp)
- [Arabic mobile](screenshots/contact-photo-ar-390.webp)

Earlier contact captures document the initial curved background. Physical-device,
Safari and screen-reader coverage and production deployment are not asserted.
Current PR checks and merge results remain recorded in GitHub.

## Footer address and privacy links — 2026-10-09

Verified on the current synchronized contact/tablet baseline: formatting, lint,
strict types, 97 unit tests, production build and all 9 focused footer browser
tests passed. The cold webpack build retained the previously documented
next-intl cache-dependency warning. Build/browser processes ran outside the
restricted execution sandbox to permit Next subprocesses and local services;
the sandboxed build had returned empty TypeScript `--showConfig` output.

Production Chromium checks covered FR/EN/AR at 390, 768 and 1440px: the displayed
localized address links to the owner-supplied Maps shortlink, uses the existing
cyan underline, and has a visible keyboard focus indicator. Every locale has
exactly one footer privacy link, in utilities, with none beneath newsletter
consent. Layouts fit the viewport. French 1440px and Arabic 390px footer captures
were visually inspected:

- [French desktop, 1440px](screenshots/footer-links-fr-1440.png)
- [Arabic mobile, 390px](screenshots/footer-links-ar-390.png)

Additional FR/EN/AR checks at 320px passed with 200% root text and without
JavaScript. Native address clicks navigated to the exact supplied Maps shortlink,
intercepted locally during testing. This verifies link activation and destination,
not Google's shortlink resolution or map pin. The focused suite also checks
newsletter disclosure, consent, language/utility navigation, Arabic order and
mobile/tablet/desktop containment. No database schema or server-side behavior
changed in the footer correction. Other browsers and manual screen-reader
verification remain outside this pass.

The synchronized base includes the contact venue photograph and its inherited
`contact-venue` search reference. Both supplied image bytes and the rendered
abstract contact background are preserved. The catalog covers both images with
explicit FR/EN/AR scene descriptions and original URLs. Source provenance is
recorded in [the asset inventory](asset-inventory.md); current PR CI and merge
results remain recorded in GitHub.

After synchronization, lint, strict types, 97 unit tests and the production
build passed again. The local search index rebuild and all 21 CMS/search
integration tests passed. API checks found the photo under its exact localized
title in FR/EN/AR, with the stable original JPEG destination, which returned HTTP
200 and `image/jpeg` from the local production server. All 3 existing contact
search browser cases passed, preserving section discovery/navigation and the
abstract background's search reference in each locale.

## Contact form eyebrow — 2026-10-09

The owner's screenshot correction centers the form's leaf/label group above its
title and adds the original blue Apex Leaf. The local rule removes the inherited
paragraph-width limit; the decorative vector retains its original geometry and
logical inline-start position in Arabic.

Validation completed on the production build with a disposable local PostgreSQL
database and Chromium:

- Frozen-lockfile installation, lint, strict types, 97 unit tests and production
  build passed. The initial sandboxed build could not capture a TypeScript
  subprocess's configuration output; the normal build passed outside that sandbox.
- All 19 existing Contact/search browser checks passed, covering FR/EN/AR layout,
  keyboard FAQs, email draft validation, optional map loading, no-JavaScript
  fallbacks and searchable section destinations.
- A focused rendered inspection measured 30 combinations: FR/EN/AR at
  320/390/768/1024/1440px, each at 100% and 200% root text size. The complete
  leaf/label group's horizontal center differs from the title center by less
  than 0.01px. The original 177.3:287 ratio, decorative semantics, logical leaf
  placement and page containment passed throughout.
- Inspected the [French desktop](screenshots/contact-eyebrow-fr-1440-2026-10-09.png),
  [English tablet](screenshots/contact-eyebrow-en-768-2026-10-09.png) and
  [Arabic mobile](screenshots/contact-eyebrow-ar-390-2026-10-09.png) captures.
- Rebuilt the local public search catalog. Existing `send-request` metadata
  already includes the localized eyebrow; the original Apex media entry and
  reachable section anchors remain.
- The Apex Leaf SHA-256 remains
  `7c51a47ea0775bd26602ce2a61c8b7dbaf8cfa5597c59189b1b85932a56c0f86`.

Database integration suites and unrelated browser routes were not repeated for
this scoped presentation correction. Current PR CI runs the complete suite.
Safari, physical-device and manual screen-reader coverage remain unverified.
No production deployment or visibility change was performed.

The first current-head PR CI run exposed a separately added `main` asset,
`/images/contact/contact-background-venue.jpg`, without a public search reference.
The local unit suite reproduced that failure after synchronizing `main`. Its
explicit media entry now describes the visible entrance in FR/EN/AR, without
inferring an address or changing the Contact composition. The source bytes
remain unchanged; [asset provenance](asset-inventory.md) records the addition.
After registering that asset and extending the existing catalog expectation,
lint, strict types, all 97 unit tests, formatting and the production build passed
again. The three Contact search browser checks passed on the rebuilt application.
FR/EN/AR media queries for the visible wooden gate find its localized result,
and the canonical image destination returns HTTP 200 in each case.

## Direct contact map — 2026-10-09

The owner's follow-up replaces the click-to-reveal presentation with a directly
rendered Google Maps iframe. `ContactLocation` is now a server component with
explicit locale translations, native `loading="lazy"`, a descriptive frame title
and `no-referrer`. The directions shortlink and headquarters address are retained.
The load/hide controls, their client state, placeholder and lower explanatory
strip are removed, including bottom section padding. The cookies-page service
notice and location search metadata describe the current external-map behavior.

The existing public search reference for
`/images/contact/contact-background-venue.jpg` is preserved from the current
main branch, including its FR/EN/AR descriptions of the visible building
entrance, white IRESEN wall, trees and garden. The file and the current decorative
contact introduction remain unchanged; no exact location or new rights claim is
inferred from the photograph.

Executed local checks:

- Frozen dependency installation, disposable local PostgreSQL setup and reviewed
  migrations; public search rebuild synchronized the current static catalog.
- `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, all 97 unit cases and all
  21 CMS/search integration cases passed.
- The final `pnpm build` completed successfully.
- Production Chromium ran `contact.spec.ts`, `contact-search.spec.ts` and
  `foundation.spec.ts`: all 30 cases passed. Contact layout checks cover FR/EN/AR
  at 320, 390, 768, 1024 and 1440px with 100% and 200% text. The map spans the
  viewport, loads without interaction and reloads without stored state. Its
  section ends at the iframe's bottom, and directions retain keyboard access.
- No-JavaScript checks confirm the iframe, translated title, email/directions
  links and native FAQ disclosures in all three locales. Search checks confirm
  discoverable contact text and working section destinations.

Manual production Chromium screenshots were captured and inspected for the map
section in French at 1440px and 390px, English at 768px and Arabic at 390px.
Each view has one directly rendered, correctly titled lazy iframe, no reveal
control or lower explanatory strip, and no horizontal page overflow. The map
spans the viewport and meets the footer with a measured 0px gap in all four
views. The directions action wraps naturally on mobile and English tablet;
Arabic retains its RTL heading, address and action layout. A local intercepted
HTML response stands in for Google in these captures. No live map imagery is
presented as verified.

The cookies-page notice was also rendered and visually inspected without
JavaScript in French, English and Arabic at 390px. Each notice matches its
locale catalog, wraps within the viewport and identifies the map's automatic
loading and browsing-data transmission. Captures remain temporary review
artifacts rather than committed website media.

Google responses are intercepted locally in map-focused browser checks to avoid
external-service dependence. They verify the rendered frame and automatic request,
not Google's live tiles, gesture behavior or exact pin. The supplied shortlink's
pin, physical-device/Safari behavior and production privacy assessment retain
[their documented scope](contact.md#location-and-third-party-behavior). Remote CI
and merge results are recorded by the corresponding pull request and commit history.

## Combined contact photo, eyebrow and direct map — 2026-10-09

After integrating main's eyebrow and direct-map refinements, full formatting,
lint, strict types, all 97 unit cases, all 21 integration cases and the production
build passed. All 19 contact/contact-search Chromium cases passed on this combined
revision, including the directly rendered lazy map, keyboard directions, native
no-JavaScript behavior, FR/EN/AR layouts and localized photo discovery.
The latest search rebuild synchronized the static catalog with zero public CMS
records after integration-test cleanup; the earlier photo rebuild's three records
remain its historical result. The sections above retain their separate
revision-specific measurements and captures. Current PR CI and merge results
remain recorded in GitHub.

These combined-state checks and PR36 CI's 127 browser cases cover `90e661c`,
before integrating main's footer-link and field-focus changes at `6f2e246`.
After that integration, full formatting, lint, strict types, all 97 unit cases,
all 21 integration cases, the production build and all 28 selected contact,
contact-search and footer Chromium cases passed. CI for the updated PR head
remains recorded by [PR36](https://github.com/bensinmoh/iresen.ma/pull/36).

## Refined field focus — 2026-10-09

The owner's Organisation and Arabic search screenshots identified the thick
blue focus frame. Editable inputs, selects and textareas now use a 2px real
outline at their edge (`outline-offset: -1px`). Header search paints one outline
on its field surface, keeping the white field's blue indicator independent of
inverse-header focus colors. Footer email retains cyan. Buttons, links and
checkboxes retain their existing focus indicators.

Local checks passed: `pnpm lint`, `pnpm typecheck`, `pnpm test` (97 cases),
`pnpm build` and `pnpm format:check`. The build retained its existing next-intl
dynamic-import cache warnings and completed successfully. The existing contact,
header-search and footer Playwright suites passed all 35 cases against the local
production build, including native validation/email drafting, search submission,
Escape restoration, newsletter availability and no-JavaScript access.

A separate rendered Chromium inspection covered FR/EN/AR contact and homepage
header search at 1440, 768 and 390px. It checked pointer and keyboard focus,
organisation/email/select/textarea, newsletter email, result-page query and sort,
blue search on white inside inverse headers, mobile menus and Arabic RTL.
Contact-field size and position did not change on focus; search stayed inside
the viewport, and Escape restored the magnifier's separate 3px indicator.
Newsletter checkboxes also retained their 3px focus indicator.

At 390px with 200% root text, French/Arabic fields reflowed without horizontal
page overflow, retained their 2px outline, and focused contact/newsletter axe
scans returned no violations. Emulated forced colors retained a visible real
outline on the contact field and a system `Highlight` search outline. CSS state
measurements were made after animation frames settled. Blue contrasts 5.45:1
against white and 4.78:1 against the pale form surface; cyan/navy is 6.45:1.
These scoped checks do not establish complete WCAG conformance or coverage of
other browser engines.

Reviewed crops from this production build:

- [French Organisation field at 1440px](screenshots/input-focus-contact-fr-1440.png)
- [Arabic header search at 1440px](screenshots/input-focus-search-ar-1440.png)
- [Arabic mobile-menu search at 390px](screenshots/input-focus-search-ar-390.png)

The latest Contact changes were integrated before completion, preserving the
centered Apex Leaf eyebrow, directly displayed map and canonical `contact-venue`
search reference from main. The shared field rule and research references are
recorded in
[the design specification](design-system.md#refined-field-focus--2026-10-09).

## Contact location before FAQ — 2026-10-09

The owner's requested swap places the existing location/map immediately after
the form and before the FAQ. DOM order changes with the visual order in FR/EN/AR;
the existing anchors and localized search destinations remain valid. The public
search projection already lists location before practical questions.

Full formatting, lint, strict types, all 97 unit cases, the production build and
all 19 contact/contact-search Chromium cases passed. Manual production review
covered French at 1440px, English at 768px and Arabic at 390px, each at normal
and 200% text. All six states retained form → location → FAQ order, separate
section bounds, a full-width map and no horizontal overflow. Native FAQ keyboard
opening, answer-link focus and closing passed; its return link still targets
the form.

Reviewed captures show the reserved iframe area. Google requests were replaced
with a local test response during layout checks. The captures verify section
spacing and order, not live map tiles or the exact pin.

- [French desktop](screenshots/contact-order-fr-1440.png)
- [English tablet](screenshots/contact-order-en-768.png)
- [Arabic mobile](screenshots/contact-order-ar-390.png)

Current PR CI and merge results remain recorded in GitHub. Physical-device,
Safari and screen-reader coverage is not asserted.

## Homepage missions and section navigation — 2026-10-09

The live Figma homepage submenu and mission frame were inspected through native
screenshots and design context. The delivered composition uses the current brand,
three-stage mission framework and canonical routes, with three newly generated
fictional technology scenes. Source/output hashes and prompts are recorded in
[the asset manifest](mission-assets.json); the original WebPs total 523,694 bytes.

Formatting, lint, strict types, all 97 unit cases, all 21 disposable-database
integration cases and the production build passed after integrating current main.
The initial full Chromium suite passed 145 of 146 cases; the remaining assertion
expected a zero transition duration, while the shared reduced-motion rule uses a
tiny duration with transitions disabled. The assertion now checks the disabled
transition property. After correcting that assertion and the first anchor's
clearance, all 44 affected homepage, hero, rendered-font and foundation browser
cases passed. All 15 focused homepage cases then passed on the final build after
the no-JavaScript current-marker correction. Current PR CI records the final
complete-suite result.

The browser coverage verifies FR/EN/AR navigation placement and homepage-only scope,
the 1023/1024px boundary, pinned native anchors, direct card hashes, active section
tracking without moving focus or changing the URL, 200% text wrapping, reduced
motion and native no-JavaScript operation. All three cards retain images and
canonical destinations at 320, 390 and 1023px. Homepage axe scans reported no
violations in all three locales; browser font inspection confirmed Jakarta Latin
and Alexandria Arabic glyphs in the new menu and mission headings.

Rendered review covered French/Arabic at 1440 and 390px, English at 1024px and
Arabic at 768px. All cases fit the viewport and decoded all three photos. Tablet
image/body rows, full mobile stacks, RTL arrows and physical diagonal corners
were reviewed. The final desktop spacing uses the page's native anchor clearance
followed by the section's own padding, avoiding duplicate generic shell spacing.

Localized search discovery passed for French `batteries`, English `smart grids`
and Arabic `الهيدروجين`; each found the relevant new mission media. The static
catalog rebuild completed with zero public CMS records after fixture cleanup.
Public CMS eligibility and withdrawal gates remain unchanged.

Reviewed captures:

- [French desktop](screenshots/home-missions-fr-1440.webp)
- [Arabic desktop](screenshots/home-missions-ar-1440.webp)
- [French mobile](screenshots/home-missions-fr-390.webp)
- [Arabic mobile](screenshots/home-missions-ar-390.webp)
- [Arabic tablet](screenshots/home-missions-ar-768.webp)

The copy remains drafted wayfinding and the generated scenes do not identify
actual IRESEN people or facilities. No deployment was performed. This Chromium
pass does not establish complete WCAG conformance, screen-reader or Safari coverage.

## Horizontal mobile mission navigation — 2026-10-09

The owner's follow-up replaces the mobile mission stack with a native horizontal
collection below 48rem (768px with the default browser font). Cards expose part of
their neighbor when space permits, use CSS proximity snapping, and retain readable
natural height, all three destinations and the site's hidden-scrollbar rule.
Tablet image/body rows and the desktop three-column layout remain.

Local formatting, lint, strict types, all 97 unit cases and the production build
passed. All 30 selected Chromium homepage, foundation and rendered-font cases
passed. Coverage includes 320/390px horizontal navigation, RTL-aware native arrow
keys, Tab revealing each link, direct third-card hashes, no JavaScript, reduced
motion, 200% text in all three locales and preservation of the tablet/desktop
layouts. Homepage axe scans reported no violations in FR/EN/AR. No schema or
database behavior changed; integration checks run in current PR CI.

Emulated mobile touch gestures moved the collection in FR/EN/AR, including native
negative RTL scroll offsets. Focusing the last destination revealed the third
card. Every checked state fit the page width, with no nested vertical overflow.
Rendered geometry at 768, 1024 and 1440px confirmed tablet rows and desktop columns
without collection or page overflow. New French/Arabic 390px captures were
reviewed, including visible next-card glimpses and the final card's focus state:

- [French mobile collection](screenshots/home-missions-horizontal-fr-390.webp)
- [Arabic mobile collection](screenshots/home-missions-horizontal-ar-390.webp)
- [French final card and keyboard focus](screenshots/home-missions-horizontal-fr-last-390.webp)

The earlier stacked-mobile captures remain historical. Card/section anchors,
localized search references, copy and media are retained. Documentation records
the owner's separate image clarification for later review; no photos were changed.
Current PR CI records the complete-suite result. Physical-device, other browser
engines and manual screen-reader coverage are not asserted.

PR #40 CI on `d1f60f6` subsequently passed all 97 unit, 21 integration and 147
browser cases. Integrating main's separate deferred-homepage documentation then
changed only Markdown; runtime, tests, configuration and dependencies remained
identical to that passing revision. Merged documentation links, formatting and
whitespace checks passed. The final current-head CI result remains recorded in GitHub.

## Photographic mission cards and hover — 2026-10-09

The owner's supplied MOV was privately inspected for the resting and hovered
card states. The delivered treatment restores full photographs, white bottom
copy and inline underlined destinations, with a 1.04 photo zoom and a 22% blue
tint over 300ms. The recording's sample content does not replace current copy,
routes or media; raw video and extracted frames are excluded from the repository.

Local formatting, lint, strict types, all 97 unit cases and the final production build passed.
All 33 selected Chromium homepage, foundation and rendered-font cases passed on
that build. Coverage includes all three cards' full-photo composition, stable
card/text geometry on hover and pointer leave, Arabic keyboard focus, dynamic
reduced motion, coarse-pointer touch, native mobile arrows/Tab, direct hashes,
no JavaScript and 200% text in FR/EN/AR. Homepage axe scans reported no violations
in the three locales, and the intended local fonts rendered.

Rendered checks at 390, 768 and 1440px in FR/EN/AR found no page overflow or nested
vertical collection scrolling and confirmed that the first card fits its available track. Hover
changed only the photograph and tint. Enlarged-text review at 320px in French
and Arabic confirmed full text containment, natural card growth and no internal
card scroll. The final layout uses a shared grid cell for the preferred photo
ratio and the full text body; this resolves width and height clipping discovered
in intermediate aspect-ratio layouts. The 200% regression check now verifies
actual text bounds inside each card as well as native navigation.

Reviewed captures:

- [French desktop at rest](screenshots/home-missions-photo-fr-1440.webp)
- [French desktop with the first card hovered](screenshots/home-missions-photo-hover-fr-1440.webp)
- [Hovered card detail](screenshots/home-missions-photo-hover-fr-card.webp)
- [French horizontal mobile collection](screenshots/home-missions-photo-fr-390.webp)
- [Arabic horizontal mobile collection](screenshots/home-missions-photo-ar-390.webp)

The earlier split-card captures remain historical. Existing section/media search
references, drafted content and the deferred imagery review are retained; no
schema or database behavior changed. Current PR CI runs the complete integration
and browser suites. No deployment was performed. This Chromium review does not
assert physical-device, Safari, manual screen-reader or full WCAG coverage.

## Search results control corners — 2026-10-09

The owner's screenshot and explicit clarification require rounded top-left and
bottom-right corners, with sharp opposite corners. The results query field,
resource filters and sort select now reuse the existing action geometry. The
owner's subsequent screenshot identified insufficient native-arrow inset; the
sort select now uses the shared decorative chevron with a 12px inline-end inset
and 12px text clearance. Native options, keyboard behavior and GET submission
remain. The visual QA skill now explicitly checks icon inset and text clearance.

Final local formatting, lint, strict types, 97 unit tests, 21 integration tests
and the production build passed. All 39 selected search/contact-search/header-search
browser cases passed on that build in local Chrome with two workers. An earlier
seven-worker run missed an intermediate header-animation frame; the complete
selected suite passed on rerun. The initially unavailable PDF extractor was
installed and initialized locally before the full integration suite passed.

Rendered FR/EN/AR checks at 320, 390, 768, 1024 and 1440px confirmed the physical
corner orientation and page containment. The existing multilingual reflow test
now measures arrow inset, text reserve for the longest option and text/icon gap,
including 320px and 1440px at 200% text. Field keyboard focus retains its 2px
edge outline. Search-region axe scans found no violations in all three locales.
Native no-JavaScript submission, filters, sorting, pagination, browser history,
touch, reduced motion and localized destinations passed in the selected suite.

Reviewed captures:

- [French desktop controls](screenshots/search-controls-fr-1440.png)
- [Arabic mobile controls](screenshots/search-controls-ar-390.png)

No public content, resource, route or search projection was added; existing
references and the search-page exclusion remain. Current PR CI runs the complete
application suite before merging. No deployment was performed. Safari, physical
devices and manual screen-reader coverage are not asserted.

## Footer social-link corners — 2026-10-09

The owner's screenshot identifies four-corner rounding on the LinkedIn hover
surface. All three social icon actions now share the physical top-left/bottom-right
action corners, with sharp opposite corners. Keyboard-visible focus shares the
hover surface and retains its existing outline. Visual QA guidance now checks
newly visible icon-link surfaces against the corner rule.

Local formatting, lint, strict types and production build passed. All nine
existing footer browser cases passed in local Chrome on that build, including
FR/EN/AR destinations, responsive containment, Arabic reading order, 200% newsletter
text, language switching and no-JavaScript use. Rendered inspection of every
social link at 390px and 1440px in all three locales confirmed the hover/focus
surface, physical `10px 0 10px 0` corners, visible keyboard outline and page
containment. Reviewed details:

- [French social hover](screenshots/footer-social-corners-fr.png)
- [Arabic social hover](screenshots/footer-social-corners-ar.png)

No content, destination, asset or search projection was added. Full unit,
integration and browser coverage runs in current PR CI before merge. This local
review does not assert Safari, physical-device or manual screen-reader coverage.

## Search result previews — 2026-10-09

Full results now show public media thumbnails/native playback, document formats
with on-demand PDF viewing, and eligible news lead images with a truthful marker
when missing. Metadata enrichment is bounded to the result page and uses public,
locale-specific CMS queries without translation fallback. Uploaded media bypass
the persistent image optimizer; guarded file requests still enforce withdrawal.
No resources, routes, schemas or index projections were added.

Local formatting, lint, strict types, 97 unit tests, 22 integration tests and the
production build passed. All 40 selected Chrome search/browser cases passed on
the final build. New integration coverage verifies public media/news relationships,
private and missing-locale exclusion, and lead-image withdrawal. The browser
fixture verifies PDF mount/unmount by keyboard, direct access rejection after
withdrawal, loaded image thumbnails, non-autoplay/preload-none video controls,
FR/EN/AR result-region axe scans, and 320px/1440px containment at 200% text.
Synthetic files and records are cleaned up; they are not repository/public content.

Rendered media review at 390px and 1440px in FR/EN/AR confirmed the bounded rail,
stacked mobile layout, image fitting and unchanged physical diagonal corners.
The expanded synthetic PDF viewer was visually inspected. Reviewed public captures:

- [French desktop media result](screenshots/search-previews-fr-1440.png)
- [Arabic mobile media result](screenshots/search-previews-ar-390.png)

PDF rendering and office-file support depend on the visitor's browser; direct
resource links remain available. Native audio controls are implemented, without
claiming playback testing of a real approved audio asset. CMS thumbnails currently
use the original guarded image bytes lazily; no new cached derivative service was
introduced. Full CI runs before merge. No deployment or publication was performed;
Safari, physical-device and manual screen-reader coverage are not asserted.

## Homepage research domains — 2026-10-09

Delivered the owner-requested seven-theme module directly below missions, using
source-preserved French axis titles and explicitly requested FR/EN/AR working
copy. Preserved the strategy bytes and SHA-256, analyzed its proposal status and
registered central theme anchors plus search descriptions and six new media.
The original source document and screenshot references are not public assets.

Checks passed: `pnpm lint`, `pnpm typecheck`, `pnpm test` (99 tests),
`pnpm test:integration` (22 tests), `pnpm build`, `pnpm format:check`, and
`git diff --check`. The complete production-browser suite passed **155 tests**
before the final removal of optional word hyphenation. The final build's focused
research suite then passed **7 tests**, including three new real search-to-theme
and media-discovery cases. No application/database dependency changed.

Browser execution used the installed Google Chrome executable because the pinned
Playwright headless-shell binary was absent. A temporary config served the
production build on port 3001, preserving the unrelated existing 3000 server.
FR/EN/AR: all seven themes selected by Enter; exactly one panel open on desktop;
four axes and the correct loaded image per selection; hash results reveal the
matching theme; mobile controls can open and close; 320/390/768/1024/1440px
containment and 390px at 200% text pass. Native no-JavaScript grouping and the
canonical discovery action pass. Scoped axe scans at enlarged text report no
violations, with existing whole-homepage axe coverage passing in the full suite.
These checks do not establish screen-reader or full WCAG conformance.

Rendered desktop and mobile captures were inspected for hierarchy, wrapping,
navy/blue surfaces, dividers, image composition and Arabic direction. Removed
optional automatic word hyphenation after review; long words still wrap safely.
At mobile sizes the axis label sits above its title for readable enlarged text.
The illustrative scenes were inspected together, confirming seven relevant
subjects (including the reused renewable-energy image) without facility claims.
Review captures isolate the component by hiding the existing fixed skip link
and sticky section bar only during screenshot capture; those controls remain in
the real page and retain their established behaviour.

- [French desktop](screenshots/2026-10-09-home-research-fr-desktop.png)
- [French mobile](screenshots/2026-10-09-home-research-fr-mobile.png)
- [English desktop](screenshots/2026-10-09-home-research-en-desktop.png)
- [English mobile](screenshots/2026-10-09-home-research-en-mobile.png)
- [Arabic desktop](screenshots/2026-10-09-home-research-ar-desktop.png)
- [Arabic mobile](screenshots/2026-10-09-home-research-ar-mobile.png)

Local `pnpm search:rebuild` synchronized the static catalog; no public CMS
records existed, and `pnpm search:work` found no pending jobs. New theme queries
and media destinations work in all three local languages; the source reference
is excluded. Existing integration/browser withdrawal and private-media checks
passed. The final website-wide glossary/search sanity check remains pending,
as the website content is incomplete. No production deployment, DNS, visibility
or indexing permission was changed. Strategy adoption and final locale copy
still require editorial decisions; the discovery page remains a scaffold.

The automatic approval reviewer initially rejected committing/pushing the
original strategy to the public repository because local reference retention
was not explicit public disclosure authorization. The owner then explicitly
authorized the original document in the public repository. Source inclusion is
therefore within that specific authorization; site publication remains separate.

### Owner refinement — larger icons and horizontal axes

The final refinement uses 48px thematic icons and ampersands in French/English
theme labels. Four axes align horizontally; mobile uses a native horizontal
strip with keyboard access in both directions. Below 1024px the selected image
covers the entire section beneath a 90% navy veil. Reviewed FR/EN/AR desktop,
tablet and mobile captures. Production build and all **9 focused browser tests**
passed, including four-axis alignment, icon size, tablet background geometry,
mobile keyboard access, real search discovery and hero image delivery. After
the final mobile-background request, the production build and complete browser
suite passed **158 tests**, including background coverage at 320/390/768px. The hero
download test now scopes requests to that page's actual desktop/mobile variants
rather than counting a below-fold image reused from the same asset directory.

- [French tablet](screenshots/2026-10-09-home-research-fr-tablet.png)
- [English tablet](screenshots/2026-10-09-home-research-en-tablet.png)
- [Arabic tablet](screenshots/2026-10-09-home-research-ar-tablet.png)

## Homepage news — 2026-10-09

Implemented the requested `news-events` module, five LinkedIn source links,
short explanatory FR/EN/AR headings, owner-supplied month-only dates, animated
one-card navigation and removal of the visible original-language indicator.
See [scope, sources and screenshots](home-news.md).

- `pnpm lint`, `pnpm typecheck`, `pnpm test`: passed (109 unit tests).
- `pnpm test:integration`: passed (22 checks) in a dedicated temporary migrated
  database, removed afterward; the existing local database was preserved.
- `pnpm build`: passed for the final runtime.
- Full Playwright suite: 164 passed using installed Chrome and the production
  build on isolated port 3012. The initial direct `pnpm exec` invocation omitted
  local database environment variables; rerunning through `scripts/run.mjs`
  resolved those two environment failures. An earlier run against the existing
  port 3000 was discarded in favor of the dedicated production preview.
- New module checks cover FR/EN/AR at 320, 390, 768, 1024 and 1440px, all five
  links, localized titles, monthly `time` semantics, scroll/focus access, arrows,
  no-JavaScript scrolling, normal/reduced motion and zero scoped axe violations.
- Rebuilt the local search catalog. API checks discover each locale's localized
  Majan Council title at its stable homepage card anchor. Unit checks verify all
  15 localized card references, section references and Posts API eligibility
  exclusions, including foreign-author, dark, sponsored, draft and unselected posts.
- Inspected actual French desktop and Arabic mobile screenshots for reading order,
  typography, wrapping, surfaces, dates and RTL arrows. Browser coverage also
  includes the existing enlarged-text and navigation/accessibility suites.
- Focused formatting and `git diff --check`: passed. No dependencies, CMS schema,
  source SVGs or public media files were changed; screenshot files are review
  evidence outside `public/`.

Live LinkedIn API calls, OAuth, scheduled imports and external deletion events
are not implemented or claimed. The projection boundary is tested with synthetic
API inputs; initial source text was read from public guest pages and month dates
were supplied by the owner. No production deployment was performed. The final
content glossary/search sanity check remains pending until the complete content
exists. PR CI and merge status are recorded in the PR rather than preclaimed here.

The owner’s final spacing instruction joins the news surface directly to the
footer. Homepage-only shell/content bottom padding is removed; the section and
footer retain their internal reading space. Browser checks assert no gap across
responsive widths in FR/EN/AR.

## Homepage collaboration — 2026-10-09

Developed the existing collaboration anchor with four audience pathways on the
requested institutional ink ground, the owner-supplied +120 collaborators and
the existing ISO 9001:2015 claim. See [scope and captures](home-collaboration.md).

- Formatting, lint, strict typecheck and production build passed.
- 109 unit tests passed; 22 CMS/search integration checks passed in a dedicated
  temporary migrated database, removed afterward. The local database was preserved.
- Full production Playwright suite passed **168 tests** on isolated port 3013
  using installed Chrome. Four new browser checks cover FR/EN/AR, four destinations, the prepared contact
  subject, search discovery, keyboard access, no-JavaScript access, 320/390/768/1024/
  1440px widths, 200% text and scoped axe scans with no violations.
- The first full suite identified long-word overflow in the new section at 200%
  text. The local section now permits word wrapping; follow-up checks cover 320,
  390, 768 and 1024px at 200%, including internal heading/paragraph containment.
- French desktop and Arabic mobile captures were inspected. Four pathways and
  proof remain visible; arrows mirror, action corners stay physical, and no
  illustrative image is used as institutional evidence.
- Local public search catalog rebuilt. The existing static reference ID, section
  type and `collaboration` anchor remain; localized metadata includes audiences,
  thesis, R&D, decarbonisation, technology choices, +120 and certification.
- Impeccable's scoped mechanical detector returned no findings. No CMS schema,
  route, dependency, SVG original, production deployment, DNS or visibility changed.

The count's perimeter/date and final FR/EN/AR wording remain editorial inputs.
No available thesis opportunity, guaranteed service or funding is asserted.
The final website-wide content/search sanity check remains pending.

### Later certification wording correction

The owner replaced the agency-only claim with “Premier institut de recherche
certifié ISO 9001 en Afrique” in both the homepage hero and collaboration.
FR/EN/AR copy and search references were updated together; ISO 9001:2015 remains
the detailed standard. The corrected runtime passed lint, strict types, build,
109 unit tests and **19 focused production browser checks** for heroes and
collaboration, including 200% text. Final collaboration captures were refreshed
and the French desktop rendering inspected. The local search catalog was rebuilt.

## Homepage platforms and expertise — 2026-10-09

Developed the existing `platforms-expertise` module with the owner-supplied
outdoor photograph, four compact photographic cards, original SVG logos and a
short two-block laboratory-network/expertise band. See [scope, sources and asset
manifest](home-platforms.md). This is an extension of the incumbent visual
system: aligned gutters, established typography, dark readable gradients,
physical signature corners and existing navy/blue/cyan tokens remain.

- Formatting, lint, strict typecheck and production build passed for the
  photographic-card/two-block-band revision.
- 109 unit tests, 22 integration checks and the full production Playwright suite
  (**172 tests**) passed before the later decorative-icon addition.
- Browser coverage for that revision includes FR/EN/AR at 320, 390, 768, 1024
  and 1440px, 200% text, keyboard/focus access, canonical destinations,
  no-JavaScript and reduced-motion behavior, and scoped axe scans with no
  violations.
- Six French, English and Arabic captures at 1440px desktop and 390px mobile
  were visually reviewed for photographic hierarchy, white-text readability,
  wrapping, compact cards, network-band composition and RTL. The reviewer
  accepted this revision for shipping. Review captures are ignored local files
  in `.cache/platforms-review/`, outside served assets.
- Nine supplied asset hashes were verified; the four served SVG logo copies
  match their delivered originals byte for byte. GreenH2A retains its explicit
  in-development wording and 3D-visualization label. Private source chapter
  material remains outside the repository and public search.
- Search checks cover localized section/card/network anchors and all nine
  supplied media references in FR/EN/AR. Responsive image derivatives share
  their original's result; inline decorative geometry creates no separate
  served-media item. The final website-wide content/glossary sanity check
  remains pending until complete content exists.

An earlier owner refinement added a schematic Morocco outline beside laboratories
and a person linked to three nodes beside complementary expertise. These are
non-focusable, accessibility-hidden inline SVGs; they retain physical orientation
in RTL and convey no geographic coverage, precise locations or headcount claim.
After the icon addition, lint, strict typecheck, production build and **four
focused production Playwright checks** passed. The subsequent arrow-selector
correction preserves the decorative icons at 44 × 56px; its production rebuild
and all four focused browser checks also passed. All six final captures were
refreshed with the corrected icons, and final formatting/whitespace checks
passed. The reviewer inspected all six latest FR/EN/AR captures and accepted
that intermediate revision for shipping: decorative icons align with headings,
retain physical orientation and do not overflow; navigation arrows remain 20px. No
material findings remain. The earlier full-suite result retains its pre-icon
revision scope; that icon/selector revision has the focused coverage above.

No new visual world, shared token, dependency, CMS schema or route is introduced;
`.impeccable/design.json` remains unchanged. Achievements, full homepage reordering
and Alliances remain deferred. FR/EN/AR copy remains working text for editorial
review. No production deployment, DNS or visibility change was performed. PR CI
and merge status belong to the PR and are not preclaimed here.

### Later supplied map and enlarged white icons

The owner's supplied `morocco.svg` supersedes the schematic laboratories icon.
The served copy is byte-identical, with white rendering supplied by CSS only.
Both decorative illustrations now occupy responsive 76–112px square boxes;
the intermediate native person/network illustration used a matching-weight
3-unit stroke on a 65-unit viewBox. The later consulting refinement below
supersedes that drawing. Physical orientation is preserved in Arabic. The earlier
44 × 56px review above describes the superseded intermediate revision.

The map adds localized FR/EN/AR public search metadata. The four original logos
keep their gray CSS display.

### Supplied consulting illustration and enlarged-text wrapping

The later owner-supplied `consulting.svg` replaces the native person/network
drawing. Its served original remains byte-identical; the inline illustration
retains the exact source path, white fill and an additional 8-unit stroke on
the 512-unit viewBox, with round joins, to match the supplied map's visual weight.
Both icons retain their white responsive 76–112px square presentation and
physical orientation in RTL. The manifest/search catalog now covers eleven
supplied assets, with FR/EN/AR metadata for both new illustrations.

The enlarged-text check caught narrow network-block headings. Each block now
allows its icon and text to wrap onto separate rows, reserving a 10rem flexible
text basis instead of squeezing the heading beside the icon.

That consulting/map/wrapping runtime passed lint, strict typecheck,
production build, **109 unit tests** and **four focused production browser
checks**. FR/EN/AR checks found no overflow at 320–1440px or with 200% text,
and passed scoped axe, no-JavaScript and reduced-motion coverage. Public search
API checks discover both SVG illustrations at their expected URLs in all three
locales. Six desktop/mobile captures were refreshed for that intermediate revision.
The later owner-requested thinner display below supersedes its icon treatment. The earlier 172-test full suite and 22 integration checks retain
their earlier revision scope.

### Later owner correction — thinner icon outlines

The owner requested less thickness after seeing the supplied illustrations.
The consulting inline display now uses the exact original filled path without
any added stroke. The Morocco inline display also preserves the exact supplied
path and applies a display-only SVG `feMorphology` erosion filter with radius
0.5, reducing its approximately 3-unit outline to 2 units on the 65-unit viewBox.
This matches consulting's approximately 16-unit outline on its 512-unit viewBox.
Both original served files remain byte-identical. White color, responsive
76–112px square presentation, RTL physical orientation and enlarged-text wrapping
remain. This thinner-display revision passed lint, strict typecheck, production
build and all **four focused production browser checks**, including all three
locales' SVG search discovery, 200% text, no-JavaScript, reduced motion and scoped
axe coverage. The reviewer inspected all six fresh FR/EN/AR desktop/mobile
captures and accepted this thinner treatment for shipping: the Morocco outline
remains continuous without gaps, consulting retains clear internal detail,
and white sizing, alignment and RTL remain coherent. No material findings remain.
The earlier full-suite/integration results keep their documented revision scope.

## Homepage achievements — 2026-10-10

Implemented the owner’s eight supplied achievements on white, without outgoing
card links, including the original hydrogen roadmap cover in a CSS report stack.
The request activates the previously agreed six-section order; existing modules,
anchors, routes and SVG originals remain. The later instruction adds slow
six-second automatic single-card movement reversing at both ends, explicitly
without a pause button. Hover/focus suspend it; hidden tabs do not advance;
reduced motion disables automatic movement and keeps manual arrows direct.

Local checks: lint, strict types, formatting, 109 unit tests, 22 integration tests
and the production build passed. The static search index was rebuilt on local
PostgreSQL. FR/EN/AR browser coverage verifies all eight cards and image loads,
no outgoing links, white background, arrow direction/edges, discovery of each
card and media result, direct later-card anchors and no-JavaScript access.
The existing 19 homepage navigation/mission tests passed after reordering.
The additional automatic-rail browser test passed using the browser clock: one
card per interval, reversal at each edge, hover/focus suspension and live
reduced-motion preference changes. Five achievement browser tests passed.

Rendered captures in `.cache/achievements-review/` cover FR/EN/AR at 1440px and
390px plus the final four cards/report mockup. FR desktop, FR mobile, AR mobile
and the FR report presentation were visually inspected. All three locales also
passed containment at 320/390/768/1024px, 200% text at 320px, keyboard rail focus,
reduced-motion checks and scoped axe scans with no reported violations. This
is scoped verification, not a claim of overall accessibility conformance.

The first browser attempt lacked the bundled Chromium; installed Chrome was
used through `PLAYWRIGHT_EXECUTABLE_PATH`. Rendered checks found the missing
Next image-optimizer allowlist entry, now limited to `/images/achievements/**`.
Test setup was corrected to scroll an already-focused rail after viewport
changes and to accept the existing global near-zero reduced-motion duration.
No public CMS access gate was relaxed. The Impeccable mechanical detector
returned no findings; local documentation targets and whitespace passed.

Working translations and owner-supplied “first”/“100%” claims still require
final editorial review; no independent factual verification, deployment, DNS or
visibility change is claimed. The final-content search sanity check remains due
when all website content is ready.

## Homepage innovation pathway — 2026-10-10

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (109 tests), `pnpm build` and
  `pnpm format:check` passed with Node 24.19.0 / pnpm 11.19.0.
- All 22 CMS/search integration tests passed on a freshly migrated, isolated
  temporary local database, removed afterward. The initial shared-database run
  had two search lifecycle failures; isolation removed concurrent worker effects.
- Production rendering on port 3100: FR/EN/AR inspected at 1440px and 390px;
  component reflow checked at 1440, 768, 390 and 320px. Desktop height is about
  394px in FR/EN and 409px in AR, shorter than domains/platforms. Following the
  horizontal-scroll refinement, mobile height is about 600px FR, 577px EN and
  506px AR. Arabic at 200%
  root text size grows without horizontal overflow.
- Local search catalog/index rebuilt with `pnpm search:rebuild`. Stable section
  identity, reachable localized anchor and expanded search body exist in each
  locale. Existing catalog tests verify registration and non-empty text.
- Dedicated browser checks verify horizontal mobile/tablet reflow, automatic progression/reversal, focus and reduced motion, five stages, retained hero figures, section
  order, localized transfer link/navigation, responsive containment and axe scan.
  Full browser-suite results and remote checks are recorded on the pull request.
- Review captures remain ignored under `.cache/innovation-review/`. No deployment,
  visibility change or final editorial/translation approval is claimed.

The remote Chromium run additionally exposed an in-flight smooth scroll when
reduced motion changed. The rail now cancels that motion immediately; the test
lets the preference-change event settle before measuring sustained inactivity.

## Revised narrative and homepage missions — 2026-10-10

- `pnpm lint`, `pnpm typecheck`, `pnpm test` (112 tests),
  `pnpm test:integration` (22 tests), `pnpm build` and `pnpm format:check`
  passed with Node 24.19.0 / pnpm 11.19.0. The quotation-refinement production Chromium suite
  passed all 182 browser tests, including localized mission destinations,
  full-width quote/band alignment, keyboard operation and enlarged text.
- Additional production review visited all 22 canonical pages in FR/EN/AR
  (66 page visits, HTTP 200), checked every registered static section destination,
  the three retained legacy mission anchors and all new card destinations.
- Fifteen mission captures cover 1440, 1024, 768, 390 and 320px in each locale.
  FR desktop/mobile, EN mobile and AR desktop were visually inspected after the
  owner's smaller-quotation refinement. All locales passed page containment,
  200% text at 320px and scoped mission axe scans without reported violations.
  The card-region name was differentiated from its parent section after axe
  identified a duplicate landmark name; cooperation headings now wrap under
  enlargement. This is scoped verification, not whole-site conformance.
- `pnpm search:rebuild` synchronized the static catalog (zero public CMS records).
  Live API checks found all four contribution section destinations by their
  localized titles in FR/EN/AR. Unit checks cover stable identities, current copy,
  retained legacy destinations and exclusion of the private source.
- After the owner's additional card reference, the three purpose overlines moved
  above the domain h3 titles: label size (14px at default root), weight 400,
  uppercase with 0.08em Latin tracking and natural Arabic. Lint, build and
  sequential typecheck passed again; all 19 mission/navigation browser tests
  passed, including 200% text. FR/EN/AR computed-style/position checks and scoped
  axe scans passed; six desktop/mobile captures were produced and FR desktop
  was visually inspected. The visual H4 role remains introductory text so the
  domain headings preserve their coherent semantic outline.
- After the owner identified unequal quotation marks, both inherited glyphs
  were harmonized. FR/EN/AR browser measurements confirm identical font, size,
  weight, line height and color for each opening/closing pair. FR was visually
  inspected, and the owner's existing local preview was reloaded. Lint, build,
  typecheck and all 19 mission/navigation browser tests passed again.
- The owner's subsequent spacing correction supersedes the detached opening
  layout: both marks are inline in the same paragraph, sharing blue color and
  weight 500, with symmetrical French narrow non-breaking spaces. The production
  preview was reloaded and FR visually inspected. Build, lint, typecheck and all
  19 mission/navigation browser tests passed; paired inline typography is now
  covered by the existing localized mission browser checks.
- The owner's latest refinement centers “Notre mission” and the statement, with
  balanced line wrapping and retained full available width. Lint, build,
  sequential typecheck and all 19 mission/navigation browser tests passed again.
  FR/EN/AR computed alignment and desktop/mobile containment passed; six captures
  were produced and FR desktop visually inspected. The owner's preview was reloaded.
- The three previously indexed repository DOCX originals retain their pinned
  hashes. The new DOCX was read locally; only derived editorial guidance was
  added. No original, private download, CMS schema or new route was imported.
- The Impeccable mechanical detector reported no findings before the final
  bounded typography refinement. Formatting and whitespace were checked again.
  A simultaneous typecheck/build attempt encountered generated-type churn;
  the sequential final typecheck passed after build completion.

The whole-site disposition and source correction are recorded in
[narrative alignment](narrative-alignment.md). Catalog adaptations and AR copy
remain working editorial texts; institutional scaffolds still await supported
final content. No deployment, visibility change or final translation approval
is claimed. The final-content search sanity check remains due.

## Collaboration and valorisation pages — 2026-10-10

- Formatting, lint, sequential typecheck and production build passed.
- 113 unit tests and 22 database integration tests passed. The new search contract verifies detailed page and section bodies in every locale.
- All 189 Chromium browser tests passed locally, including seven new collaboration/transfer journeys. Those cover six reachable sections, contact topic selection, keyboard disclosures, 1440/768/390/320 widths, 200% text, scoped axe scans and Arabic without JavaScript.
- The initial checks identified checklist/disclosure min-content overflow at 200% text and ink-panel contrast; the final runs include their corrections.
- Twelve desktop/mobile captures were generated for both pages in FR/EN/AR. French desktop and Arabic mobile were visually inspected; native viewport inspection confirms that fixed skip-link artifacts in tall element captures are not visible in ordinary browsing.
- The local search index was rebuilt; all six localized closing-section titles retrieve their exact reachable section URLs through the real API. No public CMS record was created.
- Routes, all twelve anchors, existing hero/assets, public CMS eligibility and local contact-draft behavior remain. No deployment or final institutional/translation approval is claimed. Scoped axe coverage is not whole-site conformance certification.

See [delivered scope](collaboration-transfer-pages.md). The final-content search sanity check remains pending. Current remote CI and merge outcomes are recorded in the pull request.

## Valorisation and patent catalogue — 2026-10-10

- Formatting, lint, sequential typecheck, 116 unit tests and production build passed.
- 22 integration tests passed against a fresh temporary database, removed afterwards; the existing local database was preserved.
- All 196 Chromium browser tests passed locally. The seven new patent journeys cover combined filters, 59 records, original register links, contact prefill, canonical search destinations, direct late-record anchors and Arabic without JavaScript. Existing hero tests now verify the commissioned transfer action destination.
- FR/EN/AR checks cover 1440/1024/768/390/320 widths, 200% text and scoped axe scans. Desktop/mobile captures cover the process, catalogue, cards and new photographic sections. French desktop and Arabic mobile were visually inspected.
- The final source review removed a repeated metadata label ID; the affected catalogue journeys were rechecked after the final build.
- The Impeccable mechanical scan of the transfer components reported no findings. Existing platform photographs and licensed Tabler paths were reused; no generated imagery or new dependency was introduced.
- The local search index was rebuilt with 177 localized patent destinations. Source workbook and omitted administrative fields remain outside the public index. CMS access/publication gates and the contact email-draft workflow remain.

See [scope and provenance](valorisation-patents.md). No deployment, visibility change, final translation approval or patent legal-status verification is claimed. Scoped accessibility checks do not certify the whole site. The final-content search sanity check remains pending; remote CI and merge outcomes are recorded on the pull request.

## Valorisation reference quarter — 2026-10-10

The public reference date and catalogue footer now use the fourth quarter of
2026 in FR/EN/AR. Formatting, lint, typecheck, 116 unit tests and production
build passed. The seven existing patent browser journeys passed, including
mobile/RTL, 200% text, axe and canonical search destinations. French desktop
and Arabic mobile captures were inspected. The local search catalogue was
synchronized after the wording change. Exact source provenance stays internal;
no database/schema, route, deployment or visibility change is introduced.
Remote CI and automatic merge are recorded on the corresponding pull request.

## Compact patent catalogue — 2026-10-10

Formatting, lint, typecheck, 116 unit tests and production build passed.
The 15 affected browser journeys passed in Chromium: FR/EN/AR filters, direct
anchors, search/contact, 320–1440px, 200% text, scoped axe and no JavaScript.
A new motion check verifies the desktop filter row, control target sizes,
actual card animation frames and dynamic/static reduced motion. French
desktop and Arabic mobile captures were inspected. At 1440px the first card
row measures about 334px instead of 513px before this change (35% less).
The mechanical design scan reports no findings. Data, text, public search
references, routes and publication gates remain; no deployment is performed.
Remote full-suite CI and merge outcomes are recorded on the pull request.

## French T4 label — 2026-10-10

The two French reference-period labels now use **T4 2026**. Formatting, lint,
typecheck, 116 unit tests and production build passed. Chromium confirms both
rendered labels and mobile containment at 390px. The local search catalogue
was synchronized; source provenance, quarter, data and other locales remain.
Remote CI and merge are recorded in the pull request.
