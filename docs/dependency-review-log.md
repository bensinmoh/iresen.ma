# Dependency and stack review log

Check this log before starting CI. A review or reminder covers its calendar month;
record at most one reminder per month. Update reviews may be recorded whenever
explicitly commissioned. See [the rule](verification-workflow.md#monthly-dependency-reminder).

| Date       | Kind     | Outcome                                                                                                                                                                                                                                                                      | Evidence                                                 |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 2026-10-24 | Review   | Owner requested compatible dependency/stack updates before CI. Node, pnpm, Next, Payload, lint and test tools updated; current month covered.                                                                                                                                | [Stack review](stack-maintenance-2026-10-24.md)          |
| 2026-11-02 | Reminder | Pre-CI reminder recorded; owner subsequently commissioned the review below.                                                                                                                                                                                                  | Governance biography refinement chat                     |
| 2026-11-02 | Review   | Owner-requested compatible stack update; Node, pnpm, Next, Payload, lint tools, Sass/SWC and minimatch refreshed. Local regression verification complete: 282 units, 32 integration tests and 368 browser scenarios validated. One unpatched low deepmerge advisory remains. | [November stack review](stack-maintenance-2026-11-02.md) |
