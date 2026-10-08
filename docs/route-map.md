# Canonical working route map

These boundaries come from the development brief and describe the current approved route baseline implemented in `src/lib/site.ts`. Keep one stable page ID per conceptual page, with localized paths in code. Listing/detail templates may be added without creating new primary navigation branches. Implemented routes do not establish that their institutional content or services are ready for publication.

Chosen on 2026-10-08 following the owner's request for one consistent structure: use these **22 stable page IDs** as the working baseline. The central definition in [src/lib/site.ts](../src/lib/site.ts) supplies localized routing and internal links. Suggested alternative paths are not supported routes. See [ADR 0004](adr/0004-canonical-working-site-structure.md) for the decision and the procedure for updating all affected consumers together.

| Page          | French path                                 | Boundary                                             |
| ------------- | ------------------------------------------- | ---------------------------------------------------- |
| Home          | `/fr`                                       | Introductory hero; content modules pending           |
| Institute     | `/fr/institut`                              | Identity, mission and key figures in one page        |
| Governance    | `/fr/institut/gouvernance`                  | Separate page                                        |
| Priorities    | `/fr/recherche-innovation/priorites`        | Priorities and roadmaps                              |
| Programmes    | `/fr/recherche-innovation/programmes`       | Listing, then programme details                      |
| Projects      | `/fr/recherche-innovation/projets`          | Listing, then project details                        |
| Platforms     | `/fr/expertise-experimentation/plateformes` | Listing, then platform details                       |
| Network       | `/fr/expertise-experimentation/reseau`      | Laboratory/expert network                            |
| Transfer      | `/fr/valorisation-transfert`                | Onepager                                             |
| Collaboration | `/fr/travailler-avec-nous`                  | Onepager                                             |
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

Language selection is a control, not a content page. Governance stays separate from the institute onepager; press releases stay within news and calls within opportunities. Do not introduce alumni, training, newsletter or application portals from screenshot labels alone.

## Structure recommendations received on 2026-10-08

The supplied structure document is a set of recommendations and suggestions, not a final validated structure, as the owner explicitly clarified. Its references to a “validated menu” do not approve its differences from this baseline. The [source analysis](references/strategy/README.md#differences-from-the-chosen-baseline) contains the proposal comparison, 23-page count and nine suggested detail types. Keep alternatives in that reference analysis; use only the working routes above for application links. Decisions still pending are tracked in the [backlog](backlog.md#structure-proposal-decisions-before-pagecms-changes).
