# Coordinated batch verification — 16 October 2026

The owner requested tests, CI, merge and cleanup. All seven registered workstreams
confirmed completion and delegated finalization to the Editorial chat. The local
coordination registry remains authoritative; no acknowledgements were inferred.
This ledger supersedes earlier “checks held” notes for the completed local checks.

## Environment and isolation

- Node 24.22.0, official Darwin arm64 archive verified against its SHA256 manifest;
  pnpm 11.28.2. Production dependency audit reports no known vulnerabilities.
- Disposable PostgreSQL 17.11 on loopback port 5544, separate upload/project paths.
  The owner's database, administrator, private sources and development server
  were preserved.
- Production builds used an ignored source mirror with the same runtime files and
  dependencies. Its generated TypeScript paths and standalone server did not
  overwrite the owner's development output or tracked tsconfig.
- Browser checks used installed local Chrome, two workers, production port 3100,
  synthetic per-visitor search quota addresses and isolated browser storage.

## Local evidence

| Check                             | Result and scope                                                                                                                                                                    |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prettier / ESLint / whitespace    | Repository checks pass; final ledger formatting checked separately.                                                                                                                 |
| CMS types / import map            | Regenerated outputs match tracked files.                                                                                                                                            |
| Unit suite                        | 198 tests pass in 28 files after runtime corrections.                                                                                                                               |
| Integration suite                 | 32 tests pass in six files on the disposable database.                                                                                                                              |
| Search integration recheck        | All 22 search integration tests pass after catalog corrections.                                                                                                                     |
| Production build                  | Passes, including TypeScript and route generation.                                                                                                                                  |
| Initial complete browser run      | 332 pass, 21 fail, 9 environment-gated skips; findings reconciled below.                                                                                                            |
| Corrected affected browser suites | All 114 tests pass without retries across eleven suites, including FR/EN/AR, mobile/tablet/desktop, 200% text, keyboard, no-JavaScript and reduced-motion scenarios where defined.  |
| Local CMS interface opt-in        | Four tests pass; the mutually exclusive normal-production test is skipped.                                                                                                          |
| Rendered review                   | Final Institute screenshots inspected in desktop/mobile French and Arabic. Portrait bottom alignment, responsive containment and accordions are also asserted in all three locales. |

## Reconciled findings

- Register all new raster fingerprints and source evidence, preserve fictional-image
  search exclusion and keep responsive/foreground variants under their source result.
  The retained original GEP-MCI photo has a separate reachable media reference.
- Project the displayed research mission descriptions into search; use the current
  source copy and dedicated patent destination in regression expectations.
- Accept semantic h1 in the shared heading primitive for the standalone patent page.
  Exclude that deliberately hero-less page from the standard hero contract.
- Forward localized unknown pages with HTTP 404 instead of rewriting to themselves.
  Normalize encoded Arabic news listing/article paths before resolving them.
- Clear stale patent filters when a valid new patent hash is selected on the same
  page, so direct destinations remain reachable after a search.
- Correct the exact 640px Programmes action boundary and preserve full contrast on
  small pathway step numbers. Accessibility scans inspect settled reduced-motion
  content; the dedicated animation tests remain.
- Recognize the positioning SVG as structural geometry, retain the requested
  start-aligned network filter rail and verify the commissioned viewport-sized
  roadmap heading variant without changing its appearance.
- The initial consent test lost its browser during navigation before assertions;
  the complete consent suite passes on its isolated rerun. No assertion or CI check
  was waived, removed or marked expected-to-fail.

## Remote completion gate

The existing [PR #122](https://github.com/bensinmoh/iresen.ma/pull/122) receives the
coordinated batch. Its exact final head must pass the unchanged complete CI before
merge: dependency audit, migrations, generated artifacts, formatting, lint,
TypeScript, unit/integration suites, production build, full Chromium suite and
local CMS interface opt-in. The PR records the final commit and CI outcome.

No deployment, DNS, visibility or provider change is authorized by this validation.
Cleanup is limited to completed task branches and the disposable validation
container/builds; preserve useful runtimes, local databases, private files and the
coordination registry. The separate final institutional content/translation and
search-glossary review remains deferred as documented in the project scope.
