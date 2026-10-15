# Useful links — consolidation, 2026-10-15

The owner replaces the separate Useful links page with the existing Media library
section `press-resources`. Its seven external resources share one registry in
`src/lib/useful-links.ts`: the four original mapping tools plus EVPLAN, PV Mapping
and SolarTwin, preserving the exact owner URLs and MASEN map coordinates.
The former five institutional links are replaced by this tool catalogue.

The stable routing ID `usefulLinks` remains a compatibility alias. Its FR/EN/AR
URLs permanently redirect to the Media library section. Footer and HTML sitemap
shortcuts point there directly; the XML sitemap omits the alias. Shared route
helpers resolve previous tool anchors to their canonical `link-<id>` destinations.
There is no separate page rendering or duplicate search result. Each tool has a
localized searchable title, description and canonical section anchor.

FR/EN/AR descriptions remain editorial working copy. EVPLAN’s indexed provider
page describes electric-vehicle charging planning; PV Mapping and SolarTwin
could not be inspected, so their descriptions simply identify the destination.
No provider content, logo, embed, runtime fetch or tracking service is imported.
External links retain noopener/noreferrer and shared Phosphor arrows.
No deployment, DNS or visibility change is authorized.

Validation is recorded in the delivery ledger below.

## Verification — 2026-10-15

- Final production build including TypeScript, lint and 170 unit tests pass.
- Six production browser journeys pass: old-URL redirects and seven exact external
  destinations in FR/EN/AR at 390/768/1440px, plus existing media/filter/dialog
  accessibility journeys at 320/768/1440px. Arabic redirect URLs are URI-encoded
  before writing the Location header. Desktop FR and mobile RTL captures inspected.
- The local search index was rebuilt: eight public CMS records, static catalogue
  synchronized. Old standalone-page/tool and former institution-link results are
  withdrawn; seven localized tool results point to reachable media anchors.
- No provider availability guarantee is inferred from link rendering; no deployment.
