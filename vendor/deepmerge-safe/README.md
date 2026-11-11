# Hardened deepmerge compatibility fork

Private, locally maintained fork of TehShrike/deepmerge 4.3.1 (MIT).
The original authorship/license is retained in LICENSE. This is a modified
implementation, not an upstream release or a version-only audit workaround.

Payload 3.93.0 remains the sole overridden consumer. Its default export and
merge/array/custom-clone options retain the upstream API. The implementation
rejects `__proto__` keys in both target and source loops regardless of target
shape and creates ordinary own data properties with `Object.defineProperty`.
This prevents the returned-object prototype reassignment described in
[GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4).
No mutation of Object.prototype, caller inputs or caller options beyond the
upstream documented helper setup is introduced. Ordinary constructor/prototype
fields retain upstream handling; no broad content-key ban is added.

Provenance: npm deepmerge@4.3.1, dist/cjs.js and index.d.ts, published 2023-03-16.
Original npm integrity:
`sha512-3sUqbMEc77XqpdNO7FRyRog+eW3ph+GYCbj+rK+uYyRMuwsVy0rMiVtPn+QJlKFvWP/1PYpapqYn0Me2knFn+A==`.
Original dist/cjs.js SHA-256: `2e5160f84a1141bd927264afe4d15766f1e6cf07daef182b37ff53fea121de7d`.
Types and license are byte-identical to that distribution. Only the runtime
property checks/writes above differ, apart from repository formatting.

This package has no dependencies or installation scripts. The repository owns
maintenance of the fork. Keep the override narrow and run the security/API
regressions against Payload's actual resolved dependency. When Payload replaces
the dependency or a verified upstream security fix becomes available, remove
this fork and override together after the same compatibility/security checks.
A clean registry audit is not proof that local code is secure: explicit exploit
regressions and CMS integration/production checks are required.
