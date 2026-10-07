# IRESEN coding entrypoint

Read `instruction.md`, `README.md` and `docs/design-system.md` before implementation. The latest owner-selected website primary blue is `#296BB4`; preserve delivered SVG originals. The brief provides project requirements; the user's current request defines the work authorized now. Preserve existing work and do not deploy, change visibility, publish content or alter DNS without explicit authorization.

Use the existing checkout. Cloud tasks are already isolated: do not create a Git worktree unless the user requests it.

Use Node 24.19.0 and pnpm 11.19.0. Setup: `pnpm install --frozen-lockfile`, `pnpm setup:local`, `pnpm db:up`, `pnpm db:wait`, `pnpm cms:migrate`, `pnpm dev`. Bootstrap an administrator only with explicitly supplied temporary credentials using `pnpm cms:bootstrap`.

Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:integration`, `pnpm build`, `pnpm test:e2e`. Integration/browser checks require the local database; browser checks use a production build. Review generated CMS types/import maps/migrations when schemas change.

Keep FR/EN/AR catalogs complete, map routes centrally, use logical CSS and verify Arabic RTL. Keep content separate from presentation. Never invent institutional facts, translations approved for publication, logos or imagery. Do not commit secrets, private references, uploads or personal data. CMS Local API queries for public content must explicitly enforce access and disable translation fallback.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
