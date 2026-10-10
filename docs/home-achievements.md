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
