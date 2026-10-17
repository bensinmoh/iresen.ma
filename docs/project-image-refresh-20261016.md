# Project image refresh — 16 October 2026

The owner's final clarification commissions replacement of **all 70 project
images**. This supersedes the initial interpretation that six images should be
left unchanged. Sixty-four images are new compositions from scratch, based on the
projects' sourced subjects/descriptions. Six are recreations using their existing
images as visual references: TahalaGrid (`tahalagrid`), HYBRID-BATH (`hybridbath`),
Frigo Solaire (`frigo-solaire`), CSP Ait Baha (`csp-ait-baha`), CHAMS (`chams`), and
AquaSolar (`aquasolar`). All six source images were inspected before editing.
Earlier unused drafts are not integrated.

## Delivered assets and provenance

Built-in ImageGen generated one image per project. The series uses realistic
scientific editorial imagery, clear daylight, pale mineral surfaces, restrained
natural blues and readable central subjects. The six recreations retain their
recognizable equipment/settings. Other images are conceptual representations;
they do not establish delivered prototypes, actual facilities or research results.
Missing descriptions remain missing in the database; broad themes receive broad
conceptual visuals. No generated-image badge or caption is introduced.

All 70 selected PNG originals are copied into the workspace under
`.local/projects/image-refresh-20261016/{reference}/generated.png`. The original
served images are saved as `before.webp` in those same folders. The final WebPs
are served through the existing guarded URLs from
`.local/projects/assets/{reference}/image.webp`. All are 1200 × 675 pixels; total
size is **7,276,102 bytes**, and the largest is **190,998 bytes**.
[The current audit](project-image-refresh-20261016.json) records every final prompt,
generation mode, source/input/output SHA-256 hashes, dimensions, files and URL.
The earlier [eleven-illustration audit](project-illustrations.json) is historical;
its served hashes are superseded by the current audit, while its originals remain.

`scripts/refresh-project-images.ts` validates the 70-reference inventory, the six
reference-image exceptions, source hashes and all generated inputs before preparing
WebPs. Without `--apply`, it only prepares local review files. With `--apply`, it
stages all replacements, swaps individual files by rename, updates the private
derivative manifest and writes the current audit. On an application failure it
restores swapped assets and the derivative manifest from the saved originals.
It does not write CMS records, translations, approvals, search eligibility or PDFs.

The 70 existing image URLs remain stable and retain the same access checks. Image
alternative text now uses a localized subject where curated, or the localized
project title otherwise. Internal prompts/provenance are not public search content.
Search uses the existing project-media projection, stable IDs and localized gates;
its local index was rebuilt after replacement.

## Verification and limits

All 70 final outputs were visually reviewed for subject, framing and series
coherence. Direct route checks return all 70 French files with matching hashes
and `private, no-store`; all 70 hashes differ from the previous served images.
Unapproved EN/AR and withdrawn M.S.F return 404 in public-release mode. Explicit
isolated local review permits EN/AR. All 57 legacy portraits and M.S.F's private
image remain byte-identical (58 unrelated assets). All 210 project PDF bytes and
current content revisions remain unchanged. Search contains 70 French image
references and no unapproved EN/AR project entries.

Development-browser review covers card/detail image loading and descriptive
alternative text for PINREMAT FR at 1440px, RESTART EN at 768px and STDSCWG AR at
390px. It also covers all six source recreations in their detail panels: AquaSolar,
CHAMS and CSP Ait Baha in FR at 1440px; Frigo Solaire, HYBRID-BATH and TahalaGrid in
AR at 390px. No horizontal page overflow is measured. Representative rendered
screenshots were inspected, including desktop cards and Arabic mobile details.
Private evidence is under `.local/projects/image-refresh-20261016/`.

Scoped ESLint, formatting and whitespace checks pass. Full tests, production
build, current-head CI and Git completion remain deferred to the shared-checkout
coordinator. No deployment, visibility change or translation approval is included.
