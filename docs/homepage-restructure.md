# Homepage restructuring brief — 2026-10-09

## Scoped mission wording — 2026-10-09

The owner subsequently requested the mission statement and supplied exact French,
English and Arabic wording. This bounded exception to the earlier deferral adds
that copy to the existing paragraph above the cards. The owner's final direction
explicitly defers statement design: no new container or composition is delivered.
The later five modules, navigation order and full restructuring remain deferred.
See [the mission guide](home-sections.md#mission-wording--2026-10-09).

## Source and authorized scope

The owner supplied `Pasted text.txt`, titled “IRESEN — Homepage : structure et
layout révisés / Adaptation de la maquette Figma — 9 octobre 2026”, and requested
analysis and necessary Markdown updates only. The uploaded UTF-8 source is 5,752
bytes; its SHA-256 is
`9538cdd443d01a75213b9f9697a928dd40228597f0fefb7cd27f86df10ae6a59`.
This document records that supplied direction without importing the attachment
as a public asset or treating its named examples as verified records.

This is the latest planning reference for homepage order and composition. It
supersedes the earlier P01 homepage sequence for future work, while other page
recommendations retain their existing status. The owner explicitly deferred
implementation until development of the section after the missions begins:
**“Nos réalisations emblématiques.”** Wait for that development request before
applying this restructuring. This documentation task does not commission mission
cards, section reordering, copy/translation changes, assets, CMS fields, search
index changes or Figma edits.

While this analysis was in progress, the separate homepage mission increment
was merged into `main`. The current body renders the three mission cards at
`develop-test-transfer`, followed by five placeholders: `research-priorities`,
`results`, `platforms-expertise`, `collaboration`, `news-events`. The `figures`
definition remains in the shared map, but its anchor now belongs to the real hero
figure band and its duplicate body scaffold is omitted. The desktop section
navigation follows the current body order; see [the delivered mission/navigation
guide](home-sections.md). Preserve that implementation in this documentation task.
The target below moves achievements before research and defines the later modules;
it does not claim that the restructuring has already been applied.

## Target sequence between the existing hero and footer

| Order | Section                                       | Composition retained from the supplied Figma direction                                          |
| ----- | --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 01    | Notre mission                                 | Centered mission statement and three large photographic cards                                   |
| 02    | Nos réalisations emblématiques                | Immersive photographic background, introduction at left and a 2 × 2 achievement grid at right   |
| 03    | Nos domaines de recherche                     | Lateral domain navigation, changing descriptive content and a panoramic photograph below        |
| 04    | Nos capacités scientifiques et technologiques | Platform/expertise introduction, two discovery links and horizontal photographic platform cards |
| 05    | Collaborer avec IRESEN                        | Four collaboration cards followed by a selective Alliances partner band                         |
| 06    | Actualités & événements                       | “À la une”: three news columns and one upcoming-event column                                    |

The narrative becomes mission → evidence → research → capabilities →
collaboration → current activity. Achievements immediately demonstrate the mission;
research domains and capabilities explain the work and means behind them.
The four collaboration paths replace a funding-led homepage entry.

The independent “IRESEN en chiffres” section disappears from the target body.
The existing five figures remain in the hero, without another figures module.
The Figma Financement composition becomes collaboration, and Alliances belongs
within it rather than becoming an additional section. Calls and funding remain
deeper-page content, with no dedicated homepage module.

## 01. Notre mission

Keep the small label **NOTRE MISSION**, the centered statement and three large
vertical photographic cards side by side on wide screens. Supplied French text:

> IRESEN relie la recherche aux besoins de la transition énergétique et du développement durable et mobilise, avec ses partenaires, les expertises et les capacités nécessaires pour développer, éprouver et valoriser des solutions innovantes pour y répondre.

| Card       | Short description supplied                         | Link role supplied          |
| ---------- | -------------------------------------------------- | --------------------------- |
| DÉVELOPPER | R&D collaborative, connaissances et solutions      | Recherche & Innovation      |
| ÉPROUVER   | Essais, expérimentation et démonstration           | Expertise & Expérimentation |
| VALORISER  | Maturation, transfert et utilisation des résultats | Valorisation & Transfert    |

Each card has a photograph, title, short description and link. Preserve this
French wording as supplied working copy; this task does not publish it or approve
new English/Arabic translations. Mission is recorded to make the full sequence
understandable. Keep the separately delivered mission cards, copy and destinations
unchanged; replacing their wording or composition is not requested now.

## 02. Nos réalisations emblématiques

Retain the immersive Figma composition: photographic background, heading and
short introduction describing IRESEN's contribution at left; four achievement
cards in a 2 × 2 grid at right. Each card has a category, name, short description
of the contribution and result, and a **Découvrir** link.

The source proposes Green Energy Park, AquaSolar, iSmart and a strategic
contribution to technological roadmaps. These are candidate references, pending
validation of IRESEN's role, results and public evidence. Confirm the precise
roadmap contribution and its reference before naming the fourth card; do not
invent a completed result or equate scientific input with policy authority.

This is the deferred development entry point. Once the owner starts that task,
inspect the then-current missions and homepage before choosing the bounded
implementation increment. The supplied list does not create project/platform
detail routes or authorize fabricated destinations.

## 03. Nos domaines de recherche

Place the heading and a short introduction above a two-column composition. The
left side lists **four to six** major scientific domains vertically. Selecting
a domain changes its description and principal technological axes on the right.
Keep a large horizontal panoramic photograph underneath and the link
**Explorer nos domaines de recherche**.

Remove Figma's project counters per sub-domain from the planned composition to
avoid a recurring synchronization burden. The domain taxonomy, descriptions and
axes still need content review; no scientific list is invented here. Future
interaction must work by keyboard and touch and expose meaningful content when
JavaScript is unavailable; visual navigation alone does not establish its
semantics or responsive behavior.

## 04. Nos capacités scientifiques et technologiques

Reuse the Figma Plateformes composition. The visible heading is
**Des capacités au service de l'innovation**, followed by a short introduction
to available platforms and expertise and two links: **Nos plateformes** and
**Notre réseau scientifique & expertise**.

Keep horizontal photographic cards for the four supplied candidates:

- Green Energy Park.
- Green & Smart Building Park.
- GreenH₂A.
- Green Energy Park Maroc–Côte d'Ivoire.

Each card needs a photograph, name, location, main uses and link to its own
record. Confirm current names, locations, operators, usable capabilities,
availability, media rights and reachable public detail destinations when building
the module. A named facility or Figma image is not proof of public access.
Green Energy Park can appear here and among achievements using the same canonical
record, with distinct capability and result summaries.

## 05. Collaborer avec IRESEN

Reuse the Figma Financement four-card grid beneath **Collaborer avec IRESEN**
and a short introduction explaining collaboration possibilities.

| Path                    | Short description supplied                               |
| ----------------------- | -------------------------------------------------------- |
| Développer un projet    | Recherche collaborative, programmes et projets conjoints |
| Tester une technologie  | Essais, qualification et démonstration                   |
| Mobiliser une expertise | Études, assistance technique et expertise scientifique   |
| Valoriser un résultat   | Maturation, transfert et partenariats industriels        |

Each card links to the matching path on the existing collaboration page. The
source calls it “Collaborer avec nous”; its implemented page ID remains
`workWithUs`, currently named “Travailler avec nous”. Distinct pathway anchors
will need implementation before cards can point to them.

Keep the Figma **Alliances** band at the bottom of this section, with a limited
selection of approved institutional and scientific partner logos. Verify names,
relationships and logo rights rather than copying the sample partner set. The
band does not add a standalone section or require an automatically advancing
logo carousel.

The source leaves calls and funding on “Agence de Moyens”. That is still a
proposed repositioning of the current `programmes` page, not an implemented
route or new approval to rename it. Keep canonical programme/call destinations
unless a later request explicitly adopts a coordinated route change.

## 06. Actualités & événements

Keep the Figma four-column editorial composition with the heading **À la une**:
three latest selected news items and the next relevant upcoming event. Each entry
has a category, title, date and link to its public detail record. Add
**Toutes les actualités** and **Tous les événements** links.

Populate this module automatically from existing site records, with no separate
homepage article/event text entry. Public eligibility and editorial selection
remain distinct: use published records with an approved active-locale version.
Order selected news by date; choose the next relevant eligible event using its
date/status and `Africa/Casablanca` for user-facing scheduling. The selection
mechanism and event schema are future details, not delivered fields.

If no upcoming event is eligible, use a fourth distinct eligible news item.
With fewer eligible items, show only available content and an honest reduced or
empty state; do not duplicate articles, expose drafts or borrow another locale's
text to fill four columns. The current CMS has news but no event collection;
the event projection and reachable detail template remain dependencies.

## Existing destinations and section continuity

Use [the canonical page IDs and localized helpers](../src/lib/site.ts) and
[the route map](route-map.md). Navigation groups are not standalone landing
pages. Preserve existing section IDs where their role survives; labels can
change without breaking an anchor.

| Target module               | Existing homepage anchor to retain later | Existing destination or unresolved link decision                                                                                                                                                                                                                          |
| --------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mission                     | `develop-test-transfer`                  | Current cards link to `programmes`, `platforms` and `transfer`, with `mission-develop`, `mission-test` and `mission-transfer` child anchors. Preserve these links; source group labels do not create Recherche & Innovation or Expertise & Expérimentation landing pages. |
| Achievements                | `results`                                | Use approved case records and working detail destinations; `projects` remains the existing project listing.                                                                                                                                                               |
| Research domains            | `research-priorities`                    | `priorities`, including its existing `domains-directions` and `technology-roadmaps` anchors.                                                                                                                                                                              |
| Capabilities                | `platforms-expertise`                    | `platforms` and `network`; platform-specific detail records are future work.                                                                                                                                                                                              |
| Collaboration and Alliances | `collaboration`                          | `workWithUs`; its current `choose-pathway` scaffold does not yet provide four individual pathway anchors.                                                                                                                                                                 |
| News and events             | `news-events`                            | `news` and `events`; published news details exist, event details remain future work.                                                                                                                                                                                      |

The standalone figures body scaffold has already been omitted by the separate
mission increment. Retain the real hero's `figures` anchor, language-switch
handling and public search reference; its stable destination needs no retirement
for this target. When reordering the later modules, update the desktop section
navigation to the same order without changing those existing destinations.

## Implementation dependencies for the later request

Keep the current brand, 120rem aligned grid, fonts and shared component rules.
The retained wide-screen compositions must adapt to mobile, long content and
Arabic RTL without fixed heights, clipped copy or inaccessible controls; apply
[the mobile hierarchy](mobile-information-hierarchy.md) and
[current coherence rules](design-system.md#current-coherence-rules).

Before populating a module, resolve only its actual dependencies: reviewed cases
and domain taxonomy, approved individual photographs and partner logos, useful
detail destinations, French copy review and English/Arabic translation review.
Do not treat generated hero illustrations as documentary photos of these named
facilities. Reuse canonical records rather than maintaining homepage duplicates.
The current CMS has Users, Pages, News and Media; project/platform/domain/partner
collections and event records remain future work, as do homepage selection controls.

When public sections change, update their stable anchors, localized search
descriptions/projections and publication-driven index lifecycle in the same
increment, following [adding public content](search.md#adding-public-content).
This repository planning document stays outside the public search index. Rendered
responsive/RTL and interaction checks belong to the later implementation; the
current [validation entry](validation.md#homepage-restructuring-documentation--2026-10-09)
covers documentation only.

## Later commissioned domains section — 2026-10-09

The owner's subsequent explicit request commissions domains **directly below
missions**, with **seven** themes and four axes per theme, source strategy and
new screenshots. It overrides the earlier four-to-six-domain recommendation and
this module's deferral only. The current sequence remains missions → domains →
achievements placeholder → capabilities placeholder → collaboration placeholder
→ news placeholder. Do not infer authorization to apply the full reordering or
to populate achievements. See [delivered domains](research-domains.md).

## Later bounded news instruction — 2026-10-09

The owner subsequently commissioned the [homepage news module](home-news.md)
with five LinkedIn sources and preparation for future Posts API synchronization.
It replaces the existing final `news-events` placeholder only. Three preceding
body placeholders and the full reordering remain deferred.

## Later bounded collaboration instruction — 2026-10-09

The owner subsequently commissioned [homepage collaboration](home-collaboration.md)
at its existing location on an institutional ink ground, serving research/thesis,
solution development, industry and decision/funding audiences. The four audience
pathways supersede this module’s earlier action-card recommendation. The owner
supplied +120 collaborators and requested the existing certification reminder.
Two body placeholders, Alliances and full homepage reordering remain deferred.
