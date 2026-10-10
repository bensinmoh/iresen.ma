# Careers page and opportunity database — 2026-10-10

The owner commissioned faithful implementation of the Carrières frame
[`804:8705`](https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?node-id=804-8705),
with the attached `careers.png` as a visual reference. Their later message
commissioned detailed native accordions, downloadable notices, application controls
and a dynamic opportunity database. After validating the mockup, the owner
explicitly requested deletion of the fictional offers and removal of all preview
controls. The local collection, versions and opportunity search documents were
verified empty. No sample job data or seed command remains in the repository.

## Composition and source boundaries

The canonical `opportunities` route is unchanged:
`/fr/ressources/opportunites-carrieres`,
`/en/resources/opportunities-careers` and the existing Arabic route from
`src/lib/site.ts`. Shared header/footer, approved `#296BB4`, installed Jakarta/
Alexandria typography and existing SVG identity remain authoritative. The hero,
light environment block, offer rows, photographic internship block and centered
form follow the native frame. The final owner correction replaces the decorative
typed wordmark with uppercase italic bold “JOIN” in the existing Latin font and
the original IRESEN SVG silhouette. Both emerge from the light section with a
slight negative bottom offset, left-aligned in Arabic, and its exact approved surface token (`--color-surface`). The SVG
original remains unchanged; its alpha mask retains the original logo geometry.
On mobile the composition is centered with reduced spacing below the description.
On tablets (641–1200px), the JOIN/logo composition grows to 78vw (50rem maximum).
The environment photograph uses the shared two-rounded/two-sharp signature.
Arabic mirrors only the internship background photograph so the outline frames
the same woman while text and controls retain their correct direction.
Environment/offers/application share compact 40–64px section padding; the mobile
internship image lead-in is shortened while preserving its photographic context.
All action arrows reuse NavigationIcon with explicit icon/text spacing. Responsive layouts and RTL are adaptations, with
no dedicated mobile/Arabic Figma reference supplied.

Live `get_design_context` returned code and the frame render. Isolated photograph
layers `804:8707`, `804:8732` and `804:8806` were exported through Figma; WebP
conversion preserves their rendered crops/mirroring. The later owner request replaces all raster icon
exports with lightweight inline SVG outlines. Green/cyan icon badges use the
approved transition-green/energy-cyan tokens with white decorative strokes, as requested by the owner.
Each icon is accompanied by its explicit text label.
No PNG/JPEG icon is served. These are reference workspace photographs;
we do not identify the people as IRESEN employees or the setting as IRESEN premises.
The full screenshots are not served or cut into production components. See
[asset inventory](asset-inventory.md#careers-figma-assets--2026-10-10).

The unchanged [benchmark](references/benchmark/README.md) guided scanning,
progressive disclosure and a truthful next step. It supplies no recruitment facts.
The original screenshot's job detail mixes hydrogen with GSBP copy and inconsistent
locations; fictional role-specific descriptions replace that text. The existing
owner-supplied ISO 9001:2015, +120 collaborators and **69** collaborative projects
replace the screenshot's abbreviated ISO and +60 project sample. No assertion of
unique equipment in Africa or universal 2–12 month internship availability is added.
New FR/EN/AR editorial adaptations remain working copy.

## Database, gates and lifecycle

Payload `opportunities` contains a stable unique reference, localized title,
department, location, overview, experience, availability, responsibilities and
candidate profile, plus contract, open/closed state, `isDemo`, shared visibility,
per-language publication approval and draft versions. Admin/editor/publisher roles
follow the existing workflow. Editors cannot publish. Publishing requires complete
current-language text. **Examples cannot be made public or published** by the CMS
hook; anonymous REST/Local API reads explicitly exclude them and closed offers.
Translation fallback is disabled. Applicant data is not a CMS collection.

Migration `20261011_000000_careers` follows the existing `20261010_230000` migration
(the timestamp is an ordering identifier). It adds the collection and version tables,
locked-document relation, public search view extension and durable indexing triggers.
Fresh-database migration and integration checks cover it. Generated types and import
map were reviewed; the import map does not change.

The page now queries only current public/open published records with an explicitly
approved complete locale, `overrideAccess:false`, `draft:false` and
`fallbackLocale:false`. There is no preview flag, sample-data path or anonymous
draft override. With no eligible offers, the section heading remains visible above the designed
no-opportunity message and a spontaneous application action. All stable anchors
remain and the hero action leads to this section. A database error retains a distinct availability notice. Newly
published or closed records are reflected on the next request without editing
the page component. No deployment or publication of real offers is authorized.

## Interaction and download

Native `details`/`summary` rows support pointer and keyboard disclosure. All
dividers are single lines. The row label displays localized “Référence” and the
database reference exactly (shown uppercase). Expanded
content has four metadata columns, two responsibilities/profile columns and two
actions. Offer anchors reveal their matching accordion on initial navigation and
hash changes. In-page references and application actions scroll smoothly using native browser
behavior, with immediate scrolling under reduced-motion preferences. Application
buttons select the offer, scroll to the form and focus
the first field. The internship action selects the internship radio.

`/api/careers/{reference}?locale={fr|en|ar}` downloads a UTF-8 **TXT** notice using
that locale's complete database fields. This is a generated readable notice, not
an original institutional PDF. All notices obey the current public/open/locale gates. All responses disable caching; downloads have `noindex`, fixed safe
filenames and `nosniff`. Private, closed, missing and unapproved locales return 404.

The owner-selected action label is “Envoyer ma candidature” (localized in EN/AR).
The explanatory notice and outcomes continue to distinguish an email draft from a transmitted application. The form validates required names/email/message and locally selected PDF/DOC/DOCX
CV files up to 5,000,000 bytes. No applicant data or CV is uploaded or persisted.
A spontaneous or actual offer
application prepares a percent-encoded email draft using the established official
contact; the person attaches the CV manually in their mail application. The page
explains this before any action. There is no false receipt, delivery promise,
consent claim or completed online recruitment backend. Such a backend requires
separate commissioning and approved processing arrangements.

## Anchors and search

All six previous anchors remain reachable: `open-opportunities`,
`find-opportunity`, `working-at-iresen`, `apply-respond`, `archives-results` and
`questions-unsolicited-applications`. The finder/archive compatibility anchors
remain within the offer module; no filter or archive collection is claimed.

The static catalog registers page/section copy and each photograph with real
FR/EN/AR descriptions. No deleted examples or preview copy enter its content or spelling vocabulary. Approved actual offers
are indexed as section results at their stable accordion anchors and as document
results at the download route. The SQL view enforces public, open, non-demo,
published-revision and locale-approval gates with a text revision fingerprint.
Update/withdrawal/closure/deletion immediately excludes old results/vocabulary;
durable triggers rebuild eligible notices. The normal search rebuild includes
opportunities. Exact-before-linguistic/typo/related ranking remains unchanged.
The final full-content search sanity check is still deferred.

## Application privacy wording

The owner replaced the previous local-draft footer with a linked privacy mention.
It describes application-assessment purpose and the framework of Moroccan Law
09-08 under CNDP oversight. The reference was verified against the CNDP's
[official legal texts](https://www.cndp.ma/textes-et-lois/) and
[website guidance](https://www.cndp.ma/ar/ملاءمة-مواقع-الانترنت/).
No CNDP receipt, authorization, retention duration, registration or blanket
compliance claim is invented. FR/EN/AR wording remains editorial/legal working
copy. The established policy route remains; the mail-draft outcome still explains
the actual next step and manual CV attachment. This wording change does not
create an applicant-processing backend or authorize deployment.
The mention uses light italic type, centered text and automatic inline margins
to center its constrained reading width beneath the full-width submit button.
