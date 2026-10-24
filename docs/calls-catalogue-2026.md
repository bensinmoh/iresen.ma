# Calls catalogue and historical detail pages — 2026-10-15

## Commission and design

The owner commissions the existing Programmes “Nos dispositifs” section, a full
calls listing and 21 historical detail pages. All supplied entries are closed.
The screenshot `Screenshot 2026-10-15 at 22.35.12.png` is a visual reference for
two-column white cards on a pale surface, status labels, metadata and action
hierarchy. The owner’s 22:57 close-up correction removes the invented upper-right
category and uses neutral black/grey type, compact inline metadata, a closed
submission-period bar and a bordered action. The bar has no invented dates or
percentage; it communicates only the owner-confirmed closed state. Its sample titles, dates, submission progress, alert and result actions
are not adopted as facts or services. No screenshot is served publicly.

The retained institute benchmark informs retrieval, evidence close to claims,
and the distinction between a programme launch, an edition and a project.
The 2023 IBTIKAR programme launch and 2025 call remain separate records.
No new institutional claims, fictional projects or CMS records are seeded.
No production deployment or editorial approval is inferred.

## Routes and implementation

The 23 stable IDs remain authoritative. Under the shared localized `programmes`
route, `/calls` is the full catalogue; each archive uses its stable reference via
`callHref`. The existing detail resolver, locale selector, header context, proxy,
metadata and sitemap share that structure. `calls` is reserved against CMS call
references. Historical snapshots take precedence over an identically named CMS
record; other complete published, locale-approved CMS calls retain their existing
publication gates and detail pages. No database schema or media permissions change.

- Four recent entries appear in the Programmes section, with active/upcoming
  eligible CMS entries taking priority if introduced later.
- The full list offers combined name/topic, reference year, category and status
  filters, a live result count, reset and an honest empty state.
- Development/research, maturation/acceleration and international cooperation are
  editorial categories. Open, upcoming, closed and cancelled states are supported;
  none of the 21 supplied entries is represented as open or upcoming.
- Detail pages provide a summary, themes, intended participants, calendar notes,
  available historical funding information, associated organisations and source
  links. Missing conditions, documents, dates and results remain explicitly pending.
  No submission/alert/result service or download is fabricated.
- Native inputs, selects and links retain keyboard operation. The card grid becomes
  one column at 40rem; Arabic mirrors reading direction while original names and
  physical brand corners remain intact. No additional animation library is used.
- The catalogue and all 21 detail destinations have stable FR/EN/AR search
  registrations, canonical URLs and localized descriptions. Internal editorial
  caveats and source documents are not themselves indexed as public resources.
  Existing global indexing/visibility settings remain unchanged.

## Evidence and editorial status

`src/data/call-archives.json` records the owner's chronology, distinct editions,
source links, source-derived summaries and specific caveats. `src/lib/call-copy.ts`
provides FR/EN/AR working interface text. Final owner content and translation review
remain outstanding. The original example URL `https://iresen.org/ibtikar-al-omrane/`
could not be retrieved with the web reader; accessible institutional/partner sources
were used instead. All sources were consulted on 2026-10-15.

The source links are retained per record, rather than importing remote files.
Key sources include IRESEN's 2014 presentation, CDTI announcements and edition
texts, IEA's Green Innoboost analysis, university notices, Al Omrane's 2023 report
hosted by AMMC, IRESEN's official 2025 IBTIKAR extension announcement, LEAP-RE's 2021
call text, UEFISCDI's 2025 call and NCN/PtJ's 2026 notices. Historical press sources
are explicitly identified where a primary launch notice was unavailable.

Important unresolved chronology details:

| Entry                      | Preserved period and source nuance                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| InnoTherm/InnoBiomass 2014 | Owner: March; USMBA describes a May launch. Original calendar pending.                                                                              |
| INNOMAGHRENOV 2015         | Owner: March; contemporary article mentions February launch and 10 April deadline.                                                                  |
| InnoESPAMAROC 2018–2019    | Owner: December; CDTI bulletin announces opening on 1 November 2018. Effective dates/extensions need confirmation.                                  |
| InnoESPAMAROC 2020         | Edition name is 2020; launch period remains September 2019.                                                                                         |
| Green InnoBOOST 2.0        | November 2020 launch reference; IEA describes the revised 2021 format. Funding description is qualified accordingly.                                |
| IBTIKAR 2023               | Programme launch, not a duplicate of the 2025 call.                                                                                                 |
| InnoESPAMAROC 2024         | September opening and October institutional presentation remain distinct.                                                                           |
| France–Maroc H2            | July 2024 agreement is distinct from the supplied October call reference.                                                                           |
| IBTIKAR 2025               | Official IRESEN extension to 28 September supersedes earlier notices.                                                                               |
| LEAP-SE 2026               | Published November 2025; owner-supplied January 2026 IRESEN confirmation still needs its original source. No invented confirmation text or results. |

The reference year is the edition year except InnoESPAMAROC 2020, whose supplied
launch reference remains 2019. Full dates are shown only when sourced; year/month
precision is retained otherwise. The owner's exact final text will replace these
preparatory summaries without changing stable URLs.

## Verification ledger

- Focused ESLint: passed.
- TypeScript: passed; final production compilation also completed TypeScript.
- Unit checks: 5 passed across existing call calendar/URL validation and the new
  21-entry, localized search, sorting and combined-filter checks.
- Production build: compiled successfully. Standalone tracing encountered ENOSPC
  while copying local uploads. Only this task's temporary upload copy was removed
  and replaced with a symlink to the untouched original. Browser review uses the
  compiled build directly through Next start; standalone trace packaging remains
  limited by local disk capacity.
- Local static search catalogue synchronization: passed.
- Development visual review: corrected French section at 1440px and 390px and
  Arabic mobile review at 390px. White compact cards, neutral card type, inline
  date/short thematic labels, closed-period bar and bordered actions follow the
  owner’s close-up correction. Screenshot artifacts are local, not public assets.
- Earlier production-browser work checked listing filters/reset and detail reading
  in FR/EN/AR, plus widths 320/390/768/1024/1440. All 21 archive detail URLs returned
  200 in each locale before the request for an unknown reference timed out. Those
  runs failed overall; they are not claimed as final passing evidence.
- The parent programme and unknown-call route handling was corrected afterwards.
  Direct compiled-server HTTP checks returned 200 and 404 respectively. The final
  source revision has not completed production verification.
- Latest shared-checkout coordination hold supersedes automatic completion.
  Calls joined the registry; final build/browser checks, push, CI and merge wait
  for the coordinated freeze. Earlier evidence does not certify the final revision.
- Review URL (development):
  `http://127.0.0.1:3148/fr/recherche-innovation/programmes#calls-for-projects`.
  Catalogue: `http://127.0.0.1:3148/fr/recherche-innovation/programmes/calls`.
- Impeccable’s mechanical detector reported the existing notice-side marker; it is
  a contextual closed-call notice, separate from the reference cards, and retained
  deliberately. No universal design rule is introduced.

The checkout contained extensive unrelated, uncommitted work on entry; it is
preserved. Task commits must exclude those changes. Full current-head PR CI remains
required before any merge. Source/translation approval and deployment are separate.

## Integration handoff

Calls editing is finished for this review round. Nothing was pushed or merged.
The earlier task-only staging was saved under ignored `.local/` and removed;
all working files, including concurrent project/governance/mobile changes, remain
intact. Shared files requiring reconciliation are the catch-all resolver, proxy,
search catalogue, sitemap, README, PRODUCT and CHANGELOG. In particular, the calls
change does not commission the concurrent ProjectsPage parameters/sourceNotice
changes or governance/media text. Do not import those accidentally as calls scope.

The `calls` registry entry reports readiness only for this workstream. The final
coordinated build must verify the localized parent resolver (including encoded
Arabic paths), public/private CMS detail routing, archive/catalogue journeys,
existing calls/programmes browser regressions and localized search. Local review
uses port 3148. Final production/CI evidence remains pending the shared freeze.

## Owner notice withdrawal — 2026-10-15

Remove the global all-calls-closed notice and its blue side marker from both
Programmes and the full catalogue in FR/EN/AR. Per-card closed badges and
submission-period bars remain. Remove the withdrawn sentence from the localized
search projection and retire the unused notice style/copy. Final search
synchronization and production checks remain with the coordinated freeze.

## Owner catalogue-header spacing correction — 2026-10-15

The catalogue header now uses an explicit vertical stack instead of accumulated
paragraph/heading defaults: 24px after the return-link target, 12px from eyebrow
to title, 20px from title to description. Mobile uses 16px after the return link
and title, with the 12px eyebrow gap retained. The return link keeps a 44px
minimum target; header insets use the shared section-space token. Typography,
content and detail headers are unchanged. Reviewed in development; production
verification remains pending the coordinated freeze.

## Owner partner-sidebar correction — 2026-10-15

The detail sidebar separates associated organisations and consulted sources into
two labelled sections. Section spacing, padding, heading/body gaps and source-row
spacing are explicit; stray default paragraph/list margins are removed. Partners
use a responsive two-column logo grid with natural text wrapping and original
physical signature corners. All 11 referenced partner/programme names resolve
through `src/lib/call-partners.ts`; each logo/name link has `target="_blank"`,
`rel="noopener noreferrer"` and a localized new-tab accessible label. No partner
or funding role is added to the underlying records.

IRESEN reuses the delivered SVG. Tamwilcom uses its official SVG; the other marks
retain the original raster assets available from their sites or institutional
programme/university partners. These are original trademarks, not raster UI icons
or redraws. LEAP-SE is extracted from the official 2026 call PDF’s embedded RGB
image with its original soft-mask alpha; the PDF remains local. LEAP-RE retains
its historical mark rather than substituting the current LEAP Energy umbrella
logo. KIC InnoEnergy uses the historical full mark supplied by KU Leuven.
`src/data/call-partner-assets.json` records exact source URLs, transformations,
file sizes and SHA-256 hashes. No broad redistribution licence is inferred.
All ten newly served logo files have FR/EN/AR media search registrations; the
existing IRESEN mark retains its original registration. Final index synchronization
remains pending the coordinated freeze.

Development review covers LEAP-SE 2026, IBTIKAR 2023, MICall20, INNOMAGHRENOV 2015,
France–Maroc H2 2024 and InnoESPAMAROC 2024 at 1440px, and the LEAP-SE sidebar in
Arabic at 390px. All inspected logo images loaded; partner links expose the
expected official destination, new-tab target and rel. Captures were inspected
for spacing, original proportions and RTL. Focused ESLint, formatting and
whitespace checks pass. No production build, full tests, CI, push or merge runs
during the coordination hold.

## Owner horizontal thematic list — 2026-10-15

Archive-detail themes now use a horizontal two-column semantic list with
subject-specific regular-weight SVGs from the installed Phosphor family. Icons
are 48px on wider layouts and 44px on mobile, above the unchanged localized
labels. A 24–32px column gap, natural wrapping, logical alignment and Arabic RTL
keep the list readable at narrow widths. No bullets, raster icons, decorative
cards, new topics or dependencies are added. Existing summaries, theme labels
and search descriptions remain unchanged. Focused formatting/lint and
development visual review precede readiness; final production checks remain
pending the shared freeze.

## Owner footer-contrast correction — 2026-10-15

The Programmes final contact band uses the existing pale blue action-surface
background, institutional navy heading, muted dark body text and blue secondary
link. This separates it from the navy footer while retaining the original blue
primary action, content, destinations and responsive composition. No shared
palette or footer rule changes. Development visual review and focused formatting
checks precede readiness; final production verification waits for the shared freeze.

## Owner closed-call actions correction — 2026-10-15

The archive detail hero now places two inactive buttons in its trailing column:
submission form and terms of reference. Two grey surfaces distinguish them; the
button group aligns to the bottom of the period/type/status row on desktop and
reflows below it on smaller screens. The redundant upper Closed badge is removed.
Hover and keyboard focus replace each visible label with the localized closed-call
message, without changing dimensions. Native buttons expose `aria-disabled` and
include closure in their accessible names; they have no navigation or action.
FR/EN/AR labels remain working editorial copy. No form or document URL is invented.

Scoped ESLint, Prettier and whitespace checks pass. Development previews checked
FR desktop and AR mobile, including hover/focus label visibility, two inactive
controls and no horizontal overflow. Production checks remain deferred under the
shared coordination hold.

## Owner horizontal action styling correction — 2026-10-15

The two closed-call actions now sit side by side at all widths, with light (300)
typography and wrapping labels. The submission action has a transparent resting
surface and matching light-grey text/outline. Hover or keyboard focus fills it
grey and shows the closure message in darker grey. The terms action retains its
lighter filled surface. Both remain inactive, align with the facts row on desktop,
and retain accessible closure labels. This supersedes the earlier stacked-button
layout. FR desktop and AR mobile development previews confirm horizontal placement,
no overflow and hover/focus replacement. Scoped formatting/whitespace pass; final
production checks remain pending the shared coordination freeze.

## Impact figure wrapping — 2026-10-15

Owner correction: the sourced 69-project value is nonwrapping and cannot shrink
inside its caption row; the explanatory text keeps natural wrapping. The figure,
reference period and publication status are unchanged. Formatting/source checks
only; final browser verification remains pending.

## Mobile call-card rail — 2026-10-15

At or below 40rem, both programme previews and the full calls catalogue use one
native horizontal card rail instead of a vertical list. Cards occupy 88% of the
rail (capped at 24rem), leaving the next card partially visible. Preserve natural
text wrapping, filtering, links, RTL direction and desktop/tablet grids. The rail
has a localized region label and keyboard focus, with proximity snap and no
animation dependency. No content, routes or search references change. Scoped
lint/format/whitespace checks pass; rendered review and CI remain pending.

## Partner logo alignment — 2026-10-23

Partner cards center their logo viewport horizontally and vertically, independently
from the label/arrow row. AFD, LEAP-RE and Al Omrane have uneven blank margins in
their original PNGs; SVG viewports frame the visible artwork without rewriting
or duplicating the supplied marks. Other logos retain centered contain sizing.
The original partner files, links, labels and search references remain unchanged.

Verification: targeted ESLint, Prettier and whitespace checks pass. Development
review of the Green H2 call confirms centered IRESEN, SATT and AFD cards at
1440px in French and 390px in Arabic, with no horizontal page overflow.
DOM measurements confirm zero horizontal logo-slot offset and centered
logo/label groups. Full tests/build/CI remain pending under the shared hold.

## Owner-supplied SATT logo — 2026-10-23

The owner supplies `SATT.png`, replacing the previous website-sourced partner
mark with the full SATT Paris-Saclay lockup and its “Innovating with confidence”
signature. The 3355 × 1068 PNG is served byte-identically at the existing
`/images/call-partners/satt.png` URL. The asset manifest records the new hash
and retains the superseded source metadata; image provenance is reconciled.
Centered contain sizing, partner links and existing localized media references
remain. Verification: supplied/served bytes and both manifest hashes match;
Prettier and whitespace checks pass. The local French call page renders the
3355 × 1068 source with zero horizontal center offset and no page overflow.

## Owner-supplied AFD logo — 2026-10-23

The owner supplies `AFD_logo.svg.png` (1024 × 453), replacing the previous
website-sourced AFD PNG at `/images/call-partners/afd.png` byte-identically.
The previous AFD framing override is removed because the new artwork already
has balanced margins; it uses the shared centered contain viewport. The manifest
retains superseded metadata and records the new hash, reconciled with provenance.
Partner links and localized media search references keep their existing URLs.
Verification: supplied/served bytes and both manifest hashes match; targeted
ESLint, Prettier and whitespace pass. The local French call renders the full
1024 × 453 artwork with zero horizontal center offset.

## Owner-supplied CDTI logo — 2026-10-23

The owner supplies `CDTI Short.svg`. Its original bytes and `0 0 274.4 78`
viewBox are retained at `/images/call-partners/cdti.svg`; the CDTI partner
registration now uses this vector mark. The manifest records its hash and
retains the previous PNG metadata. The legacy PNG and its raster provenance
remain untouched. Existing localized media registrations derive the new URL
from the shared partner definition, retaining the same stable search identity.
Centered contain sizing, labels and partner destinations remain.
Verification: source/served SVG bytes and manifest hash match, XML parses,
targeted ESLint/Prettier/whitespace checks pass. The French InnoESPAMAROC 2024
call renders the supplied vector with zero horizontal center offset.

## Logo-only partner cards — 2026-10-23

The owner removes the repeated partner name/arrow row and requests more space
around each logo. Partner cards use centered grid placement with 1.5rem padding
on every side. The full card remains a link with its localized accessible partner
name/new-tab label; original logo artwork and destinations remain unchanged.
Verification: targeted ESLint, Prettier and whitespace checks pass. French
desktop and Arabic 390px development review confirms 24px padding, centered
logos, empty visible link text and retained localized accessible names.
The Arabic mobile page has no horizontal overflow. Full tests/build/CI remain
pending under the shared checkout hold.

## Owner-supplied Al Omrane logo — 2026-10-23

The owner supplies `Al Omrane.svg`, served byte-identically at
`/images/call-partners/omrane.svg` with its `0 0 91.25 103.06` viewBox.
The shared partner definition now uses this original vector and drops the
previous PNG framing override. Padded, centered logo-only cards and accessible
links remain. The manifest retains the superseded PNG metadata; the legacy
PNG and its raster provenance remain unchanged. Existing localized media
references follow the shared SVG URL and stable partner search identity.
The shared logo image constraints allow portrait assets to shrink inside the
56px logo slot, preventing intrinsic grid sizing from overflowing padded cards.
Verification: supplied/served SVG bytes and manifest hash match; XML parses;
targeted ESLint, Prettier and whitespace pass. The local French 2023 call
renders the supplied vector centered, with the logo and slot both 56px high.

## Owner-supplied Tamwilcom logo — 2026-10-23

The owner supplies `Tamwilcom.png` (852 × 1133). The original is served
byte-identically at `/images/call-partners/tamwilcom.png`; the shared partner
definition replaces the former website-sourced SVG reference. The previous SVG
remains intact, with its metadata retained in the asset manifest. The new raster
provenance records the supplied file hash. Existing localized media references
follow the shared PNG URL and stable partner identity. Centered contain sizing,
24px card padding and accessible logo-only links remain unchanged.
Verification: supplied/served PNG bytes and both manifest hashes match;
targeted ESLint, Prettier and whitespace pass. The French 2023 call loads the
852 × 1133 artwork centered, fully contained in its 56px logo slot.

## Owner-supplied LEAP-RE logo — 2026-10-23

The owner supplies `LEAP-RE logo text update.png` (1393 × 1129), replacing
the previous raster at `/images/call-partners/leap-re.png` byte-identically.
The old square-image framing override is removed so the complete supplied
Africa–Europe mark and LEAP-RE text remain visible with centered contain sizing.
The manifest retains previous metadata and records the new hash, reconciled
with raster provenance. Existing localized media references, partner links
and logo-only cards with 24px padding remain.
Verification: original/served bytes and both manifest hashes match; targeted
ESLint, Prettier and whitespace pass. The local French LEAP-RE 2021 call loads
the complete 1393 × 1129 source in its 56px slot with zero horizontal center offset.
