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
