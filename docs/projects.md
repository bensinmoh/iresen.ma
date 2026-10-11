# R&D&I projects — 2026-10-11

The owner commissioned the canonical projects page using Figma frame `804:9285`
and `projets.png`, and explicitly requested a fictional project database.
Existing FR/EN/AR routes and the shared header/footer remain authoritative.
No deployment, real project publication, visibility change or external service
is commissioned.

## Delivered page

A light glass-symbol hero, institutional navy filter band, three-column desktop
catalogue and six records per page follow the supplied composition. Tablet uses
two columns and mobile one; filters reflow to four/two columns with full-width
keyword search. Current brand colors, installed Latin/Arabic fonts and the shared
SVG controls replace historical Figma styles. Arabic retains the original image
orientation with a full-width contrast layer. Status labels have readable colors.
The source's “more than 60” wording is not adopted as a new claim.

Native GET filters combine free text, domain, launch year, status and programme.
Text matches localized titles/descriptions, acronyms, IDs and programme,
ignoring case and diacritics. Selects update the catalogue immediately with JavaScript; the
search button/Enter submit all controls without JavaScript. Pagination preserves
filters, resets on a new filter submission and clamps invalid page numbers.
Reset, zero-result messaging and accessible current-page/disabled arrow states
are implemented. The five legacy section anchors remain reachable. Cards open their existing metadata in a native detail dialog from the physical
right. Without JavaScript, their links open an inline detail on the same canonical
page. No invented contact actions, partner claims or results are added.

## Fictional database

`src/data/projects-demo.json` is the minimal structured demonstration database,
following the existing static patent catalogue architecture. It contains 24
unique records, seven domains, three programmes, three statuses and five launch
years (2022–2026), with complete FR/EN/AR working text, duration and budget in MAD.
The page displays budgets in millions of MAD (MMAD). Fictional coordinators
have no real institution names or personal information. Each record has
`fictional: true`. The later owner request explicitly removes all fiction notices
from the frontend. Source provenance remains here and in the database; placeholder
coordinators and provenance flags are not passed into the client-facing records.
Programme codes render without the demonstration prefix.

The database is intentionally separate from the CMS, real portfolio and
institutional indicators. No CMS schema, seed command or database migration is
introduced. The requested demonstration records do not reintroduce removed
career fixtures. Their replacement by genuine records requires a separate
editorial/publication workflow and verified project evidence.

## References and search

Live Figma design context and its screenshot were inspected for the full frame,
header and cards. The individual glass hero and six card photos were downloaded
from native Figma fills and converted to WebP. The first six cards retain their
source visual slots (thermal field, PV house, solar cooling installation,
experimental dwelling, PV cells, wind turbine). Later cards reuse these as
illustrations; they are not photographs proving the existence of fictional projects.
Figma assets do not establish independent photography rights beyond the owner's
supplied design-use instruction. Source originals remain ignored local references.
Hashes/dimensions are recorded in `docs/projects-assets.json`.

The retained research-institute benchmark informs the separation of theme,
programme, project and evidence. Its original remains unchanged. Sample text in
Figma and recommendations in the strategy documents are source data, not new
facts or authorization.

Localized page/section metadata and seven explicit static media references are
registered in the general search catalogue. Fictional project names and metadata
are excluded from institutional search; the page-local search is the only search
of this demonstration database. Locale copy remains working editorial text.
The final site-wide content/glossary search sanity check remains pending.

## Verification

See the dated entry in [validation](validation.md). No external API, applicant
submission, deployment or public publication-gate change was made.

Review captures (repository documentation only, outside public assets/search):
[French desktop](review/projects/fr-desktop.webp) and
[Arabic mobile](review/projects/ar-mobile.webp).

## Interaction follow-up — 2026-10-11

The owner-provided local MOV supplies the hover/detail interaction reference; it
is not a public asset or repository import. Hover keeps the image frame fixed
and zooms only its image by 6%, with the reference’s restrained card elevation.
The native dialog has a sticky compact title/status/close row, full-width image
and independently scrolling details. It enters from the physical right even in
Arabic; mobile uses the viewport width. Escape, backdrop dismissal, trapped focus,
restored trigger focus and a stable scrollbar gutter preserve the reading context.

The enhanced form updates the 24-record client catalogue and native history
without a reload or hash scroll; back/forward restores filter values and results.
GET submission, pagination and detail links retain their no-JavaScript fallback.
Each change cancels earlier list animations and gives the new cards a bounded
300ms arrival with at most 100ms stagger. Text retains full contrast; only photos
fade. Changing the motion preference cancels active list animations. Catalogue height settles over 300ms,
reserving enough height to keep the current viewport stable when results shrink.
Reduced motion updates directly; hover and panel travel are disabled. Project
articles own these transitions and are excluded from the shared first-scroll reveal.

Search metadata now describes the page, themes and media without the removed
notices. The five legacy anchors remain; no database project is registered as an
institutional search result. FR/EN/AR interface additions remain working copy.

Current detail/hover captures: [French desktop detail](review/projects/detail-fr-desktop.webp),
[Arabic desktop detail](review/projects/detail-ar-desktop.webp),
[French mobile detail](review/projects/detail-fr-mobile.webp),
[Arabic mobile detail](review/projects/detail-ar-mobile.webp) and
[fixed-frame hover zoom](review/projects/hover-fr.webp).

## Complete detail and project notes — owner follow-up, 2026-10-11

The owner's three later screenshots commission the full detail structure:
expanded presentation, acronym/year/duration/budget in a two-column metadata grid,
hosting platform and coordinator contact, consortium chips, scientific objectives
with SVG checks, then coordinator-contact and project-note download actions.
Each demonstration record now stores these fields in `details`, with complete
FR/EN/AR working copy. Consortium entries describe participant roles; platform
labels are demonstration descriptors, not verified assignments to real facilities.
No supplied example person, portrait or organisation is assigned to these records.

The owner explicitly selected **contact@iresen.ma** until individual project emails
are supplied. `details.coordinator.email` is per-record; updating it changes that
record's local email-draft action. Optional phone/portrait fields remain null.
The current central-contact card uses an outline SVG instead of an invented portrait.
The project button opens a mail draft with a project-specific subject; it does not
send an email or promise online receipt.

72 tagged, selectable-text PDF notes (24 projects × FR/EN/AR) are generated from
the same database under `src/data/project-notes/`, outside `public/`. The validated
attachment API `/api/projects/{id}/note?locale={locale}` serves the requested note,
without locale fallback, with `no-store` and `noindex, nofollow`; unknown IDs/locales
return 404. The source hash and per-file hashes in `manifest.json` detect stale
notes; regenerate them after editing project fields using `pnpm projects:notes`
(requires the existing Playwright Chromium installation). The standalone build
explicitly traces these files. Private screenshot/video originals remain excluded.

`src/lib/project-notes.ts` registers stable localized note references (identifier,
URL, document type, title and descriptive body). Their search eligibility is
explicitly false while their sources remain demonstration/editorial fixtures;
the general search projection enforces that exclusion. No note becomes evidence
of an institutional project, approved partnership or achieved scientific result.
Replacing the demonstration database with verified projects and approved notes
requires the real editorial/publication workflow. No deployment is authorized.

Detail follow-up review: [French actions](review/projects/detail-fr-bottom.webp)
and [Arabic mobile actions](review/projects/detail-ar-mobile-bottom.webp).
