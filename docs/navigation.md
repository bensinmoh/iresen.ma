# Navigation reference adaptation

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

The homepage header uses the approved navy and delivered reversed SVG as an
honest fallback while a homepage hero is still unimplemented. Interior pages use
a white header and the supplied colored SVG. The reference's full solar-field
image is not served as an application asset; this navigation increment does not
enable the stored hero video.

The header has its own 120rem maximum with fluid gutters, allowing the complete
approved hierarchy to breathe without changing the 80rem reading-content width.
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

Desktop group panels contain an introductory text column, destination links
with short descriptions, and a related destination. Fine dividers organize the
white panel. Links use a navy surface on hover/focus; the related destination
uses a quiet surface and the existing physical corner signature. Current-page
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

## Verification — 2026-10-08

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
for the current check record. Remote CI and merge status belong to the current
pull request and commit history, rather than being inferred from local checks.
