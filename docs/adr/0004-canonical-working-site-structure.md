# ADR 0004: One canonical working site structure

Date: 2026-10-08 · Status: Adopted working baseline

## Context

The owner supplied narrative, support and website-structure documents as
references, clarified that the structure is recommendations rather than final
validation, and requested one working structure to prevent mismatched links and
make later changes consistent.

## Decision

Choose the existing **22 stable page IDs** as the canonical working structure:
16 principal pages, search and five footer utilities. Retain Programmes R&D&I,
Réseau de laboratoires & d’experts, Travailler avec nous, the unified publications
and reports page, and the unified opportunities and careers page with their
current routes. The [route map](../route-map.md) records this baseline.

[src/lib/site.ts](../../src/lib/site.ts) is the implementation authority for
stable page IDs, FR/EN/AR paths, supported anchors and navigation/footer groups.
Use `pageHref` or the shared localized routing helpers when constructing internal
destinations; avoid independent path strings in page components.
[src/i18n/routing.ts](../../src/i18n/routing.ts) already derives its paths from
that definition. Related navigation destinations use typed page IDs in
[src/lib/navigation.ts](../../src/lib/navigation.ts); labels live in the three
UI catalogs. This decision documents the existing arrangement without changing
runtime routes.

The [DOCX analysis](../references/strategy/README.md) records alternative labels,
paths, utilities and sections as proposals only. They are not a second supported
route structure. The chosen baseline can evolve when a concrete change is
requested or validated; it does not finalize every suggested section or approve
public institutional copy.

## Applying a later structure change

Make the central page/path change and its affected consumers in one increment:

1. Preserve stable IDs when the conceptual page is unchanged; update all three
   locale paths, anchors and any affected navigation/footer membership centrally.
2. Update related destinations, FR/EN/AR labels, hero/content links, CMS page
   relationships, equivalent-language switching and SEO/search/sitemap consumers
   as applicable. Planned services remain planned until implemented.
3. Map previously published URLs to their real replacements and provide redirects
   where needed. Use one canonical record and detail URL for a resource linked
   from multiple catalogues, including calls linked from programmes/opportunities.
4. Update the route map, affected product/navigation/content documentation,
   backlog and changelog together; verify route uniqueness, link destinations,
   locale equivalence and affected browser paths with the relevant checks.

## Consequences

The reference documents can inform content and design without creating competing
live links. The route map is a readable record of the code definition, not a
separately maintained router. Reference originals remain unchanged; their
recommendations do not need to be rewritten whenever the application evolves.

## Collaboration page redevelopment — 2026-10-10

The owner's later request renames and redevelops the existing `workWithUs` page as
“Collaborer avec nous”. The six anchors and working FR/EN/AR content remain.
Need-based light entry panels, open contribution/format rows, a four-stage
sequence, existing reference photographs and an ink contact checklist adapt the
live Figma cooperation frame within the current shared rules. FR/EN canonical
paths change together; permanent redirects retain the former URLs. Shared
navigation, footer, SEO and search consume the updated central definition.
See [scope and reference decisions](../collaborate-page.md).

## News & events — 2026-10-10

The owner commissioned the combined news/events page and its thumbnail listing
with a shared hero. Existing news paths host the overview; former events paths
redirect to its events anchor. Navigation news links reach its news anchor;
“All news” reaches the localized child listing. Five selected LinkedIn notices,
three role-labelled events (Oman, COP31 in preparation, IRSEC’X 2027), vector
social links, shared physical two-rounded/two-sharp corners and localized search
references are included. FR/EN/AR copy remains working editorial text. No deployment
or publication-gate change is authorized. See [scope](../news-events.md).
