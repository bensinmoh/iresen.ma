---
name: iresen-design-system
description: Use when evolving IRESEN shared tokens, typography, brand geometry, colors, surfaces, or reusable component conventions.
---

# Design system

Read [DESIGN.md](../../../DESIGN.md), [the specification](../../../docs/design-system.md)
and [tokens.css](../../../src/styles/tokens.css). Inspect consumers before changing
a shared token; a local fix may be preferable to a global adjustment.

Start with the specification's [current coherence rules](../../../docs/design-system.md#current-coherence-rules)
and [live Figma evidence](../../../docs/figma-design-system-review.md). Reuse the
implemented shared 120rem grid, type roles and component families. Figma H4/H5,
spacing/grid and shadow captions contain drift; measured evidence does not
automatically become a new global token. Illustrated states are not a component API.

Keep #296BB4 as primary blue and #12345A as institutional navy. Use selective
accents and measure actual contrast. Brand colors are not automatically accessible
status tokens. Keep received SVG source bytes, geometry and appropriate background
variants. Do not invent clear-space measurements from absent brand boards.

Maintain semantic color, type, spacing, container, corner and motion roles. Reuse
existing tokens; introduce a token when it expresses a shared purpose. Full-width
section edges remain flat; the selected physical top-left/bottom-right signature
applies sparingly and is preserved in RTL. Circular radios, pill switches and
appropriate control shapes remain exceptions. FR/EN use the installed licensed
Plus Jakarta Sans; Arabic retains its current stack pending companion review.

Inspect affected components and responsive/locale states after a shared change.
Update DESIGN.md and the specification together with the adopted rule, reason and
coverage. Do not record an experiment as an approved or implemented standard.
