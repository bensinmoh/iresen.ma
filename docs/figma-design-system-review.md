# Live Figma design-system review

Reviewed on 2026-10-08 from the owner's [DESIGN SYSTEM devlink](https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=2211-6298).
The page is `2211:6298`; its presentation frame, DESIGN SYSTEM 1.0,
is `2211:6303` (1920 × 13973px). This review updates repository guidance;
it does not change Figma, CSS tokens or website behavior.

## Evidence and precedence

Live metadata and Plugin API reads establish node properties, variable values
and component structure. Native screenshots and design context were inspected
for typography `2211:6409`, spacing `2211:6346` and colors `2211:8504`.
The review complements the [offline source evidence](references/figma/design-evidence.json),
which describes a particular exported snapshot. Live reads do not establish
that the entire file is unchanged from that snapshot.

Use current owner decisions, supplied brand assets and approved content/routes
before Figma's historical palette and sample copy. The [canonical design rules](design-system.md#current-coherence-rules)
and [art direction](../DESIGN.md) translate this evidence into website guidance.
Measured properties take precedence over inconsistent board captions; unresolved
intent stays explicit rather than becoming an invented token.

## Foundations

The live local-variable API returns six COLOR variables in one collection with
one mode (`Mode 1`). All six have `ALL_SCOPES` and empty code syntax. There are
no spacing, radius, typography or motion variables in that inventory, no semantic
alias layer and no second theme mode. Local text, paint and effect style APIs
return empty lists. The offline export's hidden `Faticon color` record remains
historical evidence; an empty live list alone does not prove it was deleted.

The board is a useful visual specification, not a complete production token or
component library. Its printed CSS examples are source documentation, not an
instruction to replace the repository's semantic variables. The owner reattached
the original color book during this review; [its authoritative palette, ratios
and contrast pairs](design-system.md#authoritative-color-book-palette) govern
website colors. The following values record historical Figma drift only.

| Figma color          | Live value | Website mapping                       |
| -------------------- | ---------- | ------------------------------------- |
| Colors/Prussian Blue | `#0C2340`  | `--color-navy`: `#12345A`             |
| Colors/Dusk Blue     | `#1A4E8A`  | `--color-blue`: `#296BB4`             |
| Colors/Blue Bell     | `#4698CA`  | `--color-science-blue`: `#4698CA`     |
| Colors/Icy Aqua      | `#B1E4E3`  | `--color-energy-cyan`: `#77C5D5`      |
| Colors/WHITE BLUE    | `#EDF5F9`  | `--color-surface`: `#F4F7F8`          |
| Colors/DEEP TEAL     | `#507F70`  | `--color-transition-green`: `#50A684` |

These are purpose mappings, not exact color equivalents. Approved white and lime
remain available. The palette introduction's black/pink identity and light/dark
theme claim do not match the swatches or live variables. Its "only for backgrounds"
navy caption does not override the website's approved navy text role.

## Typography

The board names Plus Jakarta Sans with Regular, Medium, SemiBold and Bold roles.
Source Medium/SemiBold family strings need normalization to actual licensed
webfont metadata. Connector font rendering does not supply redistributable font
files. The current public website uses separately verified, self-hosted Plus
Jakarta Sans for Latin and the owner's selected Alexandria for Arabic across
locales; see [their provenance](fonts.md). These integrations are separate from
the Latin typography evidence in this review.

| Board role    | Node        | Measured size / weight | Line height / tracking |
| ------------- | ----------- | ---------------------- | ---------------------- |
| H1            | `2211:6414` | 80px / 700             | Auto / −4%             |
| H2            | `2211:6419` | 60px / 700             | Auto / −4%             |
| H3            | `2211:6423` | 50px / 700             | Auto / −4%             |
| H4            | `2211:6427` | 50px / 700             | Auto / −4%             |
| H5            | `2211:6431` | 26px / 700             | Auto / −4%             |
| Hero subtitle | `2211:6436` | 21px / 500             | 150% / 0%              |
| Body base     | `2211:6440` | 18px / 500             | 150% / 0%              |
| Body accent   | `2211:6444` | 16px / 500             | 150% / 0%              |
| Button        | `2211:6449` | 18px / 700             | Auto / 0%              |
| Text link     | `2211:6453` | 16px / 700             | Auto / 0%              |
| Eyebrow       | `2211:6458` | 16px / 500             | Auto / +10%            |

H4's caption says 40px while the node measures 50px. H5's 26px size converts
to **1.625rem** at a 16px root, not its printed 3.125rem. Keep both source errors
visible; do not publish duplicate H3/H4 sizes as an intentional website scale.
The board's −4% display tracking also differs from the desktop page example's
−3% in the offline analysis. Use the relevant page and existing shared role rather
than imposing one tracking value globally.

Body specimens use 70% black opacity. Map reading text to the site's semantic
text colors and check actual backgrounds rather than applying opacity to whole
content containers. Auto line height is font-dependent, not a CSS ratio of 1.
Use fluid display sizes, readable wrapping and about 1.5 line height for body
roles; HTML heading levels follow content hierarchy. Arabic retains natural
tracking and shaping. Existing 16px body, 14px label and 13px metadata roles
remain the implemented baseline; the source's 18px editorial body is a reference
for a future shared reading role when a page needs it.

## Spacing, grids and corners

Spacing `2211:6346` presents **6, 8, 10, 12, 16, 20, 30, 60 and 80px** values.
The final 80px / 5rem entry (`2211:6404`/`2211:6405`) repeats the "Spacing - 60"
label. These are printed values, not bound spacing variables or dimensions of
the specimen tiles. Retain the website's 4/8px base rhythm and existing semantic
tokens; add a shared role only when an implemented composition needs it.

The grid section is `2211:6797`. The board frame uses 12 stretch columns with
100px offset and 50px gutters. Its desktop grid specimen `2211:6870` is 1720px
wide with twelve approximately 118.167px columns and 20px gaps; its caption says
"container 1920". Mobile specimen `2211:6896` is 402px wide with four 65px columns
and 20px gaps. These are different reference geometries, not one universal grid.
The mobile caption "Mobile ≥576px" does not define a coherent breakpoint for
this 402px specimen. Use the current shared 120rem container and fluid gutters
across header, hero, sections and footer; constrain text measure within it and
choose breakpoints from real translated content fit.

Corner section `2211:6504` explicitly specifies physical top-left/bottom-right
rounding. Live card specimen `2211:6513` is 400 × 200px with radii
`20, 0, 20, 0`; button-radius specimen `2211:6522` is 400 × 200px with radii
`10, 0, 10, 0` (top-left, top-right, bottom-right, bottom-left). The latter is a
radius demonstration, not a 200px-tall button. These live zeros resolve previously
absent serialized corners for those nodes only. Keep full-width section edges
flat, use selected diagonal corners and preserve their physical orientation in RTL.
Actual inputs `2211:8273`/`2211:8289` are square, while badge `2211:6680` has four
4px corners; radios are circular and switches pill-shaped. The board's blanket
corner prose therefore has exceptions. Current 4px control corners remain a
documented web adaptation, not evidence that every specimen uses the signature.

## Components and states

The board includes button, checkbox/radio/switch, chip, tooltip, badge, card,
tab, dropdown and input specimens alongside icons. Its 223 component nodes do
not represent 223 independent website components. The board has zero component
sets and no component-property definitions; CTA/input states are frames.
Illustrated states establish
visual intent; they do not prove semantic controls, keyboard behavior, delivery
services or a complete reusable variant API.

| Specimen                                          | Live geometry                                                                                             | Website use                                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Primary CTA states `2211:8072`/`8077`/`8082`      | 59px high; 18px vertical/30px horizontal padding; 10px icon gap; 10px diagonal corners                    | Consistent action anatomy; flexible translated width and visible focus                      |
| Input wrapper `2211:8271` and surface `2211:8273` | 500 × 94px wrapper; 500 × 60px surface; 14px label; 16px label gap; 18px vertical/20px horizontal padding | Associated label/hint/error; responsive width and adequate hit area                         |
| Card `2211:6663`                                  | 435 × 343px; 20px diagonal corners; approximately 30px padding                                            | Shared media/title/support/action anatomy; content determines height                        |
| Shadow specimen `2211:6538`                       | x0/y10, blur30, spread0, 5% opacity                                                                       | Local depth reference; caption's y10.9068/blur31.1622 disagrees; retain current menu shadow |

The 20px checkbox and approximately 30px switch drawings describe visible marks,
not usable touch targets. Include the associated label in the target and aim for
44px controls under the site's accessibility guidance. Tabs, chips and filters
need explicit selection semantics; a row styled as a tab is not automatically
a tab panel. Placeholder titles and statuses are not approved website content.

Reuse shared website components and their semantic roles. One primary action,
quieter outlined actions and text links should express importance consistently.
Default, hover, pressed, focus, disabled and genuine loading/submission states
belong to the same component when needed. Preserve focus independently of hover;
do not copy inaccessible source status colors or use color alone for errors.
Labels, hints and errors need programmatic associations. Tooltips, tabs and menus
need behavior appropriate to their semantics, pointer, touch and keyboard access.

Cards use a deliberate media/title/support/action anatomy; editorial rows remain
available for resources and dense listings. Reuse spacing, corners and type roles
across a family rather than adding a new decorative variant on each page. Source
fixed widths, sample contacts and statistics do not define responsive behavior or
approved content. A specimen is not authorization to add its service to the site.

## Review limits and future verification

No Figma edits, font downloads, asset imports, runtime changes or website rendering
were performed in this review. Native screenshots establish only the inspected
foundation sections; prototype execution, complete instance appearance and
dedicated Arabic/tablet design remain unverified. The earlier offline component,
mobile and prototype inventory remains separately attributed to its snapshot.

For a future visual implementation, compare the relevant Figma node and current
component, record intentional differences, then inspect desktop/mobile and Arabic,
long content, 200% text and applicable control states. Update shared rules and
verification records together when a new implementation decision is adopted.
