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
structured catalogue database. Its sole row fields are reference, bibliographic
title (reviewed sentence case), short FR/EN/AR description, thematic IDs, applicant, filing year,
optional verified ISO filing date and PatentRegister URL. No project, financing, source relationship, annuity,
private tracking note or legal-status field is imported. Applicant names remain
as supplied, including co-applicants; the internal qualification appended to one
applicant field is removed. Bibliographic title wording and applicant names retain
their original language, explicitly identified in the interface.

The initial import had 38 sourced filing years and 21 missing values. The
register enrichment below supplies 12 exact dates and derived years; 50 records
now have a sourced year and **9** retain the localized “not provided” label. Do not infer years from reference numbers,
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
years) and individual applicant filters combine. Six cards initially display
with JavaScript; “show more” adds six and “show all” opens all matches. Reset
restores the full set and the initial six-card view. A direct patent hash
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
reachable `#patent-{reference}` destinations. Since 10 October 2026 these
individual records carry the semantic search type `patent`; the historical
identity prefix remains stable and does not classify them as sections. Supported hashes and locale
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

The owner’s later French label correction abbreviates this period to **T4 2026**,
both in the figures and the catalogue footer. The quarter and source provenance
remain the same.

## Official register filing-date enrichment — 2026-10-10

The owner authorizes consulting each of the 21 supplied PatentRegister links
whose filing year was missing. All links were checked. For the twelve accessible
dossiers, both the displayed application reference and the field
“Date de depôt de la demande” were verified. Publication dates were not used.
The exact date is stored as optional `filingDate` (ISO 8601), and its year
updates `filingYear`, the existing card/filter field. Other data stays untouched.
Existing search projections now include this sourced date.

| Reference | Filing date | Official source                                                                                                        |
| --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| 37172     | 2014-07-01  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=37172&count=0&lang=FR) |
| 37225     | 2014-07-18  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=37225&count=0&lang=FR) |
| 37414     | 2014-10-10  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=37414&count=0&lang=FR) |
| 37655     | 2014-12-12  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=37655&count=0&lang=FR) |
| 37705     | 2014-12-25  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=37705&count=0&lang=FR) |
| 38683     | 2015-12-16  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=38683&count=0&lang=FR) |
| 39325     | 2016-09-05  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=39325&count=0&lang=FR) |
| 41069     | 2017-09-12  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=41069&count=0&lang=FR) |
| 43487     | 2018-10-22  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=43487&count=0&lang=FR) |
| 43620     | 2018-11-14  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=43620&count=0&lang=FR) |
| 44300     | 2018-12-19  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=44300&count=0&lang=FR) |
| 54581     | 2021-10-04  | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=54581&count=0&lang=FR) |

The nine remaining pages all return “Ce brevet n'existe pas ou n'est pas encore
publié”; they do not disclose a filing date. This message does not determine
which of those alternatives applies. Their years remain null and no date is
inferred from numbers, source projects or other dates.

| Reference | Official page checked                                                                                                  |
| --------- | ---------------------------------------------------------------------------------------------------------------------- |
| 71194     | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=71194&count=0&lang=FR) |
| 71521     | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=71521&count=0&lang=FR) |
| 71776     | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=71776&count=0&lang=FR) |
| 71777     | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=71777&count=0&lang=FR) |
| 72762     | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=72762&count=0&lang=FR) |
| 72763     | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=72763&count=0&lang=FR) |
| 73157     | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=73157&count=0&lang=FR) |
| 74890     | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=74890&count=0&lang=FR) |
| 74893     | [PatentRegister](https://patentregister.ompic.ma/SearchPatent/searchByDepot?typeNum=AP&numDepot=74893&count=0&lang=FR) |

Raw register pages remain temporary local inspection material, outside the
repository and public search. No annuity, project or relationship field is imported.

## Valorisation photographic refinement — 2026-10-10

The owner's later photo request replaces the generic solar/platform imagery
with the existing generated laboratory, prototype-testing and energy-network
illustrations. The hero uses the research photograph, the introduction uses
the mission laboratory scene and the navy pathways background uses the test
installation at the existing restrained opacity. Existing provenance and media
search references remain authoritative; these are illustrative scenes, not
documentary IRESEN facilities, patent evidence or commercialization claims.

The two entry-point blocks replace bulb/search icons with narrow portrait photo
strips, occupying 22% of each block and stretching to its content height.
The researcher and energy-network presenter have separately tuned crops; text
and CTA arrows remain readable alongside them in FR/EN/AR and on mobile.
No new bitmap, dependency, shared token, route or publication is added.
Localized informative alt text is included in the existing section search
projections; the decorative hero/background remain silent to screen readers.

## Patent title case and initial display — 2026-10-10

The owner's later correction uses sentence case for all 59 bibliographic titles,
preserving wording, proper/scientific names and technical acronyms (PV, BIPV,
V2X, GEP-PVSMS, Intel.PV and BrickDOUM). No CSS text transform hides inconsistent
data. Cards, contact drafts and public search use the same reviewed titles.
The catalogue initially displays six cards, two desktop rows of three; show
more adds six, criteria changes/reset return to six, and show-all, direct
anchors and all 59 no-JavaScript records remain available.

The owner's next correction joins the final innovation entry-point section
directly to the footer by removing only the transfer page's outer trailing
padding (page, content wrapper and shell). Section-internal breathing space
remains. The override is scoped through the transfer module, not shared pages.

## iSmart valorisation example — 2026-10-10

The owner commissions an iSmart product feature within the existing intellectual
property section. Its heading, introductory copy and five native disclosures
form a left column; the supplied transparent product visual occupies the right
column under “Exemple de valorisation réussie”, iSmart, electric-vehicle charging
and the owner's existing 100% Moroccan claim. Below 64rem the example follows
the disclosures. Arabic mirrors the columns through logical layout, never the
product or original Apex Leaf artwork. No reference diagram arrows, product
callouts, invented patent attribution, license or commercialization figures
are added. The pale original Apex Leaf sits behind the product at low opacity.

The supplied PNG already contains an alpha channel; it is not regenerated or
retouched. A 1200×1312 WebP derivative preserves transparency (128,506 bytes).
Source `iSmart Product.png` SHA-256:
`d9dc2d11823cef1712d4c6b184b34509cf64178ede03d15fcd8f1b105d3700bf`.
Derivative SHA-256:
`931a1ff250c7bc6a284bae4ae964083c9b6c6ce8b2d29e778162fbd080bf75dd`.
The original and reference screenshots remain outside the repository.
FR/EN/AR working copy, informative alt text, the `ismart-example` anchor and
its localized section/media search references ship together. Six canonical
sections, catalogue behavior and existing routes remain. No deployment.

The owner's next refinement replaces the typed iSmart name with the supplied
vector wordmark. `src/assets/brand/ismart-original.svg` preserves its bytes
(SHA-256 `49da4a8df99b159ff240e5d886b87ebe59532b329db8929a91af5531c47c8ed0`).
The authorized color variant uses institutional navy for the letters and primary
blue for the i dot; all paths/viewBox remain unchanged. The original remains a non-served source; the displayed variant
has one localized media search reference. The example heading is now a tiny
0.75rem uppercase label with natural Arabic tracking; the description is light
300-weight italic in the existing muted text color, on one line where it fits.
Very narrow/enlarged-text screens permit wrapping instead of overflowing.

The product photograph links directly to the owner-specified
`https://www.i-smart.ma/`, with a localized accessible name and visible keyboard
focus. The native link adds no annotation arrows or automatic navigation.

The transfer introduction now meets the hero directly: its breadcrumb, shell
padding and content divider are removed only on this page. The lab photograph
precedes the introduction text (left in FR/EN, mirrored in AR), with the existing
internal section spacing retained. Mobile stacks the photograph before the copy.
Other pages keep their breadcrumbs and shell defaults; existing anchors and
search projections remain unchanged.

## Localized patent titles — 2026-10-10

The owner requests all 59 patent titles in the selected FR/EN/AR language.
`title` now stores complete locale-keyed text, preserving the existing French
bibliographic wording. English/Arabic display translations retain scientific
names, product names and acronyms without changing filing identifiers, dates,
applicants or register links. They are website translations, not official
translated register titles. Cards use the selected language/direction; catalogue
filtering, public search title/body and contact drafts use the same title.
Stable patent anchors and search identifiers remain unchanged. These working
translations remain subject to the site's final editorial review.
