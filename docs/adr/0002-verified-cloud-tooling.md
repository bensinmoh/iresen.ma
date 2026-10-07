# ADR 0002: compatible cloud tooling without weakening verification

Date: 2026-10-07. Status: accepted for the development foundation.

`next-intl` 4.14.9 declares `@swc/core ~1.16.0`. Recent SWC compressed carriers reject the cloud sandbox's mapped root ownership before materializing their verified native image. Moving the cache does not correct that ancestry.

Pin only next-intl's SWC dependency to stable **1.16.2**, inside the declared compatibility range. This version ships the original native addon. Its official npm SHA-512 integrity was checked, the native target and TypeScript transform were tested in this sandbox, and next-intl's extraction plugin was exercised successfully. Keep the pin and lockfile reviewed together. Revisit it when the carrier/runtime compatibility issue is resolved. No TLS, artifact integrity or cache trust checks are disabled.

Use ESLint 10 with the official Next.js rule plugin, typescript-eslint and React Hooks rules. The older `eslint-config-next` aggregate currently depends on plugins whose peers exclude ESLint 10. Avoid introducing that mismatch or disabling strict peer checks. Browser accessibility checks complement the source lint rules.

pnpm 11 settings live in `pnpm-workspace.yaml`; package scripts never silently refresh dependencies. Project-local ignored caches keep development commands within writable locations. `scripts/run.mjs` loads private local configuration, preserves injected environment values and forwards the child's exit status.

CI action pins were reviewed on 2026-10-07 against stable tags in the official repositories using read-only `git ls-remote --tags`. Pin the commit rather than a movable version tag; the annotated pnpm tag is resolved to its peeled commit.

| Action               | Stable release | Reviewed commit and runtime manifest                                                                                                         |
| -------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `actions/checkout`   | 7.0.1          | [`3d3c42e5aac5ba805825da76410c181273ba90b1`](https://github.com/actions/checkout/blob/3d3c42e5aac5ba805825da76410c181273ba90b1/action.yml)   |
| `actions/setup-node` | 7.0.0          | [`820762786026740c76f36085b0efc47a31fe5020`](https://github.com/actions/setup-node/blob/820762786026740c76f36085b0efc47a31fe5020/action.yml) |
| `pnpm/action-setup`  | 6.1.0          | [`ea17c68df8912ef543352723c149a84f56e3d413`](https://github.com/pnpm/action-setup/blob/ea17c68df8912ef543352723c149a84f56e3d413/action.yml)  |

All three manifests use the Node.js 24 action runtime, supported by the GitHub-hosted `ubuntu-latest` runner. Application Node.js remains pinned to 24.19.0 through `.nvmrc`. The [pnpm action documentation at the reviewed commit](https://github.com/pnpm/action-setup/blob/ea17c68df8912ef543352723c149a84f56e3d413/README.md) explicitly supports pnpm 11; its installer verifies the bootstrap installation with a committed npm lockfile and selects the requested 11.19.0 before setup-node resolves the pnpm cache. Dependabot already tracks `github-actions` updates monthly; review future commit changes together with their release notes and compatibility.
