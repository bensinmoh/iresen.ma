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
page. The homepage's narrow blue band now displays five owner-supplied key figures.
Other pages link the approved **Développer · Éprouver · Valoriser** reading
framework; institute additionally shows the established 2011 founding year,
already supported by the existing institutional footer source.

Historical mockup statistics and certification are not imported as facts. The
homepage figures below come from the owner's explicit request; no counts,
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

The full landing uses a viewport **minimum**, not a clipped fixed height. The
title, introduction, actions and bottom band fit the available space or grow
naturally when narrow screens, large user text or long content require it. The
homepage's five-figure band can extend the hero beyond one viewport on narrow
screens. This preserves readability and all supplied facts. Without JavaScript,
CSS `100dvh` and responsive header
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

## Shared figure typography — 2026-10-08

The owner supplied three Figma screenshot hints from 2026-10-08 at 20.37.38,
20.41.03 and 20.41.08 for numeric values and their labels. The five homepage
figures supplied in the later user message and the existing 2011 founding year
on institute consume the shared `.key-figure` roles.

The white value uses Plus Jakarta Sans at weight 600, line height 1 and zero
tracking, fluidly scaling from 36px to the source's 60px at the default root size.
The base label role uses 18px/500 with line height 1 and zero tracking for
French/English; the homepage uses 1.35 line height for its longer wrapping labels.
Value and label remain stacked on mobile. Arabic keeps isolated Latin
numerals in Plus Jakarta Sans; labels retain the Arabic body family, natural
tracking and line height 1.45.

The shared label color defaults to the source's 70% white. The current blue hero
band uses 87% white to reach approximately 4.55:1 contrast for the 18px label on
`#296BB4`; 70% would provide only about 3.54:1. See
[shared figure rules](design-system.md#shared-key-figure-typography--2026-10-08)
and [the validation log](validation.md) for this revision's executed checks and
renderings. The screenshots are style references, not content approval or evidence
of rendered application behavior.

## Homepage key figures — 2026-10-08

The owner explicitly requested these five values and French labels for the
homepage hero band, replacing its founding-year and mission/pathway items.
The content source is the user's message; the three Figma screenshots above
provide typography hints. French spelling is corrected without changing meaning.
English and Arabic labels are draft translations of that supplied French.

| Value | Requested French label                   | English draft                       | Arabic draft          |
| ----- | ---------------------------------------- | ----------------------------------- | --------------------- |
| 69    | Projets collaboratifs soutenus           | Collaborative projects supported    | مشاريع تعاونية مدعومة |
| +60   | Brevets déposés                          | Patents filed                       | براءات اختراع مودعة   |
| +1000 | Jeunes chercheurs soutenus               | Young researchers supported         | باحثون شباب مدعومون   |
| +1100 | Publications scientifiques               | Scientific publications             | منشورات علمية         |
| +18   | Laboratoires universitaires mis en place | University laboratories established | مختبرات جامعية أُنشئت |

`src/lib/figures.ts` records the stable IDs and values; `Hero.figures` in the
FR/EN/AR catalogs records the labels. A semantic definition list pairs each
label with its value, with the value displayed above the label. Arabic uses
LTR-isolated values so the leading plus signs remain in place. The band uses
auto-fit tracks inside the shared page container, with a `min(100%, 12rem)` track
minimum, reduced to `min(100%, 10rem)` below `35rem`. At the default root size,
24px mobile/tablet and 32px wide gaps give five columns at 1440/1920px, three at
768px, two at 390px and one at 320px. Below `35rem`, the last item spans the row;
each value/label pair stays stacked. Text enlargement adapts the column count,
and the hero grows on narrow screens to display all five facts.
Other pages keep the existing pathway band, with 2011 retained on institute.

Current checks and rendered coverage belong in [the validation log](validation.md).
Earlier evidence below and retained screenshots predate these figure changes.

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
