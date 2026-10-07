# Deployment and operations

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
6. Enable indexing only after approved copy/translations, legal information and release authorization.

Never use development schema push against production. Rehearse migrations and rollback/recovery with representative staging data. A production build passing does not prove deployment readiness.

## Operations to complete

Name owners for uptime, failed jobs/mail, storage, credential rotation and incident response. Configure protected redacted alerts. Agree recovery targets; the brief proposes RPO ≤24 hours and RTO ≤8 hours, which require an actual restore exercise.

Document provider regions/costs, backup retention, exit/export procedures and institutional recovery access. IRESEN must control repository, domain and service ownership. LinkedIn and other optional integrations cannot be required for public rendering.
