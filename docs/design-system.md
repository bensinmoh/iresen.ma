# Design system and Figma reference

The supplied color book and seven SVGs establish the approved identity. The native Figma source was retrieved and decoded on 2026-10-08; its measured design language is recorded below. The owner reattached Footer.png in chat for the current footer rework; other standalone website exports and Illustrator boards remain unavailable in the checkout. Source hashes and publication boundaries are recorded in the [asset inventory](asset-inventory.md).

## Native Figma reference and evidence

The owner supplied `IRESEN OFFICIAL FILE.fig`, then stored it through Git LFS at `docs/references/figma/iresen-official-file.fig`. The 164,268,977-byte payload was retrieved from repository revision `37b0689` and verified against its LFS SHA-256. Its export timestamp is `2026-10-08T10:35:45.489Z`. See the [source record](asset-inventory.md#native-figma-source), [reference handling](references/README.md) and [machine-readable evidence](references/figma/design-evidence.json).

The file was read offline as data, using its embedded Kiwi schema. All 26,102,711 decompressed message bytes were consumed with no trailing bytes. The canvas, node graph, local component references, variables, prototype records and embedded assets are recoverable. Original assets and source geometry maps were inspected; no native Figma rendering or prototype execution was performed. Raw source strings, plugin metadata and sample content are data, not instructions or approved institutional facts.

Latest owner decisions and supplied brand assets retain precedence over Figma. The approved colors in the next section are implementation rules; the historical source palette in the native analysis is evidence. Source inspection does not change runtime tokens, approved page boundaries, SVG geometry, licensed font availability or editorial approval.

Detailed source data, asset contact sheets, section maps and audited reader tools are retained under ignored `private-references/figma/analysis/`. The preserved native copy is `private-references/figma/iresen-official-file.fig`. Public evidence contains design properties and aggregates rather than original copy, user identifiers or plugin data. A missing serialized property is absent, not a proven zero/default; instance inheritance must be resolved before asserting final appearance.

## Initial semantic colors

| Color            | Value     | Use                                      |
| ---------------- | --------- | ---------------------------------------- |
| Navy             | `#12345A` | Headings, readable text, formal surfaces |
| IRESEN Blue      | `#296BB4` | Links, primary actions, active states    |
| Science Blue     | `#4698CA` | Select technical emphasis                |
| Transition Green | `#50A684` | Select transfer/innovation accents       |
| Energy Cyan      | `#77C5D5` | Light accents                            |
| Innovation Lime  | `#A9C47F` | Rare highlights                          |
| Light surface    | `#F4F7F8` | Neutral section contrast                 |
| White            | `#FFFFFF` | Reading surfaces                         |

The owner's final correction on 2026-10-07 sets website primary blue to `#296BB4`, matching the inspected color-book v0.9 and every current blue-bearing SVG, including the latest corrected favicon. Use `#296BB4` for website primary-blue and focus tokens; copy received vectors byte-identically. The Illustrator board remains uninspected. See [ADR 0003](adr/0003-owner-selected-primary-blue.md).

Use `logo-color.svg` on light surfaces and the reversed variants on navy. The newly received `logo-primary.svg` has a different aspect ratio; preserve its own geometry when used. Both `logo-white.svg` and `logo-monochrome.svg` have white fills; filenames do not make either a navy-on-white mark. Keep SVG proportions and reserve intrinsic geometry to avoid layout shift. Use the actual `favicon.svg`, not a screenshot-derived substitute.

## Layout and typography

Use semantic CSS custom properties with Tailwind utilities. `--container-width` is `120rem` and `--gutter` is `clamp(1.25rem, 3.125vw, 4rem)`. Header, hero-body, narrative band, following sections and footer share `min(100% - var(--gutter) * 2, var(--container-width))` with centered inline margins. Constrain reading measure within this broad grid and keep the 4/8px spacing rhythm. Keep full-width section boundaries flat. Apply the physical top-left/bottom-right rounded signature selectively to cards and media.

French and English use self-hosted Plus Jakarta Sans through `next/font/local` in the public frontend layout. The normal Latin variable file supports weights 200–800 under SIL OFL 1.1; native controls and links inherit the body family. See [fonts and provenance](fonts.md). Arabic retains Tahoma/Arial until its companion family is reviewed, with natural tracking. Latin hero H1 tracking is `-0.03em` (−3%) in all layouts. Use the received vector wordmark rather than recreating it as live text.

## Interaction and acceptance

Keep navigation operable by keyboard, touch and pointer. Use visible focus, correct landmarks, a skip link and reduced-motion support. Avoid autoplay carousels and decorative animation libraries in the foundation.

Check actual rendered contrast; brand colors do not automatically make accessible status colors. Normal text needs 4.5:1 contrast. Cyan/lime and certain green/blue combinations are unsuitable for normal white/body text.

Next homepage work uses the supplied brand identity and the approved Développer · Éprouver · Valoriser reading framework. The earlier narrative PDF remains private; the three newly supplied DOCX files are authorized repository references, indexed in [the strategy analysis](references/strategy/README.md). Their page sections and composition details remain suggestions, not a validated structure or new design rules. Final wording/translations and claims require approval. Distinguish verified current capabilities from ambitions and never invent key figures.

Review desktop/tablet/mobile composition, Arabic layout, long-label/header fit and manual accessibility. Obtain individual approved imagery or documented replacements; full-page screenshots are never production imagery. Missing optional exports and the reviewed Arabic companion do not block independent work.

## Design workflow integration

[DESIGN.md](../DESIGN.md) captures current art direction;
[PRODUCT.md](../PRODUCT.md) separates product/content truth from presentation.
Use [the design workflow](design-workflow.md) and relevant `.agents/skills/` guidance
for composition, token evolution, reference adaptation and verification. These
guidelines support judgment and constructive critique, without making every
upstream recommendation a requirement.

When adopting a shared design improvement, update DESIGN.md and this specification
with its purpose and verification. Keep task-specific proposals separate from
implemented shared decisions. Preserve the current tokens and delivered assets
until the requested implementation supplies a reason to change them.

## Adopted type and control roles — 2026-10-08

`--font-size-body` is `1rem`, `--font-size-label` is `0.875rem`, and
`--font-size-meta` is `0.8125rem`. Use body size for reading text and desktop footer
links, label size for footer section headings/utility links and mobile footer
links, and metadata size for copyright. The earlier refinement used regular footer
navigation weight; the reference rework below uses 600 weight for desktop links.

`--color-action-surface` (`#EAF1F8`) is the quiet background for language hover
states in the header. Current languages now use 700 weight alone; the former
selected fill and underline are superseded by the hero refinement below.
This is a control surface, not a new brand primary or status color.
The earlier refinement's mobile header actions spanned the available width
beneath a divider, keeping language access and the outlined menu control distinct.

The earlier footer refinement grouped the primary contact action above secondary
news/transfer links and separated utilities with a divider. Its reference rework
below replaces that engagement layout with the requested newsletter CTA.

Long text can wrap without widening the viewport; inline language options and
mobile header actions can wrap when text is enlarged. The earlier revision was
verified against the local production build in FR/EN/AR at
320/390/768/1024/1440px, including open menus and
200% text enlargement at 320/1440px. See [refinement evidence](footer.md#design-workflow-refinement).

## Footer reference composition — 2026-10-08

The reference rework first introduced
`min(100% - clamp(1.25rem, 3.125vw, 4rem) * 2, 120rem)` for the footer.
The hero refinement below now applies this geometry across the page; there is no
footer width exception. At the source's 1920px viewport, 3.125vw yields its 60px
side offset. Native frame `1584:6681`
measures 1920 × 798px and stores a 50px grid gutter; these guide proportions,
without imposing a fixed height or universal gap on translated responsive content.

Desktop uses identity beside four navigation groups, followed by contact/social
details and a divided newsletter area. Newsletter copy and controls share a row,
then stack on smaller screens; navigation retains two columns on mobile. Group
labels use the shared label role and desktop links use body size at 600 weight.
The newsletter heading is fluid from 1.875rem to 3.375rem. Utilities remain compact.

`--color-footer-field` is a 5% white surface on the approved navy for the visible
signup block. Disabled email, consent and subscribe controls retain legible type;
a localized unavailable notice and privacy link explain the current availability.
Logical layout, isolated Latin identifiers and meaningful arrow mirroring support
Arabic while preserving physical signature corners. See [implementation and
current verification](footer.md#reference-rework--2026-10-08).

## Navigation reference composition — 2026-10-08

The owner-attached closed-header and open-institute screenshots guide this shared
navigation. The original header used a separate 120rem maximum and side gutters
capped at 3.75rem; it now consumes the shared container and gutters above.
It has one row from `110rem`, separate
identity/control and navigation rows from `70rem`, and a compact native Menu
disclosure below `70rem`. Approved page groups and centralized locale routes
retain precedence over historical source labels.

Before heroes were implemented, navy with a delivered reversed logo was the
homepage fallback and interior pages used white and the colored logo. The later
hero overlay is documented below. The open desktop tab
joins a white, full-width panel with introduction, destination list and related
route. Fine dividers, 600-weight link titles, readable secondary descriptions,
navy hover/focus links and a quiet selected-corner related block give each role
a clear purpose. Current links use `aria-current` and groups have an underline.

The additional `Header` UI catalog text is localized wayfinding draft copy,
not approved institutional claims or a live campaign. Related cards use existing
approved destinations; the example event and funding promotion are omitted.
Native `details`/`summary` preserve click, touch, keyboard and no-JavaScript
access. JavaScript adds focus-aware dismissal, Escape focus return, Arrow Down
entry and optional mouse-hover discovery. Logical layout and meaningful arrow
mirroring support Arabic without Latin tracking or reversed brand corners.

Local production verification passed across FR/EN/AR at 320–1440px, including
open navigation and 200% text at 320/1440px. The 1920px single row, touch navigation,
reduced motion and final screenshots were checked; all 28 browser tests passed.
See [navigation sources, decisions
and check status](navigation.md) and [the validation log](validation.md#navigation-reference-adaptation--2026-10-08).

## Native design-language analysis — 2026-10-08

### Document map and useful source frames

The source contains 20,689 unique node records, including 579 component masters
(`SYMBOL`), 1,247 instances, 5,383 text nodes and two variable collections.
Five obsolete variables are soft-deleted. There are 54 explicitly hidden nodes
and 1,160 hidden through their ancestry. Counts include imported libraries and
scratch references; they are not an inventory of 579 website components.
Structural visibility uses explicit visibility and ancestry; the foundation
profiles additionally exclude zero-opacity ancestry. Neither count proves native
rendered visibility, occlusion or clipping.

| Canvas               | ID          | Records including canvas | Reference purpose                                                |
| -------------------- | ----------- | -----------------------: | ---------------------------------------------------------------- |
| BENCHMARK            | `0:1`       |                      415 | Comparative references; do not treat as the IRESEN specification |
| Internal Only Canvas | `0:2`       |                    1,072 | Hidden local/imported definitions and variable records           |
| IRESEN               | `127:1781`  |                    8,977 | Desktop pages, shared elements and alternate explorations        |
| MOBILE               | `1128:6107` |                    8,149 | Mobile pages, menus, overlays and alternative fragments          |
| DESIGN SYSTEM        | `2211:6298` |                    2,075 | Foundation/component presentation board and icons                |

The original URL node `892:5041` is the homepage video layer, not a full page.
Its ancestry is Slider `804:6001` → Main Banner `804:6000` → WEBSITE LAYOUT
`804:5999` → [HOMEPAGE `804:5998`](https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=804-5998)
→ IRESEN `127:1781`. The earlier brief's URL selected that entire canvas.

Fourteen named desktop pages are 1920px wide. Thirteen have an explicit `BUILD`
handoff flag; FORMATIONS has no serialized flag. A handoff flag does not approve
copy or establish implementation quality. Use this mapping to preserve current
product boundaries when adapting historical source pages:

| Source frame                   | Node ID    | Approved adaptation                                       |
| ------------------------------ | ---------- | --------------------------------------------------------- |
| HOMEPAGE                       | `804:5998` | Accueil; new institutional narrative and reviewed modules |
| AGENCE DE MOYENS               | `804:6193` | Programmes R&D&I and relevant calls                       |
| DOMAINES DE RECHERCHE          | `804:6488` | Priorités & feuilles de route                             |
| Publications & Ressources      | `804:6862` | Publications & rapports                                   |
| ALUMNI                         | `804:7108` | Possible expert/profile patterns within approved scope    |
| CONTACT US                     | `804:7374` | Contact onepager                                          |
| COOPERATION ET PARTENARIATS    | `804:7609` | Travailler avec nous                                      |
| Vulgarisation scientifique     | `804:7833` | News/editorial and media patterns                         |
| Actualités & Événements        | `804:8049` | Separate news and event templates                         |
| FORMATIONS                     | `804:8394` | Relevant events/network modules                           |
| Carriéres                      | `804:8705` | Opportunités & Carrières                                  |
| À propos                       | `804:8896` | Institut; governance retains its separate page            |
| INFRASTRUCTURES ET PLATEFORMES | `804:9238` | Platform listing/detail patterns                          |
| PROJETS R&D & INNOVATION       | `804:9285` | Collaborative project listing/detail patterns             |

The MOBILE canvas contains 13 full 402px page frames. Homepage `1479:5838`
is 402 × 7523.399 source pixels. There are five separate mobile menu screens
(`1479:10344`, `10404`, `10446`, `10485`, `10516`), search `1479:10864`,
filters `1489:11586` and project-detail modal `1479:8022`. Alternative fragments
often use 442px widths; workshop reference `1479:10902` is 442 × 4040.
No full 402px FORMATIONS counterpart was identified. No Arabic Unicode or
RTL/Arabic/tablet-named frames were found, so dedicated RTL/tablet designs remain
unestablished. Mobile existence is now verified structurally; responsive behavior
and translated rendering still require implementation review.

### Composition and spacing

The source's recognizable language combines broad photographic/video or technical
heroes, left-aligned display type, small marked section labels, restrained CTAs,
flat alternating light/navy bands, image/text contrasts, selected diagonal-corner
cards, grouped editorial rows and a substantial footer. This is a structural
design read supported by measured frames and original assets, not a native
rendered fidelity claim.

Desktop HOMEPAGE measures 1920 × 7943.668. Its sequence is hero/navigation,
statistics, section navigation, mission, research themes, financing, achievements,
platforms, news, alliances and footer. The source's particular statistics and
module labels are historical content. Adapt the rhythm to **Développer · Éprouver
· Valoriser** and approved information architecture rather than copying that
exact content sequence. Mobile omits the desktop secondary navigation and
standalone alliances section, and rearranges sections into a narrow reading flow.

| Geometry                | Exact examples                                                                    | Implementation use                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Desktop grid            | All 14 pages: 12-column STRETCH-X, 60px offset, 20px gutter                       | Alignment evidence; current shared 120rem grid uses fluid side gutters                             |
| Grid exceptions         | Design board `2211:6303`: 100px offset/50px gutter; footer `1584:6681`: 60px/50px | Source has several grids, not one universal recipe                                                 |
| Desktop sections        | `804:6069`, `804:6093`: 60px horizontal/80px vertical padding                     | Spacious sections; translate into responsive semantic spacing                                      |
| Desktop news/statistics | `804:6120`: 100px vertical; `804:6025`: 195px horizontal/40px vertical            | Local composition decisions, not global token defaults                                             |
| Mobile sections         | `1479:5865`, `1479:5953`: 16px sides/56px vertical, 370px interiors               | Narrow-screen reference; preserve content fit at other widths                                      |
| Content gaps            | 10px wrappers coexist with 30/40/60px desktop and 30/32px mobile gaps             | Retain current 4/8px implementation rhythm; source does not prove an exact universal spacing scale |
| Navigation              | `718:5472`: 1920 × 128; inner `718:5444`: 1800 × 54 at x60/y36                    | Header proportion reference; current navigation adapts to wide, two-row and compact layouts        |
| Hero                    | `804:6000`: 1920 × 850; copy `804:6007`: 1094 × 463 at x60/y327.186               | Keep readable copy space and media contrast; do not lock web hero height                           |

STRETCH grid `sectionSize:10` is a serialized guide parameter, not a measured
10px column. Source absolute coordinates are canvas layout, not responsive CSS.
The mobile hero wrapper includes 60px of device status-bar chrome; do not build
that into the website. Its inner 874px video extends beyond an 814px hero parent,
so native clipping/cropping needs review rather than literal reproduction.

### Historical palette and variable maturity

The native source uses six active unique color values, represented twice through
local/imported variable records. There are 17 variable records in total, including
five soft-deleted legacy entries. Both collections expose one `Mode 1`; this does
not establish a light/dark token architecture. Source color aliases are present,
but spacing, radius, typography and motion variables were not recovered.

| Source variable          | Exact source value | Current website role/value        |
| ------------------------ | ------------------ | --------------------------------- |
| Prussian Blue `760:3674` | `#0C2340`          | Institutional navy `#12345A`      |
| Dusk Blue `760:3675`     | `#1A4E8A`          | Primary action blue `#296BB4`     |
| Blue Bell `760:3676`     | `#4698CA`          | Science Blue `#4698CA`            |
| Icy Aqua `760:3677`      | `#B1E4E3`          | Select cyan emphasis `#77C5D5`    |
| WHITE BLUE `760:3678`    | `#EDF5F9`          | Reading/section surface `#F4F7F8` |
| DEEP TEAL `959:5381`     | `#507F70`          | Selected green emphasis `#50A684` |

This table maps purposes; it does not recolor the source or automatically replace
every historical accent. Current owner-approved identity wins. Imported palette
screenshots corroborate historical values but are secondary to actual variable
records. Additional scratch/library colors and transparencies are not new brand
tokens. Keep Innovation Lime and the current logo variants under the approved
color book, even where this source variable set is narrower.

### Typography and hierarchy

Plus Jakarta Sans is the dominant primary-page family. Exact source naming also
uses `Plus Jakarta Sans Medium`/`SemiBold` as family strings with `Regular` styles
and matching Medium/SemiBold PostScript names; normalize by the licensed font's
actual metadata when implementing. Of 719 directly serialized visible desktop
text nodes in the 14 primary roots, 536 use Jakarta families, 179 Inter Tight and
four Aspekta. Of 678 equivalent mobile text nodes, 673 use Jakarta and five Inter.
These counts exclude expanded master/override typography and are not a census of
final rendered text. They demonstrate mixed serialized typography rather than an
instruction to load three website families.

| Role                                    | Source node | Size | Stored line height | Tracking |
| --------------------------------------- | ----------- | ---: | ------------------ | -------- |
| Desktop hero heading, Jakarta Bold      | `804:6013`  | 80px | 90px               | −3%      |
| Desktop hero intro, Jakarta Medium      | `804:6014`  | 21px | RAW 1.5            | 0%       |
| Desktop section heading, Jakarta Medium | `804:6066`  | 50px | 60px               | −3%      |
| Desktop body, Jakarta Medium            | `804:6067`  | 18px | RAW 1.5            | 0%       |
| Desktop eyebrow, Jakarta Medium         | `804:6063`  | 16px | PERCENT 100        | +10%     |
| Mobile hero heading, Jakarta Bold       | `1479:5856` | 32px | 38px               | −2%      |
| Mobile hero body, Jakarta Medium        | `1479:5857` | 14px | RAW 1.5            | 0%       |

Preserve clear separation between display, section, body, label and metadata
roles. The pinned Sketch converter and source baseline metrics confirm that
`RAW` multiplies font size, with rounded pixel results: 21px × 1.5 derives 32px,
18px × 1.5 derives 27px, and 14px × 1.5 derives 21px. `PERCENT 100` means
natural/Auto line height, not CSS `line-height:1`; an 80px design-board specimen
derives a 101px line box. See the pinned
[conversion reference](https://github.com/sketch-hq/fig2sketch/blob/0ecc6e9726184746653a9f63f0a1635fa50bbc38/src/converter/text.py).
Source
pixels are reference sizes; use fluid scales, real long content and legible mobile
body sizes. Do not apply Latin negative tracking or uppercase letter spacing to
Arabic. Font names in the native document did not supply licensed usable webfont
files. The subsequent Latin integration is sourced separately and recorded in
[the font guide](fonts.md); the Arabic companion remains pending.

No shared text-style references were recovered. The sole serialized local style
definition is a hidden fill style, `Faticon color` (`33:555`, `#333333`). The
DESIGN SYSTEM board is therefore documentation and construction evidence, not
a complete reusable typography token library. Its captions also contain drift:
H4 is labelled 40px but the specimen is 50px; H5's 26px caption includes an
incorrect 3.125rem conversion; a spacing specimen measures 80px while its label
says Spacing 60. Use measured node properties over those captions.

### Shapes, components and depth

The two-corner signature is verified in the native source. Buttons
`760:3679`/`760:3692` are 59px high, with 30px horizontal/18px vertical padding,
10px icon gap and explicit top-left/bottom-right 10px radii. Other corner fields
are absent rather than independently measured zeros. Card `2211:6513` is
400 × 200 and mobile card `1479:12494` is 370 × 157; both explicitly use
20px top-left/bottom-right radii. Current CSS uses 4px general control corners
and a 20px diagonal signature for focused elements. This source review records
those differences without changing the implemented rules.

Mobile also includes 16px diagonal-corner cards, such as `1479:6405`.
The state board illustrates default, hover and pressed CTAs; checked/disabled
controls; focus/error/warning/success inputs; and dropdown states. Its source
action states use `#1A4E8A`, `#2864AA` and `#0B386D`. Adapt state distinctions
to approved colors and accessible contrast. Source Science Blue, warning and
success colors fail 4.5:1 against white for normal text; source state specimens
are not automatically suitable production tokens.

A repeated source drop shadow uses x0/y14, blur40, spread0, color `#0C1755`
at 5% alpha. Other blur and inner-shadow treatments occur locally. They are not
a published semantic depth scale; source sample effects should not become
global menu/card styling without an intentional implementation decision.

| Reusable family                     | Measured references                                 | Adaptation intent                                                                                                                                                     |
| ----------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main navigation and footer          | `718:5472`; `1068:6394`                             | Shared site shell, current route map, keyboard/touch operation and appropriate SVG variant                                                                            |
| Primary/outlined/link CTAs          | `760:3679`, `760:3692`, `761:4978`                  | One action hierarchy, optional icon, clear default/focus/hover/loading/disabled behavior as needed                                                                    |
| Image-led cards and profile blocks  | `2211:6513`, `98:3014`, `1479:12494`                | Shared image/text anatomy; accurate content and responsive crops                                                                                                      |
| Inputs and textarea                 | Labeled wrappers `737:4209`, `737:4210`, `737:4314` | Wrappers 435 × 94 / 435 × 233; editable surfaces `737:4203`, `737:4207` are 435 × 60, textarea `737:4311` is 435 × 200; labels/errors/delivery require real semantics |
| Mobile navigation/search/filters    | `1479:10344`, `1479:10864`, `1489:11586`            | Usable small-screen discovery, proper overlay focus and equivalent locale routes                                                                                      |
| Project-detail overlay              | `1479:8022`; `687:4283`                             | Reference information hierarchy; retain crawlable detail pages and accessible dialog behavior if commissioned                                                         |
| Platform/resource/event/career rows | Corresponding primary page roots above              | Prefer appropriate lists, filters and disclosures over uniform decorative cards                                                                                       |

All 1,247 instance master references resolve locally. The graph contains 246
nodes with 268 variant specs and 84 nodes storing component-property definitions
(78 nonempty). Generic `Property 1`, icon/device library variants and retained
overrides mean these are not one coherent website component API. The DESIGN
SYSTEM board contains 223 masters, predominantly icons, but no native variant
specs, component-property definitions or prototype interactions within that
board. Its showcased states are illustrated compositions; they do not prove
a functioning default/hover/disabled component system.

### Media and crop language

The archive contains 223 embedded images (209 PNG, 14 JPEG), totaling
146,967,739 bytes, plus the archive thumbnail and one MP4. Embedded widths range
195–4096px and heights 28–2731px. All image filename SHA-1 hashes match bytes.
All 859 raster references across 430 IMAGE/VIDEO paints resolve to those 223
assets. No complete website screenshot exports were found among the image
payloads; complete pages are editable canvas structures.

Original media supports wide energy/infrastructure scenes, portraits, scientific
graphics, landscape cards and partner-logo areas. It also includes imported
menu/sitemap/settings screenshots. Asset presence and layer names do not verify
facility identity, usage rights, credits or documentary authenticity. For example,
a layer named for solar panels actually references a wind-farm raster. Use visual
inspection and reviewed metadata for captions and alternative text.

| Crop family      | Desktop/source example     | Mobile/source example      |
| ---------------- | -------------------------- | -------------------------- |
| Landscape card   | `98:3014`, 435 × 300       | `1479:10577`, 370 × 220    |
| News lead        | `804:8079`, 1041 × 650     | `1479:7238`, 370 × 200     |
| News thumbnail   | `804:8105`, 140 × 140      | `1479:7257`, 370 × 160     |
| Hero video layer | `892:5041`, 1920 × 850.650 | `1479:5841`, 402.603 × 874 |

Of 427 IMAGE paints, 372 use FILL and 55 STRETCH. These are individual source
crop decisions, not universal CSS aspect ratios. Some small thumbnails are
enlarged substantially in mobile references; use adequate original dimensions
and focal points instead of reproducing blur or distortion. All 430 IMAGE/VIDEO
paint `altText` fields are empty, so the source supplies no meaningful image
alternatives. Production alt text remains an editorial/accessibility input.

The embedded MP4 is byte-identical to existing `public/videos/hero.mp4`
(9,774,051 bytes; SHA-256 `548d570107419bc56ba1622ee8ec4eae365ed52a2e3faee248330fc4fa6be2eb`).
Its existence does not enable playback. The existing video inventory's poster,
derivative, pause, audio, reduced-motion and performance requirements still apply.

### Prototype behavior and unresolved source details

There are 576 active direct prototype records: 302 on IRESEN, 238 on MOBILE and
36 in hidden internal definitions. Separately, instance overrides contain 144
active and eight deleted interaction records; 92 active overrides are partial.
Do not add the two groups to describe effective interactive controls. Direct
triggers include 438 clicks, 88 hovers, 14 mouse-enter events, 25 drags and
11 timeouts. Their presence does not establish keyboard/focus semantics.

Common source motion is 0.3-second Smart Animate with back-cubic overshoot;
11 timeout loops store a 0.001-second trigger and 10-second transition. There
are 29 explicit sticky-scroll flags and nine mobile horizontal-scroll containers.
These establish prototype intent, not production requirements. Keep current
native controls, subtle motion, reduced-motion support and the brief's preference
for visible grids and non-automatic carousels. Do not install a motion library
to imitate an unverified prototype effect.

Six direct records use an unset destination sentinel; three are hidden and
three visible desktop examples include project drag `413:2667`, research-page
scroll `804:6488` and footer platforms action `1584:6752`. Fourteen desktop
main-navigation partial overrides reference base interaction `785:5392`, whose
complete trigger definition is absent from the recovered graph. Retain intended
destination mappings while explicitly resolving actual web behavior in code.

### How future work should use this reference

Read this document with [DESIGN.md](../DESIGN.md), [PRODUCT.md](../PRODUCT.md)
and the source inventory before page implementation. Reuse composition, type
hierarchy, selected-corner geometry and component anatomy from relevant frames;
apply current approved identity, content and routes. Keep source observations,
proposed improvements and implemented decisions distinct.

The analysis originally prioritized licensed Jakarta/Arabic typography, reusable
hero and section-heading families, shared image/card/row anatomy, and explicit
interactive states. At that stage the homepage remained an empty shell; source
analysis itself did not implement those families or change runtime CSS. Later
hero and Latin-font implementations are documented separately below and in
[the font guide](fonts.md); detailed homepage content remains unfinished.
Tablet/RTL, focus/keyboard behavior, long CMS content, native instance rendering,
real image crops, licenses and final approved copy remain verification inputs.

The offline reader is based on the MIT-licensed
[Sketch Kiwi reader](https://github.com/sketch-hq/fig2sketch/blob/0ecc6e9726184746653a9f63f0a1635fa50bbc38/src/figformat/kiwi.py)
with canonical unsigned 64-bit handling from
[Kiwi](https://github.com/evanw/kiwi/blob/fe3ca9484ac055ccd39fe144218ec11f720222ae/js/bb.ts).
Audited tools, license notices, raw IEEE sentinel evidence and private reports
are retained with the local analysis. Thirty-six non-finite max-size/spacing
fields are normalized to JSON null, with original bits recorded privately;
they must not be mistaken for absent properties or measured zero. Native Figma
rendering remains the fidelity reference when connector access is restored.

## Introducing heroes — 2026-10-08

All approved pages now open with a restrained introduction: a display title, one
short sentence, a section anchor and one related destination. Five compositions
(start, end, center, split and editorial) vary the visual rhythm across page topics.
Seventeen individually extracted Figma images are illustrative backgrounds, not
evidence about pictured people or IRESEN facilities. Utility pages use quieter
navy overlays. Media provenance and remaining publication review are recorded in
[the hero guide](heroes.md). Detailed content belongs in the sections below.

The existing header overlays these heroes with the reversed supplied logo and a
dark-to-transparent gradient; white disclosure panels retain their established
interaction. A measured viewport minimum includes the header clearance and the
bottom narrative band. Resize/orientation and visual-viewport changes update it;
pinch zoom preserves layout size, and text enlargement/short screens may grow
the hero instead of clipping content. CSS dynamic viewport units and responsive
header estimates remain functional without JavaScript. No fixed heights or
body overflow locks are used.

The narrow blue band presents Développer · Éprouver · Valoriser as navigation,
with the verified 2011 founding year only on home/institute. No sample statistics,
certification badge or long explanatory cards are included. Display type remains
fluid; Arabic uses natural tracking, logical alignment and directional arrows.

## Hero layout and typography refinements — 2026-10-08

The owner's refinements replace separate header/footer widths and the narrower
80rem hero/content container with the shared 120rem grid specified above.
At 1920px, side gutters are 60px; narrow screens retain at least 1.25rem.
The hero's copy measure, natural height growth, layout variations and RTL alignment
remain distinct from its outer container. Latin hero H1 tracking is `-0.03em`;
the Arabic selector overrides it to `normal`.

Current language links use `font-weight: 700` only, in both the header and footer
dropdown. No permanent selected background or underline is applied; hover and
focus styles remain. Desktop `.navigation-trigger` spans its container and centers
the label/arrow group, including wrapped text. `.menu-toggle` centers its contents.

`--font-latin` resolves the local Plus Jakarta Sans variable before the system
fallback stack; links and native buttons inherit the body font.
Découvrir and other public Latin actions therefore use the intended family.
See [the font guide](fonts.md) for loading, subset and license details, and
[the validation log](validation.md) for this revision's executed checks and
rendered coverage. Earlier verification and source measurements above describe
their respective revisions, not this change.
