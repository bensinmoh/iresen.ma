# Architecture

## Current application

One modular Node.js application: Next.js 16.4.1 / React 19.3.1 / Payload 3.90.2,
with PostgreSQL, next-intl and native CSS/Web Animations. Public locale routes use
server rendering, request-time publication checks and no translation fallback.
The central site map holds 24 stable page IDs, plus canonical detail/list aliases.

CMS collections are Users, Pages, News, Media, Opportunities, Calls and Projects.
The retained publication/patent corpora are independent files. The sourced Projects
collection replaces the withdrawn demonstration records; original source/contact
archives and guarded project assets/PDFs remain in external private storage.
EN/AR records retain locale review gates. Search uses
PostgreSQL full-text/trigram projections, explicit static references, current-source
eligibility, vocabulary and durable jobs. Public searches share an atomic database
quota; no Redis/service is added.

Public release defaults close admin, auth, raw CMS collections/mutations and server
functions. Media byte access retains server-side publication/locale rules. Per-request
script nonce CSP requires private/no-store HTML; static fingerprinted assets remain
cacheable. CMS media never uses an independent public image cache. The standalone
package excludes internal references/secrets; the non-root container separates
operations from web serving.

Contact/careers compose local email drafts. Google Maps is optional and consent-gated.
CMS mail delivery and LinkedIn OAuth are not configured. Local CMS interface review
uses isolated browser storage and synthetic review examples, with no career fixtures
or real personal data. Future authenticated administration remains separate.

## Provider boundaries

Hosting and domain providers operate the origin/domain; Cloudflare fronts public
traffic. Regions/capacity, private storage adapter, mail, private identity/MFA,
backup/restore, monitoring and edge rules require provider/IT decisions. See
[deployment](deployment.md), [security](security-and-privacy.md), [handover](it-handover.fr.md).
Historical ADRs retain their dated context; ADR0004 records the authorized route addition.

Runtime and tooling compatibility decisions are recorded in the
[October stack review](stack-maintenance-2026-10.md).
