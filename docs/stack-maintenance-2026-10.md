# Stack and tooling review — 16 October 2026

The owner commissions a compatibility-led stack/tool update, verification and
merge. Keep the existing modular application and supported major versions.
Exact package versions and the regenerated lockfile remain authoritative.

## Updated pins

| Component                        | Previous | Selected |
| -------------------------------- | -------- | -------- |
| Node.js LTS                      | 24.19.0  | 24.22.0  |
| pnpm                             | 11.19.0  | 11.28.2  |
| Next.js / official ESLint plugin | 16.4.0   | 16.4.1   |
| React / React DOM                | 19.3.0   | 19.3.1   |
| PostgreSQL configured image      | 17.9     | 17.11    |
| Zod                              | 4.6.5    | 4.6.7    |
| Playwright                       | 1.64.0   | 1.64.1   |
| Vitest                           | 5.0.3    | 5.0.4    |
| typescript-eslint                | 8.71.1   | 8.71.2   |
| Prettier                         | 3.9.9    | 3.9.10   |
| Node 24 declarations             | 24.19.1  | 24.19.2  |
| actions/setup-node               | 7.0.0    | 7.1.0    |

The [Next.js security patch](https://github.com/vercel/next.js/releases/tag/v16.4.1)
is paired with [React's transport patch](https://github.com/react/react/releases/tag/v19.3.1).
Payload 3.90.2 declares Next >=16.3.3 <17 and GraphQL ^16.8.1, so the
framework patch fits its existing peer contract. Strict peer validation stays on.

The [Node 24 LTS release](https://nodejs.org/en/blog/release/v24.22.0) is aligned
across `.nvmrc`, package engines and Docker; the
[stable pnpm 11 maintenance release](https://github.com/pnpm/pnpm/releases/tag/v11.28.2)
is aligned across packageManager, engines, Docker and CI. Node downloads are
checked against the official SHA-256 manifest and pnpm against registry SHA-512
integrity for local verification. No global installation is replaced.

Docker uses the verified multi-platform Node image digest
`a5f4366e834695d5f363b920c104953a535d3a9864d1bdf74566a0ebe01daee5`.
Compose and CI share PostgreSQL 17.11 digest
`3645570cccdfa447589da9f57dd740faa29b30938e861289a5574b6ca6b03826`.
The [17.11 release notes](https://www.postgresql.org/docs/release/17.11/) cover
maintenance/security fixes and existing-installation considerations. Verification
uses a fresh disposable database; the populated owner database and its running
container are preserved. Refreshing an existing database instance still requires
its normal backup and release-note review.

[setup-node 7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0)
is pinned to verified commit
`949feb2413d6458794dcd2491c4babbbce0c15c1`; its manifest retains the Node 24 action
runtime. The existing checkout and pnpm setup actions already match their stable
releases and retain their immutable pins.

## Compatibility decisions

- Keep Payload/adapters 3.90.2 together. The newly published 3.91.0 was still
  inside the package manager's release-age window at this review; there is no
  need to bypass that safeguard for the compatible Next/React security patches.
- Keep GraphQL 16.14.2: GraphQL 17 is outside Payload's declared peer range.
- Keep TypeScript 6.0.3: typescript-eslint 8.71.2 declares TypeScript <6.1.
- Keep Node 24 LTS and stable pnpm 11 rather than changing runtime/package-manager
  majors. The `latest-11` tag selects 11.28.2; newer `next-11` builds are excluded.
- Other direct dependencies retain their current compatible stable pins.
- Keep strict peers, exact versions, reviewed overrides and supply-chain checks.
  Remove the obsolete Playwright 1.64.0 release-age exceptions. Remove `stateDir`
  from workspace settings because pnpm now accepts it only as machine configuration;
  store/cache directories remain project-local. No global configuration is changed.

Registry checks used the official npm package metadata, including
[Payload's peer contract](https://registry.npmjs.org/@payloadcms%2fnext/3.90.2)
and [typescript-eslint's peer contract](https://registry.npmjs.org/typescript-eslint/8.71.2).
Patch notes were reviewed for
[Playwright](https://github.com/microsoft/playwright/releases/tag/v1.64.1),
[Vitest](https://github.com/vitest-dev/vitest/releases/tag/v5.0.4),
[Prettier](https://github.com/prettier/prettier/releases/tag/3.9.10),
[typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/releases/tag/v8.71.2)
and [Zod](https://github.com/colinhacks/zod/releases/tag/v4.6.7).

## Upstream development-tool advisory

The full dependency audit reports
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
in `@next/eslint-plugin-next → fast-glob → micromatch → braces 3.0.3`.
The same chain/version is present in the pre-update lockfile. Upstream lists no
patched braces release; the current stable official Next lint plugin still uses
it. This development-only path processes repository-controlled glob patterns;
it is not a public application input path. Keep the official lint rules and
record the advisory rather than substituting an unreviewed fork or suppressing
audit findings. The existing CI production-dependency audit remains mandatory;
the full-audit result is disclosed separately in the verification ledger/PR.

## Verification and delivery

Follow the shared coordination freeze and the
[verification workflow](verification-workflow.md). Validate frozen installation,
dependency audit, lint/format, unit/integration tests and an isolated production
build. Review representative FR/EN/AR production journeys; full current-head CI
retains migrations/generated artifacts, all browser cases and opt-in CMS preview.
Record actual results in [validation](validation.md) and the maintenance PR before
merge. No deployment, provider, DNS, publication or visibility change is included.

Local evidence: strict/frozen installation, production dependency audit, full
lint/format, 173 unit tests, 32 PostgreSQL 17.11 integration tests, isolated
production build/TypeScript and 50 targeted browser cases pass. Dockerfile check
has no warnings; FR and AR mobile captures were inspected. The full dependency
audit finding above remains visible. Full CI remains the final PR merge gate.
