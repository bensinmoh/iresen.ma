# Homepage collaboration — 2026-10-09

## Narrative supersession — 2026-10-14

The [October PDF implementation](institutional-narrative-2026.md) now governs the R&I core, three
missions, three complementary dimensions and six audience pathways. The earlier
equal-domain/common-enabler composition and five-step homepage rail described
below are historical. Existing canonical routes, content provenance and service
boundaries remain. The owner reserves the explicit merge GO for the review branch.

The owner commissioned the existing `collaboration` homepage section on a dark
institutional ink background, welcoming students, doctoral candidates,
researchers, project initiators, professors, industrial companies, decision-makers
and funding partners. Reference images guide craft only. No image was supplied
in this turn or added to the runtime.

## Content and destinations

Four needs-based pathways explain research/thesis opportunities, solution
maturation and transfer, industrial decarbonisation, and informed technological
choices. FR/EN/AR copy is working wording for editorial review. The request does
not establish available thesis positions, programme eligibility, guaranteed
services, funding or results.

The owner supplied **+120** in response to the collaborator-count question. It
is labelled Collaborateurs and kept separate from the existing +1000 young
researchers supported. Its organisational perimeter and measurement date were
not supplied. The owner’s later correction applies in both this section and the hero:
“Premier institut de recherche certifié ISO 9001 en Afrique.” The detailed
standard remains ISO 9001:2015. No independent certification verification is asserted.

Research links to canonical `opportunities`. The three other links open the
existing contact page at `send-request`, preparing `partnerships`, `platforms`
or `agency` as the appropriate subject. The primary action prepares
`partnerships`. The contact workflow composes an email locally; these links do
not implement a submission service. No unsupported pathway anchor or new route
is introduced.

## Composition and scope

A left introduction and primary action sit beside four open, divider-led
pathways in two columns. The lower proof band presents +120 and certification.
At tablet widths the introduction moves above the pathways; below 40rem the
pathways and proof stack. All text can grow, focus remains visible, and Arabic
mirrors directional arrows while preserving physical action corners.

The local institutional ink ground uses the existing hero shade's opaque
`#05111D`; the approved navy `#12345A` and blue `#296BB4` remain unchanged.
No new shared palette token, background imagery or partner logos are introduced.

This replaces only the existing collaboration placeholder, immediately before
news. Achievements and capabilities remain the two unimplemented body modules;
full homepage reordering and Alliances remain deferred.

## Search and verification

The stable `section:home:collaboration:{locale}` references keep their canonical
`/{locale}#collaboration` destinations and section type. Search bodies now include
all four audiences, pathway wording, the count, certification and real topic
terms, including research and development (R&D), thesis, decarbonisation and
technology transfer. The homepage projection includes the section vocabulary.
No reference document or unsupported service is indexed. Rebuild the catalog on
an approved target after adopting this change; the local catalog was rebuilt.

See [validation](validation.md#homepage-collaboration--2026-10-09).
The website-wide final content search sanity check remains pending.

Review captures: [French desktop](screenshots/home-collaboration-fr-desktop.png),
[Arabic mobile](screenshots/home-collaboration-ar-mobile.png).

## Compact audience layout — 2026-10-15

The owner's latest correction supersedes the six-path homepage layout. Withdraw
Territories from this section and its FR/EN/AR search projection; other pages keep
their own audience scope. Desktop has three equal columns and two rows: introduction
and primary action in cell 1, Research/Talents in cells 2/3, International below the
primary action in cell 4, and Industry/Public institutions in cells 5/6. Typography,
reading measure and gaps are reduced using existing tokens, without truncating copy.

Tablet (above 40rem through 64rem) places the introduction above four pathways;
International is hidden at these widths and Territories is absent everywhere.
Mobile (up to 40rem) shows the five pathways in a native horizontal snap rail, with
a neighboring card visible and five borderless expanding pills below. Native
scrolling, keyboard focus and pill selection stay synchronized, including Arabic
RTL and reduced motion. Without JavaScript, the native rail and scrollbar remain.
The +120/certification proof band and canonical destinations remain unchanged.

Search retains `section:home:collaboration:{locale}` and the existing home section
anchor. The five current audiences supply the localized searchable body; local
static/CMS search synchronization has been run. No new public resource is created.

Verification ledger: production build (including TypeScript), lint, all 170 unit
tests, formatting and the scoped Impeccable detector passed. Production Chromium
checks cover FR/EN/AR, desktop grid geometry, four visible tablet publics, mobile
pills and native scrolling, keyboard link access, 320–1440px reflow, 200% text,
axe, canonical/contact destinations, local search and no-JavaScript reading.
The rail's accessible region name is distinct from the enclosing section. Source
order follows the desktop reading order, including International in cell 4.
Full current-head CI remains mandatory before merge; no deployment is included.

## Light transition before collaboration — 2026-10-15

The owner commissions a short pale-blue section between the dark platforms and
collaboration sections to improve page rhythm. `capabilities-cooperation` is a
stable home section anchor, registered centrally and localized through
`PageSections.home`; normal page/section search projections include its heading
and description in FR/EN/AR. The text reuses the existing Narrative capabilities
note: platforms can contribute to research, testing and training; partnerships
can bring expertise and resources together. The new short heading is working
editorial copy. No new service, proof, metric, route or primary navigation item.
Desktop pairs heading and text, mobile stacks them with natural text growth.

Follow-up verification: production build/TypeScript, lint and 170 unit tests pass.
Seven existing homepage journeys and three new FR/EN/AR surtitles/transition tests
pass on the final runtime. Coverage includes seven identical paragraph/type roles,
original leaf masks, colors, 320/390/768/1440px, 200% text, mission centering against
the full section (rather than its paragraph), transition placement and compact
height, and localized search discovery. Desktop French and mobile Arabic captures
were inspected. Public search was synchronized locally. Browser test-only fixture
repairs did not change runtime after this production build.

CMS editorial-indicator follow-up — 16 October 2026: the existing +120 count and
ISO 9001:2015 standard now read the common database's validated locale snapshots.
The same values drive careers and the hero ISO reference. Future CMS value/version
edits require publication approval; existing section/search IDs and layout remain.
