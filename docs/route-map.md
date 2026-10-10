# Canonical working route map

These boundaries come from the development brief and describe the current approved route baseline implemented in `src/lib/site.ts`. Keep one stable page ID per conceptual page, with localized paths in code. Listing/detail templates may be added without creating new primary navigation branches. Implemented routes do not establish that their institutional content or services are ready for publication.

Chosen on 2026-10-08 following the owner's request for one consistent structure: use these **22 stable page IDs** as the working baseline. The central definition in [src/lib/site.ts](../src/lib/site.ts) supplies localized routing and internal links. Suggested alternative paths are not supported routes. See [ADR 0004](adr/0004-canonical-working-site-structure.md) for the decision and the procedure for updating all affected consumers together.

| Page          | French path                                 | Boundary                                             |
| ------------- | ------------------------------------------- | ---------------------------------------------------- |
| Home          | `/fr`                                       | Introductory hero; section placeholders              |
| Institute     | `/fr/institut`                              | Identity, mission and key figures in one page        |
| Governance    | `/fr/institut/gouvernance`                  | Separate page                                        |
| Priorities    | `/fr/recherche-innovation/priorites`        | Priorities and roadmaps                              |
| Programmes    | `/fr/recherche-innovation/programmes`       | Listing, then programme details                      |
| Projects      | `/fr/recherche-innovation/projets`          | Listing, then project details                        |
| Platforms     | `/fr/expertise-experimentation/plateformes` | Listing, then platform details                       |
| Network       | `/fr/expertise-experimentation/reseau`      | Laboratory/expert network                            |
| Transfer      | `/fr/valorisation-transfert`                | Onepager                                             |
| Collaboration | `/fr/collaborer-avec-nous`                  | Onepager                                             |
| News          | `/fr/ressources/actualites`                 | News/press release listing and articles              |
| Events        | `/fr/ressources/evenements`                 | Event listing and details                            |
| Publications  | `/fr/ressources/publications-rapports`      | Unified publication/report listing and details       |
| Media         | `/fr/ressources/mediatheque`                | Media listing and relevant views                     |
| Opportunities | `/fr/ressources/opportunites-carrieres`     | Careers, opportunities and calls with filters        |
| Search        | `/fr/recherche`                             | Results; noindex                                     |
| Contact       | `/fr/contact`                               | Onepager; unavailable until real delivery exists     |
| Legal         | `/fr/mentions-legales`                      | Footer utility                                       |
| Privacy       | `/fr/confidentialite`                       | Footer utility                                       |
| Cookies       | `/fr/preferences-cookies`                   | Footer utility; service depends on actual processing |
| Accessibility | `/fr/accessibilite`                         | Footer utility; records actual assessed status       |
| Sitemap       | `/fr/plan-du-site`                          | Human-readable footer utility                        |

Cookie preferences become required if the chosen processing needs them. Legal placeholder text must not claim compliance or invent registration numbers.

Search is now functional at its three equivalent paths, with query, filters,
sort and pagination in URL parameters. Published news/press-release detail pages
use the localized news path plus the approved slug, such as
`/fr/ressources/actualites/{slug}`. Missing/private/unapproved locale records
return 404. Published canonical CMS page text renders under `#published-content`;
its headings have shared `content-section-{topLevelChildIndex}` anchors. These
detail routes add no primary navigation branch. See [search](search.md).

Language selection is a control, not a content page. Governance stays separate from the institute onepager; press releases stay within news and calls within opportunities. Do not introduce alumni, training, newsletter or application portals from screenshot labels alone.

## Section placeholders — 2026-10-09

The owner's request puts empty sections in place on all 22 pages, with headings
and short localized draft content notes. `src/lib/page-sections.ts` supplies their
shared IDs and order; [the section guide](page-sections.md) records the source
adaptation. Existing heroes provide page introductions. Institute keeps `about`,
`mission` and `key-figures` as its principal anchors, with capacities and 2035
ambition nested under Mission. All section IDs are supported locale-switch anchors.
The sitemap preserves links to all 22 canonical pages. CMS content, final
institutional copy and functional service modules remain follow-up work.

## Structure recommendations received on 2026-10-08

The supplied structure document is a set of recommendations and suggestions, not a final validated structure, as the owner explicitly clarified. Its references to a “validated menu” do not approve its differences from this baseline. The [source analysis](references/strategy/README.md#differences-from-the-chosen-baseline) contains the proposal comparison, 23-page count and nine suggested detail types. Keep alternatives in that reference analysis; use only the working routes above for application links. Decisions still pending are tracked in the [backlog](backlog.md#structure-proposal-decisions-before-pagecms-changes).

## Innovation transition anchor — 2026-10-10

The homepage registers `innovation-value-chain` between `research-priorities` and `platforms-expertise`, in FR/EN/AR. Its action uses the existing `transfer` page ID. The six major navigation entries remain; no page route is added. See [scope](home-innovation.md).

## Contribution-domain anchors — 2026-10-10

The new narrative changes content orientation within the same 22 routes.
Homepage `mission-studies`, `mission-research`, `mission-skills` and
`mission-cooperation` link respectively to `network#intervention-modes`,
`programmes`, `network#skills-training` and `workWithUs`, through shared helpers.
`develop-test-transfer` remains the section-navigation URL. Former mission stage
anchors resolve within the R&I card and remain supported in locale switching.
See [scope](narrative-alignment.md).

## Collaboration and valorisation development

workWithUs and transfer now render dedicated six-section editorial pages; their canonical paths and all twelve section IDs remain unchanged. Contact actions use the existing partnerships topic. See [scope](collaboration-transfer-pages.md).

## Collaboration rename — 2026-10-10

The owner commissioned “Collaborer avec nous”. The stable `workWithUs` ID and six
anchors remain; FR/EN use `/fr/collaborer-avec-nous` and
`/en/collaborate-with-us`, with permanent redirects from their former paths.
Arabic retains `/ar/التعاون-معنا`. Shared helpers supply all current destinations.
See [scope](collaborate-page.md).

## News & events — 2026-10-10

The owner commissioned the combined news/events page and its thumbnail listing
with a shared hero. Existing news paths host the overview; former events paths
redirect to its events anchor. Navigation news links reach its news anchor;
“All news” reaches the localized child listing. Five selected LinkedIn notices,
three role-labelled events (Oman, COP31 in preparation, IRSEC’X 2027), vector
social links, shared physical two-rounded/two-sharp corners and localized search
references are included. FR/EN/AR copy remains working editorial text. No deployment
or publication-gate change is authorized. See [scope](news-events.md).
