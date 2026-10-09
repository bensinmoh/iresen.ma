# Site coherence review — 2026-10-09

The owner's request was to review the public site against the updated shared
guidelines after the live Figma design-system review and correct useful deviations.
The [current coherence rules](design-system.md#current-coherence-rules) govern
implementation; [live source measurements](figma-design-system-review.md) explain
intent and source inconsistencies. Approved brand assets, owner-selected fonts,
canonical routes and supplied copy retain precedence over sample Figma content.

## Scope and baseline

The baseline covered all 22 page IDs in FR/EN/AR at 1440 × 1000 and 390 × 844:
132 page renders. The shared-shell audit recorded 18 locale/width cases at 320,
390, 768, 1024, 1440 and 1920px, with 200% text observations at 320 and 1440px.
The review also included FR desktop/Arabic mobile contact sheets, footer crops
and six localized 404 captures at the two page-audit widths. These are baseline
observations, separate from the final verification of the changes below.

This remains a sparse public foundation: page introductions, navigation, footer,
Institute anchor sections and sitemap are implemented, while institutional page
bodies largely await approved content. Empty and unavailable states remain honest.
The review does not add editorial sections, claims, routes or services. CMS/admin
is outside this public-site visual pass.

## Implemented corrections

| Area                         | Correction                                                                                                                                                                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Action family                | Shared `--radius-action` gives buttons, search, contact, hero discovery and Subscribe physical 10px top-left/bottom-right corners. Error/404 actions inherit it. Selected surfaces retain 20px corners.                                                |
| Action typography and states | Hero discovery and Subscribe use the shared 18px/600 action role and default 12px icon gap; narrow Subscribe uses 8px. Hero descriptions use weight 500. Styled button links suppress hover underlines. The global body scale is unchanged.            |
| Header and compact menu      | DOM order is logo, navigation, actions, with existing wide/two-row placement preserved. Destination and utility links have 44px minimum targets. Shrinkable labels address narrow enlarged-text overflow.                                              |
| Newsletter                   | Subscribe labels shrink/wrap, with reduced narrow-screen padding/gap. Native local email/consent and unavailable feedback keep their existing behavior; the field retains its 20px surface corners.                                                    |
| Utility pages                | Error content shares page-heading/page-content anatomy. Sitemap direct links receive the existing localized navigation group heading, 44px rows and 4px list gaps.                                                                                     |
| Selective Apex Leaf          | Only the homepage hero eyebrow uses a decorative white 10 × 16px mask of the original SVG. Only the Institute's Mission H2 uses the original decorative blue vector, at 1em height with a 12px gap. Other hero eyebrows and headings remain unchanged. |

The action changes supersede earlier 4px generic-button and 20px hero/Subscribe
adaptations. The latest selective-marker clarification supersedes the earlier
future-only preference; it does not create a marker on every H2. Physical brand
corners and the Apex shape keep their orientation in Arabic. Original SVG bytes,
approved palette, Jakarta/Alexandria font policy, route IDs, copy and hero figures remain
unchanged. Source specimens guide action proportions without imposing exact
59px CTA height, source typography errors or historical palette values.

## Verification and limits

Local lint, strict types, build, 8 unit tests and all 42 Chromium browser tests
passed. The 132 page renders after the changes, 24 shared-shell cases, actual 404 states and
focused current-Contact checks passed. Selected captures and the limits of the
isolated error preview are in
[this revision's validation record](validation.md#site-coherence-review--2026-10-09).
Earlier checks and screenshots in the component guides retain their dated scope;
they do not prove this revision. Automated and sampled visual checks do not
establish complete WCAG conformance or native Figma page/prototype fidelity.

See [visual direction](../DESIGN.md#site-coherence-review--2026-10-09),
[action rules](design-system.md#shared-actions--2026-10-09),
[navigation](navigation.md), [footer](footer.md) and [heroes](heroes.md)
for the current component guidance.
