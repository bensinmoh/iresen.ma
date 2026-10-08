# Contributing

Read [instruction.md](instruction.md), [architecture](docs/architecture.md) and [backlog](docs/backlog.md) before implementation. Keep code and technical documentation in English; the public interface serves French, English and Arabic.

Follow README setup commands and use the committed pnpm lockfile. Use a focused branch/PR for an increment. Preserve unrelated changes and never commit secrets, real personal data, private references or generated uploads. Code/content licensing remains an institutional decision.

The owner has authorized automatic completion after passing checks: update affected Markdown documentation and the [changelog](CHANGELOG.md), commit the requested work, merge its PR once the relevant local checks and current CI pass, synchronize the checkout and remove completed task branches and temporary files. Keep unrelated work and local configuration/data intact. A failing or pending check, unmet repository requirement or unresolved conflict stops the merge until resolved; routine completion needs no additional approval.

Use stable page IDs and central localized paths, semantic CSS tokens, server authorization and explicit public projections. Empty collections stay empty until approved content is supplied. UI catalogs require all three languages, and Arabic needs RTL/long-content verification.

For design work, read [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md) and [the design workflow](docs/design-workflow.md). Use relevant repository skills as adaptable guidance; record adopted shared rules and inspect actual responsive/Arabic renderings after visual edits.

Before requesting review for application changes, run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build`; run the documented browser checks when changing navigation, locale routes or authorization. For skill/documentation-only changes, validate frontmatter, local links, routing, pinned source integrity and whitespace instead. Report exactly what was verified and any external dependency. Avoid broad tests that merely restate implementation.

Do not deploy production, alter repository visibility/DNS, introduce an automatic license or announce institutional claims without explicit authority. Remote repository governance and release tasks are separate from local feature work.
