---
name: iresen-accessibility
description: Use for IRESEN semantics, contrast, keyboard and focus behavior, forms, target sizes, text enlargement, and accessibility review.
---

# Accessibility

Target WCAG 2.2 AA across public UI and custom editorial functionality. Inspect
the affected visitor journey and existing patterns, not just individual attributes.
Use landmarks, meaningful headings, a skip link, native links/buttons and localized
accessible names. Disclosure, tab and dialog semantics must match actual behavior.

Check keyboard access, visible unobscured focus, Escape/outside dismissal and focus
restoration where relevant. Aim for 44px touch controls while applying the actual
AA target-size requirements and exceptions; 44px is not the AA minimum. Check
200% text enlargement, reflow, long translations and Arabic mixed-direction text.

Measure actual colors: 4.5:1 normal text, 3:1 qualifying large text and applicable
non-text contrast. Do not rely on brand palette labels. Use meaningful alt text,
hide decoration, and avoid color/motion/hover as the only information channel.
Forms need labels, associated errors and announced outcomes from real services.

Use the existing Playwright/axe coverage when behavior changes, alongside manual
keyboard and appropriate screen-reader checks. Scope tests to the change, record
unavailable tools/browser coverage and avoid claiming conformance from scans alone.
Coordinate rendered checks with [visual QA](../iresen-visual-qa/SKILL.md).
