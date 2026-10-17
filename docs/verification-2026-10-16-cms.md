# CMS and sourced catalogue finalization — 16 October 2026

The owner requests tests, current-head CI and merge of the current shared CMS,
projects and expert-network-contract changes. This is a new batch after PR #122,
which is already merged at `9e2b2e07ca89e3f882bb199257bb75bfd09b2eab`.
The seven historical reservations were archived with that merge evidence and the
Editorial chat's explicit completion report; no current writer was marked ready
on another writer's behalf.

## Environment and isolation

- Node **24.22.0**, pnpm **11.28.2**, using the retained local runtime.
- Disposable PostgreSQL 17.11 container `iresen-cms-ci-20261016`, loopback port
  **5545**, database `iresen_cms_ci`. Tests never target the populated owner
  database on port 5433. No owner accounts, passwords, applicants, uploads or
  project assets are copied to this test database.
- Logs, temporary runtime environment and production-review configuration live
  under ignored `.local/cms-finalization/`. Production review will use an isolated
  source/build copy on loopback port 3101, preserving the running development app.

## Findings and corrections

1. The Payload CLI could not migrate or generate types because its search indexer
   transitively imported an RSC-only marker. The common public projection helpers
   now support both Node/Payload CLI and Next server use, like the existing search
   indexer. Their native PostgreSQL dependency stays outside browser bundles;
   authorization, approved-snapshot projection and private-table exclusions are
   unchanged. All migrations then succeeded on the fresh disposable database.
2. The connected CMS browser suite requires `CMS_WORKSPACE_ENABLED=true` as well
   as the two existing local-review flags. The CI review step now enables it, so
   the authenticated-shell cases are exercised instead of being skipped.
3. First full unit run: **233 passed, 2 failed**. One assertion still expected the
   old simulated-reception label; it now expects the actual `Dossier créé` audit
   action. The other expected a raw null author inside a string-based form field.
   It now checks the empty input while separately asserting the unchanged original
   source JSON. Bibliographic authors are optional when unavailable, with explicit
   guidance to preserve only source-attested authors rather than invent them.

## Check ledger

Entry-action follow-up: recoverable deletion, draft/review actions and administrator
trash restoration added across normal/special lists and saved editors. Additive
trash migration applied successfully, with no entry removed. Browser opened and
cancelled the list deletion and editor review dialogs, verified all three editor
actions and the empty trash. Source refresh tombstones, read-only public snapshot
exclusion, role/revision/source-revision checks, inbound relations/application
guards, before-state history and private-draft restore are implemented. Scoped
ESLint/formatting/whitespace and full TypeScript pass (the other workstream fixed
its earlier renderer diagnostic). Unit regressions and isolated UI regression were
added but cannot run until the shared coordination freeze. This verification does
not claim a real delete/restore test on the owner's populated database. Proof:
`/private/tmp/cms-editor-entry-actions.png`.

External-service follow-up: Google Analytics replaces Matomo and AI classification;
LinkedIn remains. Dashboard service count now derives from the shared registry
(**2**) and its audience notice names Google Analytics. Authenticated browser
confirmed both cards, the Google preparation disclosure, the count and dashboard
notice. Scoped ESLint/Prettier/whitespace pass. This is a configuration/UI choice;
Google Analytics remains unconnected and no tracking or external requests were added.
Proof: `/private/tmp/cms-google-analytics-integration.png`.

Private profile portraits: five built-in imagegen outputs inspected and retained
in ignored workspace storage. Four headshots have harmonized institutional-blue
backgrounds; the fifth uses five selected references from six supplied photos for
AI-assisted reconstruction. Owner input images remain unchanged. The additive
avatar-table migration ran successfully on the local database; five owner-mapped
512px WebP files are stored with provenance, checksums and private backups/audits.
SQL confirms five accounts remain four administrators plus one editor. The explicit
owner email correction preserved the existing ID, role, salt and password hash.
Browser confirms the current profile name and 44px image render from authenticated
512px bytes. An anonymous live HTTP request receives **401**, private/no-store.
Scoped ESLint/formatting/whitespace pass; no avatar-related TypeScript diagnostics
remain (the unrelated project-renderer timeout option still blocks full typecheck).
Own-account isolation/authentication/cache/404 unit regressions added; execution
awaits the existing shared freeze. No personal portraits or account mappings enter
public assets/search or committed source.

Account-header follow-up: removed the green session banner and role select; actual
account identity/role now precede the circular avatar, which opens a logout disclosure.
Development browser verified open/close, outside click, Escape focus restoration,
and unsaved-edit logout cancellation. The temporary field edit was restored without
any save/database mutation. At 1280/820/390/320 pixels: 44px avatar, identity to its
left, menu inside viewport and no horizontal overflow. Scoped formatting/ESLint
and whitespace pass; TypeScript retains only the unrelated project-PDF timeout
option error. Isolated browser regression covers the new header, disclosure and
session DELETE/login return; full execution remains pending coordinated freeze.
Proof: `/private/tmp/cms-account-avatar-menu.png`.

Owner-requested baseline approval follow-up: performed a read-only audit, completed
the two sourced offers in EN/AR, then atomically approved the existing **1,847** CMS
records across FR/EN/AR. Native project/opportunity approvals passed their Payload
hooks. The unused Institute audit draft was restored only after checking its title,
body and structured content against the validated snapshot. Private rollback backup
is in ignored `.local/cms-finalization/baseline-approval-2026-10-16T22-08-15.897Z`.
SQL confirms **0 review / 0 missing language titles / 0 drafts**. All original IDs
and visibility values are unchanged (**52 private / 1,795 public**); no record was
deleted. Authenticated dashboard independently shows 5,541 validated language variants
and complete text in 1,847/1,847 records per locale. Empty draft card is hidden.
Search rebuild finished with **5,652 references**, zero queued jobs, and public native
sources show 70 projects / 2 offers per locale. Scoped formatting/ESLint/whitespace
pass; TypeScript has no follow-up diagnostics, retaining the unrelated project-renderer
timeout-option error. Full coordinated tests/CI remain pending. Screenshot:
`/private/tmp/cms-dashboard-approved-baseline.png`. No external deployment occurred.

Indicator-register follow-up: added supported collaborative projects and granted
portfolio patents with explicit dynamic definitions. Read-only PostgreSQL queries
found 70 public validated projects plus one private project, and 30 granted / 29
ungranted patent filings. The authenticated register renders **70** and **30**;
project draft changes respect the validated shared-field snapshot. Scoped ESLint,
Prettier and whitespace pass. Added regressions for snapshot/private/draft exclusion
and explicit grant flags, pending the coordinated test round. Screenshot:
`/private/tmp/cms-indicator-registry.png`. No data or publication state was changed.

Direct photo-upload follow-up: every image relation now renders a native device
file input, with private upload, authenticated preview, replace/remove association,
format/size errors and retry support. Document relations are unchanged. The shared
store retains the current workspace revision; asynchronous completion preserves
other form edits and cannot attach an upload to a different record. Payload media
URLs are normalized to same-origin paths for authenticated previews. The image
upload endpoint rejects PDF/video bytes in an image-field request.

Development UI verified for the platform photo/logo fields at 1280, 820 and 390
pixels: native file controls, keyboard navigation, no horizontal overflow, and
unsupported-file rejection before any database write. No source image or published
record was changed. Proof: `/private/tmp/cms-direct-photo-upload.png`. Scoped ESLint
and formatting pass. Added client-store upload/retry and isolated browser upload,
in-flight editing, association-save and removal regressions; execution awaits the
shared freeze, so a successful real-byte upload is not claimed by this UI check.
TypeScript currently reports an unrelated project-PDF renderer `timeout` option
incompatibility (`src/lib/project-note-renderer.ts:24`); no photo-upload diagnostics.
Full tests/build/CI/merge still require the remaining readiness acknowledgement.

Publication-sidebar correction (owner screenshot): the visibility field now uses
a bounded grid label and a full-width select with a zero intrinsic minimum; its
public option reads “Public · après validation”, with the full server-side
publication explanation retained below. Development-browser inspection at 1280,
1100, 820 and 390 CSS pixels confirms the control stays inside its panel and the
page has no horizontal overflow. Keyboard Tab reaches the next action; no record
was saved or published. Screenshot: `/private/tmp/cms-visibility-fixed.png`.
Full checks and merge remain held while the project-PDF workstream is editing.

| Check                        | Result and coverage                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| Full formatting and ESLint   | Passed before first freeze; ESLint also passed after the unit corrections            |
| Payload types/import map     | Generated successfully; no unexpected generated change                               |
| Fresh database migrations    | Passed, including the common workspace and two-role constraint                       |
| First full unit suite        | 233 passed / 2 failed; both findings corrected, rerun pending                        |
| Native integration suite     | **32 passed**, six files, disposable database; before the form/test-only corrections |
| Production build/browser/axe | Pending the next valid shared freeze                                                 |
| Remote CI and merge          | Not dispatched; require complete local checks and the exact new PR head              |

The correction round started a new hold as required by
[the coordination protocol](chat-orchestration.md). The two current other
participants (`projects-workbook-1026`, `experts-network`) require renewed
acknowledgements, or explicit owner confirmation that they are complete and their
reservations can be consolidated. An asynchronous owner question is pending.
Do not infer their readiness from an idle app status, mark them ready, bypass the
registry, or run blocked checks through another command.

No deployment, DNS/provider change or institutional content republication is
part of this finalization request. The owner's existing populated database and
private sources remain intact. Earlier PR #122 CI is historical evidence only;
it cannot satisfy current-head CI for this batch.
