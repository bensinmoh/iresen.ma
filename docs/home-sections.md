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
Short French, English and Arabic wayfinding copy is a draft. Readable text on a
light card body replaces the source's large photographic text overlay, allowing
natural reflow and keeping each technology scene visible.

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
so anchor clearance remains correct. A CSS fallback handles no-JavaScript use.

Passive scroll updates the blue text and underline with `aria-current="location"`
without moving keyboard focus. Native links retain URL hashes, history and
no-JavaScript operation. CSS smooth scrolling is disabled for reduced motion.
Focus rings sit inside the sticky bar; active state does not rely on color alone.

## Missions and media

All three cards appear in one row on desktop, as image/body rows on tablet and
as complete stacked cards below 48rem. No mission is hidden behind a carousel.
Each has a semantic heading, a short description and one canonical destination:
programmes, platforms or transfer. Arabic uses logical flow and mirrored arrows,
with the physical diagonal brand corners preserved.

The requested generated images cover battery and biomass/biofuel research;
CSP, hydrogen, wind and storage testing; and smart-grid energy management.
They illustrate fictional scenes, without identifying real IRESEN people or
facilities. The source/output hashes, dimensions, prompts and WebP conversion
are recorded in [the mission asset manifest](mission-assets.json). Photos load
lazily with reserved 4:3 geometry and responsive Next Image sizes. The optimizer
allowlist adds only `/images/missions/**`; public CMS withdrawal boundaries remain.

Mission section/card copy and all three image originals have explicit localized
search references. Responsive optimizer outputs share their original's identity.
Public indexing remains disabled in the local development site. This change
does not publish or deploy the website.

Executed visual, interaction and application checks are recorded in
[the validation log](validation.md).
