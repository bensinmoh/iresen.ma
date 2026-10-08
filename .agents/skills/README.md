# Repository design skills

These skills apply to IRESEN in this repository. They do not install global or
personal skills. Start with [AGENTS.md](../../AGENTS.md) and
[the workflow](../../docs/design-workflow.md); read only relevant skills.

## Local guidance and upstream overrides

The user's request takes precedence. PRODUCT.md describes product truth;
DESIGN.md and docs/design-system.md describe the current visual direction.
Upstream Taste and Impeccable are optional supporting references, not new product
requirements. Preserve their vendored source and keep project overrides here.

- Use Taste for expressive public composition, not CMS/admin forms. Its default
  v2 is experimental. No random aesthetic, forced asymmetry, additional dark mode,
  font substitution, fake data, placeholder imagery or animation library is
  required merely because an upstream rule suggests one.
- Use Impeccable's relevant playbook for the requested operation. A critique-only
  task does not authorize implementation; an implementation task does not need
  repeated approval for coherent reversible refinements. Ask only when a missing
  decision materially blocks the requested outcome.
- Keep approved brand assets and central page boundaries. Critique the layout,
  typography and hierarchy freely within scope; explain the improvement.
- Native CSS and the existing server/component architecture are the default.
  Add dependencies only for a justified capability, preserving pinned versions.
- Do not fabricate factual content, imagery rights, institutional translations,
  editorial approval, successful services or test evidence.
- Impeccable's launcher may download an engine on first use. No engine, hook or
  browser extension is installed by this pack. If it cannot run, read PRODUCT.md,
  DESIGN.md and the relevant playbook directly and report the limitation. Browser
  controls, variants and delegated reviews depend on the host; use supported
  tools and the host's delegation rules.

For a permitted launcher invocation, set `IMPECCABLE_HOME="$PWD/.cache/impeccable"`
for that command so new engine downloads stay in the ignored repository cache.

Source/license records and file hashes live in
[design-skills-sources.json](../../docs/design-skills-sources.json). Updating a
vendor payload is a deliberate maintenance task, not part of routine UI work.
