# Valorisation and patent catalogue — 10 October 2026

The owner commissioned a revision of the existing `transfer` page using their
French copy, the supplied Figma canvas and 59 filed patent references selected
from the workbook. The six canonical section anchors and all 22 routes remain.
The new reading order is introduction, research-to-impact pathway, intellectual
property, valorisation pathways, technology catalogue and two entry points.
The portfolio figures are nested within the catalogue.

## Source and minimal database

Source: `IRESEN_Brevets_Dashboard_Dynamique_Pro_2026-10-07.xlsx`, consolidated
reference sheet, source date 7 October 2026. SHA-256:
`04e4248aadf232b9fa4a67e4760f6d27b587bfb1b139a3162d73a5f47f43d1c4`.
The original remains outside the repository and is never served or indexed.
Embedded workbook guidance is source material, not an instruction or approval.

From 63 unique source rows, exclude the four marked `Exclu / anomalie source`:
34695, 35299, 20150313 and 20150464. The remaining **59** are filed references;
this count does not mean 59 granted, active or commercially available patents.
The owner's earlier approximate active-patent sentence is replaced by the
requested catalogue count without asserting active rights or commercial adoption.

[src/data/patents.json](../src/data/patents.json) is the dedicated, versioned
structured catalogue database. Its sole row fields are reference, original
title, short FR/EN/AR description, thematic IDs, applicant, filing year and
PatentRegister URL. No project, financing, source relationship, annuity,
private tracking note or legal-status field is imported. Applicant names remain
as supplied, including co-applicants; the internal qualification appended to one
applicant field is removed. Bibliographic titles and applicant names retain
their original language, explicitly identified in the interface.

Thirty-eight rows have a sourced filing year; **21** remain null and display a
localized “not provided” label. Do not infer years from reference numbers,
publication dates or source project names. Short descriptions paraphrase only
the invention title. The ten browsing themes are editorial classifications,
not official patent classes or claims about technical readiness.
EN/AR summaries and interface copy remain working translations for final review.

The database is maintained by editing the JSON through a reviewed code change.
There is no new CMS collection, schema migration, automatic workbook import or
external synchronization in this increment. Withdraw a record by removing its
row; UI, supported anchors, catalogue projection and spelling vocabulary derive
from the same records. Run the documented search rebuild after changes.

## Design and interactions

The linked Figma node `127:1781` is the whole IRESEN canvas. Live metadata and
native screenshots identify patent component `566:3494`, its default/alternate
states, and intellectual-property header `804:7031` within resources page
`804:6862`. Their measured language provides white cards with 20px physical
top-left/bottom-right corners, approximately 30px padding, strong 26px titles,
quiet metadata, arrow links and a pale catalogue band with a split introduction.
The site's approved navy/action blue and original Apex Leaf override historical
Figma palette/sample copy. Existing shared icons replace the calendar/date
ornament with a truthful filing-year label; no screenshot is used as an asset.
Original SVGs are preserved. Card height grows for real titles, summaries and
co-applicants. No unrelated Figma modules or invented sample claims are imported.

The existing photo hero now offers “Valoriser une innovation” and “Explorer nos
technologies”, pointing to the two matching page sections. The body presents six
adaptable research-to-impact stages, five native PI disclosures, four transfer
pathways, the catalogue, figures and two visitor entry points.

Catalogue search matches reference, original title, localized summary and
applicant, ignoring accents and case. Theme, sourced year (including missing
years) and individual applicant filters combine. Twelve cards initially display
with JavaScript; “show more” adds twelve and “show all” opens all matches. Reset
restores the full set and the initial twelve-card view. A direct patent hash
always reveals its record, even beyond the initial slice. Without JavaScript,
all 59 records remain readable and controls are disabled with an explanation.

“Access the patent” preserves each supplied OMPIC PatentRegister link. “Discuss
with IRESEN” opens the canonical contact route with the partnerships topic and
an allowlisted patent reference. The existing email-draft workflow prepopulates
the message with that reference and title. Arbitrary query text and unknown
references cannot become prefilled messages. Nothing is sent automatically.

## Search and verification

Page, six legacy sections, figures and each patent have localized search
references. Patent IDs are `section:transfer:patent-{reference}:{locale}` with
reachable `#patent-{reference}` destinations. Supported hashes and locale
switching derive from the current database. Original workbook and omitted fields
stay outside public projections. Search remains exact-first; no relevance rule
or broad synonym is changed. CMS publication/access gates remain unchanged.

See [validation](validation.md#valorisation-and-patent-catalogue--2026-10-10)
for actual check coverage. No deployment, DNS, visibility change or independent
legal/register verification is claimed. The [final content search sanity
check](search.md#final-content-search-sanity-check) remains due after final
whole-site content and translation review.

The owner’s follow-up removes the six-link body section navigation from
Valorisation. Its section anchors, hero actions and search destinations remain.

The final visual follow-up adds Tabler outline icons (v3.35.0, MIT license
retained beside the component), an existing outdoor experimentation photograph
in the introduction and a restrained existing platform photograph behind the
navy pathways section. Photographs illustrate the research environment; they
do not identify an individual patent, project relationship or adoption outcome.
The existing media search references are reused. No asset, dependency, brand
token or institutional claim is added.

The owner's date-display follow-up presents the reference period as the fourth
quarter of 2026 in FR/EN/AR, both in the figures and the catalogue footer. The
exact source date remains internal provenance; public search inherits the
localized quarter from the same content catalogue. No 2024 source is asserted.

## Compact patent catalogue — 2026-10-10

The owner requests a shorter search area and smaller cards. Search, theme,
filing year and applicant share one desktop row; tablet uses two columns,
mobile groups the two short filters while search/applicant span the width,
and very narrow/enlarged-text layouts stack. Visible labels and 44px minimum
control targets remain. Card padding, gaps, title scale, metadata and action
layout are compacted without clipping titles, summaries or applicant names.

A native 240ms transform/opacity transition introduces new cards and animates
retained cards from their previous grid positions when criteria change.
Keys and links remain stable; changing criteria or limits cancels an earlier
transition. Reduced motion disables the effect and cancels active movement.
No fake loading state, delay, new dependency, content or search destination
is introduced. All 59 references and no-JavaScript reading remain.
