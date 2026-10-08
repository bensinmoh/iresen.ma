# Asset inventory

Inventory updated: 2026-10-08. Seven owner-supplied SVGs are available in `public/brand/` under concise filenames, including the latest corrected logos/apex and primary mark. Byte-identical originals and the two supplied PDF guidelines were preserved in ignored `private-references/` during prior work; those private archives are absent from the current checkout. An owner-supplied video is available in `public/videos/` for future hero implementation. The received files are sufficient for the branded foundation.

## Received assets and rights

The owner authorized website use and repository copying of the supplied assets. No independent redistribution or open-source license is asserted. SVG copies preserve source bytes, geometry and colors; no recoloring or optimization was applied. Source filenames, SHA-256 hashes, viewBoxes and fills are recorded in [brand-assets.json](brand-assets.json).

SVG XML was inspected for geometry/color metadata and contains no scripts or external references. This is source inspection, not a claim that the absent website screenshots or Illustrator boards were visually reviewed. Browser rendering is a separate application check.

| Exact source filename        | Role                         | Repository file                    | Verified fills           |
| ---------------------------- | ---------------------------- | ---------------------------------- | ------------------------ |
| `IRESEN Primary Logo.svg`    | Primary brand mark           | `public/brand/logo-primary.svg`    | `#12345A`, `#296BB4`     |
| `IRESEN Colored Logo.svg`    | Master for light surfaces    | `public/brand/logo-color.svg`      | `#12345A`, `#296BB4`     |
| `IRESEN Logo Dark Mode.svg`  | Two-color reversed mark      | `public/brand/logo-dark.svg`       | White, `#296BB4`         |
| `IRESEN Logo White.svg`      | Reversed mark                | `public/brand/logo-white.svg`      | White                    |
| `IRESEN Logo Monochrome.svg` | Supplied monochrome mark     | `public/brand/logo-monochrome.svg` | White; not navy-on-white |
| `Apex Leaf.svg`              | Selected browser icon; motif | `public/brand/apex-leaf.svg`       | `#296BB4`                |
| `Favicon.svg`                | Original favicon retained    | `public/brand/favicon.svg`         | `#296BB4`                |

Latest colored/dark wordmark viewBoxes are `0 0 696 194.9`; white/monochrome remain `0 0 695.98 194.94` (all approximately 3.57:1). The primary mark is `0 0 1262.5 508.54` (approximately 2.48:1), the apex is `0 0 177.3 287`, and the favicon is square (`0 0 508.5 508.5`). Reserve dimensions proportionally; do not redraw the wordmark as text. The prior private archive retained source filenames under `private-references/brand/` and superseded versions under its ignored `previous/` directory with hash suffixes. Verify access to that archive before inspecting originals.

The retained owner-supplied `Favicon.svg` uses `#296BB4`, matching the other blue identity assets and UI tokens. Its original source SHA-256 is `b897f8993b00234b756d9f63d2adad287ae7a22dbd4112671e462d60635dab07`. All corrected uploads were copied byte-identically; no automatic recoloring was applied.

### Active browser icon — 2026-10-08

To address the owner's request without the original favicon's canvas padding,
public Next.js metadata selects the existing `/brand/apex-leaf.svg`, with SVG type and
`sizes="any"`. Its tight `177.3 × 287` viewBox replaces the active `508.5 × 508.5`
favicon canvas while preserving the vector's proportions, `#296BB4`, transparency
and orientation. The changed URL selects the Apex Leaf separately from the old
cached favicon path.

All seven original SVGs and their [source hashes](brand-assets.json) are unchanged;
`public/brand/favicon.svg` remains available as the supplied original. This is an
active-icon selection, with no derived SVG, ICO, PWA or touch-icon asset added.
Current browser checks belong in [the validation log](validation.md).

## Hero video

Received on 2026-10-08 and added at the owner's request for future website hero use. No independent redistribution license or source credit was supplied.

| Property              | Value                                                                     |
| --------------------- | ------------------------------------------------------------------------- |
| Exact source filename | `7040278-uhd_4096_1974_30fps (2).mp4`                                     |
| Repository file       | `public/videos/hero.mp4`                                                  |
| Public asset URL      | `/videos/hero.mp4`                                                        |
| Role/status           | Future hero video; stored as a public asset, not yet referenced by a page |
| Format                | MP4; H.264 video (`yuv420p`) and AAC audio                                |
| Dimensions            | 4096 × 1974 pixels                                                        |
| Frame rate            | 30000/1001 fps (approximately 29.97 fps)                                  |
| Duration              | 18.858 seconds                                                            |
| File size             | 9,774,051 bytes (approximately 9.32 MiB)                                  |
| SHA-256               | `548d570107419bc56ba1622ee8ec4eae365ed52a2e3faee248330fc4fa6be2eb`        |
| Transformation        | Filename normalized only; copied byte-identically without transcoding     |

Container and stream metadata were inspected with `ffprobe`. The supplied file retains its audio track and its end-of-file MP4 metadata. Future hero implementation should prepare appropriately sized web derivatives with streaming metadata at the start, a lightweight poster, muted playback, a pause control and reduced-motion behavior, then measure page performance as required by the project brief. Adding the asset does not enable playback or publish a deployment.

## Development references and private guidelines

| Source                              | Role/version                                        | Status and publication boundary                                                                                                                              |
| ----------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `instruction.md`                    | Development brief v1.3, 8 October 2026              | Available; strategy/source-status updates and current design-system guidance, not a public web asset                                                         |
| `IRESEN_Color_Book_2026_V0_9.pdf`   | Color book v0.9, October 2026                       | Previously text-inspected; private archive path `private-references/brand/color-book.pdf`; absent here; not served/committed                                 |
| `IRESEN_2035_Phase_01_Narratif.pdf` | Internal institutional narrative, 30 September 2026 | Previously read as a working reference; private archive path `private-references/institutional-narrative.pdf`; absent here; contents not committed/published |

PDF SHA-256 values:

- Color book: `b91e3ddd316b79069988e6fba071ff2679d8bde733e8aae287acddd5d6a9d14d`.
- Narrative: `d346aa7f0944dc3a7ed9242eeeb101e62f22b7ebc60de00263a50ba569312ab4`.

The prior color-book v0.9 text inspection confirms navy `#12345A` and signature blue `#296BB4`. The owner's final correction selects **`#296BB4` as the website primary blue**, and all current blue-bearing SVGs match it. Earlier `#256BA2` vectors were archived privately as superseded versions. Every received PDF/SVG source was preserved unchanged. The brief's Illustrator-palette observation has not been reverified here because that board is unavailable.

The owner reattached the original color book during the live design-system review
on 2026-10-08. Its attachment bytes match the recorded SHA-256 above. The private
attachment was read as reference data; no PDF was added to the repository or public
assets. The original guide remains the website color authority.

### Institutional DOCX references — 2026-10-08

The owner authorized repository reference copies of `IRESEN_2035_Phase_01_Narratif.docx`, `IRESEN_2035_Phase_02_Supports.docx` and `IRESEN_Structure_Detaillee_Site_Web.docx`. Their byte-identical copies, sizes, SHA-256 hashes, visible dates and analysis are recorded in [the strategy reference index](references/strategy/README.md). Only filenames were normalized; these files are outside `public/` and the CMS Media collection. The earlier narrative PDF remains a separate private version.

The detailed structure is recommendations and suggestions, not final validation. Source examples, proposed copy, revision claims and implied approval are not independently verified institutional facts. Repository inclusion of these specific files neither supplies an independent redistribution license nor approves website publication, translations or service activation.

## Native Figma source

Retrieved and analyzed on 2026-10-08 after the owner uploaded the native file through Git LFS. The earlier chat attachment exceeded the transfer tool's 32 MiB limit; repository retrieval resolved access. The tracked LFS pointer remains unchanged. A byte-identical working copy and detailed raw analysis were retained under ignored `private-references/figma/` in the prior analysis workspace; those private files are absent here. Retrieve and hash-verify the native payload before repeating offline analysis.

| Property              | Verified value                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Exact source filename | `IRESEN OFFICIAL FILE.fig`                                                                                                              |
| Repository reference  | `docs/references/figma/iresen-official-file.fig`                                                                                        |
| Retrieved revision    | `37b06893f2be4825fa94f71ca691ba7871381f96`                                                                                              |
| Bytes                 | 164,268,977 (approximately 156.66 MiB)                                                                                                  |
| SHA-256 / LFS object  | `2ebebb5c633ad30094527c9ed2a5bc218b790b1f9f18fc761e191c5925b2838a`                                                                      |
| Export timestamp      | `2026-10-08T10:35:45.489Z`                                                                                                              |
| Native structure      | Figma version 106; 5 canvases; 20,689 unique node records                                                                               |
| Primary page coverage | 14 desktop pages at 1920px; 13 full mobile pages at 402px; separate design-system board                                                 |
| Embedded media        | 223 images plus archive thumbnail and one MP4; all image references resolve                                                             |
| Private working copy  | Prior workspace: `private-references/figma/iresen-official-file.fig`; absent in the current checkout                                    |
| Reference status      | Offline analysis recorded; live typography/spacing/palette screenshots reviewed; full-page rendering and prototype execution unverified |

The earlier selected [node `892:5041`](https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=892-5041) is the homepage video layer within `804:5998`. The original brief selects the desktop canvas `127:1781`; the current devlink selects the [design-system page `2211:6298`](https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=2211-6298). All three IDs are present in the recovered source. The embedded video matches the existing hero asset byte-for-byte. No dedicated Arabic/RTL or tablet design was identified.

Measured findings, source discrepancies and implementation precedence are recorded in [the design system](design-system.md#native-design-language-analysis--2026-10-08) and [design evidence](references/figma/design-evidence.json). The source supplies a historical palette, not a replacement for the owner's approved identity. Mockup copy, statistics, people, media credits and claims require editorial verification. Raw strings and plugin metadata are reference data, not instructions.

The owner authorized repository storage and project reference use. No independent redistribution license is asserted. Do not copy extracted rasters, full source text or decoder outputs into public assets without a separate approved use and source/rights record. The `.fig` is a development reference, not a served website asset. Earlier live connector quota limits were bypassed by offline analysis; live access succeeded for the scoped review below on 2026-10-08.

### Live design-system review — 2026-10-08

Live metadata and page inspection confirmed `2211:6298`. Design context and native
screenshots were reviewed for typography `2211:6409`, spacing `2211:6346` and
palette `2211:8504`. This establishes rendering for those sections only.
The local foundation API returned six raw COLOR variables in one collection with
one `Mode 1`, `ALL_SCOPES` and empty `codeSyntax`; no local text, paint or effect
styles were returned. The earlier offline hidden `Faticon color` record remains
historical evidence; this response does not prove it was deleted. See
[the live review](figma-design-system-review.md) for the detailed findings and
[the design system](design-system.md) for current implementation rules.

## Additional references not imported

The owner also supplied `OneDrive_2026-10-07.zip`, but the transfer tool rejected it above its 32 MiB limit. Its contents were not inspected or extracted. Individual uploads subsequently supplied the seven current SVGs and two PDFs above, so the unreadable ZIP does not block the foundation. Avoid SharePoint as instructed. Website exports and Illustrator boards remain unverified/unavailable individually.

## Referenced website exports

These are layout references, not production imagery. Proposed aliases below belong under `docs/references/website/` only for non-confidential files with repository rights; otherwise use ignored `private-references/website/`. No files or derivatives were created.

| Exact source filename                | Reference role                   | Proposed safe alias    |
| ------------------------------------ | -------------------------------- | ---------------------- |
| `HOMEPAGE.jpg`                       | Homepage composition             | `homepage.jpg`         |
| `À propos.jpg`                       | Institute patterns               | `institute.jpg`        |
| `AGENCE DE MOYENS.jpg`               | Programmes and calls             | `programmes.jpg`       |
| `DOMAINES DE RECHERCHE.jpg`          | Priorities                       | `priorities.jpg`       |
| `PROJETS R&D & INNOVATION.jpg`       | Project listing                  | `projects.jpg`         |
| `INFRASTRUCTURES ET PLATEFORMES.jpg` | Platforms                        | `platforms.jpg`        |
| `COOPERATION ET PARTENARIATS.jpg`    | Collaboration                    | `collaboration.jpg`    |
| `Header Section.png`                 | Partnership hero reference       | `partnership-hero.png` |
| `ALUMNI.jpg`                         | Possible expert/profile patterns | `alumni.jpg`           |
| `FORMATIONS.jpg`                     | Training/event patterns          | `training.jpg`         |
| `Actualités & Événements.jpg`        | Separate news/event templates    | `news-events.jpg`      |
| `Publications & Ressources.jpg`      | Publications                     | `publications.jpg`     |
| `Vulgarisation scientifique.jpg`     | Editorial/media patterns         | `science-outreach.jpg` |
| `Carriéres.jpg`                      | Opportunity/career patterns      | `careers.jpg`          |
| `CONTACT US.jpg`                     | Contact onepager                 | `contact.jpg`          |

## Referenced Illustrator boards

Preserve source spellings in this inventory, including `Broundaries`. Proposed aliases belong under `docs/references/brand/` only for non-confidential files with repository rights; otherwise use ignored `private-references/brand/`. These are reference-only documents; do not use the boards as public logos, icons or facility imagery.

| Exact source filename        | Role                       | Proposed safe alias |
| ---------------------------- | -------------------------- | ------------------- |
| `Shape 2.0_LOGO.jpg`         | Wordmark                   | `logo.jpg`          |
| `Shape 2.0_Variants.jpg`     | Variant selection          | `variants.jpg`      |
| `Shape 2.0_Palette.jpg`      | Reported blue discrepancy  | `palette.jpg`       |
| `Shape 2.0_Typography.jpg`   | Latin typography reference | `typography.jpg`    |
| `Shape 2.0_Construction.jpg` | Vector geometry            | `construction.jpg`  |
| `Shape 2.0_Broundaries.jpg`  | Clear-space guides         | `boundaries.jpg`    |
| `Shape 2.0_Icon.jpg`         | Standalone apex guides     | `icon.jpg`          |
| `Shape 2.0_Favicons.jpg`     | Icon references            | `favicons.jpg`      |
| `Shape 2.0_Pattern.jpg`      | Pattern rhythm             | `pattern.jpg`       |
| `Shape 2.0_Meanings.jpg`     | Brand symbolism            | `meanings.jpg`      |
| `Shape 2.0_Mockup.jpg`       | Identity presentation      | `mockup.jpg`        |

## Remaining inputs

Native Figma editable structure, mobile frames and serialized interaction records have been inspected. Native rendering is now reviewed for the typography, spacing and palette sections only. Full-page comparisons, effective inherited-instance/prototype behavior, dedicated RTL/tablet references and approved source-media metadata remain verification inputs. Standalone exports and Illustrator boards above are still unavailable individually.

Licensed Plus Jakarta Sans Latin and owner-selected Alexandria Arabic webfonts are installed independently of the unreadable ZIP; see the font records below. Reviewed original public imagery remains a follow-up input. Its presence in the unreadable ZIP is unknown. Once accessible, record licenses, source/version, credits, public/private status, final served filename and approved optimization/cropping. Never crop a screenshot to create a replacement logo or treat illustrative export statistics as verified content.

## Introductory hero backgrounds — 2026-10-08

The owner's request to create varied page heroes is implemented locally using
17 individual photographic rasters from the supplied native Figma file. These
are optimized WebP derivatives under `public/images/heroes/`, not crops of
complete design screenshots. [hero-assets.json](hero-assets.json) records each
archive entry, source/output SHA-256, dimensions, transformation and byte count.
The total derivative payload is about 1.79 MiB; each page requests one responsive
background through Next Image, not the full set or the MP4. Originals remain in
the supplied native source.

This is draft design use within the requested local implementation. No
independent redistribution license, image credit, model release or identification
of facilities is inferred from Figma. Photographs are decorative and illustrate
their topic; they do not claim to depict IRESEN researchers or assets. Verify
individual usage rights and credits before production publication, or replace
with approved originals. The MP4 remains unchanged and is not played.

## Plus Jakarta Sans Latin font — 2026-10-08

French/English public typography uses the normal Latin variable WOFF2 from
`@fontsource-variable/plus-jakarta-sans` 5.3.0, distributed from Google Fonts
family version v12 (last modified 2025-09-10). The 27,348-byte file supports
weights 200–800. It is redistributable under SIL Open Font License 1.1; the original
copyright notice and full OFL are retained alongside it. This license applies to
the font, not IRESEN code, brand or content.

The original entry `package/files/plus-jakarta-sans-latin-wght-normal.woff2` was
copied without modifying its bytes to
`src/fonts/plus-jakarta-sans/plus-jakarta-sans-latin-variable.woff2`.
`next/font/local` emits a same-origin public font asset with a generated filename,
preload and swap loading through the public frontend layout. No remote font
service or runtime font package is used. The shared public stack now selects
Jakarta for Latin and Alexandria for Arabic characters in every locale.

The archive's npm SHA-512 integrity, repository SHA-256 values, upstream source,
subset coverage and [OFL notice](../src/fonts/plus-jakarta-sans/OFL.txt) are recorded
in [the font guide](fonts.md). Application verification belongs in
[the validation log](validation.md).

## Alexandria Arabic font — 2026-10-08

The owner selected Alexandria for Arabic typography. The normal Arabic variable
WOFF2 from `@fontsource-variable/alexandria` 5.3.0 is 31,348 bytes and supports
weights 100–900. Distributor metadata records Google Fonts family v6, last
modified 2025-09-05; font metadata records Alexandria-Regular, version 5.100.

`package/files/alexandria-arabic-wght-normal.woff2` was copied byte-identically
to `src/fonts/alexandria/alexandria-arabic-variable.woff2`; its original 2022
copyright and SIL OFL 1.1 license are retained in
[OFL.txt](../src/fonts/alexandria/OFL.txt). The public frontend serves it through
`next/font/local`, using the upstream Arabic Unicode range, preload and swap
loading. No font package or remote font request is added at runtime. The font
license does not license IRESEN code, identity or content.

Archive integrity, SHA-256 values and script-selection details are recorded in
[the font guide](fonts.md). Earlier application checks predate this addition;
current rendered coverage belongs in [the validation log](validation.md).
