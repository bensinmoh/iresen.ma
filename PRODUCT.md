# IRESEN product context

This is a concise working map of [the development brief](instruction.md), not new
institutional copy. The owner's current request defines the authorized increment;
the brief describes the broader project. Update this map when implemented scope or
approved product decisions change.

## Purpose and visitors

Build IRESEN's official French, English and Arabic institutional website. Help
visitors understand its role, discover research and experimental capabilities,
find resources and identify appropriate ways to collaborate. Give communications
staff a practical editorial interface.

Public institutional pages explain and guide; resource listings help visitors
find material; CMS/admin screens help editors complete tasks. Choose composition
and density for the particular surface, rather than treating every screen as a
marketing page.

## Current implementation

- Next.js, React, strict TypeScript, next-intl, Tailwind/CSS tokens, Payload CMS and
  PostgreSQL; exact versions live in [package.json](package.json).
- French is the default locale; `/fr`, `/en` and `/ar` have explicit URLs. Arabic
  uses RTL. Stable page IDs and equivalent localized paths are centralized in
  [src/lib/site.ts](src/lib/site.ts) and [src/i18n/routing.ts](src/i18n/routing.ts).
- The responsive header follows the owner's reattached navigation screenshots
  with desktop mega-menus, a compact grouped menu, search/contact controls and
  equivalent-page language access. It preserves the approved hierarchy. New localized descriptions are wayfinding
  drafts. Page introductions now place this header over their imagery with a dark
  transparent gradient; white panels retain the existing open-menu behavior.
  [Navigation documentation](docs/navigation.md) records sources and verification.
  The substantial trilingual navy footer follows the analyzed native Figma reference
  and owner-reattached Footer.png, retaining the requested newsletter CTA.
  Text beneath its logo uses owner-selected French copy for this footer block
  only; English/Arabic equivalents remain drafts, without broader slogan or page-copy approval.
  [Footer documentation](docs/footer.md) records content sources, owner corrections,
  verification and outstanding editorial limits.
- The owner's four 2026-10-09 mobile screenshots guide composition at `40rem`
  and below: logo/hamburger header, white full-screen navigation with search,
  contact, legal and all three locales; a homepage image scene with low copy and
  two full-width 48px actions before its figure row; and a single-column footer
  with stacked contacts and separate newsletter email/action rows. Canonical
  routes, approved identity/content and the integrated search backend remain.
  Sample screenshot wording and colors are not new approvals. See
  [the adaptation](docs/design-system.md#mobile-reference-adaptation--2026-10-09)
  and [its validation record](docs/validation.md#mobile-reference-adaptation--2026-10-09).
- The 21 non-search pages have introductory heroes with four text-placement
  modes: 20 use generated photos, while the homepage uses the owner's video with
  its generated photo as fallback. Short FR/EN/AR wayfinding drafts and the
  Développer · Éprouver · Valoriser reading framework remain.
  The homepage hero band now presents five owner-supplied figures: 69 collaborative
  projects supported, +60 patents filed, +1000 young researchers supported, +1100
  scientific publications and +18 university laboratories established. These
  replace its founding-year/pathway items; other pages retain their pathways,
  and institute retains the established 2011 founding year. French labels come
  from the owner's request with spelling corrected; EN/AR labels remain drafted
  translations. Figma screenshots supply typography hints, rather than approval
  of numeric claims. The header-to-band landing
  measures the current viewport and grows for content when necessary. See
  [hero documentation](docs/heroes.md).
- The generated photos replace the former Figma-source backgrounds with generic
  research, renewable-energy and collaboration scenes. They do not document real
  IRESEN facilities, people or events. Landscape and portrait crops support wide
  and mobile views; copy, claims, routes and fonts remain. Backgrounds now fill
  the scene with readable overlays. Former split pages use
  start-aligned copy; utility editorial pages retain their reading measure over a
  lighter neutral dark overlay. Three generated contextual images now illustrate
  governance, career onboarding and collaboration; all 17 active photo assets
  remain fictional. Real Green Energy Park and IRESEN office photos are pending
  source-download access and have not been imported. See
  [current media and readiness](docs/contextual-hero-media.md) and
  [the asset manifest](docs/hero-assets.json); earlier replacement checks retain
  their revision-specific scope.
- The 21 non-search canonical pages have section placeholders below their introducing
  heroes, using shared IDs/order and localized headings with short draft content
  notes in FR/EN/AR. Institute retains its three principal anchors and nests
  capacities and 2035 ambition under Mission; the sitemap retains its working
  directory of all 22 pages. See [the section guide](docs/page-sections.md).
  These placeholders do not populate institutional content or CMS collections;
  the full institutional homepage is still unfinished. Page/news/media collections start empty. Empty and error states exist. Public
  pages render their content without a locale-wide streamed loading boundary,
  so footer destinations remain readable when JavaScript is disabled.
- On 2026-10-09 the owner explicitly requested the original `/videos/hero.mp4`
  for the homepage, with no playback button. Normal-motion playback starts after
  hydration, muted, looping and inline. No-JavaScript, reduced-motion and failure
  states retain the generated photo; a live reduced-motion change unloads the
  video. The unchanged 9.32 MiB file is a requested budget exception, with
  byte-range delivery and future web derivatives still performance concerns.
  Continuous motion without a pause control does not establish WCAG 2.2.2
  conformance. See [current hero behavior](docs/heroes.md#homepage-hero-video--2026-10-09)
  and [source metadata and rights limits](docs/asset-inventory.md#hero-video).
- The 2026-10-09 mobile hierarchy at `40rem` and below hides the homepage's
  secondary ISO badge and redundant scroll cue, uses a 32px lower reserve at
  default text size, stacks its two existing navigation links at full width and
  keeps all five facts in a labelled native horizontal scroll row. Wider layouts
  and other pages remain. [The reusable rule](docs/mobile-information-hierarchy.md)
  preserves essential routes, forms, feedback and facts while limiting competing
  roles. Future mission cards await approved content and follow the mobile
  guidance. Section placeholders remain the
  delivered body content.
- Search now covers public pages/sections, published CMS pages/articles and
  registered or uploaded public documents/media in the active locale. Ranked
  results, normalized matching, live suggestions, URL filters/date sorting and
  pagination follow the [search guide](docs/search.md). The header expands its
  field on hover/focus and submits to the lean results page. Exact matches precede spelling corrections
  and related topics; explicit correction links preserve the visitor's query.
  The multilingual concept vocabulary includes platforms/infrastructure and
  PV/solar photovoltaics, without claiming general model-based semantic search.
  New public resources must supply search references and real discovery vocabulary
  in the same change. Contact retains its truthful
  unavailable state. The newsletter
  keeps local editable email/consent controls; Subscribe opens a native disclosure
  with the localized unavailable message, hidden initially. The privacy link stays
  accessible. No subscription is submitted or stored, and no success is reported;
  signup still has no provider or endpoint. See [footer behavior](docs/footer.md#footer-type-and-newsletter-refinement--2026-10-08).

The owner's 2026-10-09 instruction authorizes pushing this snapshot with the real
documentary photos still pending; those inputs no longer hold its delivery.

See [backlog](docs/backlog.md) for remaining work and [validation](docs/validation.md)
for previous checks; neither proves a later change was tested.

## Content and structure

Preserve the existing owner-approved page boundaries and central route map. Navigation covers
the institute, research and innovation, expertise and experimentation, transfer,
collaboration, resources/news, search and contact. Do not derive additional pages
or services from a screenshot.

The chosen working structure is the existing 22 stable page IDs in `src/lib/site.ts`;
use this single route definition for internal links. [ADR 0004](docs/adr/0004-canonical-working-site-structure.md)
records the decision and the coordinated update procedure for later changes.

The three newly supplied strategy DOCX files are authorized for repository
reference and analysis; see the [strategy reference index](docs/references/strategy/README.md).
Their detailed website structure and section suggestions remain recommendations,
with the owner's 2026-10-09 request authorizing their use for empty section
placeholders on the current pages. They do not replace the implemented navigation.
Final institutional copy, translations and the proposed slogan still require
editorial approval.

The reading framework is **Développer · Éprouver · Valoriser**. It connects needs,
research, experimentation and use, with feedback between stages; outcomes can
include knowledge, methods, skills and informed decisions as well as transferred
solutions. Six cross-cutting capacities support this reading: scientific and
technological expertise; collaborative R&D&I and programming; platforms and
experimentation; valorisation and transfer; human capabilities and expert
networks; partnerships, cooperation and resources. They guide editorial coverage
rather than define six additional menu entries or an organigram.

Remaining homepage modules, further factual claims and institutional translations
remain editorial inputs. The five requested homepage figures are recorded in
[the hero content guide](docs/heroes.md#homepage-key-figures--2026-10-08), sourced
from the owner's explicit message. Internal narratives and sample export content
are not publishable facts.
Do not invent figures, facilities, commitments, people, testimonials or results
to complete a composition. Draft translations must not be labelled approved.

UI catalogs and CMS translations have distinct roles. Public CMS reads enforce
access and disable translation fallback; an unfinished Arabic version must not
silently expose French text as published Arabic content.

## Delivery boundaries

Use the existing repository, shared components and pinned dependency versions.
Keep institutional assets, rights, private references and public application
assets distinct. Local reversible design work can proceed within the requested
scope; deployment, DNS and repository visibility follow existing authorization
rules. A design workflow does not authorize publication or a new product feature.

Read [DESIGN.md](DESIGN.md) for visual direction and
[the design workflow](docs/design-workflow.md) for task routing.
