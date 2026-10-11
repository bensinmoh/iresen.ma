# Public-site motion

The owner commissioned site-wide motion on 2026-10-11: navigation between
sections of the same page and reveals on the first scroll through content.

## Shared behavior

The public locale layout mounts `SiteMotion`, a small progressive enhancement.
It observes headings, quotations, static article cards, direct section lists,
hero descriptions/actions and footer headings. Reading units enter with a
420ms opacity/14px vertical translation, using the shared arrival easing.
Simultaneous units stagger by 35ms, capped at 105ms. Each element runs once per
page visit. Hero actions fade without displacement to retain clearance from
the scroll cue and stable click targets. New server/client content is registered through an additions-only
MutationObserver; there is no scroll listener or animation library.

Section wrappers, sticky navigation, dialogs and horizontal rail containers are
never transformed. Published long-form articles reveal their headings rather
than the entire article. Publication and patent results retain their existing
component-owned filter/layout animations. Other menus, media viewers and rails
keep their existing interaction transitions. Native buttons receive short color
feedback and a 1px press displacement; footer and section links transition color.

Native smooth scrolling now applies to internal anchors across every public
page and viewport. Link history, canonical anchors, interruption, focus and
existing sticky navigation clearance remain native. An anchor destination's
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
