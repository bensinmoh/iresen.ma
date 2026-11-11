# Security and stack review — 11 November 2026

The owner requests a security review, sensitive fixes and compatible stack/dependency
updates. Work uses the existing shared checkout and preserves the concurrent
news/governance changes. No deployment, DNS, visibility change or transfer of local
accounts/data is commissioned. No CMS editorial draft or content publication is
needed for these code/configuration changes.

## Security findings and changes

- **Framework/CMS security maintenance:** update Next from 16.4.3 to 16.4.6 and
  all four Payload packages from 3.92.1 to 3.93.0. The
  [Next November security release](https://nextjs.org/blog/november-2026-security-release)
  fixes conditional cache disclosure/poisoning, response framing, Edge cookie
  exposure and image-format rejection issues in 16.4.5; 16.4.6 includes those
  fixes. Not every advisory configuration is used by this application. The
  [Payload release](https://github.com/payloadcms/payload/releases/tag/v3.93.0)
  fixes access validation, upload URL restrictions and stored HTML conversion,
  among other changes. The existing `pasteURL: false`, access and locale gates
  remain in place.
- **Production CMS origin trust:** the old write check derived its entire allowed
  origin from request Host. A matching attacker-selected Host/Origin was accepted
  if the upstream server forwarded it. Production now requires the configured
  `NEXT_PUBLIC_SITE_URL` origin and matching authority, rejecting absent/invalid
  configuration. TLS termination may use HTTP internally without trusting
  forwarding headers. Development loopback behavior remains available. Regression
  cases cover hostile hosts, scheme mismatch, missing configuration and TLS
  termination. This is an origin-trust hardening; no authenticated compromise was
  demonstrated against a live deployment.
- **Administrative HTML protection:** `/admin` HTML previously returned before
  the public nonce CSP was applied. It now receives a fresh nonce, script policy,
  no external framing/object embedding and private/no-store. API responses retain
  their own policies, including private PDF preview framing. A production browser
  case checks unpredictable administrative nonces; existing CMS journeys exercise
  hydration and interactions under the policy.

The explicitly authorized authenticated workspace documented in the
[19 October deployment update](deployment.md#authenticated-cms-deployment--19-october-2026)
is retained. Native administrative APIs stay closed in public release; custom
workspace APIs still require server-side staff authentication, roles and write
origin checks. Historical local-only documentation does not describe that later
workspace authorization.

Reviewed boundaries also include parameterized search/workspace SQL, public-only
Payload queries with access enforcement and no translation fallback, published
media byte checks without staff tokens, private recruitment documents, bounded
request bodies/PDF rendering, source-controlled asset paths, image optimizer
allowlists, first-admin bootstrap, role changes, cookies and tracked secret-file
exclusions. This is a scoped source/dependency review and local regression work,
not a live penetration test or compliance certification.

## Compatible versions

| Component                               | Before  | Selected |
| --------------------------------------- | ------- | -------- |
| Node.js                                 | 24.22.2 | 24.22.2  |
| pnpm                                    | 11.28.9 | 11.28.11 |
| Next / official lint plugin             | 16.4.3  | 16.4.6   |
| Payload / official adapters             | 3.92.1  | 3.93.0   |
| GraphQL                                 | 16.14.2 | 16.15.0  |
| Tailwind / PostCSS adapter              | 4.3.3   | 4.3.5    |
| Playwright / core                       | 1.64.1  | 1.65.0   |
| Vitest                                  | 5.0.5   | 5.1.0    |
| typescript-eslint                       | 8.72.1  | 8.72.2   |
| Sass override                           | 1.107.1 | 1.108.1  |
| undici override, 7 line                 | 7.30.1  | 7.30.2   |
| minimatch override for 10.2.6 consumers | 11.0.3  | 11.0.5   |
| next-intl SWC override                  | 1.16.21 | 1.16.22  |

Registry metadata was checked for every direct dependency and retained override.
Exact pins, strict engines/peers, native-build allowlist and the strict 24-hour
release delay are preserved. Newly published next-intl 4.15.0, Sass 1.108.2 and
minimatch 11.0.6/11.0.7 are not selected inside that delay. React 19.3.1 remains
current. TypeScript 7 and GraphQL 17 remain outside the current peer contracts;
TypeScript 6 and GraphQL 16 are retained. No Node 26/pnpm 12 or PostgreSQL major
migration is introduced. Container, package-manager and CI pins remain aligned.
The Node container's refreshed multi-platform digest is
`01d566e8d94d8c619591d78652babfccd3c6992a3dffa9ed5ab39e11cf6c70e9`;
both stages use it. CI uses pnpm/action-setup 6.1.1 at its verified commit
`73e46992e05b19abd31f2f3c20e0e7370d762115`; checkout/setup-node already match
their latest stable releases. Dockerfile validation passes without warnings.

The official Node distribution index still lists 24.22.2 as the latest 24 release
at review time. The announced
[11 November Node security release](https://nodejs.org/en/blog/vulnerability/november-2026-security-releases?trk=public_post_comment-text)
was not yet available in that index. This remains a follow-up when the actual
patched release and verified image digest are published; no invented version or
unreleased container is pinned. PostgreSQL 17.11 remains the configured supported
minor release; the owner's populated database is not restarted or migrated.

## Dependency advisory boundary

The initial complete registry audit reports one low `deepmerge` advisory,
[GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4), without a
published patched version. Its
[upstream discussion](https://github.com/TehShrike/deepmerge/issues/273)
reports a CNA rejection, but the npm audit feed still flags 4.3.1 at review time.
No advisory ignore, risk acceptance, downgrade or CI bypass is added. Both final
complete and production-only audits still report this single low advisory and
zero moderate/high/critical findings. The existing audit gate remains blocking.

## Verification ledger

Validation uses Node 24.22.2 and pnpm 11.28.11. The task's disposable PostgreSQL
database, uploads, browser output and production build are isolated under
`.local/security-stack-20261111` and `.local/security-review-20261111`, with
browser port 3197. Never point integration tests at the owner's populated database.
The shared-checkout readiness/freeze gate precedes application suites and builds.

| Check                                                    | Status                                                                                                |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Registry release ages, engines and peer contracts        | Reviewed                                                                                              |
| Install and frozen-lockfile repeat                       | Passed, no policy exceptions                                                                          |
| Complete and production dependency audit                 | One low deepmerge advisory; merge gate blocked                                                        |
| Formatting / lint                                        | Passed; final documentation formatting rechecked                                                      |
| Generated CMS types/import map and disposable migrations | Passed; generated tracked artifacts unchanged                                                         |
| Unit / integration regressions                           | 283 units and 32 disposable-database integrations passed                                              |
| Isolated production build / TypeScript                   | Passed                                                                                                |
| Production public and local CMS browser journeys         | 356 public and 13 CMS scenarios validated; 5 existing source-data guards                              |
| Current-head PR CI                                       | [PR #133](https://github.com/bensinmoh/iresen.ma/pull/133) tracks exact-head CI; audit gate mandatory |

Remaining operational checks belong to the actual deployment: TLS/HSTS and origin
proxy enforcement, edge quotas, private CMS MFA/SSO, storage permissions, malware
scanning, encrypted backups/recovery and incident ownership. No production host
or provider configuration was tested or changed by this review. Source guards,
HTTP-only cookies and a clean dependency audit alone do not establish those controls.

Initial production typechecking found two TS18046 errors in the concurrent
`scripts/sync-imane-role.ts` synchronizer. Its author corrected the string
narrowing in a new coordinated hold, with targeted type/lint/format checks and
without running the synchronizer or changing CMS data. This script-only correction does not invalidate the passed application
unit/integration suites; the successful production build rechecked its types.

The completed public browser run has 355 passes, 18 guarded skips and one stale
exact-label assertion: the Imane role check still expected the former title, while
the page correctly displayed the owner's newer title. Its owner aligned only
that exact expectation; the corrected case passed on the same artifact. Thirteen
CMS cases are enabled separately, and five existing source-data guards remain.
The temporary isolated-build TypeScript include paths are restored before the
next freeze; generated CMS types/import map remain unchanged.

Public-workspace HTTP probes on the same production artifact pass: administrative
HTML has unique nonce CSP and no framing; private session/content/recruitment/
document requests require authentication; native users and the legacy preview
remain 404. Matching forged Host/Origin and foreign origins are rejected with 403;
the configured origin reaches authentication and rejects nonexistent credentials
with 401. The probe uses raw HTTP for the Host test and the build-time configured
origin, preserving Next's public environment semantics. No real account/content
is created or changed by these probes.

The local CMS run passes all 13 enabled cases, including the new nonce/framing
assertions and existing authoring/upload/mobile/accessibility journeys. Its inverse
public-closure case is skipped only in this enabled mode and passed in the public
run. Aggregate coverage is 356 public plus 13 CMS scenarios; the five existing
source-data-dependent guards are unchanged. No assertion values other than the
owner-corrected Imane title, skip conditions, retries or CI checks were weakened.
Representative French desktop, English mobile and Arabic mobile production
captures were inspected. Browser coverage is Chromium, not cross-browser proof.

Local runtime evidence covers the frozen shared snapshot including completed
concurrent news and Imane edits. Those unrelated sources, their synchronizer and
the matching title-test correction remain outside this security/dependency commit.
The final report-only round and restoration of temporary generated TypeScript
include paths do not alter the tested runtime. The exact committed PR head still
requires its own full CI; the low registry advisory continues to prevent merge.

Cleanup removed only this task's recorded regression database, temporary
PostgreSQL container and random connection credentials. The owner's database,
backups, existing review builds and other workstreams remain intact.

## Later owner-requested deepmerge resolution

The owner subsequently commissions the [deepmerge code remediation](deepmerge-remediation-2026-11-11.md).
Its narrowly scoped, explicitly maintained local compatibility fork supersedes
the dependency blocker above once its own audit, regression and exact-head CI
evidence passes. Earlier failed audit/CI entries remain historical evidence.
