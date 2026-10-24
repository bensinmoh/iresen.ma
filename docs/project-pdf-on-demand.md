# Project PDFs on demand — 16 October 2026

Owner approval replaces the routine 70 × 3 pre-generated project PDFs with one
shared HTML layout, localized through the FR/EN/AR messages. The stable guarded
note URL and existing “Consulter la fiche” action remain. Each PDF includes the
current project image when present, description, sourced metadata, consortium,
objectives, coordinator email with the requested introduction, website and
canonical project URL. Missing optional facts remain absent. Arabic retains RTL
and its embedded Alexandria font. Long content can paginate without truncation.

## Runtime and access

- `project-note-template.ts`: escaped localized HTML, original logo and embedded fonts.
- `project-note-document.ts`: access-controlled project snapshot, local image bytes,
  SHA-256 of actual rendered HTML, and a second live access/content check before response.
- `project-note-renderer.ts`: offline Chromium rendering, scripts disabled, network
  requests blocked, timeouts and browser cleanup. It uses production `playwright-core`.
- `project-note-cache.ts`: process-local ten-minute LRU, at most 32 PDFs/20 MiB;
  identical in-flight work is shared, at most two browsers render simultaneously,
  at most eight distinct requests are pending. Full queue/render failures return
  503 with Retry-After 5; withdrawal or inaccessible locale returns 404.

The key changes whenever text, image bytes, font, logo or generated layout changes.
A warm entry never skips publication checks. All responses remain private/no-store;
review translations cannot escape `PUBLIC_RELEASE=true`. PDFs are never written
to disk by visitor requests. Each process has its own ephemeral cache.

The catalogue exposes the action for every eligible project. The search indexer
registers a stable `project-note:{source ID}:{locale}` document from each currently
eligible project source, without depending on the legacy file revision. Existing
live-source eligibility continues to withdraw results and vocabulary immediately.
The old SQL view's `notePath` hint is ignored by this projection; no schema change
is required. Current 70 FR download URLs already match their indexed references.

The private `project_notes` table/helper and `generate-project-notes.ts` remain for
optional archival exports/import compatibility only. The exporter reuses this
layout/renderer. The owner subsequently requests deletion of the old files and ZIPs;
these are removed locally, including backup and obsolete standalone-build copies.
No archived PDF set is needed on the server.

## Hosting

Set `PLAYWRIGHT_EXECUTABLE_PATH` to an installed compatible Chromium executable.
Docker runtime now installs Debian Chromium and sets `/usr/bin/chromium`. Direct
hosting must install a browser separately. Local development uses installed Chrome.
The browser needs writable temporary space and permission to spawn child processes.
Next config externalizes Playwright Core and explicitly traces both font files and
the SVG. Existing project-image mounts remain required. No deployment is performed.

## Verification and CI handoff

Scoped development verification executed the real route against local data and
installed Chrome, without modifying project records:

- AquaSolar FR/EN/AR: HTTP/PDF 200, PDF signature, image, email and both footer links.
  All three sample PDFs are one A4 page. Poppler renders inspected in all languages.
- First generation measured 650–912 ms after application initialization; warm
  requests 13 ms, with identical bytes. These are local measurements, not hosting SLAs.
- Changed description and language produce different snapshot hashes. Image bytes,
  fonts and layout are embedded directly in that same hashed HTML.
- Warm EN/AR review results become 404 in public-release mode. M.S.F, withdrawn
  demonstration, unknown project and invalid locale remain 404.
- Existing local HTTP server returns the generated French PDF (200, 1,561,395 bytes).
- Focused ESLint, changed-file Prettier and whitespace checks are recorded in the
  shared verification log. The install used the frozen lockfile and passed its
  supply-chain policy check.

Private outputs and verifier: `.local/projects/on-demand-pdf/`.

Added cache regression coverage for coalescing, revisions/locales, expiry,
concurrency/queue bounds and retry after failure. Updated the DB integration
scenario to require no pre-existing PDF registration, retain discovery after an
edit, serve changed content and deny a warmed PDF after withdrawal. Its renderer
is mocked so DB CI does not require Chromium; the development checks above use
real rendering.

At the owner's explicit request, this chat does **not** run automated test suites,
a production build, Docker build, CI, Git operations or merge. The coordinating
chat must run final current-head checks after the shared freeze, including the
new cache tests and project integration scenario. It should verify standalone
font/logo tracing and Chromium in the runtime image before provider release.

## Legacy PDF deletion — owner follow-up, 16 October 2026

Deleted 1,110 obsolete generated project PDFs and the workbook PDF ZIP
(181,811,353 bytes): 606 PDFs in the former notes/workbook export and backup
folders, plus 504 fictional-note copies in seven old standalone outputs.
Only the three on-demand FR/EN/AR verification PDFs remain in the local project
workspace. Source documents, images, project data, generation code and unrelated
PDFs/ZIPs are preserved. Private deletion inventory with paths, sizes and hashes:
`.local/projects/on-demand-pdf/deleted-legacy-files.json`. Historical notes above
record the state before this explicit deletion request.

The current download endpoint remains generated on demand and independent of all
deleted files. A local French download is checked after deletion. No CI/build or
Git operation is performed; final checks remain assigned to the coordinating chat.

Compatibility follow-up: the CMS chat's scoped typecheck identified that
Playwright Core does not accept `timeout` in `page.pdf` options. Replaced it with
a cleared 15-second promise deadline; the existing browser finally block closes
the rendering process on timeout. Focused TypeScript checking with Node types,
ESLint and the local HTTP PDF check pass. Full coordinated checks remain pending.

Monetary format — 23 October 2026: project funding uses `formatMoney` with whole
units rounded down, Latin digits, U+00A0 thousands/currency separators and the ISO
currency code. Financial prose uses isolated LTR amounts, including Arabic notes.
Source numeric precision is preserved. The existing HTML fingerprint naturally
invalidates the process-local PDF cache after this template change. Local French
EV Plan output returns HTTP 200 and shows `1 278 600 MAD`; text and rendered page
were inspected. Original supplied PDFs are unaffected. Formal checks remain held.
