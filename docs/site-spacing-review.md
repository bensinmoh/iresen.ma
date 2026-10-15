# Public-page spacing review — 2026-10-15

The owner requests a review of all public pages before CI/merge, correcting empty
vertical scrolling and inconsistent horizontal whitespace. This follows withdrawal
of the platform viewport-height experiment. No content, imagery, anchors, routes,
search metadata, publication gates or institutional claim changes.

## Assessment and changes

The rendered audit covers all 21 canonical public destinations (the events and
useful-links stable IDs redirect to existing destinations), in French/Arabic at
390px and 1440px: 84 route/viewport cases. Source and rendered geometry distinguish
actual empty section boundaries from fields, image frames, maps and scroll rails.
Full-page overview sheets and close-up captures support the spacing assessment;
lazy image decoding is checked separately in the production browser journeys.
The supporting Impeccable layout detector reports no findings, which does not
replace rendered judgment.

Common causes were independently oversized section insets (often 72–104px),
column gaps up to 112px, accumulated margins and a reserved viewport per Roadmap
body chapter. Ordinary section padding now uses the existing 32–48px scale via
`--section-space`; paired column gaps use 24–48px via `--layout-gap`.

| Destination             | Disposition                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage                | Shared section role; remove research's extra 8–12rem bottom padding; tighten its column gap and shared Narrative panel padding.                 |
| Institute               | Shared editorial/mission/history/report spacing; closer paired columns and model; smaller inner mission spacing and timeline/action separation. |
| Governance              | Shared section/column spacing; preserve diagrams, portrait/dialog geometry and readable cards.                                                  |
| Roadmap                 | Natural body chapter heights and shared column/section gaps; preserve hero, sticky illustration and native axis disclosures.                    |
| Programmes              | Shared section/column spacing; closer process rows.                                                                                             |
| Projects                | Existing short forthcoming-update page needs no change.                                                                                         |
| Platforms               | Shared intro/chapter/network spacing and column gaps; previous photographs, logo sizes and natural content layout remain.                       |
| Laboratory network      | Shared section/column rhythm and smaller heading-to-grid gap; equal map/list height, overflow canvas and circular preview remain.               |
| Valorisation & Transfer | Shared intro/section/column spacing; preserve patent filters, imagery and disclosures.                                                          |
| Collaborate with us     | Shared section/column spacing and closer need introduction.                                                                                     |
| News/events             | Shared section and news/training-column spacing; existing highlights/cards remain.                                                              |
| Publications            | Shared catalogue/section spacing; reading/filter/figure layouts remain.                                                                         |
| Media library           | Shared collection/video/report/link-section spacing; photo mosaic, video rail and viewer geometry remain.                                       |
| Careers                 | Shared ordinary section spacing; hero signature, photograph composition, empty offers and application controls remain.                          |
| Contact                 | Shared platform/form/FAQ section spacing; headquarters composition, fields and consent-controlled map remain.                                   |
| Search                  | Existing compact search/results layout needs no change.                                                                                         |
| Legal                   | Existing compact notice layout needs no change.                                                                                                 |
| Privacy                 | Existing readable notice layout needs no change.                                                                                                |
| Cookie preferences      | Existing compact preference layout needs no change.                                                                                             |
| Accessibility           | Existing compact notice layout needs no change.                                                                                                 |
| Sitemap                 | Existing compact grouped columns need no change.                                                                                                |

The 120rem cap, full-width surface breakout, shared gutters and 65–75ch reading
measures remain. No font or photo compression, fixed chapter height, forced snap
scrolling or new internal scrolling is introduced. Hero composition, required
logo clear space, map/list alignment, timeline/book overlap and control target
sizes retain their functional roles. Existing fields and the disabled-map frame
are not mistaken for excessive whitespace. No public search rebuild is needed.

## Verification ledger

- All-page FR/AR audit: 84 cases; no document horizontal overflow after changes.
- Final isolated production build including TypeScript: pass.
- Lint, changed-file formatting and whitespace: pass.
- 102 scoped production browser journeys: pass across the affected public modules,
  including the 21-page FR/EN/AR surtitle/overflow audit, 320–1440px reflow,
  enlarged text, keyboard, axe, native/no-JavaScript reading and map/list/dialog/
  filter behavior. The wide surface suite also verifies edges beyond the capped
  container. One careers database test initially lacked runner environment values;
  rerunning that test through `scripts/run.mjs` passes. No runtime/test assertion
  was changed for that environment issue.
- Overview sheets cover all 21 desktop destinations; close-up Programme, Roadmap,
  Institute and scoped production captures inspected. Existing documentary media
  and functional control geometry are preserved.
- Existing 170-unit/search evidence is reused for unchanged data/logic. Full
  current-head CI remains mandatory before merge. No deployment is authorized.
