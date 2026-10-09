# Page section placeholders

The owner's 2026-10-09 request commissions empty section scaffolds across the
existing website pages. The ordered map in
[src/lib/page-sections.ts](../src/lib/page-sections.ts) covers all 22 canonical
page IDs from [src/lib/site.ts](../src/lib/site.ts). It adds sections within those
pages; it does not change their names, locale paths or navigation hierarchy.

Each section contains a heading and a short content brief. French briefs start
with “À prévoir”; equivalent English and Arabic catalogs describe the same
unfinished content. These are editorial placeholders, not institutional facts,
approved final copy, populated catalogs or active service controls. The existing
search/contact unavailability notices and cookie status remain applicable. The
sitemap retains its working links.

## Sources and adaptation

The section sequences come from the P01–P16 tables and section 5, “Recherche et
pages utiles,” in
[the detailed website structure DOCX](references/strategy/iresen-structure-detaillee-site-web.docx).
The [strategy source index](references/strategy/README.md) records its provenance,
integrity and recommendation status. The present user request authorizes putting
the section headers and content briefs in place. Factual content, new services,
CMS fields and publication retain their separate scope.

- The existing heroes already introduce each principal page. The first
  introductory section of P01–P16 is therefore represented by the hero rather
  than repeated below it; subsequent sections preserve the source order.
- The Institute keeps its principal `about`, `mission` and `key-figures` anchors.
  “Les capacités mobilisées” and “L’ambition à l’horizon 2035” remain child
  sections within Mission, as the source specifies. “Pour approfondir” closes
  the page.
- The programme page keeps the current “Programmes R&D&I” identity and route.
  Its programme, call, participation and lifecycle scaffolds use P05 without
  adopting the proposed “Agence de Moyens” repositioning.
- The network and collaboration pages keep their canonical names and routes
  while using the relevant P08/P10 section suggestions.
- Search includes the proposed query, filtering, results and absence-of-results
  sections as briefs only. Absence of results is nested within Results and
  describes a future result state; its
  heading is not a report that a live query returned no result.
- The five existing utility pages use their source tables. The suggested sixth
  utility, Conditions d’utilisation, is not added. References to useful pages
  remain limited to canonical destinations.

## Ordered section map

The names below are the French catalog headings. Section IDs are stable English
anchors shared by FR/EN/AR; child headings use the same flat translation-key
layout within their page.

| Canonical page ID | Source                   | Ordered headings below the hero                                                                                                                                                                           |
| ----------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home`            | P01                      | Développer, éprouver, valoriser → IRESEN en chiffres → Priorités de recherche → Résultats et réalisations → Plateformes et expertise → Collaborer avec IRESEN → Actualités et rendez-vous                 |
| `institute`       | P02                      | Qui sommes-nous ? → Mission et positionnement (Les capacités mobilisées; L’ambition à l’horizon 2035) → Chiffres clés → Pour approfondir                                                                  |
| `governance`      | P03                      | Instances et responsabilités → Conseil et représentants → Direction et organisation → Les responsabilités des directions → Articulation scientifique et plateformes → Documents et contact institutionnel |
| `priorities`      | P04                      | Besoins et défis à traiter → Domaines et orientations → Feuilles de route technologiques → Des priorités aux projets → Connaissances pour éclairer les choix → Ressources et collaboration                |
| `programmes`      | P05, current positioning | Programmes et collaborations → Appels à projets → Participer à un appel → Du dépôt aux suites du projet → Résultats de la recherche soutenue → Questions pratiques                                        |
| `projects`        | P06                      | Réalisations à découvrir → Rechercher un projet → Catalogue des projets → Repères pour lire les résultats → Projets et capacités associées                                                                |
| `platforms`       | P07                      | Choisir selon son besoin → Le réseau de plateformes → Capacités et disponibilité → De l’essai à la démonstration → Accéder aux plateformes → Projets et ressources                                        |
| `network`         | P08                      | Domaines de compétence → Modes d’intervention → Le réseau scientifique → Compétences et formation → Expertises en action → Mobiliser une expertise                                                        |
| `transfer`        | P09                      | Les résultats à valoriser → De la recherche à l’utilisation → Les voies de transfert → Propriété intellectuelle et confidentialité → Résultats repris et initiatives → Construire un transfert            |
| `workWithUs`      | P10                      | Choisir un parcours → Les apports selon votre organisation → Modalités de collaboration → Du besoin au projet commun → Collaborations et références → Préparer le premier échange                         |
| `news`            | P11                      | À la une → Rechercher une actualité → Toutes les actualités → Rendez-vous et ressources associés → Suivre IRESEN                                                                                          |
| `events`          | P12                      | Prochains événements → Trouver un événement → Participer → Événements passés → Proposer une collaboration                                                                                                 |
| `publications`    | P13                      | Publications à découvrir → Rechercher une publication → Catalogue des publications → Rapports institutionnels → Utiliser et citer les ressources                                                          |
| `media`           | P14                      | Médias à découvrir → Rechercher un média → Collections et contenus → Ressources pour les médias → Crédits et réutilisation                                                                                |
| `opportunities`   | P15                      | Opportunités ouvertes → Rechercher une opportunité → Travailler à IRESEN → Candidater ou répondre → Archives et résultats publiables → Questions et candidature spontanée                                 |
| `contact`         | P16                      | Orienter votre demande → Envoyer une demande → Utilisation de vos informations → Nos implantations → Questions pratiques → Suivi de votre demande                                                         |
| `search`          | Section 5                | Saisir une recherche → Affiner les résultats → Résultats (Aucun résultat)                                                                                                                                 |
| `legal`           | Section 5                | Éditeur du site → Publication et hébergement → Droits et protection des données → Contact et version                                                                                                      |
| `privacy`         | Section 5                | Responsable et périmètre → Données et usages → Prestataires et transferts → Droits et contact → Sécurité et mise à jour                                                                                   |
| `cookies`         | Section 5                | Utilisation des cookies → Cookies et services utilisés → Gérer mes préférences → Conséquences et contact                                                                                                  |
| `accessibility`   | Section 5                | Engagement et objectif → Évaluation et périmètre → Limites et alternatives → Aide et signalement                                                                                                          |
| `sitemap`         | Section 5                | Les pages du site → Catalogues et ressources → Recherche et informations utiles                                                                                                                           |

## Implementation and checks

The shared renderer owns semantic heading levels, reading order and common
spacing. Content briefs live in `PageSections` in the locale catalogs rather than
inside presentation code. The ordered route map and three principal Institute
anchors remain authoritative; section anchors are available within each existing
page. Future content can replace the briefs without changing route IDs.

Apply [the mobile information hierarchy](mobile-information-hierarchy.md) when
composing those future modules: foreground essential orientation/task content,
then supporting details, and omit only optional decoration or redundant proof.
Use role/count ceilings with natural flow, preserving required facts, routes,
forms and feedback. Future mission cards await approved content and follow this
mobile guidance. No card content or layout replaces the current scaffold.

Executed application and rendered checks are recorded in
[the validation log](validation.md). The source-table extraction checks content
order and scope; it does not establish Word visual fidelity or institutional
approval of the future content.
