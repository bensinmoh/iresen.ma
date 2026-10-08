# Foundation validation

Verified locally in the cloud workspace on 2026-10-07. Readiness checks for install, setup, migrations, generated CMS files, formatting, lint, types, unit/integration/browser tests and the standalone build passed again on 2026-10-08. The blank trilingual structure is ready for homepage implementation; no completed institutional homepage or dataset is claimed.

| Check                                                        | Result and evidence                                                                                                                                                                                        |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                             | Passed with the committed dependency lockfile                                                                                                                                                              |
| `pnpm setup:local`                                           | Passed; private environment configuration remains ignored by Git and existing configuration is preserved                                                                                                   |
| `pnpm db:wait`, `pnpm cms:migrate`                           | Authenticated PostgreSQL connection and migrations passed; repeat migration was idempotent                                                                                                                 |
| `pnpm cms:types`, `pnpm cms:importmap`                       | Passed; generated CMS types and import map have no committed-file drift                                                                                                                                    |
| `pnpm lint`, `pnpm typecheck`, `pnpm format:check`           | Passed                                                                                                                                                                                                     |
| `pnpm test`                                                  | 8 passed: complete UI catalogs, equivalent routes/anchors, unambiguous paths and CMS publication/access predicates                                                                                         |
| `pnpm test:integration`                                      | 4 passed against a disposable database: controlled bootstrap, account-role protection, draft/editor publication boundaries, private media metadata and French/Arabic publication eligibility               |
| `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:e2e` | 11 passed against the production server: all configured locale routes, RTL, equivalent-page switching, keyboard/Escape navigation, mobile Arabic reflow, anonymous CMS restrictions, 404s and non-indexing |
| `pnpm build`                                                 | Standalone production build passed                                                                                                                                                                         |
| Supplied brand assets                                        | Seven current SVG copies match their original bytes and recorded hashes; logo rendering checked in the browser. PDFs remain private.                                                                       |

Browser accessibility checks reported no axe violations on the empty shell in all three languages. Relevant test sources are [unit/access tests](../src/tests/cms-access.test.ts), [locale tests](../src/tests/i18n.test.ts), [database integration tests](../src/tests/cms.integration.test.ts) and [browser journeys](../tests/e2e/foundation.spec.ts).

## Limits

GitHub Actions passed the complete workflow in [PR #3 run 37703962430](https://github.com/bensinmoh/iresen.ma/actions/runs/37703962430) after browser installation was aligned with the project's test cache. Each new `main` revision is checked by its own remote CI run. Cloud verification does not establish the Mac checkout's readiness, and no production deployment or live-domain behavior is claimed.

Automated accessibility and the tested keyboard/mobile interactions do not establish full WCAG conformance. Complete manual screen-reader, broader browser, long-content and final visual reviews with the implemented homepage. Representative performance budgets and field metrics have not been measured on final content.

Search, contact delivery and CMS email are honest unavailable adapters. Production storage, identity/MFA, jobs, legal/privacy assessment, recovery and approved content/translations remain follow-up work. Missing design exports/fonts/imagery do not block this foundation. See the [backlog](backlog.md).
