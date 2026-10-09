# Navigation reference adaptation

The later owner refinements align this header with the hero, following sections
and footer through the shared 120rem container and
`clamp(1.25rem, 3.125vw, 4rem)` gutters. Menu text/arrow groups center in their full
control width, the compact Menu centers its contents, selected languages use
700 weight alone, and public text uses self-hosted Plus Jakarta Sans for Latin
and Alexandria for Arabic. See [current shared rules](design-system.md#hero-layout-and-typography-refinements--2026-10-08)
and [the validation log](validation.md). The source observations, screenshots and
verification below describe the original navigation revision; the subsequent
hero overlay and content-based menu formats are documented below. The latest
owner clarification treats screenshots as design-element references, with layout
chosen for each group's actual content.

## Compact menu control — 2026-10-09

The owner's follow-up gives resting Menu/Search glass surfaces above `40rem`:
12px blur, white tint/outline and white text over the inverse hero header;
the normal header retains navy text over an 88% white surface. Expanded Search
is white/navy. Unsupported backdrop blur falls back to a readable navy surface
on inverse headers.

The selected Menu becomes a white/navy tab with a sharp bottom-right corner,
joined directly to the dropdown at its bottom edge. The dropdown has physical
20px top-left/bottom-right corners; an RTL bridge fills the curve beneath the tab.
It reveals downward over 220ms using clipping, translation and opacity, and
replays on native reopening. Reduced motion displays it immediately. The shared
10px control corners, 48px height, centered 16px/600 label and regular 24px icon
remain. The close icon, native disclosure, focus behavior and narrow mobile
sheet/entrance remain.
No labels, canonical destinations or public search projections change.
See [the shared rule](design-system.md#compact-menu-control--2026-10-09)
and [the follow-up checks](validation.md#glass-header-controls-and-joined-menu--2026-10-09).

## Mobile reference adaptation — 2026-10-09

The [owner's four mobile screenshots](../DESIGN.md#mobile-reference-adaptation--2026-10-09)
guide the `40rem`-and-below shell. `SiteHeader` and the narrow-screen CSS use a
single logo/hamburger row while closed. Opening the native menu fixes the header
across the viewport on white, showing the supplied colored logo and localized
Fermer control. Vertical route rows have fine horizontal dividers and blue group
chevrons; expanded groups retain their canonical destinations from `src/lib/site.ts`.
The screenshot's labels do not add financing/news/network branches or new routes.

The owner's later clarification specifies arrival from the right. The whole mobile
sheet enters from the physical right edge over 320ms using a CSS transform and
`cubic-bezier(0.2, 0.7, 0.2, 1)`, in all three locales. It works with the native
disclosure without JavaScript and opens directly with reduced motion. See
[motion verification](validation.md#mobile-menu-entrance--2026-10-09).

Search and the full-width contact action follow navigation. Legal access and
the existing three-language selector sit below them. The integrated public search
backend, native localized GET form and live suggestions remain; mobile search
expands in normal flow, with static, full-width suggestions so results enlarge
the scrollable menu. Content can grow for translation and enlarged text.

With JavaScript, the open menu makes main content, footer and skip link inert;
Tab/Shift+Tab cycle its visible controls, and Escape closes the active disclosure
and returns focus to its summary. Closing or leaving the mobile breakpoint
restores background access. Native menu/groups, links and search submission also
work without JavaScript. Wider layouts retain their existing menu formats.
Approved colors, original SVG geometry and Jakarta/Alexandria remain; Arabic uses
logical flow and directional chevrons. See
[this revision's validation](validation.md#mobile-reference-adaptation--2026-10-09)
for executed checks; the screenshots establish composition, not pixel fidelity.

## Header control refinement — 2026-10-08

The owner's latest screenshot gives the closed search trigger a white square with a `#858585`
outline and 24px navy magnifier: 48px square, or 44px at `35rem` and below at
the default root size. Contact keeps primary blue/white, a 48px minimum height
and 24px horizontal padding, with inherited 16px/600 text. Both now use physical
10px top-left/bottom-right corners and sharp opposite corners in RTL, an adaptation
toward the reference supported by live CTA evidence. The screenshot does not
establish an exact radius measurement. The French desktop CTA reads « Contactez-nous »
through `Header.contact`; “Contact us” and “اتصل بنا” retain their wording.
Page titles, footer/compact labels and routes remain; contact stays in the compact
menu below the desktop CTA's `70rem`
threshold. See [shared control rules](design-system.md#header-search-and-contact-controls--2026-10-08)
and [current validation](validation.md); earlier 20px control checks and screenshots
retain their original scope.

## Site coherence review — 2026-10-09

Search and contact now share `--radius-action: 0.625rem 0 0.625rem 0` with the
public action family, replacing the header-only radius token. The physical 10px
top-left/bottom-right corners retain their orientation in Arabic. The closed search trigger keeps
its 48px square, reducing to 44px at `35rem` and below; contact keeps its 48px
minimum height, 24px inline padding and inherited 16px/600 text. Contact inherits
the shared `.button` geometry and hover rule, which keeps action text free of an
added hover underline. On its current page it retains the selected 700 weight
without inheriting the underline used by ordinary current navigation links.

Header language hover surfaces also use `--radius-action`, matching search's
physical 10px top-left/bottom-right corners, with sharp opposites in RTL.
Current-language weight remains 700 with no permanent fill; quiet hover colors,
44px minimum language targets and visible keyboard focus remain.

The header DOM follows logo, desktop navigation, then language/search/contact
actions. CSS preserves the existing one-row layout from `110rem`, two-row desktop
layout from `70rem` and compact disclosure below it. Canonical routes, contact
copy, language selection and the content-based menu formats remain as documented
here.

Compact group labels now sit in shrinkable spans with `overflow-wrap: anywhere`,
while their plus/minus disclosure marks cannot shrink. Destination and utility
links use flex alignment with a `2.75rem` (44px) minimum target at the default
root size. These changes support translated and enlarged text alongside the
existing narrow-header wrapping, spacing and icon treatment.

See [the site coherence review](site-coherence-review.md) for the shared decisions
and [this revision's validation record](validation.md#site-coherence-review--2026-10-09)
for executed checks and rendered coverage. Earlier geometry observations and
verification retain their original scope; they do not establish results for this
revision.

## Expandable header search — 2026-10-09

The magnifier is now the summary of a native search disclosure. Fine mouse hover
opens it without autofocus; explicit keyboard/touch activation opens and focuses
the labelled input. Enter or activation of the icon with a filled query submits
native GET `q` to the existing canonical localized search route. An empty input
retains required-field validation. On the search page, the enhanced header restores
the current `q`. The integrated public search engine now returns ranked results
and live suggestions; see [search coverage and contribution rules](search.md).

The field has a programmatic label and localized placeholder: « Rechercher sur
le site… », “Search the website…” or “ابحث في الموقع…”. Its single-line text
scrolls naturally. The white/navy surface expands toward inline start, reversing
in RTL, with bounded width and fallback to the other direction when needed.
The 220ms width/opacity motion respects reduced motion; header geometry and the
closed 48px/44px icon remain.
Closing search resets its reveal so every subsequent opening animates, including
when the visitor leaves and returns without typing. The scoped native content
wrapper stays renderable, with all non-summary children explicitly hidden while
closed; keyboard focus and native submission keep the same behavior.

Focus keeps search open when the pointer leaves and prevents navigation hover
from replacing it. Passive search hover also preserves an already focused language
or navigation control. Escape closes and returns inside focus to the summary;
outside pointer/focus and leaving the disclosure close it. Native click
disclosure and GET submission remain without JavaScript. At `40rem` and below,
the later mobile adaptation places the field and suggestions in normal flow
inside the full-screen menu. Contact, menus, languages and
routes retain their roles. See [shared rules](design-system.md#expandable-header-search--2026-10-09)
and [revision-specific checks](validation.md); previous captures remain historical.

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

| Available width                           | Navigation layout                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| At least `110rem` (1760px)                | One row: identity, primary navigation and language/search/contact controls              |
| At least `70rem` (1120px), below `110rem` | Identity and controls above a full primary-navigation row                               |
| Above `40rem`, below `70rem`              | Compact header with a native Menu disclosure and nested navigation groups               |
| `40rem` and below                         | Logo/hamburger row; open white full-screen menu with grouped routes and bottom controls |

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

The original featured destinations in `src/lib/navigation.ts` were:

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

Above `40rem`, the compact menu uses expandable groups in a bounded panel below
the header. At `40rem` and below, the full-screen adaptation documented above
replaces that panel; the accessible Menu label accompanies the visual hamburger,
and language/search/contact controls appear inside the open menu.
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

The owner's latest clarification and four menu examples define design elements,
not one required layout: coherent type, connected white tabs/panels, thin dividers,
navy/blue colors, inline diagonal arrows and spacing. This supersedes the earlier
assumption that every group needed three columns, a bottom figure and a feature.
The chat attachments are `Screenshot 2026-10-08 at 21.26.37.png`,
`Screenshot 2026-10-08 at 21.26.42.png`,
`Screenshot 2026-10-08 at 21.26.45.png` and
`Screenshot 2026-10-08 at 21.26.50.png`. They illustrate optional compact/featured
formats and shared design elements; their sample claims and routes are not adopted.
The current formats follow each group's content:

| Group     | Format   | Destination arrangement                          | Optional content                |
| --------- | -------- | ------------------------------------------------ | ------------------------------- |
| Institute | Featured | Intro, two-item list and related destination     | Travailler avec nous; no figure |
| Research  | Featured | Intro, three-item list and related destination   | 69 projects; opportunities link |
| Expertise | Compact  | Intro beside two destinations in two tracks      | No extra feature or figure      |
| Resources | Compact  | Intro beside five destinations across two tracks | No extra feature or figure      |

Only research displays a menu figure, reusing 69 and the collaborative-project
label from the owner's existing homepage data and localized `Hero.figures`
drafts. Institute retains its existing collaboration feature; research retains
opportunities. Screenshot training totals, event/funding claims and proposed
routes are styling references, not new authorized content.

Panels use consistent padding and natural content height, with no universal
minimum height or figure pushed to the bottom. White active tabs connect to the
panel; current-route markers and meaningful RTL arrow
mirroring remain. The 22-page route definition, `Header` drafts, keyboard/focus
dismissal, mouse-hover discovery, touch and no-JavaScript navigation continue.

Executed checks and renderings belong in [the validation log](validation.md).
Earlier verification and screenshots retain their original revision's scope;
the previous universal-layout assumption is superseded by this clarification.

## Desktop submenu destination states — 2026-10-09

The owner's latest screenshot requests a full sharp rectangular navy block for
desktop destination hover, with a white title, pale description and light blue
arrow. `.mega-menu-links` applies the same colors on keyboard-visible focus,
preserving the existing outline. Shared tokens supply navy `#12345A`, white,
footer-muted `#B9C9DA` and Science Blue `#4698CA` respectively.

This supersedes the earlier quiet hover/focus surfaces for these destination
blocks. Resting current-route styling, padding, panel formats, localized copy,
all 22 routes and RTL behavior remain. Screenshot sample labels are styling
references, not replacement copy. See [shared state rules](design-system.md#desktop-submenu-destination-states--2026-10-09)
and [this revision's checks](validation.md#desktop-submenu-destination-states--2026-10-09);
earlier evidence retains its scope.
