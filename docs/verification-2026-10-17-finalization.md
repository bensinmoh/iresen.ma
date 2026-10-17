# Whole-batch finalization — 17 October 2026

The owner requested review, tests, current-head CI, merge and cleanup of the shared
CMS/project batch. The owner explicitly confirmed completion of the remaining
expert-network work. Its preparation-only reservation and the already-ready project
workstream were consolidated into the coordinator; no concurrent edit was inferred.

## Review and corrections

Reviewed the common workspace's authentication/origin boundary, two roles,
transaction/revision checks, saved-versus-validated snapshots, recoverable deletion
and impact confirmation, private candidate documents, unique news highlight,
retained source imports, numerical projections and search gates. Project PDF
rendering remains offline, bounded and access-checked again after generation.
Expert-network contracts remain preparation-only and import no expert records.

The first full unit round found stale expectations for the new young-researcher
indicator, already-public localized editorial/link baselines and administration
favicon exclusion from content search. Assertions now explicitly distinguish these
baselines from newly imported working translations; the favicon has a negative
public-index assertion. No public/private gate was relaxed.

Node 24 browser discovery exposed missing JSON import attributes in the retained
corpus dependency graph. These are now explicit, preserving source data. Isolated
CMS fixtures now reproduce the existing highlight state and the deletion-impact
preflight; mutation attempts in cancellation journeys fail. Sidebar locators retain
exact total prefixes while allowing the separate review/incomplete counter.
New browser coverage verifies media partitioning, link-only forms, organigram
search/edit navigation and highlight priority under both supported sorts.

## Local verification ledger

Pinned Node 24.22.0 / pnpm 11.28.2. Database integration uses the disposable
`iresen_cms_ci` database on port 5545; the owner's port-5433 database is not an
integration fixture. The production artifact is isolated under ignored
`.local/cms-finalization/build`, served on port 3101 with server reuse disabled.
Next's temporary TypeScript include paths were restored after building; the
tracked tsconfig is unchanged. Test-only follow-ups reuse the same final artifact.

| Check                                            | Result                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| Full formatting, ESLint, whitespace              | Pass                                                                     |
| Production dependency audit                      | No known vulnerabilities                                                 |
| Additive migrations on disposable database       | Pass                                                                     |
| Payload types and import map                     | Generated/verified                                                       |
| Unit suite                                       | 273 passed, 43 files                                                     |
| Native PostgreSQL integration                    | 32 passed, 6 files                                                       |
| Isolated production build, including TypeScript  | Pass                                                                     |
| Targeted public production browser journeys      | 60 passed; 14 expected gated skips                                       |
| Explicitly enabled isolated CMS browser journeys | 12 passed; closed-admin case skipped as expected                         |
| Actual PDF renderer smoke check                  | Existing public project, valid PDF, 1,810,986 bytes                      |
| Documentation links                              | No missing local links; dated historical scope flagged for human context |
| Local search after useful-link split             | Rebuild succeeds; 7 useful links per FR/EN/AR                            |

Public browser coverage includes FR/EN/AR heroes, media, news/events, laboratories,
programmes, patent discovery and careers. Four source-review project journeys
require a separately populated source-review environment and remain gated here;
the public withdrawal state and access gates are checked. The PDF smoke check uses
read-only access to an existing public project and writes only an ignored local
artifact. No real record, application, account credential or publication state is
changed by finalization tests.

The full clean-checkout GitHub CI remains the merge gate for the exact PR head,
including the complete browser suite and isolated CMS opt-in. Remote results are
recorded on the PR after completion; this local ledger does not substitute for CI.
No deployment, DNS, provider or production-visibility change is authorized or made.
Private sources, avatar files, credentials, local databases and runtime dependencies
remain outside the commit and cleanup scope.
