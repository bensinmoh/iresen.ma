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

## Source-informed editorial recommendations

The [strategy reference index](references/strategy/README.md) records the three supplied DOCX sources and their status. The following recommendations inform future content modelling; they are not implemented collection fields or a validated website structure. Final public copy and translations remain subject to review.

| Future content area              | Recommended information                                                                                                                                                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cases and results                | Need, intended users, IRESEN's contribution and work, partner roles, result, actual stage and documented next step. Distinguish achieved results from expected benefits and 2035 ambitions; include useful knowledge, methods and skills as well as transferable technologies. |
| Key figures and measured effects | Value, unit, metric definition, measurement period/as-of date, scope and method. Economic, environmental or adoption effects need supporting measurement and attribution; a signed agreement or patent does not alone demonstrate funding, transfer or impact.                 |
| Platforms and capabilities       | Uses, available services, actual maturity and availability, access conditions, confirming team and date reviewed. Separate capabilities in development from those currently accessible.                                                                                        |
| Evidence and review              | Internal source, source version/date, claim scope, confirming owner/contact, review status and review date. Store an approved public citation separately where one is available.                                                                                               |

Keep internal evidence, reviewer notes and private confirming contacts out of public APIs, search indexes, downloadable files and the public Media collection. Repository reference storage does not make a source an approved website download. Public records should expose only reviewed claims and approved citations; a source's existence does not establish publication eligibility.

Link reusable priorities, programmes, projects, platforms, partners and resources by stable IDs so cases can connect a need, the work, the capacity used and the result without duplicating records. The three functions and six capacities can guide editorial coverage without enforcing a linear progression or creating additional navigation branches. Maintain one canonical opportunities/calls record for each call for projects, related to its programme and referenced by programme pages, filtered listings and curated homepage links.
