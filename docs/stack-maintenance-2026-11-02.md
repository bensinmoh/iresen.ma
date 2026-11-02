# Stack and dependency review — 2 November 2026

The owner commissions compatible stack/dependency updates and checks for side
effects and regressions. This follows the completed
[October review](stack-maintenance-2026-10-24.md) and the existing PR 133 work.
The current checkout is preserved; no deployment or populated-database migration
is included. Codex changes remain direct source/configuration updates, with no
CMS editorial drafts.

## Selected updates

| Component                            | Previous | Selected |
| ------------------------------------ | -------- | -------- |
| Node.js, supported 24 LTS line       | 24.22.1  | 24.22.2  |
| pnpm, compatible 11 line             | 11.28.6  | 11.28.9  |
| Next.js / official lint plugin       | 16.4.2   | 16.4.3   |
| Payload / official adapters          | 3.92.0   | 3.92.1   |
| ESLint                               | 10.13.0  | 10.14.0  |
| typescript-eslint                    | 8.72.0   | 8.72.1   |
| globals                              | 17.13.0  | 17.14.0  |
| Sass, retained transitive override   | 1.105.1  | 1.107.1  |
| next-intl SWC, compatible 1.16 line  | 1.16.2   | 1.16.21  |
| minimatch, affected 10.2.6 consumers | 10.2.6   | 11.0.3   |

All four Payload packages move together. Its
[3.92.1 release](https://github.com/payloadcms/payload/releases/tag/v3.92.1)
fixes PostgreSQL localized-status migration handling and reset-password validation,
among other fixes. The package peer contracts retain Next 16, React 19 and
GraphQL 16 support. The
[Next 16.4.3 maintenance release](https://github.com/vercel/next.js/releases/tag/v16.4.3)
includes standalone-bootstrap, font and tracing fixes.
[ESLint 10.14.0](https://github.com/eslint/eslint/releases/tag/v10.14.0),
[pnpm 11.28.9](https://github.com/pnpm/pnpm/releases/tag/v11.28.9),
[Sass 1.107.1](https://github.com/sass/dart-sass/releases/tag/1.107.1) and
[SWC 1.16.21](https://github.com/swc-project/swc/releases/tag/v1.16.21)
are verified stable releases. No beta/canary package is selected.

The existing 24-hour package-release delay is now explicit and strict:
`minimumReleaseAge: 1440`, `minimumReleaseAgeStrict: true`. No release-age
exclusions are retained. Next 16.4.4 and minimatch 11.0.4 were published on
2 November inside that window, so the latest eligible versions are selected.
Exact pins, peer validation, engine checks, dependency verification and the
native-build allowlist remain in force.

React 19.3.1, GraphQL 16.14.2, TypeScript 6.0.3, Node 24 declarations 24.19.2,
Playwright 1.64.1, Vitest 5.0.5, sharp 0.35.5 and the other unchanged direct pins
were checked against npm metadata. GraphQL 17 is outside Payload's `^16.8.1`
peer contract; TypeScript 7 is outside typescript-eslint's `<6.1.0` contract.
This refresh retains the supported Node 24/pnpm 11 lines rather than introducing
a Node 26/pnpm 12 migration. PostgreSQL 17.11 remains the current stable release
of the configured 17 line in the
[official archive](https://www.postgresql.org/docs/release/); moving the owner's
data to PostgreSQL 18 is not part of this compatibility refresh. The three CI
action release tags and immutable SHAs already match their latest stable releases.

## Runtime and container integrity

The [Node 24.22.2 release](https://nodejs.org/en/blog/release/v24.22.2) archive for
macOS ARM64 was verified against official `SHASUMS256.txt` before extraction:
`aa9549349e47dffaa42dcf95d6e06ade8c4bdafc980979883b88767670df385a`.
Local Node and pnpm installations stay under ignored `.local/toolchains`; global
installations are preserved. `.nvmrc`, engines, package-manager metadata, CI and
Docker pins are synchronized.

Both Docker stages use the verified multi-platform `node:24.22.2-bookworm-slim`
manifest digest
`c86ecead9e55a5210ac1727de38a4ca840bf03dcaf34dc9749addbf383b1920c`.
The existing PostgreSQL image pin remains unchanged. No database restart,
production environment change or release is performed.

## Security audit

The initial complete dependency audit reports one moderate development finding
and one low production finding.

- [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249):
  minimatch before 11.0.1 permits pattern amplification. The narrow override
  `minimatch@10.2.6 → 11.0.3` replaces affected lint-tool consumers with a patched
  stable release. Node 24 satisfies its engine contract. Lint/type/build and
  regression suites verify the affected tooling behavior.
- [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4):
  deepmerge 4.3.1 remains a transitive Payload dependency, including Payload
  3.92.1. The latest upstream release remains 4.3.1; the advisory lists no patched
  version. The issue is discussed/disputed upstream, but it is not withdrawn.
  No ignore entry, risk-acceptance exception, downgrade or audit suppression is
  introduced. The production audit therefore remains a failing merge gate.

After the selected updates, the complete audit contains only the existing low
deepmerge finding; the moderate minimatch finding is absent. Mandatory full CI
remains required before any merge.

## Verification ledger

Verification uses a newly created, separately named local PostgreSQL 17.11 database
and private test upload/asset directories, never the populated owner database.
The production build is isolated in `.local/stack-review-20261102` and browser
checks use port 3196. Generated task-only TypeScript include paths are restored
before the final source snapshot is frozen.

| Check                                         | Result                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| Strict install / frozen-lockfile repeat       | Passed, no release-age exceptions                                                     |
| Full dependency audit                         | One remaining low deepmerge finding; minimatch fixed                                  |
| CMS migrations and generated types/import map | Passed on disposable PostgreSQL 17.11; generated files unchanged                      |
| Formatting / lint                             | Passed                                                                                |
| Unit / integration regressions                | All 282 units and 32 integration tests pass                                           |
| Isolated production build / TypeScript        | Passed on Node 24.22.2 / Next 16.4.3                                                  |
| Production browser / isolated CMS review      | 356 public scenarios validated; 12 isolated CMS scenarios pass                        |
| Dockerfile validation                         | Passed (`docker build --check`), no warnings                                          |
| Current-head PR CI                            | Required before merge; latest result recorded in PR; deepmerge audit remains blocking |

The combined snapshot includes the completed concurrent LinkedIn refresh. The
first unit run caught ten new images missing from the central provenance register;
the news workstream registered their source references/hashes and the complete
unit suite then passed. Integration tests remain valid: that correction changed
only source-reference image metadata and documentation. The owner explicitly
confirmed the news editing was finished and authorized closing its reservation
before the corrected regression snapshot was frozen. News-owned changes remain
preserved and separate from this chat's stack commit scope.

Browser evidence: the first full run had 355 passes, one failed immediate
focus-style sample and 17 guarded skips. The shared-elements assertion now uses
Playwright's web-first `toHaveCSS` with the same exact 2px requirement; all three
FR/EN/AR scenarios in that file then pass on the same production build. No runtime
style or assertion value was changed. The aggregate public coverage is 356
validated scenarios. The explicit CMS run adds 12 passes and skips its inverse
public-closure check, which passed in the public mode. The remaining five
source-data-dependent cases (one calls journey and four project-source journeys)
retain their existing guards and were not run. No skip, retry or check suppression
was added. This is Chromium coverage, not a claim of cross-browser conformance.

Representative FR desktop and AR mobile production captures were inspected;
portrait framing, identity spacing, RTL and source content remain coherent.
The normal preview is restored with the pinned local Node/pnpm toolchain; the
other chat's isolated review preview is preserved. Test database cleanup is
restricted to this task's separately named disposable database.
