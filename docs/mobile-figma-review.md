# Mobile design rules from Figma — 2026-10-15

The owner commissions a review of the mobile Figma design and application of its
shared rules to the current website. This is a responsive refinement: canonical
content, narrative, approved colors, original media, search projections and
publication gates remain authoritative.

## Source reviewed

File: [IRESEN OFFICIAL FILE](https://www.figma.com/design/0go8QANZAH73ed9AoCdHkf/IRESEN-OFFICIAL-FILE?m=dev).
The live page listing returned only `127:1781` (desktop). The retained
[design evidence](references/figma/design-evidence.json) supplied the real mobile
canvas ID `1128:6107`; querying it live confirmed 13 complete 402px page frames,
plus menu, filter, search and component references. Their absence from the initial
page listing does not mean the mobile designs are missing.

Live design context and native renders reviewed:

| Source                                                             | Evidence                                                                                                    | Applied rule                                                                                  |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Home `1479:5838`, hero `1479:5839` / content `1479:5850`           | 32px bold / 38px title, −2% tracking; 20px inset; stacked 50px actions, 12px gap                            | Shared mobile photo-hero title rhythm and full-width stacked actions; retain natural height   |
| Mission introduction `1479:5866`, funding introduction `1479:5922` | 28px bold / 34px title, 14px uppercase overline, 16px following space, 8px leaf gap; 16px editorial gutters | Shared section/display/mission titles, surtitles and mobile content grid                      |
| Figures `1479:5864`                                                | Native-looking horizontal strip, 150px items, 24px gap, 30px values                                         | Compact scrollable figure row showing more than one item, current five sourced figures        |
| Institute `1479:6934`                                              | Stacked editorial blocks and existing history/report patterns                                               | Apply shared hierarchy to current content; preserve commissioned timeline and report behavior |
| Platforms `1479:6343`                                              | 32px hero, narrow editorial content, disclosure-oriented reading                                            | Apply shared type/actions to current platform chapters and their existing native details      |
| Contact `1479:7848`                                                | Single-column contacts/form, 28px section headings and 20px secondary titles                                | Shared hierarchy and existing one-column native form layout                                   |
| Menu `1479:10344`                                                  | White full-screen sheet, 24px inset, grouped navigation, bottom action                                      | Retain implemented sheet, search/locale access and focus behavior; match 24px inset           |
| Footer `1479:5989`                                                 | Single column, 24px inset, 30px group spacing, stacked newsletter controls                                  | Preserve current structure and honest newsletter state; refine gutters and control geometry   |

Large home context was sparse; its visible child nodes were requested separately
before implementation. Reference screenshots are inspection evidence, never public
assets or rendered page substitutes. The original Apex Leaf, brand SVGs, Phosphor
icons and existing photographs/video are reused. No Figma assets are imported.

## Adaptations to current content

- Mobile means at or below 40rem. Tablet/desktop keep their existing shared roles,
  navigation, spacing and page compositions.
- Mobile section/display/mission roles use 28px/34px, weight 700 and −2% Latin
  tracking. Card titles use 20px; compact text follows the 16px editorial role.
  Native heading ranks remain explicit and independent of visual size.
- Surtitles use 14px/21px, regular, 0.1em Latin tracking and an 8px original-leaf
  gap. Homepage brand metadata retains its separate 12px hero-label role.
- Arabic retains natural tracking and 1.45 heading leading. Logical insets,
  native RTL scrolling and directional arrows remain; brand geometry stays physical.
- Body/form/action text remains readable: 16px body/actions and the previously
  selected minimum 18px shared hero description. Source 12–14px descriptions,
  placeholder contacts, old sample figures and historical colors are not adopted.
- Editorial gutters are 16px, home hero/header 20px and menu/footer 24px. Ordinary
  editorial section insets are 48px, adapted from the reference's frequent 56px;
  functional form/map/report/hero geometry remains component-owned.
- Public button actions fill their mobile column and are at least 50px tall.
  Shared hero actions are stacked with 12px gaps, primary blue
  and secondary white. Text can wrap and grow; no fixed-height clipping. The
  redundant mouse scroll hint is omitted on mobile while native anchors remain.
- Figure items use a 150px maximum with native keyboard/touch scrolling, 30px
  values and readable 14px labels. No duplicate figures or auto-scrolling loop.
- Footer links retain at least 44px targets. Newsletter input uses the existing
  10px diagonal action corners. No online subscription service is implied.
- Existing local disclosure/filter/card layouts are retained. The source's
  historic institute/platform compositions do not replace newer owner decisions.

CSS-only changes add no public resource, wording, destination, media or searchable
body; existing localized search references remain and no rebuild is needed.

## Verification ledger

The starting checkout already contained a substantial uncommitted shared-element
refactor, including the new `Heading` component. This pass builds on those local
roles and preserves that work. A private ignored snapshot records the starting
files so the mobile delta remains identifiable.

- Development Chrome: inspected home, Institute, platforms, contact, publications
  and Arabic home at 402×874; no document overflow on these six views.
- Lint: passed.
- Isolated production build `.local/mobile-figma/build`: passed, including TypeScript.
  Next's temporary tsconfig include/format changes were removed after the build.
- Design detector: one existing 3px news note border warning at line 438; unchanged
  by this mobile pass. No detector-driven unrelated visual change.
- Production Chrome: 21 non-alias canonical routes in FR/EN/AR at 320, 402, 640,
  768 and 1440px (315 route/locale/width combinations); no document overflow.
  Shared heading/link/field and surtitle suites add cross-page role checks.
- Production interactions: menu containment/Escape/focus return, localized navigation,
  newsletter availability, section actions, figure keyboard scrolling, reduced
  motion, no-JavaScript and 200% text journeys. Final confirmation passed 44 tests;
  four remaining failures were test-only (polling nonexistent utility surtitles,
  and duplicated rail checking immediately after restoring enlarged text). The
  existing rail suite already covers keyboard access in every locale. Six
  affected journeys were rerun on the unchanged build: **6 passed**. All **48 distinct
  scoped browser tests** therefore pass on the final runtime; no failed browser
  journey remains.
- Production screenshots: inspected FR home/mission/footer/platform/publications,
  Arabic home/mission/contact and EN home/Institute/media at 402×874. Additional
  scoped captures are in ignored `.local/mobile-figma/`.
- Documentation audit: no missing documents; historical keyword candidates remain
  identified as history. No unrelated documentation cleanup.

Native Figma references are French; Arabic layout is an implementation adaptation.
Browser evidence uses local emulated Chromium/Chrome viewports, not physical iOS,
Android or Safari devices. No new deployment, DNS or visibility change.

## Local delivery boundary

No existing owner edits were staged or discarded. This mobile pass depends on the
pre-existing uncommitted `Heading` refactor, so no standalone commit/PR or merge
was created by combining that unrelated work. The exact incremental delta is
preserved in ignored `.local/mobile-figma/mobile-only.patch`; it applies over the
starting local refactor. Remote current-head CI has not run for this uncommitted
result and remains required before integration. The development site continues
to run at `http://localhost:3000/fr`.
