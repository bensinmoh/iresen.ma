# Stack update before final CI — 24 October 2026

The owner requests available dependency and technology-stack updates before the
completed site batch enters CI. Exact pins, strict peers and supply-chain checks
are retained. No provider, deployment or populated database change is included.

| Component                      | Previous | Selected |
| ------------------------------ | -------- | -------- |
| Node.js LTS                    | 24.22.0  | 24.22.1  |
| pnpm stable 11 line            | 11.28.2  | 11.28.6  |
| Next.js / official lint plugin | 16.4.1   | 16.4.2   |
| Payload / official adapters    | 3.90.2   | 3.92.0   |
| Vitest                         | 5.0.4    | 5.0.5    |
| axe Playwright adapter         | 4.13.0   | 4.14.0   |
| ESLint                         | 10.12.0  | 10.13.0  |
| typescript-eslint              | 8.71.2   | 8.72.0   |

[Payload 3.92.0](https://github.com/payloadcms/payload/releases/tag/v3.92.0)
requires the selected Node security patch and retains Next 16 and GraphQL 16
compatibility. All four Payload packages move together. Its locale-write and
field-access fixes are covered by fresh disposable-database integration tests.
[Next 16.4.2](https://github.com/vercel/next.js/releases/tag/v16.4.2),
[Vitest 5.0.5](https://github.com/vitest-dev/vitest/releases/tag/v5.0.5),
[typescript-eslint 8.72.0](https://github.com/typescript-eslint/typescript-eslint/releases/tag/v8.72.0)
and [pnpm 11.28.6](https://github.com/pnpm/pnpm/releases/tag/v11.28.6)
are compatible stable maintenance releases. The installed package peer contracts
are checked before installation; no release-age or peer-validation bypass is used.

The Node macOS ARM64 archive is verified against official `SHASUMS256.txt`:
`89c682593d76cd44233fa53b1563264e7de9cbb189cad169135c5b4fadfbc0a7`.
Both Docker stages use the verified Node multi-platform image digest
`55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205`.
The `.nvmrc`, package engines, CI and Docker pins agree. Local runtime/tooling
installs remain under ignored `.local/toolchains`; global installations are preserved.

PostgreSQL 17.11 remains the current stable 17 release in the
[official release archive](https://www.postgresql.org/docs/release/).
Compose and CI refresh its immutable Bookworm image digest to
`858bb5e98eed02eb8cafbcdc007f9a65d1b613972028944a8ec2133ccaf80d27`.
The running owner database is neither restarted nor migrated by this configuration
refresh. PostgreSQL 18 would require a separate data migration.

React 19.3.1, GraphQL 16.14.2, TypeScript 6.0.3 and Node 24 declarations 24.19.2
remain the latest compatible selections. GraphQL 17 is outside Payload's
`^16.8.1` peer range; TypeScript 7 is outside typescript-eslint's `<6.1.0` range.
Node 24 remains the supported LTS line; pnpm 12's native CLI migration is outside
this compatibility-led refresh. The npm `latest-11` tag selects 11.28.6;
newer `next-11` builds are excluded. All three pinned CI actions already match
their current stable releases and keep their immutable commit pins.

The transitive security fixes described in
[the batch verification ledger](verification-2026-10-24.md) remain in effect.
A regenerated lockfile, generated CMS artifacts, dependency audits, local checks,
isolated production review and full current-head CI gate the final merge.
Strict installation and CMS artifact generation pass with no generated source
changes. Both production and development audits report no known vulnerabilities.
Dockerfile validation passes with no warnings. On the updated stack, formatting,
lint, all 282 unit tests, all 32 integration tests and the isolated production
build pass. The updated axe rules exposed a video-card accessible-name mismatch: the explicit
label omitted its visible position metadata. Native button content now supplies
the complete accessible name. The owner’s monthly pre-CI update reminder is
persisted in AGENTS.md and the dependency review log. Final browser/CI outcomes
are recorded in the batch PR.
