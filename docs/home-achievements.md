# Homepage achievements — 2026-10-10

The owner commissioned eight achievements on white using the attached four-column
photographic reference. This replaces the `results` scaffold; no achievement card
links to another page. The development request also activates the previously
agreed [six-section order](homepage-restructure.md): missions → achievements →
research → capabilities → collaboration → news. Section navigation follows that
order, preserving all existing section IDs and the hero’s `figures` anchor.
Alliances and future CMS case records remain deferred.

## Content and composition

Mode: Experience, within the existing homepage identity. The heading and short
introduction lead into an open photographic rail: four cards at desktop, two at
tablet and one with a neighboring glimpse on mobile. Category, name and short
contribution text sit below each image. Blue arrow controls scroll one card;
a quiet progress line follows native scrolling. The owner’s later request adds
automatic movement every six seconds, one card per step, reversing at each end.
There is no pause button, as explicitly requested. Hover/focus suspend automatic
movement, manual steps restart the interval, hidden tabs do not advance, and
reduced motion disables automatic movement. No decorative card hover or
fabricated destinations. All eight articles render on the server.
Keyboard users can focus/scroll the rail; native touch scrolling and direct
hash destinations reveal later cards. Controls appear after hydration. Arabic
mirrors navigation and preserves the French report cover. Reduced motion moves
immediately for manual navigation without arrow animation.

| Stable card anchor             | Owner-supplied achievement                       | Category             |
| ------------------------------ | ------------------------------------------------ | -------------------- |
| `achievement-village-solaire`  | Village Solaire, from Solar Decathlon Africa     | Infrastructure       |
| `achievement-ismart`           | 100% Moroccan electric-vehicle charger           | Startup              |
| `achievement-aquasolar`        | Mobile, modular solar desalination unit          | Demonstrator         |
| `achievement-worldptx`         | Global Power-to-X summit                         | Event                |
| `achievement-upilot-h2`        | First green hydrogen production pilot in Morocco | Pilot                |
| `achievement-propre-ma`        | University PV network for solar yield mapping    | R&D project          |
| `achievement-cartography`      | Renewable-resource mapping and zoning            | Decision support     |
| `achievement-hydrogen-roadmap` | Contribution to Morocco’s green hydrogen roadmap | Strategic directions |

French copy corrects the owner’s spelling while preserving the supplied claims.
English/Arabic are explicit working translations for review, consistent with
existing homepage modules; implementation does not establish final editorial
approval or independent verification of the “first”/“100%” claims. No quantities,
performance results, dates, partners or expanded institutional role were added.
The report image is a supplied cover, not a downloadable report.

## Supplied assets

[The asset manifest](achievement-assets.json) records source filenames, served
sizes and hashes. Eight supplied individual images become web-sized WebP copies
under `public/images/achievements/`, capped at 1200px width without enlargement.
Source files stay untouched outside the repository. The large reference screenshot
is used for composition only and is not served or imported. No SVG original changes.

The green hydrogen cover is used in a native CSS mockup with two horizontal
stacked reports and one standing copy. Its text and official cover identity remain
in the supplied pixels; no title, crest or report contents are generated. This is
an illustrative presentation, not a photograph of printed copies.

## Search and scope

The homepage, `results` section, eight child anchors and eight media files have
explicit FR/EN/AR references in the existing static catalog. Descriptions include
real subject terms and expansions for R&D, PtX, GHI and DNI; no broad concept
aliases were added. Responsive media share one result per original. The localized
catalog revision updates static synchronization, and the local index was rebuilt.
Private source paths, the reference screenshot and repository documents stay out
of search. Removal from the catalog withdraws static entries through the existing
synchronization lifecycle. No new CMS collection, route, OAuth, deployment, DNS or
visibility change is included.

Verification is recorded in [the validation log](validation.md#homepage-achievements--2026-10-10).

## Owner selection — 2026-10-23

The owner selects this order: outdoor PV testing platforms → Village Solaire →
WorldPtX Summit → AquaSolar → iSmart → Cartography → green hydrogen roadmap.
Village Solaire appears once, in position two, as explicitly confirmed. uPilot H₂
and PROPRE.MA leave the homepage rail and its section search projection; retained
source assets are untouched. All seven articles render in FR/EN/AR, and the progress
indicator now derives its initial share from the card count.

The new `achievement-outdoor-pv` card reuses the existing Green Energy Park testing
platform panorama at `/images/media-library/plateforme-essais-solaires-panorama.webp`
(2560 × 1440). Its existing provenance and media-library search reference remain
canonical; no duplicate image or media result is created. The localized card and
section descriptions adapt the existing Platforms content about outdoor testing,
without new performance figures. English and Arabic remain working translations.

Verification: targeted ESLint, Prettier and whitespace checks pass. Development
inspection confirms seven cards in the selected order, loaded images and no page
overflow at 1440px in French and 390px in Arabic/English; Arabic retains RTL.
The French rail controls were exercised. Local search API checks find the new
section and canonical reused media in FR/EN/AR. The existing browser test now
uses the selected count and per-card image paths. Production build, full tests,
CI and merge remain pending under the shared checkout hold.

## Roadmap mockup refinement — 2026-10-23

The owner replaces the standing/stacked three-copy mockup with two overlapping
brochures laid flat in perspective, following the supplied brochure reference.
A pastel green studio backdrop echoes the existing cover; paper edges, a subtle
binding crease and soft contact shadows give the two copies depth. The official
cover image remains byte-identical, readable and physically unmirrored in all
locales. Native CSS composes the mockup without another bitmap or media result.
Existing labels, alt text, search references and other achievement cards remain.

Verification: targeted ESLint, Prettier and whitespace checks pass; original
cover hash matches its asset manifest. Development review at French 1440px and
390px and Arabic 390px confirms both copies fit the image area, the cover loads,
no horizontal page overflow, and identical unmirrored cover transforms in RTL.
Production build/full tests/CI remain pending under the shared checkout hold.
