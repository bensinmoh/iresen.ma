# Institute page — 2026-10-11

## Narrative supersession — 2026-10-14

The [October PDF implementation](institutional-narrative-2026.md) now governs the R&I core, three
missions, three complementary dimensions and six audience pathways. The earlier
equal-domain/common-enabler composition and five-step homepage rail described
below are historical. Existing canonical routes, content provenance and service
boundaries remain. The owner reserves the explicit merge GO for the review branch.

The owner commissioned the canonical Institute page after Governance completion
(PR #93). The supplied French manuscript defines its content over Figma sample
claims. The private manuscript and source PDF are not imported into the repository
or served. EN/AR are complete working adaptations awaiting final editorial review.

## Composition and sources

Native Figma frame `804:8896`, the supplied `about.png` and subsequent owner
screenshots inform typography, surfaces, dividers, quotation, timeline markers
and navigation. Sample figures, four-pole organisation and invented report files
are excluded. The [retained benchmark](references/benchmark/README.md) informs
purpose before institutional detail, distinct contributions and useful resources.

The hero reuses the owner's real headquarters photograph from contact, with
responsive Next Image optimization and its existing media/search reference. See
[original provenance](asset-inventory.md#contact-headquarters-photo--2026-10-09).
The founding band places “Since” above 2011. The existing HeroViewport calculation
sizes the whole hero, from header top through the band bottom, on resize and
orientation changes, with natural growth for enlarged text.

The full-width mission quotation uses institutional navy, a shaded existing
solar-aerial illustration and visible opening/closing guillemets. Equal responsive
spacing centers its label between the section start and quotation. The redundant
second introductory sentence is withdrawn from all locales and search bodies.
Positioning leads into three substantial missions with complete activity
listings in native disclosures, their common cooperation band, five values and
a distinct 2035 ambition. Governance stays on its separate canonical page.

Solar-aerial/workshop imagery remains conceptual illustration, with unchanged
provenance in [hero-assets.json](hero-assets.json). It does not document actual
IRESEN personnel/facilities. No new dependency, font, icon raster or CMS schema.

## Historical timeline

Eight principal milestones run in ascending 2011–2026 order. FR/EN read left to
right; Arabic reads right to left, following the owner's latest correction.
The connected hairline, blue dates/titles, halo markers and circular SVG arrows
follow the supplied close-up. A centered progress bar and fixed eight-item counter
(1/8–8/8) track one milestone per arrow click, touch scrolling and keyboard access.
Trailing spacing lets the final entry reach the leading edge. No auto-scroll.

Both supporting achievements (2012–2015 solar laboratories and 2025 MENALINKS),
and their heading, are withdrawn from the page and its public search projection.
The eight major items remain readable without JavaScript; scripted controls are
hidden until enhancement is available. Reduced motion removes smooth scrolling
and progress transitions.

## Fifteen-year report

The book uses only the supplied mockup's first-page cover. Owner-requested
AI-assisted background removal and ground-shadow reconstruction produce the
alpha WebP recorded in [institute-assets.json](institute-assets.json). The new
cutout URL prevents reuse of the earlier rectangular optimized image. Its original
PDF and eight other pages remain excluded; embedded strategic claims are source
data, not adopted page facts or a public report download.

On desktop the enlarged book is centered beside the text, extends modestly into
the preceding navy section and aligns its visible base to the Consult action.
The surface is white; the heading and eyebrow appear above the prose. Spacing
uses readable leading, distinct paragraph gaps and breathing room before the
button. Tablet aligns the book's leading edge with the action, mirrored in Arabic.
On mobile the order is heading/prose, centered book, then action with extra space.
The shadow is allowed to fade freely beyond the book base.

The owner removed the separate download action. The clickable cover and single
“Consult the activity report” button both use `#` until the actual PDF is supplied.
No fake file, download attribute, size, publication date or substitute document.
The actual PDF must replace these placeholders before a real download workflow.
Publications/reports and media link to their existing canonical sections.

## Routes, reading and search

`src/lib/site.ts` remains the routing authority: `/fr/institut`, `/en/institute`,
`/ar/المعهد`. Six legacy targets remain: `about`, `mission`, `capabilities`,
`ambition-2035`, `key-figures`, `more-resources`. `key-figures` is a compatibility
anchor in history, not a new figures dataset. The section map adds positioning,
the three missions, cooperation, values and history as children; locale switching
preserves their anchors.

The static search projection includes complete page/section text in FR/EN/AR,
real topic terms and acronym expansions. The cover is localized media, with no
invented report document result. Private sources, editorial references and
withdrawn copy remain excluded. Current public/CMS gates are preserved.
Native details support keyboard and no-JavaScript reading. Shared first-arrival
motion owns headings/quotations; reduced motion preserves immediate reading.

See [verification](validation.md#institute-page--2026-10-11). Final translation/
editorial approval and the full-content search sanity check remain pending.
No deployment or visibility change is authorized.

## Owner design review — 2026-10-14

The owner requests inspiration from the [ClickUp narrative presentation](https://2661198.clickup.ai/a/h/2h6ue-3992/e7584a7b4057bd1).
Its cover and impact-model board were inspected directly. The reference informs
composition only: no external photos, slogans or additional claims are imported.
A page-specific semantic model uses a decorative three-sector SVG arc around the
R&I core, with readable mission descriptions, canonical links and three supporting
contributions below. Arabic mirrors the diagram and keeps native text direction.
Shared capability content, detailed native disclosures and all anchors remain.

The light model surface, stronger editorial spacing, vector mission marks,
numbered values and framed ambition photograph reuse existing identity tokens.
The headquarters hero, eight-item timeline and report placeholder remain intact.
No new public asset or content is added; existing section/media search references
continue to describe the same content. Prior owner text withdrawals remain absent.

Verification ledger: development render inspected in French at 1440px and Arabic
at 390px; Arabic page width equals viewport width (390px). English native activity disclosure checked at 1440px. Targeted source lint
and formatting pass; the design detector only flags the existing timeline width
transition, outside this correction. No global tests, production build or merge: deferred by owner.

## Positioning heading overlap — owner report, 2026-10-14

The positioning title was sticky within a grid containing a later full-width
ecosystem diagram. Scrolling into that diagram could keep the title above it,
causing text overlap. Remove sticky positioning from this title; its initial
two-column composition remains. Add FR/EN/AR production regression coverage at
1920, 1280, 1024 and 390px, scrolling directly to the ecosystem caption and
asserting the title ends before the diagram begins. This correction requires
new current-head CI before merge.

Owner compact-model follow-up places the existing mission introduction in the
leading column and the semicircle/description in the trailing column on desktop.
At 64rem and below they stack in reading order; Arabic mirrors the columns.
Diagram labels scale with their own container width to remain inside the smaller
semicircle. Content, canonical anchors and search copy are unchanged.

## Institute model refinement — 2026-10-15

The owner rejected the semicircular model as inconsistent with the site. The
Institute overview now pairs its introduction with a navy editorial R&I panel,
using existing signature corners, cyan SVG/label accents and native white text.
The three mission descriptions and links follow on fine separators; complementary
dimensions and capabilities retain their content and destinations. This scoped
refinement uses the Figma design-system evidence (2211:6303/2211:6298) and current
website tokens rather than introducing new diagram geometry or color roles.
Mobile/tablet stack the overview; Arabic uses logical reading order. Public text,
anchors and search references are unchanged, so no index rebuild is required.

Refinement check ledger: isolated production build (including TypeScript) passed;
lint passed with the temporary build directory excluded; changed-file Prettier,
whitespace and Impeccable detector passed. Production Chromium checked FR/EN/AR at
390, 768 and 1440px: no document overflow or clipped text blocks detected. Section
captures were inspected for desktop French, tablet English and mobile Arabic.
No new interaction or public search resource was introduced. Full current-head
CI remains the merge gate; no deployment is included.

## Ambition quotation redesign — 2026-10-16

Owner-requested replacement of the Institute `ambition-2035` split layout with
a full-width solar landscape, navy contrast veil, the unchanged ambition in
French guillemets and its localized subtitle above. Only these two text elements
remain; explanatory paragraphs and strategic orientations are removed from this
section. Other institutional sections retain their content. Reuses the existing
AI-generated `solar-horizon` conceptual illustration and its provenance in
`hero-assets.json`; this is not documentary evidence of an IRESEN installation.
No image bytes, routes, anchors or publication gates change. The existing media
search reference also associates this use with Institute; section/page search
projections exclude the withdrawn ambition paragraphs. EN/AR remain working copy.

Verification ledger: scoped ESLint and Prettier pass. Development preview checked
FR desktop at 1440px and AR mobile at 390px; section has no horizontal overflow.
Impeccable detector reports only the pre-existing timeline width transition,
outside this change. Production build, full tests, CI, commit and merge remain
paused under the shared-checkout hold. Available shell Node is 24.19.0 rather
than the pinned 24.22.0; no application-suite evidence is claimed.

Owner typography correction: subtitle above; quotation in bold italic (700).
The complete French quotation occupies four lines at the inspected 1280px desktop
viewport (186.375px text height / 46.592px leading). Mobile retains natural
wrapping rather than truncation or unreadably small text. Scoped ESLint, formatting
and whitespace checks pass; shared-checkout hold remains in effect.

## Compact ambition and visionary portrait — 2026-10-16

Owner follow-up reduces the desktop section to 22–28rem, positions the text
on the left at 73% width and adds a thoughtful, fully colored fictional portrait
on the right. Subtitle stays above the unchanged bold italic quotation. Mobile
retains the complete text above a dedicated bottom portrait area. The generated
alpha WebP is 700×1050, 178,942 bytes; provenance and prompt are recorded in
`institute-assets.json`. The person does not depict a real employee. Its localized
media search reference describes the conceptual image in FR/EN/AR, under current
publication gates. The exact local image path is registered in Next image config.

Scoped ESLint/Prettier and whitespace checks apply; full tests, production build,
CI and merge remain paused by the shared-checkout hold.

Development visual check: FR 1280px section height 371.2px, complete bold italic
quotation in three lines, loaded color portrait separate from text; AR 390px
shows complete text above the portrait with section scrollWidth = clientWidth.
Both rendered captures inspected. Impeccable detector retains only the existing
timeline-width warning outside scope. No new client code or interaction added.

Integrated ambition scene follow-up — 2026-10-16: the owner replaces the isolated
portrait composition with a generated solar landscape containing the same person
and an alpha extraction from that scene. Desktop background and foreground share
the same full-canvas geometry and bottom-right crop; only the scenery is clipped
and navy-treated. The color silhouette overflows the top by about 40–64px, with
text above its transparent region. Mobile keeps a landscape reading surface and
the matching silhouette below the text, avoiding duplicate background figures.
The previous portrait is retained as a source; scene/cutout provenance and prompts
are recorded in institute-assets.json. The cutout shares the scene search result.

Check ledger for integrated scene: inspected FR desktop 1280px with prior values
section visible; head emerges above the frame without touching its preceding text,
background/foreground stay aligned, quotation remains complete. AR 390px renders
all three image layers, with one visible silhouette and no horizontal overflow.
Foreground source sizing reserves enough pixels for the cropped mobile canvas.
Scoped ESLint, Prettier and whitespace pass. Full suite/build/CI/Git operations
remain paused by the shared-checkout hold.

Ambition palette correction — 2026-10-16: owner rejects the warm sunset/terracotta
treatment. Current scene and matching cutout use neutral daylight, muted blue
overshirt, natural skin and blue-grey landscape to blend with IRESEN navy/blue.
Composition, compact quotation, foreground layering and top overflow remain.
The new versioned WebPs retain prior source assets; generation prompts and hashes
are recorded in institute-assets.json. Existing localized media search ID points
to the current scene; cutout shares its result.

Cool-variant check ledger: inspected FR development rendering at 1280px with
preceding white values and following navy timeline visible. Both new assets load;
no section horizontal overflow, no golden rim or terracotta clothing, matching
foreground/canvas retained. Existing mobile geometry is unchanged. Scoped ESLint,
Prettier and whitespace pass. Full tests/build/CI/Git remain held by coordination.

Portrait clipping/detail correction — 2026-10-16: the full-width canvas previously
used cover, which cropped the head once the desktop section height reached its
cap. Desktop scene and foreground now share bottom-right contain geometry. An
existing full-bleed solar layer fills the remaining area; the integrated scene's
leading edge blends into it. Mobile retains its isolated bottom crop. Foreground
uses a 354,432-byte lossless alpha WebP directly from the original generation,
without Next image downsampling/recompression; no higher native resolution is
claimed. At 2048px desktop, the complete head and top overflow are verified,
with no section horizontal overflow. Original and intermediate files remain.
The new cutout is a delivery derivative sharing the scene's search result.

Verification: FR2048 desktop and AR390 mobile inspected; complete head, loaded
lossless foreground, no section horizontal overflow. Scoped ESLint/Prettier and
whitespace pass; detector only flags inherited timeline width transition. Full
build/tests/CI/Git remain paused by coordination.

Ambition silhouette clearance — 2026-10-16: owner requests shaped negative space
between quotation and person. A non-painted right float uses CSS shape-outside
to reserve a head-to-elbow contour plus 24–48px breathing room. Text flows around
that exclusion instead of ending at a fixed 73% column. The exclusion stays
physically right with the portrait, including RTL; mobile disables it because
text and portrait already occupy separate vertical areas. Copy, routes, assets
and search projections are unchanged.

Development verification: FR1280 quotation remains four lines with visible
shoulder/arm clearance; EN1024 has no section overflow and clear separation.
Mobile Arabic retains the previous stack. Changed-file formatting/whitespace
pass; no application-suite run under the current shared-checkout hold.

Institute values cards — 2026-10-16: owner commissions the supplied reference
composition for the five existing values: centered static heading, pale shared
surface, white signature-corner cards and regular Phosphor SVGs in circular
Transition Green (#50A684) pastilles with navy glyphs for contrast. Remove the
previous sticky header and numbered editorial rows. Desktop uses five columns;
tablet uses two with the final card spanning both; mobile stacks all five.
Existing FR/EN/AR wording and the institute-values anchor/search projection stay
unchanged. No new public media or factual copy is added.

Values verification: FR1440 five cards inspected and AR390 native stacked cards
inspected; five records, static header, no section overflow. Computed pastille
background rgb(80,166,132) matches Transition Green; navy glyph contrast matches
the documented shared pair. Scoped ESLint, Prettier and whitespace pass; full
checks/CI/Git remain paused under the shared-checkout hold.

Mobile ambition text wrap — 2026-10-16: owner requests a modestly larger person
and quotation continuing into the lower-left area. Mobile now floats a tight
lossless alpha crop within the quotation, with a 12px shape margin and CSS
shape-outside using the actual image transparency. Full-width opening lines
transition into narrower lines beside the silhouette; French native hyphenation
avoids arbitrary broken words. Portrait width is 52% of the reading area (about
264px tall at 390px versus the earlier 240px); no fixed empty bottom strip.
The existing desktop composition is unchanged. The crop shares the original
scene search result, with provenance in institute-assets.json.

Mobile-flow check ledger: FR390 and AR390 dev captures inspected, image loaded,
portrait height 264.3px, complete quotation follows the real silhouette with
clearance, and section scrollWidth equals clientWidth. Scoped ESLint, format
and whitespace pass; detector only flags existing timeline width transition.
Full tests/build/CI/Git stay paused under the shared-checkout hold.

Values icon owner correction — 2026-10-16: decorative SVGs now use white on
Transition Green pastilles. This supersedes the earlier navy glyph treatment.
Value names remain native navy text; no content, layout or search change.

Ambition vertical alignment — 2026-10-16: center the visible subtitle/quotation
group independently of the taller float used for silhouette clearance. A scoped
CSS offset compensates only when the exclusion is taller than the actual copy;
mobile retains its existing natural contour flow. FR1280 development inspection
measures text/section center difference below 0.01px. Copy, shape clearance, media
and search remain unchanged; formatting/whitespace checked, full checks held.

Tablet ambition background correction — 2026-10-16: at 40–80rem the panorama
contain layer could leave a visible horizontal top edge over the base landscape.
These widths now use only the continuous full-bleed landscape underneath the
independently contained color silhouette. Desktop panorama and mobile alpha-flow
compositions retain their existing rules. No asset, content or search changes.
FR900 development capture confirms uninterrupted background, complete silhouette,
centered text and no section overflow. Formatting/whitespace pass; broad checks
remain paused by the shared-checkout hold.

Values horizontal navigation — 2026-10-16: owner replaces responsive wrapping
with one native horizontally scrollable row as soon as five cards no longer fit.
Auto columns retain a 14rem minimum and share space evenly when all five fit;
mobile cards use min(82vw,20rem) to reveal the following card. Keep the existing
white SVG/Transition Green cards and static title. The localized definition list
is keyboard-focusable and labelled by the heading, with native RTL scrolling,
proximity snap, contained horizontal overscroll and inset focus outline. No new
pills, arrows, JavaScript or media; copy/anchors/search remain unchanged.

Dev checks: FR390 has five equal-top cards and 1663px scroll width in a 358px
viewport; keyboard ArrowRight scrolls 40px. AR768 retains RTL and a single row
with native overflow. Scoped ESLint, formatting and whitespace pass; full
tests/build/CI/Git remain held by coordination.

Institute hero band single row — 2026-10-16: keep the localized founding label,
2011 and existing pathway navigation in one horizontal row at every width. The
founding label/year share a baseline and retain their existing type roles; the
pathway rail takes remaining space and keeps native touch/keyboard/RTL scrolling.
This locally overrides the earlier narrow stacked founding block, without
changing other pages, destinations, text or search references.

## Editorial variant — 2026-10-16

The owner commissions the supplied Éditorial composition for mission,
positioning and contributions. It supersedes the repeated mission chapters,
shared-capabilities aside and separate cooperation band: typographic exact mission,
compact interface labels, navy R&I core, three complementary native disclosures,
three accessible activity tabs and a short closing. Existing hero, values,
ambition, chronology/report and legacy anchors remain. See
[scope and verification](institute-editorial.md). EN/AR remain working copy;
full checks/CI/Git wait for the shared coordination batch.

Mobile ambition owner correction — 2026-10-16: replace the fixed narrow quotation
column with native text exclusion traced from the existing portrait alpha. A
scoped mobile layout enhancement keeps the portrait on the section's bottom edge
while fitting text around its silhouette. FR text is left-aligned; AR reading
direction, all copy/assets and desktop composition remain. See
[implementation and verification](institute-editorial.md#mobile-ambition-contour-and-bottom-edge--2026-10-16).

Local preview routing repair — 2026-10-16: restarting development exposed a
307 redirect from the French Institute URL back to itself after next-intl rewrote
it to its internal pathname. Extend the existing Programmes direct-localized-route
exception to Institute and resolve those two page IDs consistently in metadata and
page rendering. Canonical routes, publication gates and search URLs stay unchanged.
FR local browser preview now renders successfully; scoped ESLint, format and
whitespace checks pass. Full tests/build/CI remain held by shared coordination.
