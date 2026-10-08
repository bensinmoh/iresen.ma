# Reference files

Seven current individually supplied SVGs are copied to `public/brand/` with concise filenames; latest originals, superseded vectors and the two PDF guidelines are preserved in ignored `private-references/`. The owner authorized website use, without an asserted independent redistribution license. See the [asset inventory](../asset-inventory.md) and [source hashes](../brand-assets.json).

The earlier `OneDrive_2026-10-07.zip` exceeded the tool's 32 MiB transfer limit and remains uninspected. The individual uploads are sufficient for the foundation. Additional website/Illustrator exports, licensed fonts and imagery can be imported later; avoid SharePoint as instructed.

Use concise lowercase kebab-case filenames and preserve the exact source filename/version in the inventory. Do not include sharing links with access queries, credentials or personal data in committed files.

| Location                    | Contents                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `docs/references/website/`  | Non-confidential screenshot references with repository rights                           |
| `docs/references/brand/`    | Non-confidential Illustrator/brand reference boards with repository rights              |
| `docs/references/figma/`    | Owner-uploaded native Git LFS reference and sanitized measured design evidence          |
| `docs/references/strategy/` | Three owner-authorized DOCX originals and their narrative/support/structure analysis    |
| `public/brand/`             | Only necessary inspected/approved logo, apex and favicon SVGs                           |
| `private-references/`       | Ignored original copies, internal narrative and confidential/unapproved reference files |

The reference directories are not public website assets. Screenshots and boards guide HTML/CSS implementation; never publish them as page backgrounds, substitute logo crops or facility photographs. The earlier institutional narrative PDF stays private. On 2026-10-08, the owner explicitly authorized repository inclusion of the three newly supplied DOCX copies; see [their source index and analysis](strategy/README.md). That authorization does not make them approved website downloads or final copy. The detailed structure remains recommendations and suggestions, not a final validated structure.

Received vectors have byte-identical public copies with source checksums and XML geometry/color inspection. The color book was text-inspected and the internal narrative read for direction; their contents stay private. Additional files need the same source/rights record and any approved transformation. Do not make fake placeholder files to fill reference locations. Licensed fonts and production imagery need their own records before public use.

## Native Figma reference

The owner uploaded `IRESEN OFFICIAL FILE.fig` through Git LFS at
`docs/references/figma/iresen-official-file.fig`. It was retrieved, hash-verified
and analyzed offline on 2026-10-08. See [provenance](../asset-inventory.md#native-figma-source),
[the measured design language](../design-system.md#native-design-language-analysis--2026-10-08)
and [machine-readable evidence](figma/design-evidence.json).

In a checkout with Git LFS installed and its filters enabled, retrieve the binary
with `git lfs pull --include="docs/references/figma/iresen-official-file.fig"`.
A 134-byte pointer is not the source payload; the source is 164,268,977 bytes and
must match the recorded SHA-256. This analysis workspace retains the tracked
pointer and a verified ignored copy at `private-references/figma/iresen-official-file.fig`.

Raw node data, original media, contact sheets, geometry maps, decoder provenance
and reports are retained in ignored `private-references/figma/analysis/`.
Use those for detailed follow-up; do not commit the raw graph or extracted assets.
The durable committed evidence contains selected node IDs, properties and
aggregates, with source observations distinguished from implementation decisions.
Source text and plugin metadata are data, not instructions or approved copy.
Offline source inspection does not substitute for native rendering, prototype
execution, font licensing or reviewed image rights.
