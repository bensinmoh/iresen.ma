# Deployment and operations

Public search now requires the reviewed PostgreSQL search migration and `pg_trgm`
extension. Run `pnpm search:rebuild` against the intended environment after
migration and when registering new static resources. The app starts its bounded
index worker on CMS initialization or first search; environments without a
persistent Node process must schedule `pnpm search:work` or provide an equivalent
durable worker. Set `SEARCH_WORKER_DISABLED=true` only when that separate worker
owns processing. Monitor pending jobs and retries without recording query strings
or content. Install `poppler-utils` on the worker host for approved uploaded PDF
text extraction; metadata and localized `searchText` remain available without it.
See [search operations and publication boundaries](search.md).

The relevance migration adds a per-document spelling vocabulary and queues CMS
sources for reindexing. Apply it before starting the updated server, then rebuild
the public index. The existing indexing worker maintains both documents and
vocabulary; corrections and curated related topics require no external API or
model service. Both results and suggestions recheck current public eligibility.

For local/standalone filesystem storage, set `CMS_UPLOAD_DIRECTORY` to the same
absolute persistent directory in the web server and index worker. The repository
launcher resolves its default to the root `.local/uploads` before standalone
startup changes directories. This setting does not replace the approved object
storage requirement for production.

Production hosting and the canonical domain are not yet approved. Development setup does not authorize production deployment, DNS changes or repository visibility changes.

## Environment separation

Use separate databases, secrets, media buckets and mail recipients for development, restricted staging and production. Previews use synthetic data and remain non-indexable. Restrict remote preview access with authentication; `robots.txt` is insufficient.

The application is a portable Node.js server backed by PostgreSQL. Local media storage is for development only. Select an approved S3-compatible production region/provider, mail adapter, identity gateway/MFA and durable worker/scheduler before their dependent features go live.

## Proposed release sequence

1. Approve hosting/data-flow assessment, service ownership, domain and production configuration.
2. Build the locked application and verify lint, types, focused tests and browser journeys.
3. Back up the database/media; review and apply explicit database migrations.
4. Deploy the server as a non-root process with HTTPS and configured security/caching boundaries.
5. Verify restricted admin, public projections, real mail delivery, worker execution, published-locale SEO and health checks.
   When the complete website content is ready, remind the owner to run the
   [final content search sanity check](search.md#final-content-search-sanity-check):
   review the multilingual glossary and related terms, rebuild search and verify
   representative queries.
6. Enable indexing only after approved copy/translations, legal information and release authorization.

Never use development schema push against production. Rehearse migrations and rollback/recovery with representative staging data. A production build passing does not prove deployment readiness.

## Operations to complete

Name owners for uptime, failed jobs/mail, storage, credential rotation and incident response. Configure protected redacted alerts. Agree recovery targets; the brief proposes RPO ≤24 hours and RTO ≤8 hours, which require an actual restore exercise.

Document provider regions/costs, backup retention, exit/export procedures and institutional recovery access. IRESEN must control repository, domain and service ownership. LinkedIn and other optional integrations cannot be required for public rendering.
