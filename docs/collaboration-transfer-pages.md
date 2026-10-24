# Collaboration and valorisation pages — 10 October 2026

The owner commissioned development of the existing `workWithUs` and `transfer`
pages. This increment populates their six canonical sections in FR/EN/AR with
working editorial copy derived from the revised narrative. It changes no route,
CMS schema, publication gate or service commitment. Final institutional and
translation review remains due.

## Content and boundaries

“Travailler avec nous” starts from a decision, research/experimentation need,
skills need or use of a result. It explains complementary contributions,
cooperation formats, preparation of a common project and a non-confidential
first discussion. Partnerships, networks, institutional exchanges and events
retain the owner's corrected narrative wording. Cartography and World Power-to-X
Summit reuse existing achievement evidence and images.

“Valorisation & transfert” covers knowledge, methods, technologies, capabilities
and decision tools. Uses and feedback guide maturation; commercial transfer is
one conditional possibility. The page distinguishes dissemination,
co-development, technological transfer and entrepreneurial initiatives. Native
intellectual-property disclosures offer questions for competent teams; they do
not state legal rules or a standard contract. iSmart and AquaSolar reuse existing
references without asserting commercial adoption or measured impact.

Both closing sections provide practical preparation checklists and link to the
existing contact page with `subject=partnerships`. That page retains its local
email-draft workflow; no sending endpoint or new application procedure is added.

## Composition and implementation

The shared server-rendered template keeps the existing photo heroes and published
CMS body. Six compact anchor links lead to editorial split sections, open item
grids, an ink contribution panel, existing reference photographs and a closing
ink checklist. Native details work without JavaScript. Layouts stack on tablet
and mobile; logical properties and natural Arabic typography support RTL.

Canonical identifiers remain in `src/lib/page-sections.ts`; the presentation
model supplies section kinds and stable helper-built destinations. No asset,
dependency or client component is added. Original media search references remain
shared rather than duplicated.

## Search and editorial follow-up

The static search projection includes every new item, disclosure, checklist and
note in each page and its canonical section result. Existing locale and public
eligibility gates remain. Source documents and editorial guidance are excluded.
See [narrative alignment](narrative-alignment.md) and [search](search.md).

Further institutional records, supported transfer cases, outcome measurements,
availability conditions and final translations require their own review. The
[final content search sanity check](search.md#final-content-search-sanity-check)
remains pending for the completed website.

## Later transfer-page revision

The owner's later 10 October request supersedes the transfer composition and
copy above with a research-to-impact pathway, PI support, four valorisation
routes and the 59-reference patent catalogue. Collaboration remains unchanged;
all six transfer section anchors remain. See
[the current scope](valorisation-patents.md).

## Collaboration page redevelopment — 2026-10-10

The owner's later request renames and redevelops the existing `workWithUs` page as
“Collaborer avec nous”. The six anchors and working FR/EN/AR content remain.
Need-based light entry panels, open contribution/format rows, a four-stage
sequence, existing reference photographs and an ink contact checklist adapt the
live Figma cooperation frame within the current shared rules. FR/EN canonical
paths change together; permanent redirects retain the former URLs. Shared
navigation, footer, SEO and search consume the updated central definition.
See [scope and reference decisions](collaborate-page.md).

Owner withdrawal — 2026-10-16: remove the organisation-contributions closing
note beginning “Le besoin détermine les contributions pertinentes” and its
divider in FR/EN/AR. The optional note is absent from localized content; the
existing conditional paragraph therefore renders neither text nor separator,
and shared section/page search projections no longer include it.

Owner follow-up — 2026-10-16: also withdraw the `need-to-project` note
beginning “Ces repères ne constituent pas une procédure d’admission” in FR/EN/AR.
Its conditional paragraph/divider and derived search text disappear together.

Owner follow-up — 2026-10-16: remove the `choose-pathway` closing note
beginning “Ces entrées se complètent” and its divider in FR/EN/AR, including
the derived search text. Other section content and destinations are preserved.

## Real transfer-page photography — 2026-10-23

The owner replaces all five AI-photo placements on Valorisation & Transfert
with relevant photographs from the collection ingested today. The transfer hero
uses the research team around a PV module (009), the introduction uses laboratory
collaboration (043), the pathway backdrop shows the iSmart assembly workshop
(213), and the two contact pathways use a collaborative innovation workshop
(148) and a researcher adjusting a pilot installation (128). This is visual
context, not a claim of specific licensing, adoption or commercial results.

[Source hashes and derivative dimensions](transfer-photo-assets.json) identify
the selected collection originals. The iSmart workshop reuses its existing public
source image, whose hash matches the original fingerprint of collection item 213;
no duplicate asset or search identity is added. Other images have proportionate
WebP derivatives and localized descriptive alt/media text. The hero has a
right-anchored 720 × 1080 mobile crop (about 26KB), sharing its desktop media
identity. All original collection files remain unchanged.

A dedicated transfer hero key prevents changing the shared research hero on other
pages. Existing iSmart product photography, page layout/content and functionality
remain. Other pages’ generated assets remain registered as AI; they are not
reclassified by this request. Native CSS retains the dark pathway overlay and
sets subject-aware contact-photo positions. New public photos are source-reference
assets in provenance and have localized media search references.

Verification: targeted ESLint, Prettier and whitespace checks pass. All six
served/derivative hashes match source-reference provenance; static catalog
checks find one media identity per photograph in each locale, with no duplicate
mobile hero result. Live FR/EN/AR search finds the real laboratory photograph
and excludes the former AI mission images. Development review covers French
hero/intro/pathways/contact at desktop and 390px, English desktop introduction,
and Arabic 390px introduction/contact, with loaded images and no page overflow.
The narrow pilot crop retains the researcher’s face. The mobile hero uses its
26KB crop. Production build/full tests/CI remain pending under the shared hold.

The five new static file paths are explicitly allowed through one grouped Next
image pattern, keeping within its 25-pattern limit. The installed matcher was
checked against each allowed path and rejected unrelated paths, CMS/private
paths and nonempty query strings. The local development server is running again
on port 3000 after applying this configuration.

## Collaboration hero and needs photo — 2026-10-23

The owner requests the existing handshake hero figures in the open right side
of the French desktop hero, clear of its copy. At 70rem and above, the existing
image is shifted right by 28%, with a navy blend at its leading edge and a
half-width copy measure. The original image bytes and mobile crop remain.
Arabic reverses the placement without mirroring people or the source image.
The adjustment is scoped to the handshake hero and does not change other heroes.

“Votre besoin / Partir de votre besoin, construire une contribution utile” now
uses real workshop photo 002 from today's collection: participants working over
documents and a laptop. The original source is unchanged, with a proportional
1600px WebP derivative. See [source evidence](collaboration-photo-assets.json).
Descriptive FR/EN/AR alt text, source-reference provenance and a single localized
media search identity replace the former decorative AI team image on this section.
The page's other audience photos remain outside this request.

Verification: targeted ESLint, Prettier and whitespace pass. The derivative hash
matches source-reference provenance; static catalog and local API checks confirm
a single descriptive workshop media result in FR/EN/AR. Development review covers
French hero at 1440px and 1120px, English/Arabic hero at 1440px and Arabic needs
section at 390px. Desktop figures stay clear of the constrained text; RTL reverses
placement without image mirroring. Mobile retains the existing hero framing and
the workshop displays below its copy, loaded with no page overflow. Responsive
image sizing accounts for the tall desktop crop. Production/full tests/CI remain
pending under the shared checkout hold.
