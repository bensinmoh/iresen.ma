# Contributing

Read [instruction.md](instruction.md), [architecture](docs/architecture.md) and [backlog](docs/backlog.md) before implementation. Keep code and technical documentation in English; the public interface serves French, English and Arabic.

Follow README setup commands and use the committed pnpm lockfile. Use a focused branch/PR for an increment. Preserve unrelated changes and never commit secrets, real personal data, private references or generated uploads. Code/content licensing remains an institutional decision.

Use stable page IDs and central localized paths, semantic CSS tokens, server authorization and explicit public projections. Empty collections stay empty until approved content is supplied. UI catalogs require all three languages, and Arabic needs RTL/long-content verification.

Before requesting review, run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`; run the documented browser checks when changing navigation, locale routes or authorization. Report exactly what was verified and any external dependency. Avoid broad tests that merely restate implementation.

Do not deploy production, alter repository visibility/DNS, introduce an automatic license or announce institutional claims without explicit authority. Remote repository governance and release tasks are separate from local feature work.
