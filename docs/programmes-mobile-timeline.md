# Programmes mobile/tablet project timeline — 24 October 2026

The owner requests horizontally navigable timeline elements on mobile. At
<70rem the six existing ordered steps form one native scrollable row, each
88% of the available width capped at 28rem to reveal the next item. Proximity snap, native
touch/keyboard scrolling, a visible scrollbar and inset focus outline make
the row usable without adding controls or JavaScript. The list is focusable
and labelled by the existing localized timeline heading. Native RTL governs
Arabic order and scrolling. Desktop grids and all step copy remain.

Development verification: FR390 and AR390 show six equal-top, 308px steps in a
358px scroll viewport with 1976px content width. Native ArrowRight moves the
French row +44px; ArrowLeft moves the Arabic row -44px. The next step peeks
into view, text wraps normally and there is no document horizontal overflow.
Desktop1280 retains its three-column grid. Scoped ESLint, Prettier and whitespace
pass. Full tests/build/CI/Git remain under the existing shared-checkout hold.

Owner follow-up extends the horizontal row to tablets below 70rem, including 768px and 1024px.

Tablet follow-up verification: FR768 has 448px steps and 2816px content in a
720px scroll area; FR1024 retains the horizontal row in a 960px scroll area
with no document overflow. Formatting and scoped whitespace pass.
