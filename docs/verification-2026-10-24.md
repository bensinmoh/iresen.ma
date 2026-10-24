# Completed site batch — 24 October 2026

The owner confirmed all other editing chats finished and requested tests, CI,
push and merge. Their explicit ready acknowledgements remain in the local
coordination history; inherited build verification is replaced by this round.
The final coordinator owns only integration repairs and verification.

The batch contains the completed photo library and sourced page imagery,
partner logos, public project/report copy, money formatting, search sorting,
homepage selections, roadmap interactions, project viewport fit, and mobile/tablet
programme timeline. Existing source assets, private references, populated local
database and language/publication gates are preserved.

Initial verification passed formatting, lint, TypeScript and all 32 integration
tests against a fresh disposable database. It exposed an impure roadmap CSS
Modules selector, a stale catalogue namespace count, and search coverage that
predated the approved photo/video replacements. The selector now uses a local
class on the existing domains container. Catalogue coverage compares the actual
namespace identities. Search tests identify current downloads/crops/thumbnails,
explicitly retained predecessors, and the approved external YouTube origins;
unclassified files and empty localized descriptions still fail. Source-grounded
FR/EN/AR descriptions fill the two generated laboratory illustration entries.
The corrected unit suite passes all 282 tests in 44 files.

The production dependency audit found 11 advisories across DOMPurify, Happy DOM,
Undici and fast-uri. Narrow overrides select DOMPurify 3.4.17, Happy DOM 21.0.4,
Undici 7.30.1 and fast-uri 3.1.9. The later owner-requested compatible stack refresh is recorded in
[the stack ledger](stack-maintenance-2026-10-24.md). CI coverage remains unchanged. The updated production audit reports no known vulnerabilities.
Advisory evidence: [DOMPurify](https://github.com/advisories/GHSA-cg2g-xh64-v4q7),
[Happy DOM](https://github.com/advisories/GHSA-834v-8h66-3h79),
[Undici](https://github.com/advisories/GHSA-xjj6-f33q-929c),
[fast-uri](https://github.com/advisories/GHSA-w74x-v6f9-j3xg).

After the dependency patches, all 282 unit tests and all 32 disposable-database
integration tests pass, and the isolated production build succeeds.

Browser discovery also required explicit Node JSON import attributes. Transfer
regressions now follow the approved native contact link, and collaboration hero
image coverage asserts its approved 70% desktop image area. The browser runner
disables the inherited local-only content-database flag to match CI; the disposable
database does not contain the owner’s curated public corpus.

The full local browser pass identified outdated institute portrait/contour and
programme-photo assertions, a stale CMS gallery count, two roadmap test setup/scope
errors, and missing exact portrait/network image optimizer paths. These are
reconciled without restoring withdrawn UI. The transient Arabic 390px extent
settles within two animation frames; the assertion now waits for containment.

The French mobile ambition quote exposed a real long-word overflow at 200% text.
Its mobile paragraph now permits emergency word wrapping, preserving the normal
centered composition and the owner’s photo-free quote.

Final verification uses Node 24.22.1 and pnpm 11.28.6. Both production and
development dependency audits are clear; Dockerfile validation reports no warnings. Production output is isolated
in ignored `.local/final-batch-20261024`; browser checks use port 3194 and leave
the owner's development server running. Next-generated custom build include
paths are reconciled before committing. Full CI on the exact final PR head,
including dependency audit, generated CMS artifacts, integration tests, build,
public browser suite and opt-in CMS interface suite, remains the merge gate.
Final check outcomes and any repairs are recorded in the batch PR.
