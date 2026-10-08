---
name: iresen-responsive-layout
description: Use when implementing or fixing IRESEN responsive layouts, long content, French/English/Arabic presentation, or RTL behavior.
---

# Responsive and multilingual layout

Inspect real FR/EN/AR catalogs, central route mapping and affected components.
Design around actual long labels and variable content. Use logical CSS, fluid
gutters, flexible tracks and suitable minimum widths; change layout when space
runs out instead of shrinking readable text.

Review relevant widths from 320, 390, 768, 1024 and 1440px. Test wrapping, containment,
open controls and long content; a small component fix need not render every route.
Check 200% text enlargement and reflow where the change affects reading or controls.

Arabic needs correct lang/dir, shaping and line-height without letter spacing.
Isolate phone/email/DOI/Latin names with bdi or equivalent. Mirror directional
navigation/icons when meaningful, retaining logo geometry and physical brand corners.
Language switching preserves the equivalent page and supported anchor; do not
silently fall back to French CMS text in an Arabic public page.

Keep long-content experiments and fixtures out of published content. Use
[visual QA](../iresen-visual-qa/SKILL.md) to inspect actual renderings and state
which locales, widths and states were covered.
