# Feuille de route R&D — 2026-10-11

The owner commissioned the existing `priorities` page using Figma frame
`804:6488`, a supplied local animation recording, then the content manuscript
`IRESEN_Page_Feuille_de_route_RD.md`. The later manuscript supersedes the
Figma sample copy and thematic illustrations. Its SHA-256 is
`7baba88142c2b597197f918ee8a13c960f5608a8980bcd367e5952929c1dc77e`.
Neither private source is imported or served. Embedded integration notes are
recommendations, not new approvals or website text.

## Content and visitor task

The French body preserves the supplied hero, two introduction paragraphs,
Développer / Éprouver / Valoriser explanation, all seven
themes and their 28 complete research axes, intended benefits and concluding
cooperation paragraphs/actions. Long axis descriptions use native disclosures.
English and Arabic faithfully adapt this body as working editorial translations.
The roadmap describes research directions and intended benefits, not achieved
results, adopted programmes, allocations or commitments.

The seven themes reuse the consolidated homepage taxonomy: renewables,
hydrogen, industry, water, circular resources, buildings and mobility. Visitors
can explore them through the hero action, consecutive chapter links, then the existing programmes, collaboration and projects routes.
No new primary route or CMS collection is introduced. The six legacy anchors
remain supported: `needs-challenges`, `domains-directions`, `technology-roadmaps`,
`priorities-projects`, `decision-resources`, `resources-collaboration`.
Seven `theme-{id}` anchors also survive locale switching and search navigation.

## Visual direction and motion

The retained [research institute benchmark](references/benchmark/README.md)
informs the readable research explanation and clear route toward collaboration.
The [strategy reference](references/strategy/README.md) supplies context; the
owner's manuscript determines this page's body. Figma and the video inform
large editorial headings, generous stages, alternating thematic surfaces and
varied artwork entrances. They do not override the approved identity or content.

Each conceptual AI illustration combines an original technological scene with
an engineering line drawing over it. The original is a faint watercolor-like
underpainting; blue-grey technical lines appear on light backgrounds and white
lines on navy/blue. These are conceptual illustrations, never evidence of an
installed IRESEN facility. The original generated PNGs remain outside the repo;
14 optimized transparent WebP layers and one opaque hero board are served locally. See the
[asset manifest](roadmap-assets.json) for hashes and public provenance.
UI chevrons/arrows remain shared vector SVGs.

Desktop entrances reveal the title and trace the illustration on first arrival.
Native scrolling determines progress; there is no scroll interception or fixed
chapter height. Artwork alone stays within its chapter when content grows.
Opening an axis does not modify earlier chapter geometry. Mobile/tablet, reduced
motion and no-JavaScript render complete static reading content. Keyboard focus
settles the current entrance. Component motion ownership prevents duplicate
site-wide reveals. Arabic direction and native section links remain.

## Discovery and publication boundary

The page, six existing section projections, seven thematic sections and all 15
images have descriptive FR/EN/AR public search references with reachable
canonical URLs. Source manuscript/recording, integration notes, provenance and
editorial review data remain outside public discovery. The CMS public-content
component retains its existing access and locale gates. No download of the
manuscript, new database records, visibility change or deployment is authorized.
Final institutional/editorial review remains separate from local development.

## Rendered review

Production Chrome captures: [French hero](review/roadmap/fr-desktop-hero.png),
[light chapter](review/roadmap/fr-desktop-renewables.png),
[dark chapter](review/roadmap/fr-desktop-water.png),
[Arabic mobile hero](review/roadmap/ar-mobile-hero.png) and
[Arabic chapter viewport](review/roadmap/ar-mobile-buildings.png).

Asset generation used the built-in image tool. The public paths, subject prompts,
technical-overlay specification, source canvas sizes and final WebP sizes are
recorded in the asset manifest above. Raster artwork is distinct from the SVG UI
icons required by the owner.

## Owner removal — 2026-10-11

The later screenshot follow-up removes the common-requirements paragraph and
the entire theme navigation rail in all locales. Their text is withdrawn from
the public search projection. The existing `decision-resources` anchor remains
as a compatibility target within the strategy introduction; theme sections,
consecutive links and the hero exploration action remain.

## Spacing and drafting-board hero — owner follow-up, 2026-10-11

The introduction now meets the first theme with compact spacing; the first
chapter grows naturally rather than reserving an entire viewport. Hero text
aligns to the bottom with shared hero clearance. A new generated perspective
view of a drafting board combines all seven themes in one technical diagram.
Its white strokes and faint washes follow the requested art direction. The
board is mirrored for Arabic composition; it contains no identity/logo/text.
Its localized search reference and prompt/hash are included in the manifest.

The final benefits refinement encloses each intended-benefits block in a quiet
frame: a pale translucent surface with a thin navy rule on light chapters,
and a subtle white tint/rule on dark chapters. Shared signature corners and
inherited readable text keep the emphasis light.

Each research axis has a subject-specific outline SVG from Tabler Icons v3.35.0
(MIT license retained beside the component). It occupies the trailing side of
the title row, stretching to its available height, and replaces the chevron.
The icon remains fixed when opening the native disclosure. Arabic follows the
mirrored reading order. No raster icon or new dependency is introduced.

## Viewport theme composition — owner correction, 2026-10-16

The seven themes use a compact desktop scene with a minimum height of 100svh,
height-aware heading, spacing and illustration sizing, and compact 44px minimum
axis targets. Keep the complete heading, illustration, four closed axes, benefits
and next-theme control together. Remove sticky illustration positioning; native
scrolling and the existing once-per-visit arrival remain. No new scroll effect is
commissioned yet. Intrinsic rows grow for open details, enlarged text or short
windows instead of clipping content. Below 64rem, retain natural stacked reading.

Verification: all three localized development routes return HTTP 200 with the
seven theme sections intact. Scoped formatting and whitespace checks pass; no
sticky declaration remains in the roadmap component styles. Latest rendered
viewport-fit measurements remain pending because the existing browser preview
is blocked; no production/browser suite ran while shared coordination is held.

Next-theme anchor correction — 2026-10-16: on the roadmap only, remove the
global 24px root scroll-padding gap and thematic scroll margins. Native next-theme
links now align the target section flush to the viewport top, preserving hashes,
history, keyboard navigation and reduced-motion behavior. The existing localized
anchor E2E now expects alignment within 2px; execution remains held with the batch.

Owner accordion correction — 2026-10-16: each theme groups its four native
`details` with a shared, theme-specific `name`. Opening an axis closes the previous
axis in that theme; all remain closed initially and the active one can be closed.
The existing localized interaction test now checks opening the second closes the
first. Native keyboard/no-JavaScript behavior remains available.

Owner spacing correction — 2026-10-16: increase desktop space between the last
axis and the intended-benefits box from 16px to the shared 24px token, matching
the natural mobile gap while retaining the compact viewport composition.

Owner drawing refinement — 2026-10-16: following the thematic-section work,
remove the faint watercolor/photo underpainting from the seven illustrations.
Render only the technical drawing, keeping its existing blue-grey/white treatments,
arrival reveal and accessible image description. The drawing now supplies intrinsic
image geometry; desktop viewport bounds remain. Original media bytes, source
provenance and other page photographs remain unchanged.

## Alternating technical-sheet backgrounds — latest owner clarification, 2026-10-16

Apply the reference's technical-sheet language to the section background rather
than interactive annotations on the illustration. Themes 1/3/5/7 have a subtle
24px grid with 120px major lines and an inset hairline frame; themes 2/4/6 keep
their existing flat surface. Light/dark contrast follows the section palette.
No image pins, spotlights, new image derivatives, extra copy, dimensions or
approval stamps are introduced. Keep native exclusive disclosures and all sources.

A single bounded CSS reveal draws in the background grid/frame on arrival;
reduced motion and no JavaScript show the full background. Focus settles the
effect immediately. The observer no longer tracks scroll frames or changes image
transforms. Existing desktop 100svh scenes and stacked mobile flow remain.

Development review: FR1440×900 all seven closed themes measure 900px; alternating
pseudo-elements follow 1/3/5/7 only. FR next-theme navigation aligns the target
within 1px and opening a second axis closes the first. EN1440×900 dark Mobility
and AR390×844 native accordions/RTL were inspected; mobile has no horizontal
overflow. Scoped lint/format/whitespace checks pass. Reduced-motion coverage is
source inspection only; full automated/production checks remain held. Canonical
anchors, approved text and search projections are unchanged.
