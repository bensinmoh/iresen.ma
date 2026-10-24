# Projects initial viewport — 23 October 2026

The owner requests that the projects search section be visible on initial load.
The catalogue now reuses `HeroViewport` around its introduction, optional local
translation-review notice and complete search band. The image area takes the
remaining height, with measured header clearance, height-responsive title size
and bounded search spacing. The viewport minimum grows naturally for content
that cannot fit; controls and text are never clipped to a fixed height.

Existing content, canonical section anchors, filters, local review gates, media
and search projections remain unchanged. No new public resource is introduced.

Development browser review: French 1280×720, 390×844 and 390×667; Arabic RTL
390×667 including the local review notice. In each case the complete search band
ends at the viewport bottom with no document horizontal overflow. Shared resize
measurement responds to viewport changes. Scoped ESLint, Prettier and whitespace
checks pass. Full tests, production build, CI and Git completion remain pending
under the existing shared-checkout coordination hold.
