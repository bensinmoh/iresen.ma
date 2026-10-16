# Careers page and opportunity database — 2026-10-10

## Real offers restored — 2026-10-16

The owner commissions the two supplied French offers in the existing current-offer
section: O2605, Chargé(e) de la communication & du digital, and O2609,
Ingénieur(e) brevets. Both are CDI roles in Rabat, within Partenariats & Marketing
de l’Innovation, published in their source on 15 October 2026 with an application
deadline of 15 November 2026. The existing dynamic accordions require no UI change.
The filename-derived references identify the local records; the communication
title's grammatical typo is corrected. The owner's follow-up replaces the full
on-page transcription with a short introduction, four mission bullets and four
profile/application bullets per role. `src/data/career-offers-fr.json` records
these summaries, source filenames and SHA-256 hashes.
Internal recruitment requests and their desired start date are excluded, as is
the uncertain reporting line for the patent role. The later PDF follow-up below authorizes the two public offer originals only.

Run `SEARCH_WORKER_DISABLED=true node scripts/run.mjs tsx scripts/import-career-offers.ts`
to populate a loopback database using an existing local administrator. The importer
preserves existing records on repeat runs, rebuilds search through the existing
guarded indexer and verifies two anonymous FR records and zero EN/AR records.
Only French is approved for this integration; no translation fallback is enabled.
The original PDF notices replace TXT for these two references (see below). The owner supplies
external application destinations in `src/data/career-application-links.json`:
O2605 → `https://tally.so/r/5BRlgv`; O2609 → `https://tally.so/r/KYbka8`.
Their Apply actions are native links to those forms. These roles appear automatically in the current-offer selector; selecting one
shows its dedicated Tally action instead of local candidate fields. Spontaneous
applications and internships retain their existing email-draft workflow. No candidate information is passed in the URL.
The external forms' fields, submission and receipt are outside this implementation.
Use the importer with `--update` only to explicitly refresh these two records;
ordinary runs preserve later CMS edits. Both paths rebuild the guarded search index.

Local verification: import and anonymous locale gates pass; search rebuild includes
the two offers. The development page renders both stable offer anchors, both FR
TXT downloads return their current notices, and browser verification confirms
the patent offer opens from its direct hash and its Apply action now links to the owner-supplied Tally form. Scoped ESLint, Prettier and whitespace pass.
Full checks/CI/merge remain subject to the shared-checkout hold.
The available runtime is Node 24.19.0 (24.21.0 also installed), below the requested
24.22.0; this import is not evidence of validation on the pinned runtime.

## Original PDF actions — 2026-10-16

The owner supplies the two public offer PDFs and asks the download actions to open
them. The owner subsequently authorizes date-corrected copies served from `assets/careers/o2605.pdf` and
`assets/careers/o2609.pdf`; `src/data/career-documents.json` records source names,
original and corrected SHA-256 hashes and French-only eligibility. Internal recruitment requests remain
excluded. Next standalone tracing explicitly includes these two assets.

The existing `/api/careers/{reference}?locale=fr` destinations now serve
`application/pdf` with inline disposition after the existing anonymous
public/open/published/locale checks. The action no longer forces a browser
download. No unguarded static URL is introduced. Missing/unapproved locales and
withdrawn offers retain 404 behavior. Other future offers retain TXT fallback.
The existing guarded CMS document search references keep their stable identities,
canonical API destinations, descriptions and withdrawal lifecycle; no duplicate
static asset result is added. Previously rebuilt search references remain valid
because the URL and eligibility are unchanged. Tally application links remain.

Owner date correction: publication/launch is **15 October 2026** and the deadline
is **15 November 2026** in both served PDFs. Only the two date text operands on
the first page are changed, reusing the original font, positioning and layout.
The two remaining page content streams are unchanged. The supplied source files
in Downloads remain untouched. This resolves the earlier PDF/Word discrepancy;
the website summaries and guarded search descriptions already use these dates.

Verification: scoped ESLint/formatting and whitespace pass. Both local endpoints
return the corrected PDFs; original-versus-corrected hashes are recorded. First-page
renderings inspected for both roles; three pages and unchanged remaining content
streams verified. Inline disposition,
PDF content type and no-store headers verified. Unapproved EN returns 404.
Full production build/CI remain held under shared-checkout coordination.

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

## Navigation and careers wording — 2026-10-11

The owner replaces the hero JOIN wordmark with REJOINDRE in French and انضموا إلى in Arabic; English retains JOIN. French is enlarged and Arabic stays on one line, with responsive logo space.

The Arabic follow-up reverses the physical order of the logo and join label.

## Hero signature alignment — 2026-10-15

Owner correction: French JOIN text and the original IRESEN wordmark use the same
lower-edge bleed as English. Arabic retains its text position and offsets only
the original logo downward. A local CSS variable shares the existing desktop
0.65rem/mobile 0.45rem offset; no logo source, geometry or copy changes.
Production build/TypeScript and lint pass; three existing careers browser journeys
pass in FR/EN/AR at 320/390/768/1440px. Signature captures inspected. No content or
search change, database fixture insertion, or deployment.

## Offer reference hierarchy — 2026-10-16

Owner correction: each offer row places its localized reference label above the
isolated LTR offer code. The label is 12px, italic and shared muted grey; the code
retains its existing 14px style. Both lines align physically left with a compact
4px gap. Existing row grids, native disclosure behavior and localized accessible
names remain. No content/search text or publication eligibility changes.
Development browser inspection confirms stacked labels, italic styling and equal
left edges for O2605; both FR rows visually inspected at 1280px. Scoped lint,
formatting and whitespace pass; production validation remains under the hold.

## Conditional application selector — 2026-10-16

The owner requests automatic current offers in the form and internship categories.
Employment uses the same locale-approved, published/open `offers` result as the
accordion list, including the two Tally roles. Selecting either role exposes its
native external application link and hides local candidate fields, avoiding a
second application path. Switching between employment/internship clears the offer
and previous draft. No candidate data is passed to Tally by the website.

Internship changes the label to Type de stage and supplies PFE (final-year
project), observation, practical, hybrid, volunteering and Other. These express
candidate requests, not a guarantee that placements exist. The chosen category
is included in the email draft body and subject. FR/EN/AR labels and search terms
are complete working copy. Search retains existing canonical section references.

Verification: scoped ESLint, formatting and whitespace; development browser
confirms both current offers, O2609's correct Tally link, conditional stage label,
six internship options and observation selection at 1280px. Full production/CI
checks remain held. No submission to an external form was performed.

## Motivation field label — 2026-10-16

Owner wording correction: the application textarea label changes from Message to
Motivations (FR), Motivation (EN) and دوافع الترشح (AR). Input name, validation,
placeholder and draft behavior remain unchanged. Locale JSON, scoped formatting
and whitespace checked; no search description or destination changes.

## New-tab offer actions — 2026-10-16

Owner requests `target="_blank"`: Tally links in offer details and the application
selector, plus offer PDF links, open a new tab with `rel="noopener noreferrer"`.
In-page anchors and email-draft actions retain their existing behavior.
Scoped ESLint, formatting and whitespace checks pass.
