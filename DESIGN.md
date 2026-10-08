# IRESEN visual direction

Use this document for art direction and constructive critique. Use
[the design-system specification](docs/design-system.md) for shared implementation
rules and [PRODUCT.md](PRODUCT.md) for product/content truth. These are working
guidelines: explain useful departures and follow the owner's current instructions.

## Design read

IRESEN should feel scientifically credible and welcoming: confident typography,
precise alignment, generous but purposeful space, and authentic research imagery
when approved. Navy anchors the institution, blue directs attention, and selected
accents distinguish scientific and transfer content. Favor a readable narrative
and useful discovery paths over an internal organigram or repeated decorative cards.

Existing work is a branded foundation with a responsive header and navy footer.
The homepage's empty state is not an established homepage composition. New page
work can develop the visual language without replacing the identity or approved
information architecture. CMS/admin surfaces prioritize clear editing tasks.

## Identity and surfaces

- The owner's selected primary blue is **#296BB4**; navy is **#12345A**. Science
  blue **#4698CA**, transition green **#50A684**, cyan **#77C5D5** and lime
  **#A9C47F** are selective accents. White and **#F4F7F8** support reading.
- Color-book ratios suggest hierarchy, not exact pixel quotas. Most compositions
  need the two core colors and one accent at most. Choose pairings by actual
  contrast, including focus, hover, imagery and translucent overlays.
- Preserve all supplied SVGs byte-for-byte, geometry and aspect ratios included.
  Use the inspected light/reversed variants; white and monochrome filenames both
  refer to white-filled marks. Never reconstruct the wordmark with live text.
- Keep full-width section boundaries flat. Apply the physical top-left and
  bottom-right rounded signature selectively to cards, media and focused controls;
  Arabic does not automatically reverse these brand corners.
- The apex motif supports a few purposeful brand areas. Avoid dense decoration
  behind text, universal pills, generic gradients and effects without a visitor benefit.

## Typography, rhythm and media

The current token system uses an 80rem reading-content maximum, fluid gutters
and a 4/8px spacing rhythm. The footer has the documented wider exception below.
Treat 12/8/4-column desktop/tablet/mobile grids as composition
starting points. Adapt to content; a headline should not become tiny to preserve
a desktop arrangement on mobile.

Licensed, self-hosted Plus Jakarta Sans is the intended Latin family when available;
the Arabic companion still needs review. Current Arial/Helvetica and Tahoma/Arial
fallbacks are deliberate. Do not import a fashionable font or remote font service
just to satisfy an upstream skill. Establish distinct heading/body/metadata roles,
comfortable measure and readable Arabic shaping without added letter spacing.

Compose with real translated labels and variable CMS content. Use image/text
contrasts, selected navy panels, editorial lists and coherent image crops where
they serve the story. Photography, figures and partner logos require reviewed
sources and rights. Complete page exports guide composition; they are never
production hero imagery or evidence of an IRESEN facility.

## Interaction and review

Use accessible native semantics and existing shared components. Show genuine
loading, empty, error and success states. Preserve equivalent locale navigation,
supported anchors, keyboard focus and no-JavaScript access where applicable.
Use logical CSS, isolate mixed-direction identifiers, and mirror only meaningful
directional icons. Keep motion subtle, useful and usable with reduced motion.

For visual changes, inspect relevant desktop/mobile and Arabic renderings, plus
tablet, long content and interaction states as needed. Batch findings, fix them,
then confirm. Record actual coverage and limitations; a source review is not a
rendered comparison and automation does not establish full WCAG conformance.

## References and decisions

[Asset inventory](docs/asset-inventory.md), [reference handling](docs/references/README.md),
[primary-blue decision](docs/adr/0003-owner-selected-primary-blue.md) and
[footer implementation](docs/footer.md) describe the available evidence.
The native Figma reference is now recovered and thoroughly analyzed; use
[its measured language](docs/design-system.md#native-design-language-analysis--2026-10-08)
and [source evidence](docs/references/figma/design-evidence.json) for page composition,
typography, selected corners, component anatomy and mobile adaptations. Fourteen
desktop and thirteen full mobile pages are verified structurally. Wide media,
display type, marked section labels, flat section bands and editorial rows form
the source's visual direction. Current approved colors and product/content truth
retain precedence over its historical palette and mockup content.

The brief's standalone export boards and licensed font files remain unavailable
in the checkout; the owner reattached Footer.png in chat for the current rework.
Native Figma rendering, dedicated RTL/tablet references and effective prototype
behavior remain unverified. Verify availability/freshness before claiming a direct
comparison. Existing footer screenshots are prior review artifacts, not supplied
references or proof of a new rendering.

Record adopted shared improvements here and in the design-system specification,
with the reason and verification. Keep proposals, experimental directions and
unfinished measurements clearly separate from implemented decisions.

## Adopted UI refinements — 2026-10-08

The header groups language access and the menu across the available mobile width,
with a clear border between identity and controls. Active language links use a
quiet blue surface as well as an underline; the menu has an identifiable control
boundary. Search retains a 44px-high interaction target.

The earlier footer refinement used distinct type roles: 16px body/desktop links,
14px group headings and utility/mobile links, and 13px copyright metadata at the
default root size. Section headings carried hierarchy while navigation links used
regular weight.
Contact was the primary engagement action; news and transfer were grouped beneath
it. A fine divider separated utility navigation. These roles consume shared tokens
and remain fluid with user text settings, logical layout and RTL.

Verified in the local production build across FR/EN/AR at 320, 390, 768, 1024 and
1440px, including open navigation. At 320 and 1440px, 200% root text enlargement
retains viewport containment in all three languages. Reduced motion, equivalent
locale navigation, keyboard focus and no-JavaScript access were checked. Existing
browser/axe checks passed; cross-browser and screen-reader coverage remain separate.

## Footer reference rework — 2026-10-08

The footer now follows the broad composition of native frame `1584:6681` and the
owner-reattached Footer.png: identity plus four navigation groups, a contact/social
row, a divider, prominent newsletter copy and signup controls, then compact utility
and language access. A footer-specific 120rem maximum and fluid 3.125vw side
gutters preserve the source's broad proportions instead of compressing it to
the reading-content width. Group labels remain 14px; desktop links use 16px and
600 weight, while the newsletter heading has its own fluid display role.

The requested newsletter form remains visible with disabled controls and a
localized unavailable notice until signup is configured. Approved colors, SVGs,
routes, contact information and networks supersede historical mockup content.
Mobile and Arabic reflow are adaptations; decoded source evidence does not
establish native rendered fidelity. Current verification is recorded in
[the footer log](docs/footer.md#reference-rework-verification--2026-10-08).
