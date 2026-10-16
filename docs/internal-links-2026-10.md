# Internal link audit — 2026-10-16

The owner reports that the Institute complementary-accordion links fail and
requests a site-wide cross-page link check. Scope is the local public site in
FR/EN/AR, including canonical destinations, rendered internal anchors, child
listings, project details/notes, representative filter links and directly linked media. External
third-party URLs and mail/telephone actions are inventoried, not contacted.

## Cause and correction

French destinations such as `/fr/expertise-experimentation/reseau` and
`/fr/collaborer-avec-nous` returned HTTP 307 with a Location pointing back to the
same public pathname. The accordion hrefs and destination anchors were correct.
The earlier Institute/Programmes-only exception did not cover other public pages.

Canonical localized pages now proceed directly through Proxy with the explicit
locale request header. The shared `pageIdFromPathname` resolver accepts a locale
and encoded Arabic paths, and both metadata and page rendering use it. Internal
legacy path handling, unknown-page behavior, source locale gates, CSP, anonymous
media access and CMS administrative guards retain their ownership. The localized
full news listing has the same direct-resolution treatment; its FR/AR aliases
otherwise showed the same redirect loop. No canonical URL or search entry changes.

## Development verification

The ignored `.local/link-audit/audit.ts` performs a read-only development crawl,
starting with all 24 routing IDs in three locales (72 destinations, including
aliases), then checks internal hrefs and their real HTML anchor IDs. It follows
nested rendered links and records redirects/statuses. Query URLs emitted by base pages are checked, but their children are not
recursively expanded: the audit does not enumerate filter Cartesian products or
every successive load-more increment. These are catalogue interaction states,
not additional cross-page routes. Media files use a ranged
GET of one byte where Payload's automatic HEAD response does not represent actual
playback. An initial set of 24 video HEAD 404s was verified as successful GET 206
reads; no media policy, file or publication state was changed to disguise it.

Native browser clicks on the three French Institute accordions now reach:

- Études & Expertise → Network `#intervention-modes`.
- Compétences & Capacités → Network `#skills-training`.
- Coopération & Rayonnement → Collaborate `#collaboration-references`.

All three destination headings and anchors render successfully. Resolver unit
coverage now enumerates localized/internal/encoded paths and malformed inputs;
Institute E2E coverage adds actual accordion navigation in all three locales.
These automated suites remain unrun under the shared hold. The existing foundation
suite already covers canonical page HTTP statuses; it is not duplicated here.

The full local crawl ledger is `.local/link-audit/report.json` (ignored). Only
relevant final totals are recorded below after completion. Full tests, production
build, CI, staging/commit and merge remain held by shared coordination.

Final bounded crawl after restoring local PostgreSQL: 72 seed destinations,
472 unique fetched URLs and 792 internal href destinations including anchors.
No redirect-loop or missing-anchor failures remain. One initial video request
returned HTTP 500 during startup; a separate ranged GET immediately returned
206 `video/mp4`. The raw report retains that transient failure. The 134 external
URLs are inventoried only, not verified against third-party services. Six `#`
report actions remain intentionally pending the owner-supplied public PDF.
