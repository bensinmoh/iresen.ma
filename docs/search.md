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
