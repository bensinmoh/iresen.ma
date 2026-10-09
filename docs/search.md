# Site search

Implemented scope · 2026-10-09. Search complements the existing navigation and
sitemap, helping visitors reach real localized pages and published articles.
The owner requested keyword entry and a page of links, then clarified that the
header control should expand to the left on hover.

## Visitor behavior

The header magnifier expands the white input physically left over 220ms, keeping
its right edge stable in FR/EN/AR. Mouse hover reveals the localized placeholder;
the icon stays fixed throughout the reveal, and the field width is capped at the
available space to the shared container's left edge, including Arabic layouts.
Keyboard focus also opens it. Tapping an empty control focuses the input.
Enter or the magnifier submits a native GET form. Escape collapses and returns
focus to the button; outside pointer interaction, focus leaving the form or
pointer departure without internal focus collapses it. Reduced motion removes
the expansion transition. Shared action corners and public fonts still apply.
The header interaction remains available over the homepage's video/photo fallback;
the dedicated results route retains its in-flow header and has no hero media.

The existing localized search route opens directly with its in-flow header,
breadcrumb, heading and visible form, replacing only that page's photo hero and
section scaffold.
It server-renders the search query, result count and an ordered list of links.
Each result includes its title, page/news type, date when relevant, readable
excerpt and localized route. Eight results appear per page. Previous/next links
retain `q`; `page` appears for later result pages. The URL supports bookmarks,
sharing and browser back-navigation. Switching locale retains `q` and starts at
page 1, since result counts and relevance can differ by translation.

Supported search fragments remain on the real interface: `#page-sections` on the
outer search surface, `#search-query` on the form, `#results` on the result/empty/
validation region, `#no-results` on no-match feedback and `#refine-results` on
browse help. Locale navigation preserves these canonical anchors.

Empty search offers existing section links. Invalid input explains the query
limits; no matches suggest broader/fewer keywords. Clear search returns to the
empty form. Sitemap/contact links offer other destinations; the contact route
still has no submission service. A CMS failure retains canonical-page discovery
and displays a partial-content notice instead of implying a complete search.
The results form and links work without JavaScript; compact-menu and sitemap
links provide ordinary access to that form.

Both forms have distinct named search landmarks, real labels and native
`type="search"` inputs. Placeholders supplement labels. Search inputs use
`dir="auto"`, and reflected queries use directional isolation. UI messages are
complete in FR/EN/AR; Plus Jakarta Sans serves Latin and Alexandria Arabic.

## Corpus and publication boundary

The canonical route definition in [src/lib/site.ts](../src/lib/site.ts) remains
the routing authority. Search builds documents for its 16 principal routes,
using existing localized page titles, wayfinding descriptions and section heading
titles. Headings make scaffold topics discoverable as page links; all editorial
placeholder descriptions are excluded, including “Content to add” copy. This keeps
navigation discoverable even when CMS collections are empty.

Published CMS pages enrich those documents with the current locale's title,
summary and rich-text body. A page contributes CMS text only when all three
contain text. Published news creates article results with valid IDs and a
non-future publication date. News links use
`?article=id#news-id` on the existing news route. That route renders the selected
eligible article within its all-news section even if it is older than the latest-12 listing.

Search excludes its own route and the five footer utilities/legal pages. Public
CMS queries explicitly use `overrideAccess: false`, `draft: false`,
`fallbackLocale: false`, `depth: 0` and a selected projection. Payload enforces
global publication, public visibility and publication eligibility in the
requested locale. Drafts, private records, future news and incomplete/missing
translations cannot contribute CMS text. A canonical navigation title can still
appear for an existing page whose CMS translation is unavailable; that is the
existing UI route description, not a fallback CMS translation.

Rich-text extraction reads supported text nodes, excluding embedded uploads,
relationships, editor attributes and link metadata. Results return only public
link metadata and excerpts. Page/home and selected-article rendering uses public
locale reads too. Published page/home bodies render alongside the existing
`PageSections` scaffold; news renders within the all-news section. These bodies
do not populate the individual editorial section briefs. Internal rich-text links resolve only to eligible records;
unsafe external URLs render as text, and depth-zero rendering omits embedded
media/relationships. Collections start empty; this feature adds no institutional
records, claims or publication approval.

## Retrieval, matching and limits

[The server adapter](../src/lib/search/adapter.ts) uses the existing
PostgreSQL-backed Payload Local API. It loads current eligible pages and all
eligible news, reading news in batches of 100 rather than silently truncating
older articles. It builds and ranks transient documents in server memory on
each valid request. Publication, locale withdrawal, privacy changes and deletion
take effect on the next read; there is no stored index to invalidate.

Validation runs server-side before CMS work: at most 120 input characters and
at least two normalized letters/numbers. The page parameter is bounded and clamped to a
valid result page. Repeated/unsupported query values do not become arbitrary
database filters. Matching requires every query word. Exact titles/phrases and
title-word matches rank above summaries, existing navigation keywords and body
text; literal matches rank above prefixes and conservative Arabic variants.
Stable locale-aware title/ID ordering resolves ties. Excerpts select a matching
sentence and retain original display text, clipping long text around a keyword.

Search-only normalization folds case, French accents, ligatures, punctuation,
Arabic diacritics/tatweel and common letter forms. Conservative Arabic
definite-article variants include selected attached conjunction/preposition
forms. Original public text is unchanged. These rules improve word discovery;
they do not provide Arabic morphology, French/English stemming, native PostgreSQL
full-text retrieval, trigram matching or fuzzy typo correction.

Individual database reads are bounded, but the complete live news corpus is
scanned for each valid search. Total latency and memory grow with eligible
content. This is a deliberate small-corpus implementation, with no new service,
dependency, schema migration or database index. Measure a representative corpus
before release and replace the adapter with indexed retrieval when needed.
[ADR 0005](adr/0005-live-published-content-search.md) records the difference from
the broader brief's full-text/indexing requirements and future migration criteria.

Filters for content type, themes and dates, further collections, approved PDF
text, autocomplete, spelling suggestions and persistent search analytics remain
future scope. The adapter does not persist or log queries. GET URLs naturally
appear in browser history and may appear in infrastructure access logs; future
analytics/logging integrations must respect the brief's query-privacy rule.

Search routes stay `noindex` even when public site indexing is enabled, and are
excluded from the XML sitemap. Existing principal-page indexing policy remains
separate from internal search results.

## Practice references and verification

Reviewed sources informed the implementation:

- [Nielsen Norman Group: Search Is Not Enough](https://www.nngroup.com/articles/search-not-enough/)
  supports keeping navigation and browsing paths alongside search.
- [W3C WAI: Search landmark example](https://www.w3.org/WAI/content-assets/wai-aria-practices/patterns/landmarks/examples/search.html)
  informs search landmarks and distinct labels when more than one exists.
- [MDN: Search input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/search)
  informs native field semantics, visible labels, query constraints and form submission.

Unit, database and browser coverage is recorded in
[the validation log](validation.md). Assertions in this guide describe the
implemented contract, not proof that every browser, assistive technology or
future corpus has been assessed. The backlog retains scale, expanded-corpus and
editorial dependencies.
