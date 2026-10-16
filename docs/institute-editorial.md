# Institute editorial composition — 2026-10-16

The owner commissions the **Éditorial** variant from the supplied
`IMPLEMENTATION_CODEX.md`, `iresen-institut-preview.html` and standalone
`iresen-institut-apercu.html` in the external `IRESEN_Institut_Design_Codex`
folder. These files remain read-only references, outside the application,
repository imports and public search. Embedded recommendations do not confer
publication, deployment or merge approval. The comparison variant and preview
controls are not application features.

## Delivered scope

The existing Institute hero precedes a white typographic mission, with blue
emphasis, the complete exact institutional statement and the requested slogan.
Positioning connects national priorities, science and socioeconomic needs with
three ruled labels and the existing public-policy responsibility qualification.
The retained research-institute benchmark informs purpose before means and
progressive technical detail; its supplied original is unchanged.

One navy R&I core is paired with three native complementary disclosures. Their
short activity lists replace the repeated detailed mission chapters and separate
cooperation band. A light R&I focus uses three visible tabs, a short explanation,
four concrete activities per verb and existing canonical onward links. A brief
closing expresses technological mastery/value for Morocco as a purpose, without
asserting measured adoption or a compulsory project pathway.

`InstituteEditorial` and `InstituteModel` reuse Heading, SectionEyebrow,
NavigationIcon, licensed Phosphor SVGs and current shared tokens. No new font,
palette, media, dependency, route or CMS model is introduced. The mission,
contribution and verb anchors remain reachable. Values, ambition, chronology,
report, hero and their concurrent refinements are preserved.

There is no shared tab primitive in the current component inventory. The small
local `ResearchTabs` enhancement supplies roving focus, mirrored RTL arrow keys,
Home/End, Enter/Space, selected state and labelled panels. URL fragments select
the appropriate panel, including direct search results. Server HTML contains all
three panels and ordinary section links; JavaScript enhances them into tabs.
Native disclosures work independently of JavaScript. The existing reveal and
anchor-motion system retains ownership; the chevron respects reduced motion.

All new copy lives under `Institute.editorial` in FR/EN/AR. Existing exact mission
strings remain byte-for-byte equal. English/Arabic remain working adaptations.
Existing section search references now project the replacement copy and concrete
activities. Superseded mission chapters and the ecosystem diagram are no longer
projected through the Institute page body. No source reference file is indexed.

## Verification ledger

- Scoped ESLint, changed-file Prettier, translation-key parity/nonempty copy and
  whitespace checks: pass. Impeccable's mechanical detector: no findings.
- Development browser: FR/EN/AR at 320, 390, 768, 1024 and 1440px; no page overflow
  or clipped tab labels. Desktop/mobile captures inspected, including Arabic
  native reading direction and open disclosures. Narrow interface labels stack
  to avoid breaking long English terms into arbitrary fragments.
- Development interactions: tab pointer selection, keyboard selection, mirrored
  Arabic arrows, direct `#institute-model-transfer` selection and native disclosure
  opening confirmed. All three verb labels remain available on mobile.
- Development search: French `Codéveloppement` returns the Develop anchor;
  English `Entrepreneurial support` returns Valorise; Arabic
  `الدبلوماسية العلمية` returns the cooperation anchor. These requests synchronize
  the changed static catalogue locally. Public eligibility gates are unchanged.
- Existing Institute E2E assertions now cover the editorial composition, keyboard
  tabs, direct links, native disclosures and all server-rendered panels without
  JavaScript. Narrative search assertions include the concrete verb activities.
  These suites have **not** run while the coordination hold is active.
- Production build, full unit/integration/E2E/axe, 200% text review and final-head
  CI remain pending for the coordinator's frozen batch. Available shell Node is
  24.19.0; the repository requires 24.22.0/pnpm 11.28.2 for final verification.
  No production-performance or full accessibility-conformance claim is made.

No commit, push, CI dispatch, merge or deployment is performed during the hold.
The narrative review branch also retains its separate explicit owner GO gate.

## Owner refinement — 2026-10-16

Remove the separate project-pathway qualification beneath the activity tabs in
FR/EN/AR, including its locale keys and therefore its search projection. Tighten
mission, positioning, contributions, research-focus and closing section padding
to the existing 24px spacing token, replacing 32–48px section padding and 48px
closing padding. Existing content hierarchy, tabs, anchors and concurrent work
remain. Scoped formatting/lint/whitespace and development render checks apply;
full checks/CI/Git retain the coordination hold.

Follow-up verification: FR1440 computed section padding is 24px; AR390 retains
RTL and no page overflow. The removed note is absent from rendered FR/AR and all
three locale catalogs. Local search for `présumer` now returns only unrelated
roadmap/cooperation content, with no Institute result. Scoped lint, format and
whitespace pass.

## Dark positioning diagram — 2026-10-16

The owner's two supplied screenshots commission contrast and a diagram for the
existing positioning section. The long explanatory passage is explicitly context
only and is not inserted. Existing short FR/EN/AR strings are reused without new
claims, translation keys or copies of the supplied screenshots.

The section now spans the viewport on institutional navy. The original white
brand SVG occupies the common intersection of three outlined/translucent circles:
national priorities, scientific research and socioeconomic actors. Labels remain
native text in a labelled figure, with existing interface-role copy as its caption.
Four existing common-capability labels sit alongside: expertise, R&D&I programmes,
platforms/laboratories and partnerships. The policy-responsibility qualification
remains. Circle overlap expresses a common interface, with no arrows implying a
compulsory delivery sequence or organisational authority.

Below 40rem, three naturally growing labelled nodes connect to one IRESEN hub;
this replaces scaled-down overlapping circles. Logical connectors retain Arabic
reading order. Diagram content precedes capacities in mobile reading order. SVG
geometry is decorative; the official logo remains unchanged. The existing section
anchor and search reference now include the diagram role and capability wording;
the white brand asset already has its media reference. No new route/media source,
package, animation or interaction is introduced.

Development review covers FR/EN/AR at 320, 390, 768, 1024 and 1440px. The scoped
editorial layout and diagram labels stay contained; desktop and Arabic mobile
captures were inspected. Arabic at 320px still reports a 344px document scroll
width outside the contained editorial block; no unrelated shared layout is edited.
Scoped ESLint/Prettier/whitespace pass; the detector reports no findings. Existing
responsive/search regressions now assert the native diagram/logo/capacity content;
their suite and production/axe/200% review remain pending under the hold.

Development search confirmation: queries using each locale's diagram-caption
wording return `#institute-positioning` in FR/EN/AR. The static catalogue is
synchronized locally. Final screenshot:
`.local/institut-editorial/positioning-dark.jpg` (ignored review artifact).

## Dark editorial closing — 2026-10-16

The owner requests Taste/Impeccable refinement of the existing closing. Targeted
evolution preserves the institutional type/palette and all FR/EN/AR words.
A full-width navy band pairs a larger native two-line heading (white, then Cyan)
with three ruled topic rows and existing licensed Phosphor SVGs. It uses a compact
32px vertical inset and stacks naturally below 40rem, with logical dividers in
Arabic. No cards, extra copy, CTA, media, token, dependency or motion is added.
The existing editorial search projection already includes the unchanged strings;
no index rebuild or additional public resource is needed.

Scoped formatting/lint/whitespace and development desktop/mobile/RTL inspection
apply. Full tests/build/CI/Git remain subject to the shared hold.

Closing verification: FR/EN/AR at 320, 390, 768 and 1440px remain contained,
with two heading spans and all three topics. Desktop and Arabic mobile renderings
inspected; scoped lint, format, whitespace and detector pass. Review capture:
`.local/institut-editorial/closing-dark.jpg`. Full verification remains held.

## Positioning footer withdrawal — 2026-10-16

The owner's screenshot removes both the diagram's visible interface-role caption
and the public-policy qualification/footer rule from the positioning section,
in every locale. The figure retains a localized accessible name using its existing
ecosystem title. Institute page/section search projections withdraw the removed
copy; shared narrative strings used elsewhere remain intact. Regression assertions
now require their absence from the positioning search result. No other block changes.

## Positioning pole icons — 2026-10-16

Owner adds three decorative regular-weight Phosphor SVGs: Target for national
priorities, Atom for scientific research, Buildings for socioeconomic actors.
The shared SiteIcon primitive hides them from assistive technology; existing
native labels retain meaning. White 32px glyphs sit above the desktop labels,
reducing to 24px in mobile nodes. Geometry, original logo and all locale wording
stay unchanged; no new public media/search entry or dependency is introduced.

Icon verification: FR1440 and AR390 renderings inspected; all three icons and
native labels remain contained at AR320/390/768. Label scrollWidth includes the
intentional external branch connectors, so visual/text containment is assessed
separately. Scoped lint/format/whitespace pass. Review capture:
`.local/institut-editorial/positioning-icons.jpg`. Full checks/CI/Git remain held.

## Contribution alignment and exclusive disclosures — 2026-10-16

Owner aligns the title/introduction with the complementary-dimension labels.
One shared desktop grid now places the navy core from the title's upper edge to
the last disclosure's lower edge. Its content is vertically centered. The overline
occupies a preceding full-width row. Effective outer top/bottom spacing uses the
same fluid gutter as the left/right container inset; the core also uses this
equal four-side padding. Tablet/mobile retain natural reading order and stacking,
without fixed text heights or clipping.

All three native details share `name="institute-complementary-dimensions"`, so
opening one closes the previous one, including without application JavaScript.
This prevents cumulative expansion of all three bodies; content still grows
naturally with text and viewport. Routes, labels, copy and search stay unchanged.
Existing browser regressions now assert exclusivity and desktop alignment.
Full suites/build/CI/Git remain held by coordination.

Contribution verification: development FR/EN/AR at 390/768/1440px stays contained.
At 1440px, title/core upper edges, last-disclosure/core lower edges and heading/
disclosure text alignment differ by 0px in each locale. Native opening of Skills
then Cooperation leaves exactly one open item in each language. FR1440 effective
outer inset is 45px in all four directions (side spacing is the shared container's
margin, not CSS padding). Scoped lint/format/whitespace pass; browser regression
suite remains pending under the hold.

Positioning spacing correction — 2026-10-16: owner tightens the paragraph-to-
capacities gap. Desktop now uses an intrinsic first grid row and a flexible
second row, with a 16px gap; the spanning diagram no longer distributes surplus
height above the capacities heading. Tablet/mobile retain their existing stack.
No content, search or interaction change.

## Balanced Institute section rhythm — 2026-10-16

The owner requests slightly more breathing room without excessive scrolling.
A page-local `--section-space: clamp(2rem, 2.8vw, 2.5rem)` unifies normal Institute
section insets at 32–40px; shared site tokens are unchanged. Mission, positioning,
contributions, research focus and closing now consume this same role. Values,
history and report inherit it through their existing section rules. This supersedes
the contributions' previous vertical-gutter coupling while preserving its grid
alignment and equal inner navy padding.

To offset the larger editorial insets, the desktop mission title-to-copy gap
reduces from 48 to 32px and activity-panel vertical insets from 32 to 24px. The
positioning paragraph-to-capacities gap remains 16px. Side gutters, native rails,
exclusive disclosures, all content/search, the values' portrait clearance, mobile
ambition's explicit 48px padding and report-cover overlap geometry are retained.

Spacing verification: hydrated development FR1440 reports 40px normal section
insets; EN768 and AR390 report 32px. Values keep their additional 32px portrait
clearance. Editorial content remains contained in all three views; mobile Arabic
and desktop transitions inspected. Formatting/whitespace pass. No full checks,
production evidence or scrolling-reduction percentage is claimed during the hold.

Activity bullet refinement — 2026-10-16: owner replaces unmarked complementary
activity lists with compact signature-blue Apex Leaf bullets from the unchanged
supplied SVG. Logical two-track rows keep continuation lines aligned and mirror
reading order in Arabic, with only 4px between items. Explicit list semantics
survive Safari's list-style reset. All three accordions share the treatment;
content, search, native exclusivity and dependencies are unchanged.

Bullet verification: FR1440 and AR390 development captures confirm original
blue leaf markers, readable wrapping and no activity-row overflow. Scoped lint,
format and whitespace pass. Full tests/build/CI/Git remain held.

## Mobile ambition contour and bottom edge — 2026-10-16

The owner rejects the narrow mobile quotation column and requires left-aligned
French text to follow the woman's silhouette while her base remains aligned with
the section bottom. The latest correction supersedes the previous full-paragraph
right padding/absolute-image workaround.

`AmbitionQuote` isolates a small mobile layout enhancement. Its exclusion outline
is sampled from the actual unchanged 493×700 portrait's alpha channel (threshold
31, 16px row sampling), with 12px clearance. It finds the smallest native paragraph
height fitting that bottom-anchored outline using a bounded measurement pass.
Resizing, font loading and enlarged text trigger a refit; there is no scroll loop,
animation dependency or rewritten quotation. Initial server/no-JavaScript content
uses full-width text above the bottom-aligned portrait. Desktop/tablet composition,
copy, original image bytes/provenance and search references remain unchanged.

Development checks: FR/EN/AR at 320, 390 and 640px remain contained; after the
existing arrival transition, portrait/section bottom differences measure 0px.
Native quotation height contains the paragraph in the inspected states. Opening
lines use the width above the portrait, then follow its head/shoulder/arm contour.
French remains aligned left; Arabic retains its own text direction. Existing E2E
assertions now cover bottom alignment at mobile widths and enlarged text, but
full suites, production build and CI remain pending under the shared hold.

Final contour follow-up: FR390 after the existing arrival transition measures a
0px portrait/section bottom difference. At 768px the mobile enhancement disables
itself and the existing tablet composition remains active. Scoped ESLint,
Prettier and whitespace pass. Screenshot:
`.local/institut-editorial/ambition-contour-bottom.jpg` (ignored local review).

## Contribution image and closed disclosures — 2026-10-16

The owner aligns the heading and introduction with the leading accordion icons.
The navy core card reuses the existing generated Develop laboratory illustration
(`missionImages.develop`, provenance in `docs/mission-assets.json`) as an empty-alt,
non-interactive decorative image in its physical upper-right corner. A directional
mask fades it into navy; text remains above it. Original image bytes and the
existing localized `mission-develop` public search reference remain unchanged.
This illustration makes no claim about a real facility or staff.

All three native disclosures now start closed; their shared name still allows
only one open at a time. Responsive E2E assertions follow icon alignment and
initial closed state. Development preview confirms FR desktop alignment and
exclusive opening; full tests/build/CI remain pending under the shared hold.

Final scoped verification: FR/EN desktop heading/icon alignment measures 0px;
AR390 has no component/page overflow and starts with zero open disclosures.
FR native clicks leave only the last disclosure open. Scoped ESLint, Prettier
and repository whitespace checks pass.

## Readable, automatic research pathway — 2026-10-16

The owner explicitly commissions slow automatic progression and more obvious
clickable Develop / Test / Valorise steps. This request overrides the motion
skill's default avoidance of autoplay for this bounded interaction. Preserve the
existing institutional typography, navy/blue, exact research content and links.
This Read-mode composition uses a connected numbered route, visible outlined
controls and a filled current step. Numbering explains this requested sequence;
it does not assert that every project completes every stage.

The pathway changes every 20 seconds while sufficiently visible. Its active
step has a linear time indicator; content uses one short opacity transition.
A labelled pause/resume control is supplied in FR/EN/AR. Pointer hover, keyboard
focus, hidden browser tabs and offscreen content suspend the timer; a full reading
interval restarts on return. Manual step selection pauses playback until resumed.
Reduced-motion preference disables automatic changes and progress animation.
Automatic changes never alter focus, URL or scroll; manual links preserve deep
anchors. All panels share a grid cell to reserve their maximum natural height and
avoid pushing subsequent sections on each change. Inactive panels are invisible,
aria-hidden and inert. Without JavaScript, links and all three contents remain
readable. No animation dependency is added.

Existing canonical section/search references remain; the research projection also
names the localized pathway. New control copy remains working editorial text.
Development preview verifies FR desktop automatic progression, stable panel grid,
readable connected controls, and AR390 layout without page overflow. E2E coverage
adds timer advancement, manual pause, stable height, unchanged automatic URL and
reduced-motion state. Those suites/build/CI remain unrun under the shared hold.

Final development checks also cover FR320 and EN768 with no page/component
overflow, manual AR selection pausing playback, and English keyboard selection.
All three enhanced panels reserve equal grid height. Scoped ESLint, formatting
and whitespace checks pass. Reduced-motion/timer E2E assertions are authored;
the complete browser suite remains pending under the shared hold.

## Faster pathway without a playback button — 2026-10-16

The latest owner correction removes the visible Pause control and shortens each
stage from 20 to 10 seconds. The panel opacity transition drops from 250 to 180ms;
the progress indicator uses the same 10-second duration. Hover/focus temporarily
suspend playback, while a manual stage choice stops automatic progression for
the remainder of the mounted page so visitors can read at their own pace. All
three stages remain manually selectable. Reduced motion/offscreen/hidden-tab
handling, stable grid height, native deep links and keyboard/RTL behavior remain.
Remove unused localized pause/resume labels from the public editorial projection.
Development FR preview confirms no button, 10000ms duration and a running pathway.
Update the existing fake-clock E2E coverage; full suites/production/CI remain held.

## Mission quotation marks — 2026-10-16

The owner frames the existing exact mission statement as a quotation with large
opening/closing guillemets in signature blue `#296BB4`. Decorative aria-hidden
marks flank the original paragraph: opening mark at its top and closing mark at
its base. Fluid 48–80px sizing, logical grid tracks and mirrored Arabic marks
preserve natural reflow. The native blockquote, mission wording, search projection
and canonical anchor remain unchanged. FR1440 inspection shows both 64.8px blue
marks without overflow; AR390 retains RTL and has no component/page overflow.
This reversible typography refinement adds no redundant test; existing exact-copy
assertions remain valid. Scoped lint/format/whitespace pass; full checks remain held.

## Researched editorial quotation — 2026-10-16

The owner rejects the small side-column guillemet treatment and requests visual
research before redesign. Consulted Monotype/MyFonts' [Pull Quotes guide](https://cms.myfonts.com/sites/default/files/2023-09/Manual-Pull-Quotes.pdf)
and [Pentagram's typography approach](https://www.pentagram.com/typography), with
the retained institute benchmark and current IRESEN identity. Adopt the principle
of deliberate scale, column span and coherent spacing; copy no foreign brand,
font asset or sample statement. The exact institutional mission stays intact.

Replace the split slogan/quotation row with a full-width editorial statement.
The slogan sits beneath the title; the quotation follows between two fine blue
rules. Curved opening/closing double marks use the existing Latin font, enlarged
in signature blue and hanging outside the text measure. Paragraph type grows to
26px maximum, with a 75ch measure, generous leading and fluid logical insets.
There is no boxed card, new surface, shadow, image or animation. Arabic keeps
native text direction and mirrored decorative marks; both marks remain aria-hidden.
The latest composition supersedes the preceding three-track guillemet variant.

Development review: FR1440 shows the complete statement across three comfortable
lines; AR390 retains 18px text without quotation/page overflow. Existing exact-copy
assertions and search anchors remain valid; source references are documentation,
not public media. Scoped formatting/lint/whitespace checks pass. Full suites,
production build, CI and Git operations remain held by shared coordination.

## Supplied Green Energy Park core photograph — 2026-10-16

The owner replaces the generated laboratory image in the navy core card with
`Main green energy park picture.jpg`. Only a metadata-stripped proportional WebP
(1280×721, 100250 bytes) is imported; the original remains in the owner's data
room and is unchanged. Source/output hashes and transformation are recorded in
`institute-assets.json`. The researcher remains visible with 70% horizontal
object positioning; existing navy luminosity blend and directional fade remain.
The image is decorative within the already-labelled core card and has empty alt.

Register the exact file in Next image local patterns and localized public search
references under `institute-green-energy-park-research`; no duplicate gallery
entry, person identity, scientific result or inferred project claim is added.
The old generated asset remains used elsewhere, with its provenance unchanged.
FR1440 development inspection confirms the optimized photo loads and the crop/fade
keep the text readable. Scoped ESLint, formatting and whitespace checks pass;
full browser suites, production build, CI and Git remain held.

Localized search verification: the local API returns the new asset reference
in FR, EN and AR (all inspected queries succeed); its URL points to the WebP.

Cross-page navigation correction — 2026-10-16: accordion hrefs/anchors were
correct, but the destinations hit localized redirect loops. Resolve canonical
localized pages and the news listing directly, with one shared locale-aware path
resolver. Native clicks on all three French accordions now reach the intended
Network/Cooperation sections. See the [site-wide audit](internal-links-2026-10.md).

Final batch reconciliation — 2026-10-16: register the new supplied hero/laboratory
photographs and the fictional ambition illustration derivatives in the shared
fingerprinted provenance inventory. Fictional images remain excluded from public
search, and responsive/foreground variants share their original asset reference.
The research section search projection now includes the descriptions actually
rendered from `Narrative.missions`; its regression assertion follows that source.
The shared heading primitive accepts semantic `h1` for the standalone patent page.

First frozen-batch results: repository formatting and ESLint passed; all 32
integration tests passed against a disposable PostgreSQL 17.11 database. The
unit/provenance checks and production TypeScript check identified the corrections
above. Their final rerun and exact-head CI remain required before merge; these
initial results do not claim that the corrected batch has passed.

Second frozen-batch reconciliation: production compilation now passes, including
TypeScript. The retained original GEP-MCI photograph has its own public search
asset reference; the current campus photograph remains the page visual. Institute
browser tests now declare native JSON import attributes required by Node 24.
Final unit/browser results and exact-head CI remain pending.

Production browser reconciliation — 2026-10-16: the complete initial run reports
332 passes, 21 failures and 9 environment-gated skips. Corrections address
localized unknown paths hanging on self-rewrites, encoded Arabic news listing
and article paths, stale filters hiding a newly targeted patent, and the exact
640px Programmes action overflow. Step numbers now retain full contrast.

Regression expectations follow the commissioned standalone patent page, current
patent search destination, structural positioning diagram, start-aligned network
filter rail and viewport-sized roadmap display headings. Institute accessibility
scans use reduced motion to inspect settled content; dedicated motion tests remain.
A consent-test browser closed during navigation before assertions; its isolated
rerun remains required. No failed assertion is waived and no CI check is removed.
