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

## Homepage restructuring documentation — 2026-10-09

Compared the supplied `Pasted text.txt` with the current homepage renderer,
seven-section map, canonical page definitions, product/design guidance and
earlier P01 recommendations. Recorded its 5,752-byte size and SHA-256 in
[the new brief](homepage-restructure.md). The six-section target, supplied mission
and collaboration wording, composition counts, named candidates and event fallback
remain planning evidence, not implemented modules or independently verified claims.

Passed focused checks for all ten changed/new Markdown files: pinned Prettier
3.9.9 formatting, Git whitespace, 17 added/new local links and document anchors,
exact supplied mission wording and candidate names, six planned sections,
referenced current page/section IDs and unchanged strategy-source SHA-256 hashes.
The seven runtime homepage placeholders and all runtime/assets remain unchanged
by this increment. No YAML frontmatter or routing definition is introduced. Application,
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
