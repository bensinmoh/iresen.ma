# IRESEN visual direction

Use this document for art direction and constructive critique. Use
[the design-system specification](docs/design-system.md) for shared implementation
rules and [PRODUCT.md](PRODUCT.md) for product/content truth. These are working
guidelines: explain useful departures and follow the owner's current instructions.

For a shared website decision, start with [current coherence rules](docs/design-system.md#current-coherence-rules)
and the [live Figma design-system review](docs/figma-design-system-review.md).
Use this file for art direction and that specification for component/type/spacing
roles. Source measurements explain intent; contradictory captions do not create
new tokens or override current implemented decisions.

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

## Mobile reference adaptation — 2026-10-09

The owner's four attachments, `Screenshot 2026-10-09 at 09.35.58.png`,
`09.36.08.png`, `09.36.37.png` and `09.36.41.png`, establish the requested mobile
composition: a logo/hamburger header, a white full-screen menu, a generous image
scene with low-positioned copy, and a single-column navy footer. Their sample
copy, routes, facts, networks and sampled colors do not replace approved content
or identity; device chrome is outside the website.

At `40rem` and below, the existing header, homepage hero and footer adapt those
proportions using the shared navy/blue, original SVGs, Jakarta/Alexandria and
logical RTL layout. Search and all three locales remain available in the open
menu; the two homepage actions stay full width and the five facts follow the
image scene in their native scroll row. See [component rules](docs/design-system.md#mobile-reference-adaptation--2026-10-09)
and [revision-specific validation](docs/validation.md#mobile-reference-adaptation--2026-10-09).
This is a responsive interpretation, without a pixel-exact fidelity claim.

The owner's subsequent clarification adds a 320ms entrance from the physical
right edge to the mobile menu. A transform-only CSS reveal preserves its geometry,
including Arabic and native no-JavaScript access. Reduced motion opens directly.
See [motion verification](docs/validation.md#mobile-menu-entrance--2026-10-09).

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
- Keep full-width section boundaries flat. Actions share physical 10px top-left/
  bottom-right corners; selected cards, media and surfaces retain the 20px signature.
  Arabic does not automatically reverse these brand corners.
- The apex motif supports a few purposeful brand areas. Avoid dense decoration
  behind text, universal pills, generic gradients and effects without a visitor benefit.
- The owner's latest clarification keeps the Apex Leaf selective. This revision
  uses it on the homepage hero eyebrow and the Institute's Mission H2 only.
  Preserve the supplied shape, decorative semantics and proportional spacing.

## Typography, rhythm and media

The current token system uses a shared 120rem container maximum and side gutters
of `clamp(1.25rem, 3.125vw, 4rem)` across the header, hero, content sections and
footer. This gives the page one aligned, spacious grid; body-copy measure remains
constrained within it. Keep the 4/8px spacing rhythm.
Treat 12/8/4-column desktop/tablet/mobile grids as composition
starting points. Adapt to content; a headline should not become tiny to preserve
a desktop arrangement on mobile.

The 2026-10-09 section placeholders on pages other than contact use the existing aligned grid, flat section
boundaries, light dividers and bounded text measure. H2s identify sections and
nested Mission topics use H3s; short localized draft notes describe
the content to prepare. Keep the existing heroes as introductions and the Apex
Leaf selective on Institute's Mission H2. These placeholders establish content
order, with final module composition still to follow the approved material.
Sitemap group H3s retain bold weight and can break long words within narrow
columns. Compact header actions can shrink and wrap with enlarged text.
Contact's later composition replaces its scaffold while preserving its anchors.
See [section implementation](docs/page-sections.md) and
[revision-specific validation](docs/validation.md).

Apply [the mobile information hierarchy](docs/mobile-information-hierarchy.md):
essential orientation and action first, supporting context/facts next, optional
decoration or redundant proof last. Set a visible-content ceiling by roles and
counts, preserving natural height, readable text and access to required content.

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
The owner's requested generated hero placeholders are tracked separately below;
their photographic style does not establish real institutional subjects.

## Interaction and review

Functional search uses a compact heading, query form, content-type facets and
readable editorial result rows on the shared grid. The results page supersedes
its former full-screen introduction and section scaffolding, bringing results
into immediate view. Matching text uses a restrained readable highlight, with
descriptive links, excerpts and dates where available.

Spelling proposals use a quiet localized “Did you mean…” link. Keep the original
query editable; accepting a correction updates the results URL explicitly.
Approximate and related-topic rows carry short text labels, avoiding a technical
score or a claim of semantic certainty. Highlight actual matched public words.

The resting white header magnifier preserves its shared square/corner geometry.
A 220ms field reveal moves toward inline-start on wider headers (left in FR/EN,
mirrored in AR), bounded by the available header width. At `40rem` and below,
the field and suggestions expand in normal flow inside the full-screen menu.
Keyboard focus and touch expose the same
input; native GET forms, reduced-motion direct reveal and no-JavaScript submission
remain usable. Live suggestions are a compact link list with arrow-key access,
Escape/outside dismissal and abortable requests. Query/filter/pagination live in
the URL. See [search](docs/search.md) and revision-specific validation.

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
and provenance. Native Figma screenshots were reviewed for typography, spacing
and colors on 2026-10-08. Full-page native rendering, dedicated RTL/tablet
references and effective prototype behavior remain unverified. Verify
availability/freshness before claiming a direct
comparison. Existing footer screenshots are prior review artifacts, not supplied
references or proof of a new rendering.

Record adopted shared improvements here and in the design-system specification,
with the reason and verification. Keep proposals, experimental directions and
unfinished measurements clearly separate from implemented decisions.

The live board reinforces the display/body/label hierarchy, intentional space,
flat bands and selected diagonal corners. Keep the implemented shared grid,
Plus Jakarta Sans, natural Arabic tracking and existing type roles coherent
across pages. H4's size, H5's rem conversion, the final spacing label, mobile
grid caption and shadow caption contain source inconsistencies; the measured
review records them. Illustrative state frames do not supply a production
component API. Reuse card/row families, one primary action per context and
accessible native controls; circular radios and pill switches remain appropriate
exceptions to the diagonal-corner language.

## Site coherence review — 2026-10-09

The cross-page review adopts a shared 10px action radius for search, contact,
hero discovery, newsletter Subscribe and error/404 actions. Larger certification
and newsletter-field surfaces retain the 20px signature. This supersedes the
earlier 4px generic-button and 20px hero/Subscribe adaptations without changing
the approved identity. Hero/Subscribe use an 18px/600 action role and a default
12px icon gap; hero introductions use weight 500. The body scale stays unchanged, and
button-like links retain the same hover treatment as native actions.

Header source order is logo, navigation, actions; responsive placement retains
the wide single row and intermediate two-row layout. Compact destination and
utility links have 44px minimum targets. Shrinkable menu/Subscribe labels and
narrow-screen spacing address the baseline's 320px enlarged-text overflow.
Error content shares the page heading/content anatomy, and sitemap groups use
consistent headings and 44px link rows.

The original Apex Leaf is decorative in two places only: a white 10 × 16px CSS
mask beside the homepage hero eyebrow, and the original blue vector at 1em height
with a 12px gap beside the Institute's Mission H2. Other headings keep their
existing treatment; placement changes logically in Arabic without mirroring
the brand shape. This implements the owner's selective-use clarification rather
than a universal heading marker.

See [the review and content limits](docs/site-coherence-review.md) and
[this revision's validation](docs/validation.md#site-coherence-review--2026-10-09).
Earlier dated checks below describe their original implementations.

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

## Contact reference composition — 2026-10-09

The owner's selected [contact frame `804:7374`](https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=804-7374)
and attached `contact.png` guide the general composition: a white shared header,
large split introduction with a navy headquarters panel, four platform entries,
centered form on a pale surface, native FAQ rows and the existing navy footer.
The requested full-width location section follows the FAQ. The original abstract
cyan/white background is recovered byte-identically from the native file; it is
decorative imagery, not an office photograph or a full-page screenshot.

Approved navy `#12345A`, blue `#296BB4`, self-hosted Jakarta/Alexandria, shared
gutters and physical action corners govern the implementation. The screenshot's
historical colors, header/footer labels and institutional sample claims do not
override current identity, canonical navigation or reviewed content. Avoid
duplicating Apex markers throughout this page; the existing selective rule holds.

Keep the reference's hierarchy with natural text growth: split introduction on
wide screens, stacked content on narrow screens, four/two/one platform columns,
and labelled form controls with a single-column narrow layout. Logical spacing
and isolated Latin identifiers support Arabic. FAQ answers use native disclosures.
The form action states its actual purpose: prepare a local email, then open the
visitor's email application. A plain directions link and an on-demand map preserve
useful location access. No sample opening hours, 48-hour promise, department
mailboxes, platform addresses or phone numbers are presented as verified facts.

Sources, service limits and the unverified map pin are recorded in
[contact documentation](docs/contact.md). Current executed checks belong in
[validation](docs/validation.md); this source adaptation does not establish
production publication or final editorial approval.

## Contextual hero media — 2026-10-09

Whole photographic backgrounds now support four text-placement modes: start,
end, center and editorial. The former five split pages use start, with no image
inset or opaque navy text half. Editorial utilities retain their reading measure
over `rgb(5 17 29 / 66%)`, allowing the photograph to remain visible.

New generated executive-meeting, young-adult onboarding and two-person handshake
images fit governance, opportunities and collaboration. All 17 active photo assets
are still fictional illustrations. Real Green Energy Park and IRESEN office
photos await source-download access; no real image or office location is asserted.
See [role mapping, provenance and readiness](docs/contextual-hero-media.md).
This describes the photo-hero revision; contact subsequently replaces its photo
hero with the reference composition above. Routes, fonts, original SVGs, mobile
hierarchy and homepage video remain.
Earlier compositions and captures are historical; current checks belong in
[validation](docs/validation.md).

## Generated hero placeholders — 2026-10-09

The owner's explicit photo-replacement request supplied 17 generated photographic
placeholders across 22 pages in that initial revision. Its
[archived generated manifest](docs/hero-assets-generated-2026-10-09.json) retains
the original set, before three contextual replacements. A coherent energy/science editorial
series uses natural light, warm neutral landscapes and restrained blue, with
credible fine geometry and room for translated text. Generic scenes and anonymous
people illustrate the topic without identifying IRESEN sites, events or staff.
Existing layouts, copy, claims, figures, routes, fonts and original SVGs remain.

Native sources are 1536 × 1024 for 16 images and 1672 × 941 for the aerial image.
Keep their actual HD dimensions rather than claiming native 4K or a resolution
increase for every previous asset. Quality-90 WebP derivatives retain native
pixels without upscaling. Content-hashed filenames, full-height portrait mobile
crops at `40rem` and below and cover-aware sizing support sharp imagery while retaining
one eager/high-priority photo request. The approximately 250KB mobile image budget needs
measurement against the final derivatives.

See [that revision's provenance and media behavior](docs/heroes.md#generated-hero-placeholders--2026-10-09)
and [this revision's validation](docs/validation.md#generated-hero-placeholders--2026-10-09).
The earlier Figma image records and captures remain historical evidence.

## Homepage hero video — 2026-10-09

The owner's later request uses the original `/videos/hero.mp4` for the homepage,
with no playback button. Normal-motion playback starts after hydration, muted,
looping and inline. The generated photo stays beneath it as the loading/failure,
no-JavaScript and reduced-motion fallback; a live reduced-motion change unloads
the video. Keep the same overlay, typography, copy, figures and layout. Nineteen
other pages retain photo heroes; contact uses its later split composition and
search uses its compact functional results view.

The unchanged 9.32 MiB file is an owner-requested budget exception. Its
end-of-file metadata needs byte-range delivery; web-sized, fast-start derivatives
remain follow-up work. The no-button instruction supersedes the earlier
pause-control default, without establishing WCAG 2.2.2 conformance for continuous
motion. See [media behavior and limits](docs/heroes.md#homepage-hero-video--2026-10-09)
and [revision-specific validation](docs/validation.md); photo-only checks remain historical.

## Mobile information hierarchy — 2026-10-09

The homepage's `40rem`-and-below presentation prioritizes its message and two
existing navigation actions, stacked full width in primary blue and secondary
white. The redundant scroll cue is hidden, and the lower reserve reduces from
72px to 32px at default text size. The later tablet refinement hides the optional
ISO badge below `70rem`, preserving its compact desktop placement. All five
figures stay in one labelled, focusable row at every width, with native horizontal
scrolling when needed and a hidden scrollbar. A neighboring-item glimpse appears
where space permits on mobile. Preserve natural text growth and logical RTL order.
Other page heroes, identity, copy, header and footer remain.

Horizontal navigation throughout the public site should hide its scrollbar while
retaining native touch/keyboard scrolling and visible focus. The shared
`.horizontal-scroll` utility currently applies to the homepage figures; ordinary
vertical scrolling retains its controls.

Use [the reusable hierarchy](docs/mobile-information-hierarchy.md) for future
sections. Future mission cards await approved content and follow this mobile
guidance. Earlier captures describe earlier presentations;
current checks belong in [validation](docs/validation.md).

## Introducing heroes — 2026-10-08

All approved pages now open with a restrained introduction: a display title, one
short sentence, a section anchor and one related destination. The initial five
compositions (start, end, center, split and editorial) varied rhythm by page topic;
the contextual-media refinement above removes split and retains four text modes.
The initial 17 individually extracted Figma images were illustrative backgrounds,
without identifying pictured people or facilities as IRESEN. They are superseded
by the generated placeholders above; [the archived manifest](docs/hero-assets-figma-2026-10-08.json)
retains their source facts. Initial utility pages used quieter navy overlays;
the current neutral readability layer is documented above. Detailed
content belongs in the sections below.

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
72px at default text size, except for the homepage at `40rem` and below, which
hides the redundant cue and uses 32px. Content grows naturally. Current checks
belong in [the validation log](docs/validation.md).

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
no persistent fill or underline. Header hover surfaces use the same physical 10px
top-left/bottom-right action corners as search; opposite corners stay sharp,
including in Arabic. Hover and keyboard focus remain visible.
Header menu labels and their arrows center together within the full control width;
the compact Menu control also centers its contents. Current executed checks and
rendered coverage are recorded separately in [the validation log](docs/validation.md).

## Header search and contact controls — 2026-10-08

The owner's screenshot refinement gives the closed search trigger a white square, neutral gray
outline and navy magnifier; contact retains primary blue with white text.
Both now use physical 10px top-left/bottom-right corners with sharp opposite corners,
including in RTL. Search is 48px square, reducing to 44px at `35rem` and below;
contact retains a 48px minimum height and 24px horizontal padding at the default
root size. The tighter radius is an adaptation toward the re-shared reference,
supported by live CTA corner evidence rather than an exact screenshot measurement.
The French desktop CTA now reads « Contactez-nous » through its header-specific
label; shared fonts, page titles, routes and compact-menu contact access remain.
See [control rules](docs/design-system.md#header-search-and-contact-controls--2026-10-08)
and [current validation](docs/validation.md); earlier 20px checks describe the
previous treatment.

## Expandable header search — 2026-10-09

On wider headers, the existing 48/44px magnifier opens a white field with navy text
and shared physical 10px action corners. It expands toward inline start (left
FR/EN, right Arabic), with a 220ms width/opacity transition and stable header geometry.
The enhanced control is capped at 22rem and available container space; expansion
can use the other direction when needed. Reduced motion makes the change immediate.

Fine-pointer hover opens without taking focus; explicit keyboard/touch activation
focuses the labelled input. Enter or the filled icon sends a native GET query
to the existing localized search page. Focus retains the open field; Escape,
outside interaction and leaving disclosure focus close it. Native disclosure/form
behavior remains without JavaScript. At `40rem` and below, search sits inside
the open full-screen menu; its input and suggestions occupy the available width
in normal flow and enlarge the scrollable menu.
The public search engine now provides ranked results and live suggestions.
See [the search guide](docs/search.md) and [interaction rules](docs/navigation.md#expandable-header-search--2026-10-09)
and [current validation](docs/validation.md); earlier square-control captures retain their scope.

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
translations. A single row adapts to available space at every width, scrolling
horizontally when the five tracks do not fit. Its scrollbar is hidden; at `40rem`
and below, wider tracks retain a neighboring-item glimpse where space permits.
Text wraps naturally rather than being clipped.
The owner's 2026-10-09 alignment refinement centers each homepage value and label
inside its own track. Locale-authored line breaks give the descriptions two lines
at ordinary desktop/mobile sizes, including short labels; narrow tracks or
enlarged text can add lines naturally. Menu and founding-year alignment retain
their existing treatment.
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
the CTA's bottom edge. The owner's later tablet refinement omits it below
`70rem`, replacing the wide badge between description and actions. Natural hero
growth is retained. See [badge rules and content](docs/heroes.md#homepage-certification-badge--2026-10-08)
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

## Desktop submenu destination states — 2026-10-09

The owner's latest submenu screenshot clarifies the destination hover treatment:
the full link rectangle has sharp corners and a navy fill, with a white title,
pale description and light blue diagonal arrow. Keyboard-visible focus uses the
same treatment while retaining its outline. This supersedes the earlier quiet
destination surfaces; panel geometry, current-route behavior, RTL, copy and routes
remain. Screenshot sample wording does not authorize replacement content.
See [shared state rules](docs/design-system.md#desktop-submenu-destination-states--2026-10-09)
and [revision-specific checks](docs/validation.md#desktop-submenu-destination-states--2026-10-09).
