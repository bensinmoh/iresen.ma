# Shared public elements — 2026-10-15

The owner commissions D02 to clean up repeated HTML/CSS roles, following the
shared surtitles: common semantics, sizing, spacing and behavior, with useful
page-specific colors, alignment and composition retained. D05 is separately
marked done on the owner's explicit confirmation; it is not reimplemented here.

## Shared and local responsibilities

| Family                                             | Shared contract / selector                                                                                                      | Context retained                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Section surtitles                                  | Existing `SectionEyebrow`, `[data-section-eyebrow]`                                                                             | Existing tone and centering options                                                        |
| Editorial headings                                 | `Heading`, `[data-ui-heading]`; native h2–h6 rank independent of size                                                           | Color, alignment, reading width, section/card placement and intentional margin adaptations |
| Primary/outline actions                            | Existing native link/button `.button` family; 18px/600, 1.5 leading, 12px gap, 44px minimum, signature corners and shared focus | Tone, outline treatment, width, contextual padding and placement                           |
| Text actions                                       | Native `a[data-ui-link][href]`; 16px/600, 1.5 leading, 12px gap, 44px minimum and nonshrinking 20px arrow                       | Surface-specific color, alignment, underline at rest and layout                            |
| Text/search/select/textarea fields                 | Native `[data-ui-field]`; 16px, 1.5 leading, 56px minimum, 12px/16px padding, signature corners and 2px edge focus              | Labels, borders/surfaces, error state, layout, form data and native handlers               |
| Sections, paired columns, icons, body and metadata | Existing section/gap/type/icon tokens                                                                                           | Actual reading measure, card/list composition and content hierarchy                        |

At a 16px root the heading sizes are section 28–50px, display 32–60px,
mission 28–50px/600, card 18–24px/600, compact 18px/600 and label 14px/600.
Section/display use weight 500; Latin leading is 1.2 for large headings, 1.4
for card/compact and 1.5 for labels. Arabic uses natural tracking and 1.45 leading.
Fluid sizes and rem-based controls grow with enlarged text. Default heading
following space is 16px; existing chapter headers and grid/card grouping retain
their intentional layout spacing. Select caret clearance remains the separate
shared logical rule. Textareas retain a 10rem minimum and native vertical resize.

Use `as` for document structure and `size` for visual hierarchy, for example:

```tsx
<Heading as="h2" size="section" id="section-title">
  {title}
</Heading>
<Heading as="h3" size="card">{card.title}</Heading>
<a data-ui-link href={destination}>{label}<NavigationIcon name="arrow" /></a>
<input data-ui-field id="query" type="search" name="q" />
```

Change typography/control geometry in the shared component, stylesheet or token,
not by reintroducing a font-size copy in each page module. Local CSS can target
native heading ranks or its own classes for placement/color. Shared markers also
allow site-wide audits without relying on hashed CSS-module class names.

## Inventory and boundaries

Heading consumers cover home, Institute/model, Governance/scientific cards and
biographies, roadmap, programmes/call details, platforms, network/map detail,
collaboration, transfer/patents, careers, news/listing, publications, media/dialogs,
contact, search, utilities and generic published-page/list wrappers. Removed
page-level heading metrics include redundant Arabic exceptions; page colors,
alignment, anchors and local arrangement remain.

Text actions cover programme links, collaboration pathways, transfer/patent
links, roadmap secondary actions and news/publication reading links. Text fields
cover contact, careers, laboratory search, patent filters, publication search and
public search/sorting. Checkboxes, radios, file and hidden inputs are excluded.

Existing header/footer navigation, cookie consent, isolated CMS, diagram nodes,
figures, tabs, rail controls and image/card-wide links have distinct functional
roles. They retain their existing shared families and are not forced into an
editorial title/action/field. The technical iSmart illustration label remains a
small illustration caption. Rich-text heading conversion is unchanged. Cards
retain article/list/figure semantics and their content-dependent layouts; no
universal card wrapper, library, client state or dependency is introduced.

Public wording, locale catalogs, canonical routes, assets and search projections
are unchanged. No index rebuild, CMS schema or database operation is required.

## Check ledger

- Node 24.19.0 and pnpm 11.19.0 used for checks.
- Final runtime lint and all 170 unit tests pass. Changed-file formatting and
  Git whitespace checks pass; documentation audit reports no missing scope guide
  (its historical-wording suggestions remain unchanged).
- Final production compilation, TypeScript and page generation pass. Standalone
  packaging remains incomplete: both build attempts warned about disk capacity
  while copying the existing upload corpus (the second attempt also supplied an
  empty build-time upload directory, but tracing still included the default). No
  complete production artifact is claimed. The task-generated build and copied
  uploads were removed afterward; original uploads and earlier builds remain.
- Added a browser regression for all canonical public destinations (aliases
  excluded) in FR/EN/AR at 390/768/1440px, comparing rendered shared roles,
  reflow and enlarged contact-field focus. Execution is **pending**: the host
  rejects headless Chrome with SIGABRT/EPERM before any page opens. Native Chrome
  review was also rejected by the computer-use approval layer ("not approved").
  No screenshot or visual pass is claimed.
- Branch creation was blocked by the read-only `.git` permission in this session.
  No commit, push, PR, CI, merge, deployment or visibility change is claimed.
