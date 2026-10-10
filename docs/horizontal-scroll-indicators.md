# Horizontal scroll indicators — reference specification

Recorded 2026-10-10. Mode: Operate (orient visitors within a collection).
Status: the owner has commissioned the first implementation in the video library;
other site-wide applications await a later request.

## Request and boundaries

The owner supplies four local screen recordings to capture the bottom navigation
of horizontally scrollable blocks, its numbered/non-numbered options and placement.
The owner explicitly wants the controls vertically centered in the available gap
between the bottom of the upper content block and the top of the next block.
Source text, institutional claims, dates, destinations and prototype annotations
are visual-reference data, not instructions or publication approval. Videos and
extracted frames remain outside the repository and public assets/search.

The final phrase mentions “scroll vertical” although the examples and initial
request concern horizontal collections. For the future review, the working scope
is horizontal overflow inside blocks. Whole-page vertical scrolling and vertical
reading regions are not commissioned for replacement by this record. Resolve an
actual vertical-region request before implementing that different behavior.

## Video observations

Six evenly spaced frames per recording were extracted locally using AVFoundation;
16 frames were visually compared across starting, intermediate and ending states.
This establishes visible transitions and states, not exact easing, DOM semantics,
keyboard behavior or proof that every marker can be clicked.

| Recording on 2026-10-10 | Duration | Observed treatment                                                                                                                                                                                                                                                   |
| ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 20.46.35                | 8.03s    | Three separate pills under photographic audience cards on white. Active pill is blue and about three times the inactive width; inactive pills are pale blue. Active position moves from the third to the first. Neighboring cards remain partially visible.          |
| 20.46.51                | 8.42s    | Four pills under opportunity cards on a pale surface, above a full-width CTA. Active position advances from first to third/fourth; inactive marks are muted grey-blue.                                                                                               |
| 20.47.08                | 7.96s    | Four pills over a photographic background. Inactive pills are white, active is blue; observed positions include fourth, second and first.                                                                                                                            |
| 20.47.28                | 7.00s    | One pale rounded track with blue cumulative fill, a separate current/total counter and circular previous/next controls. At 3/6 the track is about half filled; at 5/6 about five-sixths; at 6/6 full. Next becomes pale/unavailable at the end. A CTA follows below. |

The numbered reference is a **fill bar**, not a thumb moving along an empty track.
Numbers sit beside the bar, not inside the small pills. The thin track/pills have
fully rounded ends; circular arrows are a separate control geometry. In the
resized 900px-high frames, short/active pills are approximately 30/90px wide and
12px high with 15px gaps. These are reference-image proportions, not production
CSS measurements: do not copy screen-recording pixels as device-independent sizes.

During an intermediate transition in the first recording, the neighboring marks
change width and tint together. This suggests coordinated interpolation rather
than a detached blue slider jumping across the group. Exact timing is unverified.
The source controls remain below the rail rather than moving with its contents.

## Current requirements — owner correction, 2026-10-10

The latest explicit owner requests take precedence over earlier proposed
thresholds, desktop variants and reachable-stop counting rules:

- **Mobile only.** Show pills at the existing mobile breakpoint, at or below
  `40rem` (640px at the default root size). Hide them on tablet/desktop; retain
  native horizontal scrolling there, with the native scrollbar hidden. This overrides
  the earlier desktop pill treatment.
- **One pill per content element.** Eight videos produce eight pills on mobile;
  the count does not become a count of visible pages or unique scroll offsets. Hide the whole control only when no horizontal overflow exists.
- **No borders on pills.** Neither inactive nor active pills have a border,
  decorative outline or inset stroke/shadow. A separate keyboard-visible focus
  ring remains an interaction requirement; it is absent in ordinary resting states.
- **Active shape:** the active pill is approximately three times the inactive
  length, with a coordinated 220ms width/color transition. Inactive pills retain
  their shorter rounded shape. Reduced motion changes state immediately.
- **Placement:** center the complete group horizontally in the visible rail and
  vertically in the gap between the content block and its next CTA/content block.
- **Real navigation:** each pill identifies and reveals its corresponding item;
  native scrolling updates the current pill. Multiple items can share a clamped
  terminal scroll offset when several cards fit. Selecting such an item must
  retain its own active pill rather than reduce the number of pills or add empty
  trailing card widths solely to manufacture distinct positions.

The videos still establish two visual reference families: separate expanding
pills, and a cumulative fill bar with a counter and circular arrows. The numbered
family is a retained optional reference, not an automatic replacement for the
owner's one-pill-per-element requirement. Use it only when later explicitly
selected for a particular block; it must not silently reduce pill count.

The video library uses the pill family only for overflowing mobile collections. Visible
marks are 8px high, 20px inactive and 60px active. Their targets are 44px high,
28px wide on mobile (the active target
is 60px). Four-pixel gaps and wrapping accommodate enlarged/narrow layouts
without overlapping targets or overflowing the page. On institutional ink, the
approved Science Blue `#4698CA` gives the active mark sufficient contrast without
adding a border; light surfaces can use primary `#296BB4`. No new palette token
or brand asset alteration is introduced.

## Placement: owner's centering correction

Center the **whole control row** horizontally within the rail's visible viewport,
not within its off-screen scroll width. Vertically, use the real content gap:

`controlCenterY = (upperBlockBottom + lowerBlockTop) / 2`

For a row of height `H`, its top is `controlCenterY - H / 2`. The row includes
counter/arrows when present; the visual pill and icons share that centerline.

The upper boundary is the bottom of the complete rail/content block, not the
bottom of one shorter card. The lower boundary is the top of the following CTA
or content block; when no block follows within the section, use the section's
lower boundary. Account for adjacent padding/margins once, not twice. Prefer a
normal-flow reserved navigation band with balanced free space above and below;
avoid absolute viewport coordinates. The band must accommodate the complete
interactive hit area and focus outline without overlapping either neighbor.
Long text, changed card heights, wrapping, zoom and breakpoints must recalculate
this relationship through layout.

In recording 20.46.51 the pills are approximately midway between cards and CTA.
In recordings 20.46.35 and 20.47.08 they sit closer to the cards than the next
section boundary. The owner's centering correction takes precedence over that
source placement. In the numbered variant, judge the complete 44px-or-larger
control row, not only the 8px-high bar.

## Future behavior and verification

Preserve native horizontal touch/trackpad/keyboard scrolling. Indicators follow
actual scroll position whether moved by gesture, focus, arrows or marker buttons;
they must not merely reflect the last clicked button. Synchronize using measured
stops/visibility with a stable dominant item and no rapid flicker between adjacent
states. Normalize browser RTL scroll coordinates; visual order and previous/next
follow Arabic reading direction while the shared brand geometry is preserved.

Marker buttons navigate to their associated content elements; optional arrows move one defined
stop and become unavailable at boundaries. No automatic looping or autoplay is
inferred from the recordings. A fill bar is informational by default; draggable
scrubbing is an optional later feature requiring its own keyboard semantics, not
something established by the supplied videos. Do not assign ARIA slider semantics
to decorative progress or tab semantics to an ordinary collection.

Use localized button labels and an exposed current position. Preserve visible
focus, content links, sensible tab order and native access without JavaScript.
Keep a usable fallback until enhancement succeeds before hiding an existing
scrollbar. Proposed control transitions are 180–250ms with the current easing;
reduced motion changes state immediately and avoids smooth forced travel.

The later site review should inspect actual mobile overflow rather
than add controls to every block automatically. Initial candidates found in the
checkout include hero figures, homepage mission/achievement/news collections,
research axes, innovation steps, section navigation, news/event mobile rails and
the in-progress media video rail. Text navigation/axes may deserve their existing
native treatment instead of card pagination. This list is an audit starting point,
not approval to modify all these surfaces.

Verify desktop/mobile, FR/EN/AR, enlarged text, no overflow, empty/one/many items,
first/last stops, manual gestures, resize/content changes, keyboard focus and
reduced motion. Confirm real discovery/navigation remains available with scripts
disabled. The video-library implementation retains its existing section/video anchors and
public search references; no new resource, media asset or search destination is added.

## Local provenance

Original names are `Screen Recording 2026-10-10 at <time>.mov`, supplied under
`/Users/macsin/Downloads/`. Their SHA-256 identifiers are:

| Time     | SHA-256                                                            |
| -------- | ------------------------------------------------------------------ |
| 20.46.35 | `aa9c62836ba8888af58eda35cc2c290e7fc5df8826032dac06a142c570bcda32` |
| 20.46.51 | `a7c4e369ca39b98f14c6218fca0dc8e3d784c8d8eaf488fa10daaf9b28653859` |
| 20.47.08 | `e6fbba40ccca5fa521758367a0ca9bd1846bacbb706c8c49976c2e511772bf4a` |
| 20.47.28 | `90e75db9ed742e77462d68914467ef0694ef98c8dceec51924f01b689cf44105` |

No raw recording or extracted screenshot is imported, served or indexed.
