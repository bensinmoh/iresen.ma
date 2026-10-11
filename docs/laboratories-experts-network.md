# Laboratory and expert network — 2026-10-11

## Authorized scope

The owner requested development of the canonical `network` page, after completion
of the other chat's merge, with section 6 omitted. PR #96 completed and the checkout
was synchronized before implementation began. The five retained anchors are
`competence-domains`, `intervention-modes`, `scientific-network`, `skills-training`
and `expertise-in-action`. `request-expertise` is withdrawn from markup, section
navigation, localized catalogs and public search. Routes remain unchanged.

## References and adaptation

- Owner-linked Figma frame `804:7108` in `0go8QANZAH73ed9AoCdHkf` was inspected
  through live design context and its native screenshot. It is an Alumni sample,
  not a factual specification for this network page.
- The supplied laboratory screenshot, received 2026-10-11, names 14 laboratory
  specialities, their institutions and nine distinct cities. GEP has no city in
  that list. No city is inferred for that entry. This directory count is not a
  replacement for the institute's separately supplied +18 laboratory figure.
- The same screenshot provides Hamid EL OMARI's scientific contact for the
  power-electronics laboratory at Hassan First University, Settat. It is the
  only named contact adopted; no other people, LinkedIn profiles or email
  addresses are created. Arabic transcription is working editorial copy.
- The retained [benchmark](references/benchmark/README.md) informed the
  capability-first reading order, evidence restraint and compact directory.
  P08 in the [strategy reference](references/strategy/README.md) guided the five
  existing modules. Its instructions remain recommendations.

The implementation reuses the shared photographic hero, brand typography, blue
filter states, pale directory surfaces, signature corners, native SVG icons and
navy practice section. It adapts the Alumni directory's four-column composition
into laboratory records, with two columns on tablet and one on mobile. It does
not adopt sample Alumni figures, portraits, careers, success stories or
quotations. No new assets, routes, dependencies, CMS collection or service are
introduced. The original Morocco SVG remains a decorative silhouette, with
locations stated explicitly on cards; no unverified pins or coverage map are
asserted. Its existing localized media reference is reused.

The workshop image is an existing generated illustration, not evidence of a
particular laboratory or person. Its current provenance and media reference
remain authoritative. Skills copy explains research practice; it does not
announce an available course catalogue. The three final examples describe
specialities present in the supplied list, not measured interventions or impact.

## Directory and discovery

The structured reference lives in `src/lib/network.ts`, with localized titles,
institutions, cities and editorial copy in FR/EN/AR catalogs. The original French
lab/institution spelling remains discoverable in each language. Search supports
accent-insensitive Latin and normalized Arabic input. Submission filters the
list locally without URL or scroll changes; thematic buttons update immediately.
Combined query/topic selection, result counts, empty results and reset are real.
The full 14-card directory is server-rendered and readable without JavaScript.

Stable `laboratory-*` anchors, five section projections and the page projection
are registered in public search in each locale. Each laboratory has its own
section result, including its institution, locality, real topic vocabulary and
French discovery aliases. No new public bitmap or document is served.
Withdrawn section 6 is absent from all three projections. The existing CMS access
and locale approval gates remain unchanged. EN/AR and other editorial prose are
working adaptations, pending final review. No deployment is authorized.

## Validation

See [the validation log](validation.md#laboratory-and-expert-network--2026-10-11)
for actual checks and rendered coverage. Existing local `tsconfig.json` changes
are excluded from this task's commit. The separate development server is retained.
