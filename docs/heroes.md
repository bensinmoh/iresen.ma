# Introductory page heroes

Implemented on 2026-10-08 from the owner's hero screenshot (inspiration), the
recorded native Figma design language and the approved information architecture.
The owner's clarification keeps the heroes introductory: detailed content belongs
in the sections below. No complete homepage or editorial listing is implied.

## Composition and content

All 22 approved pages use the shared server-rendered `PageHero`, with composition
selected by stable page ID in `src/lib/heroes.ts`. Start, end, center, split and
quiet editorial layouts vary by topic. Each introduction contains one title, a
short descriptive sentence, an anchor to its content sections and one related
page. The narrow blue band links the approved **Développer · Éprouver · Valoriser**
reading framework. Home and institute additionally show the established 2011
founding year, already supported by the existing institutional footer source.

The screenshot's sample figures and certification are omitted. No counts,
results, commitments or testimonials are invented. `Hero` FR/EN/AR catalog copy
is a wayfinding draft, subject to editorial and translation review before
production publication. Existing empty sections, institute anchors, sitemap
content and truthful unavailable states remain below the hero.

Seventeen individual images from the owner-supplied native Figma source illustrate
research, renewable energy, collaboration and knowledge sharing. They are
decorative backgrounds with empty alternatives; neither the text nor the images
identify pictured people or facilities as IRESEN assets. Derivatives are WebP,
never upscaled, and served through responsive Next Image with eager/high-priority
loading. Only the current page's background is requested. No video autoplay or
external image host is involved.

[hero-assets.json](hero-assets.json) records archive entries, source/output hashes,
dimensions, transformations and byte counts. The source remains unchanged;
derivatives total 1,878,042 bytes. Individual licenses, credits and subjects remain
unverified and need review or approved replacements before production publication.
No deployment or publication was performed by this change.

## Viewport and navigation

The header overlays the introduction with the supplied reversed logo, white
labels and a dark-to-transparent gradient. Existing white mega-menus and compact
native disclosures retain keyboard, pointer, touch, focus and no-JavaScript
behavior. When no hero renders, the header stays in normal flow.

`HeroViewport` measures `visualViewport.height` at scale 1, falling back to
`innerHeight`, and measures the actual header's rendered height. It sets local CSS
properties for the complete hero, including the bottom band, and header clearance
inside the scene. Window resize, orientation and visual-viewport resize schedule
updates through one animation frame. A `ResizeObserver` tracks header reflow,
including enlarged text and navigation breakpoints. All listeners/observers are
removed on unmount. Pinch zoom does not reduce the hero to the magnified viewport.

The full landing uses a viewport **minimum**, not a clipped fixed height. Regular
portrait/desktop views include the title, introduction, actions and bottom band
before scrolling; small landscape screens, large user text and exceptionally long
copy can grow naturally. This preserves readability instead of hiding content or
shrinking typography. Without JavaScript, CSS `100dvh` and responsive header
clearance estimates retain the layout and all native links. Arabic uses logical
alignment, natural shaping/tracking and mirrored directional arrows.

## Owner refinements — 2026-10-08

The hero-body now uses the same centered container as the header, blue narrative
band, sections below and footer: a 120rem maximum with side gutters of
`clamp(1.25rem, 3.125vw, 4rem)`. This reduces the previous hero/body inset on wide
screens and gives the complete page consistent outer alignment. Individual copy
measures and the five layout variations still control text placement within it.

French/English hero H1s use −3% letter spacing (`-0.03em`) at every breakpoint;
Arabic retains natural tracking. The public Latin font is now self-hosted Plus
Jakarta Sans, including the Découvrir action and native button controls. See
[font provenance and loading](fonts.md). Arabic's reviewed companion remains a
follow-up input; its existing Tahoma/Arial stack is retained.

The header menu's text/arrow group centers in its full control width, and the
compact Menu control centers its contents. Selected languages use bold 700 alone
in the header and footer dropdown, retaining hover and keyboard-focus feedback.
See [shared design rules](design-system.md#hero-layout-and-typography-refinements--2026-10-08)
and [the validation log](validation.md) for current executed checks and renderings.

## Original implementation verification

The following coverage belongs to the initial hero implementation, before the
owner refinements above; retained screenshots show that earlier revision.

- Lint, strict types, 8 unit tests, 4 CMS integration tests and production build
  passed. The build retains the existing next-intl webpack cache warnings.
- All 35 Chromium browser tests passed, including all 22 pages in FR/EN/AR,
  loaded background images, one H1, section-anchor scrolling, the full 900px
  landing, viewport resizing, 200% text at 320px, navigation/locale behavior,
  automated accessibility checks and no-JavaScript navigation.
- Additional mobile geometry checks passed for all 66 localized routes at
  390 × 844: the complete landing fits, titles clear the header and no horizontal
  overflow occurs. Representative transfer/publications/opportunities heroes also
  passed focused axe checks.
- Rendered review covers the five layouts at 1440 × 900, Arabic home/network at
  390 × 844 and English home at 768 × 1024. Review screenshots are listed below.

Chromium automation and rendered review do not establish native Figma pixel
fidelity, cross-browser compatibility, screen-reader conformance or final media/
translation approval. Native Figma rendering remains unavailable; recovered
geometry and the owner's screenshot establish composition inspiration.

## Review screenshots

- [French homepage](screenshots/hero-fr-desktop.png)
- [French split platforms hero](screenshots/hero-platforms-fr-desktop.png)
- [French right-aligned programmes hero](screenshots/hero-programmes-fr-desktop.png)
- [Arabic mobile homepage](screenshots/hero-ar-mobile.png)
