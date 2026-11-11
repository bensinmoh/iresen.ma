# Payload deepmerge remediation — 11 November 2026

The owner requests resolution of the dependency that blocks PR #133, following
the [security review](security-stack-review-2026-11-11.md). The current npm release
of deepmerge remains 4.3.1 and the registry still reports
[GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4), without
a published patched release. Repeating CI on that graph fails at the existing
production audit. No ignore, lower audit threshold, downgrade or risk exception
is authorized or introduced.

## Actual code remediation

`vendor/deepmerge-safe` is a small private MIT compatibility fork named
`@iresen/deepmerge-safe@1.0.0`. It starts from the upstream 4.3.1 distributed
CommonJS implementation. The original license and type declarations are retained
byte-for-byte, with source/npm integrity and a runtime source hash recorded in
the package README. This is explicitly locally maintained code, not an upstream
release or a renamed unchanged copy.

The runtime changes are narrow:

- Reject `__proto__` as a key in both target-copy and source-merge loops,
  independently of the target's prototype, own properties or placeholder value.
- Write ordinary own enumerable/writable/configurable data properties with
  `Object.defineProperty`, avoiding the legacy prototype setter.
- Retain upstream array modes, clone/custom merge helpers, mergeability callback,
  symbols, special-object behavior and `all()`. Ordinary constructor/prototype
  data keys keep their original handling; no blanket content-key filter is added.

The pnpm override applies only to `payload@3.93.0>deepmerge`. Existing consumers
still import `deepmerge`, resolving to the explicit local fork; Payload itself
is not patched. The affected registry package disappears from the dependency
graph. The Docker dependency stage copies the local package before its frozen
install, so CI, operations and standalone delivery use the same reviewed source.
The runtime image also retains the original MIT license under `/app/licenses`.

The unchanged upstream declaration file is excluded only from application
lint/format rewriting, like other byte-preserved third-party sources. Its exact
hash and the license hash are regression checked. The modified runtime and all
new tests remain covered by normal lint and formatting. Security audits and all
CI steps stay unchanged.

## Regression evidence and maintenance

`src/tests/deepmerge-security.test.ts` resolves the dependency from Payload's
actual module context, verifies the installed bytes equal the reviewed fork,
and tests null/undefined/primitive/null-prototype placeholders, own malicious
target/source keys, nested objects/arrays and absence of returned/global
prototype pollution. It also covers array replacement/concatenation, cloning
helpers and `clone:false`, symbols, Date/RegExp/React-like objects, custom merge
and mergeability callbacks, `all()`, property descriptors and unchanged inputs.

The fork adds no dependencies, install scripts or runtime service. The repository
owns its maintenance. On a Payload upgrade, review whether this exact-version
override still applies; the resolved-identity test deliberately fails if Payload
silently returns to an unreviewed implementation. Remove fork, override and
Docker input together when a verified upstream replacement/fix passes the same
security and compatibility checks. A registry audit cannot attest to local code;
the explicit exploit/API regressions and application checks remain necessary.

| Check                                                 | Evidence                                                          |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| Source provenance, original types/license bytes       | Recorded; hashes asserted in tests                                |
| Install and offline frozen-lockfile repeat            | Passed; lockfile resolves the local fork                          |
| Complete and production dependency audits             | Both pass with zero advisories                                    |
| Lint / formatting                                     | Passed on fork/runtime tests; final docs format checked           |
| Exploit/API regressions and application unit tests    | 295 unit tests pass, including 12 resolved-fork exploit/API cases |
| Disposable PostgreSQL integrations / production build | 32 integrations pass; isolated build/TypeScript pass              |
| Production CMS/public boundary checks                 | 33 public/search/security and 13 enabled CMS scenarios pass       |
| Exact-head CI and merge                               | Required; all original checks retained                            |

Existing news/Imane work remains outside this commit, with its prior completed
writer confirmations retained. No public content, source publication state,
database schema or deployment is changed by this dependency repair.

Validation uses Node 24.22.2/pnpm 11.28.11, a separate disposable PostgreSQL 17.11
database, `.local/deepmerge-review-20261111` and loopback port 3199. The production
build includes TypeScript; its first pass identified a test-matrix generic type
annotation, corrected without changing test behavior or fork runtime. The final
build passes. Original generated CMS artifacts are unchanged; temporary isolated
TypeScript include paths are restored after checks. Dockerfile validation passes
without warnings. The public run's 13 skipped CMS cases all pass in the enabled
CMS run; its inverse public-closure check passed in the public run. Full exact-head
CI remains mandatory and is recorded on PR #133. No application test or audit step
is removed. The local fork adds a maintenance obligation, explicitly documented
in its package README.

Only the recorded task database, temporary container and random connection
credentials were removed after local checks. Owner data, private backups, runtime
dependencies and unrelated edits remain preserved.
