# Shared-checkout chat coordination

Owner request, 15 October 2026: coordinate all chats editing this checkout and
wait for their modifications to finish before tests, CI or merge.

The coordinator is local and cooperative. It does not discover running chats or
send messages, and cannot stop a chat from editing files or pushing directly.
The app's cross-thread listing failed during setup. Existing chats must read this
protocol at their next opportunity; no acknowledgement is inferred from inactivity.

## Every editing chat

Before any further edit, inspect `node scripts/coordinate-work.mjs status`.
Use a stable ID (for example `projects`, `calls`, `governance`, `mobile`) and run:

```sh
node scripts/coordinate-work.mjs join projects "Project catalogue, CMS and translations"
```

Reserve ownership of shared files in the note, inspect their current diff before
editing, and preserve concurrent changes. Overlapping owners must agree on a
single writer. Never stage, revert, commit or clean another chat's work. No push,
CI dispatch, full tests, production build or merge during `hold`.
Lightweight formatting/lint and development previews remain available.
Once all your requested edits and documentation are complete, run:

```sh
node scripts/coordinate-work.mjs ready projects "Edits finished; no further writes"
```

Only report your own readiness. A pending reservation represents an expected
workstream whose current chat status is unconfirmed. It blocks closure until
the actual responsible chat joins and reports ready. Missing tool access is not
permission to mark another chat ready. New work requires the coordinator to
start another hold; never edit a frozen batch.

## Coordinating chat

1. Run `hold` to pause checks and reset all readiness acknowledgements. Reserve
   additional expected chats with `reserve <id> "scope"`. Do not omit a known
   writer simply because it is idle or absent from app listings.
   A pending reservation can be withdrawn only after explicit evidence that it
   is cancelled or redundant: `withdraw <id> "confirmation and reason"`. The
   registry retains that evidence. This is useful for the inherited generic
   `other-open-editing-chats` placeholder once the complete writer inventory is
   explicitly confirmed; it must not be removed just to make freeze pass.
2. Collect explicit readiness in the registry. Read `status`; reconcile overlapping
   changes and final staged/unstaged diffs with the writers before they report ready.
3. Run `freeze`. It refuses pending/editing participants and fingerprints HEAD,
   the Git index, and tracked/nonignored untracked file paths, modes and contents.
   It checks twice to detect writes during capture. Ignored runtime files,
   databases, credentials and local coordination state are outside this snapshot.
4. Run the relevant tests/build and keep the verification ledger. Local `pnpm test`,
   integration/browser tests and `pnpm build` fail while held, or if frozen inputs
   changed. Dev, lint and formatting remain available. Do not modify source after
   freeze; any generated tracked-file change also requires reconciliation.
5. Immediately before staging/committing/pushing, run `verify`. Then run `open`
   to release the completed coordination round for Git operations, commit only
   the agreed scope, and start CI on the exact final PR head. All writers must
   remain stopped through merge; `open` is not permission to start new edits.
   Follow existing branch-specific review and publication gates.
6. Any further editing requires a new `hold`, fresh acknowledgements, and affected
   checks. Failed checks are corrected in a new round; never bypass them.

```sh
node scripts/coordinate-work.mjs status
node scripts/coordinate-work.mjs freeze
node scripts/coordinate-work.mjs verify
node scripts/coordinate-work.mjs open
```

State lives in ignored `.local/orchestration/state.json`; updates use an exclusive
directory lock and atomic rename. No heartbeat timeout declares a writer finished.
Inspect a stranded lock before removing it. Do not delete/reset the state to bypass
the hold. Fresh CI checkouts have no local state and run the existing complete suite;
the workflow itself is unchanged. This does not cancel already-running GitHub jobs
or enforce a remote push/merge lock.

## Setup verification

The isolated Node tests exercise readiness refusal, freeze invalidation after edits
and staging, state preservation, and local command blocking. They use disposable
repositories, no application database and no GitHub Actions. See
`scripts/work-coordination.test.mjs`. Application checks and CI remain on hold.

Setup ledger: ten isolated coordinator tests, targeted ESLint, changed-file
Prettier and whitespace checks. The available host Node is 24.21.0; this is not
evidence for the application suite on the pinned 24.19.0 runtime. The inherited
PR/run identifiers are preserved as historical state, not reverified GitHub status.
