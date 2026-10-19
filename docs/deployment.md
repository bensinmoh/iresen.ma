# Deployment and operations

Status: prepared source, not a deployed or institutionally approved production
system. Existing providers manage hosting and the domain; traffic uses Cloudflare.
IRESEN IT coordinates the release. [French handover](it-handover.fr.md).

## Provider prerequisites

Confirm Linux/container or persistent Node hosting, Node 24.22.0, pnpm 11.28.2,
PostgreSQL (local/CI 17.11), `pg_trgm`, database migration access, persistent media,
HTTPS origin certificate, backup/restore access, monitoring and a durable search
worker. This is a server application, not a static PHP/WordPress upload or static
export. The provider must confirm capacity and regions; no production sizing or
residency approval is inferred from local tests.

Assign owners: hosting provider (runtime/database/storage/backup), domain provider
(domain ownership/DNS coordination), Cloudflare administrator (edge/TLS/WAF/cache),
IRESEN IT (secrets, access, release and incident response), editorial/legal teams
(content, translations, notices and privacy obligations).

## Reproducible package

Use a clean checkout of the checked revision and the frozen lockfile. Build once;
promote the same artifact. Never expose `.git`, `docs`, source references, `.env`,
local uploads, test artifacts or database backups from the web root.

The Dockerfile provides `runtime` (standalone app, non-root, root-owned code) and `operations`
(migrations/index CLI, non-root). `.dockerignore` removes private/review/build files.
The build needs ephemeral server settings because Payload configuration is loaded;
pass them through a BuildKit secret, never build arguments or committed files:

```sh
docker build --target runtime --secret id=build_env,src=/secure/build.env -t iresen-web:REVISION .
docker build --target operations -t iresen-operations:REVISION .
```

`build.env` uses an approved build configuration, `NEXT_PUBLIC_SITE_URL` set to the
final HTTPS origin, and no production data accessible during build. Local images were built and inspected (UID1000, no internal docs/tests/build .env);
IT must scan the final image for the approved platform/registry before release. Node base-image digest pinning,
registry policy and platform support must be confirmed by the hosting provider.

For direct Node hosting, include `.next/standalone`, `.next/static` and approved
`public` assets together, preserve their relative paths and start `node server.js`.
Only the image cache and upload directory are writable by the runtime user. A
read-only root filesystem with explicit writable cache/upload mounts and `/tmp`
is recommended for provider staging. The repository's `pnpm start` assembles those static directories for local review.
Do not ship the whole checkout or a development server.

## Configuration and data

Runtime settings: `DATABASE_URL`, `PAYLOAD_SECRET`, approved canonical URL,
`PUBLIC_RELEASE=true`, `CMS_ADMIN_ENABLED=false`, `CMS_LOCAL_REVIEW=false`,
`CMS_INTERFACE_PREVIEW_ENABLED=false`, `SITE_INDEXING_ENABLED=false` initially.
Use distinct secrets/databases for development, restricted staging and production.
Protect and rotate secrets outside images and logs. Do not bootstrap a shared account.

Set `CMS_UPLOAD_DIRECTORY` to an absolute persistent directory shared by web and
worker. Configure a private approved storage service before introducing CMS uploads
in production; an object-storage adapter is not currently delivered. Never expose
its private files directly, including through a CDN bucket URL. Keep current media
publication/locale checks and no-store delivery, including withdrawal of derivatives.

Search needs the registered explicit migrations, `pg_trgm`, `pnpm search:rebuild`
and either the bounded persistent in-process worker or a durable external
`pnpm search:work` schedule. Set `SEARCH_WORKER_DISABLED=true` only for that latter
arrangement. Install Poppler for approved uploaded-PDF extraction. Monitor jobs,
retries and limiter expiry without storing queries/IP addresses in application logs.
Expired limiter windows are purged in bounded batches during subsequent searches.

## Release procedure

1. Confirm provider prerequisites, secret ownership, final domain, content/translation
   review, notices and privacy/data flows. Keep staging private and non-indexable.
2. Run current-head CI and staged production-browser/security smoke checks.
3. Back up database and media; verify that restore and prior artifact are available.
4. Run explicit migrations with the operations image, then rebuild the search index.
   Never use development schema push against production.
5. Start the non-root web image with runtime secrets, persistent storage and an
   internal port; check `/fr`, `/en`, `/ar`, search and published media.
6. Configure HTTPS/Cloudflare and verify the checks below with IT before traffic
   cutover. Run the final multilingual content/search sanity check when copy is final.
7. Enable indexing only with final editorial/legal approval and explicit release
   authorization. DNS/traffic cutover are separate operations by the providers.

Rollback: restore the previous checked image/configuration. The added quota table
is compatible with the earlier application, so do not run destructive down migrations
as routine rollback. For future incompatible migrations, rehearse backup restoration
and data recovery first. Never restore a stale backup without assessing later writes.

## Cloudflare and origin controls

- Use [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/)
  with a valid origin certificate and HTTPS redirect. Protect the origin against
  direct bypass (provider firewall/allowlisted Cloudflare traffic or a controlled
  tunnel). Review [origin protection](https://developers.cloudflare.com/fundamentals/security/protect-your-origin-server/).
- Configure managed WAF and edge request/body/rate limits suitable for the subscribed
  plan. These are IT settings, not already configured services. Keep database ports
  private. Enable HSTS only after final domain/subdomain HTTPS validation.
- Strip untrusted forwarding/IP headers; overwrite the selected
  `TRUSTED_PROXY_CLIENT_IP_HEADER` (`cf-connecting-ip` or `x-real-ip`). The application
  quota is 60 searches/minute, shared across instances and API/page searches.
- Bypass CDN/browser cache for HTML carrying per-request CSP nonces, all API endpoints,
  admin/review routes and access-controlled CMS bytes. Never override private/no-store
  with “Cache Everything”. Cache immutable fingerprinted assets separately. Review
  [Cloudflare cache behavior](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/).
- Keep Next image optimization limited to approved static paths. CMS bytes bypass
  independent image caches; do not create public storage aliases that defeat withdrawal.
- Confirm CSP script nonces, Google Maps after consent, secure cookies, real 404s for
  private routes and no leaked build secrets. Review Cloudflare-added cookies/scripts
  (including analytics/challenges) against notices and the consent inventory.

## Operations and institutional review

Name owners for uptime, security patches, expiry/worker jobs, storage, secret rotation,
redacted alerts and incidents. Agree resources and recovery targets; proposed RPO
24h/RTO 8h require a restore exercise. Document backup retention, regions, costs,
exit/export and IRESEN recovery access.

IT/legal must review cookie management, privacy, terms/conditions within legal notices,
controller/hosting/publication contacts, Law 09-08/CNDP obligations and provider data
transfers. No regulatory identifiers or retention periods should be invented. Email
is still composed locally; CMS delivery, online intake and MFA/SSO are not delivered.
The authenticated custom CMS is available on `/admin` when `CMS_WORKSPACE_ENABLED=true`, including public release (owner instruction, 19 October 2026). Native Payload administration, raw collection APIs and `/cms-preview` stay closed.

## On-demand collaborative-project PDFs — 16 October 2026

Visitor downloads require Chromium plus the pinned production `playwright-core`
dependency. The runtime Docker stage installs Debian Chromium and sets
`PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium`. Direct Node hosting must supply a
compatible executable and set that absolute path. Chromium requires executable
temporary storage; allow its child processes and include it in provider resource
sizing. Two renders run per process, with at most eight distinct pending requests.
The new Docker layer has not been built locally during the shared hold.

Next tracing includes the two embedded font files and original brand SVG for the
PDF route; retain their relative paths in standalone output. Project images use
the existing external `PROJECTS_ASSET_DIRECTORY` mount. No static project PDF set
or writable PDF directory is required. The old notes directory and database table
are optional archival/export compatibility only. Cache is process-local, up to
20 MiB/32 entries, ten minutes; restart discards it. It does not authorize content.
See [implementation and check ledger](project-pdf-on-demand.md).

## Authenticated CMS deployment — 19 October 2026

The owner now authorizes the authenticated custom `/admin` workspace in public
release, superseding the earlier local-only restriction. Use
[the production environment template](../.env.production.example) and set
`PUBLIC_RELEASE=true` with `CMS_WORKSPACE_ENABLED=true`. Keep native admin and
local review flags false. Restart the deployed application using this revision;
changing variables on an older revision will not remove its 404 gate.

Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin before the build and at runtime.
Provision persistent PostgreSQL and upload/project-asset storage. Apply
`pnpm cms:migrate` and `pnpm search:rebuild` against the deployment database using
the operations image. Local database records/accounts are not transferred by a
code deployment. For a fresh database only, run `pnpm cms:bootstrap` with explicitly
supplied `CMS_BOOTSTRAP_EMAIL` and a new `CMS_BOOTSTRAP_PASSWORD` (at least 16
characters) temporarily injected as secrets; remove these bootstrap variables
afterward. Existing accounts must be managed by an administrator.

Verification ledger: 19 targeted security-policy/origin tests passed; targeted ESLint and whitespace checks passed; isolated production build (including TypeScript) passed. Production-mode HTTP checks: `/admin` and `/fr` 200; unauthenticated session/content 401; raw `/api/users`, native account administration and `/cms-preview` 404. No provider deployment or data transfer performed.
