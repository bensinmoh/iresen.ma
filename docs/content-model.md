# Content model

The foundation starts empty. It introduces users, institutional pages, news and media rather than loading fictional institutional fixtures. Collection definitions in `src/cms/` are the authority for implemented fields and permissions.

## Foundation rules

| Entity              | Purpose                                                         | Public boundary                                                                   |
| ------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Users               | CMS identities and roles                                        | No public reads or public registration after controlled bootstrap                 |
| Institutional pages | Stable page ID, translated sections and metadata                | Published records with an eligible translation only                               |
| News                | Localized articles and press releases                           | Same publication/translation checks as pages                                      |
| Media               | Authorized uploaded files, alternative text, credits and rights | Approved public files only; private source material stays outside this collection |

Separate editorial state from locale eligibility. A globally published document does not establish that every translation is complete. Missing translations cannot silently fall back to French on an Arabic indexed URL.

Public queries select the necessary fields explicitly. Internal notes, review evidence, account details and private contact information cannot enter those projections. Local API reads explicitly enforce access; direct HTTP APIs also require tests against draft disclosure.

## Role model

Administrators manage accounts and technical configuration. Editors prepare drafts and submit for review. Reviewers approve/publish/withdraw. Translators update authorized translations without acquiring publication or account authority. Authorization belongs on server operations and fields; hiding an administrative button is insufficient.

Production requirements include narrow locale permissions, audit/revisions, preview, scheduling, archive/withdrawal, redirect records and publication-triggered cache/search invalidation. Track implemented behavior separately from these requirements in the [backlog](backlog.md).

## Expansion after the foundation

Add reviewed key figures, priorities, programmes, projects, platforms, expert networks, events, publications, opportunities/calls and shared taxonomies incrementally. Keep partners as relationships rather than duplicating names/logos. Each public type needs stable IDs, localized slugs, appropriate dates, owner, rights and SEO.

Contact requests and LinkedIn import queues are private operational collections. Neither belongs in public listings. Homepage inclusion is a curated selection separate from publication visibility.
