# Design system and Figma reference

The owner's reattached original color book v0.9 and seven supplied SVGs establish the approved identity. The live DESIGN SYSTEM devlink was inspected on 2026-10-08; use the current rules below with the [measured review](figma-design-system-review.md). The earlier offline analysis remains snapshot evidence. Source hashes and publication boundaries are recorded in the [asset inventory](asset-inventory.md).

## Current coherence rules

These are the shared website rules. Source measurements later in this document
explain intent and history; they do not supersede these decisions.

- **Identity:** follow the original color book. Institutional primary navy is
  `#12345A`; signature/action blue is `#296BB4`. Keep the approved accents and
  original SVGs. Figma's `#0C2340`/`#1A4E8A` palette is historical evidence.
- **Alignment:** header, hero, narrative band, content sections and footer share
  the implemented 120rem maximum and fluid side gutters. Constrain paragraph
  measure within that grid. Do not reintroduce the earlier 80rem page inset or
  a separate footer width. Change layout when content needs room.
- **Type:** use installed Plus Jakarta Sans for Latin and owner-selected Alexandria
  for Arabic across public locales. Reuse display, section, body, label, action and metadata roles rather than
  defining a new scale per page. Keep Latin hero tracking at −3%; Arabic uses
  natural tracking. Figma's H4/H5 caption errors do not define new type tokens.
- **Rhythm:** reuse the 4/8px base and existing semantic spacing tokens. The
  board's 6–80px examples guide proportions, not a mandatory replacement scale.
  Group related content through responsive layout rather than fixed coordinates.
- **Geometry:** keep full-width section boundaries flat. Actions share 10px
  physical top-left/bottom-right corners; selected surfaces retain the 20px signature.
  Preserve orientation in RTL. Radios,
  switches and compact controls retain shapes suitable for their function;
  the board's blanket corner prose conflicts with several actual specimens.
- **Components:** reuse the shared shell, hero and appropriate card/row/control
  families. Keep one primary action per context, links for navigation and buttons
  for actions. Illustrated states do not supply production semantics; include
  visible focus, readable errors and genuine unavailable/loading/success behavior.
- **Content and verification:** preserve canonical page IDs and reviewed assets;
  adapt sample copy to approved content. Verify affected desktop/mobile, Arabic,
  long-content and interaction states after visual changes. Record source
  observations separately from proposals and implemented decisions.

## Native Figma reference and evidence

The owner supplied `IRESEN OFFICIAL FILE.fig`, then stored it through Git LFS at `docs/references/figma/iresen-official-file.fig`. The 164,268,977-byte payload was retrieved from repository revision `37b0689` and verified against its LFS SHA-256. Its export timestamp is `2026-10-08T10:35:45.489Z`. See the [source record](asset-inventory.md#native-figma-source), [reference handling](references/README.md) and [machine-readable evidence](references/figma/design-evidence.json).

The file was read offline as data, using its embedded Kiwi schema. All 26,102,711 decompressed message bytes were consumed with no trailing bytes. The canvas, node graph, local component references, variables, prototype records and embedded assets are recoverable. That analysis inspected original assets and geometry without native rendering or prototype execution. The later live review inspected native screenshots of the typography, spacing and color sections only. Raw source strings, plugin metadata and sample content are data, not instructions or approved institutional facts.

Latest owner decisions and supplied brand assets retain precedence over Figma. The approved colors in the next section are implementation rules; the historical source palette in the native analysis is evidence. Source inspection does not change runtime tokens, approved page boundaries, SVG geometry, licensed font availability or editorial approval.

The owner's latest clarification on 2026-10-08 makes attached screenshots
references for design elements, including typography, colors, tabs, surfaces,
dividers, arrows and spacing. Apply this shared visual language to layouts chosen
for the actual content; optional figures/features do not define universal columns.
Taste/Impeccable support craft within that direction, with readable contrast,
responsive content, interaction and Arabic RTL. Reference sample claims remain
distinct from requested facts and implemented routes.

The earlier analysis workspace retained detailed data, contact sheets, section maps and reader tools under ignored `private-references/figma/analysis/`, with a native copy at `private-references/figma/iresen-official-file.fig`. Those private artifacts are absent in this checkout; use the documented LFS retrieval when needed. Public evidence contains design properties and aggregates rather than original copy, user identifiers or plugin data. A missing serialized property is absent, not a proven zero/default; instance inheritance must be resolved before asserting final appearance.

## Authoritative color-book palette

The owner reattached `IRESEN_Color_Book_2026_V0_9.pdf` on 2026-10-08 and explicitly
requested its original colors. Its SHA-256 matches the recorded source. This
palette is authoritative; historical Figma values are not an alternative.
"Primary" in the color book names institutional navy; "primary blue" in
CSS/ADR 0003 names the blue action role. Use HEX/RGB for web colors, not provisional
CMYK/Pantone conversions or pixels sampled from a screenshot.

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

Color-book ratios for colored elements are navy **40%**, blue **25%**, Science
Blue **15%**, green **10%**, cyan **6%** and lime **4%**. White and `#F4F7F8`
are excluded and typically occupy 50–70% of page surface. These guide hierarchy,
not pixel quotas. Most compositions use the two core colors and one accent at
most. Science Blue/cyan support technical content; green/lime support transition
and impact without replacing the institutional blue identity. Reserve the full
spectrum for deliberate patterns, data or exceptional brand moments.

Use navy reading text on white/light surfaces, navy or blue headings, blue primary
actions and white/blue secondary actions. Thematic green actions need a readable
label treatment. For categorical charts, the guide's order is blue, green,
Science Blue, lime, cyan, navy; add labels or other non-color distinctions.

| Foreground / background | Contrast | Use                        |
| ----------------------- | -------: | -------------------------- |
| White / navy            |  12.62:1 | Normal text                |
| White / action blue     |   5.45:1 | Normal text                |
| White / Science Blue    |   3.18:1 | Qualifying large text only |
| Navy / cyan             |   6.45:1 | Normal text                |
| Navy / green            |   4.28:1 | Qualifying large text only |
| Navy / lime             |   6.54:1 | Normal text                |

These opaque pairs match the guide and were recomputed. Evaluate final rendered
colors again for overlays, opacity and states. The source's 13px warning/success
messages and pale badge labels fail normal-text contrast; use readable semantic
status colors and labels rather than adopting them as new brand colors.

The owner's final correction on 2026-10-07 sets website primary blue to `#296BB4`, matching the inspected color-book v0.9 and every current blue-bearing SVG, including the latest corrected favicon. Use `#296BB4` for website primary-blue and focus tokens; copy received vectors byte-identically. The Illustrator board remains uninspected. See [ADR 0003](adr/0003-owner-selected-primary-blue.md).

Use `logo-color.svg` on light surfaces and the reversed variants on navy. The newly received `logo-primary.svg` has a different aspect ratio; preserve its own geometry when used. Both `logo-white.svg` and `logo-monochrome.svg` have white fills; filenames do not make either a navy-on-white mark. Keep SVG proportions and reserve intrinsic geometry to avoid layout shift. Public metadata now selects the supplied `/brand/apex-leaf.svg` as an SVG browser icon with `sizes="any"`, using its tight viewBox and original proportions; the padded `favicon.svg` is retained as an original asset. See [active icon selection](asset-inventory.md#active-browser-icon--2026-10-08).

## Layout and typography

Use semantic CSS custom properties with Tailwind utilities. `--container-width` is `120rem` and `--gutter` is `clamp(1.25rem, 3.125vw, 4rem)`. Header, hero-body, narrative band, following sections and footer share `min(100% - var(--gutter) * 2, var(--container-width))` with centered inline margins. Constrain reading measure within this broad grid and keep the 4/8px spacing rhythm. Keep full-width section boundaries flat. Apply the physical top-left/bottom-right rounded signature selectively to cards and media.

Public Latin text uses self-hosted Plus Jakarta Sans (normal variable 200–800); Arabic uses the owner's selected Alexandria (normal variable 100–900), both under SIL OFL 1.1 through `next/font/local`. Script-based selection covers mixed-language text in every locale. Document defaults, Tailwind sans utilities, links and native controls share this policy; CMS/admin has a separate layout. See [fonts and provenance](fonts.md). Latin hero H1 tracking is `-0.03em` (−3%) in all layouts; Arabic retains natural tracking. Use the received vector wordmark rather than recreating it as live text.

### Section-heading marker

The owner's 2026-10-09 clarification requires tasteful, selective use of the
Apex Leaf. This revision implements the earlier preference in two places.
The homepage hero eyebrow alone uses the
original [apex-leaf.svg](../public/brand/apex-leaf.svg) as a white CSS mask at
10 × 16px. The Institute's Mission H2 alone uses the original blue vector at
1em height with a 12px gap. Keep its geometry and proportions; place it at the
logical inline start in Arabic without mirroring the shape. Both marks are
decorative, leaving the text as the accessible name. Other hero eyebrows, H2s,
menus, footer and sitemap retain their existing treatment.

### Shared actions — 2026-10-09

`--radius-action` is `0.625rem 0 0.625rem 0`: physical 10px top-left/bottom-right
corners at the default root size. `.button`, header search, hero discovery and
newsletter Subscribe share it, including error/404 actions. This supersedes the
earlier 4px generic-button and 20px hero/Subscribe rules. The 20px
`--radius-signature` remains for selected surfaces, including certification and
the newsletter field; compact functional controls retain their own shapes.

`--font-size-action` is `1.125rem` (18px), used by hero discovery and Subscribe at
weight 600 with a default 12px icon gap; narrow Subscribe uses 8px. Contact retains its 16px/600 role. Hero description
weight is 500; the 16px body, 14px label and 13px metadata roles stay unchanged.
Button-like links suppress hover underlines through the shared `.button` rule.
Compact navigation and sitemap rows retain a 44px minimum target. Labels can
shrink and wrap; narrower Subscribe spacing preserves its target with enlarged
text. See [the coherence review](site-coherence-review.md) and
[revision-specific validation](validation.md#site-coherence-review--2026-10-09).

## Interaction and acceptance

Keep navigation operable by keyboard, touch and pointer. Use visible focus, correct landmarks, a skip link and reduced-motion support. Avoid autoplay carousels and decorative animation libraries in the foundation.

Check actual rendered contrast; brand colors do not automatically make accessible status colors. Normal text needs 4.5:1 contrast. White text on cyan/lime is unsuitable; navy text on cyan/lime passes as shown above. Use 3:1 only for qualifying large text and applicable non-text requirements.

Next homepage work uses the supplied brand identity and the approved Développer · Éprouver · Valoriser reading framework. The earlier narrative PDF remains private; the three newly supplied DOCX files are authorized repository references, indexed in [the strategy analysis](references/strategy/README.md). Their page sections and composition details remain suggestions, not a validated structure or new design rules. Final wording/translations and claims require approval. Distinguish verified current capabilities from ambitions and never invent key figures.

Review desktop/tablet/mobile composition, Arabic layout, long-label/header fit and manual accessibility. Obtain individual approved imagery or documented replacements; full-page screenshots are never production imagery. Missing optional exports do not block independent work.

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
`--font-size-meta` is `0.8125rem`. Use body size for reading text, label size for
utility links and metadata size for copyright. Earlier footer roles used body size
for desktop links and label size for group headings/mobile links, first at regular
navigation weight and then 600 for desktop links. The current footer refinement
below supersedes those footer roles.

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
then stack on smaller screens; navigation retains two columns on mobile. Initially,
group labels used the shared label role, desktop links body size at 600 weight
and the newsletter heading a 1.875–3.375rem scale. The later footer refinement
below supersedes those roles. Utilities remain compact.

`--color-footer-field` is a 5% white surface on the approved navy for the visible
signup block. The initial email, consent and subscribe controls were disabled,
with a visible unavailable notice and privacy link.
Logical layout, isolated Latin identifiers and meaningful arrow mirroring support
Arabic while preserving physical signature corners. See [implementation and
earlier verification](footer.md#reference-rework--2026-10-08).

## Footer type and newsletter refinement — 2026-10-08

Our adaptation toward the owner's reference uses these roles at the default root
size: identity description and navigation use 18px/500; navigation
reduces to 16px at `35rem` and below. Group labels use 16px/500. Contact labels and
values use 20px at weights 500 and 600 respectively. The newsletter heading uses
`clamp(1.875rem, 2.605vw, 3.125rem)` (30–50px), weight 500, line height 1.2 and
`-0.03em` Latin tracking; Arabic keeps natural tracking.
The owner-selected footer tagline uses white native `strong` at 18px/700 and
an 8px gap before the description; [copy approval](footer.md#footer-identity-copy--2026-10-08)
applies to this footer block, with English/Arabic drafts.

Wide-layout spacing caps are 64px top padding, 48px from grid to contact, 32px
before the newsletter divider, 48px after it, 32px before utilities and 40px bottom
padding. The signup track is `min(44%, 37.5rem)` (600px), with existing tablet/mobile
stacking. Shared alignment, colors, physical corners, SVGs, routes and contact/social
destinations remain. The source frame's 1920 × 798px dimensions inform composition;
height follows content, and exact native footer text styles were unavailable.

Newsletter email/consent controls hold local UI state. Subscribe is a native
`details`/`summary` disclosure: the localized `role="status"` unavailable message
starts hidden and appears when activated, including without JavaScript. The
privacy link is always outside the disclosure. No form action, subscription API,
persistence or success response is introduced.
The field uses an 80px minimum and an 18px/600, 60px Subscribe control at the
default root size. Modern `details::details-content` support places icon, email
and Subscribe in one row; the progressive fallback stacks Subscribe. At `35rem`
and below, Subscribe spans the field with a 44px minimum. The consent label also
retains a 44px target and visible checked state.
See [footer guidance](footer.md#footer-type-and-newsletter-refinement--2026-10-08)
and [current validation](validation.md); earlier type and disabled-state checks
retain their original scope.

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
route. The initial panel used fine dividers, 600-weight link titles, readable
secondary descriptions, navy hover/focus links and a quiet selected-corner related
block. The hovered-menu adaptation below supersedes that panel layout and feature
treatment. Current links use `aria-current` and groups have an underline.

The additional `Header` UI catalog text is localized wayfinding draft copy,
not approved institutional claims or a live campaign. Related cards use existing
approved destinations; the example event and funding promotion are omitted.
Native `details`/`summary` preserve click, touch, keyboard and no-JavaScript
access. JavaScript adds focus-aware dismissal, Escape focus return, Arrow Down
entry and optional mouse-hover discovery. Logical layout and meaningful arrow
mirroring support Arabic without Latin tracking or reversed brand corners.

Initial navigation production verification passed across FR/EN/AR at 320–1440px, including
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
files. The subsequent Jakarta and owner-selected Alexandria integrations are
sourced separately and recorded in [the font guide](fonts.md).

No shared text-style references were recovered in the offline snapshot. The sole serialized local style
definition is a hidden fill style, `Faticon color` (`33:555`, `#333333`). The
DESIGN SYSTEM board is therefore documentation and construction evidence, not
a complete reusable typography token library. Its captions also contain drift:
H4 is labelled 40px but the specimen is 50px; H5's 26px caption includes an
incorrect 3.125rem conversion; the final spacing entry says 80px/5rem while its
label says Spacing 60. Use measured properties and correct conversions over
inconsistent captions. The live review confirms these errors, six color variables
in one mode and no local text/paint/effect styles returned by their APIs;
see [the scoped evidence](figma-design-system-review.md#foundations).

### Shapes, components and depth

The two-corner signature is verified in the native source. Buttons
`760:3679`/`760:3692` are 59px high, with 30px horizontal/18px vertical padding,
10px icon gap and explicit top-left/bottom-right 10px radii. Other corner fields
were absent in those serialized records. The live board's CTA states
`2211:8072`/`2211:8077`/`2211:8082` explicitly measure `10,0,10,0` corners.
Card `2211:6513` is
400 × 200 and mobile card `1479:12494` is 370 × 157; both explicitly use
20px top-left/bottom-right radii; the live read confirms `20,0,20,0` on `2211:6513`.
At this source-review revision, CSS used 4px general control corners
and a 20px diagonal signature for focused elements. The 2026-10-09
[shared action rules](#shared-actions--2026-10-09) supersede those button adaptations;
the source measurements remain historical evidence.

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
global menu/card styling without an intentional implementation decision. The
live board's shadow specimen `2211:6538` instead uses y10/blur30, and its caption
disagrees; neither source effect replaces the current semantic menu shadow.

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
hero and Jakarta/Alexandria font implementations are documented separately below and in
[the font guide](fonts.md); detailed homepage content remains unfinished.
Tablet/RTL, focus/keyboard behavior, long CMS content, native instance rendering,
real image crops, licenses and final approved copy remain verification inputs.

The offline reader is based on the MIT-licensed
[Sketch Kiwi reader](https://github.com/sketch-hq/fig2sketch/blob/0ecc6e9726184746653a9f63f0a1635fa50bbc38/src/figformat/kiwi.py)
with canonical unsigned 64-bit handling from
[Kiwi](https://github.com/evanw/kiwi/blob/fe3ca9484ac055ccd39fe144218ec11f720222ae/js/bb.ts).
Audited tools, license notices, raw IEEE sentinel evidence and private reports
were retained in the prior analysis workspace. Thirty-six non-finite max-size/spacing
fields are normalized to JSON null, with original bits recorded in that private archive;
they must not be mistaken for absent properties or measured zero. Native Figma
rendering remains the fidelity reference. Connector access was available for
the scoped live review; broader page/prototype fidelity remains unverified.

## Generated hero placeholders — 2026-10-09

All 17 backgrounds used across the 22 page introductions are owner-requested
generated photographic placeholders. Their fictional, generic energy/science
scenes support the existing five compositions without asserting real IRESEN
facilities, events or people. Keep approved copy, figures, routes, colors, fonts
and original SVGs separate from generated scenery. Empty image alternatives
retain the decorative role.

The native dimensions are 1536 × 1024 for 16 images and 1672 × 941 for the aerial
image. Preserve these HD pixels without upscaling; do not claim native 4K or that
every previous image gained resolution. Serve quality-90 WebP through
content-hashed filenames. At `40rem` and below, a native `picture` source serves
full-native-height 2:3 portrait WebP directly without the Next optimizer. The wider
Next Image fallback uses quality 90 and sizes based on width, aspect ratio ×
viewport height and a 75rem growth guard.
Only the current hero is eager/high priority, with same-origin delivery and no
added video or client runtime. The approximately 250KB mobile hero budget is a
target to measure against the actual derivatives and delivered responses.

[Current provenance](hero-assets.json) records full prompts for 16 images, an
abbreviated aerial recipe, source/output hashes, native dimensions, bytes and
mobile crops. The
[2026-10-08 Figma manifest](hero-assets-figma-2026-10-08.json) retains superseded
source facts. See [media behavior](heroes.md#generated-hero-placeholders--2026-10-09)
and [this revision's checks](validation.md#generated-hero-placeholders--2026-10-09);
earlier tests and captures describe their own asset set.

## Introducing heroes — 2026-10-08

All approved pages now open with a restrained introduction: a display title, one
short sentence, a section anchor and one related destination. Five compositions
(start, end, center, split and editorial) vary the visual rhythm across page topics.
The initial 17 individually extracted Figma images were illustrative backgrounds,
without identifying pictured people or facilities as IRESEN. They are superseded
by the generated placeholders above; the archived manifest retains their source
facts. Utility pages use quieter navy overlays. Detailed content belongs in the
sections below.

The existing header overlays these heroes with the reversed supplied logo and a
dark-to-transparent gradient; white disclosure panels retain their established
interaction. A measured viewport minimum includes the header clearance and the
bottom narrative band. Resize/orientation and visual-viewport changes update it;
pinch zoom preserves layout size, and text enlargement/short screens may grow
the hero instead of clipping content. CSS dynamic viewport units and responsive
header estimates remain functional without JavaScript. No fixed heights or
body overflow locks are used.

The hero scroll cue is a centered native anchor to `#page-sections`, positioned
above the bottom band. Its accessible name uses the existing localized
`Hero.continue`; the mouse outline is decorative, replacing visible text/arrow.
At default text size, the target is 44 × 44px and the white outline is 24 × 36px.
Wheel motion uses CSS transform/opacity for three 1.6-second cycles, with no
animation under `prefers-reduced-motion`. The scene's bottom reserve is 72px
instead of the former fluid 80–128px, while natural hero growth is retained.
Executed checks and renderings remain in [the validation log](validation.md).

The initial narrow blue band presented Développer · Éprouver · Valoriser as
navigation, with the verified 2011 founding year on home/institute. The later
homepage figure request below replaces that homepage band; other pages retain
their pathways and institute retains its founding year. Display type remains
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

`--font-latin` resolves the local Plus Jakarta Sans variable before the sans-serif
fallback. The shared body stack selects the restricted Alexandria face for Arabic
and Jakarta for Latin; document defaults and all native controls inherit it.
Découvrir and other public Latin actions therefore use the intended family.
See [the font guide](fonts.md) for loading, subset and license details, and
[the validation log](validation.md) for this revision's executed checks and
rendered coverage. Earlier verification and source measurements above describe
their respective revisions, not this change.

## Header search and contact controls — 2026-10-08

The owner's re-shared screenshot supports tighter header-control proportions.
Both controls now use the shared `--radius-action`, adopted across actions on
2026-10-09 in place of the earlier header-scoped token:
`0.625rem 0 0.625rem 0` rounds top-left/bottom-right by 10px at the default root
size, with sharp opposite corners unchanged in RTL. This is an adaptation backed
by [live 10px CTA evidence](figma-design-system-review.md#components-and-states),
not an exact measurement from the screenshot.
Search uses a white surface, 1px `--color-control-outline` (`#858585`) border and
a 24px navy (`#12345A`) magnifier. `--header-control-size` is `3rem` (48px),
reduced to `2.75rem` (44px) at `35rem` and below; both dimensions use this size.
Contact keeps primary `#296BB4`/white, a 48px minimum height and 24px inline
padding. Its 16px/600 text inherits the shared Jakarta/Alexandria font policy.

`Header.contact` labels the CTA « Contactez-nous », “Contact us” and “اتصل بنا”;
the English/Arabic wording remains the same. Page titles, routes, footer and
compact-menu contact labels retain their existing source. The CTA stays hidden
below `70rem`, with contact available in the compact menu. Current checks belong
in [the validation log](validation.md); earlier 20px control checks and screenshots
describe the superseded radius.

## Homepage certification badge — 2026-10-08

The initial hero omitted historical certification copy. The owner's later direct
request authorizes Certifié · ISO · 9001:2015 · Première agence de moyens certifiée
en Afrique for the local homepage. This is an owner-supplied claim, with English
and Arabic draft translations; it does not establish independent certification
verification or adopt other screenshot content.

`.hero-certification` is a home-only native, noninteractive aside named with the
translated certified label and standard. ISO 9001:2015 uses LTR `bdi` isolation
and `var(--font-latin)`; Arabic copy inherits Alexandria and natural tracking.
The neutral surface uses `rgb(80 80 80 / 72%)` with `backdrop-filter: blur(1rem)`
and its WebKit-prefixed equivalent. An `@supports` rule enables this treatment;
the default `rgb(52 52 52 / 94%)` provides a darker fallback. The physical
`var(--radius-signature)` corners remain 20px top-left/bottom-right at the default
root size, with sharp opposite corners in RTL as well.

Below `70rem`, the badge follows the introduction and precedes the actions in
natural DOM flow. Its flex content wraps within `min(100%, 24rem)`, using 1rem
padding. From `70rem`, `.hero-body--certified .hero-copy` uses
`minmax(0, 1fr) 11rem` tracks and a `clamp(2rem, 4vw, 4rem)` column gap. The badge
occupies the second track across both copy/action rows and aligns at the bottom;
no fixed hero height is added. The five homepage figures are retained.
See [content and behavior](heroes.md#homepage-certification-badge--2026-10-08)
and [revision-specific validation](validation.md); earlier checks remain historical.

## Shared key-figure typography — 2026-10-08

The owner-attached Figma screenshot references from 2026-10-08 at 20.37.38,
20.41.03 and 20.41.08 show Plus Jakarta Sans values at 60px, weight 600, and labels
at 18px, weight 500. Both use 100% line height and 0% tracking, with white values
and 70% white labels. These are styling hints, distinct from the five numeric
claims explicitly supplied in the owner's later homepage request. The implemented
style applies to those homepage values, the existing 2011 founding figure
on institute and the white-panel menu adaptations below.

`.key-figure` stacks `.key-figure-value` over `.key-figure-label` with the shared
spacing token. Mobile preserves this structure rather than changing to a smaller
value and horizontal label. The shared roles are:

| Role  | Family                | Size token                 | Weight | Line height | Tracking | Color                       |
| ----- | --------------------- | -------------------------- | ------ | ----------- | -------- | --------------------------- |
| Value | `var(--font-latin)`   | `--font-size-figure`       | 600    | 1           | 0        | White                       |
| Label | Inherited body family | `--font-size-figure-label` | 500    | 1 (Latin)   | 0        | `var(--color-figure-label)` |

`--font-size-figure` is `clamp(2.25rem, 4.167vw, 3.75rem)`, corresponding to
36–60px at the default root size. `--font-size-figure-label` is `1.125rem` (18px).
Values deliberately use the Latin family for isolated Latin numerals in Arabic,
including plus-prefixed homepage values. Arabic labels use Alexandria through
the shared body stack, with line height
1.45 and natural tracking; they do not inherit Latin numeral typography.

`--color-figure-label` defaults to `rgb(255 255 255 / 70%)` for suitable dark
surfaces. `.hero-highlights` overrides it to `rgb(255 255 255 / 87%)` on the
approved `#296BB4` band, giving approximately 4.55:1 contrast instead of the
source opacity's 3.54:1. Recheck this small-text contrast when reusing the role
on another surface. Current application/rendered verification is recorded in
[the validation log](validation.md); earlier hero checks are revision-specific.

The homepage band uses a semantic definition list of five owner-supplied figures:
69 supported collaborative projects, +60 patents filed, +1000 young researchers
supported, +1100 scientific publications and +18 university laboratories
established. Labels are definition terms and values are their descriptions;
CSS places the values above their labels. Plus-prefixed values are isolated LTR
in Arabic. The homepage overrides Latin label line height to 1.35 for long
wrapping labels; Arabic retains 1.45. The grid uses auto-fit tracks with a
minimum of `min(100%, 12rem)`,
reduced to `min(100%, 10rem)` below `35rem`. Gaps are 24px on mobile/tablet and
32px on wide screens at the default root size; below `35rem`, the last figure
spans a complete row. The normal-size layout gives five columns at 1440/1920px,
three at 768px, two at 390px and one at 320px, adapting as text is enlarged.
The hero can grow on narrow screens to keep all five facts visible.
This band replaces the homepage's founding-year/pathway items; the
other pages retain their pathway behavior and institute retains its 2011 figure.
Corrected French wording, current EN/AR drafts and the content source are recorded
in [the hero guide](heroes.md#homepage-key-figures--2026-10-08). The user's explicit
message supplies these claims; screenshot styling hints do not supply content
approval.

## Hovered-menu reference adaptation — 2026-10-08

The latest owner clarification supersedes the earlier assumption of a universal
three-column format and shared minimum height. The four menu screenshots define
a coherent language of Plus Jakarta Sans type, white connected tabs/panels, thin logical dividers,
inline diagonal arrows, navy/blue text and consistent spacing. Content determines
the format: institute/research use featured panels; expertise/resources use compact
panels with their destination lists occupying the remaining space.

`navigationPanels` selects `featured` or `links` by group. The desktop grid retains
three equal tracks: featured lists occupy one track beside intro/feature content;
`.mega-menu-grid--links .mega-menu-links` spans `2 / -1` and uses two inner tracks.
The compact list uses a 2rem column gap, keeps its intro-side 1px divider and
removes the outer divider. Intro copy and its optional figure have a 1.5rem gap.
Intro/feature columns use 3rem block and 2rem adjoining inline padding; lists use
2rem padding. Height follows content without `min-block-size` or auto-pushed figures;
scrolling remains bounded by `calc(100dvh - 100%)` beneath the actual header.

Figures and related destinations are optional. Only research currently includes
a menu figure: 69 collaborative projects, resolved from `homeFigures` and
`Hero.figures` drafts, with navy value and muted label on white. Featured panels
retain the existing institute/workWithUs and research/opportunities destinations;
compact expertise/resources panels avoid additional feature/figure content.
There is no universal minimum height or automatic bottom-pushed figure.

White active tabs, current-route indicators, quiet hover surfaces, visible focus,
logical RTL dividers and arrow mirroring remain shared elements. Native disclosures
retain established pointer, keyboard, touch and no-JavaScript behavior. Panel
height follows content with bounded viewport scrolling. The existing routes and
localized drafts remain authoritative; new screenshot sample figures, campaigns
and routes are design reference data. See [navigation formats](navigation.md#hovered-menu-reference-adaptation--2026-10-08)
and [current validation](validation.md); earlier checks retain their original scope.
