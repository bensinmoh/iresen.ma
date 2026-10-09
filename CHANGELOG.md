# Change log

Record delivered changes and meaningful verification here. Detailed implementation,
content sources and test limits remain in the linked documentation. Remote CI and
merge results are recorded by the corresponding pull request and commit history.

## 2026-10-09 — Homepage hero video

- Enabled the uploaded original `/videos/hero.mp4` as the homepage's muted,
  looping, inline background video, without playback controls as requested.
- Kept the generated photo beneath it for loading, reduced motion, missing
  JavaScript and media failures; the other 21 pages retain their photo heroes.
- Verified real playback across FR/EN/AR desktop/mobile, an actual loop,
  byte-range delivery and live reduced-motion unloading. Local lint, strict
  types, 8 unit tests, production build and all 55 browser cases passed after
  integrating the current page-section placeholders.

See [hero behavior and limits](docs/heroes.md#homepage-hero-video--2026-10-09)
and [revision-specific evidence](docs/validation.md#homepage-hero-video--2026-10-09).

## 2026-10-09 — Section placeholders on all pages

- Added section headings and short FR/EN/AR draft content notes below the
  existing heroes on all 22 canonical pages, using the received section
  recommendations within the current route map.
- Centralized section IDs/order, nested Institute's capacities and 2035 ambition
  under Mission, and preserved supported fragments during language switching.
- Kept long sitemap group headings within their columns and allowed compact
  header actions to wrap when tablet text is enlarged.
- Retained the selective Mission Apex Leaf, working 22-page sitemap directory,
  empty CMS collections and truthful unavailable services. Institutional copy,
  translations and populated content modules remain editorial follow-up work.

See [section coverage and source adaptation](docs/page-sections.md) and
[revision-specific validation](docs/validation.md).

## 2026-10-09 — Desktop submenu destination states

- Matched the owner's submenu hover reference with a full sharp navy rectangle,
  white title, pale description and light blue diagonal arrow.
- Applied the same state to keyboard-visible focus while retaining its outline,
  using existing palette tokens and preserving panel geometry and localized content.
- Passed lint, strict types, 8 unit tests, production build and all 11 navigation
  browser tests; inspected desktop FR/EN/AR states and compact containment.

See [shared state rules](docs/design-system.md#desktop-submenu-destination-states--2026-10-09)
and [measured coverage](docs/validation.md#desktop-submenu-destination-states--2026-10-09).

## 2026-10-09 — Generated hero placeholders

- Replaced all 17 Figma-derived hero backgrounds across 22 pages with the owner's
  requested generated photographic placeholders, retaining the original media
  manifest as a superseded source record.
- Preserved native HD pixels without upscaling: 16 sources at 1536 × 1024 and
  the aerial at 1672 × 941. Added quality-90 WebP, content-hashed filenames,
  portrait mobile crops and cover-aware responsive sizing.
- Kept existing layouts, copy, claims, figures, routes, colors, fonts and original
  SVGs; generic generated scenes make no claim to show real IRESEN subjects.

See [media provenance and behavior](docs/heroes.md#generated-hero-placeholders--2026-10-09)
and [revision-specific validation](docs/validation.md#generated-hero-placeholders--2026-10-09)
for actual bytes, rendered coverage and checks. Earlier evidence retains its scope.

## 2026-10-09 — Site coherence review

- Unified action corners at physical 10px while retaining 20px surfaces; shared
  hero/Subscribe 18px/600 text and 12px icon gaps, with medium-weight hero intros.
- Aligned button hover states, header reading order, compact-menu/sitemap targets
  and error-page anatomy; made menu/Subscribe labels reflow at narrow enlarged text.
- Applied the original Apex Leaf only to the homepage hero eyebrow and Institute
  Mission heading, following the owner's selective-use clarification.
- Preserved approved colors, fonts, routes, copy and original assets. Verified
  132 page renders per revision before and after, 24 final shell cases and current Contact states;
  local lint, types, build, 8 unit tests and all 42 browser tests passed.

See [the findings and scope](docs/site-coherence-review.md),
[shared rules](docs/design-system.md#shared-actions--2026-10-09) and
[revision-specific validation](docs/validation.md#site-coherence-review--2026-10-09).

## 2026-10-08 — Header control proportions and contact label

- Reduced only the header search/contact diagonal corners to 10px, preserving
  their physical orientation and existing control sizes, padding, colors and type.
- Added the header-specific French CTA « Contactez-nous »; English/Arabic labels,
  page titles, footer/compact-menu labels and localized routes are preserved.
- Recorded this as an adaptation toward the re-shared reference, supported by
  live CTA geometry; earlier 20px verification remains historical.

See [current control rules](docs/design-system.md#header-search-and-contact-controls--2026-10-08)
and [validation](docs/validation.md) for revision-specific coverage.

## 2026-10-08 — Apex Leaf browser icon

- Selected the existing tightly bounded Apex Leaf for the public browser icon,
  replacing the padded favicon URL with SVG type and `sizes="any"` metadata.
- Preserved all seven original SVGs, their hashes, blue fill, proportions and
  transparency; no derived or additional icon assets were added.

See [active icon selection](docs/asset-inventory.md#active-browser-icon--2026-10-08)
and [validation](docs/validation.md) for this revision's coverage.

## 2026-10-08 — Footer identity copy

- Replaced the text beneath the footer logo with the owner's selected French
  tagline and description, with English/Arabic draft equivalents.
- Emphasized the tagline in native white bold at 18px/700, with an 8px gap and
  the existing 18px/500 description. Copy selection is limited to this footer block.

See [footer wording](docs/footer.md#footer-identity-copy--2026-10-08) and
[validation](docs/validation.md) for this revision's coverage; earlier identity
copy and verification remain historical.

## 2026-10-08 — Footer type and newsletter refinement

- Adapted footer typography toward the owner's reference with larger medium-weight
  navigation/contact text, a 30–50px newsletter heading and tighter Latin tracking.
- Reduced capped vertical gaps and broadened the signup track while retaining
  natural height, shared alignment, current content and physical brand corners.
- Replaced disabled newsletter controls and the initially visible notice with
  local editable email/consent and a native Subscribe disclosure for unavailable
  feedback. Privacy stays visible; no subscription API, persistence or success
  is introduced, and no client component or dependency is added.

See [footer behavior](docs/footer.md#footer-type-and-newsletter-refinement--2026-10-08)
and [validation](docs/validation.md) for this revision's coverage. Earlier
disabled-state checks and screenshots retain their original scope.

## 2026-10-08 — Apex Leaf heading reference

- Recorded the owner's preferred Apex Leaf bullet beside section headings for
  future composition in the shared design guidance. Runtime and assets are unchanged.
- Checked documentation formatting, the asset link and diff whitespace locally.

## 2026-10-08 — Header search and contact controls

- Matched the owner's control styling: white/gray-outlined search with a navy
  magnifier, blue/white contact and physical signature corners on both.
- Made search square at 48px, or 44px on narrow screens, and restored contact's
  48px minimum height and 24px horizontal padding at the default root size.
- Retained localized labels, routes, shared fonts and mobile contact access.

See [control rules](docs/design-system.md#header-search-and-contact-controls--2026-10-08)
and [validation](docs/validation.md) for this revision's coverage.

## 2026-10-08 — Homepage certification badge

- Added the owner's explicitly requested Certifié · ISO · 9001:2015 badge and
  French claim, with English/Arabic drafts, to the local homepage.
- Used a labelled, noninteractive aside with neutral translucent backdrop blur,
  a darker unsupported-filter fallback and the physical signature corners.
- Placed the badge beside the copy and CTA on wide screens and between copy
  and actions on smaller screens, retaining natural height and all five figures.
- Kept the stable standard LTR in Jakarta and Arabic copy in Alexandria;
  distinguished the supplied claim from independent certification verification.

See [badge content and behavior](docs/heroes.md#homepage-certification-badge--2026-10-08)
and [validation](docs/validation.md) for this revision's coverage. Earlier hero
verification and screenshots predate this addition.

## 2026-10-08 — Shared public fonts and Alexandria

- Added the owner's selected, licensed, self-hosted Alexandria for Arabic,
  alongside the unchanged Plus Jakarta Sans Latin asset.
- Unified public document defaults, Tailwind sans utilities, native controls and
  the decorative ResearchGate text mark under shared script-based font selection.
  Arabic labels use Alexandria across locales; Latin text and figures use Jakarta.
- Preserved Arabic shaping/tracking, local font loading and the separate CMS layout;
  recorded the new asset's provenance, hashes, Unicode range and OFL notice.

See [fonts](docs/fonts.md) and [validation](docs/validation.md) for this revision's
coverage. Earlier font checks describe their original assets and implementation.

## 2026-10-08 — Hero scroll cue and spacing

- Replaced the visible continuation text/arrow with a centered native mouse/
  scroll-wheel link, retaining the translated accessible name and 44px target.
- Added a short finite wheel animation with a reduced-motion static state.
- Reduced the lower image reserve to 72px at default text size, bringing the
  CTA closer to the band while retaining natural hero growth.

See [hero behavior](docs/heroes.md#viewport-and-navigation) and
[validation](docs/validation.md) for revision-specific checks and renderings.

## 2026-10-08 — Content-based menu formats and design guidance

- Corrected design guidance so screenshot references define typography, colors,
  tabs, surfaces, dividers, arrows and spacing; composition follows actual content.
- Used featured institute/research menus and compact expertise/resources menus,
  with optional features/figures. Research alone reuses the existing 69-project
  figure; natural height replaces the universal minimum and bottom-pushed figures.
- Retained the shared visual language, existing routes, localized drafts and
  native disclosure behavior; screenshot sample claims remain reference content.

See [current navigation formats](docs/navigation.md#hovered-menu-reference-adaptation--2026-10-08),
[the workflow](docs/design-workflow.md) and [validation](docs/validation.md) for
revision-specific checks and renderings.

## 2026-10-08 — Earlier reference interpretation (superseded)

The earlier reference review treated screenshots as a composition target, with
Taste/Impeccable guiding refinements. Its menu/figure review required no further
UI changes at that revision. The later design-element clarification above
supersedes that layout interpretation. See [the workflow](docs/design-workflow.md) and
[the validation record](docs/validation.md#reference-fidelity-review--2026-10-08).

## 2026-10-08 — Earlier uniform menu adaptation (superseded)

- Adapted desktop mega-menus to the owner's screenshot with a connected white
  active tab, three equal columns, full-height dividers, top introduction/bottom
  figure, stacked destination links and a vertically centered white feature block.
- Removed the extra intro eyebrow, colored rounded feature card and dense
  resources sub-grid; retained natural height and bounded scrolling.
- Reused the established 2011 year and owner-supplied 69 projects, +18 university
  laboratories and +1100 publications with existing localized labels and routes.

See [that revision's validation](docs/validation.md#hovered-menu-reference-adaptation--2026-10-08)
for executed checks and renderings.
Earlier navigation screenshots and verification describe their original revision;
its universal-layout assumption is superseded by the content-based formats above.

## 2026-10-08 — Homepage key figures and typography

- Replaced the homepage's founding-year/pathway band with the owner's explicitly
  requested figures: 69 supported collaborative projects, +60 patents filed,
  +1000 young researchers supported, +1100 scientific publications and +18
  university laboratories established. Kept other pages' pathway behavior.
- Corrected the supplied French label spelling and added drafted English/Arabic
  labels; used a semantic definition list with LTR-isolated numeric values.
- Applied shared value/label roles to the homepage and institute founding figure using
  the owner's Figma typography hints: Plus Jakarta Sans 600 values, 500 labels,
  zero tracking and a fluid 36–60px value with an 18px label at default text size.
- Kept values and labels stacked on mobile; isolated Arabic-page numerals use
  the Latin family while Arabic labels retain natural shaping and line height.
- Retained the source's 70% white label token for suitable dark surfaces and
  used 87% white on the current blue band to meet normal-text contrast.

See [shared figure rules](docs/design-system.md#shared-key-figure-typography--2026-10-08)
and [the validation log](docs/validation.md) for executed checks and renderings.
The user's message supplies the homepage claims; the Figma screenshots provide
the styling hints. See [the content record](docs/heroes.md#homepage-key-figures--2026-10-08).

## 2026-10-08 — Live design-system guidance

- Analyzed the owner's live DESIGN SYSTEM devlink: native typography/spacing/
  palette screenshots and measured grid, corner, component and state properties.
- Added [a scoped source review](docs/figma-design-system-review.md) and canonical
  coherence rules for shared typography, spacing, alignment, geometry and controls.
  Recorded caption conflicts and illustrated-state limits instead of treating
  them as new website tokens or functioning component APIs.
- Updated agent/skill routing and stale reference statements against the current
  shared 120rem grid, self-hosted Latin font and prior private-archive availability.
  Retained the original color book as the color authority.
- Passed focused documentation formatting, relative links/anchors, skill
  frontmatter, pinned source hashes and whitespace checks. Website/Figma behavior
  was unchanged. See [validation](docs/validation.md#live-design-system-guidance--2026-10-08).

## 2026-10-08 — Hero layout and typography refinements

- Aligned the header, hero-body, narrative band, following sections and footer on
  one 120rem container with fluid side gutters, reducing the former hero/body
  inset and removing the footer width exception.
- Set Latin hero H1 tracking to −3%, retaining natural Arabic letter spacing.
- Reduced selected-language styling to 700 weight alone in the header and footer
  dropdown; centered header menu text/arrow groups and the compact Menu contents.
- Installed self-hosted Plus Jakarta Sans Latin for French/English public text
  and controls through `next/font/local`, with its OFL notice and verified source
  record. Arabic's reviewed companion remains a follow-up input.

See [shared design rules](docs/design-system.md#hero-layout-and-typography-refinements--2026-10-08),
[fonts](docs/fonts.md) and [current validation](docs/validation.md) for executed
checks and rendered coverage. Earlier entries retain their own revision's results.

## 2026-10-08 — Institutional references and canonical structure

- Preserved all three supplied DOCX originals as repository references with source
  filenames, visible dates, byte sizes and SHA-256 hashes.
- Analyzed narrative, support architecture, proposed page sections and evidence
  requirements; recorded source-version uncertainty and pending editorial decisions.
- Marked the detailed structure as recommendations, not final validation. Chose
  the existing 22-page structure as the single working baseline and documented
  coordinated future route/navigation/footer/content/locale updates in ADR 0004.
- Updated product, brief, content-model, route, reference and backlog documentation.
  Verified source integrity, local links/anchors, formatting, route-map consistency
  and whitespace; application routes and CMS schemas are unchanged.

See [the reference analysis](docs/references/strategy/README.md),
[the structure decision](docs/adr/0004-canonical-working-site-structure.md) and
[validation](docs/validation.md#institutional-reference-documents--2026-10-08).

## 2026-10-08 — Introductory page heroes

- Added lightweight heroes to all 22 approved pages with five layouts, varied
  photographic backgrounds, short FR/EN/AR introductions and links to the sections
  below. Detailed content remains in those sections.
- Overlaid the existing header with a dark transparent gradient and the reversed
  logo, retaining white disclosure panels and accessible navigation.
- Added measured viewport/header sizing through the bottom narrative band;
  resize/orientation updates and natural content growth preserve enlarged text.
- Retained Développer · Éprouver · Valoriser and the verified founding year;
  omitted screenshot statistics and certification. Documented draft copy and
  individual Figma image provenance and publication-review limits.
- Passed lint, strict types, formatting, 8 unit tests, 4 integration tests,
  production build and all 35 browser tests; inspected desktop, mobile and Arabic
  renderings. See [page heroes](docs/heroes.md).

## 2026-10-08 — Navigation reference adaptation

- Reworked the header from the owner's closed-header and open-menu screenshots,
  using the approved hierarchy, wide desktop mega-menus and a compact grouped
  menu with separate language, search and contact access.
- Added a single-row layout from 110rem and two-row desktop layout from 70rem;
  the homepage uses a navy fallback while interior headers use white.
- Retained native disclosures and no-JavaScript destinations, adding keyboard,
  focus-aware dismissal and optional mouse-hover discovery. Arabic uses logical
  layout and equivalent localized routes.
- Added simple localized wayfinding drafts and related approved destinations
  instead of reproducing the reference's example event/funding promotion.
- Passed lint, strict types, formatting, 8 unit tests, 4 CMS integration tests,
  the production build and all 28 browser tests. Verified 21 responsive/text-size
  combinations, touch navigation, reduced motion and final rendered screenshots.

See [navigation implementation](docs/navigation.md) and
[current validation](docs/validation.md#navigation-reference-adaptation--2026-10-08).

## 2026-10-08 — Footer reference rework

- Reworked the footer using the previously analyzed native Figma frame and the
  owner-reattached Footer.png: broad identity/navigation layout, contact/social
  row and divided newsletter CTA, with responsive and Arabic adaptations.
- Kept the requested email, subscribe and consent controls visible until signup
  is configured; disabled controls, localized unavailable copy and a privacy link
  avoid implying a working subscription service.
- Retained approved brand assets, colors, contact/network destinations and page
  IDs; documented the footer width exception and distinguished prior screenshots
  and verification from this revision.
- Removed the locale-wide streamed loading boundary so destination content remains
  visible during footer navigation with JavaScript disabled.
- Preserved localized HTTP 404 responses, including dotted unknown paths.
- Passed lint, strict types, formatting, 8 unit tests, 4 CMS integration tests,
  the production build, all 19 browser tests and 21 rendered responsive/text
  enlargement cases. Reviewed French desktop, Arabic mobile and English tablet.

See [footer implementation](docs/footer.md#reference-rework--2026-10-08) and
[current validation](docs/validation.md#footer-reference-rework--2026-10-08).

## 2026-10-08 — Native Figma design reference

- Retrieved and hash-verified the owner-uploaded 164,268,977-byte Git LFS source;
  preserved its pointer, original bytes and private working analysis.
- Decoded 20,689 nodes and documented 14 desktop pages, 13 full mobile pages,
  source colors/type/layout, component anatomy/states, media crops and prototype
  behavior with source IDs and sanitized machine-readable evidence.
- Recorded historical palette differences, design-board caption errors,
  inherited-interaction gaps and RTL/tablet/native-rendering limits. Owner-approved
  identity and content remain authoritative; runtime design tokens are unchanged.
- Verified full decode consumption, graph/asset references, source hashes,
  evidence consistency, documentation links, formatting and whitespace.

See [design language](docs/design-system.md#native-design-language-analysis--2026-10-08),
[source record](docs/asset-inventory.md#native-figma-source) and
[verification](docs/validation.md#native-figma-reference-analysis--2026-10-08).

## 2026-10-08 — Design workflow and UI refinement

- Added eight repository-local IRESEN design skills and optional pinned Taste and
  Impeccable payloads with licenses, source hashes and separate project overrides.
- Added PRODUCT.md and DESIGN.md, task routing and flexible workflow guidance;
  vendor payloads are excluded from application linting and formatting.
- Refined header language/menu controls and mobile grouping, footer typography,
  primary/secondary actions and utility separation. Shared type/control tokens and
  wrapping support Arabic RTL and 200% text enlargement.
- Recorded the owner's standing instruction to merge completed requested work
  after passing local/CI checks, update logs/docs and clean up completed task branches.
- Local validation passed lint, types, formatting, production build, 8 unit tests,
  4 CMS integration tests and 18 browser tests. All 21 extra FR/EN/AR responsive
  and text-enlargement cases passed; reduced motion and production visuals were checked.

See [workflow](docs/design-workflow.md), [design rules](docs/design-system.md),
[UI verification and screenshots](docs/footer.md#design-workflow-refinement) and
[validation log](docs/validation.md#design-workflow-and-ui-refinement).
