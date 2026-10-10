# Change log

## 2026-10-10 — Actualités & événements

Developed the combined news/events page and separate thumbnail listing with a shared hero. Generic news/events navigation targets their sections; legacy events paths redirect. Five selected LinkedIn sources, the Masarat podcast highlight, Oman participation, COP31 side events in preparation and IRSEC’X 2027 are included, along with five vector social links and localized search references. See [scope](docs/news-events.md). No deployment.

## 2026-10-10 — Médiathèque

Developed the canonical media page with twenty supplied photos (including the CEO), eight explicitly authorized public local-CMS videos, ten source PDF links and five official institutional links. Added localized search references, filtered photo viewing, source-derived video posters and responsive RTL composition. Private originals/uploads/credentials remain outside Git; no deployment. See [scope](docs/media-library.md).

The owner’s refinement adds an alternating photo mosaic with Samir first, a compact
horizontal rail of full-height video thumbnails opening a native player dialog, animated section links, a centered icon-operated viewer
and a shorter generated-photo hero without the missions band. Reduced motion is
respected; the generated still-life is identified as illustrative in search and
its provenance manifest.

Photos now meet 1920px width or 1080px height and fill their frames, with Samir’s face centered. The viewer is capped at 80% of viewport width and height and fills its image stage. Download uses a downward SVG arrow; the larger video play control appears on hover or keyboard focus.

## 2026-10-10 — Collaborer avec nous

- Redeveloped the existing collaboration page from the live Figma cooperation
  reference with varied light/ink composition and six preserved anchors.
- Renamed FR/EN titles and URLs through the central route map; old URLs redirect
  permanently while retaining query parameters and section fragments.
- Updated shared destinations and localized search references; retained existing
  content, image provenance, CMS gates and the contact email-draft journey.

See [scope](docs/collaborate-page.md) and
[verification](docs/validation.md#collaboration-page-redevelopment--2026-10-10).

## 2026-10-10 — Selected publications ingestion

- Imported 1,181 owner-selected bibliographic records into the staged structured
  database, with **T4 2026** as the reference period; excluded 202 other rows.
- Kept DOI, year, original title/authors, source theme/type, SJR quartile and
  dated Scopus citation counts. Removed administrative author IDs; preserved
  unknown values and the separate metric dates.
- Added a deterministic standard-library importer and source fingerprint.
  The private workbook, internal fields and source instructions are not imported.
  Future section rendering and public search registration remain uncommissioned.

See [scope](docs/publications.md) and [verification](docs/validation.md#publications-ingestion--2026-10-10).

## 2026-10-10 — Compact homepage innovation pathway

- Added the requested light five-stage innovation transition between research and platforms, with support/maturity continuity and a canonical transfer link.
- Retained hero figures; added explicit FR/EN/AR section/search references and responsive RTL presentation.
- Kept the pathway horizontal on tablet/mobile with native scrolling and automatic six-second progression like achievements, respecting interaction and reduced motion.

See [scope](docs/home-innovation.md) and [verification](docs/validation.md#homepage-innovation-pathway--2026-10-10).

Record delivered changes and meaningful verification here. Detailed implementation,
content sources and test limits remain in the linked documentation. Remote CI and
merge results are recorded by the corresponding pull request and commit history.

## 2026-10-09 — LinkedIn-ready homepage news

- Replaced the homepage news placeholder with five owner-selected LinkedIn links,
  source-derived short FR/EN/AR titles, owner-supplied month dates and the existing news route.
- Added responsive four/two/single-card scrolling with animated one-card arrows,
  keyboard access, Arabic RTL and reduced-motion support; removed the language label.
- Joined the news surface directly to the footer by removing homepage wrapper
  bottom padding.
- Added a tested Posts API projection boundary and localized section/search anchors.
  Live API synchronization remains dependent on authorized LinkedIn application access.

See [scope and sources](docs/home-news.md) and [validation](docs/validation.md#homepage-news--2026-10-09).

## 2026-10-09 — Refined glass surfaces

- Applied the owner's approved preview to existing Menu/Search controls and the
  homepage certification aside: shared 18px blur, translucent gradient, subtle
  14% outline and inset highlight, with a navy fallback.
- Added a clipped, finite one-second reflection on fine-pointer hover or keyboard
  focus. Open controls remain opaque white, mobile retains its borderless header,
  and reduced motion suppresses the reflection.
- Preserved copy, routes, search registration and existing disclosure behavior.

See [the shared material](docs/design-system.md#compact-menu-control--2026-10-09)
and [verification](docs/validation.md#refined-glass-surfaces--2026-10-09).

## 2026-10-09 — Glass header controls and joined menu

- Added the owner's requested glass treatment to resting Menu/Search controls
  over the hero, with readable fallback surfaces when blur is unavailable.
- Made the selected Menu a white/navy tab with a sharp bottom-right corner,
  joined to a dropdown with physical top-left/bottom-right signature corners.
  Arabic uses a white bridge beneath the tab at the shared edge.
- Added a replayable 220ms downward reveal, with direct reduced-motion display;
  retained the mobile full-screen sheet and existing search behavior.

See [the shared rule](docs/design-system.md#compact-menu-control--2026-10-09)
and [follow-up validation](docs/validation.md#glass-header-controls-and-joined-menu--2026-10-09).

## 2026-10-09 — Compact menu control coherence

- Aligned the compact Menu trigger with search: white/navy, neutral outline,
  shared diagonal action corners, 48px minimum height and centered label/icon.
- Replaced the fragmented hamburger with three regular lines; retained the
  borderless mobile header, close state, native disclosure and localized routes.
- Recorded the adopted control rule and [verification](docs/validation.md#compact-menu-control--2026-10-09).

## 2026-10-09 — Full photographic mission cards

- Restored the supplied Figma/video card treatment: full photographs, white text
  near the bottom, inline underlined destinations and the diagonal brand corners.
  Full photographic cards also replace the tablet image/body rows.
- Added a blue hover/focus tint and a slight 1.04 image zoom for fine-pointer
  hover and keyboard focus. Card geometry stays stable; reduced motion keeps the
  image still and applies the tint immediately.
- Preserved the native horizontal mobile collection, current images, drafted
  copy, routes and later image-review guidance. The private MOV is a visual
  reference; its sample wording does not change the mission content.

See [the reference record and current behavior](docs/home-sections.md).
Earlier captures and verification counts retain their revision-specific scope;
current checks belong in [validation](docs/validation.md).

## 2026-10-09 — Horizontal mission cards on mobile

- Changed the three homepage mission cards to a native horizontal scroll
  collection below 48rem, with a hidden scrollbar and a neighboring-card glimpse
  where space permits. Keyboard, touch and no-JavaScript access retain all three
  destinations; enlarged text can use the full available card width.
- Kept tablet image/body rows and the desktop three-column composition.
- Recorded the owner's image direction for a later review: each photo should
  illustrate its section, with technology breadth across the website. Current
  mission assets remain.

See [the current composition and image guidance](docs/home-sections.md).
Executed checks belong in [validation](docs/validation.md); earlier counts and
captures retain their revision-specific scope.

## 2026-10-09 — Deferred homepage restructuring documentation

- Analyzed the supplied revised homepage layout and recorded its six-section
  target, retained Figma compositions, French working copy and candidate references
  in [the homepage brief](docs/homepage-restructure.md).
- Updated the development/product/design entrypoints, scaffold documentation and
  backlog: achievements follow missions, figures remain in the hero, collaboration
  reuses Financement with integrated Alliances, and news/events reuse eligible records.
- Recorded canonical route/anchor limits, content/media/translation review and
  future event/search dependencies without implementing or publishing them.
- Preserved the owner's explicit hold: apply the restructuring only when development
  of “Nos réalisations emblématiques”, the section after missions, begins.
  Runtime, localized catalogs, assets, CMS, search and Figma are unchanged.

Documentation checks and their scope are recorded in
[validation](docs/validation.md#homepage-restructuring-documentation--2026-10-09).

## 2026-10-09 — Homepage missions and section navigation

- Added a homepage-only sticky submenu after the figures, with native section
  anchors, an active underline, keyboard focus and reduced-motion behavior.
  It hides below 64rem; enlarged labels use measured anchor clearance.
- Replaced the first homepage scaffold with the three Développer · Éprouver ·
  Valoriser cards, using responsive/RTL composition and canonical destinations.
- Generated three energy images covering storage, bioenergy, CSP, hydrogen,
  wind and smart grids; added optimized assets, provenance and localized search
  references. The real figures retain their stable anchor without a duplicate block.

See [the implementation and source decisions](docs/home-sections.md) and
[executed verification](docs/validation.md).

## 2026-10-09 — Contact location before FAQ

- Moved the location/map section before the FAQ. The contact flow now reads
  introduction, platforms, form, location/map, FAQ and footer, retaining the
  existing sections and anchors.

See [contact composition](docs/contact.md); current checks belong in [validation](docs/validation.md).

## 2026-10-09 — Contact headquarters photograph

- Replaced the contact introduction's cyan curves with the owner's headquarters
  photograph, preserving the exact original JPEG without generation or retouching.
- Used responsive optimized Next Image delivery and a CSS crop/readability overlay;
  the source's 11.4 MB size is separate from the page's delivered image bytes.
- Retired the curve's served file and search reference while keeping its provenance
  and original bytes in Git history. Earlier contact screenshots retain their scope.

See [photo provenance](docs/asset-inventory.md#contact-headquarters-photo--2026-10-09)
and [contact behavior](docs/contact.md); photo-specific checks belong in [validation](docs/validation.md).

## 2026-10-09 — Refined field focus

- Replaced the thick, separated editable-field focus frame with a compact 2px
  outline following the existing field edge and corners, informed by Carbon
  and Spectrum input states. Contact, search inputs/selects and newsletter email
  share the rule; buttons and selection controls retain their current indicators.
- Moved header search focus to its field surface, avoiding a second inner frame
  and preserving blue on white in inverse headers, Arabic RTL and mobile menus.
  Footer email retains cyan; forced colors use a real system-color outline.
- Passed formatting, lint, types, 97 unit cases, production build and 35 existing
  contact/header-search/footer browser cases. Reviewed FR/EN/AR at 1440, 768 and
  390px, pointer/keyboard focus, stable geometry, 200% text and forced colors;
  focused contact/newsletter axe scans found no violations.

See [shared styling](docs/design-system.md#refined-field-focus--2026-10-09) and
[rendered evidence](docs/validation.md#refined-field-focus--2026-10-09).

## 2026-10-09 — Centered Contact form eyebrow

- Centered the complete “Votre message” eyebrow above the form title, removing
  the inherited paragraph-width offset.
- Added the original decorative blue Apex Leaf at its logical inline start,
  with proportional dimensions and shared spacing in FR/EN/AR.
- Retained the existing contact anchors, localized search references and original
  brand SVG bytes. See [contact guidance](docs/contact.md) and
  [verification evidence](docs/validation.md#contact-form-eyebrow--2026-10-09).
- Registered the Contact photograph added separately to `main` in the public
  search catalog after CI exposed its missing reference; its bytes are retained.

## 2026-10-09 — Contact reference composition and location

- Replaced contact's photo hero/scaffold with the owner-selected Figma contact
  composition: white shared header, split introduction/headquarters, platform
  entries, pale form band, native FAQ and shared navy footer.
- Recovered the original decorative background byte-identically from the native
  Figma source. Reused established headquarters contacts and grounded platform
  descriptions in institutional sources; omitted unverified sample opening hours,
  response promises, departmental mailboxes and platform contact details.
- Added a local email-draft workflow with field validation, subject selection,
  explicit email-application handoff and direct fallback. It does not submit,
  store or deliver messages through the website.
- Added the requested full-width location section. Google Maps loads on request
  and can be removed; the exact supplied directions shortlink is retained, and
  the address-query embed's exact pin remains unverified.
  This records the initial presentation; the later direct-map refinement below
  supersedes its load/remove behavior.
- Preserved the 22-page route baseline and contact anchors; FR/EN/AR copy remains
  draft. Server-side delivery and production publication remain separate work.
- Registered current contact guidance, FAQ/platform/location anchors and the
  decorative background in multilingual public search, replacing retired scaffolds.
- Isolated integration-test indexing from automatic background polling to avoid
  a race between the parallel CMS and search suites; production behavior is unchanged.

See [contact sources and behavior](docs/contact.md), [asset provenance](docs/asset-inventory.md#contact-decorative-background--2026-10-09)
and [revision-specific check evidence](docs/validation.md).

## 2026-10-09 — Tablet homepage layout

- Omitted the homepage ISO badge below `70rem`, retaining its compact desktop
  placement instead of the wide tablet band between copy and actions.
- Kept all five homepage figures in one row at every width, using native
  horizontal scrolling when they do not fit.
- Added shared hidden-scrollbar styling for horizontal navigation, preserving
  touch/keyboard scrolling, visible focus, natural text growth and Arabic RTL.
- Updated the responsive browser checks and current design guidance. Reviewed
  tablet, mobile, desktop and 200% text in FR/EN/AR; see
  [validation](docs/validation.md#tablet-homepage-layout--2026-10-09).

## 2026-10-09 — Direct contact map

- Render the contact map directly in server HTML with native lazy loading,
  replacing click-to-reveal and hide controls. Preserve the translated frame
  title, exact directions link, address and full-width responsive geometry.
- Remove the lower explanatory strip, unused styles/copy and bottom padding;
  the map now meets the footer. Update the cookies-page service notice and
  search projection to reflect automatic Google Maps loading.
- Pass lint, strict types, formatting, 97 unit and 21 integration cases,
  production build and 30 contact/search/foundation browser cases. Google Maps
  responses are intercepted locally; live service behavior is not asserted.
  See [validation](docs/validation.md#direct-contact-map--2026-10-09).

## 2026-10-09 — Exact-first search relevance

- Added explicit relevance tiers: exact, linguistic/prefix, spelling and related
  topic matches. Numeric ranking cannot place an approximate match above an
  exact one; the visitor's explicit date sort remains available.
- Added conservative spelling suggestions derived from eligible public text,
  with explicit correction links in results and header suggestions. Original
  queries remain intact; nonliteral matches use the matched terms for excerpts
  and safe highlights.
- Added multilingual concept vocabulary for platforms/infrastructure,
  PV/solar photovoltaics, solar panels, employment/careers and
  tests/experimentation. These are curated discovery relationships, not
  general model-based semantic understanding or an external service.
- Improved public solar-media topic descriptions using the existing generated
  asset provenance, preserving their fictional illustrative status.
- Updated contributor instructions and local upgrade steps for the vocabulary
  index and required search references.
- Recorded the owner's reminder to review the FR/EN/AR glossary, translations,
  acronyms and related-term dictionary, then rebuild and verify search when the
  full website content is ready for its final sanity check.
- Verified migration/rebuild, unchanged CMS artifacts, formatting/lint/types,
  92 unit and 21 integration tests, production build and all 108 browser cases.
  Coverage includes accepting mobile corrections, restoring background focus,
  and keeping search usable when resizing to the wider header. See [validation](docs/validation.md#search-relevance-and-final-content-reminder--2026-10-09)
  for browser and visual coverage; current PR CI validates the complete suite.

## 2026-10-09 — Mobile menu entrance

- Added the owner's requested entrance from the physical right edge, including
  Arabic, with a 320ms CSS transform on the mobile full-screen sheet.
- Preserved native no-JavaScript opening and repeat opening; reduced motion
  reveals the menu directly. Keyboard focus, Escape and background restoration
  remain usable during the entrance.
- Passed lint, types, formatting, 44 unit cases, production build and all 12
  navigation browser cases. Reviewed normal/reduced-motion FR/AR, native opening,
  repeat opening and intermediate screenshots.

See [navigation rules](docs/navigation.md#mobile-reference-adaptation--2026-10-09)
and [motion verification](docs/validation.md#mobile-menu-entrance--2026-10-09).

## 2026-10-09 — Mobile reference adaptation

- Adapted the narrow homepage, header and footer to the owner's four mobile
  screenshots while preserving approved content, routes, SVGs and brand colors.
- Added a single logo/hamburger row and white full-screen grouped navigation,
  with search/contact/legal/language access and keyboard focus containment.
- Kept homepage copy low in a viewport-minimum image scene, with two full-width
  actions and the five facts beneath it. Opening navigation preserves hero size.
- Stacked footer navigation/contacts and separated the newsletter email/action.
- Passed lint, types, formatting, 44 unit and 12 integration cases, build and
  96 browser cases; after the final hero-measurement correction, rebuilt and
  passed all 27 navigation/hero cases. Reviewed mobile, RTL, enlarged-text and
  desktop screenshots.

See [shared rules](docs/design-system.md#mobile-reference-adaptation--2026-10-09)
and [verification](docs/validation.md#mobile-reference-adaptation--2026-10-09).

## 2026-10-09 — Public multilingual website search

- Replaced the unavailable search page with ranked PostgreSQL full-text/trigram
  results for public pages, anchored sections, approved CMS articles and
  documents/media. Active-locale publication and current-source checks keep
  private, withdrawn, deleted and stale records out of results.
- Added the requested header input reveal, live public suggestions, keyboard and
  touch access, native GET submission and reduced-motion behavior. Results have
  excerpts/highlights, type filters, date sorting and URL pagination/history.
- Added a durable indexing queue, rebuild/worker commands, approved uploaded PDF
  extraction and localized media `searchText` for transcripts/non-extractable files.
  Registered existing public assets once per original, with derivatives grouped.
- Added readable published CMS page bodies and guarded news article destinations.
  Search results remain non-indexable even when public site indexing is enabled.
- Updated `AGENTS.md`, `instruction.md` and `CONTRIBUTING.md` to require search
  references for every future public page, section, document, file and media item.
  [The search guide](docs/search.md) records metadata, lifecycle and operations.

## 2026-10-09 — Current snapshot delivery scope

- Recorded the owner's authorization to push the current snapshot while real
  Green Energy Park and IRESEN office photos remain pending.
- Recorded the earlier snapshot's separate search development and unavailable
  search page. The later public-search implementation above supersedes that state.

See [current product scope](PRODUCT.md) and [pending media](docs/contextual-hero-media.md#documentary-photos-pending).

## 2026-10-09 — Repeatable header search reveal

- Reset the finished CSS reveal when the search disclosure closes, so returning
  to an empty field replays its 220ms expansion. Native opening, keyboard/touch,
  Arabic RTL and reduced-motion behavior retain the existing geometry.
- Added repeated-hover checks in FR/EN/AR and a native regression case that
  reproduces the retained animation before the correction.

See [interaction rules](docs/navigation.md#expandable-header-search--2026-10-09)
and [executed validation](docs/validation.md#repeatable-header-search-reveal--2026-10-09).

## 2026-10-09 — Expandable header search

- Added a native expandable search field: fine-pointer hover reveals it without
  focus, explicit keyboard/touch activation focuses it, and GET `q` uses the
  existing localized search route.
- Bounded the animated white/navy field within the header container, preserving
  closed-control geometry, RTL, physical action corners and reduced-motion behavior.
- Retained native no-JavaScript disclosure/submission and the truthful unavailable
  search engine at that revision; the later public-search work adds results/backend.
- Passed all 72 browser cases, then rebuilt and passed the 10 focused search
  cases after a final native Arabic corner correction. Eleven rendered states
  confirm animation, containment, focus and matching action corners.

See [interaction rules](docs/navigation.md#expandable-header-search--2026-10-09)
and [revision-specific validation](docs/validation.md#expandable-header-search--2026-10-09).

## 2026-10-09 — Language hover geometry

- Matched header language hover corners to the search control's shared action
  radius: rounded top-left/bottom-right, sharp top-right/bottom-left in RTL too.
- Kept the quiet hover surface, bold current language and visible keyboard focus.
- Passed build/types, lint, formatting and three localized navigation cases;
  six rendered desktop/mobile states confirm matching corners and usable focus.

See [navigation rules](docs/navigation.md#site-coherence-review--2026-10-09)
and [current validation](docs/validation.md).

## 2026-10-09 — Centered homepage figures

- Centered each value and description inside its homepage grid/scroll track.
- Added natural FR/EN/AR line breaks so short descriptions also use two lines,
  while narrow layouts and enlarged text can still wrap without clipping.
- Retained all five facts, typography and native horizontal mobile scrolling.

See [figure rules](docs/design-system.md#shared-key-figure-typography--2026-10-08)
and [current validation](docs/validation.md).

## 2026-10-09 — Contextual imagery and full-scene heroes

- Replaced the governance, careers and collaboration illustrations with an
  executive meeting, young-adult onboarding and a two-person handshake.
  Generated scenes remain fictional, with native dimensions and provenance.
- Removed the five half-photo/half-navy compositions. All photos cover the
  complete hero; four text-placement modes and neutral readability overlays
  retain the shared content and navigation.
- Archived the initial generated inventory and removed its six unused served
  replacements. The current set retains 17 photos with native-height crops.
- Real Green Energy Park and IRESEN office photos remain pending source access:
  cloud network policy blocks the identified external downloads.
- Passed lint, strict types, formatting, production build and all 62 browser
  cases after the imagery change. Image-delivery coverage now includes all three
  new scenes and verifies full-width cover without duplicate downloads.

See [current media and pending inputs](docs/contextual-hero-media.md) and
[revision-specific evidence](docs/validation.md#contextual-hero-media--2026-10-09).

## 2026-10-09 — Mobile information hierarchy

- Defined essential, supporting and optional content tiers, with a role/count
  ceiling for mobile introductions rather than clipped text or fixed heights.
- Hid the homepage ISO badge and redundant scroll cue at `40rem` and below;
  stacked its two existing navigation actions at full width.
- Kept all five figures in a labelled, keyboard-focusable native horizontal
  strip, with logical RTL scrolling and natural label wrapping.
- Retained current content and section placeholders; future mission cards use
  normal vertical page flow provisionally, pending the direction clarification.
- Passed lint, strict types, 8 unit tests, 4 integration tests, production build
  and all 62 browser cases, including mobile boundaries, keyboard and Arabic
  no-JavaScript access, enlarged text and unchanged video behavior.

See [mobile rules](docs/mobile-information-hierarchy.md) and
[revision-specific evidence](docs/validation.md#mobile-information-hierarchy--2026-10-09).

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

## 2026-10-09 — Footer address and privacy links

- Made the localized footer address clickable with the existing phone/email
  link styling and the owner-supplied Google Maps destination shared with contact.
- Removed the duplicate privacy link beneath newsletter consent; retained the
  localized privacy destination beside legal notices and cookie preferences.
- Passed formatting, lint, types, 97 unit and 21 integration tests, production
  build and all 9 footer browser tests. Reviewed French desktop and Arabic mobile renderings;
  checked FR/EN/AR wrapping, keyboard focus, enlarged text and native navigation.
- Rebuilt the local index and verified the inherited contact-photo search
  reference in every locale; all 3 contact search browser cases passed.

See [footer behavior](docs/footer.md#address-and-privacy-links--2026-10-09)
and [verification](docs/validation.md#footer-address-and-privacy-links--2026-10-09).

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

## 2026-10-10 — Collaboration and valorisation pages

- Developed the existing two pages around their six canonical sections, with working FR/EN/AR copy aligned to the revised narrative.
- Added responsive editorial layouts, native IP disclosures, existing reference photographs and contact preparation checklists.
- Extended page/section search bodies without changing routes, CMS gates, assets or service commitments.

See [scope](docs/collaboration-transfer-pages.md) and [verification](docs/validation.md#collaboration-and-valorisation-pages--2026-10-10).

Owner follow-up for news/events: one pending secondary news slot and three
pending event cards are explicitly labelled and have no invented content,
dates or signup links. The highlight uses a blurred photo echo, and its five
secondary entries align with its height. Both views use the shared gradient
header and consistent SVG action-arrow spacing. See [scope](docs/news-events.md).

## 2026-10-10 — Horizontal scroll indicator reference

- Analyzed four owner-supplied recordings and recorded pill/fill-bar variants,
  numbering rules, inter-block centering, future native-scroll behavior and RTL.
- Kept implementation deferred and source recordings/frames outside the repository.

See [the specification](docs/horizontal-scroll-indicators.md).

## 2026-10-10 — Video-library scroll pills

- Applied the recorded horizontal-navigation effect to the video library with one
  borderless pill per video, equal inter-block spacing and native scroll tracking.
- Updated the effect requirements to retain per-element count at every width,
  including shared terminal offsets, and prohibit decorative pill borders.
- Preserved localized anchors, public video/search gates, keyboard/no-JavaScript
  access and reduced motion.
