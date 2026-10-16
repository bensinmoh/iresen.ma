# Institute timeline controls — 2026-10-16

Owner correction: move the progress bar, counter and arrow group farther from the
overlapping activity-report cover. Above 64rem, the timeline's dedicated CSS module
adds fluid leading padding, shifting the centered controls toward the trailing
side (right in French/English, left in Arabic). At 1280px the shift is 102.4px.
Mobile/tablet retain their existing centered controls. The separate module avoids
editing the Institute stylesheet currently owned by the ambition workstream.

No public text, media, routes, anchors, search references or interaction behavior
changes; the existing search projection remains valid.

Check ledger: changed-file Prettier, targeted TimelineRail ESLint and whitespace
checks pass. Local development render inspected in French and English at 1280px,
Arabic at 390px; Arabic desktop padding/direction and document containment checked
at 1280px. French/English next arrows advance to 2/8. Arabic mobile controls retain
zero added padding, visible focus and no horizontal document overflow.

Production build, full tests, CI and Git completion remain deferred under the
active [shared-checkout hold](chat-orchestration.md). Checks used the available
Node 24.19.0; the pinned 24.22.0 runtime was unavailable locally. This development
review is not final production-build evidence.
