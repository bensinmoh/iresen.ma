# Public-site motion

The owner commissioned site-wide motion on 2026-10-11: navigation between
sections of the same page and reveals on the first scroll through content.

## Shared behavior

The public locale layout mounts `SiteMotion`, a small progressive enhancement.
It observes headings, quotations, static article cards, direct section lists,
hero descriptions and footer headings. Reading units enter with a 420ms/14px
vertical translation, using the shared arrival easing. Text retains its full
contrast throughout; raster thumbnails in static article cards receive the
opacity entrance separately. SVG marks retain their original treatment.
Simultaneous units stagger by 35ms, capped at 105ms. Each element runs once per
page visit. Hero actions stay in place to retain clearance from the scroll cue
and stable click targets. New server/client content is registered through an
additions-only MutationObserver; there is no scroll listener or animation library.

Section wrappers, sticky navigation, dialogs and horizontal rail containers are
never transformed. Published long-form articles reveal their headings rather
than the entire article. Publication and patent results retain their existing
component-owned filter/layout animations. Other menus, media viewers and rails
keep their existing interaction transitions. Native buttons receive short color
feedback and a 1px press displacement; footer and section links transition color.

Native smooth scrolling now applies to internal anchors across every public
page and viewport. Keyboard focus uses immediate scrolling so responsive reflow
never leaves a focused control waiting outside the viewport. Pointer/touch anchor
activation keeps smooth scrolling. Link history, canonical anchors, interruption,
focus and existing sticky navigation clearance remain native. An anchor destination's
heading settles immediately; following a hero link does not consume reveals
for later, offscreen sections. Direct initial hashes also settle their targets.

## Accessibility and failure modes

All content is visible in server HTML and ordinary CSS. No readiness class,
opacity-zero rule or delayed visibility gates reading. Missing JavaScript,
IntersectionObserver or Web Animations leaves the complete page readable.
Keyboard focus cancels an active reveal containing the focused control.
Reduced motion uses immediate native scrolling and no shared reveals; changing
the preference cancels active animations. No glyph splitting, parallax, loops,
scroll interception or new dependencies are introduced. Vertical movement is
independent of LTR/RTL and never changes layout dimensions.

Motion is scoped to public locale layouts; CMS/admin is unaffected. This changes
presentation only: existing FR/EN/AR search references, titles, bodies, routes,
resource identifiers and publication gates are unchanged. No new index entries
or rebuild are required.

## Verification

The focused browser suite is `tests/e2e/motion.spec.ts`. It covers first-entry
and no-replay behavior in FR/EN/AR, hero anchor continuity, mobile/tablet public
pages, reduced-motion preference changes, missing-observer and no-JavaScript
readability. Actual command results and rendered review are recorded in
[validation](validation.md).

Project catalogue articles also own their filter/hover transitions and are excluded
from shared first-scroll reveals. See [project interactions](projects.md).

## Coverage refinement — 2026-10-12

Programmes image/prose units, useful-link rows/descriptions and notice paragraphs
join the existing observer. Transform ownership and visible server HTML are
preserved. No GSAP/Motion dependency, second observer or duplicate component
reveal is introduced. Reduced motion and keyboard/hash cancellation remain.

## Idle hero scroll invitation — 2026-10-16

The owner explicitly commissions a bounded idle reminder for the existing mouse
cue. A small `HeroScrollCue` client leaf waits five seconds without window
scrolling, then reveals the original mouse shape from below the scene edge, as
if rising behind the blue highlight band. Its wheel moves three times; a masked
text reveal follows, using localized uppercase copy and weight 200 (the lightest
installed Latin weight). Text is centered above the mouse. Desktop hero padding reserves an extra
32px to preserve action clearance. The sequence exits by 6.5 seconds and waits
15 more idle seconds before another appearance. Scroll, resize, visibility and
motion preference changes cancel pending displays. A visible invitation fades
out over 350ms when scrolling starts, with repeated events preserving that exit. It runs only when the hero's
lower edge is onscreen; it never scrolls the page or starts a continuous loop.

Shared desktop hero usage follows the existing cue's scope; mobile retains its
hidden mouse cue and ordinary full-width action. The bright Programmes hero uses
navy for readable hint text. Reduced motion has a static cue without the idle
sequence. Keyboard focus reveals a stable anchor immediately and keeps it visible
while focused. Without JavaScript that same focus path and the main hero action
remain available. No announcement, new library, factual claim or media is added.
The existing canonical section destinations/search references remain unchanged;
localized navigation-hint copy needs no independent search result.

Development: EN1440 sequence captured with mouse/text visible above the blue band;
FR1440 initial hidden state and native hero geometry inspected. Scoped ESLint,
Prettier and whitespace checks pass. Hero E2E assertions are updated for focused
anchor geometry, and new fake-clock coverage exercises first delay, long cooldown,
scroll cancellation and reduced motion. Full browser suites/build/CI remain
pending under the owner's shared-checkout hold.

Owner correction — 2026-10-16: the text is above the icon (superseding the
brief intermediate below-icon request). FR1440 inspection measures matching
horizontal centers within 0.01px, 8px between label and mouse, and 20.5px of
clearance from the hero actions. Computed scroll-exit transition is 350ms.
Fake-clock assertions now cover the fade state before it is cleared.

Hero overlay correction — 2026-10-16: the owner removes the extra 32px cue
reservation. The above-icon invitation now layers over hero content at z-index 20,
with no flow space of its own; the certified homepage content sits lower, ending
32px above the highlight band. This supersedes the preceding clearance reservation.
[Composition and measurements](heroes.md).

Owner timing correction — 2026-10-16: repeat idle delay is now 15 seconds
(previously 45). First appearance remains after 5 seconds; the 6.5-second sequence
and soft scroll dismissal remain unchanged. Existing fake-clock expectations
are adjusted; suite execution remains held by shared coordination.
