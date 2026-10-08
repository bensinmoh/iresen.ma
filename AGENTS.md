# IRESEN coding entrypoint

Read `instruction.md`, `README.md` and `docs/design-system.md` before implementation. The latest owner-selected website primary blue is `#296BB4`; preserve delivered SVG originals. The brief provides project requirements; the user's current request defines the work authorized now. Preserve existing work and do not deploy, change visibility, publish content or alter DNS without explicit authorization.

## Automatic completion

The owner's standing instruction, recorded on 2026-10-08, authorizes automatic completion of requested work: update affected logs and Markdown documentation, commit through a focused branch/PR, merge after the relevant local checks and current PR CI checks pass, then synchronize the checkout and clean up completed task branches and temporary files. Do not ask for merge or routine cleanup approval again. Preserve unrelated work, private references, credentials, local databases and useful runtime dependencies. Resolve merge conflicts and recheck affected behavior; never bypass failed/pending checks, branch rules or review requirements. Deployment, DNS and visibility changes retain their separate authorization rules.

## Design guidance

For design work, also read `PRODUCT.md` (product/content truth), `DESIGN.md` (visual direction) and `docs/design-workflow.md` (task routing). The workflow is adaptable guidance: use judgment, critique weak choices constructively and apply coherent reversible improvements within the requested scope. Do not turn its examples or upstream defaults into mandatory features, dependencies, redesigns or repeated approval questions.

Repository skills live in `.agents/skills/<name>/SKILL.md`. Read only relevant skills:

| Task                                                 | Skills                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| Public page composition or visual refinement         | `iresen-frontend-design`; `iresen-design-system` for shared rules |
| Figma or export adaptation                           | `iresen-figma-implementation`                                     |
| Responsive, long-content or RTL work                 | `iresen-responsive-layout`                                        |
| Semantics, contrast, keyboard, focus or forms        | `iresen-accessibility`                                            |
| Motion                                               | `iresen-motion-design`                                            |
| Metadata, media, fonts or client cost                | `iresen-seo-performance`                                          |
| Verification after visual edits                      | `iresen-visual-qa`                                                |
| Optional expressive composition                      | `design-taste-frontend` for public pages, not CMS/admin           |
| Requested critique, polish or other design operation | `impeccable` plus the relevant playbook                           |

Read `.agents/skills/README.md` before using vendored Taste/Impeccable. Its IRESEN overrides keep current brand, product scope, approved content, native CSS and existing dependencies authoritative. Record adopted shared design improvements in `DESIGN.md` and `docs/design-system.md`.

Use the existing checkout. Cloud tasks are already isolated: do not create a Git worktree unless the user requests it.

Use Node 24.19.0 and pnpm 11.19.0. Setup: `pnpm install --frozen-lockfile`, `pnpm setup:local`, `pnpm db:up`, `pnpm db:wait`, `pnpm cms:migrate`, `pnpm dev`. Bootstrap an administrator only with explicitly supplied temporary credentials using `pnpm cms:bootstrap`.

Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:integration`, `pnpm build`, `pnpm test:e2e`. Integration/browser checks require the local database; browser checks use a production build. Review generated CMS types/import maps/migrations when schemas change.

For skill/documentation-only changes, check frontmatter, routing, local links, pinned source hashes and whitespace instead of running the application/database suite. For runtime changes, use the relevant checks above and inspect rendered visual changes; report actual coverage and limitations.

Keep FR/EN/AR catalogs complete, map routes centrally, use logical CSS and verify Arabic RTL. Keep content separate from presentation. Never invent institutional facts, translations approved for publication, logos or imagery. Do not commit secrets, private references, uploads or personal data. CMS Local API queries for public content must explicitly enforce access and disable translation fallback.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
