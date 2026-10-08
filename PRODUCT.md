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
  equivalent-page language access. It preserves the approved hierarchy, using a
  navy homepage fallback and white interior header. New localized descriptions
  are wayfinding drafts; no sample event/funding promotion or hero was added.
  [Navigation documentation](docs/navigation.md) records sources and verification.
  The substantial trilingual navy footer follows the analyzed native Figma reference
  and owner-reattached Footer.png, retaining the requested newsletter CTA.
  [Footer documentation](docs/footer.md) records content sources, owner corrections,
  verification and outstanding editorial limits.
- The homepage is an honest empty shell, not a completed institutional homepage.
  Page/news/media collections start empty. Empty and error states exist. Public
  pages render their content without a locale-wide streamed loading boundary,
  so footer destinations remain readable when JavaScript is disabled.
- An owner-supplied video is stored for future hero use; the current pages do not
  render it. See [the asset inventory](docs/asset-inventory.md#hero-video) for source
  metadata, rights limits and the future derivative/poster requirements.
- Search and contact currently have truthful unavailable states. The newsletter
  form remains visible as requested, with disabled email/consent/subscribe
  controls, a localized unavailable notice and privacy link. Signup has no
  provider, subscription endpoint or data storage. No delivery or production
  service should be implied by a visual control alone.

See [backlog](docs/backlog.md) for remaining work and [validation](docs/validation.md)
for previous checks; neither proves a later change was tested.

## Content and structure

Preserve the approved page boundaries and central route map. Navigation covers
the institute, research and innovation, expertise and experimentation, transfer,
collaboration, resources/news, search and contact. Do not derive additional pages
or services from a screenshot.

The approved reading framework is **Développer · Éprouver · Valoriser**. Final
homepage modules, factual claims and institutional translations remain editorial
inputs. Internal narratives and sample export content are not publishable facts.
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
