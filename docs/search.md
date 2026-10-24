# Public website search

Search uses PostgreSQL behind the replaceable `SearchAdapter` boundary. The
localized search page accepts `q`, `type`, `sort` and `page` in its URL, so results
can be bookmarked and browser history preserves the visitor's choices.

The results query field, resource filters and sort select share the actions'
physical rounded top-left/bottom-right and sharp opposite corners, including RTL.
See [control geometry](design-system.md#search-results-control-corners--2026-10-09).
This presentation change adds no public content or search projection; the existing
resource references and search-page exclusion remain.

On wider headers, the resting magnifier shares Menu's glass surface over heroes
and becomes white/navy when expanded. It expands toward inline-start on hover or
explicit keyboard/touch activation, revealing a labeled white input. This moves left
in French/English and mirrors in Arabic, switching sides when necessary to fit
the available width. At `40rem` and below, search lives in the open mobile menu;
its full-width input and suggestions expand in normal flow. Enter or the magnifier submits a GET request. Touch, no-JavaScript
and reduced-motion users retain the native form. Suggestions use the same public
search service as full results, with debounce and cancellation.

## Common-database site projection — 2026-10-16

The local `SITE_CONTENT_DATABASE_ENABLED=true` opt-in makes the retained site
catalogues and resource readers use the same PostgreSQL authoring source as `/admin`.
Search calls `siteSearchDocuments()` through its existing catalogue initialization;
committed content revisions invalidate its in-process source cache. Stable IDs,
canonical URLs, current eligibility and the transactional index/vocabulary pipeline
are retained. Draft metadata comes from neither the current shared fields nor
private revisions: resource readers use captured validated shared metadata. Accounts,
notes, applicants and private CVs remain outside this projection.

The initial read-only parity inspection found 4,818 references and zero content
or URL differences from the current retained site. This is baseline source parity,
not a claim that a new public release, full search suite or index rebuild occurred.
Native CMS queries keep explicit access and locale/publication gates. Existing
EN/AR delivered interface baselines remain working text; importing them does not
approve new translations. See the [CMS inventory and check ledger](cms-interface-preview.md).

## Content coverage

### Result previews

Media, documents and news now have previews in full search results. Registered
images and approved CMS images use lazy thumbnails; video/audio use native controls
with `preload="none"` and no autoplay. PDFs show their format and an expandable
viewer mounted only after activation; a direct resource link also works without
JavaScript. Other documents show their format and an open link. News uses its
public locale-approved `heroImage` when available, otherwise an honest news marker
beside the existing title/date/excerpt. No substitute article imagery is invented.

`src/lib/search/previews.ts` enriches only the current twelve-result page. Static
assets must already be registered in `publicAssetReferences`; CMS metadata queries
explicitly use `overrideAccess: false`, `fallbackLocale: false` and `draft: false`.
News lead images get a separate public-media check, so private or untranslated
relationships cannot leak through a published article. CMS bytes use the guarded
locale file endpoint and bypass Next's persistent image cache so withdrawal still
blocks subsequent requests. Static raster thumbnails use existing image optimization;
original SVG geometry and appropriate light/dark surfaces remain.

This adds no resources, routes or CMS fields. Existing public search projections,
stable identifiers, localized descriptions, registration and withdrawal gates
remain authoritative. No index rebuild is required for this presentation change.
Header suggestions retain their compact textual layout. See
[verification](validation.md#search-result-previews--2026-10-09).

The index contains canonical public page introductions and rendered section
headings/text, public locale-approved CMS page/article text, uploaded public
documents/media, and registered static public resources. Section results link
to their stable anchors; articles link to a guarded news detail route. Responsive
image derivatives share one entry. Search itself is excluded to avoid recursive
results. Existing publicly rendered editorial placeholders remain searchable as
the text currently on the website; indexing does not approve their final copy.

## Matching and ranking

Search accepts normalized words, prefixes, linguistic variants, plausible
misspellings and documented related concepts. Relevance uses explicit tiers:
exact matches, linguistic/prefix matches, spelling matches, then related topics.
The full title and title phrases receive priority within exact matches. A high
numeric score in a later tier cannot push it ahead of an exact result. The
visitor's explicit newest-first sort uses dates before relevance.

Spelling suggestions come from indexed words in currently eligible public text.
Corrections are conservative and account for adjacent-letter transpositions;
known words, short terms and acronyms remain intact. The original query stays in
the input and URL. A localized “Did you mean…” link lets the visitor choose the
proposed spelling; approximate results can already appear below direct matches.
Withdrawn, private, stale or missing-locale text cannot supply correction words.
The vocabulary lookup checks at most four distinct words, with 64 indexed
candidates per word and at most two unambiguous corrections. Eligible words have
4–32 letters; the edit budget is one edit below seven letters and two otherwise,
with a maximum relative distance of 25%. Ambiguity or exhausted candidate bounds
can leave a typo uncorrected. Public prefixes and linguistic variants are checked
independently before proposing a correction.
Words belonging to a recognized complete concept alias are also preserved, so a
valid term absent from the current corpus does not become a misleading spelling
suggestion. Original and corrected concept variants share the bounded expansion
budget rather than discarding the visitor's original interpretation.

Related concepts use an explicit FR/EN/AR vocabulary rather than a model or
external API. Examples include platforms/infrastructure, PV/solar photovoltaics,
solar panels, employment/careers and tests/experimentation. Related results must
still contain the associated topic in eligible indexed content. Topic matching
does not invent documents or claim that an empty institutional section contains
final content. Generated solar hero media have factual topic descriptions that
identify their illustrative, fictional setting.
`src/lib/search/concepts.ts` holds this vocabulary. Expansion produces at most
eight complete queries, combining at most two recognized concepts and retaining
all unmatched query words. Acronyms such as PV match whole terms. Related queries
use complete tokens/linguistic stems rather than broad stem prefixes; free-form
paraphrases and topics absent from the dictionary are outside this implementation.
Retrieval retains every required word within the 200-character query limit.
Original/corrected queries support prefixes from four letters; shorter words
remain whole terms. Spelling inspects the first 12 words and highlights/excerpts
use the first 12 unique terms, without shortening the retrieval query.

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
| Resource type     | Page, section, news, publication, report, patent, project, document or media                 |
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

## Final content search sanity check

Owner reminder — 9 October 2026: once the complete website content is supplied,
bring this checklist back to the owner during the final sanity check. It remains
pending until that content milestone, even though the search implementation works.

1. Review the final approved FR/EN/AR terminology and translations together:
   full names, acronyms, technology names, visitor vocabulary and document/media
   captions or transcripts. Correct missing or inconsistent localized metadata
   through the normal approval workflow.
2. Reconstruct/review the multilingual glossary and the related-term dictionary
   in `src/lib/search/concepts.ts` against that content. Add useful synonyms and
   acronym expansions while keeping distinct technical concepts distinct and
   preserving the other words of multiword queries. Record realistic query/
   destination examples such as platforms/infrastructure and PV/photovoltaics.
3. Apply checked-in migrations if needed, then run `pnpm search:rebuild` against
   the intended environment. This rebuilds the public documents and their spelling
   vocabulary; it does not reset the CMS database or create translations.
4. Check representative exact, accented, misspelled, acronym and related-topic
   queries in every approved locale. Confirm exact-first ranking, useful sections
   and working document/media destinations, and exclusion of private, withdrawn,
   stale and unavailable-language content.
5. Record the reviewed glossary/dictionary changes, query examples and rebuild/
   verification results. Mark the corresponding backlog item complete only then.

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
The `20261009_220000_search_relevance` migration adds vocabulary tables and queues
current CMS sources for reindexing. The indexer rebuilds unchanged static sources
when their vocabulary projection version is missing. Its normal indexing
transactions maintain document vocabulary; deleted projections cascade their
word references. `src/lib/search/vocabulary.ts` contains the bounded spelling
selection, and `src/lib/search/eligibility.ts` shares the live result/word gate.

Results and the public API are non-cacheable. Results stay `noindex` even when
site indexing is enabled. Queries have bounded length/token/page limits, with
parameterized SQL and database timeouts. The application does not record query
strings in analytics or logs; production reverse-proxy logging must preserve
that policy. Production shared rate limiting remains part of release setup.

## Homepage research discovery — 2026-10-09

The owner-commissioned domains module supplies seven stable child anchors under
`research-priorities`, localized descriptions and all four axes per theme. Its
FR/EN/AR working versions are explicitly requested for local integration and
review; this does not authorize production publication or change indexing
visibility. Metadata expands actual topic names including photovoltaics (PV),
concentrated solar power (CSP), hydrogen, biogas and electric mobility. Six new
served illustrations have explicit media references; the existing wind result
is reused. The preserved strategy is a repository reference outside the public
catalog. Local rebuild synchronizes these static projections and their spelling
vocabulary. The final-content sanity check above remains pending.
See [sources and destinations](research-domains.md).

## Homepage LinkedIn references — 2026-10-09

The [news module](home-news.md) registers its localized `news-events` section
and stable card anchors. The five owner-requested short editorial titles are indexed in FR/EN/AR, each
with its explicit localized text. Full-post translations are not inferred. A
future API importer must use CMS publication/locale gates and withdrawal handling.
The final-content glossary and search sanity-check reminder remains pending.

## Homepage achievement references — 2026-10-10

The [achievements module](home-achievements.md) adds eight stable child anchors
under `results` and eight explicitly registered static media references. FR/EN/AR
metadata includes contribution descriptions and real topic terms, without new
broad synonym aliases. Page and section bodies include the new content. Static
synchronization uses the catalog revision; rebuild the index after updating.
The supplied report cover is media, not an available full report download.
Repository references and source filenames are outside the public index.

## Valorisation patent catalogue — 2026-10-10

The owner-selected minimal patent database registers all 59 current records in
FR/EN/AR at `#patent-{reference}` on the canonical transfer page, plus its revised
sections and figures. Original bibliographic titles and applicants accompany
localized source-derived descriptions and thematic terms. No original workbook,
project relationship or annuity field enters search. Removing a JSON record
withdraws its projection and vocabulary on catalog synchronization/rebuild.
See [database maintenance](valorisation-patents.md).

## Semantic resource types — 2026-10-10

Search distinguishes `publication`, `report`, `patent` and `project` from
`page`, `section`, `news`, `document` and `media`. FR/EN/AR filters, result badges,
header suggestions, API validation and PostgreSQL facets share the same type
catalogue. Classification comes from explicit resource projections, never a
keyword, filename, page name or query. A publications/projects overview remains
a page; its actual resource records receive their own type when commissioned.

The 59 public patent records now use `patent`, retaining their stable
`section:transfer:patent-{reference}:{locale}` identities and canonical anchors.
The historical identity prefix does not determine the result type. Individual
patent titles/descriptions are indexed only in those record projections; generic
page/section copy remains website content. Apply
`20261010_230000_search_resource_types` before running the updated app, then rebuild
or let catalogue initialization refresh static documents and spelling vocabulary.

Intentionally served publication/report files can use the corresponding explicit
`PublicAssetReference.type`; their existing file previews remain available.
Generic CMS uploads remain documents/media until an explicit editorial subtype
and its guarded projection are commissioned. The staged 1,181 publication records,
unavailable full reports and future project records remain outside search. Adding
filters authorizes no new content, download, route or publication. Future resource
projections require reachable destinations, localized approved metadata and the
publication/withdrawal gates described above.

## Careers opportunities — 2026-10-10

[Careers](careers.md) registers its localized page/sections and served assets.
The opportunity collection extends the guarded public-source view, indexing
triggers and rebuild queue. Only open, non-demo, published and locale-approved
complete notices enter section/document results and spelling vocabulary.
Local mockup records and controls are excluded; closure, withdrawal and deletion
revoke current eligibility before asynchronous reindexing.

## Institute projection — 2026-10-11

The [Institute page](institute-page.md) includes complete localized mission,
positioning, values, ambition, history and report-teaser text in its static page
and section projections. The history includes eight major dates and the explicit
2025 / 2012–2015 supporting entries. Canonical section anchors are registered in
FR/EN/AR; source attachments and editorial repository drafts remain private/excluded.
Existing solar-sunset/workshop asset references are reused. Owner-requested `#`
report actions create no PDF asset or document result; register the actual PDF
with verified metadata when it is supplied. The final-content glossary/search
sanity check remains pending.

Owner follow-up: the first-page mockup cover image is served and registered as
`institute-fifteen-year-report-cover` in each locale, with descriptive text and
original “15 ANS D’IMPACT” wording. The nine-page source PDF and remaining pages
are excluded; the actual report actions stay on `#`.

## Programmes R&D&I projection — 2026-10-11

The programmes page and six legacy sections include their complete localized manuscript bodies, functions, expected benefits, usual stages, historical schemes and dated 2025/69-project reference. The new prototyping illustration is registered once in FR/EN/AR; existing hero/AquaSolar originals keep their media identities. Private source files, fictional calls and their dates are excluded. See [scope](programmes-rdi.md).

## CMS calls — 2026-10-11

The owner adds the Calls collection and reachable detail pages. Its public source view and insert/update/delete triggers project complete approved localized metadata as `calls:{id}:{locale}` page results. Closed/cancelled records retain archive discovery; withdrawal/deletion immediately removes eligibility and spelling contributions. PDFs retain their independent guarded Media document identity. Programme section metadata describes discovery without unconditional empty-state claims. See [schema and workflow](calls-for-projects.md).

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

## PV media previews — owner bug report, 2026-10-11

The PV → media filter exposed a missing Next Image allowlist entry for project
thumbnails. `/images/projects/**` and the likewise omitted `/images/careers/**`
are now eligible for static image optimization, with empty query strings only.
Guarded CMS uploads remain outside the optimizer cache. Browser regression checks
cover the PV media result page in FR/EN/AR and every eligible registered static
raster preview. AI-generated image exclusion remains independent and unchanged.

## Release preparation — 2026-10-12

The new `usefulLinks` page, `mapping-tools` section and four per-tool anchor
references describe all owner resources in each locale. Withdrawn project records/PDFs and six card illustrations
are absent; only the retained hero and truthful empty catalogue remain. Static
catalog revisions withdraw obsolete entries/vocabulary when synchronized.

API and server-rendered search now share the 60/minute PostgreSQL quota. API
rejections return 429/Retry-After; the page shows localized waiting copy. See
[security](security-and-privacy.md) for trusted-proxy and expiry requirements.
The final multilingual content sanity check remains open until editorial content
and terminology are approved.

## Source-backed project discovery — 2026-10-15

The owner's real-project import supersedes the empty-catalogue projection. Payload
Projects has a guarded live source view, queued update/delete indexing and stable
project results opening the restored detail reader. Approved image/portrait results
use no-store endpoints that recheck the same project/locale. No counters, fabricated
notes, private evidence or unapproved EN/AR translations are indexed. The local
review opt-in never expands search eligibility. See [scope](projects.md).

Project PDF discovery uses one `document` result per eligible locale/reference and a guarded local note endpoint. Missing, stale, withdrawn and unapproved notes are excluded by the live source view. The owner-withdrawn historical-source notice is removed from page search metadata; current PDF contents remain unchanged pending the updated project list.

## University and establishment identities — 16 October 2026

The [sourced national identity reference](references/university-registry/README.md)
connects direct establishments to their university through explicit IDs. Existing
public project, laboratory and static/CMS resource metadata includes relevant
names and aliases in the available source languages. Searching an establishment
can identify its parent; searching a parent can retrieve its actual affiliated
resources. Shared acronyms never select an arbitrary campus, and a parent-only
resource does not invent participation by all its children. Registry records do
not become new standalone public search results. No new filter controls are added.

Run `pnpm search:rebuild` after identity/alias changes to refresh CMS projections
and spelling vocabulary alongside the static catalogue. This does not change
publication approval, review-locale eligibility, projects or their PDF revisions.
The final-content search sanity check remains pending.

## Dedicated patent catalogue — 2026-10-16

The Resources `patents` page has its own localized page reference and metadata.
Existing granted-patent search records retain their stable IDs, but their canonical
URLs now use `pageHref('patents', locale, patentAnchor(reference))`. The shared
catalogue remains on Transfer for existing links; no duplicate patent result is
registered. The new page adds no hero media. Rebuild the local index after this
projection change; CI and production release remain separately paused.

# Immediate sorting — 19 October 2026

The search sort selector applies on change without an Apply button in FR/EN/AR.
It submits the existing localized search form, retaining the query/type and
resetting pagination. Existing result metadata and search eligibility are unchanged.
The browser journey asserts automatic navigation and absence of a submit button.
Scoped ESLint, formatting and whitespace checks pass; browser execution and final
CI remain pending behind the shared-checkout coordination hold.
