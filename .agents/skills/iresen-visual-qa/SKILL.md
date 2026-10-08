---
name: iresen-visual-qa
description: Use after IRESEN visual implementation to inspect rendered layouts, relevant interactions, Arabic RTL, and scoped correction passes.
---

# Visual QA

Read the request, affected source and design direction. Choose representative
routes, desktop/mobile widths and relevant states; include Arabic for shared UI.
Add English, tablet and long-content views when the change makes them material.

Run the app using documented setup. Browser checks use a production build and local
database as described in [README.md](../../../README.md). Do not point validation at
production. Capture and inspect real renderings, not source code alone. Existing
[footer screenshots](../../../docs/footer.md#review-screenshots) can support an
initial read; check their date and current source before relying on them.

Inspect hierarchy, typography, spacing, cropping, logo geometry, contrast,
containment and RTL. Exercise relevant menu/locale/filter/form keyboard, pointer
and touch states; verify focus restoration, truthful states and reduced motion.
Use existing behavior tests when interactions change and supplement axe with
manual checks. Do not claim full accessibility compliance from an automated scan.

Batch the first inspection's findings, implement useful fixes together, then
confirm with one follow-up pass. Stop cosmetic iteration when the scoped result
works; unresolved functional defects still need attention. If rendering is blocked,
report that limit, perform permitted source checks and keep visual QA marked pending.

Report routes/locales/widths/states actually checked, material differences, remaining
issues and commands/results. Store only suitable public review artifacts; never
expose private references or CMS personal data in screenshots.
