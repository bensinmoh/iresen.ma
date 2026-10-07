# Asset inventory

Inventory date: 2026-10-07. Seven owner-supplied SVGs are available in `public/brand/` under concise filenames, including the latest corrected logos/apex and primary mark. Byte-identical originals and the two supplied PDF guidelines are preserved in ignored `private-references/`. The received files are sufficient for the branded foundation.

## Received assets and rights

The owner authorized website use and repository copying of the supplied assets. No independent redistribution or open-source license is asserted. SVG copies preserve source bytes, geometry and colors; no recoloring or optimization was applied. Source filenames, SHA-256 hashes, viewBoxes and fills are recorded in [brand-assets.json](brand-assets.json).

SVG XML was inspected for geometry/color metadata and contains no scripts or external references. This is source inspection, not a claim that the absent website screenshots or Illustrator boards were visually reviewed. Browser rendering is a separate application check.

| Exact source filename        | Role                      | Repository file                    | Verified fills           |
| ---------------------------- | ------------------------- | ---------------------------------- | ------------------------ |
| `IRESEN Primary Logo.svg`    | Primary brand mark        | `public/brand/logo-primary.svg`    | `#12345A`, `#296BB4`     |
| `IRESEN Colored Logo.svg`    | Master for light surfaces | `public/brand/logo-color.svg`      | `#12345A`, `#296BB4`     |
| `IRESEN Logo Dark Mode.svg`  | Two-color reversed mark   | `public/brand/logo-dark.svg`       | White, `#296BB4`         |
| `IRESEN Logo White.svg`      | Reversed mark             | `public/brand/logo-white.svg`      | White                    |
| `IRESEN Logo Monochrome.svg` | Supplied monochrome mark  | `public/brand/logo-monochrome.svg` | White; not navy-on-white |
| `Apex Leaf.svg`              | Standalone motif          | `public/brand/apex-leaf.svg`       | `#296BB4`                |
| `Favicon.svg`                | Browser icon              | `public/brand/favicon.svg`         | `#296BB4`                |

Latest colored/dark wordmark viewBoxes are `0 0 696 194.9`; white/monochrome remain `0 0 695.98 194.94` (all approximately 3.57:1). The primary mark is `0 0 1262.5 508.54` (approximately 2.48:1), the apex is `0 0 177.3 287`, and the favicon is square (`0 0 508.5 508.5`). Reserve dimensions proportionally; do not redraw the wordmark as text. Latest originals retain source filenames under `private-references/brand/`; superseded versions are preserved under its ignored `previous/` directory with hash suffixes.

The latest owner-supplied favicon now uses `#296BB4`, matching the other blue identity assets and UI tokens. Its source SHA-256 is `b897f8993b00234b756d9f63d2adad287ae7a22dbd4112671e462d60635dab07`. All corrected uploads were copied byte-identically; no automatic recoloring was applied.

## Development references and private guidelines

| Source                              | Role/version                                        | Status and publication boundary                                                                                         |
| ----------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `instruction.md`                    | Development brief v1.1, 7 October 2026              | Available; project instructions, not a public web asset                                                                 |
| `IRESEN_Color_Book_2026_V0_9.pdf`   | Color book v0.9, October 2026                       | Text inspected; ignored `private-references/brand/color-book.pdf`; not served/committed                                 |
| `IRESEN_2035_Phase_01_Narratif.pdf` | Internal institutional narrative, 30 September 2026 | Read as a working reference; ignored `private-references/institutional-narrative.pdf`; contents not committed/published |

PDF SHA-256 values:

- Color book: `b91e3ddd316b79069988e6fba071ff2679d8bde733e8aae287acddd5d6a9d14d`.
- Narrative: `d346aa7f0944dc3a7ed9242eeeb101e62f22b7ebc60de00263a50ba569312ab4`.

The color-book v0.9 text confirms navy `#12345A` and signature blue `#296BB4`. The owner's final correction selects **`#296BB4` as the website primary blue**, and all current blue-bearing SVGs match it. Earlier `#256BA2` vectors are preserved privately as superseded versions. Every received PDF/SVG source remains unchanged. The brief's Illustrator-palette observation remains unverified because that board is unavailable.

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

Figma URL: <https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=127-1781>. Editable layers, mobile/RTL frames and interaction specifications are not verified. Actual accessible exports can guide later work without requiring live connector access.

Licensed Plus Jakarta Sans webfont files, an approved Arabic companion and original public imagery remain optional missing inputs for the boilerplate and dependencies for later visual work. Their presence in the unreadable ZIP is unknown. Once accessible, record their licenses, source/version, credits, public/private status, final served filename and approved optimization/cropping. Never crop a screenshot to create a replacement logo or treat illustrative export statistics as verified content.
