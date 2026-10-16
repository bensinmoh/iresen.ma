# Moroccan university identity reference

Owner request, 16 October 2026: standardise institutional and personal display
names across the website and resolve Moroccan establishments through their parent
universities. The follow-up explicitly withdraws new university/establishment
filter controls. Existing filters and routes remain unchanged.

## Authoritative data

`src/data/moroccan-universities.json` records 26 university identities, 289
establishment/component/annex/research-centre identities and three autonomous institutions already
encountered in site content. Every relationship points to a university ID; every
record cites source IDs. The source manifest includes URLs, edition periods and
SHA-256 hashes for the two extracted national files.

- [MESRSI public-university dataset, 2024–2025](https://data.gov.ma/data/fr/dataset/90572d12-5c23-4187-b151-12923a1587ac/resource/fb9c2300-77f7-461c-86a5-9184b00e57d9/download/universites-publiques-2024-2025.xlsx):
  all 165 listed establishments and their 12 universities; French/Arabic names,
  source abbreviations and cities. Student counts, addresses and phone numbers
  are excluded.
- [MESRSI private and partnership universities, 2025–2026](https://www.enssup.gov.ma/storage/enssup%20priv%C3%A9/2025/Liste%20des%20universit%C3%A9s%20priv%C3%A9es%20autoris%C3%A9es%20au%20titre%20de%20l%27ann%C3%A9e%20universitaire%202025-2026.pdf):
  all 12 listed universities and 105 components/annexes. Table page numbers locate
  each record. Repeated invisible page-header text corrupts several extracted
  parent cells; the delimited university groups were reconciled with rendered
  pages, rather than assigning parents from their cities.
- [Al Akhawayn schools](https://aui.ma/) and the
  [SSAH page](https://aui.ma/school-of-social-sciences-arts-and-humanities):
  the university's three schools, including its former SHSS alias.
- [Quaraouiyine organisation, Habous ministry](https://www.habous.gov.ma/مؤسسة-محمد-السادس-للعلماء-الأفارقة/جامعة-القرويين/7244-تعريف-بجامعة-القرويين.html):
  eight named components; Arabic names remain Arabic where no French source was
  supplied. The legal organisation is dated 2015, not presented as a new decree.
- [UH1 current admissions directory](https://preinscription.uh1.ac.ma/preinscription/ER.html),
  [INNIA](https://www.uh1.ac.ma/composantes/sciences-de-leducation-sciences-humaines-et-sociales/institut-national-du-numerique-et-de-lintelligence-artificielle-innia/)
  and [Safi campus](https://fps.uca.ma/): two UH1 additions and five UCA components
  supplement the older national workbook.
- Official INPT, ENSMR and IAV references identify autonomous establishments;
  none receives an invented university parent. The
  [INPT legal notice](https://web.inpt.ac.ma/fr/mentions-l%C3%A9gales-0) explicitly
  identifies its non-university status.

These are versioned source snapshots plus identified supplements, not a claim
that every national establishment is current as of today. Missing translations,
unlisted reorganisations and unsupported abbreviations are not invented. Legal
recognition/accreditation, IRESEN partnership and project participation are separate
questions; this reference establishes no such claims.

## Editorial and search rules

`src/data/institution-names.json` is the small editorial display/variant layer;
`src/data/project-coordinators.json` remains the curated personal-name authority.
`src/lib/names.ts` and `src/lib/institutions.ts` share those explicit replacements.

- Latin personal identities use given name followed by uppercase family name,
  preserving compound surnames and known given/family order. Arabic identities
  remain Arabic. Bibliographic source authors/titles are not rewritten.
- Institutional display uses the full name followed by ` - abbreviation`, with
  French connective words as in the owner's examples. An unsupported acronym is
  omitted. Source spellings remain searchable aliases.
- Standalone GEP becomes Green Energy Park; the filed invention name GEP-PVSMS
  stays intact. The Benguerir city suffix is removed from Green Energy Park. MAScIR variants, including `MAScIR, Rabat`, display as MAScIR.
- Owner corrections: ENSAM Rabat displays as
  `École Nationale Supérieure d’Arts et Métiers de Rabat - ENSAM Rabat` without
  nested duplication; Semlalia displays as `Faculté des Sciences Semlalia - FSSM`;
  `Région Tahala- Agadir -` displays as `Tahala`. The standalone location
  `Ville de Marrakech` displays as `Marrakech` (EN/AR equivalents included);
  narrative sentences mentioning the city are preserved. These are display corrections,
  not edits to the source evidence or PDF bytes. CNESTEN uses its complete
  institutional name followed by ` - CNESTEN`, without parentheses. CNEREE uses the owner-selected
  full name, with its UCA relationship verified on the [official centre site](https://cneree.uca.ma/presentation-cneree/).
- Accents, case, punctuation and common Arabic letter variants are normalised for
  identity matching. A shared acronym such as FST/EST/FS cannot identify a unique
  campus; a city-qualified or otherwise unique identity can.
- `institutionalAffiliations` returns direct establishments and their parent
  universities; `establishmentsForUniversity` supplies the inverse edge. An
  establishment enriches its resource with its university's aliases. A university
  alone never invents a specific establishment's participation, nor does one
  faculty make every sibling faculty a project participant.
- The national registry stays on the server. Projects send only the resolved
  discovery text to the existing catalogue search; the laboratory directory uses
  server-prepared discovery metadata. No national directory, filter, route or
  external link control is added to the interface.
- Static search and the CMS indexer include these aliases only inside existing
  eligible resource projections. The reference corpus itself is not indexed.
  Locale/publication gates, exact-first relevance and withdrawal rules remain.

## Verification ledger — 16 October 2026

Passed: scoped ESLint, changed-file formatting, whitespace, source identity/parent/
provenance consistency, stability of all canonical FR/AR labels and direct display
checks for the owner-reported variants. The source-location audit resolves every
identified university/establishment location in the 60-project source without
assigning locations such as MAScIR or Green Energy Park to a university.

The local index was rebuilt and its final isolated pass processed 68 CMS jobs
plus static synchronisation. The development server was briefly suspended and
resumed around that pass to prevent a previously loaded worker from reindexing
with old metadata. Live local API reads confirm FSSM (one French project), UCA
(five), EMI (two), Université Mohammed V (six), MAScIR (six) and Tahala (one).
FSTS returns one exact project followed by two linguistic matches, preserving
exact-first ranking; Université Hassan 1er finds the directly attached project.
The same FSTS query in EN/AR returns no public projects while translations remain
in review. No project record, locale approval, private source or existing project
PDF is changed by indexing.

The new `names.test.ts` and `institutions.test.ts` cover compound personal names,
canonical stability, ambiguous acronyms, multiple parent universities, inverse
edges, autonomous institutions and owner corrections. They are added as source,
not reported as executed: the shared-checkout hold prevents the test/build/CI
batch until all writers report ready. Production visual review remains pending;
no new filter or layout change remains. Available host Node is 24.19.0/24.21.0,
so those checks are not evidence for the pinned Node 24.22.0 application suite.
