# ADR 0005: Live published-content search behind a replaceable adapter

Date: 2026-10-09 · Status: Adopted for current search scope

## Context

The owner requested functional keyword search with a page of destination links
and an animated header input that expands to the left. The existing application
has 16 principal routes, empty-by-default page/news collections and PostgreSQL
through Payload. Public reads already enforce publication, visibility and locale
eligibility. The broader brief anticipates French/English full-text search,
Arabic normalization/trigram matching and asynchronous index updates across
further content collections.

## Decision

Implement the current search as a server-only, replaceable adapter over live
access-enforced Payload/PostgreSQL reads. Merge complete published locale pages
with canonical route documents and read all eligible news in 100-record batches.
Use localized section heading titles as topic keywords, excluding every scaffold
description so editorial placeholders cannot masquerade as institutional content.
Normalize and rank public text in memory with weighted title/exact/prefix matches
and conservative Arabic definite-article variants. Preserve original text in
excerpts and never use CMS translation fallback.

Use native GET forms and the canonical localized search route, keeping `q` and
pagination in the URL. Search results are `noindex` and excluded from the XML
sitemap. Render current published page bodies and selected news articles so
every CMS search destination can show its public content, including older news.
Keep page/home section scaffolds alongside published bodies and news content
within the all-news section. Only search replaces its hero/scaffold with the
functional form and result states, preserving supported search fragments.

Add no service, dependency, schema migration or stored search index. Publication,
withdrawal and deletion apply on the next request through the same public access
boundary. Invalid queries avoid CMS work; a CMS outage retains canonical route
discovery with explicit partial-content feedback.

## Consequences and deferred requirements

This delivers actual search for the current corpus while avoiding a separate
index's synchronization and withdrawal risks. It uses PostgreSQL for persistence,
but matching is not native PostgreSQL full-text, stemming, trigram or fuzzy typo
retrieval. It deliberately defers the broader brief's asynchronous index/rebuild
mechanism and language retrieval work, rather than claiming those are complete.

Batching bounds each database read, not the complete request. Every valid query
scans eligible news; latency and memory grow with the corpus. Measure a
representative corpus before launch. Replace retrieval behind `SearchAdapter`
when measured latency/memory or language relevance requires indexed search,
preserving access/locale exclusions, stable URLs and immediate withdrawal.

Future index work needs idempotent publication/update/withdrawal hooks, full
rebuilds and verified removal of missing/private translations. New collections,
filters and authorized document extraction should enter search only after their
schemas and public destinations exist. The current content model and canonical
route structure remain authoritative.

See [the search guide](../search.md), [architecture](../architecture.md) and
[backlog](../backlog.md) for behavior, limits and follow-up work.
