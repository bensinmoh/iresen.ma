# Introductory page heroes

Initially implemented on 2026-10-08 from the owner's hero screenshot (inspiration), the
recorded native Figma design language and the approved information architecture.
The owner's clarification keeps the heroes introductory: detailed content belongs
in the sections below. No complete homepage or editorial listing is implied.
The generated backgrounds below replace the initial Figma-derived imagery on
2026-10-09 while retaining that framework.

## Composition and content

The approved pages other than search use the shared server-rendered `PageHero`, with composition
selected by stable page ID in `src/lib/heroes.ts`. Start, end, center, split and
quiet editorial layouts vary by topic. Each introduction contains one title, a
short descriptive sentence, an anchor to its content sections and one related
page. The homepage's narrow blue band now displays five owner-supplied key figures.
Other pages link the approved **Développer · Éprouver · Valoriser** reading
framework; institute additionally shows the established 2011 founding year,
already supported by the existing institutional footer source.

The initial implementation omitted historical mockup statistics and certification.
The owner's later direct requests authorize the five homepage figures and the
certification badge below for the local working site. This records owner-supplied
claims, without independent certification verification. Other source claims
remain unadopted. `Hero` FR/EN/AR catalog copy
is a wayfinding draft, subject to editorial and translation review before
production publication. Existing empty sections, institute anchors, sitemap
content and truthful unavailable states remain below the hero.

The 2026-10-09 search feature replaces only the search route's hero and scaffold with its
visible keyword form, result count and links. Its header stays in normal flow;
the route retains its canonical page ID. All other hero compositions remain.
Published CMS page/home bodies now render below the introductions alongside the
section scaffolds; selected news articles render within the all-news section.
Eligible content appears with empty/unavailable states
for missing content. Collections start empty. See [search behavior](search.md).

The 2026-10-09 [coherence review](site-coherence-review.md) retains these page
introductions and adopts shared action styling and selective Apex Leaf placement.

The owner explicitly requested 17 generated photographic placeholders to replace
all hero backgrounds across the then-22 hero pages. These illustrate research, renewable
energy, collaboration and knowledge sharing through fictional, generic scenes.
They remain decorative with empty alternatives and make no claim to depict real
IRESEN people, facilities or events. Copy, claims, routes, figures, layouts,
original SVGs and installed fonts are unchanged.

## Generated hero placeholders — 2026-10-09

The native generated sources are HD: 16 are 1536 × 1024, and the aerial image is
1672 × 941. They are not native 4K, and the replacement does not increase the
resolution of every earlier asset. Original PNGs are preserved in the generation
workspace outside Git and `public/`; served WebP derivatives use quality 90
without upscaling. Content-hashed filenames distinguish
this set from the superseded media and prevent stale image URLs.

Portrait mobile derivatives retain the full native height in a 2:3 crop. At
`40rem` and below, a native `picture` source serves that preoptimized WebP directly,
bypassing the Next image optimizer. The wider Next Image fallback uses quality 90
and sizes based on viewport width, aspect ratio × viewport height and a 75rem
growth guard. Only the current hero loads eagerly with high fetch priority.
Images remain same-origin, with no video or additional client runtime.

The schema-2 [hero-assets.json](hero-assets.json) records 16 full generation prompts
and an abbreviated aerial recipe, native dimensions, source/output SHA-256 hashes,
derivative bytes and mobile crops. The 17 landscape files total 4,429,414 bytes;
the 17 mobile crops total 2,001,688 bytes. The largest mobile crop is 216,272 bytes,
within the approximately 250KB per-hero budget. Actual delivery and rendered
checks belong in
[this revision's validation](validation.md#generated-hero-placeholders--2026-10-09).
Earlier checks and screenshots below describe their own media revision.

The initial 2026-10-08 set contained 17 individual Figma rasters with WebP
derivatives totaling 1,878,042 bytes. Its archive entries, hashes, transformations
and individual rights/credit limits are preserved in the superseded
[Figma asset manifest](hero-assets-figma-2026-10-08.json). Those source-review
limits describe the earlier imagery rather than the generated replacement.

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

The visible Explorer la suite text/arrow is replaced by a centered mouse outline
and scroll-wheel cue above the bottom band. It remains a native clickable anchor
to `#page-sections`, with the existing translated `Hero.continue` accessible name
and decorative icon hidden from assistive technology. The target is 44 × 44px
and the white outline 24 × 36px at default text size. CSS transform/opacity moves
the wheel for three 1.6-second introduction cycles; reduced motion disables it.
The lower image reserve is now 72px rather than 80–128px, bringing the CTA closer
to the band while allowing the hero to grow for content. This revision's checks
and renderings belong in [the validation log](validation.md).

## Owner refinements — 2026-10-08

The hero-body now uses the same centered container as the header, blue narrative
band, sections below and footer: a 120rem maximum with side gutters of
`clamp(1.25rem, 3.125vw, 4rem)`. This reduces the previous hero/body inset on wide
screens and gives the complete page consistent outer alignment. Individual copy
measures and the five layout variations still control text placement within it.

French/English hero H1s use −3% letter spacing (`-0.03em`) at every breakpoint;
Arabic retains natural tracking. Public Latin text uses self-hosted Plus Jakarta
Sans, including Découvrir and native controls; Arabic text uses the owner's
selected self-hosted Alexandria. Shared script selection covers mixed-language
labels and retains Jakarta for isolated numeric figures. See
[font provenance and loading](fonts.md). Earlier verification below predates
Alexandria and does not establish this revision's rendered coverage.

The header menu's text/arrow group centers in its full control width, and the
compact Menu control centers its contents. Selected languages use bold 700 alone
in the header and footer dropdown, retaining hover and keyboard-focus feedback.
See [shared design rules](design-system.md#hero-layout-and-typography-refinements--2026-10-08)
and [the validation log](validation.md) for current executed checks and renderings.

## Action and marker coherence — 2026-10-09

Discovery uses the shared physical 10px top-left/bottom-right action corners,
18px/600 text and a 12px arrow gap, replacing its earlier 20px radius and 24px
gap. The wide defaults remain a 56px minimum height and 24px inline padding;
at `35rem` and below, the existing 44px minimum and 16px inline padding remain.
Hero descriptions use weight 500 without enlarging the global body role. The shared button hover
rule keeps the styled anchor consistent with native actions.

Only the homepage hero eyebrow uses the original Apex Leaf as a decorative white
CSS mask, 10 × 16px at the default root size. Other hero eyebrows retain their
existing cyan marker. The original shape and Arabic placement are preserved
without mirroring. The Institute's Mission H2 is the only section heading with
the original decorative blue vector; no sections or content were added.

Certification remains a 20px surface, separate from action geometry. Copy,
figures, routes, images, font policy and the scroll cue are unchanged. Earlier
verification below describes earlier revisions; this change's final checks and
captures belong in [the validation log](validation.md#site-coherence-review--2026-10-09).

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

## Homepage certification badge — 2026-10-08

The owner explicitly requested **Certifié · ISO · 9001:2015 · Première agence de
moyens certifiée en Afrique** from the attached screenshots. This direct request
is the content source for the local homepage badge. It does not import other
historical hero copy, figures or routes. `Hero.certification` retains the French
wording and the English/Arabic draft translations:

| Locale | Label     | Description                                       |
| ------ | --------- | ------------------------------------------------- |
| FR     | Certifié  | Première agence de moyens certifiée en Afrique.   |
| EN     | Certified | Africa’s first certified research funding agency. |
| AR     | معتمد     | أول وكالة لتمويل الأبحاث معتمدة في أفريقيا.       |

The home-only badge is a native, noninteractive `aside`, named with its localized
certified label and ISO 9001:2015. The stable standard identifier uses an LTR `bdi`
and Plus Jakarta Sans; Arabic copy uses Alexandria with natural tracking.
The surface uses actual 16px backdrop blur at the default root size, including
the prefixed property, over `rgb(80 80 80 / 72%)`. Unsupported filters retain the
darker neutral `rgb(52 52 52 / 94%)` fallback. Its physical 20px top-left/bottom-right
corners stay rounded and the opposite corners sharp in RTL too.

From `70rem`, the homepage copy uses a two-column grid with an 11rem badge at
inline-end, bottom-aligned with the actions. Smaller screens place the badge
between description and actions in natural flow, with wrapping flex content and
a 24rem maximum width. The CTA stays near the band, all five existing figures
remain, and the hero can grow for content. Current checks belong in
[the validation log](validation.md); earlier hero checks and screenshots predate
this badge.

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
