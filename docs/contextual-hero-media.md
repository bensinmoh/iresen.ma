# Contextual hero media

The owner's 2026-10-09 refinement selects imagery relevant to each page and removes
the half-photo/half-navy treatment. All hero backgrounds now cover the complete
scene. Four text-placement modes remain: start, end, center and editorial.
The five former split pages use start; utility editorial pages use a neutral
66% dark readability overlay instead of 90% navy. Full-scene cover sizing uses
viewport width, image aspect ratio × viewport height and the existing 75rem guard.

## Current contextual images

| Canonical page  | Current image                                             | Provenance                                      |
| --------------- | --------------------------------------------------------- | ----------------------------------------------- |
| `governance`    | Executive meeting (`governance`)                          | Generated fictional people and office           |
| `opportunities` | Young-adult office onboarding (`careers-onboarding`)      | Generated fictional colleagues and setting      |
| `workWithUs`    | Two professionals shaking hands (`partnership-handshake`) | Generated fictional people and office           |
| `platforms`     | Existing `solar-field` illustration                       | Generated; real Green Energy Park photo pending |
| `institute`     | Existing `solar-sunset` illustration                      | Generated; real IRESEN office photo pending     |

All 17 active photo assets are still generated, with three contextual replacements
and 14 retained images. They do not depict actual IRESEN board members, employees
or premises. The [schema-3 inventory](hero-assets.json) records each source type,
prompt/recipe, native dimensions, hashes, served bytes and mobile crop. The three
new sources are native 1536 × 1024; no upscaling is applied. Current landscape
WebPs total 4,422,882 bytes and mobile crops 2,005,356 bytes; the largest mobile
crop remains 216,272 bytes. These are asset-file totals, not measured route transfers.
The desktop handshake photo is aligned toward the top to keep faces below the
navigation; its mobile portrait keeps centered framing.

The homepage's [original video and photo fallback](heroes.md#homepage-hero-video--2026-10-09),
[mobile hierarchy](mobile-information-hierarchy.md), copy, routes, figures,
certification content, fonts and original SVGs retain their existing rules.

## Documentary photos pending

The owner requests real Green Energy Park imagery for platforms and real IRESEN
offices for institute. Candidates have been identified through
[Green Energy Park](https://greenenergypark.ma/), [IRESEN](https://iresen.org/) and
Wikimedia Commons, but source-file downloads from `greenenergypark.ma`,
`iresen.org` and `upload.wikimedia.org` are blocked by this cloud environment's
network policy. No real photo has been imported or substituted yet.

The office request does not specify Rabat. A possible Green & Smart Building Park
office context in Benguerir remains a sourcing candidate; no location is assigned
to the current generated image. Record the retrieved photograph's exact source,
identified subject, rights/credit, native dimensions and source/output hashes
before describing it as documentary. Location evidence and image provenance
remain separate records.

## Historical evidence

The [initial generated set](hero-assets-generated-2026-10-09.json) retains its
17 sources and former asset records; the [Figma set](hero-assets-figma-2026-10-08.json)
retains the earlier extracted imagery. Prior five-mode screenshots and byte totals
describe those revisions. Current rendered and delivery checks belong in
[the validation log](validation.md).
