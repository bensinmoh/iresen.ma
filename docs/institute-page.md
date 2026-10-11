# Institute page — 2026-10-11

The owner commissioned the canonical Institute page after completion of Governance.
That prerequisite was satisfied by PR #93. The French pasted manuscript supplied
with `about.png` is the content source for this implementation; it supersedes
small wording differences in the earlier [editorial draft](institute-content.md).
The private attachment is not imported into the repository or served as a download.
EN/AR are complete working adaptations requiring final editorial review.

## Composition and sources

Read the native Figma frame `804:8896` in file `0go8QANZAH73ed9AoCdHkf` through
its design context and screenshot, and inspected the supplied `about.png` reference.
The reference establishes editorial hierarchy, white/navy sections, fine rules,
paired ambition imagery and timeline markers. Its sample figures, four-pole
organisation, outdated copy and example report files are not adopted.

The [retained benchmark](references/benchmark/README.md) informs purpose before
institutional detail, distinct contributions and honest supporting resources.
The page adapts the current shared photo hero, founding-year/pathways band,
full-width mission quotation, a positioning introduction, three substantial
mission rows with native disclosures, and a common cooperation band. Five values
use quiet definition rows. The 2035 ambition remains separate from the historical
journey. Eight major milestones form a native horizontal timeline at every
width, with keyboard/touch scrolling and previous/next SVG controls. All eight
items remain available without JavaScript; no auto-scroll or navigation pills.
Their two supporting achievements retain explicit labels and smaller italic text.

The manuscript includes no governance section. Councils and organisation stay on
the separate page and the shared navigation. The hero's existing related destination
remains canonical. The body adds no governance tabs or four-pole sample cards.

Reused solar-sunset and workshop photographs are generated conceptual illustrations,
not documentary evidence of IRESEN personnel/facilities; their original metadata,
provenance and localized public search references remain in
[hero-assets.json](hero-assets.json) and the existing asset catalog. The owner’s later attachment supplies a nine-page
book mockup; only its full first page is rasterized as the requested cover image. The PDF and its eight other pages
are not imported or served. See [asset provenance](institute-assets.json). No new
icon raster, external font, dependency, logo or CMS schema is introduced.

## Routes, reading and search

`src/lib/site.ts` remains the sole route authority: `/fr/institut`, `/en/institute`,
`/ar/المعهد`. Preserve the six legacy targets `about`, `mission`, `capabilities`,
`ambition-2035`, `key-figures`, `more-resources`. `key-figures` is a compatibility
anchor in the retrospective; it does not assert a new figures dataset.

The [section map](../src/lib/page-sections.ts) registers positioning, the three
missions, cooperation, values and history as children alongside those targets.
Locale switching preserves these anchors through the existing shared helper.
The static public search projection includes the page and every registered
section in FR/EN/AR, with complete mission activities/contributions, eight
milestones, both supporting entries, real topic terms and acronym expansions.
The existing current-public gates remain unchanged. The report presentation is
searchable as a section, with no invented PDF document result. Private references,
editorial drafts and source attachments remain excluded.

Native details retain keyboard/pointer and no-JavaScript reading. Logical CSS
mirrors Arabic layouts; physical signature corners remain shared. Shared first
arrival motion owns headings/quotations. Disclosure chevrons use only a small
rotation, removed for reduced motion. No section wrapper is animated.

## Fifteen-year report

The owner explicitly requested `#` for both report actions while the PDF is
provided later. The page presents the supplied teaser, original period and two
placeholder links, without a download attribute, fake PDF,
file size, publication date or substitute Ministry document. These links require
the actual public resource before a real reading/download workflow is delivered.
The supplied first-page cover mockup now illustrates the report feature and has
a separate localized media search reference with its original cover wording. Its
image does not supply a public report PDF or adopt its embedded strategic claims.
Publications/reports and media resources link to their existing canonical sections.

No deployment, visibility change or new publication approval is authorized.
Final values/translation review and the full-content search sanity check remain
pending. See [verification](validation.md#institute-page--2026-10-11).
