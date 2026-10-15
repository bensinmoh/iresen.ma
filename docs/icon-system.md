# Shared website icon system

Owner request — 2026-10-15: audit the entire website's icons, arrows and shapes,
and harmonize with Phosphor wherever appropriate.

## Implementation

Use pinned `@phosphor-icons/react` **2.1.10**, regular weight and `currentColor`.
`SiteIcon` provides decorative SVG defaults (`aria-hidden`, `focusable=false`);
the enclosing link, button or disclosure keeps its existing localized accessible
name. Import individual icons from the supported `/dist/ssr/<Icon>` entries so
server components do not need React context, client boundaries or an icon font.
Per-icon imports avoid shipping the full catalog to common navigation consumers.
Existing wrappers keep their semantic names, sizes, CSS hooks and RTL ownership.

The source-wide audit records **67 distinct icons across 20 component modules**.
It covers header/search/menu/language controls, footer contact details, contact
arrows and FAQs, cookie preferences, viewer controls, media play/PDF/calendar
marks, search previews, research themes, 28 roadmap axis slots, valorisation,
careers, network closing controls, collaboration certification and the isolated
CMS frontend. The [pinned mapping inventory](references/icons/phosphor-audit.json)
records each actual import. Text-symbol external arrows and CSS-drawn disclosure
marks are replaced by the same vector family. Details remain native.

| Meaning                           | Phosphor role                                                       |
| --------------------------------- | ------------------------------------------------------------------- |
| Navigation / external destination | ArrowRight / ArrowUpRight                                           |
| Expand / previous / next          | CaretDown / CaretLeft / CaretRight                                  |
| Search / close / settings         | MagnifyingGlass / X / GearSix                                       |
| Contact / location                | EnvelopeSimple / Phone / MapPin                                     |
| Download / PDF / playback         | DownloadSimple / FilePdf / PlayCircle                               |
| Research / experimentation        | Flask / Atom / Circuitry                                            |
| Themes / energy systems           | SolarPanel / Lightning / Factory / Drop / Recycle / Buildings / Car |
| Certification / cooperation       | ShieldCheck / Certificate / UsersThree / ArrowsLeftRight            |

## Deliberate retained shapes

Preserve the original Apex Leaf, favicons, IRESEN wordmarks, partner logos and
social-platform marks. Keep supplied Morocco geography, map shapes and the
native geometry that explains timelines, diagrams, progress and rail positions.
Governance's zero-sized SVG portrait filters are image processing, not icons.
Shared signature corners, circular control containers, native checkbox marks
and focus outlines remain functional or branded geometry. These exceptions are
explicit; their source pixels and supplied vector originals remain unchanged.

Only three component files retain direct SVG markup: FooterIcon for the two
original social marks, PlatformNetworkIcon for supplied geography, and
GovernancePage for portrait filters. Other interface artwork uses SiteIcon.
The isolated CMS remains disconnected from real records/publication; Payload's
third-party authenticated administration UI is outside this component migration.

No public content, resource, route, search description or destination is added.
Decorative interface glyphs are not standalone public media/search results.
Existing Tabler attribution files remain historical provenance; they are not
removed or rewritten. Phosphor's unchanged MIT notice and SHA-256 are retained
with the [source inventory](references/icons/phosphor-audit.json).

## Verification ledger

Production build (including TypeScript), lint and all 170 unit tests pass.
All 74 selected public Chromium journeys pass on the final production runtime,
including the rendered-SVG audit across every canonical public route. Four
isolated CMS journeys pass (the ordinary disabled-mode assertion is intentionally
skipped in that enabled review run). Coverage includes FR/EN/AR, desktop/mobile,
200% text, keyboard/focus, open/closed disclosure states, consent, media viewers,
native/no-JavaScript reading, reduced motion, RTL and the suites' axe checks.
The local runner's reduced-motion override was corrected before confirming the
roadmap preference-change journey; no application assertion was weakened.
Desktop French/mobile Arabic header, research and FAQ captures plus the isolated
CMS dashboard were inspected. Shared inline SVG alignment keeps arrows beside
text and prevents baseline drift from the global SVG reset.

A bounded Chromium startup measurement on local production `/fr`, 1440px with
necessary-only consent, recorded 18 script resources: 254,395 encoded bytes and
860,644 decoded bytes through font readiness. This is a route-level observation,
not an icon-only delta or a Web Vitals/field performance result. It exceeds the
approximate 200KB route-JS target; no same-environment pre-icon delta was measured.
Per-icon SSR imports avoid a catalog barrel and no icon font or external icon
request is introduced. Full current-head CI is required before merging; no
deployment or public/CMS gate change is included.

## Native select follow-up — 2026-10-15

The owner's screenshot identifies a native browser arrow touching the field edge.
A shared stylesheet now covers all six public single-select locations and every
isolated CMS select, including controls previously using separate SVG overlays.
The Phosphor CaretDown regular geometry is rendered from the pinned package into
an inline SVG data URL (approved navy), recorded in the mapping inventory. Logical
text padding and an explicit 20px inset keep the glyph away from both the field
edge and the selected label, including Arabic and enlarged text. No extra DOM,
JavaScript or network request is needed. Forced-colors retains native controls.

Select follow-up checks: final production build/TypeScript and lint pass. All 33
selected public browser journeys and four isolated CMS journeys pass. Dedicated
FR/EN/AR measurements cover contact, careers, three patent filters and search sort
at 390/1440px with 100%/200% text: consistent glyph inset, reserved label clearance,
no duplicate overlay, native selection and forced-colors fallback. French/Arabic
field captures were inspected. The careers journey's temporary local record uses
its finally cleanup; no sample offer is retained. Existing public/CMS gates remain.
