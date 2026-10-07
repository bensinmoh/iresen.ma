# ADR 0001: One modular trilingual application

Status: accepted for the development foundation · 2026-10-07

## Context

The new institutional website needs French, English and Arabic public pages, a controlled publishing interface, durable structured content and portable server deployment. The existing repository has no application to preserve.

## Decision

Use a compatible stable Next.js App Router/Payload 3 pair, React, strict TypeScript, Tailwind CSS, next-intl and PostgreSQL. Pin dependency and tool versions, use pnpm with a committed lockfile, and record the selected versions in the README. Keep public routes, CMS authorization, content projections and external integrations in separate modules inside one application.

Use French as the default editorial language and prefix all three locale URLs. Keep stable page IDs with localized paths. Separate UI catalogs from CMS translations, and require explicit publication eligibility for each content locale.

Select the Next.js version from Payload's supported range rather than independently selecting each package's latest release. Use Node.js LTS; verify the resulting production build and CMS behavior together.

## Consequences

The application requires a server and PostgreSQL. A static export cannot supply CMS administration or server-side contact delivery. Public content and admin share a runtime, so bundle boundaries, authorization and cache rules need explicit verification.

No additional ORM, Redis, dedicated search service or microservices are introduced for the foundation. Media/email/identity providers remain configuration decisions. A search engine or queue may be introduced later only after requirements justify the operational cost.

The owner supplied seven current SVGs and the color-book/narrative PDFs individually. Public vectors retain source bytes and the PDFs stay private. Final website primary blue is the color-book value `#296BB4`, matching every current blue-bearing SVG, including the corrected favicon. Superseded source versions remain private. These inputs support the branded foundation; missing design exports, imagery and licensed fonts are later visual-work dependencies rather than a foundation blocker.
