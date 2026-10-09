# Public website search

Search uses PostgreSQL behind the replaceable `SearchAdapter` boundary. The
localized search page accepts `q`, `type`, `sort` and `page` in its URL, so results
can be bookmarked and browser history preserves the visitor's choices.

The header's white magnifier expands toward inline-start on hover or explicit
keyboard/touch activation, revealing a labeled input. This moves left in French/English and mirrors
in Arabic, switching sides when necessary to fit the available header width. Enter or the magnifier submits a GET request. Touch, no-JavaScript
and reduced-motion users retain the native form. Suggestions use the same public
search service as full results, with debounce and cancellation.

## Content coverage

The index contains canonical public page introductions and rendered section
headings/text, public locale-approved CMS page/article text, uploaded public
documents/media, and registered static public resources. Section results link
to their stable anchors; articles link to a guarded news detail route. Responsive
image derivatives share one entry. Search itself is excluded to avoid recursive
results. Existing publicly rendered editorial placeholders remain searchable as
the text currently on the website; indexing does not approve their final copy.

Titles and exact matches receive extra weight. French/English linguistic
full-text ranking is combined with normalized prefix and title-trigram matching.
French accents, ligatures, Arabic diacritics/tatweel and common alef/ya variants
are normalized while display text stays intact. Arabic uses PostgreSQL's simple
configuration and tested normalization, without claiming an Arabic stemmer.
Highlighted excerpts are React text segments, never generated HTML. Public rich-text projections are bounded to 100,000 characters and at most 200 heading results per source, with bounded traversal depth/node counts.

Uploaded public PDFs can contribute extracted text when `pdftotext` from `poppler-utils`
is installed. Extraction runs during indexing, with time/output/file limits and
guarded local paths. The web server and worker share `CMS_UPLOAD_DIRECTORY`,
resolved by the repository launcher to `.local/uploads` by default. Scanned PDFs
need approved `searchText` or an external OCR
workflow. Audio/video/DOCX and other non-extractable files use approved metadata
and localized transcripts/search text; this implementation does not perform OCR
or speech recognition. A file can still be found by its title and description.

## Adding public content

Every new or changed public page, section, document, file or media item must
include its search reference in the same change. This is the owner's explicit
9 October 2026 instruction, recorded in `AGENTS.md`, `instruction.md` and
`CONTRIBUTING.md`.

| Reference element | Requirement                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Stable identity   | Canonical page ID, stable section anchor, CMS ID or explicit static asset ID                 |
| Destination       | Working public canonical URL, download/view URL or section anchor                            |
| Resource type     | Page, section, news, document or media                                                       |
| Localized text    | Descriptive title and body, summary, caption or transcript for each approved public language |
| Discovery terms   | Useful topic vocabulary, full names and acronyms in genuine descriptive metadata             |
| Eligibility       | Explicit public visibility, published revision and approval for the current locale           |
| Lifecycle         | Publication/update indexing plus withdrawal/deletion removal and verification                |

For **canonical pages/sections**, use `src/lib/site.ts`, `src/lib/page-sections.ts`
and the localized catalogs. Preserve stable anchors in rendered markup and
extend the catalog projection if a new template adds public text outside those
sources. Published CMS body headings use `content-section-{topLevelChildIndex}`
anchors shared by rendering and indexing.

For **CMS pages/articles**, complete localized title, summary and body, then
publish through the existing approved workflow. Pages must use an implemented
canonical page ID; news uses its localized valid, unambiguous slug. Duplicate published slugs must be resolved before either record can be discovered. Never register a URL
without a corresponding working public route.

For **CMS documents/media**, complete title, alternative/description text,
caption and rights. Put an approved transcript or a searchable description in
the localized `searchText` field when automatic extraction is unavailable. File
bytes and metadata must both remain behind the guarded media endpoint; private
uploads do not belong in `public/`.
Serve CMS images directly or with an unoptimized image component. The Next image
optimizer is restricted to static hero paths because its independent cache can
retain withdrawn CMS bytes despite the upstream endpoint's `no-store` policy.
If enabling upload image derivatives later, propagate the approved locale into
every derivative URL as well as the original; all bytes use the same access gate.

For **static served documents/media**, add an explicit `PublicAssetReference`
to `publicAssetReferences` in `src/lib/search/catalog.ts`, providing ID, served
URL, type and descriptive text in available public languages. Review publication
rights before putting the file in `public/`. Register the original once rather
than adding every crop, compressed copy or thumbnail as a separate result.
Fonts, build bundles and operational files are not visitor-facing resources.

For **new CMS collections**, implement a public projection, indexing lifecycle,
publication/locale access gates and public destination route. Extend types and
filter catalogs when necessary. Adding a table to the CMS alone does not make
it discoverable or authorize public access.

Verify realistic queries in every eligible locale, stable result destinations,
metadata updates and immediate exclusion of private, withdrawn, deleted and
missing/unapproved translations. Keep test fixtures out of real public content.

## Publication, privacy and operations

The index only stores explicit public projections. Search SQL rechecks live
publication/visibility/locale eligibility and source fingerprints before returning
an indexed result. Stale text is excluded immediately; asynchronously processing
the durable queue makes new/changed text discoverable. Draft versions, staff-only
editorial notes and repository reference documents never enter the projection.
Search never crawls repository folders or fetches arbitrary external file URLs.

Apply checked-in migrations before starting the application. The database needs
permission to install `pg_trgm`. Follow README search indexing commands for initial
registration, rebuilds and durable worker processing. Production scheduling and
monitoring belong in the eventual hosting configuration. Indexing is idempotent
and can be rebuilt from current eligible content.

Results and the public API are non-cacheable. Results stay `noindex` even when
site indexing is enabled. Queries have bounded length/token/page limits, with
parameterized SQL and database timeouts. The application does not record query
strings in analytics or logs; production reverse-proxy logging must preserve
that policy. Production shared rate limiting remains part of release setup.
