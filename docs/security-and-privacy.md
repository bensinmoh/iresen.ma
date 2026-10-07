# Security and privacy

The foundation is a development environment, not a production compliance assessment. Do not collect real personal data or publish a preview publicly before its access controls and applicable institutional requirements are reviewed.

## Engineering boundaries

- Keep secrets server-side and out of `NEXT_PUBLIC_*`, repository files, browser bundles and logs.
- Enforce roles, fields, publication state and locale eligibility through server access rules. Explicitly apply authorization in Payload Local API reads.
- Use a controlled first-administrator bootstrap; never ship a shared/default password or leave public account registration enabled.
- Keep private references, database dumps, local uploads and personal records outside committed/public assets.
- Validate server input, project public fields and avoid unsanitized HTML or arbitrary remote fetch URLs.
- Test draft/private media access through direct APIs as well as the public website. Robots directives do not protect secrets.
- Use baseline security headers now; verify production CSP, cookies, HTTPS and HSTS against the final domain/runtime.

Production requires supported MFA/SSO, shared rate limits, scoped service accounts, redacted audit/error logs, private upload validation, encrypted backups, recovery tests and patching ownership. OWASP ASVS Level 2 and DGSSI web-application guidance are engineering references; conformance needs evidence.

## Privacy and institutional review

Before live contact/recruitment/analytics collection, document purposes, controller, legal basis, recipients, required fields, retention, rights handling and CNDP notification/authorization obligations under Law 09-08. Assess transfers for every hosting/database/storage/mail/monitoring provider. Do not invent CNDP numbers or rights-request contact details.

Responsible IRESEN legal/IT teams must determine system/data classification and applicability of Law 05-20, DNSSI and relevant cloud requirements including Decree 2-24-921. Do not infer blanket residency rules from the institution's name.

No third-party trackers, external embeds, maps, CAPTCHA or newsletter processing are required for the foundation. Evaluate consent and data flows before introducing them. Public CMS media is unsuitable for CVs or other private submissions.

See [backlog](backlog.md) for release prerequisites and [SECURITY.md](../SECURITY.md) for reporting guidance.
