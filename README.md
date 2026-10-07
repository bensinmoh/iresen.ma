# IRESEN website

Development foundation for IRESEN's French, English and Arabic institutional website. It provides a public locale shell, Payload CMS and PostgreSQL without invented content or a completed homepage. Read [instruction.md](instruction.md) for the development brief and [backlog](docs/backlog.md) for current scope and follow-up work.

## Selected stack

| Tool                                                      | Pinned version                                                         |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| Node.js LTS                                               | 24.19.0                                                                |
| pnpm                                                      | 11.19.0                                                                |
| Next.js                                                   | 16.4.0                                                                 |
| React                                                     | 19.3.0                                                                 |
| TypeScript                                                | 6.0.3, strict mode                                                     |
| Payload / Next integration / PostgreSQL adapter / Lexical | 3.90.2                                                                 |
| next-intl                                                 | 4.14.9                                                                 |
| Tailwind CSS                                              | 4.3.3                                                                  |
| Development PostgreSQL                                    | 17.9 (`postgres:17.9-bookworm`, image digest pinned in `compose.yaml`) |

Next.js and Payload are selected as a compatible pair. `package.json`, runtime pins and the committed pnpm lockfile are authoritative. See [architecture](docs/architecture.md) and [ADR 0001](docs/adr/0001-modular-trilingual-application.md).

## Local setup

Use Node.js and pnpm versions above, plus Docker with Compose for the database. Alternatively provide a compatible PostgreSQL instance through `DATABASE_URL`.

```sh
pnpm install --frozen-lockfile
pnpm setup:local
docker compose up -d db
pnpm db:wait
pnpm cms:migrate
```

`setup:local` creates ignored `.env.local` with random development secrets and preserves an existing file. Inspect `.env.example` for the variable contract. Never copy live credentials into committed files.

For the first CMS administrator, supply `CMS_BOOTSTRAP_EMAIL` and `CMS_BOOTSTRAP_PASSWORD` through your secure local environment, then run:

```sh
pnpm cms:bootstrap
pnpm dev
```

There is no shared/default administrator credential. Bootstrap is a controlled server operation, not public self-registration. Keep bootstrap credentials out of shell history and remove them from the environment afterward.

Public app: <http://localhost:3000> (redirects to French). Other locale shells: `/en` and `/ar`; Arabic uses RTL. CMS: <http://localhost:3000/admin>. Collections start empty. A local test account or generated local secret is never a production credential.

## Commands

| Command                 | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `pnpm dev`              | Development app and CMS                    |
| `pnpm build`            | Production standalone build                |
| `pnpm start`            | Run the production application             |
| `pnpm lint`             | ESLint                                     |
| `pnpm typecheck`        | Strict TypeScript                          |
| `pnpm test`             | Focused unit checks                        |
| `pnpm test:integration` | CMS/database authorization checks          |
| `pnpm test:e2e`         | Browser locale/navigation checks           |
| `pnpm db:wait`          | Wait for the configured PostgreSQL service |
| `pnpm cms:migrate`      | Apply reviewed CMS migrations              |
| `pnpm cms:bootstrap`    | Controlled first-administrator creation    |

Browser checks require Playwright's browser dependencies; CI installs them. This cloud machine already provides Chromium: use `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium pnpm test:e2e` after `pnpm build`. Elsewhere install the bundled browser with `node scripts/run.mjs playwright install chromium`, using the same cache as the tests. Integration checks require a disposable migrated database with no existing users; they create and remove their own accounts and content. Never point tests or development schema synchronization at production.

Local foundation checks passed: 8 unit, 4 integration and 11 browser tests, plus install, lint, types, formatting and the standalone build. See [validation evidence and limits](docs/validation.md).

## Environment

| Name                                                | Purpose                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`                                      | Server-side PostgreSQL connection                                         |
| `POSTGRES_USER`, `POSTGRES_DB`, `POSTGRES_PASSWORD` | Local Compose database initialization; password must match `DATABASE_URL` |
| `PAYLOAD_SECRET`                                    | Strong server-side CMS secret; local helper generates one                 |
| `NEXT_PUBLIC_SITE_URL`                              | Development origin; initially `http://localhost:3000`                     |
| `SITE_INDEXING_ENABLED`                             | `false` for development/restricted previews                               |
| `CMS_BOOTSTRAP_EMAIL`                               | First administrator identity; bootstrap only                              |
| `CMS_BOOTSTRAP_PASSWORD`                            | Secret first-administrator password; bootstrap only                       |

Development services need no production email, storage, LinkedIn or DNS credentials. Search/contact and CMS email delivery are explicitly unavailable until providers are implemented. Seven supplied SVGs are installed unchanged in `public/brand/`; the two PDF guidelines are retained in ignored `private-references/`. The owner selected **#296BB4** for the primary blue. See [asset inventory](docs/asset-inventory.md) and [brand decision](docs/adr/0003-owner-selected-primary-blue.md). Licensed fonts, approved page copy and design exports remain follow-up inputs.

Project scripts load `.env.local` and keep caches within ignored paths. For a new install in a restricted cloud shell, set `XDG_CACHE_HOME="$PWD/.cache/native"` and `npm_config_cache="$PWD/.cache/npm"` before `pnpm install --frozen-lockfile`. The SWC compatibility pin and current lint configuration are explained in [ADR 0002](docs/adr/0002-verified-cloud-tooling.md).

## Repository map and next work

`src/app` contains public locale/CMS routes; `src/components` the UI shell; `src/i18n` and `src/messages` locale routing/catalogs; `src/cms` collections/access/migrations; `src/lib` content and integration boundaries. Technical guides are in [docs](docs/architecture.md). Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md) before contributing/reporting.

The next development task is homepage composition from approved copy and supplied visual assets. Full CMS workflows, functional search/contact, production media/email/identity and release assessment remain tracked work. No production deployment, repository visibility change or open-source licensing decision is implied by this foundation. See [deployment](docs/deployment.md) and [security/privacy](docs/security-and-privacy.md).
