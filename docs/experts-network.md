# Expert network — preparation, 16 October 2026

## Commission and current boundary

The owner requests analysis of the supplied workbook, a database structure and
ready filter definitions, anticipating CMS management and later website integration
after the source is populated. This increment prepares contracts only: no expert
import, live CMS collection, database migration, public route, search projection or
publication. Workbook notes and suggestions are source evidence, not instructions
or approval. The original file remains unchanged outside the repository.

## Source analysis

Source: `Cartographie_Experts_Programmes_Thematiques_PMO.xlsx`; the SHA-256 is
recorded in [the reference contract](../config/experts-network/reference.json).

- Four worksheets: Référentiel, Cartographie experts, Dashboard KPI, Listes.
- Ten thematic programmes and 53 proposed specialties; these are this source's
  taxonomy, not a replacement for the website's seven research themes.
- The expert worksheet has 22 columns and 500 prepared input rows. Only row 2
  contains values: Green Hydrogen and EXP-001. No name or completed expert exists.
  This incomplete starter is excluded, including from any real-expert counter.
- The source's unit is an expert × specialty assignment; one expert can occupy
  several rows. Global totals must count distinct expert IDs.
- Listes supplies expert types, levels, record statuses, availability, intervention
  domains and optional gender. Status and availability are absent from the 22
  input columns even though dashboard formulas refer to them.
- Cached dashboard values include 13 `#REF!` errors (three headline indicators
  and ten programme validation counts). The workbook's displayed counts are not
  reliable evidence of an operational network. Distinct-count calculation and
  future validation/availability formulas need repair in the source workflow.
- `Hybr idation et systèmes multi-énergies` contains a spacing typo. The contract
  retains sourceLabel verbatim and proposes Hybridation in labelFr separately.
- National/International is a scope field, not a country or nationality. Country
  remains empty until explicitly supplied. No language proficiency is supplied.

## Prepared relational structure

[schema.sql](../config/experts-network/schema.sql) is a non-executable preparation
contract for later translation into Payload collections and generated migrations.
It is deliberately not registered in the current Payload configuration.

| Entity / intended CMS collection | Role                                                                                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| expert-programmes                | Ten stable programme IDs; source and display labels                                                                                          |
| expert-specialties               | 53 stable IDs, each belonging to one programme                                                                                               |
| expert-organisations             | Reusable institutions; reviewed aliases during import                                                                                        |
| network-experts                  | Unique source ID, identity, affiliation, team, location, type, function, experience, degree, private contacts and internal record management |
| expert-specialty-assignments     | Expert–specialty pair, level, keywords, interventions, evidence, equipment and individual validation                                         |
| expert-public-profiles           | Separate localized display name, role and biography, editorial approval and publication authorization evidence                               |

Every source column has a destination in the SQL contract. H/F is optional and
internal; there is no public gender filter. Free-form references remain source
text until reviewed; a DOI, CV and publication are not interchangeable. No private
CV upload or automatic external retrieval is commissioned.

An expert has one current primary organisation in this first model. Multiple
concurrent affiliations, if supplied later, should become a separate relationship
with dates rather than duplicate expert records. Experience may be fractional;
unknown experience is null, never zero. Profile approval is separate from technical
validation of each specialty and from operational availability.

## Filters and counting

[filters.json](../config/experts-network/filters.json) defines filter keys,
dependencies, private-only fields, pagination and counting semantics. Public
candidate filters are programme, specialty, organisation, city, country, geographic
scope, expert type and intervention, plus text search on approved display fields.
Their eventual availability depends on completeness and publication approval.
Internal CMS filters additionally cover expertise level, availability, record
status, assignment validation and overdue review.

Across dimensions use AND; within a dimension use OR. Programme constrains the
specialty selector; changing programme removes incompatible specialty selections.
All specialty-specific conditions must match the same assignment. Return each
expert once. Facet counts apply other filters while replacing the current facet;
programme coverage can overlap and must not be added into a global expert total.
Reset and stable pagination are required; changing a filter resets page one.
Public search must use only approved profile fields and approved assignments,
never email, telephone, gender, internal notes or unpublished evidence.

## CMS integration reserved for the populated-source phase

Add a “Réseau d’experts” group with the six collections above. Follow current
staff/publisher/admin access roles: staff maintains internal records, designated
reviewers validate assignments, publishers approve localized public profiles,
administrators control deletion. Apply authorization server-side to REST and Local
API queries, including relationship population and exports. Internal collections
must have no anonymous read access; private fields must never share a public
document response by default. Existing production administration gates remain.

Expert editor tabs: Identity and affiliation; Expertise assignments; References
and equipment; Private contact; Review; Public profile FR/EN/AR. Filter lists by
source ID, organisation, status and last verification. Record reviewer/time and
explicit publication authorization evidence. Approving a person does not approve
every specialty, language or publication field. Keep languages in review with no
fallback; no fabricated translations. Audit changes using existing CMS versions.

## Future update/import procedure

1. Read the new workbook without modifying it; record hash, date and batch ID.
2. Validate headers and programme–specialty pairs against the reference IDs.
   Unknown or changed labels enter a review report rather than automatic taxonomy
   creation. Preserve original labels; do not derive IDs anew from mutable names.
3. Stage rows outside public collections. Reject unnamed starters; require stable
   source ID, names and a valid specialty for import. Keep incomplete rows in the
   private import report for correction. Never create EXP-001 as a real person.
4. Group by source ID and compare identity/contact/affiliation across rows. Flag
   conflicts; never silently pick the last row. IDs are immutable; names alone
   cannot establish identity. Identical expert–specialty duplicates collapse only
   when values agree; conflicting assignments require review.
5. Upsert approved expert IDs and assignment pairs transactionally. Reimporting an
   identical batch is a no-op. Preserve editorial text, validation, authorization
   and manually curated fields unless the reviewed change explicitly replaces
   them. Missing rows never authorize deletion; propose inactivity for review.
6. Reconcile unique people and assignment counts; report rejected rows, conflicts,
   missing IDs, unmapped values and pending reviews. Keep private import reports
   and personal data outside Git. Do not execute spreadsheet formulas or use
   dashboard cached values as records. No import command is activated yet.
7. At website commissioning, reuse the canonical expert-network destination from
   the route authority, add locale-approved search references, implement an explicit
   public allowlist projection and verify withdrawal/search exclusion. No new route
   or public indexing is needed for this preparation increment.

## Verification ledger

Read-only extraction inspected all four worksheets and source values; no workbook
save occurred. Contract checks verify 10 programme IDs, 53 specialty IDs, unique
IDs, valid programme relationships, zero imported experts and parseable JSON.
Whitespace and changed-file formatting checked. Runtime, database and browser
tests are not applicable to inactive contracts; no active CMS behavior is claimed.
Shared-checkout coordination blocks final Git/CI completion until all responsible
workstreams explicitly report readiness. Only this workstream reports its status.
