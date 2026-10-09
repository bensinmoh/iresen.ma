# Mobile information hierarchy

The owner's 2026-10-09 refinement asks for a clearer mobile reading order within
the existing identity, copy and routes. Use this rule when adapting future
sections as well as the current homepage hero; it does not authorize new content.

## Three priority tiers

| Priority       | Role                                                                                         | Mobile treatment                                                              |
| -------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1 — Essential  | Page identity, main message and primary next step; required routes, form fields and feedback | Keep readable and directly usable. Let content wrap and grow.                 |
| 2 — Supporting | Short context, a useful related route and necessary figures or details                       | Present after the main message, in reading order or an accessible collection. |
| 3 — Optional   | Decorative treatment and secondary, redundant proof                                          | Omit or defer when it competes with the task.                                 |

Classify by visitor need. A small error, required fact or legal notice can be
essential. Never hide a route, required form control, outcome or necessary fact
merely to make the composition shorter.

## Visible-content ceiling

Limit competing roles in each mobile introduction: at most one contextual
eyebrow, one heading, one short introduction, one primary action and at most one related
navigation action. Follow with at most one supporting collection, rather than
several simultaneous proof groups. These are role/count ceilings for composition,
not fixed pixel heights, a promise to fit one screen or limits on required facts.

For a content section, foreground one heading and one concise introduction before
its collection or detail. Keep remaining material in natural reading order, or
use a clearly named native disclosure or scrollable collection when suitable.
Do not clip text, clamp meaningful content or shrink type to meet the ceiling.
Long translations and enlarged text may extend the page. Essential content takes
precedence over the optional-role budget; header navigation and forms retain their
own functional requirements.

## Current homepage application — 2026-10-09

At `40rem` and below:

- The redundant mouse/scroll cue is omitted. Discovery retains the cue's section
  destination. The later tablet refinement also omits the homepage ISO badge
  below `70rem`, preserving its owner-supplied copy and desktop treatment.
- The existing discovery and related-page links stack at full width, using the
  primary blue and secondary white treatments with shared physical 10px action
  corners. The later mobile reference adaptation uses a 48px minimum at default
  text size. Labels and destinations remain.
- All five homepage figures remain in a focusable, labelled definition list
  with native horizontal scrolling and a hidden scrollbar. A neighboring-item
  glimpse appears where space permits; enlarged text may fill the available width. Every value/label
  pair remains available in logical order.
- The homepage's lower reserve becomes 32px at the default root size instead of
  72px. The image scene now has its own viewport minimum before the figures;
  the hero still grows naturally for reading or enlarged text.

At every width, the homepage figure collection stays in one row, scrolling
horizontally when its tracks do not fit instead of wrapping on tablet. Other
page heroes retain their existing treatment.
The video/photo policy, fonts, copy and routes remain. The narrow header and footer
follow the later [mobile reference adaptation](design-system.md#mobile-reference-adaptation--2026-10-09).
Horizontal navigation follows the owner's general preference for hidden
scrollbars through the shared `.horizontal-scroll` utility. It currently applies
to the figure collection; ordinary vertical page scrolling continues.
Keyboard/touch and no-JavaScript access use native scrolling, without
automatic advancement, carousel buttons or an additional client runtime.

## Homepage mission cards — 2026-10-09

The requested three mission cards now explain Développer · Éprouver · Valoriser
with short wayfinding drafts and generated energy imagery. They stack in ordinary
page flow below 64rem, with image/body rows on tablet and complete vertical cards
below 48rem. All three remain visible without a carousel or nested vertical scroll.
The homepage section submenu is hidden below 64rem. See
[composition, behavior and media](home-sections.md); further page sections retain
their editorial scaffolds.

Inspect reading order, all five facts, reachable links, keyboard/touch scrolling,
no-JavaScript behavior, Arabic RTL and enlarged text when applying the rule.
Executed checks and captures belong in [the validation log](validation.md);
earlier screenshots retain their revision-specific scope. See
[shared design rules](design-system.md#mobile-information-hierarchy--2026-10-09)
and [hero behavior](heroes.md#mobile-information-hierarchy--2026-10-09).
