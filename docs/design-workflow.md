# Design workflow

Adapted from the owner's attached `design-workflow.md` on 2026-10-08. These are
guidelines for better design decisions, not a fixed checklist or new product scope.
The user's current request takes precedence over this document and skill defaults.
Routine coherent refinements can proceed without repeated permission questions.

## Start with the task

Read [AGENTS.md](../AGENTS.md), [PRODUCT.md](../PRODUCT.md) and [DESIGN.md](../DESIGN.md).
Inspect current code, available references, content status and the visitor's task.
Do not load every skill. Select the relevant guidance from the table below.

For cross-page coherence, read [current shared rules](design-system.md#current-coherence-rules)
and the [live design-system review](figma-design-system-review.md) before choosing
new typography, spacing, grids, corners or control states. Reuse an existing
role/family first. Record a source contradiction or intentional adaptation
explicitly instead of adding a competing page-specific rule. Reference-guidance
updates need documentation checks; rendered verification applies when the
website's presentation or behavior changes.

| Skill                                                                                 | Use                                                                                |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [iresen-frontend-design](../.agents/skills/iresen-frontend-design/SKILL.md)           | Public composition, art direction, constructive critique and scoped implementation |
| [iresen-design-system](../.agents/skills/iresen-design-system/SKILL.md)               | Shared geometry, color hierarchy, typography and token evolution                   |
| [iresen-figma-implementation](../.agents/skills/iresen-figma-implementation/SKILL.md) | Available editable Figma or export references to responsive components             |
| [iresen-responsive-layout](../.agents/skills/iresen-responsive-layout/SKILL.md)       | Viewports, long content, FR/EN/AR and RTL                                          |
| [iresen-visual-qa](../.agents/skills/iresen-visual-qa/SKILL.md)                       | Rendered comparison, relevant interactions and bounded correction passes           |
| [iresen-motion-design](../.agents/skills/iresen-motion-design/SKILL.md)               | Purposeful transitions and reduced motion                                          |
| [iresen-accessibility](../.agents/skills/iresen-accessibility/SKILL.md)               | Semantics, contrast, keyboard/focus, forms and reflow                              |
| [iresen-seo-performance](../.agents/skills/iresen-seo-performance/SKILL.md)           | Localized indexing, metadata, media, fonts and client cost                         |
| [design-taste-frontend](../.agents/skills/design-taste-frontend/SKILL.md)             | Optional expressive public composition; upstream default v2 is experimental        |
| [impeccable](../.agents/skills/impeccable/SKILL.md)                                   | Optional targeted design operation and its relevant playbook                       |

Skills are repository-local. Read [IRESEN overrides](../.agents/skills/README.md)
before using either upstream skill. Taste supports public composition, not CMS/admin
forms. The stricter `gpt-taste` and redundant aesthetic variants are not installed.
Upstream examples do not require new fonts, dark mode, placeholder imagery, random
aesthetic selection or GSAP. The approved identity and existing project remain
authoritative.

## A practical sequence

1. **Inspect.** Establish the visitor task, requested scope, current implementation
   and actual available evidence. Separate approved content from drafts and sample
   screenshots. Missing optional exports should not stop independent work.
2. **Read the design.** Briefly explain the composition problem and improvement.
   Choose fidelity, refinement or redesign from the request. Critique weak layout
   and type choices; preserve brand/content/page boundaries. Seek a decision only
   when it materially blocks the outcome.
3. **Implement.** Reuse tokens and components, applying responsive, Arabic and
   accessibility rules throughout. A narrow component fix need not replace the
   site's identity. A critique-only request remains a review.
4. **Inspect and correct.** Render relevant desktop/mobile/Arabic views, include
   other widths/locales/states as needed, batch useful fixes and confirm once.
   Run existing behavior tests when behavior changes. Report rendering limitations
   honestly; source checks are not a substitute for visual evidence.
5. **Record.** Update DESIGN.md and [the design-system specification](design-system.md)
   when a shared improvement is adopted. Report actual checks and remaining inputs.

Scale the work to the change. A text correction needs focused reading and wrapping
checks; a new homepage needs composition and responsive/locale review; a motion
interaction needs default/reduced-motion and keyboard checks. These are starting
points, not permission to invent sections, facts or services.

## Using the optional playbooks

Impeccable has critique, audit, polish, typeset, layout, adapt, animate, harden,
optimize and other playbooks. Load the requested operation, not the whole catalog.
Command syntax varies by host; direct instructions to read the named skill and
playbook by path work even when shortcuts are unavailable.

The vendored launcher includes matching supporting data but no downloaded engine.
Its first invocation may download a pinned engine. For a permitted invocation,
set `IMPECCABLE_HOME="$PWD/.cache/impeccable"` for that command so new engine files
stay in the ignored repository cache. No installer, context engine, detector hook
or browser extension was executed or activated while integrating this workflow.
If the launcher fails, follow the skill's direct-context fallback and continue
with permitted tools. Live browser/variant features depend on host support.

## Example prompts

- **Homepage:** “Use $iresen-frontend-design and $iresen-design-system to compose
  the homepage from approved content and available references. Use Taste where
  helpful, preserve the IRESEN identity and finish with $iresen-visual-qa including Arabic.”
- **Reference adaptation:** “Use $iresen-figma-implementation to adapt this export.
  Explain useful improvements and verify FR/EN/AR with $iresen-responsive-layout.”
- **Finishing pass:** “Use $impeccable critique on the footer, implement useful
  findings within scope and use polish for one targeted finishing pass. Preserve
  factual content and verify the rendered result.”
- **Motion:** “Use $iresen-motion-design and the animate playbook for one purposeful
  interaction. Keep reduced-motion/mobile behavior usable and justify any library.”

## Provenance and maintenance

[design-skills-sources.json](design-skills-sources.json) records pinned upstream
repositories, exact commits, copied paths, Git blob IDs, SHA-256 hashes and licenses.
Upstream payloads are unchanged; the added Taste UI metadata and local guidance
are identified separately. Third-party licenses apply only to their payloads;
they do not license IRESEN code, brand or content.

Do not auto-update during an ordinary design task. For a deliberate update, review
the chosen revision's changed guidance and runtime needs, replace the complete
payload and preserve notices, then update the manifest and verify hashes together.
Keep IRESEN overrides outside vendor SKILL.md files. Vendor directories are excluded
from formatting, application linting and Git whitespace checks so routine tooling
cannot modify pinned source bytes or impose application rules on third-party helpers.

For skill/documentation edits, validate YAML frontmatter, relative paths, routing,
source integrity and whitespace. Review a realistic task to check that routing
does not impose irrelevant work. Application/database tests are unnecessary when
runtime source is unchanged; structural checks do not prove design quality.
