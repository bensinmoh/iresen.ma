# Shared public surtitles — 2026-10-15

The owner selects the homepage surtitles as the site-wide reference. All related
public-page section/hero labels now use `SectionEyebrow`, including Network’s four
labels in the supplied screenshots. Local CSS copies and pseudo-element/Image
leaf duplicates are removed. Institute’s quotation retains its accessible named
region through the same paragraph-label pattern as the homepage. Governance
indices and call-status metadata have explicit distinct class names.

The native shared paragraph has two spans: decorative original Apex Leaf mask and
text. At a 16px root it uses 18px regular text, 27px line height, 1.08px Latin
tracking, no Arabic tracking, uppercase Latin presentation, 12px icon gap and
16px following space. Four existing color roles cover blue, white, cyan and navy;
centering is explicit. Generic page paragraph styling cannot change the shared
role. Fonts scale naturally with root text enlargement. No copy, route, asset,
CMS, search-reference or publication-gate changes are introduced.

## Check ledger

- Lint and 170 unit tests pass.
- First isolated production build/TypeScript passes; homepage and programmes
  checks pass. Public audit passes all 21 canonical destinations in FR/EN/AR at
  390/1440px after waiting for responsive layout stabilization (126 route/width
  checks). It verifies paragraph semantics, size, weight, leading, tracking,
  uppercase, explicit tone, original leaf mask and absence of horizontal overflow.
- Final isolated production build/TypeScript, lint and formatting pass after the
  infrastructure-group labels are included. Eleven final browser journeys pass:
  full public audit plus Network and Platforms (including filters, keyboard,
  200% text, axe and no-JavaScript reading). The earlier three homepage/four
  programmes journeys remain valid for their unchanged final inputs, including
  mission and programme hero centering.
- Surtitle captures for Network, Institute, Programmes, Contact, Media and News,
  plus full platform/network layouts, are inspected. The audit waits for shared
  responsive resize handling before asserting absence of page overflow.
- No deployment, DNS/visibility or public/CMS gate changes.
