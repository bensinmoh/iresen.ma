# Médiathèque — 2026-10-10

The owner commissioned the existing media page with reports, photographs, videos
and institutional links. The retained research-institute benchmark informs a
visitor-first resource directory: clear categories, direct access and concise
source information. Its source remains unchanged; no additional route is introduced.

## Delivered scope

- Twenty owner-supplied photographs, selected across platforms, research/testing,
  projects, events and institutional life, including the supplied portrait of
  Samir Rachidi, Directeur général d’IRESEN. The owner explicitly authorized their
  public inclusion. Originals remain private; orientation-corrected WebP copies
  meet at least 1920 pixels in width or 1080 pixels in height, resized from verified originals with proportional enlargement only where needed. See the hash manifest below.
- A filterable gallery with native full-image links, an accessible modal,
  previous/next controls, Escape dismissal, restored focus and derivative download.
- Eight locally imported owner-supplied videos, excluding Drone. The owner
  explicitly authorized all eight public on 2026-10-10, retaining original titles
  in FR/EN/AR, without deployment. Existing CMS publication/locale/rights gates
  apply; every metadata query uses `overrideAccess: false`, `draft: false` and
  `fallbackLocale: false`. Files use the guarded locale endpoint, without Next's
  persistent image cache. Native controls use `preload="none"`, no autoplay and
  posters extracted from the actual source. Empty and unavailable states are separate.
- Ten PDF resource links from the supplied Ministry strategies folder. Original
  document titles and language are retained. Descriptions are localized working
  copy based on the documents. PDFs remain at their external source; neither a
  private-source PDF import nor a Drive sharing change is made.
- Official destinations for MASEN, ANRE, AMEE, ONEE and MEMDD.

The twenty photos are recorded in `src/data/media-photos.json`; source hashes and
public derivative fingerprints are in `docs/media-library-photos.json`.
`src/data/media-reports.json` records source links, language and source byte sizes.
`src/data/media-videos.json` contains only public upload filenames, extracted
poster paths, durations and original-file fingerprints, never upload bytes or
credentials. Six MP4 originals are stored byte-identically in the local CMS; two
M4V originals are preserved locally with losslessly remuxed MP4 playback copies.
The eight original files total 2,604,894,773 bytes. These full-size archival
uploads remain local CMS data, outside Git; deployment/storage transfer is separate.
No event dates, subtitles, complete transcripts or unrestricted reuse licence are
invented. Source dates are not event dates. Video captions currently retain the
original titles. A video-caption accessibility rule is explicitly excluded from
the automated scan because the supplied sources have no reviewed subtitle files.

The owner subsequently requested a shorter hero and a generated media-library
visual, removal of the missions band on this page, varied photo sizes, a compact
horizontal video rail, animated section links and a modern centered viewer.
The hero now uses a generated illustrative still-life of scientific reports,
photographic prints and a camera, not a claimed IRESEN location; its prompt and
fingerprints are in `docs/media-library-hero.json`. Other shared heroes and
brand SVG geometry are preserved. The media hero is 76dvh minimum, with natural
growth for enlarged/long text. The supplied Samir Rachidi portrait appears first. A large photo and four smaller
photos compose each desktop group, alternating the large image left/right; tablet/mobile reflow retains the source order. The video cards use full-height thumbnails with a softly blurred blue-tinted
background and a cover-cropped foreground. Activating a card opens a centered native
video dialog; actual films retain their original 16:9 framing. No-JavaScript
visitors retain direct guarded-file links. The horizontal rail supports native
scrolling, keyboard access and SVG controls.
The centered native dialog enlarges from the clicked photo using a scoped
transform animation, then reveals icon controls; download remains a text action.
Photos fill their frames without exposed borders, with Samir’s face positioned centrally. The centered popup is limited to 80vw and 80dvh; its image covers the available stage. Download includes a downward SVG arrow. Video cards use cover cropping and a larger play icon that appears on hover or keyboard focus, arriving from above while the thumbnail enlarges slightly and a 15% black overlay appears. The keyboard focus ring sits inside video cards so the horizontal rail cannot clip its top edge. The play control is centered in the area above each card’s title. The video popup offers a guarded original-file download immediately left of close in French and English, and right of close in Arabic. Grid sizing reserves space for controls within the 80% viewport cap, without inner scrolling. Filtering uses scoped
FLIP transforms for retained tiles and short reveals for incoming photos.
Reduced motion bypasses image/control/tile animation and smooth scrolling. Scoped light/ink surfaces,
vector controls and logical CSS follow the current shared design rules.

## Routing and search

The canonical `media` page ID and five legacy anchors remain. `videos` and
`reports` are added as stable anchors. All FR/EN/AR catalogue keys are complete;
localized working descriptions are distinct from final editorial approval.

Twenty static photo originals and the separately identified generated hero have
searchable localized metadata through
`publicAssetReferences`; hero usage does not duplicate its photo result. Video
posters are derivatives of their CMS originals, not separate search results.
Ten document references and five institutional destinations link to reachable
page anchors. CMS videos use the existing guarded update/delete projection;
withdrawal remains governed by the shared access/search tests. The local index
was rebuilt and the eight video results checked in all three locales. The final
whole-site glossary/content sanity check remains pending final website content.

## Sources and boundaries

- [Owner-supplied Ministry strategies folder](https://drive.google.com/drive/folders/16ruE_KIPGATcGTyEzkbsRxrYZA-hu0Jv).
- [MASEN](https://www.masen.ma/), [ANRE](https://anre.ma/),
  [AMEE](https://amee.ma/), [ONEE](https://www.one.org.ma/),
  [MEMDD](https://www.mtedd.gov.ma/).
- The supplied portrait filename identifies Samir Rachidi; the current role is
  supported by the [Université Ibn Tofail, 4 March 2026](https://www.uit.ac.ma/le-president-de-luniversite-ibn-tofail-a-recu-dr-samir-rachidi-directeur-general-de-iresen/).

Other photographs, source archives, local import manifests, credentials and private
references stay excluded. No fictional content, new CMS collection, deployment,
DNS change or production publication is introduced. Public inclusion here is on
the development site, as explicitly requested by the owner.

## Samir portrait biography — 2026-10-10

The official portrait now has a dedicated light biography viewer with selectable French source text, a clipboard action and an image-only download. Its thumbnail preserves headroom on hover. The name retains institutional ink with weight 900; role lines are italic with tight leading. The enlarged cutout meets the popup bottom edge, with the original bottom actions layered above it. Mobile reading scrolls independently. See [scope](samir-biography.md).

## Video navigation pills — 2026-10-10

The video rail now has one expanding pill per approved video, with no border or
inset stroke. The group sits below the thumbnails, centered within the equal
32px gaps before the reports link. Pills reveal their associated video and follow
native scrolling, resize and RTL; shared terminal offsets retain separate item
selection. Controls disappear without overflow. Reduced motion is direct;
no-JavaScript retains native scrollbars and guarded file links. Existing anchors,
CMS/media gates and search references remain. See [requirements](horizontal-scroll-indicators.md).

Owner follow-up: pills are mobile-only (at or below 40rem). Tablet/desktop
retains native horizontal scrolling; its default scrollbar is hidden and no pills
are displayed.

## Site-wide image provenance and AI search exclusion — 2026-10-11

The owner commissions classification of **all site photographs/illustrations**,
not only the twenty gallery entries. `src/data/image-provenance.json` inventories
all 161 served raster originals and derivatives under `public/images`: 64
AI-generated, 13 AI-assisted derivatives, and 84 source-reference images.
Each entry records its served path, current SHA-256 and evidence documents.
Source-reference means a recorded supplied/exported source, **not certification
that an external/Figma original was never AI-generated**. Classification uses
explicit provenance and matching fingerprints, never appearance alone.

Generated scenes, including mobile crops and byte-identical reused copies,
remain available where already used but are excluded from static search results
in FR/EN/AR and from result preview enrichment. Their registration metadata stays
retained for provenance. Page/section discovery remains available. Source-backed
photos and AI-assisted retouches of actual supplied subjects (leadership portraits
and the report-cover mockup) keep their existing search eligibility.

The changed catalogue revision applies to both results and spelling vocabulary;
synchronization deletes withdrawn static entries. Future public raster additions
must update this inventory and record generation/retouch provenance. Private
originals are not imported; no image bytes, routes, gallery layout, publication
gates or deployment are changed. The final whole-site glossary sanity check
remains pending final content.

## Focused photo curation — 2026-10-23

The owner's latest request replaces the earlier twenty-image gallery with a
selection from the local **IRESEN_Photos_4K_JPG** project. The current gallery has
**25 images**: 24 documentary photographs selected from its 216 retained entries,
plus the unchanged official DG portrait, retained first with its biography.
The selection covers laboratory work, photovoltaic characterization and tests,
solar installations, smart grids, physical demonstrators, platform architecture
and headquarters identification. Event coverage, inaugurations, visits, group
portraits, low-detail originals and repeated viewpoints are excluded. A 4K output
filename alone is not evidence of detail: the selected collection sources all
have original long edges of at least 3840px and no meaningful prior enlargement.
Collection thumbnails/contact sheets were inspected before selection.

The existing layout, viewer, downloads, keyboard access, reduced-motion behavior
and canonical anchors remain. Filters are offered only for represented categories;
the empty Events filter is absent. FR/EN/AR captions describe visible subjects and
source-identified places/equipment, without adding capability or performance claims.
New gallery derivatives preserve the complete source composition, with proportional
2560px maximum long edge, no enlargement, WebP quality 85 and stripped metadata.
Next Image retains responsive, lazy-loaded display derivatives; the 25 full download
files total 16,502,684 bytes, not an initial-page transfer measurement. Supplied
originals and the rest of the photo collection remain outside the repository.

[The current source/hash manifest](media-library-photos.json) records collection
IDs, original resolutions, delivery hashes, selection rationale and ten withdrawn
gallery identities. Other uses of historical assets are not removed by a gallery
curation request. The image-provenance inventory includes all new delivery files.
Each retained/new gallery item has one stable `library-photo-*` search identity
with a reachable image URL and FR/EN/AR metadata through the existing projection.
After local index synchronization there are 25 gallery image results per locale
and zero results for the ten withdrawn gallery identities.

The running local site uses CMS authoring projections, so source JSON alone does
not update its gallery. The narrowly scoped local command
`node scripts/run.mjs tsx scripts/sync-curated-media-photos.ts --apply` reconciles
only gallery photo records and the GreenH2A image-description leaves in the two
platform namespaces. It refuses remote database hosts, saves a private pre-change
backup, records revisions/audit, preserves unrelated fields and editorial changes,
and withdraws old gallery records by visibility rather than deletion. New EN/AR
authoring variants retain review status; this does not approve translations or
alter deployment/publication gates. Existing administrator attribution is reused;
no account is created. Repeat dry-run: zero updates and zero additions. The earlier
database handover export predates this local content change.

Verification ledger: changed-file formatting, targeted ESLint and whitespace
checks pass. All 209 served raster paths have current provenance fingerprints.
Chrome development review on Node 24.22.0 covers FR/EN/AR at 320, 390, 768, 1024 and
1440px; all four category filters, 25 images, loaded viewer image, arrow navigation,
Escape/focus restoration and 200% text reflow pass. Desktop French and mobile Arabic
captures were visually inspected. All 25 full-image links also remain available
without JavaScript. The homepage GreenH2A image and its visualization label load
correctly, and the mobile platform page stays within its viewport. The local search rebuild completed, with SQL
verification of localized inclusion, withdrawals and the new GreenH2A URL.
Production build, full automated suites and current-head CI remain pending under
the shared-checkout hold. Existing browser expectations now follow the catalogue
size rather than the superseded hard-coded twenty-photo count.

### JPG downloads, WebP previews — owner correction, 2026-10-23

Gallery thumbnails and the enlarged viewer continue to use WebP. Each photo now
has an explicit `downloadSrc`: the Download action serves an actual JPEG file,
not a renamed WebP. The 24 collection photographs have metadata-stripped JPEG
copies with a maximum 3840px long edge, without enlargement, cropping or new color
processing (MozJPEG quality 90). The existing official DG JPEG remains unchanged.
These JPGs load only on download; the preview image sources are unchanged.

The 25 JPG downloads total 44,645,926 bytes. Per-file dimensions, source linkage,
bytes and SHA-256 are recorded beside each WebP in `media-library-photos.json`;
the raster provenance inventory includes each JPG. Both formats belong to the
same photo and retain its single existing `library-photo-*` search result, with
WebP as its canonical media preview. No duplicate JPG search entries are created.
The local CMS photo source snapshots were reconciled with these download URLs,
with backup and revision history, while preserving statuses and captions.

Verification: French, English and Arabic viewer previews remain WebP; clicking
Download saves a `.jpg` whose actual file signature is JPEG. All 25 JPG destinations
return HTTP 200 with `image/jpeg`. Formatting, targeted lint, fingerprints and
whitespace checks pass. Production build/current-head CI remain pending the shared
checkout hold.

Complete asset intake — 2026-10-23: the owner subsequently requests all 216 active
collection photos as reusable website assets for later placement. They are ingested
as private local JPGs, WebP previews and private draft CMS media; the selected
25-image public gallery remains unchanged. See [the internal asset library](photo-asset-library.md).

### Stronger research images and panorama emphasis — 2026-10-23

The owner replaces the Oculus pavilion and the GSBP claustra/garden detail with
collection photo 190 (outdoor photographic inspection of PV modules) and photo
130 (panorama of the solar-testing platform). The later owner correction puts
the panorama first in the final five-photo group, giving it the large desktop
slot; the inspection occupies a secondary tile. Mobile source order follows
that same editorial priority. The gallery remains at 25 images.

New FR/EN/AR titles describe the visible activity/site without adding performance
claims. The original source compositions remain complete in the WebP delivery
files and JPG downloads; the existing responsive grid controls thumbnail framing.
The private original assets remain in the full library. Oculus and claustra/garden
are withdrawn from the gallery and its search projection, with CMS revision history
preserved. Their files remain as historical assets. The official GEPMCI website
image is unchanged.

The two replacements use the normal static `library-photo-*` search projection.
The local index was rebuilt: each new identity has FR/EN/AR entries, the two
withdrawn identities have none, and the private full-library assets still have
zero public search results. Current previews total 15,047,972 bytes; the 25 JPG
downloads total 41,717,965 bytes, neither an initial-page transfer measurement.

Verification: FR/EN/AR development views at 390/768/1440px, both viewers and real
JPG downloads pass. The final panorama emphasis was confirmed in French desktop
and Arabic mobile views. Source/provenance fingerprints, changed-file formatting
and whitespace checks pass. Production checks/CI remain pending the shared hold.

## YouTube vidéothèque — owner update, 23 October 2026

The seven owner-supplied IRESEN YouTube videos now replace the CMS-hosted video
selection in the public rail, in the supplied order. Original YouTube titles,
channel attribution, watch URLs, official thumbnail sources and preview hashes
are recorded in `src/data/youtube-videos.json`. Thumbnails were retrieved through
YouTube oEmbed on 23 October 2026 and converted to local WebP previews. They are
source references, not generated imagery or a claim of unrestricted reuse.

Cards, blurred thumbnail echoes, native scrolling, mobile pills, dialog styling,
keyboard focus and Arabic direction remain. Playback uses an iframe on
`www.youtube-nocookie.com`, created only while its viewer is open and external
services are allowed. Closing the dialog unmounts the player. No local video file
is requested by this section; the former download action opens the original
YouTube watch URL. Existing original files and historical CMS records are retained.
Original video titles remain unchanged across the three localized interfaces.

The existing external-service consent category now explicitly includes YouTube;
its two labels are reconciled locally with backup, revisions and audit through
`scripts/sync-youtube-consent.ts --apply`. The viewer offers an explicit consent
action or a direct YouTube link. CSP permits only the exact privacy-enhanced
YouTube frame host in addition to the previously allowed hosts. All seven videos
have static localized search references; thumbnails share their video's result.

Verification ledger: targeted ESLint, Prettier and whitespace; development Chrome
checks in FR/EN/AR at 390, 768 and 1440 pixels (seven cards, no page overflow),
consent gating, embed URL, Escape close, player removal and focus restoration.
Mobile French/Arabic viewer layouts and the real YouTube institutional player inspected.
Local search rebuilt and verified
at seven new video references per locale. Browser-suite assertions now cover
YouTube mounting/unmounting and all seven rail indicators. Full suites, isolated
production verification and final-head CI await the shared coordination hold.

Thumbnail framing follow-up — 23 October 2026: each video has its own
`thumbnailZoom` and `thumbnailPosition`. Six official thumbnails contain baked-in
black bands; CSS zoom removes those bands while positioning the visible people
or architecture within the portrait cards. The unletterboxed aerial campus view
keeps its natural scale. Hover/focus adds its small zoom relative to the selected
baseline, so bands do not return during interaction. Preview bytes, source hashes,
YouTube players, titles and search references are unchanged. Inspected all seven
rendered desktop cards and FR/AR mobile views at 390px; no page overflow. Targeted
ESLint, formatting and whitespace pass; production/CI remain held.

Ministry naming follow-up — 23 October 2026: displayed report credits and the
strategy report title/descriptions now use MEMDD, following the owner's current
acronym. Search metadata uses the current Energy, Mines and Sustainable Development
name. Local CMS metadata is synchronized with revisions and backup; original
report PDFs and working external URLs remain unchanged. See the naming entry in
[governance](governance.md).

Public-copy correction — 23 October 2026: the reports introduction now presents
the energy/climate reports, strategies and reference documents available to
visitors, in their original languages. Internal supplied-folder wording is removed
from MediaLibrary and the media/publications section metadata in FR/EN/AR. Local
CMS catalogues and named sections are reconciled with backup, revision history
and publication gates retained; public search is rebuilt. No file or report title
changes in this follow-up.
