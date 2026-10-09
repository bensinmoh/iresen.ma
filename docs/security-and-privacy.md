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
- Use baseline security headers now; verify production CSP, cookies, HTTPS and HSTS against the final domain/runtime.

Production requires supported MFA/SSO, shared rate limits, scoped service accounts, redacted audit/error logs, private upload validation, encrypted backups, recovery tests and patching ownership. OWASP ASVS Level 2 and DGSSI web-application guidance are engineering references; conformance needs evidence.

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

The contact location section includes Google Maps as a third-party embed. The
owner's explicit 2026-10-09 refinement supersedes the earlier on-demand
presentation: its iframe is rendered directly in the server HTML with native
`loading="lazy"`. There is no reveal/remove control, persisted preference or
lower explanatory strip. Browser lazy loading may defer the request until the
map approaches the viewport; it is not a consent mechanism. Loading the map
sends browsing data to Google. `referrerPolicy="no-referrer"` limits the referrer
without preventing the third-party request. The cookies-page service notice
identifies the map's automatic loading and external data flow. The separate
directions link opens the exact owner-supplied Google Maps shortlink. Its
destination and the address-query embed's exact pin remain unverified.
See [map behavior and limits](contact.md).

No separate analytics trackers, CAPTCHA or newsletter processing are added by
this contact change.
Review the map's third-party terms, consent, data flows and applicable institutional
requirements before release; this implementation is not a compliance assessment.
Public CMS media is unsuitable for CVs or other private submissions.

See [backlog](backlog.md) for release prerequisites and [SECURITY.md](../SECURITY.md) for reporting guidance.
