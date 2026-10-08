---
name: iresen-motion-design
description: Use when adding, refining, or reviewing purposeful IRESEN UI transitions, reveals, and reduced-motion behavior.
---

# Motion design

Identify the visitor benefit: state feedback, hierarchy or orientation. If motion
adds no value, leave the interaction direct. Read existing motion tokens and
[DESIGN.md](../../../DESIGN.md); use CSS first and shared timing/easing conventions.
150–250ms control transitions and 300–500ms larger reveals are starting points.

Prefer transform/opacity and stable geometry. Content stays visible/usable when
JavaScript, an observer or animation fails. Respect prefers-reduced-motion and
avoid scroll hijacking, forced intros, custom cursors, autoplay and continuous
decoration. Never animate Arabic glyphs in a way that breaks shaping.

Use [Impeccable's animate playbook](../impeccable/reference/animate.md) only as
relevant guidance with [project overrides](../README.md). A GSAP/Motion example
does not require installing either. Justify any added library by the required
effect and measured cost, keeping it isolated from server-rendered content.

Inspect default and reduced-motion states, mobile behavior, keyboard focus and
layout shifts through [visual QA](../iresen-visual-qa/SKILL.md). Report benefit and
actual verification, not an assumed animation-quality improvement.
