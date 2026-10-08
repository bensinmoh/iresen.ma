# IRESEN visual direction

Use this document for art direction and constructive critique. Use
[the design-system specification](docs/design-system.md) for shared implementation
rules and [PRODUCT.md](PRODUCT.md) for product/content truth. These are working
guidelines: explain useful departures and follow the owner's current instructions.

## Design read

IRESEN should feel scientifically credible and welcoming: confident typography,
precise alignment, generous but purposeful space, and authentic research imagery
when approved. Navy anchors the institution, blue directs attention, and selected
accents distinguish scientific and transfer content. Favor a readable narrative
and useful discovery paths over an internal organigram or repeated decorative cards.

Existing work is a branded foundation with a responsive header and navy footer.
The homepage's empty state is not an established homepage composition. New page
work can develop the visual language without replacing the identity or approved
information architecture. CMS/admin surfaces prioritize clear editing tasks.

The owner's latest clarification on 2026-10-08 makes the attached Figma screenshots
references for design elements: typography, colors, tabs, surfaces, dividers,
arrows and spacing. Keep this visual language coherent while choosing layouts
for the actual content. Figures and featured destinations are optional content
roles, not required columns. Taste and Impeccable support the craft within this
direction, including contrast, responsive content, interaction and Arabic RTL.
Reference sample claims remain distinct from requested factual content.

## Identity and surfaces

- The owner's selected primary blue is **#296BB4**; navy is **#12345A**. Science
  blue **#4698CA**, transition green **#50A684**, cyan **#77C5D5** and lime
  **#A9C47F** are selective accents. White and **#F4F7F8** support reading.
- Color-book ratios suggest hierarchy, not exact pixel quotas. Most compositions
  need the two core colors and one accent at most. Choose pairings by actual
  contrast, including focus, hover, imagery and translucent overlays.
- Preserve all supplied SVGs byte-for-byte, geometry and aspect ratios included.
  Use the inspected light/reversed variants; white and monochrome filenames both
  refer to white-filled marks. Never reconstruct the wordmark with live text.
- The active browser icon uses the supplied Apex Leaf's tight viewBox instead of
  the padded favicon canvas, preserving its blue fill, transparency and proportions;
  both originals remain in the [asset inventory](docs/asset-inventory.md#active-browser-icon--2026-10-08).
- Keep full-width section boundaries flat. Apply the physical top-left and
  bottom-right rounded signature selectively to cards, media and focused controls;
  Arabic does not automatically reverse these brand corners.
- The apex motif supports a few purposeful brand areas. Avoid dense decoration
  behind text, universal pills, generic gradients and effects without a visitor benefit.
- The owner's section-heading reference (for example, « Notre mission ») uses the
  standalone Apex Leaf as its bullet. Retain this preferred heading detail in
  future section work, using the supplied vector and proportional spacing.

## Typography, rhythm and media

The current token system uses a shared 120rem container maximum and side gutters
of `clamp(1.25rem, 3.125vw, 4rem)` across the header, hero, content sections and
footer. This gives the page one aligned, spacious grid; body-copy measure remains
constrained within it. Keep the 4/8px spacing rhythm.
Treat 12/8/4-column desktop/tablet/mobile grids as composition
starting points. Adapt to content; a headline should not become tiny to preserve
a desktop arrangement on mobile.

French and English use licensed, self-hosted Plus Jakarta Sans, including links
and buttons. The Latin normal variable asset supports weights 200–800; source and
OFL license records are in [the font guide](docs/fonts.md). Arabic uses the owner's
selected, licensed, self-hosted Alexandria. Script-based font selection also uses
Alexandria for Arabic language labels on Latin pages and Jakarta for Latin text
on Arabic pages. Document defaults, Tailwind sans utilities and native controls
share this public font policy; CMS/admin has its separate layout. Establish distinct
heading/body/metadata roles and comfortable measure. Hero H1 tracking is −3%
(`-0.03em`) for Latin; Arabic keeps natural shaping and letter spacing.

Compose with real translated labels and variable CMS content. Use image/text
contrasts, selected navy panels, editorial lists and coherent image crops where
they serve the story. Photography, figures and partner logos require reviewed
sources and rights. Complete page exports guide composition; they are never
production hero imagery or evidence of an IRESEN facility.

## Interaction and review

Use accessible native semantics and existing shared components. Show genuine
loading, empty, error and success states. Preserve equivalent locale navigation,
supported anchors, keyboard focus and no-JavaScript access where applicable.
Use logical CSS, isolate mixed-direction identifiers, and mirror only meaningful
directional icons. Keep motion subtle, useful and usable with reduced motion.

For visual changes, inspect relevant desktop/mobile and Arabic renderings, plus
tablet, long content and interaction states as needed. Batch findings, fix them,
then confirm. Record actual coverage and limitations; a source review is not a
rendered comparison and automation does not establish full WCAG conformance.

## References and decisions

[Asset inventory](docs/asset-inventory.md), [reference handling](docs/references/README.md),
[primary-blue decision](docs/adr/0003-owner-selected-primary-blue.md) and
[footer implementation](docs/footer.md) describe the available evidence.
The native Figma reference is now recovered and thoroughly analyzed; use
[its measured language](docs/design-system.md#native-design-language-analysis--2026-10-08)
and [source evidence](docs/references/figma/design-evidence.json) for page composition,
typography, selected corners, component anatomy and mobile adaptations. Fourteen
desktop and thirteen full mobile pages are verified structurally. Wide media,
display type, marked section labels, flat section bands and editorial rows form
the source's visual direction. Current approved colors and product/content truth
retain precedence over its historical palette and mockup content.

The brief's standalone export boards remain unavailable in the checkout; the
owner reattached Footer.png in chat for the footer rework. Jakarta Latin and
Alexandria Arabic font files are now installed separately with verified licenses
and provenance.
Native Figma rendering, dedicated RTL/tablet references and effective prototype
behavior remain unverified. Verify availability/freshness before claiming a direct
comparison. Existing footer screenshots are prior review artifacts, not supplied
references or proof of a new rendering.

Record adopted shared improvements here and in the design-system specification,
with the reason and verification. Keep proposals, experimental directions and
unfinished measurements clearly separate from implemented decisions.

## Adopted UI refinements — 2026-10-08

The earlier header refinement grouped language access and the menu across the
available mobile width, with a clear border between identity and controls.
Active language links used a quiet blue surface as well as an underline; the
menu had an identifiable control boundary. The later hero refinement below
supersedes that selected-language treatment. Search retained a 44px-high target.

The earlier footer refinement used distinct type roles: 16px body/desktop links,
14px group headings and utility/mobile links, and 13px copyright metadata at the
default root size. Section headings carried hierarchy while navigation links used
regular weight.
Contact was the primary engagement action; news and transfer were grouped beneath
it. A fine divider separated utility navigation. These roles consume shared tokens
and remain fluid with user text settings, logical layout and RTL.

Verified in the local production build across FR/EN/AR at 320, 390, 768, 1024 and
1440px, including open navigation. At 320 and 1440px, 200% root text enlargement
retains viewport containment in all three languages. Reduced motion, equivalent
locale navigation, keyboard focus and no-JavaScript access were checked. Existing
browser/axe checks passed; cross-browser and screen-reader coverage remain separate.

## Footer reference rework — 2026-10-08

The footer now follows the broad composition of native frame `1584:6681` and the
owner-reattached Footer.png: identity plus four navigation groups, a contact/social
row, a divider, prominent newsletter copy and signup controls, then compact utility
and language access. The rework initially introduced a footer-specific 120rem
maximum and fluid 3.125vw side gutters; the later hero refinement promotes that
geometry to the shared page grid. Initially, group labels were 14px and desktop
links 16px/600; the later footer type refinement below supersedes these roles.

The initial newsletter used disabled controls and a visible unavailable notice.
Approved colors, SVGs, routes, contact information and networks supersede
historical mockup content.
Mobile and Arabic reflow are adaptations; decoded source evidence does not
establish native rendered fidelity. Earlier verification is recorded in
[the footer log](docs/footer.md#reference-rework-verification--2026-10-08).

## Footer type and newsletter refinement — 2026-10-08

Our adaptation toward the owner's footer reference uses 18px/500 identity description and
navigation text,
16px/500 group labels and 20px contact text (500 labels, 600 values) at the default
root size. Narrow-screen navigation becomes 16px. The newsletter heading scales
from 30–50px at weight 500, with −3% Latin tracking and natural Arabic tracking.
Smaller capped vertical gaps and a broader signup column make these roles fit
the shared footer composition. Existing colors, assets, routes, contact and social
destinations remain; footer height follows content rather than the source frame's
height. Exact native footer text styles were unavailable.
The later owner-selected footer tagline uses white native bold at 18px/700 with
an 8px gap above the description; [its wording](docs/footer.md#footer-identity-copy--2026-10-08)
is scoped to this footer block, with English/Arabic drafts.

The newsletter keeps editable email/consent controls, with the unavailable message
hidden until Subscribe opens a native disclosure. The privacy link remains visible;
no subscription is submitted, stored or reported successful. See
[footer behavior](docs/footer.md#footer-type-and-newsletter-refinement--2026-10-08)
and [current validation](docs/validation.md).

## Navigation reference adaptation — 2026-10-08

The initial navigation followed the owner's two reattached header/menu screenshots: a
wide logo and navigation arrangement, separate search/contact controls, a white
open tab and a generous three-part mega-menu. The approved hierarchy replaces
the reference's historical labels. That panel used useful destination descriptions,
fine dividers, a navy link hover/focus surface and a quiet related-route block;
sample events and funding claims are not reproduced.

A 120rem maximum supports a single row from 110rem, a two-row
desktop layout from 70rem, and a compact disclosure menu below that. These rem
thresholds give long French/English/Arabic labels room to remain legible. The
homepage used navy with the supplied reversed logo before heroes were implemented;
interior pages used white and the colored logo. The hero implementation below
adds the overlay variant. No photograph or hero playback was added as part of
navigation work.

Native disclosures preserve click, keyboard, touch and no-JavaScript access.
Focus, current-route indicators, optional mouse-hover discovery, reduced motion
and logical Arabic layout support the shared interaction language. New localized
descriptions are wayfinding drafts, separate from approved institutional copy.
Verified in the local production build across FR/EN/AR at 320–1440px, including
open menus and 200% text at 320/1440px; the 1920px single row, touch navigation,
reduced motion and final screenshots were also checked. All 28 browser tests
passed, including hover Escape and breakpoint focus restoration.
[Navigation documentation](docs/navigation.md) records source limits and coverage.
The later hovered-menu adaptation below supersedes its panel geometry and
related-block treatment; these checks describe the initial revision.

## Introducing heroes — 2026-10-08

All approved pages now open with a restrained introduction: a display title, one
short sentence, a section anchor and one related destination. Five compositions
(start, end, center, split and editorial) vary the visual rhythm across page topics.
Seventeen individually extracted Figma images are illustrative backgrounds, not
evidence about pictured people or IRESEN facilities. Utility pages use quieter
navy overlays. Media provenance and remaining publication review are recorded in
[the hero guide](docs/heroes.md). Detailed content belongs in the sections below.

The existing header overlays these heroes with the reversed supplied logo and a
dark-to-transparent gradient; white disclosure panels retain their established
interaction. A measured viewport minimum includes the header clearance and the
bottom narrative band. Resize/orientation and visual-viewport changes update it;
pinch zoom preserves layout size, and text enlargement/short screens may grow
the hero instead of clipping content. CSS dynamic viewport units and responsive
header estimates remain functional without JavaScript. No fixed heights or
body overflow locks are used.

The lower image area now uses a centered clickable mouse/scroll-wheel cue in
place of the visible Explorer la suite text/arrow. Its white outline, 44px target
and translated accessible label retain clear native section navigation. A short
finite wheel animation is disabled for reduced motion. The bottom reserve is
72px at default text size, bringing the CTA closer to the band without clipping
growing content. Current checks belong in [the validation log](docs/validation.md).

The homepage now also includes the owner's explicitly requested certification
badge, documented below. This later request supplies its claim for the local
working site; the initial hero implementation omitted historical certification
copy.

The initial narrow blue band presented Développer · Éprouver · Valoriser as
navigation, with the verified 2011 founding year on home/institute. The later
homepage figure request below replaces that homepage band; other pages retain
their pathway behavior and institute retains its founding year. Display type remains
fluid; Arabic uses natural tracking, logical alignment and directional arrows.

## Hero layout and typography refinements — 2026-10-08

The owner's refinements align the header, hero-body, narrative band, following
sections and footer to the shared 120rem container and fluid side gutters.
This removes the narrower hero/content inset and the footer width exception.
Latin hero H1s use −3% tracking in every composition; Arabic keeps natural tracking.
Public French/English text and controls now use self-hosted Plus Jakarta Sans,
including Découvrir and menu actions; system families remain loading/glyph fallbacks.

Selected languages use 700 weight alone in the header and footer dropdown, with
no persistent fill or underline. Hover and keyboard focus remain visible.
Header menu labels and their arrows center together within the full control width;
the compact Menu control also centers its contents. Current executed checks and
rendered coverage are recorded separately in [the validation log](docs/validation.md).

## Header search and contact controls — 2026-10-08

The owner's screenshot refinement gives search a white square, neutral gray
outline and navy magnifier; contact retains primary blue with white text.
Both use physical 20px top-left/bottom-right corners with sharp opposite corners,
including in RTL. Search is 48px square, reducing to 44px at `35rem` and below;
contact retains a 48px minimum height and 24px horizontal padding at the default
root size. Localized labels, routes, shared fonts and mobile contact access remain.
See [control rules](docs/design-system.md#header-search-and-contact-controls--2026-10-08)
and [current validation](docs/validation.md).

## Shared key-figure typography — 2026-10-08

The owner's Figma screenshots dated 2026-10-08 at 20.37.38, 20.41.03 and
20.41.08 are typography hints: Plus Jakarta Sans numeric values at 60px/600,
labels at 18px/500, both with 100% line height and zero tracking. Values are
white; the source labels use 70% white. These samples establish a style reference,
not approval of the illustrated metrics or new content.

The shared key-figure style applies to the five owner-supplied homepage figures,
the established 2011 founding year on institute and the menu adaptations below.
Values scale from 36px to
60px at the default root size and use Plus Jakarta Sans even for isolated Latin
numerals in Arabic. Labels
remain 18px and stack below the value on mobile as well as desktop. Arabic labels
retain their body family, natural tracking and a 1.45 line height for shaping.
The homepage's longer Latin labels use a 1.35 line height for wrapping rather
than the base figure label's 1.

The label token defaults to 70% white on appropriate dark surfaces. The current
hero band raises this to 87% white on approved blue `#296BB4`: source opacity
would yield about 3.54:1, while the adaptation yields about 4.55:1 for normal
label text. See [shared figure rules](docs/design-system.md#shared-key-figure-typography--2026-10-08)
and [the validation log](docs/validation.md) for executed checks and renderings.

The owner explicitly supplied the homepage's five values in the current request:
69 Projets collaboratifs soutenus; +60 Brevets déposés; +1000 Jeunes chercheurs
soutenus; +1100 Publications scientifiques; +18 Laboratoires universitaires mis
en place. The homepage band now presents these as a semantic definition list,
replacing its founding-year/pathway items. The user's message is the content
source; the Figma screenshots supply the styling hints. French labels retain
the requested wording with spelling corrected; English/Arabic labels are drafted
translations. Auto-fit tracks adapt the figure count per row to available space
and enlarged text; the hero grows on narrow screens to display all five facts.
See [the hero content record](docs/heroes.md#homepage-key-figures--2026-10-08).

## Homepage certification badge — 2026-10-08

The owner directly requested Certifié · ISO · 9001:2015 · Première agence de moyens
certifiée en Afrique. The homepage-only badge records that supplied claim, with
English/Arabic draft translations; no independent certification verification is
asserted. It is a labelled, noninteractive native aside. ISO 9001:2015 stays
LTR-isolated in Plus Jakarta Sans; Arabic copy uses Alexandria.

A translucent neutral gray surface uses actual backdrop blur and the physical
top-left/bottom-right signature corners, preserved in RTL. At `70rem` and above,
the 11rem badge sits at the inline end of a two-column copy grid, aligned with
the CTA's bottom edge. Below that it wraps compactly between description and
actions, so the button remains near the five-figure band. Natural hero growth is
retained. See [badge rules and content](docs/heroes.md#homepage-certification-badge--2026-10-08)
and [current validation](docs/validation.md); earlier hero evidence predates it.

## Hovered-menu reference adaptation — 2026-10-08

The four owner-supplied menu examples establish a shared language of white tabs
and panels, clear typography, thin dividers, diagonal destination arrows and
generous spacing. The latest clarification supersedes the earlier interpretation
that every panel should copy one three-column arrangement or carry a figure.

Institute and research use introductions, destination lists and relevant featured
links; only research includes the existing 69-project figure. Expertise and
resources use compact introductions beside their two- and five-item lists,
without duplicate feature links or figures. All panels grow with their content,
using consistent padding and bounded scrolling instead of a shared minimum height
or a figure pushed to the bottom. The 22-page structure, localized drafts and
native disclosure behavior remain the basis. Screenshot sample claims and routes
do not authorize new content. See [navigation decisions](docs/navigation.md#hovered-menu-reference-adaptation--2026-10-08)
and [the validation log](docs/validation.md) for revision-specific coverage.
