# Dependency and stack review log

Check this log before starting CI. A review or reminder covers its calendar month;
record at most one reminder per month. Update reviews may be recorded whenever
explicitly commissioned. See [the rule](verification-workflow.md#monthly-dependency-reminder).

| Date       | Kind     | Outcome                                                                                                                                                                                                                                                                                                       | Evidence                                                         |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 2026-10-24 | Review   | Owner requested compatible dependency/stack updates before CI. Node, pnpm, Next, Payload, lint and test tools updated; current month covered.                                                                                                                                                                 | [Stack review](stack-maintenance-2026-10-24.md)                  |
| 2026-11-02 | Reminder | Pre-CI reminder recorded; owner subsequently commissioned the review below.                                                                                                                                                                                                                                   | Governance biography refinement chat                             |
| 2026-11-02 | Review   | Owner-requested compatible stack update; Node, pnpm, Next, Payload, lint tools, Sass/SWC and minimatch refreshed. Local regression verification complete: 282 units, 32 integration tests and 368 browser scenarios validated. One unpatched low deepmerge advisory remains.                                  | [November stack review](stack-maintenance-2026-11-02.md)         |
| 2026-11-11 | Review   | Owner-requested security and compatible dependency refresh: Next 16.4.6, Payload 3.93.0, pnpm 11.28.11 and compatible tools selected. Validation and final advisory status recorded in the linked ledger. Node's announced security release remains unpublished in the official 24-line index at review time. | [Security and stack review](security-stack-review-2026-11-11.md) |

Later on 11 November, the owner requested resolution of deepmerge. The
[scoped local code remediation](deepmerge-remediation-2026-11-11.md) replaces
Payload's affected dependency with an explicitly maintained hardened compatibility
fork. Complete and production audits report zero advisories; security/API and
application verification are recorded in that report. The audit gate is unchanged.
