# On-demand design tool access

Inspected on 2026-10-13. The clean checkout, local `main`, tracking `origin/main`
and live remote `main` all pointed to `0594b3a36f3b00659242a2252ce688490d462e17`.
No application or workflow change is needed to complete these five tools' access.
Use the existing [verification workflow](verification-workflow.md) proportionally.

| Solution              | Existing state                                                                   | Task-specific access                                                    |
| --------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Taste                 | Vendored `design-taste-frontend`; referenced by AGENTS.md and design-workflow.md | Read the existing skill when public composition benefits from it        |
| Impeccable            | Vendored skill, playbooks and launcher; referenced by the same instructions      | Read only the relevant playbook; engine download remains optional       |
| Playwright CLI        | Included in installed Playwright 1.64.0; no standalone executable on PATH        | `pnpm exec playwright cli`                                              |
| Awesome Design Skills | No library installed                                                             | Read selected upstream references without importing their design system |
| img2threejs           | No skill or public Three.js dependency installed                                 | Prepare an isolated workspace only when a 3D task is commissioned       |

## Interactive browser inspection

[Microsoft's CLI documentation](https://github.com/microsoft/playwright-cli)
supports the locally available `playwright cli` entrypoint. Verify availability
with `pnpm exec playwright cli --help`; no global package or second skill pack
is necessary here. Playwright Test and `pnpm test:e2e` retain their existing role.

Use the installed Google Chrome with a named, temporary review session. The
following environment settings keep new caches and captures in ignored paths:

```sh
export PLAYWRIGHT_BROWSERS_PATH="$PWD/.cache/ms-playwright"
export PLAYWRIGHT_MCP_OUTPUT_DIR="$PWD/.local/browser-inspection"
pnpm exec playwright cli -s=iresen-review open http://localhost:3000/fr --browser=chrome --headed
pnpm exec playwright cli -s=iresen-review snapshot
pnpm exec playwright cli -s=iresen-review resize 390 844
pnpm exec playwright cli -s=iresen-review screenshot
pnpm exec playwright cli -s=iresen-review close
```

Use the actual local server URL/port and requested locales. Read `--help` for
selectors and commands before interacting. Keep the review profile isolated from
personal Chrome data. Close only the task's named session, never all browsers.
Do not run `install-browser` when the selected browser is already available.
CLI inspection complements targeted tests; it is not a second mandatory suite.

## Awesome Design Skills references

The [upstream registry](https://github.com/bergside/awesome-design-skills) provides
paired SKILL.md/DESIGN.md references. Browse only a style relevant to the actual
task, for example its clean or minimalism entries; record the exact source/revision
if adopting a lesson. Read the reference in place instead of running `pull-all`
or importing a competing PRODUCT.md/DESIGN.md. The current IRESEN identity,
tokens, native CSS, content and scoped skills remain authoritative. No installer
or new validation gate is needed merely to consult a reference.

## img2threejs isolation plan

The [upstream skill](https://github.com/img2threejs/img2threejs) reconstructs an
image as procedural Three.js code. Its core scripts require Python 3.10+ and
use the standard library; its npm installer declares Node >=18 and no package
dependencies in the inspected package.json. The local Node 24.19.0 is suitable,
but system Python 3.9.6 is below that core requirement. This is a future task
prerequisite, not a reason to install Python or 3D tooling now.

For a commissioned reconstruction, first inspect the selected upstream revision,
license and target-specific requirements. Use one checkout in an isolated
ignored `.local/img2threejs/` workspace, with its own manifest, pinned Three.js
preview dependencies and state/output paths. Keep private input images there.
Use a compatible Python runtime and existing browser; install only requirements
actually needed by the selected target. Optional masks/depth/landmark adapters
can add substantial model/tool dependencies and should remain separate.

Do not register the skill globally, import generated code into `src/`, add Three.js
to the application's package.json or serve generated media without a commissioned
component and applicable asset/search approval. Upstream staged gates apply to
that reconstruction only, never to normal IRESEN development or CI. Integration
of a requested public component will need measured loading/performance,
accessibility and proportional verification at that time.

## Check ledger

- Baseline: clean local checkout and matching live remote main, checked before edits.
- Integrity: all 66 vendored Taste/Impeccable file hashes match the source manifest.
- Browser capability: local CLI 1.64.0 opened `/fr` on the existing development
  server using installed Chrome; snapshot and evaluation returned `Accueil | IRESEN`
  and 116 links. Only the named review session was closed. This proves CLI access,
  not production UI validation; no browser download or application rebuild was needed.
- Documentation: changed-file formatting, relative links and whitespace checked.
- Preserved: AGENTS.md, PRODUCT.md, DESIGN.md, vendor payloads, application
  dependencies, Playwright Test configuration and CI workflows.
