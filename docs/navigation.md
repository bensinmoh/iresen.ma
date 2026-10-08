# Navigation reference adaptation

The later owner refinements align this header with the hero, following sections
and footer through the shared 120rem container and
`clamp(1.25rem, 3.125vw, 4rem)` gutters. Menu text/arrow groups center in their full
control width, the compact Menu centers its contents, selected languages use
700 weight alone, and public French/English text uses self-hosted Plus Jakarta
Sans. See [current shared rules](design-system.md#hero-layout-and-typography-refinements--2026-10-08)
and [the validation log](validation.md). The source observations, screenshots and
verification below describe the original navigation revision; the subsequent
hero overlay and latest hovered-menu reference adaptation are documented below.

## Sources and scope — 2026-10-08

The owner requested a modern, efficient navigation bar that stays close to the
Figma proposition, attaching `Screenshot 2026-10-08 at 12.54.54.png` (closed
desktop header) and `Screenshot 2026-10-08 at 12.55.35.png` (open institute
mega-menu). These chat attachments guide composition; their sample text and
destinations are not approved institutional copy or a change to the information
architecture. No instruction embedded in a source image defines the work.

The recovered native Figma navigation references include desktop `718:5472`
and mobile `1479:10344`. See the [measured design language](design-system.md#native-design-language-analysis--2026-10-08)
and [source evidence](references/figma/design-evidence.json). Native rendering
and effective prototype behavior remain unverified; the two owner attachments
provide the immediate visual reference for this increment.

The implementation adapts the reference's wide identity/navigation arrangement,
separate search and contact controls, white open-menu tab and three-part panel.
Approved routes and current colors take precedence over the screenshot labels,
historical palette and example promotional content.

## Composition and approved hierarchy

The strategy/structure DOCX files received on 2026-10-08 are separate editorial references. Their suggested labels and paths have not replaced this implemented hierarchy; the owner explicitly states that the structure is unvalidated. See [the proposal comparison](route-map.md#structure-recommendations-received-on-2026-10-08) and [source analysis](references/strategy/README.md) before future navigation work.

The original homepage header used the approved navy and delivered reversed SVG
before heroes were implemented. Interior pages used a white header and the
supplied colored SVG. The subsequent hero overlay is recorded below.
The reference's full solar-field
image is not served as an application asset; this navigation increment does not
enable the stored hero video.

The original header had its own 120rem maximum with fluid gutters, allowing the
complete approved hierarchy to breathe while the reading-content width was 80rem.
The later refinement promotes shared broad geometry across the page.
At the default 16px root size, its layout is:

| Available width                           | Navigation layout                                                          |
| ----------------------------------------- | -------------------------------------------------------------------------- |
| At least `110rem` (1760px)                | One row: identity, primary navigation and language/search/contact controls |
| At least `70rem` (1120px), below `110rem` | Identity and controls above a full primary-navigation row                  |
| Below `70rem`                             | Compact header with a native Menu disclosure and nested navigation groups  |

These thresholds use rem units and wrapping labels. The two-row desktop layout
preserves legibility for the longer approved French and translated labels.

Primary navigation retains Accueil, L’Institut, Recherche & Innovation,
Expertise & Expérimentation, Valorisation & Transfert, Travailler avec nous, and
Ressources & Actualités. Search, contact and equivalent-page language switching
remain distinct controls. Group destinations continue to come from
`src/lib/site.ts`; this increment adds no page, financing branch or duplicate
news/careers branch.

The original desktop group panels contained an introductory text column, destination links
with short descriptions, and a related destination. Fine dividers organize the
white panel. Links used a navy surface on hover/focus; the original related destination
used a quiet surface and the physical corner signature. The latest adaptation
below replaces that card treatment. Current-page
links expose `aria-current="page"`, while the containing navigation group has a
visible current-state underline.

Related destinations live in `src/lib/navigation.ts`:

| Open group                  | Related destination      |
| --------------------------- | ------------------------ |
| L’Institut                  | Travailler avec nous     |
| Recherche & Innovation      | Opportunités & Carrières |
| Expertise & Expérimentation | Travailler avec nous     |
| Ressources & Actualités     | Publications & rapports  |

The panel introductions and link descriptions are simple localized wayfinding
drafts in the complete FR/EN/AR `Header` UI catalogs. They describe what a visitor
can find on an existing route. They do not establish approved institutional
claims, programme commitments or publication-ready institutional translations.
The screenshot's example event, funding amount and call promotion are not
reproduced; the related-destination block requires no invented live campaign.

## Interaction and accessibility

Both desktop groups and the compact menu use native `details`/`summary`, with
ordinary links inside navigation landmarks. Click/touch and Enter/Space activate
disclosures; their links remain available without JavaScript. The desktop
disclosures share a native `name` so opening one closes its sibling panels.

JavaScript enhances dismissal on Escape, outside pointer/focus interaction,
destination selection and the desktop breakpoint change. Escape returns focus
to the disclosure’s summary when focus is inside it; a hover-opened panel also
closes when focus is elsewhere, without moving that outside focus. Layout changes
transfer focus to the corresponding visible navigation control. Arrow Down opens a desktop group and focuses its
first destination. A brief mouse-hover delay supports pointer discovery;
keyboard focus retains control of an open panel. Touch does not depend on hover.

The compact menu uses expandable groups in a bounded panel below the header.
At 360px and below, the Menu label remains accessible while the visual control
uses its icon, keeping language, search and menu controls on one row at normal text size.
Visible focus, minimum control targets,
bounded panel scrolling and existing reduced-motion rules support practical
navigation. Logical spacing, equivalent locale routes and meaningful arrow
mirroring support Arabic; logos and physical brand corners retain their geometry.
Arabic typography receives no Latin tracking or uppercase treatment.

## Original navigation verification — 2026-10-08

Lint, strict types, formatting, 8 unit tests, 4 local CMS integration tests, the
production build and all 28 Chromium browser tests passed. The 9 dedicated
navigation tests cover localized destinations/current states, open-panel axe,
keyboard activation and focus restoration, hover Escape, outside dismissal,
breakpoint focus transfer without stealing outside focus, and native no-JavaScript
navigation.

Open navigation fits FR/EN/AR at 320, 390, 768, 1024 and 1440px; 200% root text
was checked at 320 and 1440px in every language (21 combinations). French 1920px
also fits. Final screenshots were visually inspected for French at 1440/1920px,
Arabic at 320/390/1440px, English at 1440px, the French interior-page header, and
the French resources panel. A touch-enabled Chromium context navigated through
the compact menu to governance. Reduced motion lowers control transitions to
0.01ms. These checks do not establish broad cross-browser or screen-reader
conformance, native Figma rendering fidelity, or final institutional copy approval.

The retained review artifacts below are actual local production-build captures,
not supplied references or public application assets.

- [French desktop navigation](screenshots/navigation-fr-desktop.png)
- [French wide navigation](screenshots/navigation-fr-wide.png)
- [Arabic mobile navigation](screenshots/navigation-ar-mobile.png)

See [the validation log](validation.md#navigation-reference-adaptation--2026-10-08)
for the original check record. Remote CI and merge status belong to the current
pull request and commit history, rather than being inferred from local checks.

## Hero overlay — 2026-10-08

On all approved routes the header now overlays the introductory hero with the
reversed logo and a dark transparent gradient. The hero measures the actual
header height, including compact or two-row layouts. White mega-menu and compact
disclosure panels, current-route state and equivalent-language navigation retain
their established behavior. Routes without a rendered hero retain an in-flow
header so unknown/error content is not covered. See [page heroes](heroes.md).

## Hovered-menu reference adaptation — 2026-10-08

The owner's newly attached hovered-menu screenshot guides this revision's
composition. The white active tab connects to a white panel with three equal
columns and thin vertical dividers through their full height. Intro title and
description sit at the top, with a figure at the bottom. The middle destinations
stack in one column, including resources, with inline diagonal arrows and short
descriptions. The right related-destination block is plain white and vertically
centered, replacing the earlier colored rounded card. The extra intro eyebrow
is removed. Logical padding/separators support Arabic; links use the quiet action
surface with primary-blue text on hover/focus. The panel grows naturally and
scrolls within its viewport bound when content is long. Open groups hide their
closed-state underline to connect the white tab; closed route indicators remain.
Title arrows mirror diagonally in RTL; the related action keeps its horizontal
blue arrow.

| Group     | Existing figure and French label               | Related destination      |
| --------- | ---------------------------------------------- | ------------------------ |
| Institute | 2011 — Création d’IRESEN                       | Travailler avec nous     |
| Research  | 69 — Projets collaboratifs soutenus            | Opportunités & Carrières |
| Expertise | +18 — Laboratoires universitaires mis en place | Travailler avec nous     |
| Resources | +1100 — Publications scientifiques             | Publications & rapports  |

The three totals resolve from the existing owner-supplied `homeFigures` records;
their labels resolve from `Hero.figures` FR/EN/AR drafts. The year retains the
existing `Hero.founded` label. On white, the shared figure role uses navy values
and muted labels with 1.45 line height. No screenshot project count, event/funding amount or promotion
is adopted as a new fact. The existing 22-page structure, related destinations,
`Header` draft introductions/descriptions and native disclosure enhancements
continue, including hover discovery, keyboard focus/dismissal, touch and
no-JavaScript navigation.

Executed checks and final renderings belong in [the validation log](validation.md).
The earlier verification and screenshot links above describe the original panel.
