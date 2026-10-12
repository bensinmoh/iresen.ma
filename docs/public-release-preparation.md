# Public release preparation — 2026-10-12

## Delivered behavior

Programmes now places its approach title above balanced photo/prose columns and
centers lifecycle text outside the steps. Shared reading motion covers the new
units without an animation dependency. Scientific/transfer icon roles and isolated
CSS colors use the six approved tokens; primary actions and SVG originals remain.

Projects now has a truthful FR/EN/AR update-coming state. The complete isolated
24-record database, 72 PDFs, generator, detail/filter code and exclusive images/
wordmarks are withdrawn. All five legacy anchors and the original hero remain.
The publications (1,199), patents (59), CMS collections and sourced 69-project
Programme figure are independent and preserved.

Useful links is the 23rd stable route, with four exact owner-selected external
URLs, localized descriptions, footer/sitemap access and page/section/tool-anchor discovery.
No embedded providers or remote asset requests are added. Search was rebuilt locally.

## Security and package audit

The public release closes administrative UI, CMS auth/raw collection/mutation
endpoints and server functions. Public media retains publication/locale checks.
Script nonce CSP, frame/object restrictions and private/no-store HTML complement
existing headers/cookies/CORS/CSRF. Inline styles remain allowed for existing React
and navigation CSS; this policy is not described as a fully strict style CSP.

API and page searches share a 60/minute atomic PostgreSQL quota. Database stores
HMAC keys/counts/expiry, without raw addresses or search terms. API returns 429 and
Retry-After; page shows localized waiting copy. Trusted forwarding requires a
protected origin and proxy overwrite contract. Missing limiter service fails closed.
The privacy notice describes the protected technical counter and delayed expiry cleanup.

Production dependency audit: 14 initial advisories → zero known advisories after
compatible overrides for undici, DOMPurify, esbuild and maintained Sass. The
announced braces correction was not published; upgrading Sass removed its old
chokidar/braces dependency instead. Preserve overrides until compatible upstream
packages remove the need; verify future registry changes. Full build/CI validates
compatibility. A zero registry count is not a guarantee against intrusion.

Byte-hash audit found no identical public files. No arbitrary deduplication was
performed. Withdrawn files were removed by ownership/use; original SVGs, photographs,
references, databases and the owner's local tsconfig changes are preserved.
Standalone tracing and Docker context exclude internal docs/secrets/references.
The non-root container separates operations from the web runtime. Actual provider
settings, container platform/registry scanning and production staging are IT checks.

## Performance method and limits

Pinned Lighthouse 13.5.0 with installed Chrome, default mobile simulated throttling,
three sequential cold-page runs each: accueil, programme, projets, publications,
recherche et contact. Median score, LCP/CLS/TBT, transfer and JavaScript bytes are
recorded in [the measured results](performance-results.json). TBT is a lab metric,
not field INP. Shared local machine workload/network can affect comparisons.
The consent prompt is rendered per request before hydration; existing valid consent
suppresses it. Services remain client-consent gated, with no shared visitor state.

The initial homepage transferred roughly 10MB, largely its full 4K video. The
responsive derivative preserves the entire 18.86s sequence and frame rate, with
960px width and about 1MB. It runs at/below 64rem with the existing immediate, preference-gated autoplay;
the original remains for desktop. The native poster reuses the selected responsive
fallback image, with no extra public asset. Reduced-motion/autoplay-failure photo behavior
is retained. Source/derivative hashes are in [provenance](hero-video-derivative.json);
both share the original media-search reference. The supplied headquarters JPEG remains unchanged; Contact and Institute now share
quality-60 responsive Next derivatives, preserving definition/crop after the
measured roughly 500KB mobile Contact background. Budgets are targets; report actual
misses rather than describing every page as maximized or production-ready.

### Final mobile medians

| Page         | Score before → after | LCP s before → after | Final CLS | Transfer MB before → after | Final JS kB |
| ------------ | -------------------- | -------------------- | --------- | -------------------------- | ----------- |
| Accueil      | 73 → 76              | 5.26 → 6.68          | 0.000     | 10.89 → 2.50               | 236         |
| Programme    | 82 → 83              | 4.43 → 4.58          | 0.013     | 0.60 → 0.59                | 229         |
| Projets      | 84 → 87              | 3.76 → 3.98          | 0.000     | 0.79 → 0.43                | 229         |
| Publications | 81 → 82              | 4.51 → 4.43          | 0.008     | 0.57 → 0.56                | 229         |
| Recherche    | 83 → 87              | 4.14 → 3.91          | 0.000     | 0.45 → 0.45                | 229         |
| Contact      | 69 → 77              | 6.45 → 6.01          | 0.000     | 0.93 → 0.85                | 229         |

CLS remains below 0.1 on all six pages. LCP remains above 2.5s and initial JS
above 200kB everywhere; scores remain below 90. The homepage transfer falls by
about 77%, but its LCP is worse in this local comparison. No uniform speed gain
is claimed. The remaining homepage transfer includes its documentary background
and full preserved mobile video; provider staging must measure and decide the
next optimization using field evidence.

## Verification ledger

- Production baseline build: passed before runtime changes.
- Unit/publication/media/search-policy tests: 24 files / 163 tests passed.
- Shared quota: 61 concurrent calls tested; exactly 60 allowed, one rejected.
- Integration: five suites /31 tests passed on an isolated disposable PostgreSQL.
- Migration: additive quota table applied locally; generated CMS types/import map unchanged.
- Final Linux production build/TypeScript passed; 77 browser scenarios passed, with
  25 affected scenarios rechecked, followed by 21 video/CSP/PDF/media checks and
  42 final consent/motion/security/PDF checks on isolated data. Visual captures were
  inspected. CI on the final PR head is mandatory.
- No public deployment, domain/DNS, visibility or Cloudflare account change.

See [validation](validation.md), [documentation review](documentation-review.md),
[French IT handover](it-handover.fr.md) and [deployment guide](deployment.md).
