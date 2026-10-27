# Remaining media review resolution — 27 October 2026

The owner requested resolution of the dashboard’s remaining 31 media reviews,
including their causes rather than a cosmetic counter reset. The queue contained
62 EN/AR variants across 31 retained media records. Strict validation blocked them
because shared credit/source and usage fields had never been imported.

## Correction

[Source metadata](../src/data/retained-media-review-metadata.json) identifies the
24 photographs and seven IRESEN YouTube links. Photograph paths and SHA-256 hashes
were checked against the existing provenance registry and actual public bytes.
Existing placement manifests document owner-commissioned usage; the credit records
the supplied IRESEN collection and source trace without inventing a photographer.
Usage is restricted to commissioned site placements. YouTube records describe
links to the recorded IRESEN channel, without granting download/redistribution
rights. No open licence is asserted. The withdrawn Oculus photograph remains
private and its restriction explicitly forbids republication.

The retained-content importer now includes this metadata for matching stable
identities and paths, including the French snapshot. It leaves editorial review
states under the existing workflow and does not restore withdrawn gallery items.

[The local correction command](../scripts/resolve-retained-media-reviews.ts) has
a read-only default; `--apply` performs the owner-requested review resolution.
It locks the workspace, validates all three locales using the existing strict
validator, verifies paths/hashes, preserves nonempty editorial metadata, refuses
drafts/native sources/changed identities, and saves private before-state backups,
locale revisions and audit records. Visibility and source text are preserved.
Run through `node scripts/run.mjs tsx scripts/resolve-retained-media-reviews.ts`.

## Verification ledger

- Pinned Node 24.22.1; strict dry run: 31 matching, 31 correctable records.
- Local transaction applied; active review queue: **0**.
- Repeat dry run: 31 matching, **0 updates**, queue still **0**.
- Import audit: 30 currently active retained identities carry source metadata,
  pass strict FR/EN/AR validation and retain metadata in their French snapshots.
  The other corrected record is the withdrawn private Oculus item.
- Local search rebuild: 285 public CMS records; static catalog synchronized
  through existing publication/visibility gates.
- Scoped ESLint, changed-file formatting and whitespace checks pass.
- The existing Chrome dashboard was refreshed. Native screen capture returned a
  uniform surface and its accessibility tree omitted web content, so visual
  confirmation of the rendered number is not claimed; the actual database query
  used the dashboard’s active-record/review predicate and returned zero.
- Full tests/build/CI/commit/merge remain held by shared-checkout coordination;
  other editing/pending workstreams must finish first. No deployment occurred.

## Final integration validation

27 October 2026: strict validation now constructs a complete typed authoring entry
before overlaying the database fields. The isolated production build including
TypeScript, all 282 unit tests and targeted ESLint pass. A repeat read-only local
correction run matches 31 records, proposes zero updates and confirms zero pending
reviews. Full disposable-database integration and site browser coverage run in
the final PR CI; the owner's populated local database is not used for fixtures.
