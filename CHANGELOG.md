# Change log

Record delivered changes and meaningful verification here. Detailed implementation,
content sources and test limits remain in the linked documentation. Remote CI and
merge results are recorded by the corresponding pull request and commit history.

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
