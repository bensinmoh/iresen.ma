# Complete IRESEN photo asset library — 2026-10-23

The owner requests ingestion of the full **IRESEN_Photos_4K_JPG** collection for
future website placements, to be commissioned individually. This expands the
internal asset inventory; it does not expand the selected public photothèque or
replace any current page image.

## Storage and lookup

The 216 active files from the collection's `Photos/` directory are imported.
Thumbnails, processing backups, reference material, scripts and the separately
excluded duplicate/similar-photo folder are not additional source photographs.

- Stable keys: `iresen-photo-001`, `iresen-photo-079`, etc., retaining collection
  IDs and their intentional gaps. Locate by key, filename, title, category or
  keywords in [the asset manifest](photo-asset-library.json).
- Byte-identical collection JPGs: `.local/photo-asset-library/jpg/`, outside Git
  and outside `public/`. Their original metadata is preserved privately.
- WebP previews: `.local/photo-asset-library/webp/`, proportionally downsampled
  to a maximum 2560px long edge without enlargement, quality 84, metadata stripped.
  There is no crop, generative edit or additional color treatment.
- Native CMS Media records: private revision drafts with the same WebP preview.
  Payload normalizes these uploaded previews; its resulting bytes have a separate
  CMS delivery fingerprint in the manifest. Source-backed French titles/captions/keywords are imported; EN/AR translations,
  credit and public reuse rights are not invented. Internal notes retain the
  stable key, source hash, category, original resolution and quality warnings.
- Local CMS IDs/resume state: `.local/photo-asset-library/cms-records.json`.
  The tracked manifest uses stable asset keys/filenames instead of database IDs.

The manifest records both the collection JPEG and its preceding original source
fingerprint, original and collection dimensions, prior enlargement factor,
quality notes, private JPG path and WebP preview hash/geometry. Descriptive source
metadata is evidence for later review, not approval of facts, dates or rights.
Absolute source-machine paths and full EXIF/IPTC blocks are excluded from the
tracked manifest.

## Future use

The collection includes events, visits, inaugurations and low-resolution source
images because the owner now requests every asset for later selection. Keep
these labels and quality notes; a nominal 4K JPEG does not establish native detail.
The earlier selective 25-photo public gallery remains unchanged, with WebP display
and JPG downloads. It is separate from this complete internal inventory.

When the owner commissions a placement, select the stable asset key, prepare a
suitable public WebP derivative and a JPG download where required, add source
provenance and localized descriptive metadata, and register the single public
resource/search identity. Preserve existing publication, translation, media and
route gates. Do not expose the private source folder or publish this entire
collection by default.

## Reproducible ingestion

Use Node 24.22.0 and the configured local database/runtime. Verify first:

```sh
node scripts/run.mjs tsx scripts/ingest-photo-asset-library.ts --source '/path/to/IRESEN_Photos_4K_JPG'
```

Add `--apply` to import. The command verifies all source JPG hashes, actual JPEG
formats and dimensions before writing, refuses remote database hosts, requires
an existing administrator, and records a resumable local checkpoint. It creates
private draft media only and never changes the public catalogue. Repeated runs
reuse their matching media records, preserve editorial changes and refuse source
or local-JPG mismatches rather than silently overwriting them. Interrupted runs
can resume from the existing matching files and CMS filenames.

Originals remain byte-identical in the external project and the private local
copy. Local upload files/databases require their normal separate handover;
they are not embedded in Git or the public build.

## Completed intake and verification

Current intake: **216 active assets** across **22 source categories**, totaling
734,009,780 bytes of byte-identical collection JPGs and 86,048,008 bytes of prepared
WebP previews. The CMS-normalized WebP file fingerprints are recorded separately.
IDs 093 and 243 received new source versions during ingestion; the latest versions
are active in the manifest and both earlier private JPG/CMS versions are retained.
No source file or prior CMS record was overwritten.

Use `--refresh-changed` with `--apply` only after intentionally reviewing a changed
source. It stores the new JPG in a versioned private path, creates a distinct private
CMS upload, and retains the previous checkpoint/version. Normal reruns refuse
changed sources, changed/removed CMS identities and mismatched stored bytes.

Original-resolution flags include 112 previously enlarged collection files and
33 originals with a long edge below 1000px; the flags are retained even though the
collection delivery JPGs have larger dimensions. Retouching/illustration warnings
remain attached to their source entries. These flags guide later placement review.

The intake audit verifies all current JPG, prepared WebP and CMS upload hashes;
216 current CMS records have private visibility and draft revision/French approval
status. Anonymous Media queries exclude the assets in FR/EN/AR; sampled anonymous
file requests are denied. No imported asset appears in public search. Existing
public gallery records and image selections remain unchanged.

Node 24.22.0 source preflight, repeated-import reuse check, targeted ESLint,
changed-file formatting and whitespace are the scoped verification. Application
build/full CI and Git completion remain pending the existing shared-checkout hold.
The earlier database handover export predates this asset ingestion and needs a
fresh export when the coordinated delivery is finalized.

## Owner correction for asset 093 — 2026-10-23

The attached **Campus facade with seven flags.png** is the preferred private
library version of `iresen-photo-093`. It replaces the grey-area library rendition
only. The official GEPMCI website image (`gep-mci-campus.webp`) stays unchanged;
no homepage, platform page or photothèque replacement is commissioned here.
Asset 243 retains its latest ingested version for later placement instructions.

The attachment is preserved byte-identically in the private owner-overrides
folder, with a same-resolution WebP preview and JPEG derivative. It is 1670×942;
no enlargement, crop or generative edit is applied. A separate private CMS draft
preserves the prior uploads. [Owner overrides](photo-asset-overrides.json) explicitly
select this version; the ingestion command overlays that preference after processing
the collection, so a later bulk refresh cannot restore the grey-area rendition.
The full manifest now resolves asset 093 directly to these preferred files.
