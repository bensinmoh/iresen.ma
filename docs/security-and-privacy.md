# Security and privacy

The foundation is a development environment, not a production compliance assessment. Do not collect real personal data or publish a preview publicly before its access controls and applicable institutional requirements are reviewed.

## Engineering boundaries

- Keep secrets server-side and out of `NEXT_PUBLIC_*`, repository files, browser bundles and logs.
- Enforce roles, fields, publication state and locale eligibility through server access rules. Explicitly apply authorization in Payload Local API reads.
- Use a controlled first-administrator bootstrap; never ship a shared/default password or leave public account registration enabled.
- Keep private references, database dumps, local uploads and personal records outside committed/public assets.
- Validate server input, project public fields and avoid unsanitized HTML or arbitrary remote fetch URLs.
- Test draft/private media access through direct APIs as well as the public website. Robots directives do not protect secrets.
- Public search rechecks current publication, locale and source revision before
  returning indexed text. Media bytes use canonical published metadata and
  `private, no-store`; CMS file URLs are excluded from Next's independently
  cached image optimizer so withdrawal cannot be bypassed by cached derivatives.
- Public HTML now carries per-request nonce CSP, frame/object restrictions and private/no-store. Secure CMS cookies and origin-only CORS/CSRF remain. Verify actual HTTPS/HSTS and the final proxy contract with IT.

The public release closes administration and non-public CMS REST/server-function operations. Search now has a PostgreSQL-backed 60/minute shared quota with HMAC client keys, bounded expiry and 429/Retry-After on the API. A future private administration needs supported MFA/SSO. Production still requires edge limits, scoped service accounts, redacted audit/error logs, upload validation, encrypted backups, recovery tests and patching ownership. OWASP ASVS Level 2 and DGSSI web-application guidance are engineering references; conformance needs evidence.

## Privacy and institutional review

Before live contact/recruitment/analytics collection, document purposes, controller, legal basis, recipients, required fields, retention, rights handling and CNDP notification/authorization obligations under Law 09-08. Assess transfers for every hosting/database/storage/mail/monitoring provider. Do not invent CNDP numbers or rights-request contact details.

Responsible IRESEN legal/IT teams must determine system/data classification and applicability of Law 05-20, DNSSI and relevant cloud requirements including Decree 2-24-921. Do not infer blanket residency rules from the institution's name.

The contact page prepares an email in browser memory, using the established
institutional address as the recipient. It does not submit or store form data
through the website; the visitor opens, reviews and sends the draft with their
own email application. Name, email, topic and message are required to compose
the draft; organisation and phone are optional. Direct email and telephone links
remain available without JavaScript. This local composing workflow does not
implement a server-side intake or establish delivery, retention or a response time.

The contact location section includes Google Maps as an optional third-party
embed. The owner's 2026-10-12 cookie-management request supersedes automatic
loading: no iframe is rendered before explicit external-service permission.
Refusal and withdrawal retain the original directions link and remove the map.
`referrerPolicy="no-referrer"` limits the referrer after permission but does not
prevent Google data flows. See [consent inventory and behavior](cookie-consent.md)
and [map source](contact.md). No analytics, CAPTCHA or newsletter processing is
introduced. Production legal/IT review remains required; a consent banner is not
a complete compliance assessment.
Public CMS media is unsuitable for CVs or other private submissions.

See [backlog](backlog.md) for release prerequisites and [SECURITY.md](../SECURITY.md) for reporting guidance.

The 2026-10-12 owner-requested [public notices](utility-pages.md) now describe actual
browser/email/Maps behavior and Law 09-08 rights in FR/EN/AR. Association status is
owner-confirmed; unavailable hosting, publication-officer and operational-retention
facts are not invented. Complete these operational inputs before live use. Public
copy does not assert regulatory approval or whole-site conformity.

Owner follow-up — 2026-10-12: the footer retains its Cookie preferences link
without a duplicate Manage my cookies button. The linked page opens preferences;
first-visit and blocked-map controls remain.

## Public release hardening — 2026-10-12

`PUBLIC_RELEASE=true` overrides administrative opt-ins. Public CMS bytes remain
accessible only through their existing publication/locale access checks. The
REST collection/auth endpoints and server functions are unavailable by default
in production; local administrative development remains separate. CSP retains
inline styles for existing React/native responsive UI, but scripts require a
per-request nonce. No production unsafe-eval or external framing of HTML is permitted. Same-origin
PDF child previews remain allowed; baseline SAMEORIGIN file framing and existing
publication/locale byte checks are preserved.
Nonce HTML must not be shared-cached by Cloudflare.

Both API and server-rendered searches consume the same atomic 60/minute database
quota. Configure the trusted IP header only behind an origin that cannot be
bypassed and a proxy that strips/replaces it. Otherwise clients share an
unattributed quota. Invalid inputs are rejected before search; a limiter failure
fails closed with an unavailable state. Expired HMAC keys are removed in bounded
batches on subsequent searches; database backups/retention remain IT responsibilities.

Dependency audit initially reported 14 advisories; compatible undici/DOMPurify/
esbuild corrections and a maintained Sass remove those reported paths. The final
production dependency audit reports zero known advisories at the audit date. This
is registry evidence, not proof of a vulnerability-free application. See
[preparation report](public-release-preparation.md) for test coverage and limits.

Public REST media reads on the closed server strip authentication cookies and
Authorization before Payload resolves access. An old staff/API token cannot
turn a public byte request into a private-media read. Range/locale headers are
retained. Explicit local administrative mode keeps its authenticated behavior.
