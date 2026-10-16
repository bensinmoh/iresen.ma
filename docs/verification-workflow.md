# Verification without duplicate work

When multiple chats share the checkout, first follow
[chat orchestration](chat-orchestration.md). The owner's 2026-10-15 hold requires
explicit readiness from every editing chat before tests/builds, pushes, CI or merge.
Use the frozen-input check before validation and release the batch only after
reconciliation. Existing full current-head CI and branch review gates still apply.

Owner instruction — 2026-10-12: retain all CI checks, responsive review and
FR/EN/AR coverage, while avoiding repeated checks of unchanged inputs.

## Check ledger

Keep a short ledger in the task notes: check, relevant source/build revision,
result, coverage and remaining limitations. Use Git diff to determine which
inputs changed. A passed check remains evidence until its inputs change; elapsed
time or a documentation edit alone does not invalidate application evidence.
Uncommitted unrelated files must remain outside the task and its commit.

| Change since a passing check        | Repeat locally                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| Documentation only                  | Changed-file formatting, links and whitespace; relevant manifests/frontmatter                |
| CSS/layout/labels                   | Affected locale/viewport/state checks; production review of the final runtime                |
| Client behavior                     | Affected unit and interaction tests, keyboard/focus and failure states                       |
| Shared shell/tokens/navigation      | Affected pages and shared browser suites across FR/EN/AR                                     |
| CMS/schema/access/search processing | Generated artifacts, relevant disposable-database integration tests and public/private gates |
| Build configuration/dependencies    | A fresh production build and affected runtime checks                                         |

These are local selection rules, not CI exclusions. If the impact is uncertain,
expand coverage. A failure invalidates the affected evidence until corrected and
verified; do not retry repeatedly without inspecting its cause.

## Runtime sequence

1. Establish scope and the affected tests once. Read applicable instructions and
   skills once per conversation, revisiting them only when scope or guidance changes.
   Reuse healthy dependencies, database and browser installations; check readiness
   rather than reinstalling or remigrating unchanged environments.
2. Iterate on the development server. Review all affected FR/EN/AR views and batch
   findings from mobile, tablet, desktop, long labels and RTL before correcting.
   Include intermediate widths where layout changes, 200% text and relevant
   keyboard/focus, hover and reduced-motion states. Source checks alone do not
   replace actual rendered review.
3. When the runtime stabilizes, run formatting/whitespace, lint and meaningful
   affected unit tests once. Run independent lightweight checks together; avoid
   concurrent production builds or duplicate TypeScript processes on the same
   machine. Use `pnpm typecheck` for early feedback if useful. `pnpm build` also
   runs TypeScript, so a successful final build covers that local obligation;
   CI retains both explicit checks.
4. Build once into an ignored directory such as `.local/task-review-build`, using
   `NEXT_BUILD_DIRECTORY=.local/task-review-build pnpm build`. Start that same
   artifact on a dedicated port. Never overwrite the owner's running dev build
   or silently reuse a dev server as production-browser evidence. A temporary
   Playwright config can specify the matching build directory, port and
   `reuseExistingServer: false`.
5. Run the targeted production-browser suites once, including relevant FR/EN/AR
   responsive assertions and interactions. Capture representative states within
   those tests and inspect the captures; a separate identical screenshot script
   is unnecessary. If runtime inputs change, rebuild before claiming production
   evidence, then rerun the affected scenarios. Test-only fixes use the same build.
6. Update documentation and search references once for the completed scope. Rebuild
   local search when its public catalog/projection changes, not after unrelated
   style edits. Check final changed-file formatting and whitespace without
   repeating already valid runtime suites for documentation-only edits.
7. Commit and push the reviewable result. Prefer the stabilized scope over sending
   every UI experiment through CI; earlier pushes remain useful when remote
   feedback or collaboration is needed. Full CI runs on every PR revision. A newer
   push cancels obsolete runs of that same PR; the final revision still runs every
   step. Each main push has a unique concurrency group and is retained.
8. Merge only after the exact current PR head's CI and repository review rules
   pass. Record CI results in the PR, including retries/skips and local limitations.
   Synchronize main and clean only task branches/temp files. No local repeat of
   the same full suite is needed after a clean merge of the checked revision.
   Conflict resolutions or new runtime changes require affected checks and new CI.

## Coverage retained

CI remains the clean, disposable-environment gate for formatting, lint, explicit
TypeScript, all unit/integration tests, generated CMS artifacts, production build,
full browser suite and opt-in local CMS review (`CMS_LOCAL_REVIEW=true`, never `PUBLIC_RELEASE=true`). No path filter, locale removal, reduced
viewport matrix or weakened assertion is introduced by this workflow.

Local production review adds actual visual inspection of the affected routes and
states; it complements CI rather than reproducing the complete site suite for
small UI changes. Database changes merit local integration feedback; unchanged
CMS/database behavior in a UI task can rely on the mandatory full CI integration
run. Never point integration fixtures at the owner's populated database.

Report progress when the phase changes or a finding matters. During long CI waits,
keep updates brief and avoid repeating the same status or enumerating every poll.
A ledger/result summary should state what passed and what remains, rather than
recounting every command attempt.

GitHub's [concurrency guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)
supports PR-scoped cancellation with a unique run-ID fallback for other events.
