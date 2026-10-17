# CMS delete policy — 16 October 2026

Owner request: every CMS entry deletion must show its impacts before confirmation.
This applies to the common entry actions in lists and saved-entry editors.

## Policy

- Only administrators can delete. This is a recoverable move to the Corbeille,
  never a permanent purge and never a cascade into related records or files.
- The authenticated server analyzes the saved record, all FR/EN/AR variants,
  draft and validated relationship fields, explicit embedded media paths and
  associated recruitment applications. Native news hero-image and call-document
  uploads are also checked in draft/published state in every locale, with pagination.
- The popup lists incoming dependencies by title/module/field, outgoing records
  that will be retained, affected languages and the withdrawal/restoration behavior.
  Candidate counts are shown without disclosing candidate identities or CVs.
- An article currently À la une must be replaced before deletion, preserving the
  unique selected article. Incoming references block deletion until those links are removed. Offers with
  applications cannot be deleted; close the offer while preserving the dossiers.
  Account management retains its separate boundary.
- Confirmation remains disabled while analysis loads, fails or reports a blocker.
  Cancel/close makes no changes. An explicit refresh retries the analysis.
- The confirmed impact is fingerprinted with the saved entry and workspace revision.
  The server recomputes dependencies inside the deletion transaction. A missing or
  changed fingerprint/revision is rejected; a stale popup cannot authorize deletion.
  Existing native-source revision checks remain enforced.
- Confirmed impacts are recorded in the private audit event. The record, files and
  history remain recoverable; restoration is a private draft requiring validation.

The policy covers structured CMS dependencies and explicit embedded paths. It does
not crawl external sites or infer relationships from ordinary prose. Structural
page templates and existing static files remain present, including their URLs;
withdrawing a CMS record is not a static-file purge or automatic page deletion.

## Verification ledger

Development browser checks opened/cancelled real news/media previews. The Ayoub HIRT
entry correctly reports its direction's responsible-person dependency and disables
confirmation. Mobile at 390px shows a 356px dialog and no document overflow. No
owner record was deleted or changed during these checks. Scoped ESLint, TypeScript,
Prettier and whitespace checks pass. Unit regressions cover stale/missing preview,
unchanged confirmation, approved-translation relations, embedded paths, native
upload states/locales and application blocking; browser assertions check the impact
headings and confirmation readiness. Their execution, full suites, build and CI
remain queued under the shared-checkout hold; this is not production-build evidence.
