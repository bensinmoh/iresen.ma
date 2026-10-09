# Homepage mission cards and section navigation

The owner's 9 October 2026 request adds a homepage-only submenu immediately after
the existing five figures, followed by the three mission blocks. The live
[homepage reference](https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=804-5998)
was inspected through native screenshots, structure and design context. Its
60px white submenu, underline, centered mission introduction, three equal image
cards and diagonal corners inform the implementation.

The current approved narrative, routes, blue/navy and Jakarta/Alexandria families
remain authoritative. The blocks explain Développer · Éprouver · Valoriser;
the source's audience/funding copy does not create new services or claims.
Short French, English and Arabic wayfinding copy remains a draft. The owner's
later video refinement restores full photographic cards with white headings,
descriptions and inline underlined destinations near the bottom. Dark shading
supports readability; text remains in normal flow for multilingual reflow.

The supplied `Screen Recording 2026-10-09 at 13.12.08.mov` was inspected privately:
1242 × 1582px, H.264 at a nominal 120fps, 6.783 seconds. Its still and tinted/zoomed states guide image
coverage, bottom text placement, the underlined destination and physical
top-left/bottom-right corners. The video and extracted frames are reference-only
and are excluded from the repository. Its audience/funding examples do not
replace the current mission copy, claims or destinations.

## Navigation behavior

`HomeSectionNavigation` is rendered only by `HomePage`, directly after `PageHero`
and before the content container. Six native anchors follow the remaining home
sections in order: mission, research, results, platforms, collaboration and news.
The existing `figures` anchor now belongs to the real figure band; its redundant
body placeholder is omitted. Stable section IDs and canonical routes remain.

At widths of 64rem (1024px with the default browser font) and above, the white
bar enters in normal flow and pins to the top of the viewport. The existing
global header scrolls away with the hero. Below 64rem the bar is hidden, including
its focus targets. All sections and mission destinations remain available.
Labels can wrap at enlarged text sizes; a ResizeObserver measures the whole bar
so anchor clearance remains correct. Without JavaScript, the native bar retains
a single horizontally scrollable row with the site's hidden-scrollbar policy,
keeping its CSS anchor offset valid at enlarged text sizes.
The content container uses only the native anchor clearance after the bar,
followed by the mission section's own spacing; it avoids doubling the generic
page-shell and section padding.

Passive scroll updates the blue text and underline with `aria-current="location"`
without moving keyboard focus. The current marker starts after hydration, avoiding
a misleading fixed active link when JavaScript is disabled. Native links retain URL hashes, history and
no-JavaScript operation. CSS smooth scrolling is disabled for reduced motion.
Focus rings sit inside the sticky bar; active state does not rely on color alone.

## Missions and media

All three full photographic cards appear in one row from 64rem and stack as
photographic cards between 48rem and 64rem. Below 48rem, they form a native horizontal
scroll collection with CSS scroll snapping and the site's hidden scrollbar.
Cards show a neighboring-card glimpse where space permits. Their minimum width
is capped at the available space, so enlarged text can use a full-width card;
copy grows naturally without a fixed height or nested vertical scroll.
Keyboard focus reveals each destination, touch scrolls the collection and native
scrolling works without JavaScript. All three cards remain in logical DOM order,
including Arabic RTL, without automatic advancement or additional controls.
Each has a semantic heading, a short description and one canonical destination:
programmes, platforms or transfer. Arabic uses logical flow and mirrored arrows,
with the physical diagonal brand corners preserved.

Fine-pointer hover and keyboard focus apply a blue image tint and a slight 1.04
image zoom. The photograph moves within its clipped card; the card and text
geometry stay stable. A dark shade covers the text area in both states, and
the inline destination has a light visible focus ring. Reduced motion disables
the zoom and transitions, while the blue tint applies immediately. Touch users
retain the readable resting state and native destinations.

The current generated images depict battery and biomass/biofuel research;
CSP, hydrogen, wind and storage testing; and smart-grid energy management.
They illustrate fictional scenes, without identifying real IRESEN people or
facilities. The source/output hashes, dimensions, prompts and WebP conversion
are recorded in [the mission asset manifest](mission-assets.json). The original
images remain 4:3 sources, cropped to fill the cards; they load lazily with
responsive Next Image sizes. The optimizer
allowlist adds only `/images/missions/**`; public CMS withdrawal boundaries remain.

The owner's subsequent clarification makes technology breadth a website-wide
direction. Each photo must directly match the meaning of its section rather
than include a prescribed technology mix. At a later mission-image review,
Développer should depict laboratory R&D; Éprouver should depict equipment
testing, with solar equipment as an example; Valoriser should depict a person
holding a finished product. Current assets and their provenance remain for now.

Mission section/card copy and all three image originals have explicit localized
search references. Responsive optimizer outputs share their original's identity.
Public indexing remains disabled in the local development site. This change
does not publish or deploy the website.

Executed visual, interaction and application checks are recorded in
[the validation log](validation.md).

## Deferred homepage restructuring — 2026-10-09

The later [six-section brief](homepage-restructure.md) records the owner's revised
homepage direction. Its current scope is analysis and Markdown only; preserve
the missions and section navigation documented above until the owner starts
development of “Nos réalisations emblématiques”, the section after missions.
That later increment will move achievements immediately after missions and align
the navigation with the revised body order. The real hero figures retain their
existing anchor. Source mission wording/composition is planning evidence and
does not replace the delivered cards through this documentation task.
